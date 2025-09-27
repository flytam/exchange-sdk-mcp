import { Project, Node, Type } from "ts-morph";
import path from "path";
import { readdir, readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { writeFileSync } from "fs";

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
    let typeName = symbol ? symbol.getName() : type.getText();

    // 处理导入路径，移除绝对路径前缀
    if (typeName.includes('import("')) {
      const match = typeName.match(/import\(".*?"\)\.(\w+)/);
      if (match && match[1]) {
        typeName = match[1];
      }
    } else if (
      typeName.startsWith('"') &&
      typeName.includes("/node_modules/")
    ) {
      // 处理直接以引号包裹的绝对路径格式
      const match = typeName.match(/".*\/node_modules\/.*\/([^"]+)"/);
      if (match && match[1]) {
        // 提取最后一个组件（通常是类型名称）
        const parts = match[1].split(".");
        typeName = parts[parts.length - 1];
      }
    }

    return {
      kind: "generic",
      name: typeName,
      typeArguments: typeArguments.map((t) => parseType(t, visited)),
    };
  }

  if (type.isObject() && !type.isArray()) {
    const symbol = type.getSymbol();
    if (symbol) {
      let fullName = symbol.getFullyQualifiedName();

      // 处理 reference 类型中可能存在的绝对路径
      if (fullName.includes('import("')) {
        // 提取导入路径中的实际类型名称
        const importMatch = fullName.match(
          /import\(".*"\)\.(([\w\d_]+)(\<.*\>)?)/,
        );
        if (importMatch && importMatch[1]) {
          fullName = importMatch[1];
        }
      } else if (
        fullName.startsWith('"') &&
        fullName.includes("/node_modules/")
      ) {
        // 处理直接以引号包裹的绝对路径格式
        const match = fullName.match(/".*\/node_modules\/.*\/([^"]+)"/);
        if (match && match[1]) {
          // 提取最后一个组件（通常是类型名称）
          const parts = match[1].split(".");
          fullName = parts[parts.length - 1];
        }
      }

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
            let propType;
            try {
              // 尝试获取值声明
              const valueDeclaration = prop.getValueDeclaration();
              if (valueDeclaration) {
                propType = prop.getTypeAtLocation(valueDeclaration);
              } else {
                // 对于没有值声明的属性（如内置类型的 length 属性），获取声明
                const declarations = prop.getDeclarations();
                if (declarations && declarations.length > 0) {
                  propType = prop.getTypeAtLocation(declarations[0]);
                } else {
                  // 如果没有声明，返回 any 类型
                  return {
                    name: prop.getName(),
                    type: { kind: "any", error: "No declarations found" },
                    optional: prop.isOptional?.() ?? false,
                  };
                }
              }
            } catch (error) {
              // 如果获取类型失败，使用 any 类型
              return {
                name: prop.getName(),
                type: { kind: "any", error: String(error) },
                optional: prop.isOptional?.() ?? false,
              };
            }

            return {
              name: prop.getName(),
              type: parseType(propType, visited),
              optional: prop.isOptional?.() ?? false,
            };
          });
          // 处理类型名称，移除绝对路径前缀
          let typeName = symbol.getName();
          if (typeName.includes('import("')) {
            const match = typeName.match(/import\(".*?"\)\.(\w+)/);
            if (match && match[1]) {
              typeName = match[1];
            }
          } else if (
            typeName.startsWith('"') &&
            typeName.includes("/node_modules/")
          ) {
            // 处理直接以引号包裹的绝对路径格式
            const match = typeName.match(/".*\/node_modules\/.*\/([^"]+)"/);
            if (match && match[1]) {
              // 提取最后一个组件（通常是类型名称）
              const parts = match[1].split(".");
              typeName = parts[parts.length - 1];
            }
          }

          return {
            kind: "object",
            name: typeName,
            properties,
          };
        }
      }
    }

    const properties = type.getProperties().map((prop) => {
      let propType;
      try {
        // 尝试获取值声明
        const valueDeclaration = prop.getValueDeclaration();
        if (valueDeclaration) {
          propType = prop.getTypeAtLocation(valueDeclaration);
        } else {
          // 对于没有值声明的属性（如内置类型的 length 属性），获取声明
          const declarations = prop.getDeclarations();
          if (declarations && declarations.length > 0) {
            propType = prop.getTypeAtLocation(declarations[0]);
          } else {
            // 如果没有声明，返回 any 类型
            return {
              name: prop.getName(),
              type: { kind: "any", error: "No declarations found" },
              optional: prop.isOptional?.() ?? false,
            };
          }
        }
      } catch (error) {
        // 如果获取类型失败，使用 any 类型
        return {
          name: prop.getName(),
          type: { kind: "any", error: String(error) },
          optional: prop.isOptional?.() ?? false,
        };
      }

      return {
        name: prop.getName(),
        type: parseType(propType, visited),
        optional: prop.isOptional?.() ?? false,
      };
    });

    // 处理类型名称，移除绝对路径前缀
    let typeName = type.getText();
    if (typeName.includes('import("')) {
      const match = typeName.match(/import\(".*?"\)\.(\w+)/);
      if (match && match[1]) {
        typeName = match[1];
      }
    }

    return {
      kind: "object",
      name: typeName,
      properties,
    };
  }

  // 处理 other 类型中可能存在的绝对路径
  let typeText = type.getText();
  if (typeText.includes('import("')) {
    // 提取导入路径中的实际类型名称
    const importMatch = typeText.match(/import\(".*"\)\.(([\w\d_]+)(\<.*\>)?)/);
    if (importMatch && importMatch[1]) {
      typeText = importMatch[1];
    }
  } else if (typeText.startsWith('"') && typeText.includes("/node_modules/")) {
    // 处理直接以引号包裹的绝对路径格式
    const match = typeText.match(/".*\/node_modules\/.*\/([^"]+)"/);
    if (match && match[1]) {
      // 提取最后一个组件（通常是类型名称）
      const parts = match[1].split(".");
      typeText = parts[parts.length - 1];
    }
  }

  return {
    kind: "other",
    text: typeText,
  };
}

