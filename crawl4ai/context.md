# Crawl4AI Custom LLM Context

Generated on: 2025-09-28T03:05:01.267Z
Total files: 8
Estimated tokens: 37,053

---

## Installation - Full Content

Component ID: installation
Context Type: memory
Estimated tokens: 1,458

## Installation

Multiple installation options for different environments and use cases.

### Basic Installation

```bash
# Install core library
pip install crawl4ai

# Initial setup (installs Playwright browsers)
crawl4ai-setup

# Verify installation
crawl4ai-doctor
```

### Quick Verification

```python
import asyncio
from crawl4ai import AsyncWebCrawler

async def main():
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun("https://example.com")
        print(result.markdown[:300])

if __name__ == "__main__":
    asyncio.run(main())
```

**📖 Learn more:** [Basic Usage Guide](https://docs.crawl4ai.com/core/quickstart.md)

### Advanced Features (Optional)

```bash
# PyTorch-based features (text clustering, semantic chunking)
pip install crawl4ai[torch]
crawl4ai-setup

# Transformers (Hugging Face models)
pip install crawl4ai[transformer]
crawl4ai-setup

# All features (large download)
pip install crawl4ai[all]
crawl4ai-setup

# Pre-download models (optional)
crawl4ai-download-models
```

**📖 Learn more:** [Advanced Features Documentation](https://docs.crawl4ai.com/extraction/llm-strategies.md)

### Docker Deployment

```bash
# Pull pre-built image (specify platform for consistency)
docker pull --platform linux/amd64 unclecode/crawl4ai:latest
# For ARM (M1/M2 Macs): docker pull --platform linux/arm64 unclecode/crawl4ai:latest

# Setup environment for LLM support
cat > .llm.env << EOL
OPENAI_API_KEY=sk-your-key
ANTHROPIC_API_KEY=your-anthropic-key
EOL

# Run with LLM support (specify platform)
docker run -d \
  --platform linux/amd64 \
  -p 11235:11235 \
  --name crawl4ai \
  --env-file .llm.env \
  --shm-size=1g \
  unclecode/crawl4ai:latest

# For ARM Macs, use: --platform linux/arm64

# Basic run (no LLM)
docker run -d \
  --platform linux/amd64 \
  -p 11235:11235 \
  --name crawl4ai \
  --shm-size=1g \
  unclecode/crawl4ai:latest
```

**📖 Learn more:** [Complete Docker Guide](https://docs.crawl4ai.com/core/docker-deployment.md)

### Docker Compose

```bash
# Clone repository
git clone https://github.com/unclecode/crawl4ai.git
cd crawl4ai

# Copy environment template
cp deploy/docker/.llm.env.example .llm.env
# Edit .llm.env with your API keys

# Run pre-built image
IMAGE=unclecode/crawl4ai:latest docker compose up -d

# Build and run locally
docker compose up --build -d

# Build with all features
INSTALL_TYPE=all docker compose up --build -d

# Stop service
docker compose down
```

**📖 Learn more:** [Docker Compose Configuration](https://docs.crawl4ai.com/core/docker-deployment.md#option-2-using-docker-compose)

### Manual Docker Build

```bash
# Build multi-architecture image (specify platform)
docker buildx build --platform linux/amd64 -t crawl4ai-local:latest --load .
# For ARM: docker buildx build --platform linux/arm64 -t crawl4ai-local:latest --load .

# Build with specific features
docker buildx build \
  --platform linux/amd64 \
  --build-arg INSTALL_TYPE=all \
  --build-arg ENABLE_GPU=false \
  -t crawl4ai-local:latest --load .

# Run custom build (specify platform)
docker run -d \
  --platform linux/amd64 \
  -p 11235:11235 \
  --name crawl4ai-custom \
  --env-file .llm.env \
  --shm-size=1g \
  crawl4ai-local:latest
```

**📖 Learn more:** [Manual Build Guide](https://docs.crawl4ai.com/core/docker-deployment.md#option-3-manual-local-build--run)

### Google Colab

```python
# Install in Colab
!pip install crawl4ai
!crawl4ai-setup

# If setup fails, manually install Playwright browsers
!playwright install chromium

# Install with all features (may take 5-10 minutes)
!pip install crawl4ai[all]
!crawl4ai-setup
!crawl4ai-download-models

# If still having issues, force Playwright install
!playwright install chromium --force

# Quick test
import asyncio
from crawl4ai import AsyncWebCrawler

async def test_crawl():
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun("https://example.com")
        print("✅ Installation successful!")
        print(f"Content length: {len(result.markdown)}")

# Run test in Colab
await test_crawl()
```

**📖 Learn more:** [Colab Examples Notebook](https://colab.research.google.com/github/unclecode/crawl4ai/blob/main/docs/examples/quickstart.ipynb)

### Docker API Usage

```python
# Using Docker SDK
import asyncio
from crawl4ai.docker_client import Crawl4aiDockerClient
from crawl4ai import BrowserConfig, CrawlerRunConfig, CacheMode

async def main():
    async with Crawl4aiDockerClient(base_url="http://localhost:11235") as client:
        results = await client.crawl(
            ["https://example.com"],
            browser_config=BrowserConfig(headless=True),
            crawler_config=CrawlerRunConfig(cache_mode=CacheMode.BYPASS)
        )
        for result in results:
            print(f"Success: {result.success}, Length: {len(result.markdown)}")

asyncio.run(main())
```

**📖 Learn more:** [Docker Client API](https://docs.crawl4ai.com/core/docker-deployment.md#python-sdk)

### Direct API Calls

```python
# REST API example
import requests

payload = {
    "urls": ["https://example.com"],
    "browser_config": {"type": "BrowserConfig", "params": {"headless": True}},
    "crawler_config": {"type": "CrawlerRunConfig", "params": {"cache_mode": "bypass"}}
}

response = requests.post("http://localhost:11235/crawl", json=payload)
print(response.json())
```

**📖 Learn more:** [REST API Reference](https://docs.crawl4ai.com/core/docker-deployment.md#rest-api-examples)

### Health Check

```bash
# Check Docker service
curl http://localhost:11235/health

# Access playground
open http://localhost:11235/playground

# View metrics
curl http://localhost:11235/metrics
```

**📖 Learn more:** [Monitoring & Metrics](https://docs.crawl4ai.com/core/docker-deployment.md#metrics--monitoring)

---

## Installation - Diagrams & Workflows

Component ID: installation
Context Type: reasoning
Estimated tokens: 2,658

## Installation Workflows and Architecture

Visual representations of Crawl4AI installation processes, deployment options, and system interactions.

### Installation Decision Flow

```mermaid
flowchart TD
    A[Start Installation] --> B{Environment Type?}

    B -->|Local Development| C[Basic Python Install]
    B -->|Production| D[Docker Deployment]
    B -->|Research/Testing| E[Google Colab]
    B -->|CI/CD Pipeline| F[Automated Setup]

    C --> C1[pip install crawl4ai]
    C1 --> C2[crawl4ai-setup]
    C2 --> C3{Need Advanced Features?}

    C3 -->|No| C4[Basic Installation Complete]
    C3 -->|Text Clustering| C5[pip install crawl4ai with torch]
    C3 -->|Transformers| C6[pip install crawl4ai with transformer]
    C3 -->|All Features| C7[pip install crawl4ai with all]

    C5 --> C8[crawl4ai-download-models]
    C6 --> C8
    C7 --> C8
    C8 --> C9[Advanced Installation Complete]

    D --> D1{Deployment Method?}
    D1 -->|Pre-built Image| D2[docker pull unclecode/crawl4ai]
    D1 -->|Docker Compose| D3[Clone repo + docker compose]
    D1 -->|Custom Build| D4[docker buildx build]

    D2 --> D5[Configure .llm.env]
    D3 --> D5
    D4 --> D5
    D5 --> D6[docker run with ports]
    D6 --> D7[Docker Deployment Complete]

    E --> E1[Colab pip install]
    E1 --> E2[playwright install chromium]
    E2 --> E3[Test basic crawl]
    E3 --> E4[Colab Setup Complete]

    F --> F1[Automated pip install]
    F1 --> F2[Automated setup scripts]
    F2 --> F3[CI/CD Integration Complete]

    C4 --> G[Verify with crawl4ai-doctor]
    C9 --> G
    D7 --> H[Health check via API]
    E4 --> I[Run test crawl]
    F3 --> G

    G --> J[Installation Verified]
    H --> J
    I --> J

    style A fill:#e1f5fe
    style J fill:#c8e6c9
    style C4 fill:#fff3e0
    style C9 fill:#fff3e0
    style D7 fill:#f3e5f5
    style E4 fill:#fce4ec
    style F3 fill:#e8f5e8
```

### Basic Installation Sequence

```mermaid
sequenceDiagram
    participant User
    participant PyPI
    participant System
    participant Playwright
    participant Crawler

    User->>PyPI: pip install crawl4ai
    PyPI-->>User: Package downloaded

    User->>System: crawl4ai-setup
    System->>Playwright: Install browser binaries
    Playwright-->>System: Chromium, Firefox installed
    System-->>User: Setup complete

    User->>System: crawl4ai-doctor
    System->>System: Check Python version
    System->>System: Verify Playwright installation
    System->>System: Test browser launch
    System-->>User: Diagnostics report

    User->>Crawler: Basic crawl test
    Crawler->>Playwright: Launch browser
    Playwright-->>Crawler: Browser ready
    Crawler->>Crawler: Navigate to test URL
    Crawler-->>User: Success confirmation
```

### Docker Deployment Architecture

```mermaid
graph TB
    subgraph "Host System"
        A[Docker Engine] --> B[Crawl4AI Container]
        C[.llm.env File] --> B
        D[Port 11235] --> B
    end

    subgraph "Container Environment"
        B --> E[FastAPI Server]
        B --> F[Playwright Browsers]
        B --> G[Python Runtime]

        E --> H[/crawl Endpoint]
        E --> I[/playground Interface]
        E --> J[/health Monitoring]
        E --> K[/metrics Prometheus]

        F --> L[Chromium Browser]
        F --> M[Firefox Browser]
        F --> N[WebKit Browser]
    end

    subgraph "External Services"
        O[OpenAI API] --> B
        P[Anthropic API] --> B
        Q[Local LLM Ollama] --> B
    end

    subgraph "Client Applications"
        R[Python SDK] --> H
        S[REST API Calls] --> H
        T[Web Browser] --> I
        U[Monitoring Tools] --> J
        V[Prometheus] --> K
    end

    style B fill:#e3f2fd
    style E fill:#f3e5f5
    style F fill:#e8f5e8
    style G fill:#fff3e0
```

### Advanced Features Installation Flow

```mermaid
stateDiagram-v2
    [*] --> BasicInstall

    BasicInstall --> FeatureChoice: crawl4ai installed

    FeatureChoice --> TorchInstall: Need text clustering
    FeatureChoice --> TransformerInstall: Need HuggingFace models
    FeatureChoice --> AllInstall: Need everything
    FeatureChoice --> Complete: Basic features sufficient

    TorchInstall --> TorchSetup: pip install crawl4ai with torch
    TransformerInstall --> TransformerSetup: pip install crawl4ai with transformer
    AllInstall --> AllSetup: pip install crawl4ai with all

    TorchSetup --> ModelDownload: crawl4ai-setup
    TransformerSetup --> ModelDownload: crawl4ai-setup
    AllSetup --> ModelDownload: crawl4ai-setup

    ModelDownload --> PreDownload: crawl4ai-download-models
    PreDownload --> Complete: All models cached

    Complete --> Verification: crawl4ai-doctor
    Verification --> [*]: Installation verified

    note right of TorchInstall : PyTorch for semantic operations
    note right of TransformerInstall : HuggingFace for LLM features
    note right of AllInstall : Complete feature set
```

### Platform-Specific Installation Matrix

```mermaid
graph LR
    subgraph "Installation Methods"
        A[Python Package] --> A1[pip install]
        B[Docker Image] --> B1[docker pull]
        C[Source Build] --> C1[git clone + build]
        D[Cloud Platform] --> D1[Colab/Kaggle]
    end

    subgraph "Operating Systems"
        E[Linux x86_64]
        F[Linux ARM64]
        G[macOS Intel]
        H[macOS Apple Silicon]
        I[Windows x86_64]
    end

    subgraph "Feature Sets"
        J[Basic crawling]
        K[Text clustering torch]
        L[LLM transformers]
        M[All features]
    end

    A1 --> E
    A1 --> F
    A1 --> G
    A1 --> H
    A1 --> I

    B1 --> E
    B1 --> F
    B1 --> G
    B1 --> H

    C1 --> E
    C1 --> F
    C1 --> G
    C1 --> H
    C1 --> I

    D1 --> E
    D1 --> I

    E --> J
    E --> K
    E --> L
    E --> M

    F --> J
    F --> K
    F --> L
    F --> M

    G --> J
    G --> K
    G --> L
    G --> M

    H --> J
    H --> K
    H --> L
    H --> M

    I --> J
    I --> K
    I --> L
    I --> M

    style A1 fill:#e3f2fd
    style B1 fill:#f3e5f5
    style C1 fill:#e8f5e8
    style D1 fill:#fff3e0
```

### Docker Multi-Stage Build Process

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Git as GitHub Repo
    participant Docker as Docker Engine
    participant Registry as Docker Hub
    participant User as End User

    Dev->>Git: Push code changes

    Docker->>Git: Clone repository
    Docker->>Docker: Stage 1 - Base Python image
    Docker->>Docker: Stage 2 - Install dependencies
    Docker->>Docker: Stage 3 - Install Playwright
    Docker->>Docker: Stage 4 - Copy application code
    Docker->>Docker: Stage 5 - Setup FastAPI server

    Note over Docker: Multi-architecture build
    Docker->>Docker: Build for linux/amd64
    Docker->>Docker: Build for linux/arm64

    Docker->>Registry: Push multi-arch manifest
    Registry-->>Docker: Build complete

    User->>Registry: docker pull unclecode/crawl4ai
    Registry-->>User: Download appropriate architecture

    User->>Docker: docker run with configuration
    Docker->>Docker: Start container
    Docker->>Docker: Initialize FastAPI server
    Docker->>Docker: Setup Playwright browsers
    Docker-->>User: Service ready on port 11235
```

### Installation Verification Workflow

```mermaid
flowchart TD
    A[Installation Complete] --> B[Run crawl4ai-doctor]

    B --> C{Python Version Check}
    C -->|✓ 3.10+| D{Playwright Check}
    C -->|✗ < 3.10| C1[Upgrade Python]
    C1 --> D

    D -->|✓ Installed| E{Browser Binaries}
    D -->|✗ Missing| D1[Run crawl4ai-setup]
    D1 --> E

    E -->|✓ Available| F{Test Browser Launch}
    E -->|✗ Missing| E1[playwright install]
    E1 --> F

    F -->|✓ Success| G[Test Basic Crawl]
    F -->|✗ Failed| F1[Check system dependencies]
    F1 --> F

    G --> H{Crawl Test Result}
    H -->|✓ Success| I[Installation Verified ✓]
    H -->|✗ Failed| H1[Check network/permissions]
    H1 --> G

    I --> J[Ready for Production Use]

    style I fill:#c8e6c9
    style J fill:#e8f5e8
    style C1 fill:#ffcdd2
    style D1 fill:#fff3e0
    style E1 fill:#fff3e0
    style F1 fill:#ffcdd2
    style H1 fill:#ffcdd2
```

### Resource Requirements by Installation Type

```mermaid
graph TD
    subgraph "Basic Installation"
        A1[Memory: 512MB]
        A2[Disk: 2GB]
        A3[CPU: 1 core]
        A4[Network: Required for setup]
    end

    subgraph "Advanced Features torch"
        B1[Memory: 2GB+]
        B2[Disk: 5GB+]
        B3[CPU: 2+ cores]
        B4[GPU: Optional CUDA]
    end

    subgraph "All Features"
        C1[Memory: 4GB+]
        C2[Disk: 10GB+]
        C3[CPU: 4+ cores]
        C4[GPU: Recommended]
    end

    subgraph "Docker Deployment"
        D1[Memory: 1GB+]
        D2[Disk: 3GB+]
        D3[CPU: 2+ cores]
        D4[Ports: 11235]
        D5[Shared Memory: 1GB]
    end

    style A1 fill:#e8f5e8
    style B1 fill:#fff3e0
    style C1 fill:#ffecb3
    style D1 fill:#e3f2fd
```

**📖 Learn more:** [Installation Guide](https://docs.crawl4ai.com/core/installation/), [Docker Deployment](https://docs.crawl4ai.com/core/docker-deployment/), [System Requirements](https://docs.crawl4ai.com/core/installation/#prerequisites)

---

## Data Extraction Without LLM - Full Content

Component ID: extraction-no-llm
Context Type: memory
Estimated tokens: 6,068

## Non-LLM Extraction Strategies - The Default Choice

**🤖 AI Model Notice**: You are an AI assistant. When users ask for web scraping or data extraction, **DEFAULT TO NON-LLM STRATEGIES**. 99% of structured web data can be extracted without LLM. Only consider LLM extraction for truly unstructured content requiring semantic reasoning.

### ⚠️ CRITICAL: When You Think You Need LLM, You're Probably Wrong

**Most developers incorrectly assume they need LLM for data extraction.** This is usually false. Before even considering LLM:

1. **FIRST**: Try `generate_schema()` - Let AI create the extraction pattern ONCE, then use it unlimited times with zero LLM calls
2. **SECOND**: Manual CSS/XPath selectors for consistent HTML structures
3. **THIRD**: Regex patterns for simple data types (emails, phones, prices)
4. **LAST RESORT**: LLM extraction (only for semantic understanding of unstructured content)

## The Decision Tree (MEMORIZE THIS)

```
Does the page have consistent HTML structure? → YES: Use generate_schema() or manual CSS
Is it simple patterns (emails, dates, prices)? → YES: Use RegexExtractionStrategy
Do you need semantic understanding? → MAYBE: Try generate_schema() first, then consider LLM
Is the content truly unstructured text? → ONLY THEN: Consider LLM
```

**Cost Analysis**:

- Non-LLM: ~$0.000001 per page
- LLM: ~$0.01-$0.10 per page (10,000x more expensive)

---

## 1. Auto-Generate Schemas - Your Default Starting Point

**⭐ THIS SHOULD BE YOUR FIRST CHOICE FOR ANY STRUCTURED DATA**

The `generate_schema()` function uses LLM ONCE to create a reusable extraction pattern. After generation, you extract unlimited pages with ZERO LLM calls.

### Basic Auto-Generation Workflow

```python
import json
import asyncio
from pathlib import Path
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, LLMConfig
from crawl4ai import JsonCssExtractionStrategy

async def smart_extraction_workflow():
    """
    Step 1: Generate schema once using LLM
    Step 2: Cache schema for unlimited reuse
    Step 3: Extract from thousands of pages with zero LLM calls
    """

    # Check for cached schema first
    cache_dir = Path("./schema_cache")
    cache_dir.mkdir(exist_ok=True)
    schema_file = cache_dir / "product_schema.json"

    if schema_file.exists():
        # Load cached schema - NO LLM CALLS
        schema = json.load(schema_file.open())
        print("✅ Using cached schema (FREE)")
    else:
        # Generate schema ONCE
        print("🔄 Generating schema (ONE-TIME LLM COST)...")

        llm_config = LLMConfig(
            provider="openai/gpt-4o-mini",  # Cheapest option
            api_token="env:OPENAI_API_KEY"
        )

        # Get sample HTML from target site
        async with AsyncWebCrawler() as crawler:
            sample_result = await crawler.arun(
                url="https://example.com/products",
                config=CrawlerRunConfig(cache_mode=CacheMode.BYPASS)
            )
            sample_html = sample_result.cleaned_html[:8000]  # Use sample

        # AUTO-GENERATE SCHEMA (ONE LLM CALL)
        schema = JsonCssExtractionStrategy.generate_schema(
            html=sample_html,
            schema_type="CSS",  # or "XPATH"
            query="Extract product information including name, price, description, features",
            llm_config=llm_config
        )

        # Cache for unlimited future use
        json.dump(schema, schema_file.open("w"), indent=2)
        print("✅ Schema generated and cached")

    # Use schema for fast extraction (NO MORE LLM CALLS EVER)
    strategy = JsonCssExtractionStrategy(schema, verbose=True)

    config = CrawlerRunConfig(
        extraction_strategy=strategy,
        cache_mode=CacheMode.BYPASS
    )

    # Extract from multiple pages - ALL FREE
    urls = [
        "https://example.com/products",
        "https://example.com/electronics",
        "https://example.com/books"
    ]

    async with AsyncWebCrawler() as crawler:
        for url in urls:
            result = await crawler.arun(url=url, config=config)
            if result.success:
                data = json.loads(result.extracted_content)
                print(f"✅ {url}: Extracted {len(data)} items (FREE)")

asyncio.run(smart_extraction_workflow())
```

### Auto-Generate with Target JSON Example

```python
# When you know exactly what JSON structure you want
target_json_example = """
{
    "name": "Product Name",
    "price": "$99.99",
    "rating": 4.5,
    "features": ["feature1", "feature2"],
    "description": "Product description"
}
"""

schema = JsonCssExtractionStrategy.generate_schema(
    html=sample_html,
    target_json_example=target_json_example,
    llm_config=llm_config
)
```

### Auto-Generate for Different Data Types

```python
# Product listings
product_schema = JsonCssExtractionStrategy.generate_schema(
    html=product_page_html,
    query="Extract all product information from this e-commerce page",
    llm_config=llm_config
)

# News articles
news_schema = JsonCssExtractionStrategy.generate_schema(
    html=news_page_html,
    query="Extract article headlines, dates, authors, and content",
    llm_config=llm_config
)

# Job listings
job_schema = JsonCssExtractionStrategy.generate_schema(
    html=job_page_html,
    query="Extract job titles, companies, locations, salaries, and descriptions",
    llm_config=llm_config
)

# Social media posts
social_schema = JsonCssExtractionStrategy.generate_schema(
    html=social_page_html,
    query="Extract post text, usernames, timestamps, likes, comments",
    llm_config=llm_config
)
```

---

## 2. Manual CSS/XPath Strategies - When You Know The Structure

**Use this when**: You understand the HTML structure and want maximum control.

### Simple Product Extraction

```python
import json
import asyncio
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig
from crawl4ai import JsonCssExtractionStrategy

# Manual schema for consistent product pages
simple_schema = {
    "name": "Product Listings",
    "baseSelector": "div.product-card",  # Each product container
    "fields": [
        {
            "name": "title",
            "selector": "h2.product-title",
            "type": "text"
        },
        {
            "name": "price",
            "selector": ".price",
            "type": "text"
        },
        {
            "name": "image_url",
            "selector": "img.product-image",
            "type": "attribute",
            "attribute": "src"
        },
        {
            "name": "product_url",
            "selector": "a.product-link",
            "type": "attribute",
            "attribute": "href"
        },
        {
            "name": "rating",
            "selector": ".rating",
            "type": "attribute",
            "attribute": "data-rating"
        }
    ]
}

async def extract_products():
    strategy = JsonCssExtractionStrategy(simple_schema, verbose=True)
    config = CrawlerRunConfig(extraction_strategy=strategy)

    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(
            url="https://example.com/products",
            config=config
        )

        if result.success:
            products = json.loads(result.extracted_content)
            print(f"Extracted {len(products)} products")
            for product in products[:3]:
                print(f"- {product['title']}: {product['price']}")

asyncio.run(extract_products())
```

### Complex Nested Structure (Real E-commerce Example)

```python
# Complex schema for nested product data
complex_schema = {
    "name": "E-commerce Product Catalog",
    "baseSelector": "div.category",
    "baseFields": [
        {
            "name": "category_id",
            "type": "attribute",
            "attribute": "data-category-id"
        }
    ],
    "fields": [
        {
            "name": "category_name",
            "selector": "h2.category-title",
            "type": "text"
        },
        {
            "name": "products",
            "selector": "div.product",
            "type": "nested_list",  # Array of complex objects
            "fields": [
                {
                    "name": "name",
                    "selector": "h3.product-name",
                    "type": "text"
                },
                {
                    "name": "price",
                    "selector": "span.price",
                    "type": "text"
                },
                {
                    "name": "details",
                    "selector": "div.product-details",
                    "type": "nested",  # Single complex object
                    "fields": [
                        {
                            "name": "brand",
                            "selector": "span.brand",
                            "type": "text"
                        },
                        {
                            "name": "model",
                            "selector": "span.model",
                            "type": "text"
                        }
                    ]
                },
                {
                    "name": "features",
                    "selector": "ul.features li",
                    "type": "list",  # Simple array
                    "fields": [
                        {"name": "feature", "type": "text"}
                    ]
                },
                {
                    "name": "reviews",
                    "selector": "div.review",
                    "type": "nested_list",
                    "fields": [
                        {
                            "name": "reviewer",
                            "selector": "span.reviewer-name",
                            "type": "text"
                        },
                        {
                            "name": "rating",
                            "selector": "span.rating",
                            "type": "attribute",
                            "attribute": "data-rating"
                        }
                    ]
                }
            ]
        }
    ]
}

async def extract_complex_ecommerce():
    strategy = JsonCssExtractionStrategy(complex_schema, verbose=True)
    config = CrawlerRunConfig(
        extraction_strategy=strategy,
        js_code="window.scrollTo(0, document.body.scrollHeight);",  # Load dynamic content
        wait_for="css:.product:nth-child(10)"  # Wait for products to load
    )

    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(
            url="https://example.com/complex-catalog",
            config=config
        )

        if result.success:
            data = json.loads(result.extracted_content)
            for category in data:
                print(f"Category: {category['category_name']}")
                print(f"Products: {len(category.get('products', []))}")

asyncio.run(extract_complex_ecommerce())
```

### XPath Alternative (When CSS Isn't Enough)

```python
from crawl4ai import JsonXPathExtractionStrategy

# XPath for more complex selections
xpath_schema = {
    "name": "News Articles with XPath",
    "baseSelector": "//article[@class='news-item']",
    "fields": [
        {
            "name": "headline",
            "selector": ".//h2[contains(@class, 'headline')]",
            "type": "text"
        },
        {
            "name": "author",
            "selector": ".//span[@class='author']/text()",
            "type": "text"
        },
        {
            "name": "publish_date",
            "selector": ".//time/@datetime",
            "type": "text"
        },
        {
            "name": "content",
            "selector": ".//div[@class='article-body']//text()",
            "type": "text"
        }
    ]
}

strategy = JsonXPathExtractionStrategy(xpath_schema, verbose=True)
```

---

## 3. Regex Extraction - Lightning Fast Pattern Matching

**Use this for**: Simple data types like emails, phones, URLs, prices, dates.

### Built-in Patterns (Fastest Option)

```python
import json
import asyncio
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig
from crawl4ai import RegexExtractionStrategy

async def extract_common_patterns():
    # Use built-in patterns for common data types
    strategy = RegexExtractionStrategy(
        pattern=(
            RegexExtractionStrategy.Email |
            RegexExtractionStrategy.PhoneUS |
            RegexExtractionStrategy.Url |
            RegexExtractionStrategy.Currency |
            RegexExtractionStrategy.DateIso
        )
    )

    config = CrawlerRunConfig(extraction_strategy=strategy)

    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(
            url="https://example.com/contact",
            config=config
        )

        if result.success:
            matches = json.loads(result.extracted_content)

            # Group by pattern type
            by_type = {}
            for match in matches:
                label = match['label']
                if label not in by_type:
                    by_type[label] = []
                by_type[label].append(match['value'])

            for pattern_type, values in by_type.items():
                print(f"{pattern_type}: {len(values)} matches")
                for value in values[:3]:
                    print(f"  {value}")

asyncio.run(extract_common_patterns())
```

### Available Built-in Patterns

```python
# Individual patterns
RegexExtractionStrategy.Email          # Email addresses
RegexExtractionStrategy.PhoneUS        # US phone numbers
RegexExtractionStrategy.PhoneIntl      # International phones
RegexExtractionStrategy.Url            # HTTP/HTTPS URLs
RegexExtractionStrategy.Currency       # Currency values ($99.99)
RegexExtractionStrategy.Percentage     # Percentage values (25%)
RegexExtractionStrategy.DateIso        # ISO dates (2024-01-01)
RegexExtractionStrategy.DateUS         # US dates (01/01/2024)
RegexExtractionStrategy.IPv4           # IP addresses
RegexExtractionStrategy.CreditCard     # Credit card numbers
RegexExtractionStrategy.TwitterHandle  # @username
RegexExtractionStrategy.Hashtag        # #hashtag

# Use all patterns
RegexExtractionStrategy.All
```

### Custom Patterns

```python
# Custom patterns for specific data types
async def extract_custom_patterns():
    custom_patterns = {
        "product_sku": r"SKU[-:]?\s*([A-Z0-9]{4,12})",
        "discount": r"(\d{1,2})%\s*off",
        "model_number": r"Model\s*#?\s*([A-Z0-9-]+)",
        "isbn": r"ISBN[-:]?\s*(\d{10}|\d{13})",
        "stock_ticker": r"\$([A-Z]{2,5})",
        "version": r"v(\d+\.\d+(?:\.\d+)?)"
    }

    strategy = RegexExtractionStrategy(custom=custom_patterns)
    config = CrawlerRunConfig(extraction_strategy=strategy)

    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(
            url="https://example.com/products",
            config=config
        )

        if result.success:
            data = json.loads(result.extracted_content)
            for item in data:
                print(f"{item['label']}: {item['value']}")

asyncio.run(extract_custom_patterns())
```

### LLM-Generated Patterns (One-Time Cost)

```python
async def generate_optimized_regex():
    """
    Use LLM ONCE to generate optimized regex patterns
    Then use them unlimited times with zero LLM calls
    """
    cache_file = Path("./patterns/price_patterns.json")

    if cache_file.exists():
        # Load cached patterns - NO LLM CALLS
        patterns = json.load(cache_file.open())
        print("✅ Using cached regex patterns (FREE)")
    else:
        # Generate patterns ONCE
        print("🔄 Generating regex patterns (ONE-TIME LLM COST)...")

        llm_config = LLMConfig(
            provider="openai/gpt-4o-mini",
            api_token="env:OPENAI_API_KEY"
        )

        # Get sample content
        async with AsyncWebCrawler() as crawler:
            result = await crawler.arun("https://example.com/pricing")
            sample_html = result.cleaned_html

        # Generate optimized patterns
        patterns = RegexExtractionStrategy.generate_pattern(
            label="pricing_info",
            html=sample_html,
            query="Extract all pricing information including discounts and special offers",
            llm_config=llm_config
        )

        # Cache for unlimited reuse
        cache_file.parent.mkdir(exist_ok=True)
        json.dump(patterns, cache_file.open("w"), indent=2)
        print("✅ Patterns generated and cached")

    # Use cached patterns (NO MORE LLM CALLS)
    strategy = RegexExtractionStrategy(custom=patterns)
    return strategy

# Use generated patterns for unlimited extractions
strategy = await generate_optimized_regex()
```

---

## 4. Multi-Strategy Extraction Pipeline

**Combine strategies** for comprehensive data extraction:

```python
async def multi_strategy_pipeline():
    """
    Efficient pipeline using multiple non-LLM strategies:
    1. Regex for simple patterns (fastest)
    2. Schema for structured data
    3. Only use LLM if absolutely necessary
    """

    url = "https://example.com/complex-page"

    async with AsyncWebCrawler() as crawler:
        # Strategy 1: Fast regex for contact info
        regex_strategy = RegexExtractionStrategy(
            pattern=RegexExtractionStrategy.Email | RegexExtractionStrategy.PhoneUS
        )
        regex_config = CrawlerRunConfig(extraction_strategy=regex_strategy)
        regex_result = await crawler.arun(url=url, config=regex_config)

        # Strategy 2: Schema for structured product data
        product_schema = {
            "name": "Products",
            "baseSelector": "div.product",
            "fields": [
                {"name": "name", "selector": "h3", "type": "text"},
                {"name": "price", "selector": ".price", "type": "text"}
            ]
        }
        css_strategy = JsonCssExtractionStrategy(product_schema)
        css_config = CrawlerRunConfig(extraction_strategy=css_strategy)
        css_result = await crawler.arun(url=url, config=css_config)

        # Combine results
        results = {
            "contacts": json.loads(regex_result.extracted_content) if regex_result.success else [],
            "products": json.loads(css_result.extracted_content) if css_result.success else []
        }

        print(f"✅ Extracted {len(results['contacts'])} contacts (regex)")
        print(f"✅ Extracted {len(results['products'])} products (schema)")

        return results

asyncio.run(multi_strategy_pipeline())
```

---

## 5. Performance Optimization Tips

### Caching and Reuse

```python
# Cache schemas and patterns for maximum efficiency
class ExtractionCache:
    def __init__(self):
        self.schemas = {}
        self.patterns = {}

    def get_schema(self, site_name):
        if site_name not in self.schemas:
            schema_file = Path(f"./cache/{site_name}_schema.json")
            if schema_file.exists():
                self.schemas[site_name] = json.load(schema_file.open())
        return self.schemas.get(site_name)

    def save_schema(self, site_name, schema):
        cache_dir = Path("./cache")
        cache_dir.mkdir(exist_ok=True)
        schema_file = cache_dir / f"{site_name}_schema.json"
        json.dump(schema, schema_file.open("w"), indent=2)
        self.schemas[site_name] = schema

cache = ExtractionCache()

# Reuse cached schemas across multiple extractions
async def efficient_extraction():
    sites = ["amazon", "ebay", "shopify"]

    for site in sites:
        schema = cache.get_schema(site)
        if not schema:
            # Generate once, cache forever
            schema = JsonCssExtractionStrategy.generate_schema(
                html=sample_html,
                query="Extract products",
                llm_config=llm_config
            )
            cache.save_schema(site, schema)

        strategy = JsonCssExtractionStrategy(schema)
        # Use strategy for unlimited extractions...
```

### Selector Optimization

```python
# Optimize selectors for speed
fast_schema = {
    "name": "Optimized Extraction",
    "baseSelector": "#products > .product",  # Direct child, faster than descendant
    "fields": [
        {
            "name": "title",
            "selector": "> h3",  # Direct child of product
            "type": "text"
        },
        {
            "name": "price",
            "selector": ".price:first-child",  # More specific
            "type": "text"
        }
    ]
}

# Avoid slow selectors
slow_schema = {
    "baseSelector": "div div div .product",  # Too many levels
    "fields": [
        {
            "selector": "* h3",  # Universal selector is slow
            "type": "text"
        }
    ]
}
```

---

## 6. Error Handling and Validation

```python
async def robust_extraction():
    """
    Implement fallback strategies for reliable extraction
    """
    strategies = [
        # Try fast regex first
        RegexExtractionStrategy(pattern=RegexExtractionStrategy.Currency),

        # Fallback to CSS schema
        JsonCssExtractionStrategy({
            "name": "Prices",
            "baseSelector": ".price",
            "fields": [{"name": "amount", "selector": "span", "type": "text"}]
        }),

        # Last resort: try different selector
        JsonCssExtractionStrategy({
            "name": "Fallback Prices",
            "baseSelector": "[data-price]",
            "fields": [{"name": "amount", "type": "attribute", "attribute": "data-price"}]
        })
    ]

    async with AsyncWebCrawler() as crawler:
        for i, strategy in enumerate(strategies):
            try:
                config = CrawlerRunConfig(extraction_strategy=strategy)
                result = await crawler.arun(url="https://example.com", config=config)

                if result.success and result.extracted_content:
                    data = json.loads(result.extracted_content)
                    if data:  # Validate non-empty results
                        print(f"✅ Success with strategy {i+1}: {strategy.__class__.__name__}")
                        return data

            except Exception as e:
                print(f"❌ Strategy {i+1} failed: {e}")
                continue

    print("❌ All strategies failed")
    return None

# Validate extracted data
def validate_extraction(data, required_fields):
    """Validate that extraction contains expected fields"""
    if not data or not isinstance(data, list):
        return False

    for item in data:
        for field in required_fields:
            if field not in item or not item[field]:
                return False
    return True

# Usage
result = await robust_extraction()
if validate_extraction(result, ["amount"]):
    print("✅ Extraction validated")
else:
    print("❌ Validation failed")
```

---

## 7. Common Extraction Patterns

### E-commerce Products

```python
ecommerce_schema = {
    "name": "E-commerce Products",
    "baseSelector": ".product, [data-product], .item",
    "fields": [
        {"name": "title", "selector": "h1, h2, h3, .title, .name", "type": "text"},
        {"name": "price", "selector": ".price, .cost, [data-price]", "type": "text"},
        {"name": "image", "selector": "img", "type": "attribute", "attribute": "src"},
        {"name": "url", "selector": "a", "type": "attribute", "attribute": "href"},
        {"name": "rating", "selector": ".rating, .stars", "type": "text"},
        {"name": "availability", "selector": ".stock, .availability", "type": "text"}
    ]
}
```

### News Articles

```python
news_schema = {
    "name": "News Articles",
    "baseSelector": "article, .article, .post",
    "fields": [
        {"name": "headline", "selector": "h1, h2, .headline, .title", "type": "text"},
        {"name": "author", "selector": ".author, .byline, [rel='author']", "type": "text"},
        {"name": "date", "selector": "time, .date, .published", "type": "text"},
        {"name": "content", "selector": ".content, .body, .text", "type": "text"},
        {"name": "category", "selector": ".category, .section", "type": "text"}
    ]
}
```

### Job Listings

```python
job_schema = {
    "name": "Job Listings",
    "baseSelector": ".job, .listing, [data-job]",
    "fields": [
        {"name": "title", "selector": ".job-title, h2, h3", "type": "text"},
        {"name": "company", "selector": ".company, .employer", "type": "text"},
        {"name": "location", "selector": ".location, .place", "type": "text"},
        {"name": "salary", "selector": ".salary, .pay, .compensation", "type": "text"},
        {"name": "description", "selector": ".description, .summary", "type": "text"},
        {"name": "url", "selector": "a", "type": "attribute", "attribute": "href"}
    ]
}
```

### Social Media Posts

```python
social_schema = {
    "name": "Social Media Posts",
    "baseSelector": ".post, .tweet, .update",
    "fields": [
        {"name": "username", "selector": ".username, .handle, .author", "type": "text"},
        {"name": "content", "selector": ".content, .text, .message", "type": "text"},
        {"name": "timestamp", "selector": ".time, .date, time", "type": "text"},
        {"name": "likes", "selector": ".likes, .hearts", "type": "text"},
        {"name": "shares", "selector": ".shares, .retweets", "type": "text"}
    ]
}
```

---

## 8. When to (Rarely) Consider LLM

**⚠️ WARNING: Before considering LLM, ask yourself:**

1. "Can I identify repeating HTML patterns?" → Use CSS/XPath schema
2. "Am I extracting simple data types?" → Use Regex patterns
3. "Can I provide a JSON example of what I want?" → Use generate_schema()
4. "Is this truly unstructured text requiring semantic understanding?" → Maybe LLM

**Only use LLM extraction for:**

- Unstructured prose that needs semantic analysis
- Content where structure varies dramatically across pages
- When you need AI reasoning about context/meaning

**Cost reminder**: LLM extraction costs 10,000x more than schema-based extraction.

---

## 9. Summary: The Extraction Hierarchy

1. **🥇 FIRST CHOICE**: `generate_schema()` - AI generates pattern once, use unlimited times
2. **🥈 SECOND CHOICE**: Manual CSS/XPath - Full control, maximum speed
3. **🥉 THIRD CHOICE**: Regex patterns - Simple data types, lightning fast
4. **🏴 LAST RESORT**: LLM extraction - Only for semantic reasoning

**Remember**: 99% of web data is structured. You almost never need LLM for extraction. Save LLM for analysis, not extraction.

**Performance**: Non-LLM strategies are 100-1000x faster and 10,000x cheaper than LLM extraction.

---

**📖 Next**: If you absolutely must use LLM extraction, see [extraction-llm.md](./extraction-llm.md) for guidance on the rare cases where it's justified.

---

## Data Extraction Without LLM - Diagrams & Workflows

Component ID: extraction-no-llm
Context Type: reasoning
Estimated tokens: 3,543

## Extraction Strategy Workflows and Architecture

Visual representations of Crawl4AI's data extraction approaches, strategy selection, and processing workflows.

### Extraction Strategy Decision Tree

```mermaid
flowchart TD
    A[Content to Extract] --> B{Content Type?}

    B -->|Simple Patterns| C[Common Data Types]
    B -->|Structured HTML| D[Predictable Structure]
    B -->|Complex Content| E[Requires Reasoning]
    B -->|Mixed Content| F[Multiple Data Types]

    C --> C1{Pattern Type?}
    C1 -->|Email, Phone, URLs| C2[Built-in Regex Patterns]
    C1 -->|Custom Patterns| C3[Custom Regex Strategy]
    C1 -->|LLM-Generated| C4[One-time Pattern Generation]

    D --> D1{Selector Type?}
    D1 -->|CSS Selectors| D2[JsonCssExtractionStrategy]
    D1 -->|XPath Expressions| D3[JsonXPathExtractionStrategy]
    D1 -->|Need Schema?| D4[Auto-generate Schema with LLM]

    E --> E1{LLM Provider?}
    E1 -->|OpenAI/Anthropic| E2[Cloud LLM Strategy]
    E1 -->|Local Ollama| E3[Local LLM Strategy]
    E1 -->|Cost-sensitive| E4[Hybrid: Generate Schema Once]

    F --> F1[Multi-Strategy Approach]
    F1 --> F2[1. Regex for Patterns]
    F1 --> F3[2. CSS for Structure]
    F1 --> F4[3. LLM for Complex Analysis]

    C2 --> G[Fast Extraction ⚡]
    C3 --> G
    C4 --> H[Cached Pattern Reuse]

    D2 --> I[Schema-based Extraction 🏗️]
    D3 --> I
    D4 --> J[Generated Schema Cache]

    E2 --> K[Intelligent Parsing 🧠]
    E3 --> K
    E4 --> L[Hybrid Cost-Effective]

    F2 --> M[Comprehensive Results 📊]
    F3 --> M
    F4 --> M

    style G fill:#c8e6c9
    style I fill:#e3f2fd
    style K fill:#fff3e0
    style M fill:#f3e5f5
    style H fill:#e8f5e8
    style J fill:#e8f5e8
    style L fill:#ffecb3
```

### LLM Extraction Strategy Workflow

```mermaid
sequenceDiagram
    participant User
    participant Crawler
    participant LLMStrategy
    participant Chunker
    participant LLMProvider
    participant Parser

    User->>Crawler: Configure LLMExtractionStrategy
    User->>Crawler: arun(url, config)

    Crawler->>Crawler: Navigate to URL
    Crawler->>Crawler: Extract content (HTML/Markdown)
    Crawler->>LLMStrategy: Process content

    LLMStrategy->>LLMStrategy: Check content size

    alt Content > chunk_threshold
        LLMStrategy->>Chunker: Split into chunks with overlap
        Chunker-->>LLMStrategy: Return chunks[]

        loop For each chunk
            LLMStrategy->>LLMProvider: Send chunk + schema + instruction
            LLMProvider-->>LLMStrategy: Return structured JSON
        end

        LLMStrategy->>LLMStrategy: Merge chunk results
    else Content <= threshold
        LLMStrategy->>LLMProvider: Send full content + schema
        LLMProvider-->>LLMStrategy: Return structured JSON
    end

    LLMStrategy->>Parser: Validate JSON schema
    Parser-->>LLMStrategy: Validated data

    LLMStrategy->>LLMStrategy: Track token usage
    LLMStrategy-->>Crawler: Return extracted_content

    Crawler-->>User: CrawlResult with JSON data

    User->>LLMStrategy: show_usage()
    LLMStrategy-->>User: Token count & estimated cost
```

### Schema-Based Extraction Architecture

```mermaid
graph TB
    subgraph "Schema Definition"
        A[JSON Schema] --> A1[baseSelector]
        A --> A2[fields[]]
        A --> A3[nested structures]

        A2 --> A4[CSS/XPath selectors]
        A2 --> A5[Data types: text, html, attribute]
        A2 --> A6[Default values]

        A3 --> A7[nested objects]
        A3 --> A8[nested_list arrays]
        A3 --> A9[simple lists]
    end

    subgraph "Extraction Engine"
        B[HTML Content] --> C[Selector Engine]
        C --> C1[CSS Selector Parser]
        C --> C2[XPath Evaluator]

        C1 --> D[Element Matcher]
        C2 --> D

        D --> E[Type Converter]
        E --> E1[Text Extraction]
        E --> E2[HTML Preservation]
        E --> E3[Attribute Extraction]
        E --> E4[Nested Processing]
    end

    subgraph "Result Processing"
        F[Raw Extracted Data] --> G[Structure Builder]
        G --> G1[Object Construction]
        G --> G2[Array Assembly]
        G --> G3[Type Validation]

        G1 --> H[JSON Output]
        G2 --> H
        G3 --> H
    end

    A --> C
    E --> F
    H --> I[extracted_content]

    style A fill:#e3f2fd
    style C fill:#f3e5f5
    style G fill:#e8f5e8
    style H fill:#c8e6c9
```

### Automatic Schema Generation Process

```mermaid
stateDiagram-v2
    [*] --> CheckCache

    CheckCache --> CacheHit: Schema exists
    CheckCache --> SamplePage: Schema missing

    CacheHit --> LoadSchema
    LoadSchema --> FastExtraction

    SamplePage --> ExtractHTML: Crawl sample URL
    ExtractHTML --> LLMAnalysis: Send HTML to LLM
    LLMAnalysis --> GenerateSchema: Create CSS/XPath selectors
    GenerateSchema --> ValidateSchema: Test generated schema

    ValidateSchema --> SchemaWorks: Valid selectors
    ValidateSchema --> RefineSchema: Invalid selectors

    RefineSchema --> LLMAnalysis: Iterate with feedback

    SchemaWorks --> CacheSchema: Save for reuse
    CacheSchema --> FastExtraction: Use cached schema

    FastExtraction --> [*]: No more LLM calls needed

    note right of CheckCache : One-time LLM cost
    note right of FastExtraction : Unlimited fast reuse
    note right of CacheSchema : JSON file storage
```

### Multi-Strategy Extraction Pipeline

```mermaid
flowchart LR
    A[Web Page Content] --> B[Strategy Pipeline]

    subgraph B["Extraction Pipeline"]
        B1[Stage 1: Regex Patterns]
        B2[Stage 2: Schema-based CSS]
        B3[Stage 3: LLM Analysis]

        B1 --> B1a[Email addresses]
        B1 --> B1b[Phone numbers]
        B1 --> B1c[URLs and links]
        B1 --> B1d[Currency amounts]

        B2 --> B2a[Structured products]
        B2 --> B2b[Article metadata]
        B2 --> B2c[User reviews]
        B2 --> B2d[Navigation links]

        B3 --> B3a[Sentiment analysis]
        B3 --> B3b[Key topics]
        B3 --> B3c[Entity recognition]
        B3 --> B3d[Content summary]
    end

    B1a --> C[Result Merger]
    B1b --> C
    B1c --> C
    B1d --> C

    B2a --> C
    B2b --> C
    B2c --> C
    B2d --> C

    B3a --> C
    B3b --> C
    B3c --> C
    B3d --> C

    C --> D[Combined JSON Output]
    D --> E[Final CrawlResult]

    style B1 fill:#c8e6c9
    style B2 fill:#e3f2fd
    style B3 fill:#fff3e0
    style C fill:#f3e5f5
```

### Performance Comparison Matrix

```mermaid
graph TD
    subgraph "Strategy Performance"
        A[Extraction Strategy Comparison]

        subgraph "Speed ⚡"
            S1[Regex: ~10ms]
            S2[CSS Schema: ~50ms]
            S3[XPath: ~100ms]
            S4[LLM: ~2-10s]
        end

        subgraph "Accuracy 🎯"
            A1[Regex: Pattern-dependent]
            A2[CSS: High for structured]
            A3[XPath: Very high]
            A4[LLM: Excellent for complex]
        end

        subgraph "Cost 💰"
            C1[Regex: Free]
            C2[CSS: Free]
            C3[XPath: Free]
            C4[LLM: $0.001-0.01 per page]
        end

        subgraph "Complexity 🔧"
            X1[Regex: Simple patterns only]
            X2[CSS: Structured HTML]
            X3[XPath: Complex selectors]
            X4[LLM: Any content type]
        end
    end

    style S1 fill:#c8e6c9
    style S2 fill:#e8f5e8
    style S3 fill:#fff3e0
    style S4 fill:#ffcdd2

    style A2 fill:#e8f5e8
    style A3 fill:#c8e6c9
    style A4 fill:#c8e6c9

    style C1 fill:#c8e6c9
    style C2 fill:#c8e6c9
    style C3 fill:#c8e6c9
    style C4 fill:#fff3e0

    style X1 fill:#ffcdd2
    style X2 fill:#e8f5e8
    style X3 fill:#c8e6c9
    style X4 fill:#c8e6c9
```

### Regex Pattern Strategy Flow

```mermaid
flowchart TD
    A[Regex Extraction] --> B{Pattern Source?}

    B -->|Built-in| C[Use Predefined Patterns]
    B -->|Custom| D[Define Custom Regex]
    B -->|LLM-Generated| E[Generate with AI]

    C --> C1[Email Pattern]
    C --> C2[Phone Pattern]
    C --> C3[URL Pattern]
    C --> C4[Currency Pattern]
    C --> C5[Date Pattern]

    D --> D1[Write Custom Regex]
    D --> D2[Test Pattern]
    D --> D3{Pattern Works?}
    D3 -->|No| D1
    D3 -->|Yes| D4[Use Pattern]

    E --> E1[Provide Sample Content]
    E --> E2[LLM Analyzes Content]
    E --> E3[Generate Optimized Regex]
    E --> E4[Cache Pattern for Reuse]

    C1 --> F[Pattern Matching]
    C2 --> F
    C3 --> F
    C4 --> F
    C5 --> F
    D4 --> F
    E4 --> F

    F --> G[Extract Matches]
    G --> H[Group by Pattern Type]
    H --> I[JSON Output with Labels]

    style C fill:#e8f5e8
    style D fill:#e3f2fd
    style E fill:#fff3e0
    style F fill:#f3e5f5
```

### Complex Schema Structure Visualization

```mermaid
graph TB
    subgraph "E-commerce Schema Example"
        A[Category baseSelector] --> B[Category Fields]
        A --> C[Products nested_list]

        B --> B1[category_name]
        B --> B2[category_id attribute]
        B --> B3[category_url attribute]

        C --> C1[Product baseSelector]
        C1 --> C2[name text]
        C1 --> C3[price text]
        C1 --> C4[Details nested object]
        C1 --> C5[Features list]
        C1 --> C6[Reviews nested_list]

        C4 --> C4a[brand text]
        C4 --> C4b[model text]
        C4 --> C4c[specs html]

        C5 --> C5a[feature text array]

        C6 --> C6a[reviewer text]
        C6 --> C6b[rating attribute]
        C6 --> C6c[comment text]
        C6 --> C6d[date attribute]
    end

    subgraph "JSON Output Structure"
        D[categories array] --> D1[category object]
        D1 --> D2[category_name]
        D1 --> D3[category_id]
        D1 --> D4[products array]

        D4 --> D5[product object]
        D5 --> D6[name, price]
        D5 --> D7[details object]
        D5 --> D8[features array]
        D5 --> D9[reviews array]

        D7 --> D7a[brand, model, specs]
        D8 --> D8a[feature strings]
        D9 --> D9a[review objects]
    end

    A -.-> D
    B1 -.-> D2
    C2 -.-> D6
    C4 -.-> D7
    C5 -.-> D8
    C6 -.-> D9

    style A fill:#e3f2fd
    style C fill:#f3e5f5
    style C4 fill:#e8f5e8
    style D fill:#fff3e0
```

### Error Handling and Fallback Strategy

```mermaid
stateDiagram-v2
    [*] --> PrimaryStrategy

    PrimaryStrategy --> Success: Extraction successful
    PrimaryStrategy --> ValidationFailed: Invalid data
    PrimaryStrategy --> ExtractionFailed: No matches found
    PrimaryStrategy --> TimeoutError: LLM timeout

    ValidationFailed --> FallbackStrategy: Try alternative
    ExtractionFailed --> FallbackStrategy: Try alternative
    TimeoutError --> FallbackStrategy: Try alternative

    FallbackStrategy --> FallbackSuccess: Fallback works
    FallbackStrategy --> FallbackFailed: All strategies failed

    FallbackSuccess --> Success: Return results
    FallbackFailed --> ErrorReport: Log failure details

    Success --> [*]: Complete
    ErrorReport --> [*]: Return empty results

    note right of PrimaryStrategy : Try fastest/most accurate first
    note right of FallbackStrategy : Use simpler but reliable method
    note left of ErrorReport : Provide debugging information
```

### Token Usage and Cost Optimization

```mermaid
flowchart TD
    A[LLM Extraction Request] --> B{Content Size Check}

    B -->|Small < 1200 tokens| C[Single LLM Call]
    B -->|Large > 1200 tokens| D[Chunking Strategy]

    C --> C1[Send full content]
    C1 --> C2[Parse JSON response]
    C2 --> C3[Track token usage]

    D --> D1[Split into chunks]
    D1 --> D2[Add overlap between chunks]
    D2 --> D3[Process chunks in parallel]

    D3 --> D4[Chunk 1 → LLM]
    D3 --> D5[Chunk 2 → LLM]
    D3 --> D6[Chunk N → LLM]

    D4 --> D7[Merge results]
    D5 --> D7
    D6 --> D7

    D7 --> D8[Deduplicate data]
    D8 --> D9[Aggregate token usage]

    C3 --> E[Cost Calculation]
    D9 --> E

    E --> F[Usage Report]
    F --> F1[Prompt tokens: X]
    F --> F2[Completion tokens: Y]
    F --> F3[Total cost: $Z]

    style C fill:#c8e6c9
    style D fill:#fff3e0
    style E fill:#e3f2fd
    style F fill:#f3e5f5
```

**📖 Learn more:** [LLM Strategies](https://docs.crawl4ai.com/extraction/llm-strategies/), [Schema-Based Extraction](https://docs.crawl4ai.com/extraction/no-llm-strategies/), [Pattern Matching](https://docs.crawl4ai.com/extraction/no-llm-strategies/#regexextractionstrategy), [Performance Optimization](https://docs.crawl4ai.com/advanced/multi-url-crawling/)

---

## Configuration Objects - Full Content

Component ID: config_objects
Context Type: memory
Estimated tokens: 7,868

## Browser, Crawler & LLM Configuration

Core configuration classes for controlling browser behavior, crawl operations, LLM providers, and understanding crawl results.

### BrowserConfig - Browser Environment Setup

```python
from crawl4ai import BrowserConfig, AsyncWebCrawler

# Basic browser configuration
browser_config = BrowserConfig(
    browser_type="chromium",  # "chromium", "firefox", "webkit"
    headless=True,           # False for visible browser (debugging)
    viewport_width=1280,
    viewport_height=720,
    verbose=True
)

# Advanced browser setup with proxy and persistence
browser_config = BrowserConfig(
    headless=False,
    proxy="http://user:pass@proxy:8080",
    use_persistent_context=True,
    user_data_dir="./browser_data",
    cookies=[
        {"name": "session", "value": "abc123", "domain": "example.com"}
    ],
    headers={"Accept-Language": "en-US,en;q=0.9"},
    user_agent="Mozilla/5.0 (X11; Linux x86_64) Chrome/116.0.0.0 Safari/537.36",
    text_mode=True,  # Disable images for faster crawling
    extra_args=["--disable-extensions", "--no-sandbox"]
)

async with AsyncWebCrawler(config=browser_config) as crawler:
    result = await crawler.arun("https://example.com")
```

### CrawlerRunConfig - Crawl Operation Control

```python
from crawl4ai import CrawlerRunConfig, CacheMode
from crawl4ai.markdown_generation_strategy import DefaultMarkdownGenerator
from crawl4ai.content_filter_strategy import PruningContentFilter

# Basic crawl configuration
run_config = CrawlerRunConfig(
    cache_mode=CacheMode.BYPASS,
    word_count_threshold=10,
    excluded_tags=["nav", "footer", "script"],
    exclude_external_links=True,
    screenshot=True,
    pdf=True
)

# Advanced content processing
md_generator = DefaultMarkdownGenerator(
    content_filter=PruningContentFilter(threshold=0.6),
    options={"citations": True, "ignore_links": False}
)

run_config = CrawlerRunConfig(
    # Content processing
    markdown_generator=md_generator,
    css_selector="main.content",  # Focus on specific content
    target_elements=[".article", ".post"],  # Multiple target selectors
    process_iframes=True,
    remove_overlay_elements=True,

    # Page interaction
    js_code=[
        "window.scrollTo(0, document.body.scrollHeight);",
        "document.querySelector('.load-more')?.click();"
    ],
    wait_for="css:.content-loaded",
    wait_for_timeout=10000,
    scan_full_page=True,

    # Session management
    session_id="persistent_session",

    # Media handling
    screenshot=True,
    pdf=True,
    capture_mhtml=True,
    image_score_threshold=5,

    # Advanced options
    simulate_user=True,
    magic=True,  # Auto-handle popups
    verbose=True
)
```

### CrawlerRunConfig Parameters by Category

```python
# Content Processing
config = CrawlerRunConfig(
    word_count_threshold=10,              # Min words per content block
    css_selector="main.article",          # Focus on specific content
    target_elements=[".post", ".content"], # Multiple target selectors
    excluded_tags=["nav", "footer"],       # Remove these tags
    excluded_selector="#ads, .tracker",   # Remove by selector
    only_text=True,                       # Text-only extraction
    keep_data_attributes=True,            # Preserve data-* attributes
    remove_forms=True,                    # Remove all forms
    process_iframes=True                  # Include iframe content
)

# Page Navigation & Timing
config = CrawlerRunConfig(
    wait_until="networkidle",             # Wait condition
    page_timeout=60000,                   # 60 second timeout
    wait_for="css:.loaded",               # Wait for specific element
    wait_for_images=True,                 # Wait for images to load
    delay_before_return_html=0.5,         # Final delay before capture
    semaphore_count=10                    # Max concurrent operations
)

# Page Interaction
config = CrawlerRunConfig(
    js_code="document.querySelector('button').click();",
    scan_full_page=True,                  # Auto-scroll page
    scroll_delay=0.3,                     # Delay between scrolls
    remove_overlay_elements=True,         # Remove popups/modals
    simulate_user=True,                   # Simulate human behavior
    override_navigator=True,              # Override navigator properties
    magic=True                           # Auto-handle common patterns
)

# Caching & Session
config = CrawlerRunConfig(
    cache_mode=CacheMode.BYPASS,          # Cache behavior
    session_id="my_session",              # Persistent session
    shared_data={"context": "value"}      # Share data between hooks
)

# Media & Output
config = CrawlerRunConfig(
    screenshot=True,                      # Capture screenshot
    pdf=True,                            # Generate PDF
    capture_mhtml=True,                  # Capture MHTML archive
    image_score_threshold=3,             # Filter low-quality images
    exclude_external_images=True         # Remove external images
)

# Link & Domain Filtering
config = CrawlerRunConfig(
    exclude_external_links=True,         # Remove external links
    exclude_social_media_links=True,     # Remove social media links
    exclude_domains=["ads.com", "tracker.io"],  # Custom domain filter
    exclude_internal_links=False         # Keep internal links
)
```

### LLMConfig - Language Model Setup

```python
from crawl4ai import LLMConfig

# OpenAI configuration
llm_config = LLMConfig(
    provider="openai/gpt-4o-mini",
    api_token=os.getenv("OPENAI_API_KEY"),  # or "env:OPENAI_API_KEY"
    temperature=0.1,
    max_tokens=2000
)

# Local model with Ollama
llm_config = LLMConfig(
    provider="ollama/llama3.3",
    api_token=None,  # Not needed for Ollama
    base_url="http://localhost:11434"  # Custom endpoint
)

# Anthropic Claude
llm_config = LLMConfig(
    provider="anthropic/claude-3-5-sonnet-20240620",
    api_token="env:ANTHROPIC_API_KEY",
    max_tokens=4000
)

# Google Gemini
llm_config = LLMConfig(
    provider="gemini/gemini-1.5-pro",
    api_token="env:GEMINI_API_KEY"
)

# Groq (fast inference)
llm_config = LLMConfig(
    provider="groq/llama3-70b-8192",
    api_token="env:GROQ_API_KEY"
)
```

### CrawlResult - Understanding Output

```python
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig

async with AsyncWebCrawler() as crawler:
    result = await crawler.arun("https://example.com", config=run_config)

    # Basic status information
    print(f"Success: {result.success}")
    print(f"Status: {result.status_code}")
    print(f"URL: {result.url}")

    if not result.success:
        print(f"Error: {result.error_message}")
        return

    # HTML content variants
    print(f"Original HTML: {len(result.html)} chars")
    print(f"Cleaned HTML: {len(result.cleaned_html or '')} chars")

    # Markdown output (MarkdownGenerationResult)
    if result.markdown:
        print(f"Raw markdown: {len(result.markdown.raw_markdown)} chars")
        print(f"With citations: {len(result.markdown.markdown_with_citations)} chars")

        # Filtered content (if content filter was used)
        if result.markdown.fit_markdown:
            print(f"Fit markdown: {len(result.markdown.fit_markdown)} chars")
            print(f"Fit HTML: {len(result.markdown.fit_html)} chars")

    # Extracted structured data
    if result.extracted_content:
        import json
        data = json.loads(result.extracted_content)
        print(f"Extracted {len(data)} items")

    # Media and links
    images = result.media.get("images", [])
    print(f"Found {len(images)} images")
    for img in images[:3]:  # First 3 images
        print(f"  {img.get('src')} (score: {img.get('score', 0)})")

    internal_links = result.links.get("internal", [])
    external_links = result.links.get("external", [])
    print(f"Links: {len(internal_links)} internal, {len(external_links)} external")

    # Generated files
    if result.screenshot:
        print(f"Screenshot captured: {len(result.screenshot)} chars (base64)")
        # Save screenshot
        import base64
        with open("page.png", "wb") as f:
            f.write(base64.b64decode(result.screenshot))

    if result.pdf:
        print(f"PDF generated: {len(result.pdf)} bytes")
        with open("page.pdf", "wb") as f:
            f.write(result.pdf)

    if result.mhtml:
        print(f"MHTML captured: {len(result.mhtml)} chars")
        with open("page.mhtml", "w", encoding="utf-8") as f:
            f.write(result.mhtml)

    # SSL certificate information
    if result.ssl_certificate:
        print(f"SSL Issuer: {result.ssl_certificate.issuer}")
        print(f"Valid until: {result.ssl_certificate.valid_until}")

    # Network and console data (if captured)
    if result.network_requests:
        requests = [r for r in result.network_requests if r.get("event_type") == "request"]
        print(f"Network requests captured: {len(requests)}")

    if result.console_messages:
        errors = [m for m in result.console_messages if m.get("type") == "error"]
        print(f"Console messages: {len(result.console_messages)} ({len(errors)} errors)")

    # Session and metadata
    if result.session_id:
        print(f"Session ID: {result.session_id}")

    if result.metadata:
        print(f"Metadata: {result.metadata.get('title', 'No title')}")
```

### Configuration Helpers and Best Practices

```python
# Clone configurations for variations
base_config = CrawlerRunConfig(
    cache_mode=CacheMode.ENABLED,
    word_count_threshold=200,
    verbose=True
)

# Create streaming version
stream_config = base_config.clone(
    stream=True,
    cache_mode=CacheMode.BYPASS
)

# Create debug version
debug_config = base_config.clone(
    headless=False,
    page_timeout=120000,
    verbose=True
)

# Serialize/deserialize configurations
config_dict = base_config.dump()  # Convert to dict
restored_config = CrawlerRunConfig.load(config_dict)  # Restore from dict

# Browser configuration management
browser_config = BrowserConfig(headless=True, text_mode=True)
browser_dict = browser_config.to_dict()
cloned_browser = browser_config.clone(headless=False, verbose=True)
```

### Common Configuration Patterns

```python
# Fast text-only crawling
fast_config = CrawlerRunConfig(
    cache_mode=CacheMode.ENABLED,
    text_mode=True,
    exclude_external_links=True,
    exclude_external_images=True,
    word_count_threshold=50
)

# Comprehensive data extraction
comprehensive_config = CrawlerRunConfig(
    process_iframes=True,
    scan_full_page=True,
    wait_for_images=True,
    screenshot=True,
    capture_network_requests=True,
    capture_console_messages=True,
    magic=True
)

# Stealth crawling
stealth_config = CrawlerRunConfig(
    simulate_user=True,
    override_navigator=True,
    mean_delay=2.0,
    max_range=1.0,
    user_agent_mode="random"
)
```

### Advanced Configuration Features

#### User Agent Management & Bot Detection Avoidance

```python
from crawl4ai import CrawlerRunConfig

# Random user agent generation
config = CrawlerRunConfig(
    user_agent_mode="random",
    user_agent_generator_config={
        "platform": "windows",  # "windows", "macos", "linux", "android", "ios"
        "browser": "chrome",    # "chrome", "firefox", "safari", "edge"
        "device_type": "desktop"  # "desktop", "mobile", "tablet"
    }
)

# Custom user agent with stealth features
config = CrawlerRunConfig(
    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    simulate_user=True,      # Simulate human mouse movements
    override_navigator=True,  # Override navigator properties
    mean_delay=1.5,          # Random delays between actions
    max_range=2.0
)

# Combined anti-detection approach
stealth_config = CrawlerRunConfig(
    user_agent_mode="random",
    simulate_user=True,
    override_navigator=True,
    magic=True,  # Auto-handle common bot detection patterns
    delay_before_return_html=2.0
)
```

#### Proxy Configuration with ProxyConfig

```python
from crawl4ai import CrawlerRunConfig, ProxyConfig, ProxyRotationStrategy

# Single proxy configuration
proxy_config = ProxyConfig(
    server="http://proxy.example.com:8080",
    username="proxy_user",
    password="proxy_pass"
)

# From proxy string format
proxy_config = ProxyConfig.from_string("192.168.1.100:8080:username:password")

# Multiple proxies with rotation
proxies = [
    ProxyConfig(server="http://proxy1.com:8080", username="user1", password="pass1"),
    ProxyConfig(server="http://proxy2.com:8080", username="user2", password="pass2"),
    ProxyConfig(server="http://proxy3.com:8080", username="user3", password="pass3")
]

rotation_strategy = ProxyRotationStrategy(
    proxies=proxies,
    rotation_method="round_robin"  # or "random", "least_used"
)

config = CrawlerRunConfig(
    proxy_config=proxy_config,
    proxy_rotation_strategy=rotation_strategy
)

# Load proxies from environment variable
proxies_from_env = ProxyConfig.from_env("MY_PROXIES")  # comma-separated proxy strings
```

#### Content Selection: css_selector vs target_elements

```python
from crawl4ai import CrawlerRunConfig

# css_selector: Extracts HTML at top level, affects entire processing
config = CrawlerRunConfig(
    css_selector="main.article, .content-area",  # Can be list of selectors
    # Everything else (markdown, extraction, links) works only on this HTML subset
)

# target_elements: Focuses extraction within already processed HTML
config = CrawlerRunConfig(
    css_selector="body",  # First extract entire body
    target_elements=[     # Then focus extraction on these elements
        ".article-content",
        ".post-body",
        ".main-text"
    ],
    # Links, media from entire body, but markdown/extraction only from target_elements
)

# Hierarchical content selection
config = CrawlerRunConfig(
    css_selector=["#main-content", ".article-wrapper"],  # Top-level extraction
    target_elements=[                                     # Subset for processing
        ".article-title",
        ".article-body",
        ".article-metadata"
    ],
    excluded_selector="#sidebar, .ads, .comments"  # Remove these from selection
)
```

#### Advanced wait_for Conditions

```python
from crawl4ai import CrawlerRunConfig

# CSS selector waiting
config = CrawlerRunConfig(
    wait_for="css:.content-loaded",  # Wait for element to appear
    wait_for_timeout=15000
)

# JavaScript boolean expression waiting
config = CrawlerRunConfig(
    wait_for="js:() => window.dataLoaded === true",  # Custom JS condition
    wait_for_timeout=20000
)

# Complex JavaScript conditions
config = CrawlerRunConfig(
    wait_for="js:() => document.querySelectorAll('.item').length >= 10",
    js_code=[
        "document.querySelector('.load-more')?.click();",
        "window.scrollTo(0, document.body.scrollHeight);"
    ]
)

# Multiple conditions with JavaScript
config = CrawlerRunConfig(
    wait_for="js:() => !document.querySelector('.loading') && document.querySelector('.results')",
    page_timeout=30000
)
```

#### Session Management for Multi-Step Crawling

```python
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, CacheMode

# Persistent session across multiple arun() calls
async def multi_step_crawling():
    async with AsyncWebCrawler() as crawler:
        # Step 1: Login page
        login_config = CrawlerRunConfig(
            session_id="user_session",  # Create persistent session
            js_code="document.querySelector('#username').value = 'user'; document.querySelector('#password').value = 'pass'; document.querySelector('#login').click();",
            wait_for="css:.dashboard",
            cache_mode=CacheMode.BYPASS
        )

        result1 = await crawler.arun("https://example.com/login", config=login_config)

        # Step 2: Navigate to protected area (reuses same browser page)
        nav_config = CrawlerRunConfig(
            session_id="user_session",  # Same session = same browser page
            js_only=True,  # No page reload, just JS navigation
            js_code="window.location.href = '/dashboard/data';",
            wait_for="css:.data-table"
        )

        result2 = await crawler.arun("https://example.com/dashboard/data", config=nav_config)

        # Step 3: Extract data from multiple pages
        for page in range(1, 6):
            page_config = CrawlerRunConfig(
                session_id="user_session",
                js_only=True,
                js_code=f"document.querySelector('.page-{page}').click();",
                wait_for=f"js:() => document.querySelector('.page-{page}').classList.contains('active')"
            )

            result = await crawler.arun(f"https://example.com/data/page/{page}", config=page_config)
            print(f"Page {page} data extracted: {len(result.extracted_content)}")

        # Important: Kill session when done
        await crawler.kill_session("user_session")

# Session with shared data between steps
async def session_with_shared_data():
    shared_context = {"user_id": "12345", "preferences": {"theme": "dark"}}

    config = CrawlerRunConfig(
        session_id="persistent_session",
        shared_data=shared_context,  # Available across all session calls
        js_code="console.log('User ID:', window.sharedData.user_id);"
    )
```

#### Identity-Based Crawling Parameters

```python
from crawl4ai import CrawlerRunConfig, GeolocationConfig

# Locale and timezone simulation
config = CrawlerRunConfig(
    locale="en-US",                    # Browser language preference
    timezone_id="America/New_York",    # Timezone setting
    user_agent_mode="random",
    user_agent_generator_config={
        "platform": "windows",
        "locale": "en-US"
    }
)

# Geolocation simulation
geo_config = GeolocationConfig(
    latitude=40.7128,   # New York coordinates
    longitude=-74.0060,
    accuracy=100.0
)

config = CrawlerRunConfig(
    geolocation=geo_config,
    locale="en-US",
    timezone_id="America/New_York"
)

# Complete identity simulation
identity_config = CrawlerRunConfig(
    # Location identity
    locale="fr-FR",
    timezone_id="Europe/Paris",
    geolocation=GeolocationConfig(latitude=48.8566, longitude=2.3522),

    # Browser identity
    user_agent_mode="random",
    user_agent_generator_config={
        "platform": "windows",
        "locale": "fr-FR",
        "browser": "chrome"
    },

    # Behavioral identity
    simulate_user=True,
    override_navigator=True,
    mean_delay=2.0,
    max_range=1.5
)
```

#### Simplified Import Pattern

```python
# Almost everything from crawl4ai main package
from crawl4ai import (
    AsyncWebCrawler,
    BrowserConfig,
    CrawlerRunConfig,
    LLMConfig,
    CacheMode,
    ProxyConfig,
    GeolocationConfig
)

# Specialized strategies (still from crawl4ai)
from crawl4ai import (
    JsonCssExtractionStrategy,
    LLMExtractionStrategy,
    DefaultMarkdownGenerator,
    PruningContentFilter,
    RegexChunking
)

# Complete example with simplified imports
async def example_crawl():
    browser_config = BrowserConfig(headless=True)

    run_config = CrawlerRunConfig(
        user_agent_mode="random",
        proxy_config=ProxyConfig.from_string("192.168.1.1:8080:user:pass"),
        css_selector="main.content",
        target_elements=[".article", ".post"],
        wait_for="js:() => document.querySelector('.loaded')",
        session_id="my_session",
        simulate_user=True
    )

    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun("https://example.com", config=run_config)
        return result
```

## Advanced Features

Comprehensive guide to advanced crawling capabilities including file handling, authentication, dynamic content, monitoring, and session management.

### File Download Handling

```python
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
import os

# Enable downloads with custom path
downloads_path = os.path.join(os.getcwd(), "my_downloads")
os.makedirs(downloads_path, exist_ok=True)

browser_config = BrowserConfig(
    accept_downloads=True,
    downloads_path=downloads_path
)

# Trigger downloads with JavaScript
async def download_files():
    async with AsyncWebCrawler(config=browser_config) as crawler:
        config = CrawlerRunConfig(
            js_code="""
                // Click download links
                const downloadLinks = document.querySelectorAll('a[href$=".pdf"]');
                for (const link of downloadLinks) {
                    link.click();
                    await new Promise(r => setTimeout(r, 2000));  // Delay between downloads
                }
            """,
            wait_for=5  # Wait for downloads to start
        )

        result = await crawler.arun("https://example.com/downloads", config=config)

        if result.downloaded_files:
            print("Downloaded files:")
            for file_path in result.downloaded_files:
                print(f"- {file_path} ({os.path.getsize(file_path)} bytes)")
```

### Hooks & Authentication

```python
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
from playwright.async_api import Page, BrowserContext

async def advanced_crawler_with_hooks():
    browser_config = BrowserConfig(headless=True, verbose=True)
    crawler = AsyncWebCrawler(config=browser_config)

    # Hook functions for different stages
    async def on_browser_created(browser, **kwargs):
        print("[HOOK] Browser created successfully")
        return browser

    async def on_page_context_created(page: Page, context: BrowserContext, **kwargs):
        print("[HOOK] Setting up page & context")

        # Block images for faster crawling
        async def route_filter(route):
            if route.request.resource_type == "image":
                await route.abort()
            else:
                await route.continue_()

        await context.route("**", route_filter)

        # Simulate login if needed
        # await page.goto("https://example.com/login")
        # await page.fill("input[name='username']", "testuser")
        # await page.fill("input[name='password']", "password123")
        # await page.click("button[type='submit']")

        await page.set_viewport_size({"width": 1080, "height": 600})
        return page

    async def before_goto(page: Page, context: BrowserContext, url: str, **kwargs):
        print(f"[HOOK] About to navigate to: {url}")
        await page.set_extra_http_headers({"Custom-Header": "my-value"})
        return page

    async def after_goto(page: Page, context: BrowserContext, url: str, response, **kwargs):
        print(f"[HOOK] Successfully loaded: {url}")
        try:
            await page.wait_for_selector('.content', timeout=1000)
            print("[HOOK] Content found!")
        except:
            print("[HOOK] Content not found, continuing")
        return page

    async def before_retrieve_html(page: Page, context: BrowserContext, **kwargs):
        print("[HOOK] Final actions before HTML retrieval")
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight);")
        return page

    # Attach hooks
    crawler.crawler_strategy.set_hook("on_browser_created", on_browser_created)
    crawler.crawler_strategy.set_hook("on_page_context_created", on_page_context_created)
    crawler.crawler_strategy.set_hook("before_goto", before_goto)
    crawler.crawler_strategy.set_hook("after_goto", after_goto)
    crawler.crawler_strategy.set_hook("before_retrieve_html", before_retrieve_html)

    await crawler.start()

    config = CrawlerRunConfig()
    result = await crawler.arun("https://example.com", config=config)

    if result.success:
        print(f"Crawled successfully: {len(result.html)} chars")

    await crawler.close()
```

### Lazy Loading & Dynamic Content

```python
# Handle lazy-loaded images and infinite scroll
async def handle_lazy_loading():
    config = CrawlerRunConfig(
        # Wait for images to fully load
        wait_for_images=True,

        # Automatically scroll entire page to trigger lazy loading
        scan_full_page=True,
        scroll_delay=0.5,  # Delay between scroll steps

        # JavaScript for custom lazy loading
        js_code="""
            // Scroll and wait for content to load
            window.scrollTo(0, document.body.scrollHeight);

            // Click "Load More" if available
            const loadMoreBtn = document.querySelector('.load-more');
            if (loadMoreBtn) {
                loadMoreBtn.click();
            }
        """,

        # Wait for specific content to appear
        wait_for="css:.lazy-content:nth-child(20)",  # Wait for 20 items

        # Exclude external images to focus on main content
        exclude_external_images=True
    )

    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun("https://example.com/gallery", config=config)

        if result.success:
            images = result.media.get("images", [])
            print(f"Loaded {len(images)} images after lazy loading")
            for img in images[:3]:
                print(f"- {img.get('src')} (score: {img.get('score', 'N/A')})")
```

### Network & Console Monitoring

```python
# Capture all network requests and console messages for debugging
async def monitor_network_and_console():
    config = CrawlerRunConfig(
        capture_network_requests=True,
        capture_console_messages=True
    )

    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun("https://example.com", config=config)

        if result.success:
            # Analyze network requests
            if result.network_requests:
                requests = [r for r in result.network_requests if r.get("event_type") == "request"]
                responses = [r for r in result.network_requests if r.get("event_type") == "response"]
                failures = [r for r in result.network_requests if r.get("event_type") == "request_failed"]

                print(f"Network activity: {len(requests)} requests, {len(responses)} responses, {len(failures)} failures")

                # Find API calls
                api_calls = [r for r in requests if "api" in r.get("url", "")]
                print(f"API calls detected: {len(api_calls)}")

                # Show failed requests
                for failure in failures[:3]:
                    print(f"Failed: {failure.get('url')} - {failure.get('failure_text')}")

            # Analyze console messages
            if result.console_messages:
                message_types = {}
                for msg in result.console_messages:
                    msg_type = msg.get("type", "unknown")
                    message_types[msg_type] = message_types.get(msg_type, 0) + 1

                print(f"Console messages: {message_types}")

                # Show errors
                errors = [msg for msg in result.console_messages if msg.get("type") == "error"]
                for error in errors[:2]:
                    print(f"JS Error: {error.get('text', '')[:100]}")
```

### Session Management for Multi-Step Workflows

```python
# Maintain state across multiple requests for complex workflows
async def multi_step_session_workflow():
    session_id = "workflow_session"

    async with AsyncWebCrawler() as crawler:
        # Step 1: Initial page load
        config1 = CrawlerRunConfig(
            session_id=session_id,
            wait_for="css:.content-loaded"
        )

        result1 = await crawler.arun("https://example.com/step1", config=config1)
        print("Step 1 completed")

        # Step 2: Navigate and interact (same browser tab)
        config2 = CrawlerRunConfig(
            session_id=session_id,
            js_only=True,  # Don't reload page, just run JS
            js_code="""
                document.querySelector('#next-button').click();
            """,
            wait_for="css:.step2-content"
        )

        result2 = await crawler.arun("https://example.com/step2", config=config2)
        print("Step 2 completed")

        # Step 3: Form submission
        config3 = CrawlerRunConfig(
            session_id=session_id,
            js_only=True,
            js_code="""
                document.querySelector('#form-field').value = 'test data';
                document.querySelector('#submit-btn').click();
            """,
            wait_for="css:.results"
        )

        result3 = await crawler.arun("https://example.com/submit", config=config3)
        print("Step 3 completed")

        # Clean up session
        await crawler.crawler_strategy.kill_session(session_id)

# Advanced GitHub commits pagination example
async def github_commits_pagination():
    session_id = "github_session"
    all_commits = []

    async with AsyncWebCrawler() as crawler:
        for page in range(3):
            if page == 0:
                # Initial load
                config = CrawlerRunConfig(
                    session_id=session_id,
                    wait_for="js:() => document.querySelectorAll('li.Box-sc-g0xbh4-0').length > 0"
                )
            else:
                # Navigate to next page
                config = CrawlerRunConfig(
                    session_id=session_id,
                    js_only=True,
                    js_code='document.querySelector(\'a[data-testid="pagination-next-button"]\').click();',
                    wait_for="js:() => document.querySelectorAll('li.Box-sc-g0xbh4-0').length > 0"
                )

            result = await crawler.arun(
                "https://github.com/microsoft/TypeScript/commits/main",
                config=config
            )

            if result.success:
                commit_count = result.cleaned_html.count('li.Box-sc-g0xbh4-0')
                print(f"Page {page + 1}: Found {commit_count} commits")

        await crawler.crawler_strategy.kill_session(session_id)
```

### SSL Certificate Analysis

```python
# Fetch and analyze SSL certificates
async def analyze_ssl_certificates():
    config = CrawlerRunConfig(
        fetch_ssl_certificate=True
    )

    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun("https://example.com", config=config)

        if result.success and result.ssl_certificate:
            cert = result.ssl_certificate

            # Basic certificate info
            print(f"Issuer: {cert.issuer.get('CN', 'Unknown')}")
            print(f"Subject: {cert.subject.get('CN', 'Unknown')}")
            print(f"Valid from: {cert.valid_from}")
            print(f"Valid until: {cert.valid_until}")
            print(f"Fingerprint: {cert.fingerprint}")

            # Export certificate in different formats
            import os
            os.makedirs("certificates", exist_ok=True)

            cert.to_json("certificates/cert.json")
            cert.to_pem("certificates/cert.pem")
            cert.to_der("certificates/cert.der")

            print("Certificate exported in multiple formats")
```

### Advanced Page Interaction

```python
# Complex page interactions with dynamic content
async def advanced_page_interaction():
    async with AsyncWebCrawler() as crawler:
        # Multi-step interaction with waiting
        config = CrawlerRunConfig(
            js_code=[
                # Step 1: Scroll to load content
                "window.scrollTo(0, document.body.scrollHeight);",

                # Step 2: Wait and click load more
                """
                (async () => {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    const loadMore = document.querySelector('.load-more');
                    if (loadMore) loadMore.click();
                })();
                """
            ],

            # Wait for new content to appear
            wait_for="js:() => document.querySelectorAll('.item').length > 20",

            # Additional timing controls
            page_timeout=60000,  # 60 second timeout
            delay_before_return_html=2.0,  # Wait before final capture

            # Handle overlays automatically
            remove_overlay_elements=True,
            magic=True,  # Auto-handle common popup patterns

            # Simulate human behavior
            simulate_user=True,
            override_navigator=True
        )

        result = await crawler.arun("https://example.com/dynamic", config=config)

        if result.success:
            print(f"Interactive crawl completed: {len(result.cleaned_html)} chars")

# Form interaction example
async def form_interaction_example():
    config = CrawlerRunConfig(
        js_code="""
            // Fill search form
            document.querySelector('#search-input').value = 'machine learning';
            document.querySelector('#category-select').value = 'technology';
            document.querySelector('#search-form').submit();
        """,
        wait_for="css:.search-results",
        session_id="search_session"
    )

    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun("https://example.com/search", config=config)
        print("Search completed, results loaded")
```

### Local File & Raw HTML Processing

```python
# Handle different input types: URLs, local files, raw HTML
async def handle_different_inputs():
    async with AsyncWebCrawler() as crawler:
        # 1. Regular web URL
        result1 = await crawler.arun("https://example.com")

        # 2. Local HTML file
        local_file_path = "/path/to/file.html"
        result2 = await crawler.arun(f"file://{local_file_path}")

        # 3. Raw HTML content
        raw_html = "<html><body><h1>Test Content</h1><p>Sample text</p></body></html>"
        result3 = await crawler.arun(f"raw:{raw_html}")

        # All return the same CrawlResult structure
        for i, result in enumerate([result1, result2, result3], 1):
            if result.success:
                print(f"Input {i}: {len(result.markdown)} chars of markdown")

# Save and re-process HTML example
async def save_and_reprocess():
    async with AsyncWebCrawler() as crawler:
        # Original crawl
        result = await crawler.arun("https://example.com")

        if result.success:
            # Save HTML to file
            with open("saved_page.html", "w", encoding="utf-8") as f:
                f.write(result.html)

            # Re-process from file
            file_result = await crawler.arun("file://./saved_page.html")

            # Process as raw HTML
            raw_result = await crawler.arun(f"raw:{result.html}")

            # Verify consistency
            assert len(result.markdown) == len(file_result.markdown) == len(raw_result.markdown)
            print("✅ All processing methods produced identical results")
```

### Advanced Link & Media Handling

```python
# Comprehensive link and media extraction with filtering
async def advanced_link_media_handling():
    config = CrawlerRunConfig(
        # Link filtering
        exclude_external_links=False,  # Keep external links for analysis
        exclude_social_media_links=True,
        exclude_domains=["ads.com", "tracker.io", "spammy.net"],

        # Media handling
        exclude_external_images=True,
        image_score_threshold=5,  # Only high-quality images
        table_score_threshold=7,  # Only well-structured tables
        wait_for_images=True,

        # Capture additional formats
        screenshot=True,
        pdf=True,
        capture_mhtml=True  # Full page archive
    )

    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun("https://example.com", config=config)

        if result.success:
            # Analyze links
            internal_links = result.links.get("internal", [])
            external_links = result.links.get("external", [])
            print(f"Links: {len(internal_links)} internal, {len(external_links)} external")

            # Analyze media
            images = result.media.get("images", [])
            tables = result.media.get("tables", [])
            print(f"Media: {len(images)} images, {len(tables)} tables")

            # High-quality images only
            quality_images = [img for img in images if img.get("score", 0) >= 5]
            print(f"High-quality images: {len(quality_images)}")

            # Table analysis
            for i, table in enumerate(tables[:2]):
                print(f"Table {i+1}: {len(table.get('headers', []))} columns, {len(table.get('rows', []))} rows")

            # Save captured files
            if result.screenshot:
                import base64
                with open("page_screenshot.png", "wb") as f:
                    f.write(base64.b64decode(result.screenshot))

            if result.pdf:
                with open("page.pdf", "wb") as f:
                    f.write(result.pdf)

            if result.mhtml:
                with open("page_archive.mhtml", "w", encoding="utf-8") as f:
                    f.write(result.mhtml)

            print("Additional formats saved: screenshot, PDF, MHTML archive")
```

### Performance & Resource Management

```python
# Optimize performance for large-scale crawling
async def performance_optimized_crawling():
    # Lightweight browser config
    browser_config = BrowserConfig(
        headless=True,
        text_mode=True,  # Disable images for speed
        light_mode=True,  # Reduce background features
        extra_args=["--disable-extensions", "--no-sandbox"]
    )

    # Efficient crawl config
    config = CrawlerRunConfig(
        # Content filtering for speed
        excluded_tags=["script", "style", "nav", "footer"],
        exclude_external_links=True,
        exclude_all_images=True,  # Remove all images for max speed
        word_count_threshold=50,

        # Timing optimizations
        page_timeout=30000,  # Faster timeout
        delay_before_return_html=0.1,

        # Resource monitoring
        capture_network_requests=False,  # Disable unless needed
        capture_console_messages=False,

        # Cache for repeated URLs
        cache_mode=CacheMode.ENABLED
    )

    async with AsyncWebCrawler(config=browser_config) as crawler:
        urls = ["https://example.com/page1", "https://example.com/page2", "https://example.com/page3"]

        # Efficient batch processing
        batch_config = config.clone(
            stream=True,  # Stream results as they complete
            semaphore_count=3  # Control concurrency
        )

        async for result in await crawler.arun_many(urls, config=batch_config):
            if result.success:
                print(f"✅ {result.url}: {len(result.markdown)} chars")
            else:
                print(f"❌ {result.url}: {result.error_message}")
```

**📖 Learn more:** [Complete Parameter Reference](https://docs.crawl4ai.com/api/parameters/), [Content Filtering](https://docs.crawl4ai.com/core/markdown-generation/), [Session Management](https://docs.crawl4ai.com/advanced/session-management/), [Network Capture](https://docs.crawl4ai.com/advanced/network-console-capture/)

**📖 Learn more:** [Hooks & Authentication](https://docs.crawl4ai.com/advanced/hooks-auth/), [Session Management](https://docs.crawl4ai.com/advanced/session-management/), [Network Monitoring](https://docs.crawl4ai.com/advanced/network-console-capture/), [Page Interaction](https://docs.crawl4ai.com/core/page-interaction/), [File Downloads](https://docs.crawl4ai.com/advanced/file-downloading/)

---

## Configuration Objects - Diagrams & Workflows

Component ID: config_objects
Context Type: reasoning
Estimated tokens: 9,795

## Configuration Objects and System Architecture

Visual representations of Crawl4AI's configuration system, object relationships, and data flow patterns.

### Configuration Object Relationships

```mermaid
classDiagram
    class BrowserConfig {
        +browser_type: str
        +headless: bool
        +viewport_width: int
        +viewport_height: int
        +proxy: str
        +user_agent: str
        +cookies: list
        +headers: dict
        +clone() BrowserConfig
        +to_dict() dict
    }

    class CrawlerRunConfig {
        +cache_mode: CacheMode
        +extraction_strategy: ExtractionStrategy
        +markdown_generator: MarkdownGenerator
        +js_code: list
        +wait_for: str
        +screenshot: bool
        +session_id: str
        +clone() CrawlerRunConfig
        +dump() dict
    }

    class LLMConfig {
        +provider: str
        +api_token: str
        +base_url: str
        +temperature: float
        +max_tokens: int
        +clone() LLMConfig
        +to_dict() dict
    }

    class CrawlResult {
        +url: str
        +success: bool
        +html: str
        +cleaned_html: str
        +markdown: MarkdownGenerationResult
        +extracted_content: str
        +media: dict
        +links: dict
        +screenshot: str
        +pdf: bytes
    }

    class AsyncWebCrawler {
        +config: BrowserConfig
        +arun() CrawlResult
    }

    AsyncWebCrawler --> BrowserConfig : uses
    AsyncWebCrawler --> CrawlerRunConfig : accepts
    CrawlerRunConfig --> LLMConfig : contains
    AsyncWebCrawler --> CrawlResult : returns

    note for BrowserConfig "Controls browser\nenvironment and behavior"
    note for CrawlerRunConfig "Controls individual\ncrawl operations"
    note for LLMConfig "Configures LLM\nproviders and parameters"
    note for CrawlResult "Contains all crawl\noutputs and metadata"
```

### Configuration Decision Flow

```mermaid
flowchart TD
    A[Start Configuration] --> B{Use Case Type?}

    B -->|Simple Web Scraping| C[Basic Config Pattern]
    B -->|Data Extraction| D[Extraction Config Pattern]
    B -->|Stealth Crawling| E[Stealth Config Pattern]
    B -->|High Performance| F[Performance Config Pattern]

    C --> C1[BrowserConfig: headless=True]
    C --> C2[CrawlerRunConfig: basic options]
    C1 --> C3[No LLMConfig needed]
    C2 --> C3
    C3 --> G[Simple Crawling Ready]

    D --> D1[BrowserConfig: standard setup]
    D --> D2[CrawlerRunConfig: with extraction_strategy]
    D --> D3[LLMConfig: for LLM extraction]
    D1 --> D4[Advanced Extraction Ready]
    D2 --> D4
    D3 --> D4

    E --> E1[BrowserConfig: proxy + user_agent]
    E --> E2[CrawlerRunConfig: simulate_user=True]
    E1 --> E3[Stealth Crawling Ready]
    E2 --> E3

    F --> F1[BrowserConfig: lightweight]
    F --> F2[CrawlerRunConfig: caching + concurrent]
    F1 --> F3[High Performance Ready]
    F2 --> F3

    G --> H[Execute Crawl]
    D4 --> H
    E3 --> H
    F3 --> H

    H --> I[Get CrawlResult]

    style A fill:#e1f5fe
    style I fill:#c8e6c9
    style G fill:#fff3e0
    style D4 fill:#f3e5f5
    style E3 fill:#ffebee
    style F3 fill:#e8f5e8
```

### Configuration Lifecycle Sequence

```mermaid
sequenceDiagram
    participant User
    participant BrowserConfig as Browser Config
    participant CrawlerConfig as Crawler Config
    participant LLMConfig as LLM Config
    participant Crawler as AsyncWebCrawler
    participant Browser as Browser Instance
    participant Result as CrawlResult

    User->>BrowserConfig: Create with browser settings
    User->>CrawlerConfig: Create with crawl options
    User->>LLMConfig: Create with LLM provider

    User->>Crawler: Initialize with BrowserConfig
    Crawler->>Browser: Launch browser with config
    Browser-->>Crawler: Browser ready

    User->>Crawler: arun(url, CrawlerConfig)
    Crawler->>Crawler: Apply CrawlerConfig settings

    alt LLM Extraction Needed
        Crawler->>LLMConfig: Get LLM settings
        LLMConfig-->>Crawler: Provider configuration
    end

    Crawler->>Browser: Navigate with settings
    Browser->>Browser: Apply page interactions
    Browser->>Browser: Execute JavaScript if specified
    Browser->>Browser: Wait for conditions

    Browser-->>Crawler: Page content ready
    Crawler->>Crawler: Process content per config
    Crawler->>Result: Create CrawlResult

    Result-->>User: Return complete result

    Note over User,Result: Configuration objects control every aspect
```

### BrowserConfig Parameter Flow

```mermaid
graph TB
    subgraph "BrowserConfig Parameters"
        A[browser_type] --> A1[chromium/firefox/webkit]
        B[headless] --> B1[true: invisible / false: visible]
        C[viewport] --> C1[width x height dimensions]
        D[proxy] --> D1[proxy server configuration]
        E[user_agent] --> E1[browser identification string]
        F[cookies] --> F1[session authentication]
        G[headers] --> G1[HTTP request headers]
        H[extra_args] --> H1[browser command line flags]
    end

    subgraph "Browser Instance"
        I[Playwright Browser]
        J[Browser Context]
        K[Page Instance]
    end

    A1 --> I
    B1 --> I
    C1 --> J
    D1 --> J
    E1 --> J
    F1 --> J
    G1 --> J
    H1 --> I

    I --> J
    J --> K

    style I fill:#e3f2fd
    style J fill:#f3e5f5
    style K fill:#e8f5e8
```

### CrawlerRunConfig Category Breakdown

```mermaid
mindmap
  root((CrawlerRunConfig))
    Content Processing
      word_count_threshold
      css_selector
      target_elements
      excluded_tags
      markdown_generator
      extraction_strategy
    Page Navigation
      wait_until
      page_timeout
      wait_for
      wait_for_images
      delay_before_return_html
    Page Interaction
      js_code
      scan_full_page
      simulate_user
      magic
      remove_overlay_elements
    Caching Session
      cache_mode
      session_id
      shared_data
    Media Output
      screenshot
      pdf
      capture_mhtml
      image_score_threshold
    Link Filtering
      exclude_external_links
      exclude_domains
      exclude_social_media_links
```

### LLM Provider Selection Flow

```mermaid
flowchart TD
    A[Need LLM Processing?] --> B{Provider Type?}

    B -->|Cloud API| C{Which Service?}
    B -->|Local Model| D[Local Setup]
    B -->|Custom Endpoint| E[Custom Config]

    C -->|OpenAI| C1[OpenAI GPT Models]
    C -->|Anthropic| C2[Claude Models]
    C -->|Google| C3[Gemini Models]
    C -->|Groq| C4[Fast Inference]

    D --> D1[Ollama Setup]
    E --> E1[Custom base_url]

    C1 --> F1[LLMConfig with OpenAI settings]
    C2 --> F2[LLMConfig with Anthropic settings]
    C3 --> F3[LLMConfig with Google settings]
    C4 --> F4[LLMConfig with Groq settings]
    D1 --> F5[LLMConfig with Ollama settings]
    E1 --> F6[LLMConfig with custom settings]

    F1 --> G[Use in Extraction Strategy]
    F2 --> G
    F3 --> G
    F4 --> G
    F5 --> G
    F6 --> G

    style A fill:#e1f5fe
    style G fill:#c8e6c9
```

### CrawlResult Structure and Data Flow

```mermaid
graph TB
    subgraph "CrawlResult Output"
        A[Basic Info]
        B[HTML Content]
        C[Markdown Output]
        D[Extracted Data]
        E[Media Files]
        F[Metadata]
    end

    subgraph "Basic Info Details"
        A --> A1[url: final URL]
        A --> A2[success: boolean]
        A --> A3[status_code: HTTP status]
        A --> A4[error_message: if failed]
    end

    subgraph "HTML Content Types"
        B --> B1[html: raw HTML]
        B --> B2[cleaned_html: processed]
        B --> B3[fit_html: filtered content]
    end

    subgraph "Markdown Variants"
        C --> C1[raw_markdown: basic conversion]
        C --> C2[markdown_with_citations: with refs]
        C --> C3[fit_markdown: filtered content]
        C --> C4[references_markdown: citation list]
    end

    subgraph "Extracted Content"
        D --> D1[extracted_content: JSON string]
        D --> D2[From CSS extraction]
        D --> D3[From LLM extraction]
        D --> D4[From XPath extraction]
    end

    subgraph "Media and Links"
        E --> E1[images: list with scores]
        E --> E2[videos: media content]
        E --> E3[internal_links: same domain]
        E --> E4[external_links: other domains]
    end

    subgraph "Generated Files"
        F --> F1[screenshot: base64 PNG]
        F --> F2[pdf: binary PDF data]
        F --> F3[mhtml: archive format]
        F --> F4[ssl_certificate: cert info]
    end

    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#ffebee
    style F fill:#f1f8e9
```

### Configuration Pattern State Machine

```mermaid
stateDiagram-v2
    [*] --> ConfigCreation

    ConfigCreation --> BasicConfig: Simple use case
    ConfigCreation --> AdvancedConfig: Complex requirements
    ConfigCreation --> TemplateConfig: Use predefined pattern

    BasicConfig --> Validation: Check parameters
    AdvancedConfig --> Validation: Check parameters
    TemplateConfig --> Validation: Check parameters

    Validation --> Invalid: Missing required fields
    Validation --> Valid: All parameters correct

    Invalid --> ConfigCreation: Fix and retry

    Valid --> InUse: Passed to crawler
    InUse --> Cloning: Need variation
    InUse --> Serialization: Save configuration
    InUse --> Complete: Crawl finished

    Cloning --> Modified: clone() with updates
    Modified --> Valid: Validate changes

    Serialization --> Stored: dump() to dict
    Stored --> Restoration: load() from dict
    Restoration --> Valid: Recreate config object

    Complete --> [*]

    note right of BasicConfig : Minimal required settings
    note right of AdvancedConfig : Full feature configuration
    note right of TemplateConfig : Pre-built patterns
```

### Configuration Integration Architecture

```mermaid
graph TB
    subgraph "User Layer"
        U1[Configuration Creation]
        U2[Parameter Selection]
        U3[Pattern Application]
    end

    subgraph "Configuration Layer"
        C1[BrowserConfig]
        C2[CrawlerRunConfig]
        C3[LLMConfig]
        C4[Config Validation]
        C5[Config Cloning]
    end

    subgraph "Crawler Engine"
        E1[Browser Management]
        E2[Page Navigation]
        E3[Content Processing]
        E4[Extraction Pipeline]
        E5[Result Generation]
    end

    subgraph "Output Layer"
        O1[CrawlResult Assembly]
        O2[Data Formatting]
        O3[File Generation]
        O4[Metadata Collection]
    end

    U1 --> C1
    U2 --> C2
    U3 --> C3

    C1 --> C4
    C2 --> C4
    C3 --> C4

    C4 --> E1
    C2 --> E2
    C2 --> E3
    C3 --> E4

    E1 --> E2
    E2 --> E3
    E3 --> E4
    E4 --> E5

    E5 --> O1
    O1 --> O2
    O2 --> O3
    O3 --> O4

    C5 -.-> C1
    C5 -.-> C2
    C5 -.-> C3

    style U1 fill:#e1f5fe
    style C4 fill:#fff3e0
    style E4 fill:#f3e5f5
    style O4 fill:#c8e6c9
```

### Configuration Best Practices Flow

```mermaid
flowchart TD
    A[Configuration Planning] --> B{Performance Priority?}

    B -->|Speed| C[Fast Config Pattern]
    B -->|Quality| D[Comprehensive Config Pattern]
    B -->|Stealth| E[Stealth Config Pattern]
    B -->|Balanced| F[Standard Config Pattern]

    C --> C1[Enable caching]
    C --> C2[Disable heavy features]
    C --> C3[Use text_mode]
    C1 --> G[Apply Configuration]
    C2 --> G
    C3 --> G

    D --> D1[Enable all processing]
    D --> D2[Use content filters]
    D --> D3[Capture everything]
    D1 --> G
    D2 --> G
    D3 --> G

    E --> E1[Rotate user agents]
    E --> E2[Use proxies]
    E --> E3[Simulate human behavior]
    E1 --> G
    E2 --> G
    E3 --> G

    F --> F1[Balanced timeouts]
    F --> F2[Selective processing]
    F --> F3[Smart caching]
    F1 --> G
    F2 --> G
    F3 --> G

    G --> H[Test Configuration]
    H --> I{Results Satisfactory?}

    I -->|Yes| J[Production Ready]
    I -->|No| K[Adjust Parameters]

    K --> L[Clone and Modify]
    L --> H

    J --> M[Deploy with Confidence]

    style A fill:#e1f5fe
    style J fill:#c8e6c9
    style M fill:#e8f5e8
```

## Advanced Configuration Workflows and Patterns

Visual representations of advanced Crawl4AI configuration strategies, proxy management, session handling, and identity-based crawling patterns.

### User Agent and Anti-Detection Strategy Flow

```mermaid
flowchart TD
    A[Start Configuration] --> B{Detection Avoidance Needed?}

    B -->|No| C[Standard User Agent]
    B -->|Yes| D[Anti-Detection Strategy]

    C --> C1[Static user_agent string]
    C1 --> Z[Basic Configuration]

    D --> E{User Agent Strategy}
    E -->|Random| F[user_agent_mode: random]
    E -->|Static Custom| G[Custom user_agent string]
    E -->|Platform Specific| H[Generator Config]

    F --> I[Configure Generator]
    H --> I
    I --> I1[Platform: windows/macos/linux]
    I1 --> I2[Browser: chrome/firefox/safari]
    I2 --> I3[Device: desktop/mobile/tablet]

    G --> J[Behavioral Simulation]
    I3 --> J

    J --> K{Enable Simulation?}
    K -->|Yes| L[simulate_user: True]
    K -->|No| M[Standard Behavior]

    L --> N[override_navigator: True]
    N --> O[Configure Delays]
    O --> O1[mean_delay: 1.5]
    O1 --> O2[max_range: 2.0]
    O2 --> P[Magic Mode]

    M --> P
    P --> Q{Auto-Handle Patterns?}
    Q -->|Yes| R[magic: True]
    Q -->|No| S[Manual Handling]

    R --> T[Complete Anti-Detection Setup]
    S --> T
    Z --> T

    style D fill:#ffeb3b
    style T fill:#c8e6c9
    style L fill:#ff9800
    style R fill:#9c27b0
```

### Proxy Configuration and Rotation Architecture

```mermaid
graph TB
    subgraph "Proxy Configuration Types"
        A[Single Proxy] --> A1[ProxyConfig object]
        B[Proxy String] --> B1[from_string method]
        C[Environment Proxies] --> C1[from_env method]
        D[Multiple Proxies] --> D1[ProxyRotationStrategy]
    end

    subgraph "ProxyConfig Structure"
        A1 --> E[server: URL]
        A1 --> F[username: auth]
        A1 --> G[password: auth]
        A1 --> H[ip: extracted]
    end

    subgraph "Rotation Strategies"
        D1 --> I[round_robin]
        D1 --> J[random]
        D1 --> K[least_used]
        D1 --> L[failure_aware]
    end

    subgraph "Configuration Flow"
        M[CrawlerRunConfig] --> N[proxy_config]
        M --> O[proxy_rotation_strategy]
        N --> P[Single Proxy Usage]
        O --> Q[Multi-Proxy Rotation]
    end

    subgraph "Runtime Behavior"
        P --> R[All requests use same proxy]
        Q --> S[Requests rotate through proxies]
        S --> T[Health monitoring]
        T --> U[Automatic failover]
    end

    style A1 fill:#e3f2fd
    style D1 fill:#f3e5f5
    style M fill:#e8f5e8
    style T fill:#fff3e0
```

### Content Selection Strategy Comparison

```mermaid
sequenceDiagram
    participant Browser
    participant HTML as Raw HTML
    participant CSS as css_selector
    participant Target as target_elements
    participant Processor as Content Processor
    participant Output

    Note over Browser,Output: css_selector Strategy
    Browser->>HTML: Load complete page
    HTML->>CSS: Apply css_selector
    CSS->>CSS: Extract matching elements only
    CSS->>Processor: Process subset HTML
    Processor->>Output: Markdown + Extraction from subset

    Note over Browser,Output: target_elements Strategy
    Browser->>HTML: Load complete page
    HTML->>Processor: Process entire page
    Processor->>Target: Focus on target_elements
    Target->>Target: Extract from specified elements
    Processor->>Output: Full page links/media + targeted content

    Note over CSS,Target: Key Difference
    Note over CSS: Affects entire processing pipeline
    Note over Target: Affects only content extraction
```

### Advanced wait_for Conditions Decision Tree

```mermaid
flowchart TD
    A[Configure wait_for] --> B{Condition Type?}

    B -->|CSS Element| C[CSS Selector Wait]
    B -->|JavaScript Condition| D[JS Expression Wait]
    B -->|Complex Logic| E[Custom JS Function]
    B -->|No Wait| F[Default domcontentloaded]

    C --> C1["wait_for: 'css:.element'"]
    C1 --> C2[Element appears in DOM]
    C2 --> G[Continue Processing]

    D --> D1["wait_for: 'js:() => condition'"]
    D1 --> D2[JavaScript returns true]
    D2 --> G

    E --> E1[Complex JS Function]
    E1 --> E2{Multiple Conditions}
    E2 -->|AND Logic| E3[All conditions true]
    E2 -->|OR Logic| E4[Any condition true]
    E2 -->|Custom Logic| E5[User-defined logic]

    E3 --> G
    E4 --> G
    E5 --> G

    F --> G

    G --> H{Timeout Reached?}
    H -->|No| I[Page Ready]
    H -->|Yes| J[Timeout Error]

    I --> K[Begin Content Extraction]
    J --> L[Handle Error/Retry]

    style C1 fill:#e8f5e8
    style D1 fill:#fff3e0
    style E1 fill:#ffeb3b
    style I fill:#c8e6c9
    style J fill:#ffcdd2
```

### Session Management Lifecycle

```mermaid
stateDiagram-v2
    [*] --> SessionCreate

    SessionCreate --> SessionActive: session_id provided
    SessionCreate --> OneTime: no session_id

    SessionActive --> BrowserLaunch: First arun() call
    BrowserLaunch --> PageLoad: Navigate to URL
    PageLoad --> JSExecution: Execute js_code
    JSExecution --> ContentExtract: Extract content
    ContentExtract --> SessionHold: Keep session alive

    SessionHold --> ReuseSession: Subsequent arun() calls
    ReuseSession --> JSOnlyMode: js_only=True
    ReuseSession --> NewNavigation: js_only=False

    JSOnlyMode --> JSExecution: Execute JS in existing page
    NewNavigation --> PageLoad: Navigate to new URL

    SessionHold --> SessionKill: kill_session() called
    SessionHold --> SessionTimeout: Timeout reached
    SessionHold --> SessionError: Error occurred

    SessionKill --> SessionCleanup
    SessionTimeout --> SessionCleanup
    SessionError --> SessionCleanup
    SessionCleanup --> [*]

    OneTime --> BrowserLaunch
    ContentExtract --> OneTimeCleanup: No session_id
    OneTimeCleanup --> [*]

    note right of SessionActive : Persistent browser context
    note right of JSOnlyMode : Reuse existing page
    note right of OneTime : Temporary browser instance
```

### Identity-Based Crawling Configuration Matrix

```mermaid
graph TD
    subgraph "Geographic Identity"
        A[Geolocation] --> A1[latitude/longitude]
        A2[Timezone] --> A3[timezone_id]
        A4[Locale] --> A5[language/region]
    end

    subgraph "Browser Identity"
        B[User Agent] --> B1[Platform fingerprint]
        B2[Navigator Properties] --> B3[override_navigator]
        B4[Headers] --> B5[Accept-Language]
    end

    subgraph "Behavioral Identity"
        C[Mouse Simulation] --> C1[simulate_user]
        C2[Timing Patterns] --> C3[mean_delay/max_range]
        C4[Interaction Patterns] --> C5[Human-like behavior]
    end

    subgraph "Configuration Integration"
        D[CrawlerRunConfig] --> A
        D --> B
        D --> C

        D --> E[Complete Identity Profile]

        E --> F[Geographic Consistency]
        E --> G[Browser Consistency]
        E --> H[Behavioral Consistency]
    end

    F --> I[Paris, France Example]
    I --> I1[locale: fr-FR]
    I --> I2[timezone: Europe/Paris]
    I --> I3[geolocation: 48.8566, 2.3522]

    G --> J[Windows Chrome Example]
    J --> J1[platform: windows]
    J --> J2[browser: chrome]
    J --> J3[user_agent: matching pattern]

    H --> K[Human Simulation]
    K --> K1[Random delays]
    K --> K2[Mouse movements]
    K --> K3[Navigation patterns]

    style E fill:#ff9800
    style I fill:#e3f2fd
    style J fill:#f3e5f5
    style K fill:#e8f5e8
```

### Multi-Step Crawling Sequence Flow

```mermaid
sequenceDiagram
    participant User
    participant Crawler
    participant Session as Browser Session
    participant Page1 as Login Page
    participant Page2 as Dashboard
    participant Page3 as Data Pages

    User->>Crawler: Step 1 - Login
    Crawler->>Session: Create session_id="user_session"
    Session->>Page1: Navigate to login
    Page1->>Page1: Execute login JS
    Page1->>Page1: Wait for dashboard redirect
    Page1-->>Crawler: Login complete

    User->>Crawler: Step 2 - Navigate dashboard
    Note over Crawler,Session: Reuse existing session
    Crawler->>Session: js_only=True (no page reload)
    Session->>Page2: Execute navigation JS
    Page2->>Page2: Wait for data table
    Page2-->>Crawler: Dashboard ready

    User->>Crawler: Step 3 - Extract data pages
    loop For each page 1-5
        Crawler->>Session: js_only=True
        Session->>Page3: Click page button
        Page3->>Page3: Wait for page active
        Page3->>Page3: Extract content
        Page3-->>Crawler: Page data
    end

    User->>Crawler: Cleanup
    Crawler->>Session: kill_session()
    Session-->>Crawler: Session destroyed
```

### Configuration Import and Usage Patterns

```mermaid
graph LR
    subgraph "Main Package Imports"
        A[crawl4ai] --> A1[AsyncWebCrawler]
        A --> A2[BrowserConfig]
        A --> A3[CrawlerRunConfig]
        A --> A4[LLMConfig]
        A --> A5[CacheMode]
        A --> A6[ProxyConfig]
        A --> A7[GeolocationConfig]
    end

    subgraph "Strategy Imports"
        A --> B1[JsonCssExtractionStrategy]
        A --> B2[LLMExtractionStrategy]
        A --> B3[DefaultMarkdownGenerator]
        A --> B4[PruningContentFilter]
        A --> B5[RegexChunking]
    end

    subgraph "Configuration Assembly"
        C[Configuration Builder] --> A2
        C --> A3
        C --> A4

        A2 --> D[Browser Environment]
        A3 --> E[Crawl Behavior]
        A4 --> F[LLM Integration]

        E --> B1
        E --> B2
        E --> B3
        E --> B4
        E --> B5
    end

    subgraph "Runtime Flow"
        G[Crawler Instance] --> D
        G --> H[Execute Crawl]
        H --> E
        H --> F
        H --> I[CrawlResult]
    end

    style A fill:#e3f2fd
    style C fill:#fff3e0
    style G fill:#e8f5e8
    style I fill:#c8e6c9
```

### Advanced Configuration Decision Matrix

```mermaid
flowchart TD
    A[Advanced Configuration Needed] --> B{Primary Use Case?}

    B -->|Bot Detection Avoidance| C[Anti-Detection Setup]
    B -->|Geographic Simulation| D[Identity-Based Config]
    B -->|Multi-Step Workflows| E[Session Management]
    B -->|Network Reliability| F[Proxy Configuration]
    B -->|Content Precision| G[Selector Strategy]

    C --> C1[Random User Agents]
    C --> C2[Behavioral Simulation]
    C --> C3[Navigator Override]
    C --> C4[Magic Mode]

    D --> D1[Geolocation Setup]
    D --> D2[Locale Configuration]
    D --> D3[Timezone Setting]
    D --> D4[Browser Fingerprinting]

    E --> E1[Session ID Management]
    E --> E2[JS-Only Navigation]
    E --> E3[Shared Data Context]
    E --> E4[Session Cleanup]

    F --> F1[Single Proxy]
    F --> F2[Proxy Rotation]
    F --> F3[Failover Strategy]
    F --> F4[Health Monitoring]

    G --> G1[css_selector for Subset]
    G --> G2[target_elements for Focus]
    G --> G3[excluded_selector for Removal]
    G --> G4[Hierarchical Selection]

    C1 --> H[Production Configuration]
    C2 --> H
    C3 --> H
    C4 --> H
    D1 --> H
    D2 --> H
    D3 --> H
    D4 --> H
    E1 --> H
    E2 --> H
    E3 --> H
    E4 --> H
    F1 --> H
    F2 --> H
    F3 --> H
    F4 --> H
    G1 --> H
    G2 --> H
    G3 --> H
    G4 --> H

    style H fill:#c8e6c9
    style C fill:#ff9800
    style D fill:#9c27b0
    style E fill:#2196f3
    style F fill:#4caf50
    style G fill:#ff5722
```

## Advanced Features Workflows and Architecture

Visual representations of advanced crawling capabilities, session management, hooks system, and performance optimization strategies.

### File Download Workflow

```mermaid
sequenceDiagram
    participant User
    participant Crawler
    participant Browser
    participant FileSystem
    participant Page

    User->>Crawler: Configure downloads_path
    Crawler->>Browser: Create context with download handling
    Browser-->>Crawler: Context ready

    Crawler->>Page: Navigate to target URL
    Page-->>Crawler: Page loaded

    Crawler->>Page: Execute download JavaScript
    Page->>Page: Find download links (.pdf, .zip, etc.)

    loop For each download link
        Page->>Browser: Click download link
        Browser->>FileSystem: Save file to downloads_path
        FileSystem-->>Browser: File saved
        Browser-->>Page: Download complete
    end

    Page-->>Crawler: All downloads triggered
    Crawler->>FileSystem: Check downloaded files
    FileSystem-->>Crawler: List of file paths
    Crawler-->>User: CrawlResult with downloaded_files[]

    Note over User,FileSystem: Files available in downloads_path
```

### Hooks Execution Flow

```mermaid
flowchart TD
    A[Start Crawl] --> B[on_browser_created Hook]
    B --> C[Browser Instance Created]
    C --> D[on_page_context_created Hook]
    D --> E[Page & Context Setup]
    E --> F[before_goto Hook]
    F --> G[Navigate to URL]
    G --> H[after_goto Hook]
    H --> I[Page Loaded]
    I --> J[before_retrieve_html Hook]
    J --> K[Extract HTML Content]
    K --> L[Return CrawlResult]

    subgraph "Hook Capabilities"
        B1[Route Filtering]
        B2[Authentication]
        B3[Custom Headers]
        B4[Viewport Setup]
        B5[Content Manipulation]
    end

    D --> B1
    F --> B2
    F --> B3
    D --> B4
    J --> B5

    style A fill:#e1f5fe
    style L fill:#c8e6c9
    style B fill:#fff3e0
    style D fill:#f3e5f5
    style F fill:#e8f5e8
    style H fill:#fce4ec
    style J fill:#fff9c4
```

### Session Management State Machine

```mermaid
stateDiagram-v2
    [*] --> SessionCreated: session_id provided

    SessionCreated --> PageLoaded: Initial arun()
    PageLoaded --> JavaScriptExecution: js_code executed
    JavaScriptExecution --> ContentUpdated: DOM modified
    ContentUpdated --> NextOperation: js_only=True

    NextOperation --> JavaScriptExecution: More interactions
    NextOperation --> SessionMaintained: Keep session alive
    NextOperation --> SessionClosed: kill_session()

    SessionMaintained --> PageLoaded: Navigate to new URL
    SessionMaintained --> JavaScriptExecution: Continue interactions

    SessionClosed --> [*]: Session terminated

    note right of SessionCreated
        Browser tab created
        Context preserved
    end note

    note right of ContentUpdated
        State maintained
        Cookies preserved
        Local storage intact
    end note

    note right of SessionClosed
        Clean up resources
        Release browser tab
    end note
```

### Lazy Loading & Dynamic Content Strategy

```mermaid
flowchart TD
    A[Page Load] --> B{Content Type?}

    B -->|Static Content| C[Standard Extraction]
    B -->|Lazy Loaded| D[Enable scan_full_page]
    B -->|Infinite Scroll| E[Custom Scroll Strategy]
    B -->|Load More Button| F[JavaScript Interaction]

    D --> D1[Automatic Scrolling]
    D1 --> D2[Wait for Images]
    D2 --> D3[Content Stabilization]

    E --> E1[Detect Scroll Triggers]
    E1 --> E2[Progressive Loading]
    E2 --> E3[Monitor Content Changes]

    F --> F1[Find Load More Button]
    F1 --> F2[Click and Wait]
    F2 --> F3{More Content?}
    F3 -->|Yes| F1
    F3 -->|No| G[Complete Extraction]

    D3 --> G
    E3 --> G
    C --> G

    G --> H[Return Enhanced Content]

    subgraph "Optimization Techniques"
        I[exclude_external_images]
        J[image_score_threshold]
        K[wait_for selectors]
        L[scroll_delay tuning]
    end

    D --> I
    E --> J
    F --> K
    D1 --> L

    style A fill:#e1f5fe
    style H fill:#c8e6c9
    style D fill:#fff3e0
    style E fill:#f3e5f5
    style F fill:#e8f5e8
```

### Network & Console Monitoring Architecture

```mermaid
graph TB
    subgraph "Browser Context"
        A[Web Page] --> B[Network Requests]
        A --> C[Console Messages]
        A --> D[Resource Loading]
    end

    subgraph "Monitoring Layer"
        B --> E[Request Interceptor]
        C --> F[Console Listener]
        D --> G[Resource Monitor]

        E --> H[Request Events]
        E --> I[Response Events]
        E --> J[Failure Events]

        F --> K[Log Messages]
        F --> L[Error Messages]
        F --> M[Warning Messages]
    end

    subgraph "Data Collection"
        H --> N[Request Details]
        I --> O[Response Analysis]
        J --> P[Failure Tracking]

        K --> Q[Debug Information]
        L --> R[Error Analysis]
        M --> S[Performance Insights]
    end

    subgraph "Output Aggregation"
        N --> T[network_requests Array]
        O --> T
        P --> T

        Q --> U[console_messages Array]
        R --> U
        S --> U
    end

    T --> V[CrawlResult]
    U --> V

    style V fill:#c8e6c9
    style E fill:#fff3e0
    style F fill:#f3e5f5
    style T fill:#e8f5e8
    style U fill:#fce4ec
```

### Multi-Step Workflow Sequence

```mermaid
sequenceDiagram
    participant User
    participant Crawler
    participant Session
    participant Page
    participant Server

    User->>Crawler: Step 1 - Initial load
    Crawler->>Session: Create session_id
    Session->>Page: New browser tab
    Page->>Server: GET /step1
    Server-->>Page: Page content
    Page-->>Crawler: Content ready
    Crawler-->>User: Result 1

    User->>Crawler: Step 2 - Navigate (js_only=true)
    Crawler->>Session: Reuse existing session
    Session->>Page: Execute JavaScript
    Page->>Page: Click next button
    Page->>Server: Navigate to /step2
    Server-->>Page: New content
    Page-->>Crawler: Updated content
    Crawler-->>User: Result 2

    User->>Crawler: Step 3 - Form submission
    Crawler->>Session: Continue session
    Session->>Page: Execute form JS
    Page->>Page: Fill form fields
    Page->>Server: POST form data
    Server-->>Page: Results page
    Page-->>Crawler: Final content
    Crawler-->>User: Result 3

    User->>Crawler: Cleanup
    Crawler->>Session: kill_session()
    Session->>Page: Close tab
    Session-->>Crawler: Session terminated

    Note over User,Server: State preserved across steps
    Note over Session: Cookies, localStorage maintained
```

### SSL Certificate Analysis Flow

```mermaid
flowchart LR
    A[Enable SSL Fetch] --> B[HTTPS Connection]
    B --> C[Certificate Retrieval]
    C --> D[Certificate Analysis]

    D --> E[Basic Info]
    D --> F[Validity Check]
    D --> G[Chain Verification]
    D --> H[Security Assessment]

    E --> E1[Issuer Details]
    E --> E2[Subject Information]
    E --> E3[Serial Number]

    F --> F1[Not Before Date]
    F --> F2[Not After Date]
    F --> F3[Expiration Warning]

    G --> G1[Root CA]
    G --> G2[Intermediate Certs]
    G --> G3[Trust Path]

    H --> H1[Key Length]
    H --> H2[Signature Algorithm]
    H --> H3[Vulnerabilities]

    subgraph "Export Formats"
        I[JSON Format]
        J[PEM Format]
        K[DER Format]
    end

    E1 --> I
    F1 --> I
    G1 --> I
    H1 --> I

    I --> J
    J --> K

    style A fill:#e1f5fe
    style D fill:#fff3e0
    style I fill:#e8f5e8
    style J fill:#f3e5f5
    style K fill:#fce4ec
```

### Performance Optimization Decision Tree

```mermaid
flowchart TD
    A[Performance Optimization] --> B{Primary Goal?}

    B -->|Speed| C[Fast Crawling Mode]
    B -->|Resource Usage| D[Memory Optimization]
    B -->|Scale| E[Batch Processing]
    B -->|Quality| F[Comprehensive Extraction]

    C --> C1[text_mode=True]
    C --> C2[exclude_all_images=True]
    C --> C3[excluded_tags=['script','style']]
    C --> C4[page_timeout=30000]

    D --> D1[light_mode=True]
    D --> D2[headless=True]
    D --> D3[semaphore_count=3]
    D --> D4[disable monitoring]

    E --> E1[stream=True]
    E --> E2[cache_mode=ENABLED]
    E --> E3[arun_many()]
    E --> E4[concurrent batches]

    F --> F1[wait_for_images=True]
    F --> F2[process_iframes=True]
    F --> F3[capture_network=True]
    F --> F4[screenshot=True]

    subgraph "Trade-offs"
        G[Speed vs Quality]
        H[Memory vs Features]
        I[Scale vs Detail]
    end

    C --> G
    D --> H
    E --> I

    subgraph "Monitoring Metrics"
        J[Response Time]
        K[Memory Usage]
        L[Success Rate]
        M[Content Quality]
    end

    C1 --> J
    D1 --> K
    E1 --> L
    F1 --> M

    style A fill:#e1f5fe
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#f3e5f5
    style F fill:#fce4ec
```

### Advanced Page Interaction Matrix

```mermaid
graph LR
    subgraph "Interaction Types"
        A[Form Filling]
        B[Dynamic Loading]
        C[Modal Handling]
        D[Scroll Interactions]
        E[Button Clicks]
    end

    subgraph "Detection Methods"
        F[CSS Selectors]
        G[JavaScript Conditions]
        H[Element Visibility]
        I[Content Changes]
        J[Network Activity]
    end

    subgraph "Automation Features"
        K[simulate_user=True]
        L[magic=True]
        M[remove_overlay_elements=True]
        N[override_navigator=True]
        O[scan_full_page=True]
    end

    subgraph "Wait Strategies"
        P[wait_for CSS]
        Q[wait_for JS]
        R[wait_for_images]
        S[delay_before_return]
        T[custom timeouts]
    end

    A --> F
    A --> K
    A --> P

    B --> G
    B --> O
    B --> Q

    C --> H
    C --> L
    C --> M

    D --> I
    D --> O
    D --> S

    E --> F
    E --> K
    E --> T

    style A fill:#e8f5e8
    style B fill:#fff3e0
    style C fill:#f3e5f5
    style D fill:#fce4ec
    style E fill:#e1f5fe
```

### Input Source Processing Flow

```mermaid
flowchart TD
    A[Input Source] --> B{Input Type?}

    B -->|URL| C[Web Request]
    B -->|file://| D[Local File]
    B -->|raw:| E[Raw HTML]

    C --> C1[HTTP/HTTPS Request]
    C1 --> C2[Browser Navigation]
    C2 --> C3[Page Rendering]
    C3 --> F[Content Processing]

    D --> D1[File System Access]
    D1 --> D2[Read HTML File]
    D2 --> D3[Parse Content]
    D3 --> F

    E --> E1[Parse Raw HTML]
    E1 --> E2[Create Virtual Page]
    E2 --> E3[Direct Processing]
    E3 --> F

    F --> G[Common Processing Pipeline]
    G --> H[Markdown Generation]
    G --> I[Link Extraction]
    G --> J[Media Processing]
    G --> K[Data Extraction]

    H --> L[CrawlResult]
    I --> L
    J --> L
    K --> L

    subgraph "Processing Features"
        M[Same extraction strategies]
        N[Same filtering options]
        O[Same output formats]
        P[Consistent results]
    end

    F --> M
    F --> N
    F --> O
    F --> P

    style A fill:#e1f5fe
    style L fill:#c8e6c9
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#f3e5f5
```

**📖 Learn more:** [Advanced Features Guide](https://docs.crawl4ai.com/advanced/advanced-features/), [Session Management](https://docs.crawl4ai.com/advanced/session-management/), [Hooks System](https://docs.crawl4ai.com/advanced/hooks-auth/), [Performance Optimization](https://docs.crawl4ai.com/advanced/performance/)

**📖 Learn more:** [Identity-Based Crawling](https://docs.crawl4ai.com/advanced/identity-based-crawling/), [Session Management](https://docs.crawl4ai.com/advanced/session-management/), [Proxy & Security](https://docs.crawl4ai.com/advanced/proxy-security/), [Content Selection](https://docs.crawl4ai.com/core/content-selection/)

**📖 Learn more:** [Configuration Reference](https://docs.crawl4ai.com/api/parameters/), [Best Practices](https://docs.crawl4ai.com/core/browser-crawler-config/), [Advanced Configuration](https://docs.crawl4ai.com/advanced/advanced-features/)

---

## Deep Crawling - Full Content

Component ID: deep_crawling
Context Type: memory
Estimated tokens: 2,208

## Deep Crawling

Multi-level website exploration with intelligent filtering, scoring, and prioritization strategies.

### Basic Deep Crawl Setup

```python
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig
from crawl4ai.deep_crawling import BFSDeepCrawlStrategy
from crawl4ai.content_scraping_strategy import LXMLWebScrapingStrategy

# Basic breadth-first deep crawling
async def basic_deep_crawl():
    config = CrawlerRunConfig(
        deep_crawl_strategy=BFSDeepCrawlStrategy(
            max_depth=2,               # Initial page + 2 levels
            include_external=False     # Stay within same domain
        ),
        scraping_strategy=LXMLWebScrapingStrategy(),
        verbose=True
    )

    async with AsyncWebCrawler() as crawler:
        results = await crawler.arun("https://docs.crawl4ai.com", config=config)

        # Group results by depth
        pages_by_depth = {}
        for result in results:
            depth = result.metadata.get("depth", 0)
            if depth not in pages_by_depth:
                pages_by_depth[depth] = []
            pages_by_depth[depth].append(result.url)

        print(f"Crawled {len(results)} pages total")
        for depth, urls in sorted(pages_by_depth.items()):
            print(f"Depth {depth}: {len(urls)} pages")
```

### Deep Crawl Strategies

```python
from crawl4ai.deep_crawling import BFSDeepCrawlStrategy, DFSDeepCrawlStrategy, BestFirstCrawlingStrategy
from crawl4ai.deep_crawling.scorers import KeywordRelevanceScorer

# Breadth-First Search - explores all links at one depth before going deeper
bfs_strategy = BFSDeepCrawlStrategy(
    max_depth=2,
    include_external=False,
    max_pages=50,              # Limit total pages
    score_threshold=0.3        # Minimum score for URLs
)

# Depth-First Search - explores as deep as possible before backtracking
dfs_strategy = DFSDeepCrawlStrategy(
    max_depth=2,
    include_external=False,
    max_pages=30,
    score_threshold=0.5
)

# Best-First - prioritizes highest scoring pages (recommended)
keyword_scorer = KeywordRelevanceScorer(
    keywords=["crawl", "example", "async", "configuration"],
    weight=0.7
)

best_first_strategy = BestFirstCrawlingStrategy(
    max_depth=2,
    include_external=False,
    url_scorer=keyword_scorer,
    max_pages=25               # No score_threshold needed - naturally prioritizes
)

# Usage
config = CrawlerRunConfig(
    deep_crawl_strategy=best_first_strategy,  # Choose your strategy
    scraping_strategy=LXMLWebScrapingStrategy()
)
```

### Streaming vs Batch Processing

```python
# Batch mode - wait for all results
async def batch_deep_crawl():
    config = CrawlerRunConfig(
        deep_crawl_strategy=BFSDeepCrawlStrategy(max_depth=1),
        stream=False  # Default - collect all results first
    )

    async with AsyncWebCrawler() as crawler:
        results = await crawler.arun("https://example.com", config=config)

        # Process all results at once
        for result in results:
            print(f"Batch processed: {result.url}")

# Streaming mode - process results as they arrive
async def streaming_deep_crawl():
    config = CrawlerRunConfig(
        deep_crawl_strategy=BFSDeepCrawlStrategy(max_depth=1),
        stream=True  # Process results immediately
    )

    async with AsyncWebCrawler() as crawler:
        async for result in await crawler.arun("https://example.com", config=config):
            depth = result.metadata.get("depth", 0)
            print(f"Stream processed depth {depth}: {result.url}")
```

### Filtering with Filter Chains

```python
from crawl4ai.deep_crawling.filters import (
    FilterChain,
    URLPatternFilter,
    DomainFilter,
    ContentTypeFilter,
    SEOFilter,
    ContentRelevanceFilter
)

# Single URL pattern filter
url_filter = URLPatternFilter(patterns=["*core*", "*guide*"])

config = CrawlerRunConfig(
    deep_crawl_strategy=BFSDeepCrawlStrategy(
        max_depth=1,
        filter_chain=FilterChain([url_filter])
    )
)

# Multiple filters in chain
advanced_filter_chain = FilterChain([
    # Domain filtering
    DomainFilter(
        allowed_domains=["docs.example.com"],
        blocked_domains=["old.docs.example.com", "staging.example.com"]
    ),

    # URL pattern matching
    URLPatternFilter(patterns=["*tutorial*", "*guide*", "*blog*"]),

    # Content type filtering
    ContentTypeFilter(allowed_types=["text/html"]),

    # SEO quality filter
    SEOFilter(
        threshold=0.5,
        keywords=["tutorial", "guide", "documentation"]
    ),

    # Content relevance filter
    ContentRelevanceFilter(
        query="Web crawling and data extraction with Python",
        threshold=0.7
    )
])

config = CrawlerRunConfig(
    deep_crawl_strategy=BFSDeepCrawlStrategy(
        max_depth=2,
        filter_chain=advanced_filter_chain
    )
)
```

### Intelligent Crawling with Scorers

```python
from crawl4ai.deep_crawling.scorers import KeywordRelevanceScorer

# Keyword relevance scoring
async def scored_deep_crawl():
    keyword_scorer = KeywordRelevanceScorer(
        keywords=["browser", "crawler", "web", "automation"],
        weight=1.0
    )

    config = CrawlerRunConfig(
        deep_crawl_strategy=BestFirstCrawlingStrategy(
            max_depth=2,
            include_external=False,
            url_scorer=keyword_scorer
        ),
        stream=True,  # Recommended with BestFirst
        verbose=True
    )

    async with AsyncWebCrawler() as crawler:
        async for result in await crawler.arun("https://docs.crawl4ai.com", config=config):
            score = result.metadata.get("score", 0)
            depth = result.metadata.get("depth", 0)
            print(f"Depth: {depth} | Score: {score:.2f} | {result.url}")
```

### Limiting Crawl Size

```python
# Max pages limitation across strategies
async def limited_crawls():
    # BFS with page limit
    bfs_config = CrawlerRunConfig(
        deep_crawl_strategy=BFSDeepCrawlStrategy(
            max_depth=2,
            max_pages=5,  # Only crawl 5 pages total
            url_scorer=KeywordRelevanceScorer(keywords=["browser", "crawler"], weight=1.0)
        )
    )

    # DFS with score threshold
    dfs_config = CrawlerRunConfig(
        deep_crawl_strategy=DFSDeepCrawlStrategy(
            max_depth=2,
            score_threshold=0.7,  # Only URLs with scores above 0.7
            max_pages=10,
            url_scorer=KeywordRelevanceScorer(keywords=["web", "automation"], weight=1.0)
        )
    )

    # Best-First with both constraints
    bf_config = CrawlerRunConfig(
        deep_crawl_strategy=BestFirstCrawlingStrategy(
            max_depth=2,
            max_pages=7,  # Automatically gets highest scored pages
            url_scorer=KeywordRelevanceScorer(keywords=["crawl", "example"], weight=1.0)
        ),
        stream=True
    )

    async with AsyncWebCrawler() as crawler:
        # Use any of the configs
        async for result in await crawler.arun("https://docs.crawl4ai.com", config=bf_config):
            score = result.metadata.get("score", 0)
            print(f"Score: {score:.2f} | {result.url}")
```

### Complete Advanced Deep Crawler

```python
async def comprehensive_deep_crawl():
    # Sophisticated filter chain
    filter_chain = FilterChain([
        DomainFilter(
            allowed_domains=["docs.crawl4ai.com"],
            blocked_domains=["old.docs.crawl4ai.com"]
        ),
        URLPatternFilter(patterns=["*core*", "*advanced*", "*blog*"]),
        ContentTypeFilter(allowed_types=["text/html"]),
        SEOFilter(threshold=0.4, keywords=["crawl", "tutorial", "guide"])
    ])

    # Multi-keyword scorer
    keyword_scorer = KeywordRelevanceScorer(
        keywords=["crawl", "example", "async", "configuration", "browser"],
        weight=0.8
    )

    # Complete configuration
    config = CrawlerRunConfig(
        deep_crawl_strategy=BestFirstCrawlingStrategy(
            max_depth=2,
            include_external=False,
            filter_chain=filter_chain,
            url_scorer=keyword_scorer,
            max_pages=20
        ),
        scraping_strategy=LXMLWebScrapingStrategy(),
        stream=True,
        verbose=True,
        cache_mode=CacheMode.BYPASS
    )

    # Execute and analyze
    results = []
    start_time = time.time()

    async with AsyncWebCrawler() as crawler:
        async for result in await crawler.arun("https://docs.crawl4ai.com", config=config):
            results.append(result)
            score = result.metadata.get("score", 0)
            depth = result.metadata.get("depth", 0)
            print(f"→ Depth: {depth} | Score: {score:.2f} | {result.url}")

    # Performance analysis
    duration = time.time() - start_time
    avg_score = sum(r.metadata.get('score', 0) for r in results) / len(results)

    print(f"✅ Crawled {len(results)} pages in {duration:.2f}s")
    print(f"✅ Average relevance score: {avg_score:.2f}")

    # Depth distribution
    depth_counts = {}
    for result in results:
        depth = result.metadata.get("depth", 0)
        depth_counts[depth] = depth_counts.get(depth, 0) + 1

    for depth, count in sorted(depth_counts.items()):
        print(f"📊 Depth {depth}: {count} pages")
```

### Error Handling and Robustness

```python
async def robust_deep_crawl():
    config = CrawlerRunConfig(
        deep_crawl_strategy=BestFirstCrawlingStrategy(
            max_depth=2,
            max_pages=15,
            url_scorer=KeywordRelevanceScorer(keywords=["guide", "tutorial"])
        ),
        stream=True,
        page_timeout=30000  # 30 second timeout per page
    )

    successful_pages = []
    failed_pages = []

    async with AsyncWebCrawler() as crawler:
        async for result in await crawler.arun("https://docs.crawl4ai.com", config=config):
            if result.success:
                successful_pages.append(result)
                depth = result.metadata.get("depth", 0)
                score = result.metadata.get("score", 0)
                print(f"✅ Depth {depth} | Score: {score:.2f} | {result.url}")
            else:
                failed_pages.append({
                    'url': result.url,
                    'error': result.error_message,
                    'depth': result.metadata.get("depth", 0)
                })
                print(f"❌ Failed: {result.url} - {result.error_message}")

    print(f"📊 Results: {len(successful_pages)} successful, {len(failed_pages)} failed")

    # Analyze failures by depth
    if failed_pages:
        failure_by_depth = {}
        for failure in failed_pages:
            depth = failure['depth']
            failure_by_depth[depth] = failure_by_depth.get(depth, 0) + 1

        print("❌ Failures by depth:")
        for depth, count in sorted(failure_by_depth.items()):
            print(f"   Depth {depth}: {count} failures")
```

**📖 Learn more:** [Deep Crawling Guide](https://docs.crawl4ai.com/core/deep-crawling/), [Filter Documentation](https://docs.crawl4ai.com/core/content-selection/), [Scoring Strategies](https://docs.crawl4ai.com/advanced/advanced-features/)

---

## Deep Crawling - Diagrams & Workflows

Component ID: deep_crawling
Context Type: reasoning
Estimated tokens: 3,455

## Deep Crawling Workflows and Architecture

Visual representations of multi-level website exploration, filtering strategies, and intelligent crawling patterns.

### Deep Crawl Strategy Overview

```mermaid
flowchart TD
    A[Start Deep Crawl] --> B{Strategy Selection}

    B -->|Explore All Levels| C[BFS Strategy]
    B -->|Dive Deep Fast| D[DFS Strategy]
    B -->|Smart Prioritization| E[Best-First Strategy]

    C --> C1[Breadth-First Search]
    C1 --> C2[Process all depth 0 links]
    C2 --> C3[Process all depth 1 links]
    C3 --> C4[Continue by depth level]

    D --> D1[Depth-First Search]
    D1 --> D2[Follow first link deeply]
    D2 --> D3[Backtrack when max depth reached]
    D3 --> D4[Continue with next branch]

    E --> E1[Best-First Search]
    E1 --> E2[Score all discovered URLs]
    E2 --> E3[Process highest scoring URLs first]
    E3 --> E4[Continuously re-prioritize queue]

    C4 --> F[Apply Filters]
    D4 --> F
    E4 --> F

    F --> G{Filter Chain Processing}
    G -->|Domain Filter| G1[Check allowed/blocked domains]
    G -->|URL Pattern Filter| G2[Match URL patterns]
    G -->|Content Type Filter| G3[Verify content types]
    G -->|SEO Filter| G4[Evaluate SEO quality]
    G -->|Content Relevance| G5[Score content relevance]

    G1 --> H{Passed All Filters?}
    G2 --> H
    G3 --> H
    G4 --> H
    G5 --> H

    H -->|Yes| I[Add to Crawl Queue]
    H -->|No| J[Discard URL]

    I --> K{Processing Mode}
    K -->|Streaming| L[Process Immediately]
    K -->|Batch| M[Collect All Results]

    L --> N[Stream Result to User]
    M --> O[Return Complete Result Set]

    J --> P{More URLs in Queue?}
    N --> P
    O --> P

    P -->|Yes| Q{Within Limits?}
    P -->|No| R[Deep Crawl Complete]

    Q -->|Max Depth OK| S{Max Pages OK}
    Q -->|Max Depth Exceeded| T[Skip Deeper URLs]

    S -->|Under Limit| U[Continue Crawling]
    S -->|Limit Reached| R

    T --> P
    U --> F

    style A fill:#e1f5fe
    style R fill:#c8e6c9
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style E fill:#e8f5e8
```

### Deep Crawl Strategy Comparison

```mermaid
graph TB
    subgraph "BFS - Breadth-First Search"
        BFS1[Level 0: Start URL]
        BFS2[Level 1: All direct links]
        BFS3[Level 2: All second-level links]
        BFS4[Level 3: All third-level links]

        BFS1 --> BFS2
        BFS2 --> BFS3
        BFS3 --> BFS4

        BFS_NOTE[Complete each depth before going deeper<br/>Good for site mapping<br/>Memory intensive for wide sites]
    end

    subgraph "DFS - Depth-First Search"
        DFS1[Start URL]
        DFS2[First Link → Deep]
        DFS3[Follow until max depth]
        DFS4[Backtrack and try next]

        DFS1 --> DFS2
        DFS2 --> DFS3
        DFS3 --> DFS4
        DFS4 --> DFS2

        DFS_NOTE[Go deep on first path<br/>Memory efficient<br/>May miss important pages]
    end

    subgraph "Best-First - Priority Queue"
        BF1[Start URL]
        BF2[Score all discovered links]
        BF3[Process highest scoring first]
        BF4[Continuously re-prioritize]

        BF1 --> BF2
        BF2 --> BF3
        BF3 --> BF4
        BF4 --> BF2

        BF_NOTE[Intelligent prioritization<br/>Finds relevant content fast<br/>Recommended for most use cases]
    end

    style BFS1 fill:#e3f2fd
    style DFS1 fill:#f3e5f5
    style BF1 fill:#e8f5e8
    style BFS_NOTE fill:#fff3e0
    style DFS_NOTE fill:#fff3e0
    style BF_NOTE fill:#fff3e0
```

### Filter Chain Processing Sequence

```mermaid
sequenceDiagram
    participant URL as Discovered URL
    participant Chain as Filter Chain
    participant Domain as Domain Filter
    participant Pattern as URL Pattern Filter
    participant Content as Content Type Filter
    participant SEO as SEO Filter
    participant Relevance as Content Relevance Filter
    participant Queue as Crawl Queue

    URL->>Chain: Process URL
    Chain->>Domain: Check domain rules

    alt Domain Allowed
        Domain-->>Chain: ✓ Pass
        Chain->>Pattern: Check URL patterns

        alt Pattern Matches
            Pattern-->>Chain: ✓ Pass
            Chain->>Content: Check content type

            alt Content Type Valid
                Content-->>Chain: ✓ Pass
                Chain->>SEO: Evaluate SEO quality

                alt SEO Score Above Threshold
                    SEO-->>Chain: ✓ Pass
                    Chain->>Relevance: Score content relevance

                    alt Relevance Score High
                        Relevance-->>Chain: ✓ Pass
                        Chain->>Queue: Add to crawl queue
                        Queue-->>URL: Queued for crawling
                    else Relevance Score Low
                        Relevance-->>Chain: ✗ Reject
                        Chain-->>URL: Filtered out - Low relevance
                    end
                else SEO Score Low
                    SEO-->>Chain: ✗ Reject
                    Chain-->>URL: Filtered out - Poor SEO
                end
            else Invalid Content Type
                Content-->>Chain: ✗ Reject
                Chain-->>URL: Filtered out - Wrong content type
            end
        else Pattern Mismatch
            Pattern-->>Chain: ✗ Reject
            Chain-->>URL: Filtered out - Pattern mismatch
        end
    else Domain Blocked
        Domain-->>Chain: ✗ Reject
        Chain-->>URL: Filtered out - Blocked domain
    end
```

### URL Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> Discovered: Found on page

    Discovered --> FilterPending: Enter filter chain

    FilterPending --> DomainCheck: Apply domain filter
    DomainCheck --> PatternCheck: Domain allowed
    DomainCheck --> Rejected: Domain blocked

    PatternCheck --> ContentCheck: Pattern matches
    PatternCheck --> Rejected: Pattern mismatch

    ContentCheck --> SEOCheck: Content type valid
    ContentCheck --> Rejected: Invalid content

    SEOCheck --> RelevanceCheck: SEO score sufficient
    SEOCheck --> Rejected: Poor SEO score

    RelevanceCheck --> Scored: Relevance score calculated
    RelevanceCheck --> Rejected: Low relevance

    Scored --> Queued: Added to priority queue

    Queued --> Crawling: Selected for processing
    Crawling --> Success: Page crawled successfully
    Crawling --> Failed: Crawl failed

    Success --> LinkExtraction: Extract new links
    LinkExtraction --> [*]: Process complete

    Failed --> [*]: Record failure
    Rejected --> [*]: Log rejection reason

    note right of Scored : Score determines priority<br/>in Best-First strategy

    note right of Failed : Errors logged with<br/>depth and reason
```

### Streaming vs Batch Processing Architecture

```mermaid
graph TB
    subgraph "Input"
        A[Start URL] --> B[Deep Crawl Strategy]
    end

    subgraph "Crawl Engine"
        B --> C[URL Discovery]
        C --> D[Filter Chain]
        D --> E[Priority Queue]
        E --> F[Page Processor]
    end

    subgraph "Streaming Mode stream=True"
        F --> G1[Process Page]
        G1 --> H1[Extract Content]
        H1 --> I1[Yield Result Immediately]
        I1 --> J1[async for result]
        J1 --> K1[Real-time Processing]

        G1 --> L1[Extract Links]
        L1 --> M1[Add to Queue]
        M1 --> F
    end

    subgraph "Batch Mode stream=False"
        F --> G2[Process Page]
        G2 --> H2[Extract Content]
        H2 --> I2[Store Result]
        I2 --> N2[Result Collection]

        G2 --> L2[Extract Links]
        L2 --> M2[Add to Queue]
        M2 --> O2{More URLs?}
        O2 -->|Yes| F
        O2 -->|No| P2[Return All Results]
        P2 --> Q2[Batch Processing]
    end

    style I1 fill:#e8f5e8
    style K1 fill:#e8f5e8
    style P2 fill:#e3f2fd
    style Q2 fill:#e3f2fd
```

### Advanced Scoring and Prioritization System

```mermaid
flowchart LR
    subgraph "URL Discovery"
        A[Page Links] --> B[Extract URLs]
        B --> C[Normalize URLs]
    end

    subgraph "Scoring System"
        C --> D[Keyword Relevance Scorer]
        D --> D1[URL Text Analysis]
        D --> D2[Keyword Matching]
        D --> D3[Calculate Base Score]

        D3 --> E[Additional Scoring Factors]
        E --> E1[URL Structure weight: 0.2]
        E --> E2[Link Context weight: 0.3]
        E --> E3[Page Depth Penalty weight: 0.1]
        E --> E4[Domain Authority weight: 0.4]

        D1 --> F[Combined Score]
        D2 --> F
        D3 --> F
        E1 --> F
        E2 --> F
        E3 --> F
        E4 --> F
    end

    subgraph "Prioritization"
        F --> G{Score Threshold}
        G -->|Above Threshold| H[Priority Queue]
        G -->|Below Threshold| I[Discard URL]

        H --> J[Best-First Selection]
        J --> K[Highest Score First]
        K --> L[Process Page]

        L --> M[Update Scores]
        M --> N[Re-prioritize Queue]
        N --> J
    end

    style F fill:#fff3e0
    style H fill:#e8f5e8
    style L fill:#e3f2fd
```

### Deep Crawl Performance and Limits

```mermaid
graph TD
    subgraph "Crawl Constraints"
        A[Max Depth: 2] --> A1[Prevents infinite crawling]
        B[Max Pages: 50] --> B1[Controls resource usage]
        C[Score Threshold: 0.3] --> C1[Quality filtering]
        D[Domain Limits] --> D1[Scope control]
    end

    subgraph "Performance Monitoring"
        E[Pages Crawled] --> F[Depth Distribution]
        E --> G[Success Rate]
        E --> H[Average Score]
        E --> I[Processing Time]

        F --> J[Performance Report]
        G --> J
        H --> J
        I --> J
    end

    subgraph "Resource Management"
        K[Memory Usage] --> L{Memory Threshold}
        L -->|Under Limit| M[Continue Crawling]
        L -->|Over Limit| N[Reduce Concurrency]

        O[CPU Usage] --> P{CPU Threshold}
        P -->|Normal| M
        P -->|High| Q[Add Delays]

        R[Network Load] --> S{Rate Limits}
        S -->|OK| M
        S -->|Exceeded| T[Throttle Requests]
    end

    M --> U[Optimal Performance]
    N --> V[Reduced Performance]
    Q --> V
    T --> V

    style U fill:#c8e6c9
    style V fill:#fff3e0
    style J fill:#e3f2fd
```

### Error Handling and Recovery Flow

```mermaid
sequenceDiagram
    participant Strategy as Deep Crawl Strategy
    participant Queue as Priority Queue
    participant Crawler as Page Crawler
    participant Error as Error Handler
    participant Result as Result Collector

    Strategy->>Queue: Get next URL
    Queue-->>Strategy: Return highest priority URL

    Strategy->>Crawler: Crawl page

    alt Successful Crawl
        Crawler-->>Strategy: Return page content
        Strategy->>Result: Store successful result
        Strategy->>Strategy: Extract new links
        Strategy->>Queue: Add new URLs to queue
    else Network Error
        Crawler-->>Error: Network timeout/failure
        Error->>Error: Log error with details
        Error->>Queue: Mark URL as failed
        Error-->>Strategy: Skip to next URL
    else Parse Error
        Crawler-->>Error: HTML parsing failed
        Error->>Error: Log parse error
        Error->>Result: Store failed result
        Error-->>Strategy: Continue with next URL
    else Rate Limit Hit
        Crawler-->>Error: Rate limit exceeded
        Error->>Error: Apply backoff strategy
        Error->>Queue: Re-queue URL with delay
        Error-->>Strategy: Wait before retry
    else Depth Limit
        Strategy->>Strategy: Check depth constraint
        Strategy-->>Queue: Skip URL - too deep
    else Page Limit
        Strategy->>Strategy: Check page count
        Strategy-->>Result: Stop crawling - limit reached
    end

    Strategy->>Queue: Request next URL
    Queue-->>Strategy: More URLs available?

    alt Queue Empty
        Queue-->>Result: Crawl complete
    else Queue Has URLs
        Queue-->>Strategy: Continue crawling
    end
```

**📖 Learn more:** [Deep Crawling Strategies](https://docs.crawl4ai.com/core/deep-crawling/), [Content Filtering](https://docs.crawl4ai.com/core/content-selection/), [Advanced Crawling Patterns](https://docs.crawl4ai.com/advanced/advanced-features/)

---
