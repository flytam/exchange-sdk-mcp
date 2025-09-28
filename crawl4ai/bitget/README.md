# Bitget API 文档爬虫

基于 crawl4ai 0.7.x 框架实现的 Bitget API 文档爬取工具。

## 功能特性

- 🚀 基于 crawl4ai 0.7.x 框架，支持异步爬取
- 📄 自动提取页面标题、描述、HTTP路径和内容
- 🔄 智能分页处理，自动跟踪 `next_page` 链接
- 📝 HTML 内容自动转换为 Markdown 格式
- 💾 结果保存为序列化 JSON 文件
- 📊 详细的爬取日志和进度报告
- ⚙️ 可配置的爬取参数
- 🛡️ 完善的错误处理和重试机制

## 安装依赖

```bash
# 安装 Python 依赖
pip install -r requirements.txt

# 或者手动安装
pip install crawl4ai>=0.7.0 markdownify>=0.11.6
```

## 快速开始

### 基本用法

```bash
# 使用默认设置运行
python run.py

# 或者直接运行爬虫脚本
python crawler.py
```

### 高级用法

```bash
# 限制最大页面数
python run.py --max-pages 20

# 指定输出文件名
python run.py --output my_bitget_docs.json

# 设置请求间隔
python run.py --delay 2.0

# 试运行模式（只爬取第一页）
python run.py --dry-run

# 显示详细日志
python run.py --verbose

# 自定义输出目录
python run.py --output-dir ./my_output
```

## 配置说明

### Schema 配置 (schema.json)

```json
{
  "name": "www.bitget.com Schema",
  "baseSelector": ".container",
  "fields": [
    {
      "name": "title",
      "selector": "div.theme-doc-markdown.markdown > h1",
      "type": "text"
    },
    {
      "name": "description",
      "selector": "div.theme-doc-markdown.markdown > p",
      "type": "text"
    },
    {
      "name": "http_path",
      "selector": "div.theme-doc-markdown.markdown > ul > li:nth-of-type(1)",
      "type": "text"
    },
    {
      "name": "next_page",
      "selector": "div > nav.pagination-nav.docusaurus-mt-lg > a.pagination-nav__link.pagination-nav__link--next:nth-of-type(2)",
      "type": "attribute",
      "attribute": "href"
    },
    {
      "name": "content",
      "selector": "div.theme-doc-markdown.markdown",
      "type": "text"
    }
  ]
}
```

### 环境变量配置

```bash
# 最大爬取页面数
export BITGET_MAX_PAGES=100

# 页面超时时间（毫秒）
export BITGET_PAGE_TIMEOUT=30000

# 请求间隔（秒）
export BITGET_DELAY=1.0

# 页面加载等待时间（秒）
export BITGET_PAGE_DELAY=2.0
```

## 输出格式

爬取结果保存为 JSON 格式，每个页面包含以下字段：

```json
[
  {
    "title": "页面标题",
    "description": "页面描述",
    "http_path": "HTTP 路径信息",
    "next_page": "下一页链接",
    "content": "页面内容（Markdown 格式）",
    "current_url": "当前页面 URL",
    "crawled_at": "爬取时间戳"
  }
]
```

## 文件结构

```
bitget/
├── crawler.py          # 主爬虫脚本
├── run.py             # 运行脚本
├── config.py          # 配置文件
├── schema.json        # 数据提取 Schema
├── requirements.txt   # Python 依赖
├── README.md         # 项目文档
└── output/           # 输出目录
    ├── bitget_docs_*.json  # 爬取结果
    └── crawler_*.log       # 爬取日志
```

## 使用示例

### 1. 基本爬取

```python
import asyncio
from crawler import BitgetCrawler

async def main():
    crawler = BitgetCrawler()
    results = await crawler.crawl_all_pages(max_pages=10)
    output_file = crawler.save_results()
    print(f"结果保存在: {output_file}")

asyncio.run(main())
```

### 2. 自定义配置

```python
import asyncio
from crawler import BitgetCrawler

async def main():
    crawler = BitgetCrawler(
        schema_path="custom_schema.json",
        output_dir="custom_output"
    )

    results = await crawler.crawl_all_pages(max_pages=50)

    if results:
        output_file = crawler.save_results("custom_output.json")
        crawler.print_summary()

asyncio.run(main())
```

## 故障排除

### 常见问题

1. **依赖安装失败**

   ```bash
   # 升级 pip
   pip install --upgrade pip

   # 使用国内镜像
   pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple/
   ```

2. **爬取失败**

   - 检查网络连接
   - 确认目标网站可访问
   - 增加页面超时时间
   - 检查 schema 选择器是否正确

3. **内存不足**
   - 减少 `max_pages` 参数
   - 增加请求间隔 `--delay`
   - 分批次爬取

### 调试模式

```bash
# 启用详细日志
python run.py --verbose

# 试运行模式
python run.py --dry-run

# 检查第一页提取结果
python run.py --max-pages 1 --verbose
```

## 技术特性

- **异步爬取**: 基于 asyncio 和 crawl4ai 的异步架构
- **智能重试**: 自动处理网络错误和超时
- **内容清理**: 自动清理 HTML 标签和多余空格
- **URL 标准化**: 自动处理相对链接和绝对链接
- **循环检测**: 防止无限循环爬取
- **进度监控**: 实时显示爬取进度和统计信息

## 许可证

本项目基于 MIT 许可证开源。

## 贡献

欢迎提交 Issue 和 Pull Request！
