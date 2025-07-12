import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ExchangeAdapter } from "../interface";
import data from "./okx-offlineData.json";
import { z } from "zod";

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

export const registerOkxTools = (server: McpServer) => {
  const okxService = new OkxAdapter();
  server.tool("Query OKX Exchange SDK Supported Methods", async () => {
    return {
      content: [
        {
          text: JSON.stringify({
            available_methods: await okxService.listMethods(),
            SDK_documentation: await okxService.getReadme(),
          }),
          type: "text",
        },
      ],
    };
  });

  server.tool(
    "Query OKX Exchange SDK Method Usage Information",
    {
      method: z.string({
        description: "The specific method name to query",
      }),
    },
    async ({ method }) => {
      return {
        content: [
          {
            text: JSON.stringify(await okxService.getDoc(method)),
            type: "text",
          },
        ],
      };
    },
  );

  return server;
};
