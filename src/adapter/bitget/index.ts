import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ExchangeAdapter } from "../interface";
import data from "./bitget-offlineData.json";
import { registerExchangeTools } from "../utils/registerTools";

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

const bitgetAdapter = new BitgetAdapter();

export const registerBitgetTools = (server: McpServer) => {
  return registerExchangeTools(server, "Bitget", bitgetAdapter);
};
