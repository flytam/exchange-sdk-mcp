# Crypto Exchange SDK Documentation MCP

[![npm version](https://img.shields.io/npm/v/crypto-exchange-mcp.svg)](https://www.npmjs.com/package/crypto-exchange-mcp)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/flytam/exchange-sdk-mcp/npm-publish.yml?label=publish)](https://github.com/flytam/exchange-sdk-mcp/actions/workflows/npm-publish.yml)

[中文文档](./README-zh.md)

A Model Context Protocol (MCP) service designed to help developers easily access documentation when integrating with cryptocurrency exchange APIs. This tool provides comprehensive offline documentation for multiple cryptocurrency exchanges, making it convenient to query API methods and usage information without requiring an internet connection.

## Features

- Query available methods from cryptocurrency exchange SDKs
- Retrieve detailed documentation for specific methods
- **Offline documentation** - all documentation is available offline, no internet connection required

<img width="400" height="200" alt="Image" src="https://github.com/user-attachments/assets/78bdddc3-ff50-404e-99f7-123d37df411c" />

<img width="400" height="200" alt="Image" src="https://github.com/user-attachments/assets/f2b47d73-c788-4db6-8883-761a41a0cad9" />

## Currently Supported Exchanges

| Exchange SDK                                                                                                   | Status |
| -------------------------------------------------------------------------------------------------------------- | ------ |
| [Gate.io SDK](https://www.npmjs.com/package/gateio-api) [Docs](https://www.gate.com/docs/developers/apiv4)     | ✅     |
| [Bybit SDK](https://www.npmjs.com/package/bybit-api) [Docs](https://bybit-exchange.github.io/docs/v5/intro)    | ✅     |
| [Binance SDK](https://www.npmjs.com/package/binance) [Docs WIP](https://developers.binance.com/en)             | ✅     |
| [Bitget SDK](https://www.npmjs.com/package/bitget-api) [Docs WIP](https://www.bitget.com/api-doc/common/intro) | ✅     |
| [OKX SDK](https://www.npmjs.com/package/okx-api) [Docs](https://www.okx.com/docs-v5/en/#overview)              | ✅     |
| [OKX DEX](https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-what-is-dex-api)                             | ✅     |

## Configuration

```json
{
  "mcpServers": {
    "crypto-exchange-mcp": {
      "command": "npx",
      "args": ["-y", "crypto-exchange-mcp@latest"]
    }
  }
}
```

## Usage

This MCP service provides the following tools for each exchange:

### Gate.io

- `gate_methods` - Get all API method lists and related documentation supported by Gate Exchange SDK
- `gate_method_detail` - Query detailed usage information for specific API methods in Gate Exchange SDK

### OKX

- `okx_methods` - Get all API method lists and related documentation supported by OKX Exchange SDK
- `okx_method_detail` - Query detailed usage information for specific API methods in OKX Exchange SDK

### OKX DEX

- `okx_dex_api_methods` - Get all API method lists and related documentation supported by OKX DEX API
- `okx_dex_api_method_detail` - Query detailed usage information for specific API methods in OKX DEX API

### Bybit

- `bybit_methods` - Get all API method lists and related documentation supported by Bybit Exchange SDK
- `bybit_method_detail` - Query detailed usage information for specific API methods in Bybit Exchange SDK

### Binance

- `binance_methods` - Get all API method lists and related documentation supported by Binance Exchange SDK
- `binance_method_detail` - Query detailed usage information for specific API methods in Binance Exchange SDK

### Bitget

- `bitget_methods` - Get all API method lists and related documentation supported by Bitget Exchange SDK
- `bitget_method_detail` - Query detailed usage information for specific API methods in Bitget Exchange SDK

## Architecture

The service is designed with extensibility in mind, making it easy to add support for new exchanges in the future. Each exchange is implemented as an adapter following a common interface, making it simple to add support for new exchanges.

## Requirements

- Node.js >= 22

## Development

```bash
# Install dependencies
pnpm install
```

# Build the project

```
pnpm run build
```

# Development mode (watch for changes)

```
pnpm run dev
```

# Test with MCP inspector

```
pnpm run inspect
```

# Generate offline data for exchanges

```
pnpm run generateOfflineData

```

## Contributing

Contributions are welcome! If you'd like to add support for a new exchange, please follow the adapter pattern established in the codebase.

## License

MIT
