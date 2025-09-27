import * as cheerio from "cheerio";
import { promises as fs } from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import TurndownService from "turndown";

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docList = [
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-use-swap-solana-quick-start",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-use-swap-solana-advance-control",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-use-swap-quick-start",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-use-swap-sui-quick-start",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-use-swap-ton-quick-start",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-swap-api-introduction",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-api-reference",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-api-addfee",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-smart-contract",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-error-code",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-aggregation-faq",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-onchain-gateway-api-introduction",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-onchain-gateway-reference",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-onchain-gateway-error-code",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-market-price-reference",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-market-price-error-code",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-websocket",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-index-price-reference",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-index-price-chains",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-index-price",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-historical-index-price",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-index-price-error-code",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-balance-reference",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-balance-error-code",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-tx-history-reference",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-tx-history-error-code",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-sdk-introduction",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-sdk-evm",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-sdk-solana",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/dex-sdk-sui",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/private-key-wallet-javascript-sdk",
  "https://web3.okx.com/zh-hans/build/dev-docs/dex-api/private-key-wallet-go-sdk",
];
export const generateOfflineData = async () => {
  console.log("OKX DEX: 开始生成离线数据...");

  const methodsMap: Record<string, { doc: string }> = {};

  // 创建 turndown 实例用于 HTML 转 Markdown
  const turndownService = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
  });

  for (let i = 0; i < docList.length; i++) {
    const url = docList[i];
    console.log(
      `OKX DEX: 正在抓取第 ${i + 1}/${docList.length} 个文档: ${url}`,
    );

    try {
      // 抓取网页内容
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`OKX DEX: 抓取失败 ${url}: ${response.status}`);
        continue;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // 查找 doc-content 类的元素
      const docContentElements = $(".doc-content");

      if (docContentElements.length === 0) {
        console.warn(`OKX DEX: 未找到 doc-content 元素: ${url}`);
        continue;
      }

      docContentElements.each((index, element) => {
        const $element = $(element);

        // 查找 h1 标签作为方法名
        const h1Element = $element.find("h1").first();
        if (h1Element.length === 0) {
          console.warn(`OKX DEX: 未找到 h1 标签: ${url}`);
          return;
        }

        let methodName = h1Element.text().trim();
        if (!methodName) {
          console.warn(`OKX DEX: h1 标签内容为空: ${url}`);
          return;
        }

        // 去掉方法名前后的 # 符号
        methodName = methodName.replace(/^#+|#+$/g, "").trim();

        // 获取整个 doc-content 的内容作为文档
        const docContent = $element.html() || "";

        // 使用 turndown 将 HTML 转换为 Markdown
        const markdownDoc = turndownService.turndown(docContent);

        // 生成唯一的方法名（如果重复，添加后缀）
        let uniqueMethodName = methodName;
        let counter = 1;
        while (methodsMap[uniqueMethodName]) {
          uniqueMethodName = `${methodName}_${counter}`;
          counter++;
        }

        methodsMap[uniqueMethodName] = {
          doc: markdownDoc.trim(),
        };

        console.log(`OKX DEX: 成功提取方法: ${uniqueMethodName}`);
      });
    } catch (error) {
      console.error(`OKX DEX: 抓取出错 ${url}:`, error);
    }

    // 添加延迟以避免过于频繁的请求
    if (i < docList.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  // Convert methods object to array and sort by name
  const methods = Object.keys(methodsMap)
    .sort()
    .map((methodName) => ({
      name: methodName,
      doc: methodsMap[methodName].doc,
      methodInfo: {}, // OKX DEX doesn't have methodInfo, use empty object
    }));

  const result = {
    methods,
    readme: "", // OKX DEX doesn't have readme
    example: [], // OKX DEX doesn't have examples
  };

  console.log(`OKX DEX: 数据抓取完成，共提取了 ${methods.length} 个方法`);

  // 输出到文件
  const outputPath = path.resolve(__dirname, "./okx-dex-offline-data.json");
  await fs.writeFile(outputPath, JSON.stringify(result, null, 2), "utf-8");

  console.log(`OKX DEX: 离线数据已保存到: ${outputPath}`);

  return result;
};

console.log("OKX DEX: 开始执行离线数据生成流程...");
generateOfflineData()
  .then(() => {
    console.log("OKX DEX: 离线数据生成完成!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("OKX DEX: 离线数据生成失败:", error);
    process.exit(1);
  });
