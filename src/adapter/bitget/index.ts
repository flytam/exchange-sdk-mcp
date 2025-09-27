import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ExchangeAdapter } from "../interface";
import data from "./bitget-offlineData.json";
import { registerExchangeTools } from "../utils/registerTools";

interface MethodData {
  name: string;
  doc: string;
  methodInfo: any;
}

export class BitgetAdapter implements ExchangeAdapter {
  async listMethods() {
    return (data.methods as MethodData[]).map((methodData: MethodData) => {
      return {
        method: methodData.name,
        description: methodData.methodInfo?.methodComment,
      };
    });
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

const bitgetAdapter = new BitgetAdapter();

export const registerBitgetTools = (server: McpServer) => {
  return registerExchangeTools(server, "Bitget", bitgetAdapter);
};
