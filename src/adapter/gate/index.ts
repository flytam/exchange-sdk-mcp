import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ExchangeAdapter } from "../interface";
import data from "./gate-offlineData.json";
import { z } from "zod";

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

export const registerGateTools = (server: McpServer) => {
  const gateService = new GateAdapter();
  server.tool("查询 Gate交易所 SDK 支持的方法", async () => {
    return {
      content: [
        {
          text: JSON.stringify(await gateService.listMethods()),
          type: "text",
        },
      ],
    };
  });

  server.tool(
    "查询 Gate交易所 SDK 方法的使用信息",
    {
      method: z.string({
        description: "查询的具体方法名称",
      }),
    },
    async ({ method }) => {
      return {
        content: [
          {
            text: JSON.stringify(await gateService.getDoc(method)),
            type: "text",
          },
        ],
      };
    },
  );

  server.tool("查询 Gate交易所 SDK 项目的 README", async () => {
    return {
      content: [
        {
          text: await gateService.getReadme(),
          type: "text",
        },
      ],
    };
  });

  return server;
};
