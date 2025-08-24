import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ExchangeAdapter } from "../interface";
import data from "./okx-dex-offline-data.json";
import { registerExchangeTools } from "../utils/registerTools";

export class OkxDexAdapter implements ExchangeAdapter {
  async listMethods() {
    // 检查数据结构，如果有 methods 字段则使用，否则直接使用根级别的键
    const methods = (data as any).methods || data;
    return Object.keys(methods).map((k) => ({
      method: k,
      description: `OKX DEX API method: ${k}`,
    }));
  }

  async getDoc(method: string) {
    // 检查数据结构，如果有 methods 字段则使用，否则直接使用根级别的数据
    const methods = (data as any).methods || data;
    const methodData = methods[method as keyof typeof methods];
    if (!methodData) {
      throw new Error(`Method ${method} not found`);
    }
    return methodData;
  }

  async getReadme(): Promise<string> {
    const methods = (data as any).methods || data;
    return `# OKX DEX API Documentation\n\nThis adapter provides access to OKX DEX API methods and documentation.\n\nAvailable methods: ${Object.keys(methods).length}`;
  }
}

const okxDexAdapter = new OkxDexAdapter();

export const registerOkxDexTools = (server: McpServer) => {
  return registerExchangeTools(server, "OKX", okxDexAdapter, "DEX API");
};
