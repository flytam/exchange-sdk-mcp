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
  server.tool("Query Gate Exchange SDK Supported Methods", async () => {
    return {
      content: [
        {
          text: JSON.stringify({
            available_methods: await gateService.listMethods(),
            SDK_documentation: await gateService.getReadme(),
          }),
          type: "text",
        },
      ],
    };
  });

  server.tool(
    "Query Gate Exchange SDK Method Usage Information",
    {
      method: z.string({
        description: "The specific method name to query",
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

  return server;
};
