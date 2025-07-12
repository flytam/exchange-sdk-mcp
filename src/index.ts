#!/usr/bin/env node

import { startMcpServer } from "./mcp.js";
import packageJson from "../package.json";

async function main() {
  console.log(
    `=== Cryptocurrency Exchange SDK Documentation MCP v${packageJson.version} ===`,
  );
  console.log("Supported exchanges: Gate.io, Bybit, OKX, Binance, Bitget");

  const options = {};
  await startMcpServer(options);
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
