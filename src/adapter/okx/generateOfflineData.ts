import * as cheerio from "cheerio";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { Project, Node, Type } from "ts-morph";
import { writeFileSync } from "fs";
// 生成检索数据
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const okxApiUrl = "https://www.okx.com/docs-v5/zh/#overview";
const methodEndpoint =
  "https://raw.githubusercontent.com/tiagosiebler/okx-api/refs/heads/master/docs/endpointFunctionList.md";

export const getMethodEndpointMap = async () => {
  const res = await fetch(methodEndpoint);
  const text = await res.text();
  // 可选：裁剪出只包含 Endpoint 表格的部分
  const tableStart = text.indexOf("| Function");
  const tableEnd = text.indexOf("\n\n", tableStart);
  const methodEndpointContent = text.slice(tableStart, tableEnd);

  const map: Record<string, [string, string]> = {};

  const lines = methodEndpointContent.split("\n");
  const rowRegex =
    /^\|\s*\[(\w+)\(\)\]\([^)]+\)\s*\|\s*[^|]*\|\s*(GET|POST|DELETE|PUT|PATCH)\s*\|\s*`([^`]+)`\s*\|/;

  for (const line of lines) {
    const match = rowRegex.exec(line);
    if (match) {
      const [, functionName, httpMethod, endpoint] = match;
      map[functionName] = [httpMethod, endpoint];
    }
  }

  return map;
};

export const getEndPointDoc = async () => {
  // 获取当前文件的目录路径
  console.log("OKX: 开始从HTML文件中提取API端点文档...");
  const htmlFilePath = path.resolve(__dirname, "./apiHtmlText.html");

  try {
    const text = await readFile(htmlFilePath, "utf-8");
    console.log("OKX: 成功读取HTML文件");

    // 加载 HTML 到 cheerio
    const $ = cheerio.load(text);

    const result: Record<string, string> = {};
    const startMethods = ["GET", "POST", "DELETE", "PUT", "PATCH"];

    // 查找所有h3标签，作为分块的起始点
    const h3Elements = $("h3");
    console.log(`OKX: 找到${h3Elements.length}个h3标签作为分块起始点`);

    // 遍历每个h3元素
    let successfulExtractions = 0;
    h3Elements.each((index, h3Element) => {
      const $h3 = $(h3Element);
      const h3Text = $h3.text().trim();
      let blockContent = h3Text; // 开始收集块内容，从h3标题开始

      if (index % 20 === 0) {
        console.log(
          `OKX: 正在处理第${index + 1}/${h3Elements.length}个h3块...`,
        );
      }

      // 获取h3后面的所有元素，直到下一个h3
      let nextElement = $h3.next();
      while (nextElement.length && !nextElement.is("h3")) {
        blockContent += "\n" + nextElement.text().trim();

        // 检查当前元素中是否包含API端点
        const elementText = nextElement.text().trim();

        // 尝试多种方式匹配API端点

        // 方法1: 使用精确的正则表达式匹配标准格式
        // 匹配格式: GET /api/v5/market/tickers 或 POST /api/v5/trade/order 等
        // 支持更复杂的路径参数，如 /api/v5/account/{currency}/balance
        const apiEndpointRegex1 = new RegExp(
          `(${startMethods.join("|")})[\\s]+(/api/v\\d+/[\\w\\-/{}]+)`,
          "i",
        );
        let match = elementText.match(apiEndpointRegex1);
        if (match) console.log("OKX: 方法1匹配成功:", match[0]);

        // 方法2: 匹配可能带有代码格式的端点
        // 例如: `GET /api/v5/market/tickers`
        if (!match) {
          const apiEndpointRegex2 = new RegExp(
            `\`(${startMethods.join("|")})[\\s]+(/api/v\\d+/[\\w\\-/{}]+)\``,
            "i",
          );
          match = elementText.match(apiEndpointRegex2);
          if (match) console.log("OKX: 方法2匹配成功:", match[0]);
        }

        // 方法3: 匹配可能带有其他格式的端点
        // 例如: "GET /api/v5/market/tickers"
        if (!match) {
          const apiEndpointRegex3 = new RegExp(
            `["'](${startMethods.join("|")})[\\s]+(/api/v\\d+/[\\w\\-/{}]+)["']`,
            "i",
          );
          match = elementText.match(apiEndpointRegex3);
          if (match) console.log("OKX: 方法3匹配成功:", match[0]);
        }

        // 方法4: 直接搜索文本中的API路径
        if (!match) {
          for (const method of startMethods) {
            if (
              elementText.includes(method) &&
              elementText.includes("/api/v5/")
            ) {
              // 尝试提取路径
              const methodIndex = elementText.indexOf(method);
              // 确保在方法名后面查找API路径
              const apiIndex = elementText.indexOf("/api/v5/", methodIndex);

              if (apiIndex > -1 && apiIndex - methodIndex < 20) {
                // 确保方法名和路径之间的距离合理
                // 提取路径（假设路径结束于空格、引号、反引号或其他非路径字符）
                let endIndex = apiIndex;
                while (endIndex < elementText.length) {
                  // 如果遇到分隔符或换行符，则停止
                  if (
                    /[\s"'`<>()\[\]{}]/.test(elementText[endIndex]) ||
                    elementText[endIndex] === "\n"
                  ) {
                    break;
                  }
                  endIndex++;
                }

                const endpoint = elementText.substring(apiIndex, endIndex);
                console.log("OKX: 尝试提取路径:", endpoint);

                if (endpoint.length > 8) {
                  // 确保路径长度合理
                  // 创建一个类似于正则匹配的结果数组
                  match = [
                    elementText.substring(methodIndex, endIndex), // 完整匹配
                    method, // 方法
                    endpoint, // 端点
                  ];
                  console.log("OKX: 方法4匹配成功:", match[0]);
                  break;
                }
              }
            }
          }
        }

        if (match) {
          try {
            // 确定匹配组的索引（根据正则表达式的不同可能会有变化）
            let httpMethod, endpoint;

            if (match.length >= 3) {
              // 正常的正则匹配结果
              httpMethod = match[1];
              endpoint = match[2];
            } else if (match.length === 2) {
              // 可能是自定义匹配结果
              console.log("OKX: 警告: 匹配结果格式异常，尝试使用备选逻辑");
              const parts = match[0].split(/\s+/);
              if (parts.length >= 2) {
                httpMethod = parts[0];
                endpoint = parts[1];
              }
            }

            // 清理和验证提取的值
            if (httpMethod && endpoint) {
              // 清理HTTP方法（移除可能的引号、反引号等）
              httpMethod = httpMethod.replace(/["'`]/g, "").trim();

              // 清理端点（移除可能的引号、反引号等）
              endpoint = endpoint.replace(/["'`]/g, "").trim();

              // 验证提取的值是否有效
              let isValid = true;

              // 验证HTTP方法是否有效
              if (!startMethods.includes(httpMethod.toUpperCase())) {
                console.log(`OKX: 警告: 无效的HTTP方法 ${httpMethod}，跳过`);
                isValid = false;
              }

              // 验证端点是否有效
              if (isValid && !endpoint.startsWith("/api/")) {
                console.log(`OKX: 警告: 无效的端点 ${endpoint}，跳过`);
                isValid = false;
              }

              // 只有当值有效时才处理
              if (isValid) {
                const key = `${httpMethod.toUpperCase()} ${endpoint}`;

                // 如果已经存在相同的键，检查哪个内容更完整
                if (!result[key] || blockContent.length > result[key].length) {
                  result[key] = blockContent;
                  successfulExtractions++;
                  console.log(`OKX: 成功提取到API端点: ${key}`);
                }
              }
            } else {
              console.log("OKX: 警告: 无法从匹配结果中提取HTTP方法和端点");
            }
          } catch (error) {
            console.error("OKX: 处理匹配结果时出错:", error);
          }
        }

        nextElement = nextElement.next();
      }
    });

    console.log(`OKX: 文档处理完成:`);
    console.log(`OKX: - 处理的h3块总数: ${h3Elements.length} 个`);
    console.log(`OKX: - 成功提取的API端点: ${successfulExtractions} 个`);
    console.log(`OKX: - 最终提取的唯一端点: ${Object.keys(result).length} 个`);
    return result;
  } catch (error) {
    console.error(`OKX: 无法读取HTML文件: ${htmlFilePath}`);
    console.error(
      `OKX: 请确保您已从OKX API文档网站(${okxApiUrl})下载HTML内容并保存到上述路径`,
    );
    console.error(`OKX: 错误详情:`, error);
    return {}; // 返回空对象，以便程序可以继续运行
  }
};

