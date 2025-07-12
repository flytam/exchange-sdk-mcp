import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ExchangeAdapter } from "../interface";
import data from "./bitget-offlineData.json";
import { z } from "zod";

export class BitgetAdapter implements ExchangeAdapter {
  async listMethods() {
    return Object.keys(data.methods).map((k) => {
      return {
        method: k,
        description:
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

export const registerBitgetTools = (server: McpServer) => {
  const bitgetService = new BitgetAdapter();
  server.tool("Query Bitget Exchange SDK Supported Methods", async () => {
    return {
      content: [
        {
          text: JSON.stringify({
            available_methods: await bitgetService.listMethods(),
            SDK_documentation: await bitgetService.getReadme(),
          }),
          type: "text",
        },
      ],
    };
  });

  server.tool(
    "Query Bitget Exchange SDK Method Usage Information",
    {
      method: z.string({
        description: "The specific method name to query",
      }),
    },
    async ({ method }) => {
      return {
        content: [
          {
            text: JSON.stringify(await bitgetService.getDoc(method)),
            type: "text",
          },
        ],
      };
    },
  );
};
