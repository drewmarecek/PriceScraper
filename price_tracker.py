"""
Subscription price tracker.

Reads URLs from a Supabase ``urls`` table, resolves each to a company in the
``Companies`` table, uses the Firecrawl API to extract the lowest monthly
subscription price from each page, and logs results to ``Price_History``.
"""

from __future__ import annotations

import logging
import os
import sys
import time
from datetime import datetime, timezone
from typing import Any
from urllib.parse import urlparse

import requests
from dotenv import load_dotenv
from firecrawl import Firecrawl
from firecrawl.v2.types import Document
from supabase import Client, create_client

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

FIRECRAWL_API_KEY: str = os.environ["FIRECRAWL_API_KEY"]
SUPABASE_URL: str = os.environ["SUPABASE_URL"]
SUPABASE_KEY: str = os.environ["SUPABASE_KEY"]

URLS_TABLE = "urls"
URL_COLUMN = "url"
COMPANIES_TABLE = "Companies"
PRICE_HISTORY_TABLE = "Price_History"
WEBHOOKS_TABLE = "webhooks"

WEBHOOK_TIMEOUT_SECS = 10

MAX_RETRIES = 5
INITIAL_BACKOFF_SECS = 2.0
BACKOFF_MULTIPLIER = 2.0

# ---------------------------------------------------------------------------
# Clients
# ---------------------------------------------------------------------------


def get_supabase_client() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def get_firecrawl_client() -> Firecrawl:
    return Firecrawl(api_key=FIRECRAWL_API_KEY)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def domain_from_url(url: str) -> str:
    """Extract the bare domain (no www.) from a URL."""
    host = urlparse(url).netloc
    if host.startswith("www."):
        host = host[4:]
    return host


def company_name_from_domain(domain: str) -> str:
    """Derive a human-readable company name from a domain."""
    return domain.split(".")[0].capitalize()


# ---------------------------------------------------------------------------
# Supabase helpers
# ---------------------------------------------------------------------------


def fetch_urls(supabase: Client) -> list[str]:
    """Return every URL from the urls table."""
    response = supabase.table(URLS_TABLE).select(URL_COLUMN).execute()
    urls: list[str] = [row[URL_COLUMN] for row in response.data]
    log.info("Fetched %d URL(s) from Supabase", len(urls))
    return urls


def get_or_create_company(supabase: Client, url: str) -> int:
    """Look up a company by domain, creating one if it doesn't exist.
    Returns the Company id."""
    domain = domain_from_url(url)

    existing = (
        supabase.table(COMPANIES_TABLE)
        .select("id")
        .eq("Domain", domain)
        .limit(1)
        .execute()
    )
    if existing.data:
        return existing.data[0]["id"]

    name = company_name_from_domain(domain)
    row = {"Name": name, "Domain": domain}
    result = supabase.table(COMPANIES_TABLE).insert(row).execute()
    company_id = result.data[0]["id"]
    log.info("  Created company %s (id=%d) for %s", name, company_id, domain)
    return company_id


def insert_price_record(
    supabase: Client,
    company_id: int,
    price_dollars: float,
    scraped_at: datetime,
) -> None:
    """Insert a single price observation into Price_History."""
    record = {
        "Company_ID": company_id,
        "Scraped_Price": price_dollars,
        "Date": scraped_at.isoformat(),
    }
    supabase.table(PRICE_HISTORY_TABLE).insert(record).execute()
    log.info("  Logged $%.2f for company_id=%d", price_dollars, company_id)


def get_previous_price(supabase: Client, company_id: int) -> float | None:
    """Return the most recent price already stored for *company_id*, or None."""
    result = (
        supabase.table(PRICE_HISTORY_TABLE)
        .select("Scraped_Price")
        .eq("Company_ID", company_id)
        .order("Date", desc=True)
        .limit(1)
        .execute()
    )
    if result.data:
        return result.data[0]["Scraped_Price"]
    return None


def fetch_active_webhooks(supabase: Client) -> list[dict[str, Any]]:
    """Return all rows from ``webhooks`` where is_active is true."""
    result = (
        supabase.table(WEBHOOKS_TABLE)
        .select("id, client_name, webhook_url")
        .eq("is_active", True)
        .execute()
    )
    return result.data


def fire_webhooks(
    webhooks: list[dict[str, Any]],
    payload: dict[str, Any],
) -> None:
    """POST *payload* as JSON to every webhook URL."""
    for hook in webhooks:
        url = hook["webhook_url"]
        try:
            resp = requests.post(url, json=payload, timeout=WEBHOOK_TIMEOUT_SECS)
            resp.raise_for_status()
            log.info(
                "  Webhook delivered to %s (%s) — %d",
                hook["client_name"],
                url,
                resp.status_code,
            )
        except requests.RequestException as exc:
            log.error("  Webhook to %s failed: %s", url, exc)