const methodEndpoint =
  "https://raw.githubusercontent.com/tiagosiebler/bybit-api/refs/heads/master/docs/endpointFunctionList.md";

const readme =
  "https://raw.githubusercontent.com/tiagosiebler/bybit-api/refs/heads/master/README.md";

const getReadme = async () => {
  const res = await fetch(readme);
  const text = await res.text();
  return text;
};

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
  console.log("Bybit: 开始从.d.ts文件中提取方法定义...");
  const dtsPath = path.resolve(
    "node_modules/bybit-api/lib/rest-client-v5.d.ts",
  );
  console.log(`Bybit: 使用类型定义文件: ${dtsPath}`);

  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(dtsPath);

  const resultMap: Record<string, any> = {};

  // 查找 RestClientV5 类
  const classes = sourceFile.getClasses();
  console.log(`Bybit: 找到 ${classes.length} 个类进行处理`);

  let methodCount = 0;
  for (const classDeclaration of classes) {
    const className = classDeclaration.getName() || "";

    // 只处理 RestClientV5 类
    if (className === "RestClientV5") {
      console.log(`Bybit: 处理 RestClientV5 类...`);
      // 获取类中的所有方法
      const methods = classDeclaration.getMethods();
      console.log(`Bybit: 在 RestClientV5 类中找到 ${methods.length} 个方法`);

      for (const method of methods) {
        const methodName = method.getName();

        // 跳过私有方法和构造函数
        if (methodName.startsWith("_") || methodName === "constructor") {
          continue;
        }

        // 提取方法注释
        const jsDocs = method.getJsDocs();
        let methodComment = "";
        if (jsDocs.length > 0) {
          methodComment = jsDocs[0].getDescription().trim();
        }

        // 提取参数信息
        const parameters = method.getParameters();
        const params = parameters.map((param) => {
          const paramName = param.getName();
          const paramType = param.getType();

          // 提取参数注释
          let paramComment = "";
          const paramJsDoc =
            jsDocs.length > 0
              ? jsDocs[0]
                  .getTags()
                  .find(
                    (tag) =>
                      tag.getTagName() === "param" &&
                      tag.getCommentText()?.includes(paramName),
                  )
              : null;

          if (paramJsDoc) {
            paramComment = paramJsDoc.getCommentText() || "";
            // 移除参数名部分，只保留注释
            const commentParts = paramComment.split(" ");
            if (commentParts.length > 1) {
              paramComment = commentParts.slice(1).join(" ");
            }
          }

          return {
            name: paramName,
            type: parseType(paramType),
            comment: paramComment,
          };
        });

        // 提取返回类型
        const returnType = method.getReturnType();

        // 提取返回类型注释
        let returnComment = "";
        const returnJsDoc =
          jsDocs.length > 0
            ? jsDocs[0]
                .getTags()
                .find(
                  (tag) =>
                    tag.getTagName() === "returns" ||
                    tag.getTagName() === "return",
                )
            : null;

        if (returnJsDoc) {
          returnComment = returnJsDoc.getCommentText() || "";
        }

        // 将提取的信息存入结果 map
        resultMap[methodName] = {
          className,
          methodName,
          methodComment,
          params,
          returnType: parseType(returnType),
          returnComment,
        };
        methodCount++;
      }
    }
  }

  console.log(`Bybit: 成功从.d.ts文件中提取了 ${methodCount} 个方法定义`);
  return resultMap;
};

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getEndPointDoc = async () => {
  console.log("Bybit: 开始从文档中提取API端点文档...");
  const result: Record<string, string> = {};
  const endpointResult: Record<string, string> = {}; // 新增：存储以端点为键的结果
  const methodToEndpointMap: Record<string, string> = {}; // 新增：方法名到端点的映射
  const docsDir = path.resolve(__dirname, "./bybit-docs/v5");
  console.log(`Bybit: 使用文档目录: ${docsDir}`);

  // 递归遍历目录，查找所有 .mdx 文件
  const findMdxFiles = async (dir: string): Promise<string[]> => {
    const entries = await readdir(dir, { withFileTypes: true });
    console.log(`Bybit: 在目录 ${dir} 中找到 ${entries.length} 个条目`);
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        return entry.isDirectory()
          ? findMdxFiles(fullPath)
          : entry.name.endsWith(".mdx")
            ? [fullPath]
            : [];
      }),
    );
    return files.flat();
  };

  // 从文件内容中提取方法名、端点和文档内容
  const extractMethodInfo = (
    content: string,
  ): [string, string, string | null][] => {
    const methodMatches: [string, string, string | null][] = [];

    // 直接从文档中提取 HTTP 请求信息
    // 匹配 HTTP 请求部分后面的 HTTP 方法和路径
    // 支持多种格式：
    // 1. ### HTTP請求\nGET `/v5/spread/execution/list`
    // 2. ### HTTP請求\nPOST `/v5/order/create`
    // 3. ### HTTP 請求\nGET `/v5/account/wallet-balance` (注意中间有空格)
    const httpRequestSection = content.match(
      /###\s*HTTP\s*請求[\s\n]*([A-Z]+)\s*[`'"]?(\/v5\/[\w\/\-]+)[`'"]?/i,
    );

    let endpointKey = null;
    if (httpRequestSection) {
      const httpMethod = httpRequestSection[1].toUpperCase();
      const endpoint = httpRequestSection[2];
      endpointKey = `${httpMethod} ${endpoint}`;
    }

    // 如果找到了端点信息，我们仍然尝试从 Node.js 代码示例中提取方法名
    if (endpointKey) {
      // 查找 Node.js 代码示例中的方法调用
      const nodeJsSection = content.match(
        /<TabItem value="Node"[\s\S]*?```n4js[\s\S]*?```/i,
      );

      if (nodeJsSection) {
        const nodeJsCode = nodeJsSection[0];

        // 检查是否包含 bybit-api
        if (nodeJsCode.includes("bybit-api")) {
          // 提取方法名，格式为 client.methodName(...)
          const methodMatch = nodeJsCode.match(
            /client\s*\.\s*([a-zA-Z0-9_]+)\s*\(/i,
          );

          if (methodMatch && methodMatch[1]) {
            // 确保方法名是纯方法名，不包含任何前缀或后缀
            let methodName = methodMatch[1].trim();

            // 检查并移除可能的 `xxx =` 格式
            const equalSignIndex = methodName.indexOf(" =");
            if (equalSignIndex !== -1) {
              methodName = methodName.substring(0, equalSignIndex).trim();
            }

            methodMatches.push([methodName, content, endpointKey]);
          }
        }
      }

      // 即使没有找到方法名，也添加端点信息到结果中
      // 使用空字符串作为方法名占位符
      if (methodMatches.length === 0 && endpointKey) {
        methodMatches.push(["", content, endpointKey]);
        console.log(
          `Bybit: 从文档中提取到端点 ${endpointKey}，但未找到对应的方法名`,
        );
      }
    }

    return methodMatches;
  };

  try {
    // 获取所有 .mdx 文件
    const mdxFiles = await findMdxFiles(docsDir);
    console.log(`Bybit: 找到 ${mdxFiles.length} 个.mdx文档文件`);

    let processedFiles = 0;
    let extractedMethods = 0;
    let extractedEndpoints = 0;

    // 处理每个文件
    for (const filePath of mdxFiles) {
      try {
        processedFiles++;
        if (processedFiles % 10 === 0) {
          console.log(
            `Bybit: 已处理 ${processedFiles}/${mdxFiles.length} 个文档文件...`,
          );
        }

        const content = await readFile(filePath, "utf-8");
        const methodInfos = extractMethodInfo(content);

        // 将提取的方法信息添加到结果中
        for (const [methodName, docContent, endpointKey] of methodInfos) {
          // 如果成功提取了端点信息，则添加到端点结果
          if (endpointKey) {
            endpointResult[endpointKey] = docContent;
            extractedEndpoints++;

            // 如果有方法名，则添加到方法结果和映射中
            if (methodName) {
              result[methodName] = docContent;
              methodToEndpointMap[methodName] = endpointKey;
              extractedMethods++;
            }
          } else if (methodName) {
            // 如果只有方法名但没有端点信息，也添加到方法结果中
            result[methodName] = docContent;
            extractedMethods++;
          }
        }
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
      }
    }

    console.log(
      `Bybit: 文档处理完成，共处理了 ${processedFiles} 个文件，提取了 ${extractedMethods} 个方法的文档，${extractedEndpoints} 个端点的文档`,
    );

    // 返回包含方法名和端点两种键的结果
    return { methodResult: result, endpointResult, methodToEndpointMap };
  } catch (error) {
    console.error("Error reading docs directory:", error);
    return { methodResult: {}, endpointResult: {}, methodToEndpointMap: {} };
  }
};

