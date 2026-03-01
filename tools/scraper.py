"""
WSJ News Scraper - A.N.T. Protocol Backend
Uses the FireCrawl API to fetch WSJ section pages as markdown, then parses them
with regex to extract article listings without relying on slow LLM extraction.
"""

import hashlib
import json
import os
import re
import sys
from typing import Optional

from dotenv import load_dotenv
from firecrawl import V1FirecrawlApp

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

FIRECRAWL_API_KEY = os.getenv("FIRECRAWL_API_KEY")

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "opulen-news", "public", "mockData.json")

TARGET_SECTIONS = [
    # World
    {"category": "World", "sub_category": "Africa",
     "url": "https://www.wsj.com/world/africa?mod=nav_top_subsection"},
    {"category": "World", "sub_category": "Europe",
     "url": "https://www.wsj.com/world/europe?mod=nav_top_subsection"},
    # Business
    {"category": "Business", "sub_category": "C-suite",
     "url": "https://www.wsj.com/business/c-suite?mod=nav_top_subsection"},
    {"category": "Business", "sub_category": "Logistics",
     "url": "https://www.wsj.com/business/logistics?mod=nav_top_subsection"},
    {"category": "Business", "sub_category": "Autos",
     "url": "https://www.wsj.com/business/autos?mod=nav_top_subsection"},
    # Economy
    {"category": "Economy", "sub_category": "Central Banking",
     "url": "https://www.wsj.com/economy/central-banking?mod=nav_top_subsection"},
    {"category": "Economy", "sub_category": "Housing",
     "url": "https://www.wsj.com/economy/housing?mod=nav_top_subsection"},
    {"category": "Economy", "sub_category": "Jobs",
     "url": "https://www.wsj.com/economy/jobs?mod=nav_top_subsection"},
    {"category": "Economy", "sub_category": "Trade",
     "url": "https://www.wsj.com/economy/trade?mod=nav_top_subsection"},
    {"category": "Economy", "sub_category": "Global",
     "url": "https://www.wsj.com/economy/global?mod=nav_top_subsection"},
    # Tech
    {"category": "Tech", "sub_category": "AI",
     "url": "https://www.wsj.com/tech/ai?mod=nav_top_subsection"},
    {"category": "Tech", "sub_category": "Biotech",
     "url": "https://www.wsj.com/tech/biotech?mod=nav_top_subsection"},
    {"category": "Tech", "sub_category": "Personal Technology",
     "url": "https://www.wsj.com/tech/personal-tech?mod=nav_top_subsection"},
    # Finance
    {"category": "Finance", "sub_category": "Commodities & Futures",
     "url": "https://www.wsj.com/finance/commodities-futures?mod=nav_top_subsection"},
    {"category": "Finance", "sub_category": "Currency",
     "url": "https://www.wsj.com/finance/currencies?mod=nav_top_subsection"},
    {"category": "Finance", "sub_category": "Investing",
     "url": "https://www.wsj.com/finance/investing?mod=nav_top_subsection"},
    {"category": "Finance", "sub_category": "Regulation",
     "url": "https://www.wsj.com/finance/regulation?mod=nav_top_subsection"},
    {"category": "Finance", "sub_category": "Stocks",
     "url": "https://www.wsj.com/finance/stocks?mod=nav_top_subsection"},
    # Real Estate
    {"category": "Real Estate", "sub_category": "Commercial Real Estate",
     "url": "https://www.wsj.com/real-estate/commercial-real-estate?mod=nav_top_subsection"},
]

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def make_article_id(url: str) -> str:
    return hashlib.md5(url.encode("utf-8")).hexdigest()


def clean_url(url: str) -> str:
    """Strip tracking query params, keep the path."""
    return url.split("?")[0]


# Match article headlines in WSJ markdown: ### [Title](https://www.wsj.com/...)
# Followed optionally by a description line and a timestamp line.
_HEADLINE_RE = re.compile(
    r"###\s+\[([^\]]+)\]\((https://www\.wsj\.com/[^)\s]+)\)"
)

# Simple description: a plain text paragraph (no leading #) or a markdown link
# that immediately follows the headline block.
_TIMESTAMP_RE = re.compile(
    r"\b(?:\d+\s+(?:hour|minute|day|week)s?\s+ago|"
    r"(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.?\s+\d{1,2},?\s+\d{4})\b",
    re.IGNORECASE,
)


