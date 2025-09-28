"""
Bitget 爬虫配置文件
"""

import os
from pathlib import Path

# 基础配置
BASE_URL = "https://www.bitget.com"
START_URL = "https://www.bitget.com/zh-CN/api-doc/uta/intro"

# 爬取配置
MAX_PAGES = int(os.getenv("BITGET_MAX_PAGES", "100"))  # 最大爬取页面数
PAGE_TIMEOUT = int(os.getenv("BITGET_PAGE_TIMEOUT", "30000"))  # 页面超时时间(毫秒)
DELAY_BETWEEN_REQUESTS = float(os.getenv("BITGET_DELAY", "1.0"))  # 请求间隔(秒)
DELAY_BEFORE_RETURN = float(os.getenv("BITGET_PAGE_DELAY", "2.0"))  # 页面加载等待时间(秒)

# 文件路径配置
SCRIPT_DIR = Path(__file__).parent
SCHEMA_FILE = SCRIPT_DIR / "schema.json"
OUTPUT_DIR = SCRIPT_DIR / "output"
REQUIREMENTS_FILE = SCRIPT_DIR / "requirements.txt"

# 输出配置
OUTPUT_FILENAME_PREFIX = "bitget_docs"
LOG_FILENAME_PREFIX = "crawler"

# 爬虫配置
CRAWLER_CONFIG = {
    "cache_mode": "bypass",
    "page_timeout": PAGE_TIMEOUT,
    "delay_before_return_html": DELAY_BEFORE_RETURN,
    "remove_overlay_elements": True,
    "simulate_user": True,
    "override_navigator": True,
    "verbose": True
}

# Markdown 转换配置
MARKDOWN_CONFIG = {
    "heading_style": "ATX",  # 使用 # 风格的标题
    "bullets": "-",  # 使用 - 作为列表符号
    "strip": ['script', 'style'],  # 移除脚本和样式
    "convert": ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'a', 'strong', 'em']
}

# 日志配置
LOG_CONFIG = {
    "level": "INFO",
    "format": "%(asctime)s - %(levelname)s - %(message)s",
    "encoding": "utf-8"
}

# 用户代理
USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
]