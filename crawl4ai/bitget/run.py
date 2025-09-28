#!/usr/bin/env python3
"""
Bitget 爬虫运行脚本
提供命令行接口来执行爬虫任务
"""

import argparse
import asyncio
import sys
from pathlib import Path

# 添加当前目录到 Python 路径
sys.path.insert(0, str(Path(__file__).parent))

from crawler import BitgetCrawler
from config import *


def check_dependencies():
    """检查依赖是否安装"""
    missing_deps = []
    
    try:
        import crawl4ai
    except ImportError:
        missing_deps.append("crawl4ai>=0.7.0")
        
    try:
        import markdownify
    except ImportError:
        missing_deps.append("markdownify>=0.11.6")
        
    if missing_deps:
        print("❌ 缺少以下依赖:")
        for dep in missing_deps:
            print(f"   - {dep}")
        print("\n请运行以下命令安装依赖:")
        print(f"pip install -r {REQUIREMENTS_FILE}")
        return False
        
    return True


def parse_arguments():
    """解析命令行参数"""
    parser = argparse.ArgumentParser(
        description="Bitget API 文档爬虫",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例用法:
  python run.py                    # 使用默认设置运行
  python run.py --max-pages 20     # 限制最大页面数
  python run.py --output custom.json  # 指定输出文件名
  python run.py --verbose          # 显示详细日志
        """
    )
    
    parser.add_argument(
        "--max-pages",
        type=int,
        default=MAX_PAGES,
        help=f"最大爬取页面数 (默认: {MAX_PAGES})"
    )
    
    parser.add_argument(
        "--output",
        type=str,
        help="输出文件名 (默认: 自动生成时间戳文件名)"
    )
    
    parser.add_argument(
        "--schema",
        type=str,
        default=str(SCHEMA_FILE),
        help=f"Schema 文件路径 (默认: {SCHEMA_FILE})"
    )
    
    parser.add_argument(
        "--output-dir",
        type=str,
        default=str(OUTPUT_DIR),
        help=f"输出目录 (默认: {OUTPUT_DIR})"
    )
    
    parser.add_argument(
        "--delay",
        type=float,
        default=DELAY_BETWEEN_REQUESTS,
        help=f"请求间隔秒数 (默认: {DELAY_BETWEEN_REQUESTS})"
    )
    
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="显示详细日志"
    )
    
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="试运行模式，只爬取第一页"
    )
    
    return parser.parse_args()


async def main():
    """主函数"""
    print("🚀 Bitget API 文档爬虫")
    print("=" * 50)
    
    # 解析命令行参数
    args = parse_arguments()
    
    # 检查依赖
    if not check_dependencies():
        sys.exit(1)
        
    # 检查 schema 文件
    if not Path(args.schema).exists():
        print(f"❌ Schema 文件不存在: {args.schema}")
        sys.exit(1)
        
    print(f"📋 配置信息:")
    print(f"   Schema 文件: {args.schema}")
    print(f"   输出目录: {args.output_dir}")
    print(f"   最大页面数: {args.max_pages if not args.dry_run else 1}")
    print(f"   请求间隔: {args.delay}秒")
    print(f"   详细日志: {'是' if args.verbose else '否'}")
    print(f"   试运行模式: {'是' if args.dry_run else '否'}")
    print()
    
    try:
        # 初始化爬虫
        crawler = BitgetCrawler(
            schema_path=args.schema,
            output_dir=args.output_dir
        )
        
        # 设置延迟
        if hasattr(crawler, 'delay'):
            crawler.delay = args.delay
            
        # 执行爬取
        max_pages = 1 if args.dry_run else args.max_pages
        print(f"🔄 开始爬取 (最大 {max_pages} 页)...")
        
        results = await crawler.crawl_all_pages(max_pages=max_pages)
        
        # 保存结果
        if results:
            output_file = crawler.save_results(args.output)
            crawler.print_summary()
            
            if args.dry_run:
                print(f"\n✅ 试运行完成！")
                print(f"   爬取了 {len(results)} 页")
                print(f"   结果保存在: {output_file}")
                print(f"   如果结果正确，请移除 --dry-run 参数运行完整爬取")
            else:
                print(f"\n✅ 爬取完成！")
                print(f"   总共爬取: {len(results)} 页")
                print(f"   结果保存在: {output_file}")
        else:
            print("❌ 没有爬取到任何数据")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n⚠️ 用户中断爬取")
        if hasattr(crawler, 'results') and crawler.results:
            output_file = crawler.save_results("bitget_docs_interrupted.json")
            print(f"已保存部分结果: {output_file}")
    except Exception as e:
        print(f"❌ 爬取过程中发生错误: {e}")
        if args.verbose:
            import traceback
            traceback.print_exc()
        if hasattr(crawler, 'results') and crawler.results:
            output_file = crawler.save_results("bitget_docs_error.json")
            print(f"已保存部分结果: {output_file}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())