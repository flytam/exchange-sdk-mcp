import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ExchangeAdapter } from "../interface";
import data from "./bybit-offlineData.json";
import { registerExchangeTools } from "../utils/registerTools";

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

const bybitAdapter = new BybitAdapter();

export const registerBybitTools = (server: McpServer) => {
  return registerExchangeTools(server, "Bybit", bybitAdapter);
};