/**
 * 解析类型结构
 */
function parseType(type: Type, visited = new Set<string>()): any {
  if (type.isString()) return { kind: "string" };
  if (type.isNumber()) return { kind: "number" };
  if (type.isBoolean()) return { kind: "boolean" };
  if (type.isNull()) return { kind: "null" };
  if (type.isUndefined()) return { kind: "undefined" };
  if (type.isAny()) return { kind: "any" };
  if (type.isUnknown()) return { kind: "unknown" };

  if (type.isArray()) {
    return {
      kind: "array",
      elementType: parseType(type.getArrayElementTypeOrThrow(), visited),
    };
  }

  if (type.isUnion()) {
    return {
      kind: "union",
      types: type.getUnionTypes().map((t) => parseType(t, visited)),
    };
  }

  if (type.isIntersection()) {
    return {
      kind: "intersection",
      types: type.getIntersectionTypes().map((t) => parseType(t, visited)),
    };
  }

  const typeArguments = type.getTypeArguments();
  if (typeArguments.length > 0) {
    const symbol = type.getSymbol();
    const typeName = symbol ? symbol.getName() : type.getText();
    return {
      kind: "generic",
      name: typeName,
      typeArguments: typeArguments.map((t) => parseType(t, visited)),
    };
  }

  if (type.isObject() && !type.isArray()) {
    const symbol = type.getSymbol();
    if (symbol) {
      const fullName = symbol.getFullyQualifiedName();
      if (visited.has(fullName)) return { kind: "reference", name: fullName };
      visited.add(fullName);

      const declarations = symbol.getDeclarations();
      if (declarations.length > 0) {
        const decl = declarations[0];
        if (
          Node.isInterfaceDeclaration(decl) ||
          Node.isTypeAliasDeclaration(decl) ||
          Node.isClassDeclaration(decl)
        ) {
          const properties = type.getProperties().map((prop) => {
            const propType = prop.getTypeAtLocation(
              prop.getValueDeclarationOrThrow(),
            );
            return {
              name: prop.getName(),
              type: parseType(propType, visited),
              optional: prop.isOptional?.() ?? false,
            };
          });
          return {
            kind: "object",
            name: symbol.getName(),
            properties,
          };
        }
      }
    }

    const properties = type.getProperties().map((prop) => {
      let propType;
      try {
        const valueDeclaration = prop.getValueDeclaration();
        if (valueDeclaration) {
          propType = prop.getTypeAtLocation(valueDeclaration);
        } else {
          // 如果无法获取值声明，使用any类型
          return {
            name: prop.getName(),
            type: { kind: "any" },
            optional: prop.isOptional?.() ?? false,
          };
        }
      } catch (error) {
        // 捕获可能的错误并使用any类型
        console.error(`处理属性 ${prop.getName()} 时出错:`, error);
        return {
          name: prop.getName(),
          type: { kind: "any" },
          optional: prop.isOptional?.() ?? false,
        };
      }
      return {
        name: prop.getName(),
        type: parseType(propType, visited),
        optional: prop.isOptional?.() ?? false,
      };
    });

    return {
      kind: "object",
      name: type.getText(),
      properties,
    };
  }

  return {
    kind: "other",
    text: type.getText(),
  };
}

