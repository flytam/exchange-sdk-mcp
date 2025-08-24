import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ExchangeAdapter } from "../interface";
import { z } from "zod";

/**
 * Universal tool registration function for registering standardized MCP tools for exchange adapters
 * @param server MCP server instance
 * @param exchangeName Exchange name (e.g., "Gate", "OKX", "Binance")
 * @param adapter Exchange adapter instance
 * @param toolSuffix Tool name suffix (optional, used to distinguish different types of APIs, e.g., "DEX API")
 */
export const registerExchangeTools = (
  server: McpServer,
  exchangeName: string,
  adapter: ExchangeAdapter,
  toolSuffix: string = "",
) => {
  const displayName = toolSuffix
    ? `${exchangeName} ${toolSuffix}`
    : `${exchangeName} Exchange SDK`;

  // Generate simplified tool names
  const methodsToolName = toolSuffix
    ? `${exchangeName.toLowerCase()}_${toolSuffix.toLowerCase().replace(/\s+/g, "_")}_methods`
    : `${exchangeName.toLowerCase()}_methods`;

  const methodDetailToolName = toolSuffix
    ? `${exchangeName.toLowerCase()}_${toolSuffix.toLowerCase().replace(/\s+/g, "_")}_method_detail`
    : `${exchangeName.toLowerCase()}_method_detail`;

  // Register tool for querying supported methods
  server.tool(
    methodsToolName,
    `Get all API method lists and related documentation supported by ${displayName}. This tool returns a complete method inventory, including basic descriptions and usage instructions for each method, helping developers understand available functional interfaces.`,
    async () => {
      return {
        content: [
          {
            text: JSON.stringify({
              available_methods: await adapter.listMethods(),
              SDK_documentation: await adapter.getReadme(),
            }),
            type: "text",
          },
        ],
      };
    },
  );

  // Register tool for querying specific method usage information
  server.tool(
    methodDetailToolName,
    `Query detailed usage information for specific API methods in ${displayName}. Provides complete technical documentation including request parameters, response formats, usage examples, error handling, etc., helping developers correctly integrate and use corresponding API interfaces.`,
    {
      method: z.string().describe("The specific method name to query"),
    },
    async ({ method }) => {
      return {
        content: [
          {
            text: JSON.stringify(await adapter.getDoc(method)),
            type: "text",
          },
        ],
      };
    },
  );

  return server;
};
