import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ExchangeAdapter } from "../interface";
import data from "./bybit-offlineData.json";
import { z } from "zod";

export class BybitAdapter implements ExchangeAdapter {
  async listMethods() {
    return Object.keys(data.methods).map((k) => {
      // 尝试从文档中提取 title
      const docContent =
        data.methods[k as keyof typeof data.methods]?.doc || "";
      const titleMatch = docContent.match(/---[\s\S]*?\ntitle:\s*([^\n]+)\n/);
      const title = titleMatch ? titleMatch[1].trim() : null;

      return {
        method: k,
        description:
          title ||
          data.methods[k as keyof typeof data.methods]?.methodInfo
            ?.methodComment,
      };
    });
  }

  async getDoc(method: string) {
    return data.methods[method as keyof typeof data.methods];
  }

  async getReadme(): Promise<string> {
    return data.readme;
  }
}

export const registerBybitTools = (server: McpServer) => {
  const bybitService = new BybitAdapter();
  server.tool("查询 Bybit交易所 SDK 支持的方法", async () => {
    return {
      content: [
        {
          text: JSON.stringify(await bybitService.listMethods()),
          type: "text",
        },
      ],
    };
  });

  server.tool(
    "查询 Bybit交易所 SDK 方法的使用信息",
    {
      method: z.string({
        description: "查询的具体方法名称",
      }),
    },
    async ({ method }) => {
      return {
        content: [
          {
            text: JSON.stringify(await bybitService.getDoc(method)),
            type: "text",
          },
        ],
      };
    },
  );

  server.tool("查询 Bybit交易所 SDK 项目的 README", async () => {
    return {
      content: [
        {
          text: await bybitService.getReadme(),
          type: "text",
        },
      ],
    };
  });

  return server;
};
