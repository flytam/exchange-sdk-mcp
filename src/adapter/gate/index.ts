import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ExchangeAdapter } from "../interface";
import data from "./gate-offlineData.json";
import { registerExchangeTools } from "../utils/registerTools";

export class GateAdapter implements ExchangeAdapter {
  async listMethods() {
    return Object.keys(data.methods).map((k) => ({
      method: k,
      description:
        // @ts-ignore
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

const gateAdapter = new GateAdapter();

export const registerGateTools = (server: McpServer) => {
  return registerExchangeTools(server, "Gate", gateAdapter);
};