const readme =
  "https://raw.githubusercontent.com/tiagosiebler/okx-api/refs/heads/master/README.md";
const getReadme = async () => {
  console.log("OKX: 开始获取README文件...");
  try {
    const res = await fetch(readme);
    const text = await res.text();
    console.log("OKX: README文件获取成功");
    return text;
  } catch (error) {
    console.error("OKX: 获取README文件失败:", error);
    throw error;
  }
};

/**
 * 提取方法定义并返回 map，key 为 methodName，value 为对应结构体
 */
export const extractMethodMapFromDts = async (): Promise<
  Record<
    string,
    {
      className: string;
      methodName: string;
      methodComment: string;
      params: { name: string; type: any; comment: string }[];
      returnType: any;
      returnComment: string;
    }
  >
> => {
  console.log("OKX: 开始从.d.ts文件中提取方法定义...");
  const dtsPath = path.resolve("node_modules/okx-api/lib/rest-client.d.ts");

  try {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(dtsPath);
    console.log(`OKX: 成功加载类型定义文件: ${dtsPath}`);

    const resultMap: Record<string, any> = {};
    const classes = sourceFile.getClasses();
    console.log(`OKX: 找到 ${classes.length} 个类进行处理`);

    let methodCount = 0;
    classes.forEach((cls) => {
      const className = cls.getName() || "UnknownClass";
      console.log(`OKX: 处理类 ${className}...`);

      const methods = cls.getMethods();
      console.log(`OKX: 在类 ${className} 中找到 ${methods.length} 个方法`);

      methods.forEach((method) => {
        const methodName = method.getName();
        const jsDocs = method.getJsDocs();

        const methodComment = jsDocs
          .map((doc) => doc.getComment())
          .filter(Boolean)
          .join("\n");

        const params = method.getParameters().map((param) => {
          const paramName = param.getName();
          const paramType = param.getType();
          let paramComment = "";

          jsDocs.forEach((doc) => {
            doc.getTags().forEach((tag) => {
              if (
                tag.getTagName() === "param" &&
                tag.getText().startsWith(paramName)
              ) {
                const comment = tag.getComment();
                paramComment =
                  typeof comment === "string"
                    ? comment
                    : Array.isArray(comment)
                      ? comment.map((c) => c?.getText?.() || "").join("")
                      : "";
              }
            });
          });

          return {
            name: paramName,
            type: parseType(paramType),
            comment: paramComment,
          };
        });

        const returnType = method.getReturnType();
        let returnComment = "";

        jsDocs.forEach((doc) => {
          doc.getTags().forEach((tag) => {
            if (["return", "returns"].includes(tag.getTagName())) {
              const comment = tag.getComment();
              returnComment =
                typeof comment === "string"
                  ? comment
                  : Array.isArray(comment)
                    ? comment.map((c) => c?.getText?.() || "").join("")
                    : "";
            }
          });
        });

        resultMap[methodName] = {
          className,
          methodName,
          methodComment,
          params,
          returnType: parseType(returnType),
          returnComment,
        };
        methodCount++;
      });
    });

    console.log(`OKX: 成功从.d.ts文件中提取了 ${methodCount} 个方法定义`);
    return resultMap;
  } catch (error) {
    console.error(`OKX: 处理.d.ts文件时出错: ${dtsPath}`);
    console.error(`OKX: 错误详情:`, error);
    throw error; // 重新抛出错误，因为这是关键步骤
  }
};

