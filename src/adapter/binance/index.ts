import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ExchangeAdapter } from "../interface";
import data from "./binance-offlineData.json";
import { registerExchangeTools } from "../utils/registerTools";

interface MethodData {
  name: string;
  doc: string;
  methodInfo: any;
}

export class BinanceAdapter implements ExchangeAdapter {
  async listMethods() {
    return (data.methods as MethodData[]).map((methodData: MethodData) => {
      // Try to extract title from documentation
      const docContent = methodData.doc || "";
      const titleMatch = docContent.match(/---[\s\S]*?\ntitle:\s*([^\n]+)\n/);
      const title = titleMatch ? titleMatch[1].trim() : null;

      return {
        method: methodData.name,
        description: title || methodData.methodInfo?.methodComment,
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

const binanceAdapter = new BinanceAdapter();

export const registerBinanceTools = (server: McpServer) => {
  return registerExchangeTools(server, "Binance", binanceAdapter);
};
