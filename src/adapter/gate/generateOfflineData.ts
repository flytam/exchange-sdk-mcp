import * as cheerio from "cheerio";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { Project, Node, Type } from "ts-morph";
import { writeFileSync } from "fs";
// 生成检索数据
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gateApiUrl = "https://www.gate.com/docs/developers/apiv4/zh_CN/";
const methodEndpoint =
  "https://raw.githubusercontent.com/tiagosiebler/gateio-api/refs/heads/master/docs/endpointFunctionList.md";
const readme =
  "https://raw.githubusercontent.com/tiagosiebler/gateio-api/refs/heads/master/README.md";

const getReadme = async () => {
  console.log("Gate: 开始获取README文件...");
  try {
    const res = await fetch(readme);
    const text = await res.text();
    console.log("Gate: README文件获取成功");
    return text;
  } catch (error) {
    console.error("Gate: 获取README文件失败:", error);
    throw error;
  }
};

export const getMethodEndpointMap = async () => {
  console.log("Gate: 开始获取方法与端点映射...");
  const res = await fetch(methodEndpoint);
  const text = await res.text();
  console.log("Gate: 成功获取端点列表文档");

  // 可选：裁剪出只包含 Endpoint 表格的部分
  const tableStart = text.indexOf("| Function");
  const tableEnd = text.indexOf("\n\n", tableStart);
  const methodEndpointContent = text.slice(tableStart, tableEnd);

  const map: Record<string, [string, string]> = {};

  const lines = methodEndpointContent.split("\n");
  const rowRegex =
    /^\|\s*\[(\w+)\(\)\]\([^)]+\)\s*\|\s*[^|]*\|\s*(GET|POST|DELETE|PUT|PATCH)\s*\|\s*`([^`]+)`\s*\|/;

  let matchCount = 0;
  for (const line of lines) {
    const match = rowRegex.exec(line);
    if (match) {
      const [, functionName, httpMethod, endpoint] = match;
      map[functionName] = [httpMethod, endpoint];
      matchCount++;
    }
  }

  console.log(`Gate: 成功解析 ${matchCount} 个方法与端点的映射关系`);
  return map;
};

export const getEndPointDoc = async () => {
  // 获取当前文件的目录路径
  console.log("Gate: 开始从HTML文件中提取API端点文档...");
  const htmlFilePath = path.resolve(__dirname, "./apiHtmlText.html");

  try {
    const text = await readFile(htmlFilePath, "utf-8");
    console.log("Gate: 成功读取HTML文件");

    // 加载 HTML 到 cheerio
    const $ = cheerio.load(text);
    console.log("Gate: 成功解析HTML内容");

    const result: Record<string, string> = {};
    const startMethods = ["GET", "POST", "DELETE", "PUT", "PATCH"];

    // 遍历每个 content-block__cont 元素
    const contentBlocks = $(".content-block__cont");
    console.log(`Gate: 找到 ${contentBlocks.length} 个内容块进行处理`);

    let processedCount = 0;
    contentBlocks.each((index, el) => {
      const $el = $(el);
      const codeTags = $el.find("code");

      for (let i = 0; i < codeTags.length; i++) {
        const codeText = $(codeTags[i]).text().trim();

        if (
          codeText &&
          startMethods.some((method) => codeText.startsWith(method)) &&
          codeText.includes("/")
        ) {
          const fullText = $el.text().trim();
          result[codeText] = fullText;
          processedCount++;
          break;
        }
      }

      // 每处理50个块输出一次进度
      if ((index + 1) % 50 === 0) {
        console.log(
          `Gate: 已处理 ${index + 1}/${contentBlocks.length} 个内容块...`,
        );
      }
    });

    console.log(`Gate: 成功从HTML文件中提取了 ${processedCount} 个API端点文档`);
    return result;
  } catch (error) {
    console.error(`Gate: 无法读取HTML文件: ${htmlFilePath}`);
    console.error(
      `Gate: 请确保您已从Gate API文档网站(${gateApiUrl})下载HTML内容并保存到上述路径`,
    );
    console.error(`Gate: 错误详情:`, error);
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
      name: type.getText(),
      properties,
    };
  }

  return {
    kind: "other",
    text: type.getText(),
  };
}

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
  console.log("Gate: 开始从.d.ts文件中提取方法定义...");
  const dtsPath = path.resolve(
    "node_modules/gateio-api/dist/mjs/RestClient.d.ts",
  );

  try {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(dtsPath);
    console.log(`Gate: 成功加载类型定义文件: ${dtsPath}`);

    const resultMap: Record<string, any> = {};
    const classes = sourceFile.getClasses();
    console.log(`Gate: 找到 ${classes.length} 个类进行处理`);

    let methodCount = 0;
    classes.forEach((cls) => {
      const className = cls.getName() || "UnknownClass";
      console.log(`Gate: 处理类 ${className}...`);

      const methods = cls.getMethods();
      console.log(`Gate: 在类 ${className} 中找到 ${methods.length} 个方法`);

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
          let paramComment: any = "";

          jsDocs.forEach((doc) => {
            doc.getTags().forEach((tag) => {
              if (
                tag.getTagName() === "param" &&
                tag.getText().startsWith(paramName)
              ) {
                paramComment = tag.getComment() || "";
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
        let returnComment: any = "";

        jsDocs.forEach((doc) => {
          doc.getTags().forEach((tag) => {
            if (["return", "returns"].includes(tag.getTagName())) {
              returnComment = tag.getComment() || "";
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

    console.log(`Gate: 成功从.d.ts文件中提取了 ${methodCount} 个方法定义`);
    return resultMap;
  } catch (error) {
    console.error(`Gate: 处理.d.ts文件时出错: ${dtsPath}`);
    console.error(`Gate: 错误详情:`, error);
    throw error; // 重新抛出错误，因为这是关键步骤
  }
};

export const generateOfflineData = async () => {
  console.log("Gate: 开始生成离线数据...");
  console.log("Gate: 并行获取所有必要数据...");

  try {
    const [methodEndpointMap, endPointDocMap, methodDtsInfoMap, readme] =
      await Promise.all([
        getMethodEndpointMap(),
        getEndPointDoc(),
        extractMethodMapFromDts(),
        getReadme(),
      ]);

    console.log("Gate: 所有数据获取完成，开始整合数据...");
    console.log(
      `Gate: 方法端点映射: ${Object.keys(methodEndpointMap).length} 个方法`,
    );
    console.log(`Gate: 端点文档: ${Object.keys(endPointDocMap).length} 个文档`);
    console.log(
      `Gate: 方法定义: ${Object.keys(methodDtsInfoMap).length} 个方法`,
    );
    console.log("Gate: README 获取成功");

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

    console.log(`Gate: 数据整合完成:`);
    console.log(`Gate: - 成功匹配文档的方法: ${matchedDocs} 个`);
    console.log(`Gate: - 缺少文档的方法: ${missingDocs} 个`);
    console.log(
      `Gate: - 总方法数: ${Object.keys(offlineData.methods).length} 个`,
    );

    return offlineData;
  } catch (error) {
    console.error("Gate: 生成离线数据时出错:", error);
    throw error;
  }
};

console.log("Gate: 开始执行离线数据生成流程...");
generateOfflineData()
  .then((res) => {
    const outputPath = path.join(__dirname, "./gate-offlineData.json");
    writeFileSync(outputPath, JSON.stringify(res, null, 2));
    console.log(`Gate: 离线数据已成功生成并保存到: ${outputPath}`);
    console.log(
      `Gate: 数据大小: ${(JSON.stringify(res).length / 1024).toFixed(2)} KB`,
    );
  })
  .catch((error) => {
    console.error("Gate: 生成离线数据失败:", error);
  });