export const generateOfflineData = async () => {
  console.log("OKX: 开始生成离线数据...");
  console.log("OKX: 并行获取所有必要数据...");

  try {
    const [methodEndpointMap, endPointDocMap, methodDtsInfoMap, readme] =
      await Promise.all([
        getMethodEndpointMap(),
        getEndPointDoc(),
        extractMethodMapFromDts(),
        getReadme(),
      ]);

    console.log("OKX: 所有数据获取完成，开始整合数据...");
    console.log(
      `OKX: 方法端点映射: ${Object.keys(methodEndpointMap).length} 个方法`,
    );
    console.log(`OKX: 端点文档: ${Object.keys(endPointDocMap).length} 个文档`);
    console.log(
      `OKX: 方法定义: ${Object.keys(methodDtsInfoMap).length} 个方法`,
    );
    console.log("OKX: README 获取成功");

    const offlineData: {
      methods: Record<
        string,
        {
          doc: string;
          methodInfo: any;
        }
      >;
      readme: string;
      example: string[];
    } = {
      methods: {},
      readme: readme,
      example: [],
    };

    let matchedDocs = 0;
    let missingDocs = 0;

    Object.keys(methodEndpointMap).forEach((method) => {
      const [httpMethod, endpoint] = methodEndpointMap[method];
      const key = `${httpMethod} ${endpoint}`;
      const hasDoc = !!endPointDocMap[key];

      offlineData.methods[method] = {
        doc: endPointDocMap[key] || "",
        methodInfo: methodDtsInfoMap[method],
      };

      if (hasDoc) {
        matchedDocs++;
      } else {
        missingDocs++;
      }
    });

    console.log(`OKX: 数据整合完成:`);
    console.log(`OKX: - 成功匹配文档的方法: ${matchedDocs} 个`);
    console.log(`OKX: - 缺少文档的方法: ${missingDocs} 个`);
    console.log(
      `OKX: - 总方法数: ${Object.keys(offlineData.methods).length} 个`,
    );

    return offlineData;
  } catch (error) {
    console.error("OKX: 生成离线数据时出错:", error);
    throw error;
  }
};

console.log("OKX: 开始执行离线数据生成流程...");
generateOfflineData()
  .then((res) => {
    const outputPath = path.join(__dirname, "./okx-offlineData.json");
    writeFileSync(outputPath, JSON.stringify(res, null, 2));
    console.log(`OKX: 离线数据已成功生成并保存到: ${outputPath}`);
    console.log(
      `OKX: 数据大小: ${(JSON.stringify(res).length / 1024).toFixed(2)} KB`,
    );
  })
  .catch((error) => {
    console.error("OKX: 生成离线数据失败:", error);
  });
