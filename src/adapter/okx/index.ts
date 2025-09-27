import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ExchangeAdapter } from "../interface";
import data from "./okx-offlineData.json";
import { registerExchangeTools } from "../utils/registerTools";

interface MethodData {
  name: string;
  doc: string;
  methodInfo: any;
}

export class OkxAdapter implements ExchangeAdapter {
  async listMethods() {
    return (data.methods as MethodData[]).map((methodData: MethodData) => ({
      method: methodData.name,
      description: methodData.methodInfo?.methodComment,
    }));
  }

  async getDoc(method: string) {
    const methodData = (data.methods as MethodData[]).find(
      (m: MethodData) => m.name === method,
    );
    return methodData ? methodData.doc : "";
  }

  async getReadme(): Promise<string> {
    return data.readme;
  }
}

const okxAdapter = new OkxAdapter();

export const registerOkxTools = (server: McpServer) => {
  return registerExchangeTools(server, "OKX", okxAdapter);
};
