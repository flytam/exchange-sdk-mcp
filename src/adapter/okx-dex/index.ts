import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ExchangeAdapter } from "../interface";
import data from "./okx-dex-offline-data.json";
import { registerExchangeTools } from "../utils/registerTools";

interface MethodData {
  name: string;
  doc: string;
  methodInfo: any;
}

export class OkxDexAdapter implements ExchangeAdapter {
  async listMethods() {
    return (data.methods as MethodData[]).map((methodData: MethodData) => ({
      method: methodData.name,
      description: `OKX DEX API method: ${methodData.name}`,
    }));
  }

  async getDoc(method: string) {
    const methodData = (data.methods as MethodData[]).find(
      (m: MethodData) => m.name === method,
    );
    return methodData ? methodData.doc : "";
  }

  async getReadme(): Promise<string> {
    return `# OKX DEX API Documentation\n\nThis adapter provides access to OKX DEX API methods and documentation.\n\nAvailable methods: ${data.methods.length}`;
  }
}

const okxDexAdapter = new OkxDexAdapter();

export const registerOkxDexTools = (server: McpServer) => {
  return registerExchangeTools(server, "OKX", okxDexAdapter, "DEX API");
};
