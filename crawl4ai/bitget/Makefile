# Bitget 爬虫 Makefile

.PHONY: help install test run clean setup dry-run

# 默认目标
help:
	@echo "Bitget API 文档爬虫"
	@echo "==================="
	@echo ""
	@echo "可用命令:"
	@echo "  make install    - 安装依赖"
	@echo "  make setup      - 完整环境设置"
	@echo "  make test       - 运行测试"
	@echo "  make dry-run    - 试运行（只爬取第一页）"
	@echo "  make run        - 运行爬虫"
	@echo "  make run-10     - 运行爬虫（限制10页）"
	@echo "  make clean      - 清理输出文件"
	@echo "  make help       - 显示此帮助信息"

# 安装依赖
install:
	@echo "📦 安装 Python 依赖..."
	pip3 install -r requirements.txt
	@echo "✅ 依赖安装完成"

# 完整环境设置
setup: install
	@echo "🔧 设置 crawl4ai 环境..."
	crawl4ai-setup
	@echo "🩺 验证安装..."
	crawl4ai-doctor
	@echo "📁 创建输出目录..."
	mkdir -p output
	@echo "🔐 设置执行权限..."
	chmod +x *.py
	@echo "✅ 环境设置完成"

# 运行测试
test:
	@echo "🧪 运行爬虫测试..."
	python3 test_crawler.py

# 试运行
dry-run:
	@echo "🔄 试运行爬虫（只爬取第一页）..."
	python3 run.py --dry-run --verbose

# 运行爬虫
run:
	@echo "🚀 运行爬虫..."
	python3 run.py

# 运行爬虫（限制10页）
run-10:
	@echo "🚀 运行爬虫（限制10页）..."
	python3 run.py --max-pages 10

# 运行爬虫（限制20页）
run-20:
	@echo "🚀 运行爬虫（限制20页）..."
	python3 run.py --max-pages 20

# 运行爬虫（详细模式）
run-verbose:
	@echo "🚀 运行爬虫（详细模式）..."
	python3 run.py --verbose

# 清理输出文件
clean:
	@echo "🧹 清理输出文件..."
	rm -rf output/*.json
	rm -rf output/*.log
	@echo "✅ 清理完成"

# 查看最新结果
show-latest:
	@echo "📄 显示最新爬取结果..."
	@latest_file=$$(ls -t output/bitget_docs_*.json 2>/dev/null | head -1); \
	if [ -n "$$latest_file" ]; then \
		echo "最新文件: $$latest_file"; \
		echo "文件大小: $$(du -h "$$latest_file" | cut -f1)"; \
		echo "页面数量: $$(jq length "$$latest_file")"; \
		echo "前3页标题:"; \
		jq -r '.[0:3][] | "  - " + .title' "$$latest_file"; \
	else \
		echo "❌ 没有找到结果文件"; \
	fi

# 查看日志
show-log:
	@echo "📋 显示最新日志..."
	@latest_log=$$(ls -t output/crawler_*.log 2>/dev/null | head -1); \
	if [ -n "$$latest_log" ]; then \
		echo "最新日志: $$latest_log"; \
		tail -20 "$$latest_log"; \
	else \
		echo "❌ 没有找到日志文件"; \
	fi

# 检查状态
status:
	@echo "📊 爬虫状态"
	@echo "============"
	@echo "Python 版本: $$(python3 --version)"
	@echo "工作目录: $$(pwd)"
	@echo "Schema 文件: $$(if [ -f schema.json ]; then echo '✅ 存在'; else echo '❌ 不存在'; fi)"
	@echo "输出目录: $$(if [ -d output ]; then echo '✅ 存在'; else echo '❌ 不存在'; fi)"
	@echo "结果文件数: $$(ls output/bitget_docs_*.json 2>/dev/null | wc -l)"
	@echo "日志文件数: $$(ls output/crawler_*.log 2>/dev/null | wc -l)"

# 快速开始
quick-start: setup test dry-run
	@echo ""
	@echo "🎉 快速开始完成！"
	@echo "现在可以运行: make run"