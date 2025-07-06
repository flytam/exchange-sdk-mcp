# 加密货币交易所 SDK 文档查询 MCP

[![npm 版本](https://img.shields.io/npm/v/crypto-exchange-mcp.svg)](https://www.npmjs.com/package/crypto-exchange-mcp)

[English](./README.md)

这是一个MCP（Model Context Protocol）服务，用于帮助开发者在开发加密货币交易所API对接时方便地查询文档。

## 功能

- 查询交易所SDK支持的方法列表
- 查询特定方法的详细使用信息和文档
- **离线文档** - 所有文档均为离线数据，无需网络连接

## 当前支持的交易所

- Gate.io
- 币安 (Binance) TODO
- Bitget TODO
- OKX TODO
- Bybit TODO

## 安装

```bash
npm install -g crypto-exchange-mcp
```

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

1. `查询 Gate交易所 SDK 支持的方法` - 列出所有可用的Gate交易所SDK方法
2. `查询 Gate交易所 SDK 方法的使用信息` - 获取特定方法的详细文档

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
```

## 贡献

欢迎贡献！如果你想添加对新交易所的支持，请遵循代码库中建立的适配器模式。

## 许可证

MIT
