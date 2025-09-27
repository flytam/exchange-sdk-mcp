import * as cheerio from "cheerio";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { Project, Node, Type } from "ts-morph";
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

  if (type.isObject()) {
    const symbol = type.getSymbol();
    if (!symbol) {
      return { kind: "object", name: "Object", properties: [] };
    }

    let name = symbol.getName();

    // 处理 reference 类型中可能存在的绝对路径
    if (name.includes('import("')) {
      // 提取导入路径中的实际类型名称
      const importMatch = name.match(/import\(".*"\)\.(([\w\d_]+)(\<.*\>)?)/);
      if (importMatch && importMatch[1]) {
        name = importMatch[1];
      }
    } else if (name.startsWith('"') && name.includes("/node_modules/")) {
      // 处理直接以引号包裹的绝对路径格式
      const match = name.match(/".*\/node_modules\/.*\/([^"]+)"/);
      if (match && match[1]) {
        // 提取最后一个组件（通常是类型名称）
        const parts = match[1].split(".");
        name = parts[parts.length - 1];
      }
    }

    // 避免循环引用
    if (visited.has(name)) {
      return { kind: "reference", name };
    }
    visited.add(name);

    // 处理类型名称，移除绝对路径前缀
    let typeName = type.getText();
    if (typeName.includes('import("')) {
      // 提取导入路径中的实际类型名称
      const importMatch = typeName.match(/import\(".*"\)\.([\w\d_]+)/);
      if (importMatch && importMatch[1]) {
        typeName = importMatch[1];
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

    const properties: Array<{ name: string; type: any; optional: boolean }> =
      [];
    const propertySymbols = type.getProperties();

    for (const prop of propertySymbols) {
      const propName = prop.getName();
      const declarations = prop.getDeclarations();
      if (declarations.length === 0) continue;

      const declaration = declarations[0];
      if (!Node.isPropertySignature(declaration)) continue;

      const propType = declaration.getType();
      const optional = declaration.hasQuestionToken();

      properties.push({
        name: propName,
        type: parseType(propType, new Set(visited)),
        optional,
      });
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
// 生成检索数据
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getMethodEndpointMap = async () => {
  const map: Record<string, [string, string]> = {};
  // 可选：裁剪出只包含 Endpoint 表格的部分
  // TODO:

  return map;
};

export const getEndPointDoc = async (): Promise<Record<string, string>> => {
  // TODO:
  return {};
};

const readme =
  "https://raw.githubusercontent.com/tiagosiebler/binance/refs/heads/master/README.md";
const getReadme = async () => {
  console.log("binance: 开始获取README文件...");
  try {
    const res = await fetch(readme);
    const text = await res.text();
    console.log("binance: README文件获取成功");
    return text;
  } catch (error) {
    console.error("binance: 获取README文件失败:", error);
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
  console.log("binance: 开始从.d.ts文件中提取方法定义...");
  const dtsPath = [
    path.resolve("node_modules/binance/lib/usdm-client.d.ts"),
    path.resolve("node_modules/binance/lib/main-client.d.ts"),
    path.resolve("node_modules/binance/lib/coinm-client.d.ts"),
  ];
  const resultMap: Record<string, any> = {};

  // 清理注释中的特殊字符和多余空格
  const cleanComment = (comment: string): string => {
    return comment
      .replace(/\*/g, "")
      .replace(/\s+/g, " ")
      .replace(/@[a-zA-Z]+ /g, "")
      .trim();
  };

  for (const filePath of dtsPath) {
    try {
      console.log(`binance: 处理文件 ${filePath}...`);
      // 获取文件名作为前缀
      const fileName = path.basename(filePath, ".d.ts");

      // 使用ts-morph解析文件
      const project = new Project();
      const sourceFile = project.addSourceFileAtPath(filePath);

      // 查找主类
      const classes = sourceFile.getClasses();
      console.log(`binance: 在 ${filePath} 中找到 ${classes.length} 个类`);

      let methodCount = 0;
      for (const classDeclaration of classes) {
        const className = classDeclaration.getName() || "";
        console.log(`binance: 处理类 ${className}...`);

        // 获取类中的所有方法
        const methods = classDeclaration.getMethods();
        console.log(
          `binance: 在 ${className} 类中找到 ${methods.length} 个方法`,
        );

        for (const method of methods) {
          const methodName = method.getName();

          // 跳过私有方法和构造函数
          if (methodName.startsWith("_") || methodName === "constructor") {
            continue;
          }

          // 检查返回类型是否是Promise
          const returnType = method.getReturnType();
          const returnTypeText = returnType.getText();
          if (!returnTypeText.startsWith("Promise<")) {
            continue; // 跳过非Promise返回类型的方法
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

          // 生成键名：前缀+方法名
          const key = `${fileName}.${methodName}`;

          // 将提取的信息存入结果 map
          resultMap[key] = {
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

      console.log(`binance: 从 ${filePath} 提取了 ${methodCount} 个方法`);

      console.log(`从 ${filePath} 提取了 ${methodCount} 个方法`);
    } catch (error) {
      console.error(`处理文件 ${filePath} 时出错:`, error);
    }
  }

  return resultMap;
};

export const generateOfflineData = async () => {
  console.log("binance: 开始生成离线数据...");
  console.log("binance: 并行获取所有必要数据...");

  try {
    const [methodEndpointMap, endPointDocMap, methodDtsInfoMap, readme] =
      await Promise.all([
        getMethodEndpointMap(),
        getEndPointDoc(),
        extractMethodMapFromDts(),
        getReadme(),
      ]);

    console.log("binance: 所有数据获取完成，开始整合数据...");
    console.log(
      `binance: 方法端点映射: ${Object.keys(methodEndpointMap).length} 个方法`,
    );
    console.log(
      `binance: 端点文档: ${Object.keys(endPointDocMap).length} 个文档`,
    );
    console.log(
      `binance: 方法定义: ${Object.keys(methodDtsInfoMap).length} 个方法`,
    );
    console.log("binance: README 获取成功");

    const offlineData: {
      methods: Array<{
        name: string;
        doc: string;
        methodInfo: any;
      }>;
      readme: string;
      example: string[];
    } = {
      methods: [],
      readme: readme,
      example: [],
    };

    // Convert methods object to array and sort by name
    offlineData.methods = Object.keys(methodDtsInfoMap)
      .sort()
      .map((method) => ({
        name: method,
        doc: "",
        methodInfo: methodDtsInfoMap[method],
      }));

    console.log(`binance: 数据整合完成:`);

    console.log(
      `binance: - 总方法数: ${Object.keys(offlineData.methods).length} 个`,
    );

    return offlineData;
  } catch (error) {
    console.error("binance: 生成离线数据时出错:", error);
    throw error;
  }
};

console.log("binance: 开始执行离线数据生成流程...");
generateOfflineData()
  .then((res) => {
    const outputPath = path.join(__dirname, "./binance-offlineData.json");
    writeFileSync(outputPath, JSON.stringify(res, null, 2));
    console.log(`binance: 离线数据已成功生成并保存到: ${outputPath}`);
    console.log(
      `binance: 数据大小: ${(JSON.stringify(res).length / 1024).toFixed(2)} KB`,
    );
  })
  .catch((error) => {
    console.error("binance: 生成离线数据失败:", error);
  });
