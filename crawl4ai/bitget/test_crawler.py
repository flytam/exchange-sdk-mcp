#!/usr/bin/env python3
"""
Bitget 爬虫测试脚本
用于验证爬虫功能是否正常工作
"""

import asyncio
import json
import sys
from pathlib import Path

# 添加当前目录到 Python 路径
sys.path.insert(0, str(Path(__file__).parent))

from crawler import BitgetCrawler


async def test_schema_loading():
    """测试 schema 加载"""
    print("🧪 测试 schema 加载...")
    try:
        crawler = BitgetCrawler()
        schema = crawler.schema
        
        # 检查必要字段
        required_fields = ['title', 'description', 'http_path', 'next_page', 'content']
        schema_fields = [field['name'] for field in schema.get('fields', [])]
        
        missing_fields = [field for field in required_fields if field not in schema_fields]
        
        if missing_fields:
            print(f"❌ Schema 缺少字段: {missing_fields}")
            return False
        else:
            print(f"✅ Schema 加载成功，包含字段: {schema_fields}")
            return True
            
    except Exception as e:
        print(f"❌ Schema 加载失败: {e}")
        return False


async def test_single_page_extraction():
    """测试单页面提取"""
    print("🧪 测试单页面数据提取...")
    try:
        crawler = BitgetCrawler()
        
        # 测试提取单个页面
        from crawl4ai import AsyncWebCrawler
        async with AsyncWebCrawler(verbose=True) as web_crawler:
            page_data = await crawler.extract_page_data(web_crawler, crawler.start_url)
            
        if page_data:
            print("✅ 单页面提取成功")
            print(f"   标题: {page_data.get('title', 'N/A')[:50]}...")
            print(f"   描述: {page_data.get('description', 'N/A')[:50]}...")
            print(f"   HTTP路径: {page_data.get('http_path', 'N/A')[:50]}...")
            print(f"   下一页: {page_data.get('next_page', 'N/A')[:50]}...")
            print(f"   内容长度: {len(page_data.get('content', ''))}")
            return True
        else:
            print("❌ 单页面提取失败")
            return False
            
    except Exception as e:
        print(f"❌ 单页面提取异常: {e}")
        return False


async def test_markdown_conversion():
    """测试 Markdown 转换"""
    print("🧪 测试 Markdown 转换...")
    try:
        crawler = BitgetCrawler()
        
        # 测试 HTML 转 Markdown
        test_html = """
        <h1>测试标题</h1>
        <p>这是一个测试段落。</p>
        <ul>
            <li>列表项 1</li>
            <li>列表项 2</li>
        </ul>
        <code>代码示例</code>
        """
        
        markdown_result = crawler.html_to_markdown(test_html)
        
        if markdown_result and "# 测试标题" in markdown_result:
            print("✅ Markdown 转换成功")
            print(f"   转换结果: {markdown_result[:100]}...")
            return True
        else:
            print("❌ Markdown 转换失败")
            return False
            
    except Exception as e:
        print(f"❌ Markdown 转换异常: {e}")
        return False


async def test_url_normalization():
    """测试 URL 标准化"""
    print("🧪 测试 URL 标准化...")
    try:
        crawler = BitgetCrawler()
        
        # 测试各种 URL 格式
        test_cases = [
            ("/zh-CN/api-doc/uta/account", "https://www.bitget.com/zh-CN/api-doc/uta/account"),
            ("https://www.bitget.com/zh-CN/api-doc/uta/trade", "https://www.bitget.com/zh-CN/api-doc/uta/trade"),
            ("../intro", "https://www.bitget.com/intro"),
        ]
        
        all_passed = True
        for input_url, expected in test_cases:
            result = crawler.normalize_url(input_url, crawler.base_url)
            if result != expected:
                print(f"❌ URL 标准化失败: {input_url} -> {result} (期望: {expected})")
                all_passed = False
            else:
                print(f"✅ URL 标准化成功: {input_url} -> {result}")
                
        return all_passed
        
    except Exception as e:
        print(f"❌ URL 标准化异常: {e}")
        return False


async def test_data_cleaning():
    """测试数据清理"""
    print("🧪 测试数据清理...")
    try:
        crawler = BitgetCrawler()
        
        # 测试数据清理
        test_data = {
            "title": "  测试标题  \n\n  ",
            "description": ["", "  有效描述  ", ""],
            "content": "  多个    空格   的   文本  ",
            "empty_field": "",
            "none_field": None
        }
        
        cleaned_data = crawler.clean_extracted_data(test_data)
        
        expected = {
            "title": "测试标题",
            "description": "有效描述",
            "content": "多个 空格 的 文本",
            "empty_field": "",
            "none_field": ""
        }
        
        if cleaned_data == expected:
            print("✅ 数据清理成功")
            return True
        else:
            print(f"❌ 数据清理失败")
            print(f"   期望: {expected}")
            print(f"   实际: {cleaned_data}")
            return False
            
    except Exception as e:
        print(f"❌ 数据清理异常: {e}")
        return False


async def run_all_tests():
    """运行所有测试"""
    print("🚀 开始运行 Bitget 爬虫测试")
    print("=" * 50)
    
    tests = [
        ("Schema 加载", test_schema_loading),
        ("Markdown 转换", test_markdown_conversion),
        ("URL 标准化", test_url_normalization),
        ("数据清理", test_data_cleaning),
        ("单页面提取", test_single_page_extraction),  # 最后测试，需要网络
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n📋 {test_name}")
        print("-" * 30)
        try:
            if await test_func():
                passed += 1
            else:
                print(f"❌ {test_name} 测试失败")
        except Exception as e:
            print(f"❌ {test_name} 测试异常: {e}")
    
    print("\n" + "=" * 50)
    print(f"📊 测试结果: {passed}/{total} 通过")
    
    if passed == total:
        print("🎉 所有测试通过！爬虫功能正常")
        return True
    else:
        print("⚠️ 部分测试失败，请检查配置")
        return False


async def main():
    """主函数"""
    success = await run_all_tests()
    
    if success:
        print("\n✅ 测试完成，可以开始使用爬虫:")
        print("   python run.py --dry-run    # 试运行")
        print("   python run.py              # 完整爬取")
        sys.exit(0)
    else:
        print("\n❌ 测试失败，请检查环境配置")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())