def notify_price_change(
    supabase: Client,
    webhooks: list[dict[str, Any]],
    company_name: str,
    domain: str,
    previous_price: float,
    new_price: float,
    scraped_at: datetime,
) -> None:
    """Build a price-change payload and fire it to all active webhooks."""
    change_pct = ((new_price - previous_price) / previous_price) * 100
    direction = "increased" if new_price > previous_price else "decreased"

    payload = {
        "event": "price_change",
        "company": company_name,
        "domain": domain,
        "previous_price": previous_price,
        "new_price": new_price,
        "change_percent": round(change_pct, 2),
        "scraped_at": scraped_at.isoformat(),
        "text": (
            f"🔔 *Price Change Detected*\n"
            f"*{company_name}* ({domain}) has {direction} "
            f"from ${previous_price:.2f} → ${new_price:.2f} "
            f"({change_pct:+.1f}%)"
        ),
    }

    log.info(
        "  Price change for %s: $%.2f → $%.2f (%+.1f%%)",
        company_name,
        previous_price,
        new_price,
        change_pct,
    )
    fire_webhooks(webhooks, payload)


# ---------------------------------------------------------------------------
# Firecrawl extraction
# ---------------------------------------------------------------------------

PRICE_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "lowest_monthly_price_cents": {
            "type": ["integer", "null"],
            "description": (
                "The lowest monthly subscription price shown on the page, "
                "expressed in US cents (e.g. $9.99 → 999). "
                "Return null if no monthly price is found."
            ),
        },
    },
    "required": ["lowest_monthly_price_cents"],
}

EXTRACTION_PROMPT = (
    "Find the lowest monthly subscription price in USD on this page. "
    "Convert the dollar amount to integer US cents "
    "(e.g. $9.99 becomes 999, $29 becomes 2900). "
    "If the page shows annual plans, calculate the effective monthly price. "
    "If no monthly subscription price is found, return null."
)


def _scrape_with_retry(firecrawl: Firecrawl, url: str) -> Document | None:
    """Call Firecrawl scrape with exponential backoff on rate-limit (429)."""
    backoff = INITIAL_BACKOFF_SECS

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            result = firecrawl.scrape(
                url,
                formats=[
                    {
                        "type": "json",
                        "schema": PRICE_SCHEMA,
                        "prompt": EXTRACTION_PROMPT,
                    }
                ],
            )
            return result
        except Exception as exc:
            msg = str(exc).lower()
            is_rate_limit = "429" in msg or "rate" in msg or "too many" in msg

            if is_rate_limit and attempt < MAX_RETRIES:
                log.warning(
                    "  Rate-limited on attempt %d/%d — retrying in %.1fs",
                    attempt,
                    MAX_RETRIES,
                    backoff,
                )
                time.sleep(backoff)
                backoff *= BACKOFF_MULTIPLIER
                continue

            log.error("  Firecrawl error for %s: %s", url, exc)
            return None

    return None


def extract_price(firecrawl: Firecrawl, url: str) -> int | None:
    """
    Scrape a single URL and return the lowest monthly price in cents,
    or None if extraction failed or no price was found.
    """
    log.info("  Scraping %s …", url)
    result = _scrape_with_retry(firecrawl, url)

    if result is None:
        return None

    json_data = result.json
    if not json_data:
        log.warning("  No JSON payload returned for %s", url)
        return None

    if isinstance(json_data, dict):
        price = json_data.get("lowest_monthly_price_cents")
    else:
        price = getattr(json_data, "lowest_monthly_price_cents", None)

    if price is None:
        log.warning("  No price found on %s", url)
        return None

    try:
        return int(price)
    except (TypeError, ValueError):
        log.warning("  Non-integer price value %r for %s", price, url)
        return None


# ---------------------------------------------------------------------------
# Orchestrator
# ---------------------------------------------------------------------------


def run() -> None:
    """Main pipeline: fetch URLs → extract prices → log to Supabase → notify."""
    supabase = get_supabase_client()
    firecrawl = get_firecrawl_client()

    urls = fetch_urls(supabase)
    if not urls:
        log.info("No URLs to process — exiting.")
        return

    webhooks = fetch_active_webhooks(supabase)
    log.info("Loaded %d active webhook(s)", len(webhooks))

    scraped_at = datetime.now(timezone.utc)
    success_count = 0

    for url in urls:
        price_cents = extract_price(firecrawl, url)
        if price_cents is None:
            continue

        company_id = get_or_create_company(supabase, url)
        domain = domain_from_url(url)
        company_name = company_name_from_domain(domain)
        price_dollars = price_cents / 100.0

        previous_price = get_previous_price(supabase, company_id)

        insert_price_record(supabase, company_id, price_dollars, scraped_at)
        success_count += 1

        if (
            webhooks
            and previous_price is not None
            and previous_price != price_dollars
        ):
            notify_price_change(
                supabase,
                webhooks,
                company_name,
                domain,
                previous_price,
                price_dollars,
                scraped_at,
            )

    log.info(
        "Done. %d/%d URL(s) priced successfully.", success_count, len(urls)
    )


if __name__ == "__main__":
    try:
        run()
    except KeyboardInterrupt:
        log.info("Interrupted.")
        sys.exit(130)
