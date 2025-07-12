import * as cheerio from "cheerio";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { Project, Node, Type } from "ts-morph";
import { writeFileSync } from "fs";

// 生成检索数据
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getMethodEndpointMap = async (): Promise<
  Record<string, string>
> => {
  // TODO:
  return {};
};

export const getEndPointDoc = async (): Promise<Record<string, string>> => {
  // TODO:
  return {};
};

const readme =
  "https://raw.githubusercontent.com/tiagosiebler/bitget-api/refs/heads/master/README.md";
const getReadme = async () => {
  console.log("bitget: 开始获取README文件...");
  try {
    const res = await fetch(readme);
    const text = await res.text();
    console.log("bitget: README文件获取成功");
    return text;
  } catch (error) {
    console.error("bitget: 获取README文件失败:", error);
    throw error;
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
        const importMatch = fullName.match(/import\(".*"\)\.((\w+)(\<.*\>)?)/);
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
            const propType = prop.getTypeAtLocation(
              prop.getValueDeclarationOrThrow(),
            );
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
      const propType = prop.getTypeAtLocation(
        prop.getValueDeclarationOrThrow(),
      );
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
    const importMatch = typeText.match(/import\(".*"\)\.((\w+)(\<.*\>)?)/);
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
  console.log("bitget: 开始从.d.ts文件中提取方法定义...");
  const dtsPath = path.resolve(
    process.cwd(),
    "node_modules/bitget-api/lib/rest-client-v2.d.ts",
  );
  const resultMap: Record<string, any> = {};

  try {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(dtsPath);
    console.log(`bitget: 成功加载类型定义文件: ${dtsPath}`);

    const classes = sourceFile.getClasses();
    console.log(`bitget: 找到 ${classes.length} 个类进行处理`);

    let methodCount = 0;
    classes.forEach((cls) => {
      const className = cls.getName() || "UnknownClass";
      console.log(`bitget: 处理类 ${className}...`);

      const methods = cls.getMethods();
      console.log(`bitget: 在类 ${className} 中找到 ${methods.length} 个方法`);

      methods.forEach((method) => {
        const methodName = method.getName();
        // 跳过私有方法（以下划线开头）
        if (methodName.startsWith("_")) {
          return;
        }

        const jsDocs = method.getJsDocs();

        const methodComment = jsDocs
          .map((doc) => {
            const comment = doc.getComment();
            // 处理 comment 可能是字符串或数组的情况
            return typeof comment === "string"
              ? comment
              : Array.isArray(comment)
                ? comment
                    .map((item) => item?.getText?.() || String(item || ""))
                    .join("")
                : "";
          })
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
                // 处理 comment 可能是字符串或数组的情况
                paramComment =
                  typeof comment === "string"
                    ? comment
                    : Array.isArray(comment)
                      ? comment
                          .map(
                            (item) => item?.getText?.() || String(item || ""),
                          )
                          .join("")
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
              // 处理 comment 可能是字符串或数组的情况
              returnComment =
                typeof comment === "string"
                  ? comment
                  : Array.isArray(comment)
                    ? comment
                        .map((item) => item?.getText?.() || String(item || ""))
                        .join("")
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

    console.log(`bitget: 成功从.d.ts文件中提取了 ${methodCount} 个方法定义`);
    return resultMap;
  } catch (error) {
    console.error(`bitget: 处理.d.ts文件时出错: ${dtsPath}`);
    console.error(`bitget: 错误详情:`, error);
    return {}; // 返回空对象，以便程序可以继续运行
  }
};

export const generateOfflineData = async () => {
  console.log("bitget: 开始生成离线数据...");
  console.log("bitget: 并行获取所有必要数据...");

  try {
    const [methodEndpointMap, endPointDocMap, methodDtsInfoMap, readme] =
      await Promise.all([
        getMethodEndpointMap(),
        getEndPointDoc(),
        extractMethodMapFromDts(),
        getReadme(),
      ]);

    console.log("bitget: 所有数据获取完成，开始整合数据...");
    console.log(
      `bitget: 方法端点映射: ${Object.keys(methodEndpointMap).length} 个方法`,
    );
    console.log(
      `bitget: 端点文档: ${Object.keys(endPointDocMap).length} 个文档`,
    );
    console.log(
      `bitget: 方法定义: ${Object.keys(methodDtsInfoMap).length} 个方法`,
    );
    console.log("bitget: README 获取成功");

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

    Object.keys(methodDtsInfoMap).forEach((method) => {
      offlineData.methods[method] = {
        doc: "",
        methodInfo: methodDtsInfoMap[method],
      };
    });

    console.log(`bitget: 数据整合完成:`);

    console.log(
      `bitget: - 总方法数: ${Object.keys(offlineData.methods).length} 个`,
    );

    return offlineData;
  } catch (error) {
    console.error("bitget: 生成离线数据时出错:", error);
    throw error;
  }
};

console.log("bitget: 开始执行离线数据生成流程...");
generateOfflineData()
  .then((res) => {
    const outputPath = path.join(__dirname, "./bitget-offlineData.json");
    writeFileSync(outputPath, JSON.stringify(res, null, 2));
    console.log(`bitget: 离线数据已成功生成并保存到: ${outputPath}`);
    console.log(
      `bitget: 数据大小: ${(JSON.stringify(res).length / 1024).toFixed(2)} KB`,
    );
  })
  .catch((error) => {
    console.error("bitget: 生成离线数据失败:", error);
  });
