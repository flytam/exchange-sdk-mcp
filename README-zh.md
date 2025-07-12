# 加密货币交易所 SDK 文档查询 MCP

[![npm 版本](https://img.shields.io/npm/v/crypto-exchange-mcp.svg)](https://www.npmjs.com/package/crypto-exchange-mcp)
[![版本](https://img.shields.io/badge/version-1.2.0-blue.svg)](https://www.npmjs.com/package/crypto-exchange-mcp)

[English](./README.md)

这是一个MCP（Model Context Protocol）服务，用于帮助开发者在开发加密货币交易所API对接时方便地查询文档。该工具提供多个加密货币交易所的全面离线文档，使开发者能够在没有网络连接的情况下方便地查询API方法和使用信息。

## 功能

- 查询交易所SDK支持的方法列表
- 查询特定方法的详细使用信息和文档
- **离线文档** - 所有文档均为离线数据，无需网络连接

<img width="400" height="200" alt="Image" src="https://github.com/user-attachments/assets/00fc3ea1-2d05-4fcd-ab60-1fa00cf3d87e" />

<img width="400" height="200" alt="Image" src="https://github.com/user-attachments/assets/3296b13d-f10b-471a-8cce-199ddfd0ec9c" />

## 当前支持的交易所

| 交易所                                              | 状态 |
| --------------------------------------------------- | ---- |
| [Gate.io](https://www.npmjs.com/package/gateio-api) | ✅   |
| [Bybit](https://www.npmjs.com/package/bybit-api)    | ✅   |
| 币安 (Binance)                                      | TODO |
| Bitget                                              | TODO |
| [OKX](https://www.npmjs.com/package/okx-api)        | ✅   |
| OKX DEX                                             | TODO |

## 配置

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

## 使用方法

该MCP服务提供以下工具：

1. `查询 交易所 SDK 支持的方法` - 列出所有可用的交易所SDK方法
2. `查询 交易所 SDK 方法的使用信息` - 获取特定方法的详细文档
3. `查询 交易所 SDK 项目的 README` - 获取交易所SDK项目的README内容

## 架构

该服务设计具有良好的扩展性，便于未来添加新的交易所支持。每个交易所都实现为一个适配器，遵循通用接口，使添加新交易所支持变得简单。

## 开发

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm run build

# 开发模式（监视文件变化）
pnpm run dev

# 使用MCP检查器测试
pnpm run inspect

# 生成交易所离线数据
pnpm run generateOfflineData
```

## 贡献

欢迎贡献！如果你想添加对新交易所的支持，请遵循代码库中建立的适配器模式。

## 许可证

MIT
