#!/bin/bash

# Bitget 爬虫安装脚本

set -e

echo "🚀 Bitget API 文档爬虫安装脚本"
echo "=================================="

# 检查 Python 版本
echo "📋 检查 Python 环境..."
python_version=$(python3 --version 2>&1 | awk '{print $2}' | cut -d. -f1,2)
required_version="3.8"

if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" = "$required_version" ]; then
    echo "✅ Python 版本: $python_version (满足要求 >= $required_version)"
else
    echo "❌ Python 版本过低: $python_version (需要 >= $required_version)"
    exit 1
fi

# 检查 pip
echo "📦 检查 pip..."
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 未安装，请先安装 pip"
    exit 1
fi

echo "✅ pip 版本: $(pip3 --version)"

# 创建输出目录
echo "📁 创建输出目录..."
mkdir -p output
echo "✅ 输出目录已创建: ./output"

# 安装依赖
echo "📦 安装 Python 依赖..."
pip3 install -r requirements.txt

echo "🔧 安装 crawl4ai 浏览器..."
crawl4ai-setup

echo "🩺 验证安装..."
crawl4ai-doctor

# 设置执行权限
echo "🔐 设置执行权限..."
chmod +x run.py
chmod +x crawler.py

# 运行测试
echo "🧪 运行安装测试..."
python3 run.py --dry-run

echo ""
echo "🎉 安装完成！"
echo "=================================="
echo "使用方法:"
echo "  python3 run.py                    # 基本用法"
echo "  python3 run.py --help            # 查看帮助"
echo "  python3 run.py --dry-run         # 试运行"
echo "  python3 run.py --max-pages 10    # 限制页面数"
echo ""
echo "更多信息请查看 README.md"