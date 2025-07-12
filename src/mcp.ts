import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"; // Assuming stdio transport is still desired
import { registerGateTools } from "./adapter/gate";
import { registerBybitTools } from "./adapter/bybit";
import { registerOkxTools } from "./adapter/okx";
import { registerBinanceTools } from "./adapter/binance";
import { registerBitgetTools } from "./adapter/bitget";
// 直接导入 package.json
import packageJson from "../package.json";

interface CommandOptions {}

const createMcpServer = () =>
  new McpServer({
    name: "crypto-exchange-mcp",
    description:
      "MCP server for querying cryptocurrency exchange SDK documentation and API methods",
    version: packageJson.version,
  });

const connectServer = async (server: McpServer) => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("MCP server connected via stdio.");
  return server;
};

export const startMcpServer = async (options: CommandOptions = {}) => {
  try {
    const server = createMcpServer();
    registerGateTools(server);
    registerBybitTools(server);
    registerOkxTools(server);
    registerBinanceTools(server);
    registerBitgetTools(server);
    await connectServer(server);
  } catch (error) {
    console.error("Failed to start  MCP server:", error);
    // Graceful exit or error handling
    process.exit(1);
  }
};
