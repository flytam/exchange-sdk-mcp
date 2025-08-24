import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ExchangeAdapter } from "../interface";
import data from "./okx-offlineData.json";
import { registerExchangeTools } from "../utils/registerTools";

export class OkxAdapter implements ExchangeAdapter {
  async listMethods() {
    return Object.keys(data.methods).map((k) => ({
      method: k,
      description:
        data.methods[k as keyof typeof data.methods]?.methodInfo?.methodComment,
    }));
  }

  async getDoc(method: string) {
    return data.methods[method as keyof typeof data.methods];
  }

  async getReadme(): Promise<string> {
    return data.readme;
  }
}

const okxAdapter = new OkxAdapter();

export const registerOkxTools = (server: McpServer) => {
  return registerExchangeTools(server, "OKX", okxAdapter);
};
