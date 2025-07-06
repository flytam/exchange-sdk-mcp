import { startMcpServer } from "./mcp.js";

async function main() {
  const options = {};
  await startMcpServer(options);
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
