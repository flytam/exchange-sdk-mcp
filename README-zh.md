# 加密货币交易所 SDK 文档查询 MCP

[![npm 版本](https://img.shields.io/npm/v/crypto-exchange-mcp.svg)](https://www.npmjs.com/package/crypto-exchange-mcp)
[![GitHub Actions 工作流状态](https://img.shields.io/github/actions/workflow/status/flytam/exchange-sdk-mcp/npm-publish.yml?label=publish)](https://github.com/flytam/exchange-sdk-mcp/actions/workflows/npm-publish.yml)

[English](./README.md)

这是一个MCP（Model Context Protocol）服务，用于帮助开发者在开发加密货币交易所API对接时方便地查询文档。该工具提供多个加密货币交易所的全面离线文档，使开发者能够在没有网络连接的情况下方便地查询API方法和使用信息。

## 功能

- 查询交易所SDK支持的方法列表
- 查询特定方法的详细使用信息和文档
- **离线文档** - 所有文档均为离线数据，无需网络连接

<img width="400" height="200" alt="Image" src="https://github.com/user-attachments/assets/00fc3ea1-2d05-4fcd-ab60-1fa00cf3d87e" />

<img width="400" height="200" alt="Image" src="https://github.com/user-attachments/assets/3296b13d-f10b-471a-8cce-199ddfd0ec9c" />

## 当前支持的交易所

| 交易所 SDK                                                                                                     | 状态 |
| -------------------------------------------------------------------------------------------------------------- | ---- |
| [Gate.io SDK](https://www.npmjs.com/package/gateio-api) [文档](https://www.gate.com/docs/developers/apiv4)     | ✅   |
| [Bybit SDK](https://www.npmjs.com/package/bybit-api) [文档](https://bybit-exchange.github.io/docs/v5/intro)    | ✅   |
| [币安 SDK](https://www.npmjs.com/package/binance) [文档 WIP](https://developers.binance.com/en)                | ✅   |
| [Bitget SDK](https://www.npmjs.com/package/bitget-api) [文档 WIP](https://www.bitget.com/api-doc/common/intro) | ✅   |
| [OKX SDK](https://www.npmjs.com/package/okx-api) [文档](https://www.okx.com/docs-v5/en/#overview)              | ✅   |
| [OKX DEX](https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-what-is-dex-api)                             | ✅   |

## 配置

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

## 使用方法

该MCP服务为每个交易所提供以下工具：

### Gate.io

- `gate_methods` - 获取Gate.io Exchange SDK支持的所有API方法列表
- `gate_method_detail` - 查询Gate.io Exchange SDK中特定方法的详细使用信息

### OKX

- `okx_methods` - 获取OKX Exchange SDK支持的所有API方法列表
- `okx_method_detail` - 查询OKX Exchange SDK中特定方法的详细使用信息

### OKX DEX

- `okx_dex_api_methods` - 获取OKX DEX API支持的所有API方法列表
- `okx_dex_api_method_detail` - 查询OKX DEX API中特定方法的详细使用信息

### Bybit

- `bybit_methods` - 获取Bybit Exchange SDK支持的所有API方法列表
- `bybit_method_detail` - 查询Bybit Exchange SDK中特定方法的详细使用信息

### Binance

- `binance_methods` - 获取Binance Exchange SDK支持的所有API方法列表
- `binance_method_detail` - 查询Binance Exchange SDK中特定方法的详细使用信息

### Bitget

- `bitget_methods` - 获取Bitget Exchange SDK支持的所有API方法列表
- `bitget_method_detail` - 查询Bitget Exchange SDK中特定方法的详细使用信息

## 架构

该服务设计具有良好的扩展性，便于未来添加新的交易所支持。每个交易所都实现为一个适配器，遵循通用接口，使添加新交易所支持变得简单。

## 系统要求

- Node.js >= 22

## 开发

```bash
# 安装依赖
pnpm install
```

# 构建项目

```

pnpm run build

```

# 开发模式（监视文件变化）

```

pnpm run dev

```

# 使用MCP检查器测试

```

pnpm run inspect

```

# 生成交易所离线数据

```

pnpm run generateOfflineData

```

## 贡献

欢迎贡献！如果你想添加对新交易所的支持，请遵循代码库中建立的适配器模式。

## 许可证

MIT
