#!/usr/bin/env python3
"""
Bitget API 文档爬虫
基于 crawl4ai 0.7.x 框架实现
"""

import asyncio
import json
import logging
import re
from pathlib import Path
from typing import Dict, List, Optional, Any
from urllib.parse import urljoin, urlparse
from datetime import datetime

try:
    from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, CacheMode
    from crawl4ai.extraction_strategy import JsonCssExtractionStrategy
except ImportError:
    print("错误: 请安装 crawl4ai")
    print("运行: pip install crawl4ai>=0.7.0")
    exit(1)

try:
    from markdownify import markdownify as md
except ImportError:
    print("错误: 请安装 markdownify")
    print("运行: pip install markdownify")
    exit(1)


class BitgetCrawler:
    """Bitget API 文档爬虫"""
    
    def __init__(self, schema_path: str = "schema.json", output_dir: str = "output"):
        self.schema_path = Path(schema_path)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # 设置日志
        self.setup_logging()
        
        # 加载 schema
        self.schema = self.load_schema()
        
        # 初始化爬取结果
        self.results: List[Dict[str, Any]] = []
        self.visited_urls = set()
        
        # 基础 URL
        self.base_url = "https://www.bitget.com"
        self.start_url = "https://www.bitget.com/zh-CN/api-doc/uta/intro"
        
    def setup_logging(self):
        """设置日志记录"""
        log_file = self.output_dir / f"crawler_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file, encoding='utf-8'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        
    def load_schema(self) -> Dict[str, Any]:
        """加载提取 schema"""
        try:
            with open(self.schema_path, 'r', encoding='utf-8') as f:
                schema = json.load(f)
            self.logger.info(f"成功加载 schema: {self.schema_path}")
            return schema
        except Exception as e:
            self.logger.error(f"加载 schema 失败: {e}")
            raise
            
    def html_to_markdown(self, html_content: str) -> str:
        """将 HTML 内容转换为 Markdown"""
        if not html_content:
            return ""
            
        try:
            # 使用 markdownify 转换
            markdown_content = md(
                html_content,
                heading_style="ATX",  # 使用 # 风格的标题
                bullets="-",  # 使用 - 作为列表符号
                strip=['script', 'style'],  # 移除脚本和样式
                convert=['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'a', 'strong', 'em']
            )
            
            # 清理多余的空行
            markdown_content = re.sub(r'\n\s*\n\s*\n', '\n\n', markdown_content)
            markdown_content = markdown_content.strip()
            
            return markdown_content
        except Exception as e:
            self.logger.warning(f"HTML 转 Markdown 失败: {e}")
            return html_content
            
    def clean_extracted_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """清理提取的数据"""
        cleaned_data = {}
        
        for key, value in data.items():
            if isinstance(value, str):
                # 清理字符串
                cleaned_value = value.strip()
                cleaned_value = re.sub(r'\s+', ' ', cleaned_value)  # 合并多个空格
                cleaned_data[key] = cleaned_value
            elif isinstance(value, list) and value:
                # 如果是列表，取第一个非空元素
                for item in value:
                    if item and isinstance(item, str) and item.strip():
                        cleaned_data[key] = item.strip()
                        break
                else:
                    cleaned_data[key] = ""
            else:
                cleaned_data[key] = value if value else ""
                
        return cleaned_data
        
    def normalize_url(self, url: str, base_url: str) -> str:
        """标准化 URL"""
        if not url:
            return ""
            
        # 如果是相对 URL，转换为绝对 URL
        if url.startswith('/'):
            return urljoin(base_url, url)
        elif url.startswith('http'):
            return url
        else:
            return urljoin(base_url, url)
            
    async def extract_page_data(self, crawler: AsyncWebCrawler, url: str) -> Optional[Dict[str, Any]]:
        """提取单个页面的数据"""
        try:
            self.logger.info(f"正在爬取: {url}")
            
            # 创建提取策略
            extraction_strategy = JsonCssExtractionStrategy(self.schema, verbose=True)
            
            # 配置爬取参数
            config = CrawlerRunConfig(
                extraction_strategy=extraction_strategy,
                cache_mode=CacheMode.BYPASS,
                page_timeout=30000,  # 30秒超时
                delay_before_return_html=2.0,  # 等待页面加载
                remove_overlay_elements=True,
                simulate_user=True,
                override_navigator=True
            )
            
            # 执行爬取
            result = await crawler.arun(url=url, config=config)
            
            if not result.success:
                self.logger.error(f"爬取失败: {url} - {result.error_message}")
                return None
                
            # 解析提取的数据
            if result.extracted_content:
                try:
                    extracted_data = json.loads(result.extracted_content)
                    if isinstance(extracted_data, list) and extracted_data:
                        extracted_data = extracted_data[0]  # 取第一个结果
                    elif not isinstance(extracted_data, dict):
                        self.logger.warning(f"提取数据格式异常: {url}")
                        return None
                        
                    # 清理数据
                    cleaned_data = self.clean_extracted_data(extracted_data)
                    
                    # 转换内容为 Markdown
                    if cleaned_data.get('content'):
                        cleaned_data['content'] = self.html_to_markdown(cleaned_data['content'])
                    
                    # 标准化 next_page URL
                    if cleaned_data.get('next_page'):
                        cleaned_data['next_page'] = self.normalize_url(cleaned_data['next_page'], self.base_url)
                    
                    # 添加当前页面 URL
                    cleaned_data['current_url'] = url
                    cleaned_data['crawled_at'] = datetime.now().isoformat()
                    
                    self.logger.info(f"成功提取数据: {url}")
                    return cleaned_data
                    
                except json.JSONDecodeError as e:
                    self.logger.error(f"JSON 解析失败: {url} - {e}")
                    return None
            else:
                self.logger.warning(f"未提取到数据: {url}")
                return None
                
        except Exception as e:
            self.logger.error(f"页面处理异常: {url} - {e}")
            return None
            
    async def crawl_all_pages(self, max_pages: int = 100) -> List[Dict[str, Any]]:
        """爬取所有页面"""
        self.logger.info("开始爬取 Bitget API 文档")
        
        async with AsyncWebCrawler(verbose=True) as crawler:
            current_url = self.start_url
            page_count = 0
            
            while current_url and page_count < max_pages:
                # 检查是否已访问过
                if current_url in self.visited_urls:
                    self.logger.warning(f"检测到循环链接，停止爬取: {current_url}")
                    break
                    
                # 标记为已访问
                self.visited_urls.add(current_url)
                page_count += 1
                
                # 提取页面数据
                page_data = await self.extract_page_data(crawler, current_url)
                
                if page_data:
                    self.results.append(page_data)
                    self.logger.info(f"已爬取 {page_count} 页，当前页面: {page_data.get('title', 'Unknown')}")
                    
                    # 获取下一页 URL
                    next_url = page_data.get('next_page')
                    if next_url and next_url.strip():
                        current_url = next_url
                        self.logger.info(f"下一页: {current_url}")
                    else:
                        self.logger.info("没有更多页面，爬取完成")
                        break
                else:
                    self.logger.error(f"页面数据提取失败，停止爬取: {current_url}")
                    break
                    
                # 添加延迟避免过于频繁的请求
                await asyncio.sleep(1)
                
        self.logger.info(f"爬取完成，共处理 {len(self.results)} 页")
        return self.results
        
    def save_results(self, filename: str = None) -> str:
        """保存爬取结果"""
        if not filename:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"bitget_docs_{timestamp}.json"
            
        output_file = self.output_dir / filename
        
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(self.results, f, ensure_ascii=False, indent=2)
                
            self.logger.info(f"结果已保存到: {output_file}")
            return str(output_file)
        except Exception as e:
            self.logger.error(f"保存结果失败: {e}")
            raise
            
    def print_summary(self):
        """打印爬取摘要"""
        print("\n" + "="*60)
        print("Bitget API 文档爬取摘要")
        print("="*60)
        print(f"总页面数: {len(self.results)}")
        print(f"访问的 URL 数: {len(self.visited_urls)}")
        
        if self.results:
            print(f"第一页标题: {self.results[0].get('title', 'Unknown')}")
            print(f"最后一页标题: {self.results[-1].get('title', 'Unknown')}")
            
            # 统计内容长度
            total_content_length = sum(len(item.get('content', '')) for item in self.results)
            print(f"总内容长度: {total_content_length:,} 字符")
            
            # 显示前几页的标题
            print("\n前 5 页标题:")
            for i, item in enumerate(self.results[:5], 1):
                title = item.get('title', 'Unknown')[:50]
                print(f"  {i}. {title}")
                
        print("="*60)


async def main():
    """主函数"""
    # 获取脚本所在目录
    script_dir = Path(__file__).parent
    
    # 初始化爬虫
    crawler = BitgetCrawler(
        schema_path=script_dir / "schema.json",
        output_dir=script_dir / "output"
    )
    
    try:
        # 执行爬取
        results = await crawler.crawl_all_pages(max_pages=50)  # 限制最大页面数
        
        # 保存结果
        if results:
            output_file = crawler.save_results()
            crawler.print_summary()
            print(f"\n✅ 爬取完成！结果保存在: {output_file}")
        else:
            print("❌ 没有爬取到任何数据")
            
    except KeyboardInterrupt:
        print("\n⚠️ 用户中断爬取")
        if crawler.results:
            output_file = crawler.save_results("bitget_docs_interrupted.json")
            print(f"已保存部分结果: {output_file}")
    except Exception as e:
        print(f"❌ 爬取过程中发生错误: {e}")
        if crawler.results:
            output_file = crawler.save_results("bitget_docs_error.json")
            print(f"已保存部分结果: {output_file}")


if __name__ == "__main__":
    asyncio.run(main())