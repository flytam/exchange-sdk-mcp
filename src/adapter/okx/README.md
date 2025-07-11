# OKX API 离线数据生成工具

## API文档

- 官方文档: https://www.okx.com/docs-v5/zh/#overview

## 使用说明

### 准备工作

1. **获取API文档HTML内容**

   - 访问 [OKX API文档](https://www.okx.com/docs-v5/zh/#overview)
   - 使用浏览器开发者工具(F12)，右键点击页面并选择"查看网页源代码"
   - 将整个HTML内容复制并保存到 `src/adapter/okx/apiHtmlText.html` 文件中

2. **安装依赖**
   ```bash
   npm install
   ```

### 生成离线数据

运行以下命令生成离线数据：

```bash
# 从项目根目录执行
npx tsx ./src/adapter/okx/generateOfflineData.ts
```

成功执行后，将在 `src/adapter/okx` 目录下生成 `okx-offlineData.json` 文件，包含以下信息：

- API方法名称与端点的映射
- 从HTML文档中提取的API端点文档
- 从TypeScript定义文件中提取的方法信息（参数、返回类型等）

## 实现细节

脚本主要包含三个核心函数：

1. **getMethodEndpointMap**: 从GitHub上获取方法名与端点的映射关系
2. **getEndPointDoc**: 从HTML文档中提取API端点的详细说明
3. **extractMethodMapFromDts**: 从TypeScript定义文件中提取方法的参数和返回类型信息

这些信息被整合到一个JSON文件中，可用于SDK的离线文档和类型提示。
