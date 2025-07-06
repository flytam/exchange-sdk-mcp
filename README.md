# Crypto Exchange SDK Documentation MCP

[![npm version](https://img.shields.io/npm/v/crypto-exchange-mcp.svg)](https://www.npmjs.com/package/crypto-exchange-mcp)

[中文文档](./README-zh.md)

A Model Context Protocol (MCP) service designed to help developers easily access documentation when integrating with cryptocurrency exchange APIs.

## Features

- Query available methods from cryptocurrency exchange SDKs
- Retrieve detailed documentation for specific methods
- **Offline documentation** - all documentation is available offline, no internet connection required

## Currently Supported Exchanges

- Gate.io
- Binance TODO
- Bitget TODO
- OKX TODO
- Bybit TODO

## Installation

```bash
npm install -g crypto-exchange-mcp
```

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

1. `Query Gate Exchange SDK supported methods` - Lists all available methods in the Gate exchange SDK
2. `Query Gate Exchange SDK method usage information` - Retrieves detailed documentation for a specific method

## Architecture

The service is designed with extensibility in mind, allowing for easy addition of new exchanges in the future. Each exchange is implemented as an adapter that conforms to a common interface, making it simple to add support for additional exchanges.

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
```

## Contributing

Contributions are welcome! If you'd like to add support for a new exchange, please follow the adapter pattern established in the codebase.

## License

MIT
