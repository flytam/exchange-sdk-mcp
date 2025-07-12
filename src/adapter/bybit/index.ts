import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ExchangeAdapter } from "../interface";
import data from "./bybit-offlineData.json";
import { z } from "zod";

export class BybitAdapter implements ExchangeAdapter {
  async listMethods() {
    return Object.keys(data.methods).map((k) => {
      // Try to extract title from documentation
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
  server.tool("Query Bybit Exchange SDK Supported Methods", async () => {
    return {
      content: [
        {
          text: JSON.stringify({
            available_methods: await bybitService.listMethods(),
            SDK_documentation: await bybitService.getReadme(),
          }),
          type: "text",
        },
      ],
    };
  });

  server.tool(
    "Query Bybit Exchange SDK Method Usage Information",
    {
      method: z.string({
        description: "The specific method name to query",
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

  return server;
};
