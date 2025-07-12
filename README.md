# Crypto Exchange SDK Documentation MCP

[![npm version](https://img.shields.io/npm/v/crypto-exchange-mcp.svg)](https://www.npmjs.com/package/crypto-exchange-mcp)
[![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](https://www.npmjs.com/package/crypto-exchange-mcp)

[中文文档](./README-zh.md)

A Model Context Protocol (MCP) service designed to help developers easily access documentation when integrating with cryptocurrency exchange APIs. This tool provides comprehensive offline documentation for multiple cryptocurrency exchanges, making it convenient to query API methods and usage information without requiring an internet connection.

## Features

- Query available methods from cryptocurrency exchange SDKs
- Retrieve detailed documentation for specific methods
- **Offline documentation** - all documentation is available offline, no internet connection required

<img width="400" height="200" alt="Image" src="https://github.com/user-attachments/assets/00fc3ea1-2d05-4fcd-ab60-1fa00cf3d87e" />

<img width="400" height="200" alt="Image" src="https://github.com/user-attachments/assets/3296b13d-f10b-471a-8cce-199ddfd0ec9c" />

## Currently Supported Exchanges

| Exchange                                            | Status |
| --------------------------------------------------- | ------ |
| [Gate.io](https://www.npmjs.com/package/gateio-api) | ✅     |
| [Bybit](https://www.npmjs.com/package/bybit-api)    | ✅     |
| Binance                                             | TODO   |
| Bitget                                              | TODO   |
| [OKX](https://www.npmjs.com/package/okx-api)        | ✅     |
| OKX DEX                                             | TODO   |

## Configuration

```json
{
  "mcpServers": {
    "crypto-exchange-mcp": {
      "command": "npx",
      "args": ["-y", "crypto-exchange-mcp"]
    }
  }
}
```

## Usage

This MCP service provides the following tools:

1. `Query Exchange SDK supported methods` - Lists all available methods for the exchange SDK
2. `Query Exchange SDK method usage information` - Gets detailed documentation for a specific method
3. `Query Exchange SDK README` - Gets the README content of the exchange SDK project

## Architecture

The service is designed with extensibility in mind, making it easy to add support for new exchanges in the future. Each exchange is implemented as an adapter following a common interface, making it simple to add support for new exchanges.

## Development

```bash
# Install dependencies
pnpm install

# Build the project
pnpm run build

# Development mode (watch for changes)
pnpm run dev

# Test with MCP inspector
pnpm run inspect

# Generate offline data for exchanges
pnpm run generateOfflineData
```

## Contributing

Contributions are welcome! If you'd like to add support for a new exchange, please follow the adapter pattern established in the codebase.

## License

MIT
