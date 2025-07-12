import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ExchangeAdapter } from "../interface";
import data from "./binance-offlineData.json";
import { z } from "zod";

export class BinanceAdapter implements ExchangeAdapter {
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

export const registerBinanceTools = (server: McpServer) => {
  const binanceService = new BinanceAdapter();
  server.tool("Query Binance Exchange SDK Supported Methods", async () => {
    return {
      content: [
        {
          text: JSON.stringify({
            available_methods: await binanceService.listMethods(),
            SDK_documentation: await binanceService.getReadme(),
          }),
          type: "text",
        },
      ],
    };
  });

  server.tool(
    "Query Binance Exchange SDK Method Usage Information",
    {
      method: z.string({
        description: "The specific method name to query",
      }),
    },
    async ({ method }) => {
      return {
        content: [
          {
            text: JSON.stringify(await binanceService.getDoc(method)),
            type: "text",
          },
        ],
      };
    },
  );

  return server;
};