// 移除直接调用，因为这可能导致了问题
// getEndPointDoc();

export const generateOfflineData = async () => {
  console.log("Bybit: 开始生成离线数据...");
  console.log("Bybit: 并行获取所有必要数据...");

  // 获取所有必要数据
  const [methodEndpointMap, docResults, methodDtsInfoMap, readme] =
    await Promise.all([
      getMethodEndpointMap(),
      getEndPointDoc(),
      extractMethodMapFromDts(),
      getReadme(),
    ]);

  // 解构 getEndPointDoc 返回的结果
  const {
    methodResult: methodDocMap,
    endpointResult: endpointDocMap,
    methodToEndpointMap,
  } = docResults;

  console.log("Bybit: 所有数据获取完成，开始整合数据...");
  console.log(
    `Bybit: 方法端点映射: ${Object.keys(methodEndpointMap).length} 个方法`,
  );
  console.log(`Bybit: 方法文档: ${Object.keys(methodDocMap).length} 个文档`);
  console.log(`Bybit: 端点文档: ${Object.keys(endpointDocMap).length} 个文档`);
  console.log(
    `Bybit: 方法到端点映射: ${Object.keys(methodToEndpointMap).length} 个映射`,
  );
  console.log(
    `Bybit: 方法定义: ${Object.keys(methodDtsInfoMap).length} 个方法`,
  );

  const offlineData: {
    methods: Array<{
      name: string;
      doc: string;
      methodInfo: any;
      endpoint?: string; // 新增：方法对应的端点
    }>;
    endpoints: Record<string, string>; // 新增：以端点为键的文档
    readme: string;
    example: string[];
  } = {
    methods: [],
    endpoints: endpointDocMap, // 直接使用端点文档映射
    readme,
    example: [],
  };

  let matchedDocs = 0;
  let missingDocs = 0;
  let matchedEndpoints = 0;

  // Convert methods object to array and sort by name
  offlineData.methods = Object.keys(methodDtsInfoMap)
    .sort()
    .map((method) => {
      // 获取方法对应的端点
      let endpoint = "";

      // 首先尝试从 methodToEndpointMap 中获取
      if (methodToEndpointMap[method]) {
        endpoint = methodToEndpointMap[method];
        matchedEndpoints++;
      }
      // 如果没有，尝试从 methodEndpointMap 中获取
      else if (methodEndpointMap[method]) {
        const [httpMethod, endpointPath] = methodEndpointMap[method];
        endpoint = `${httpMethod} ${endpointPath}`;
        matchedEndpoints++;
      }

      const doc = methodDocMap[method] || endpointDocMap[endpoint];

      if (Boolean(doc)) {
        matchedDocs++;
      } else {
        missingDocs++;
      }

      return {
        name: method,
        doc: doc || "", // 使用方法文档
        methodInfo: methodDtsInfoMap[method],
        endpoint: endpoint || undefined, // 添加端点信息
      };
    });

  console.log(`Bybit: 数据整合完成:`);
  console.log(`Bybit: - 成功匹配文档的方法: ${matchedDocs} 个`);
  console.log(`Bybit: - 缺少文档的方法: ${missingDocs} 个`);
  console.log(`Bybit: - 成功匹配端点的方法: ${matchedEndpoints} 个`);
  console.log(
    `Bybit: - 总方法数: ${Object.keys(offlineData.methods).length} 个`,
  );
  console.log(
    `Bybit: - 总端点数: ${Object.keys(offlineData.endpoints).length} 个`,
  );

  return offlineData;
};

// 执行生成离线数据并写入文件
console.log("Bybit: 开始执行离线数据生成流程...");
generateOfflineData()
  .then((res) => {
    const outputPath = path.join(__dirname, "./bybit-offlineData.json");
    writeFileSync(outputPath, JSON.stringify(res, null, 2));
    console.log(`Bybit: 离线数据已成功生成并保存到: ${outputPath}`);
    console.log(
      `Bybit: 数据大小: ${(JSON.stringify(res).length / 1024).toFixed(2)} KB`,
    );
  })
  .catch((error) => {
    console.error("Bybit: 生成离线数据失败:", error);
  });
