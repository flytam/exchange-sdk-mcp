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

  const text = await readFile(
    path.resolve(__dirname, "./apiHtmlText.html"),
    "utf-8",
  );

  // 加载 HTML 到 cheerio
  const $ = cheerio.load(text);

  const result: Record<string, string> = {};
  const startMethods = ["GET", "POST", "DELETE", "PUT", "PATCH"];

  // 遍历每个 content-block__cont 元素
  $(".content-block__cont").each((_, el) => {
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
        break;
      }
    }
  });

  return result;
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
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(
    path.resolve("node_modules/gateio-api/dist/mjs/RestClient.d.ts"),
  );

  const resultMap: Record<string, any> = {};

  sourceFile.getClasses().forEach((cls) => {
    const className = cls.getName() || "UnknownClass";

    cls.getMethods().forEach((method) => {
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
    });
  });

  return resultMap;
};

export const generateOfflineData = async () => {
  const [methodEndpointMap, endPointDocMap, methodDtsInfoMap] =
    await Promise.all([
      getMethodEndpointMap(),
      getEndPointDoc(),
      extractMethodMapFromDts(),
    ]);

  const offlineData: Record<
    string,
    {
      doc: string;
      methodInfo: any;
    }
  > = {};

  Object.keys(methodEndpointMap).forEach((method) => {
    const [httpMethod, endpoint] = methodEndpointMap[method];
    const key = `${httpMethod} ${endpoint}`;
    offlineData[method] = {
      doc: endPointDocMap[key],
      methodInfo: methodDtsInfoMap[method],
    };
  });

  return offlineData;
};

generateOfflineData().then((res) => {
  writeFileSync(
    path.join(__dirname, "./gate-offlineData.json"),
    JSON.stringify(res, null, 2),
  );
});