def parse_articles_from_markdown(markdown: str) -> list[dict]:
    """
    Walk through the markdown and extract every article headline + URL.
    For each headline, grab the first non-empty text paragraph as the summary
    and the first timestamp-like string as published_at.
    """
    articles: list[dict] = []
    # Split into blocks around headlines so we can examine context
    segments = _HEADLINE_RE.split(markdown)
    # segments = [pre_text, title1, url1, post_text1, title2, url2, post_text2, ...]
    # Index:       0         1       2    3            4       5    6
    i = 1
    while i + 2 <= len(segments):
        title = segments[i].strip()
        url = clean_url(segments[i + 1].strip())
        context = segments[i + 2] if i + 2 < len(segments) else ""

        # Skip non-article WSJ links (nav, author pages, market data, etc.)
        skip_patterns = (
            "/news/author/", "/market-data/", "/video/", "/podcasts/",
            "/newsletters/", "/search?", "/arts-culture/", "/real-estate/residential",
        )
        if any(p in url for p in skip_patterns):
            i += 3
            continue

        # Extract summary: first non-empty line in context that is plain text
        # (not a link line starting with "[![", not a "By" line)
        summary: Optional[str] = None
        lines = [ln.strip() for ln in context.split("\n") if ln.strip()]
        for ln in lines[:8]:
            if (
                ln.startswith("[![")       # image link - skip
                or ln.startswith("By ")    # author line - skip
                or ln.startswith("###")    # another headline - stop
                or ln.startswith("* * *")  # horizontal rule - stop
                or ln.startswith("Advertisement")
                or re.match(r"^\d+$", ln)  # comment count number - skip
                or _TIMESTAMP_RE.match(ln) # bare timestamp - skip
            ):
                continue
            # Strip markdown link wrapper if the whole line is [text](url)
            link_match = re.match(r"^\[([^\]]+)\]\([^)]+\)$", ln)
            candidate = link_match.group(1) if link_match else ln
            if len(candidate) > 20:
                summary = candidate
                break

        # Extract timestamp
        ts_match = _TIMESTAMP_RE.search(context[:500])
        published_at: Optional[str] = ts_match.group(0) if ts_match else None

        articles.append({
            "article_id": make_article_id(url),
            "source": "WSJ",
            "category": "",  # filled in by caller
            "sub_category": "",
            "title": title,
            "url": url,
            "summary": summary,
            "published_at": published_at,
        })
        i += 3

    return articles


def scrape_section(
    app: V1FirecrawlApp,
    category: str,
    sub_category: str,
    url: str,
) -> list[dict]:
    """
    Fetch a WSJ section page as markdown and parse article headlines from it.
    Returns an empty list on failure so the overall run is not aborted.
    """
    print(f"  [>>] Scraping '{category} > {sub_category}' ...", flush=True)
    try:
        result = app.scrape_url(
            url,
            formats=["markdown"],
            timeout=60000,
            proxy="stealth",
            wait_for=2000,
            only_main_content=False,
        )
        markdown = result.markdown or ""
        if not markdown:
            print(f"  [!]  No content returned for {url}", flush=True)
            return []

        raw = parse_articles_from_markdown(markdown)
        # Stamp category / sub_category
        for art in raw:
            art["category"] = category
            art["sub_category"] = sub_category

        print(f"  [OK] Found {len(raw)} articles.", flush=True)
        return raw

    except Exception as exc:
        print(f"  [ERR] Error scraping {url}: {exc}", flush=True)
        return []


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def main() -> None:
    if not FIRECRAWL_API_KEY:
        print(
            "[FATAL] FIRECRAWL_API_KEY is not set. "
            "Please add it to a .env file in the project root.",
            file=sys.stderr,
        )
        sys.exit(1)

    app = V1FirecrawlApp(api_key=FIRECRAWL_API_KEY)
    all_articles: list[dict] = []

    print(f"\n[START] Scraping {len(TARGET_SECTIONS)} WSJ sections ...\n")

    for section in TARGET_SECTIONS:
        articles = scrape_section(
            app,
            category=section["category"],
            sub_category=section["sub_category"],
            url=section["url"],
        )
        all_articles.extend(articles)

    # Deduplicate by article_id
    seen: set[str] = set()
    unique_articles: list[dict] = []
    for article in all_articles:
        if article["article_id"] not in seen:
            seen.add(article["article_id"])
            unique_articles.append(article)

    output_path = os.path.abspath(OUTPUT_PATH)
    with open(output_path, "w", encoding="utf-8") as fh:
        json.dump(unique_articles, fh, indent=2, ensure_ascii=False)

    print(f"\n[DONE] Saved {len(unique_articles)} unique articles -> {output_path}\n")


if __name__ == "__main__":
    main()
