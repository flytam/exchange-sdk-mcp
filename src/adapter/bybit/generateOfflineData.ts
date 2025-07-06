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

const methodEndpoint =
  "https://raw.githubusercontent.com/tiagosiebler/bybit-api/refs/heads/master/docs/endpointFunctionList.md";

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
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(
    path.resolve("node_modules/bybit-api/lib/rest-client-v5.d.ts"),
  );

  const resultMap: Record<string, any> = {};

  // 查找 RestClientV5 类
  const classes = sourceFile.getClasses();
  for (const classDeclaration of classes) {
    const className = classDeclaration.getName() || "";

    // 只处理 RestClientV5 类
    if (className === "RestClientV5") {
      // 获取类中的所有方法
      const methods = classDeclaration.getMethods();

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
      }
    }
  }

  return resultMap;
};

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getEndPointDoc = async () => {
  const result: Record<string, string> = {};
  const docsDir = path.resolve(__dirname, "./bybit-docs/v5");

  // 递归遍历目录，查找所有 .mdx 文件
  const findMdxFiles = async (dir: string): Promise<string[]> => {
    const entries = await readdir(dir, { withFileTypes: true });
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

  // 从文件内容中提取方法名和文档内容
  const extractMethodInfo = (content: string): [string, string][] => {
    const methodMatches: [string, string][] = [];

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

          methodMatches.push([methodName, content]);
        }
      }
    }

    return methodMatches;
  };

  try {
    // 获取所有 .mdx 文件
    const mdxFiles = await findMdxFiles(docsDir);

    // 处理每个文件
    for (const filePath of mdxFiles) {
      try {
        const content = await readFile(filePath, "utf-8");
        const methodInfos = extractMethodInfo(content);

        // 将提取的方法信息添加到结果中
        for (const [methodName, docContent] of methodInfos) {
          result[methodName] = docContent;
        }
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
      }
    }
  } catch (error) {
    console.error("Error reading docs directory:", error);
  }

  return result;
};

// 移除直接调用，因为这可能导致了问题
// getEndPointDoc();

export const generateOfflineData = async () => {
  const [methodEndpointMap, endPointDocMap, methodDtsInfoMap] =
    await Promise.all([
      getMethodEndpointMap(),
      getEndPointDoc(),
      extractMethodMapFromDts(),
    ]);

  // 调试输出，查看 endPointDocMap 的键

  const offlineData: Record<
    string,
    {
      doc: string;
      methodInfo: any;
    }
  > = {};

  Object.keys(methodDtsInfoMap).forEach((method) => {
    // const [httpMethod, endpoint] = methodEndpointMap[method];
    // const key = `${httpMethod} ${endpoint}`;
    offlineData[method] = {
      doc: endPointDocMap[method] || "", // 使用方法名作为键，而不是 HTTP 方法和端点
      methodInfo: methodDtsInfoMap[method],
    };
  });

  return offlineData;
};

// 执行生成离线数据并写入文件
generateOfflineData()
  .then((res) => {
    writeFileSync(
      path.join(__dirname, "./bybit-offlineData.json"),
      JSON.stringify(res, null, 2),
    );
    console.log("Bybit offline data generated successfully!");
  })
  .catch((error) => {
    console.error("Error generating Bybit offline data:", error);
  });
