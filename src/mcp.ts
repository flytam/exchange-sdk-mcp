import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerGateTools } from "./adapter/gate";
import { registerBybitTools } from "./adapter/bybit";
import { registerOkxTools } from "./adapter/okx";
import { registerOkxDexTools } from "./adapter/okx-dex";
import { registerBinanceTools } from "./adapter/binance";
import { registerBitgetTools } from "./adapter/bitget";
import packageJson from "../package.json";

interface CommandOptions {}

const createMcpServer = () =>
  new McpServer({
    name: "crypto-exchange-mcp",
    description:
      "Cryptocurrency Exchange Documentation Service, providing API methods and documentation",
    version: packageJson.version,
  });

const connectServer = async (server: McpServer) => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log(
    "Cryptocurrency Exchange SDK Documentation MCP service connected via stdio.",
  );
  return server;
};

export const startMcpServer = async (options: CommandOptions = {}) => {
  try {
    console.log(
      `Starting Cryptocurrency Exchange SDK Documentation MCP service v${packageJson.version}...`,
    );
    const server = createMcpServer();

    console.log("Registering Gate.io exchange tools...");
    registerGateTools(server);

    console.log("Registering Bybit exchange tools...");
    registerBybitTools(server);

    console.log("Registering OKX exchange tools...");
    registerOkxTools(server);

    console.log("Registering OKX DEX API tools...");
    registerOkxDexTools(server);

    console.log("Registering Binance exchange tools...");
    registerBinanceTools(server);

    console.log("Registering Bitget exchange tools...");
    registerBitgetTools(server);

    await connectServer(server);
    console.log("MCP service started successfully, available tools:");
    console.log("1. Query [Exchange] SDK Supported Methods");
    console.log("2. Query [Exchange] SDK Method Usage Information");
  } catch (error) {
    console.error("Failed to start MCP service:", error);
    process.exit(1);
  }
};
