import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ExchangeAdapter } from "../interface";
import data from "./okx-dex-offline-data.json";
import { z } from "zod";

export class OkxDexAdapter implements ExchangeAdapter {
  async listMethods() {
    // 检查数据结构，如果有 methods 字段则使用，否则直接使用根级别的键
    const methods = (data as any).methods || data;
    return Object.keys(methods).map((k) => ({
      method: k,
      description: `OKX DEX API method: ${k}`,
    }));
  }

  async getDoc(method: string) {
    // 检查数据结构，如果有 methods 字段则使用，否则直接使用根级别的数据
    const methods = (data as any).methods || data;
    const methodData = methods[method as keyof typeof methods];
    if (!methodData) {
      throw new Error(`Method ${method} not found`);
    }
    return methodData;
  }

  async getReadme(): Promise<string> {
    const methods = (data as any).methods || data;
    return `# OKX DEX API Documentation\n\nThis adapter provides access to OKX DEX API methods and documentation.\n\nAvailable methods: ${Object.keys(methods).length}`;
  }
}

export const registerOkxDexTools = (server: McpServer) => {
  const okxDexService = new OkxDexAdapter();

  server.tool("Query OKX DEX API Supported Methods", async () => {
    return {
      content: [
        {
          text: JSON.stringify({
            available_methods: await okxDexService.listMethods(),
            SDK_documentation: await okxDexService.getReadme(),
          }),
          type: "text",
        },
      ],
    };
  });

  server.tool(
    "Query OKX DEX API Method Usage Information",
    {
      method: z.string({
        description: "The specific method name to query",
      }),
    },
    async ({ method }) => {
      return {
        content: [
          {
            text: JSON.stringify(await okxDexService.getDoc(method)),
            type: "text",
          },
        ],
      };
    },
  );

  return server;
};
