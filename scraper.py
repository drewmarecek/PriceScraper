"""
Storage-facility price scraper.

Fetches every row from the Supabase ``facilities`` table, scrapes each
``location_url`` with the Firecrawl API to extract the current monthly web
rate for a 10×10 Climate Controlled unit, and inserts the result into the
``price_history`` table.

Run:
    python3 scraper.py
"""

from __future__ import annotations

import logging
import os
import sys
import time
from datetime import datetime, timezone
from typing import Any

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

SLACK_WEBHOOK_URL: str = os.environ["SLACK_WEBHOOK_URL"]

FACILITIES_TABLE = "facilities"
PRICE_HISTORY_TABLE = "price_history"

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
# Supabase helpers
# ---------------------------------------------------------------------------


def fetch_facilities(supabase: Client) -> list[dict[str, Any]]:
    """Return every row from the facilities table."""
    response = supabase.table(FACILITIES_TABLE).select("*").execute()
    log.info("Fetched %d facility(ies) from Supabase", len(response.data))
    return response.data


def insert_price(
    supabase: Client,
    facility_id: int,
    price: int,
    scraped_at: datetime,
) -> None:
    """Insert a scraped price into price_history."""
    record = {
        "facility_id": facility_id,
        "price": price,
        "scraped_at": scraped_at.isoformat(),
    }
    supabase.table(PRICE_HISTORY_TABLE).insert(record).execute()
    log.info("  Logged $%d for facility_id=%d", price, facility_id)


def get_previous_price(supabase: Client, facility_id: int) -> int | None:
    """Return the most recent price stored for *facility_id*, or None."""
    result = (
        supabase.table(PRICE_HISTORY_TABLE)
        .select("price")
        .eq("facility_id", facility_id)
        .order("scraped_at", desc=True)
        .limit(1)
        .execute()
    )
    if result.data:
        return result.data[0]["price"]
    return None


def send_slack_alert(facility_name: str, old_price: int, new_price: int) -> None:
    """POST a price-change alert to the configured Slack webhook."""
    message = (
        f"🚨 PRICE CHANGE ALERT: {facility_name} just changed "
        f"their 10x10 rate from ${old_price} to ${new_price}."
    )
    try:
        resp = requests.post(
            SLACK_WEBHOOK_URL,
            json={"text": message},
            timeout=WEBHOOK_TIMEOUT_SECS,
        )
        resp.raise_for_status()
        log.info("  Slack alert sent for %s", facility_name)
    except requests.RequestException as exc:
        log.error("  Slack alert failed for %s: %s", facility_name, exc)


# ---------------------------------------------------------------------------
# Firecrawl extraction
# ---------------------------------------------------------------------------

PRICE_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "monthly_rate": {
            "type": ["integer", "null"],
            "description": (
                "The current monthly web rate in whole US dollars for a "
                "10x10 Climate Controlled storage unit. "
                "Return the integer dollar amount (e.g. $159 → 159). "
                "Return null if no matching unit is found."
            ),
        },
    },
    "required": ["monthly_rate"],
}

EXTRACTION_PROMPT = (
    "Find the current monthly web rate for a '10x10 Climate Controlled' "
    "storage unit on this page. The unit size is 10x10 (also written as "
    "10' x 10' or 10×10) and it must be climate controlled. "
    "Return the price as a whole-dollar integer (e.g. $159 becomes 159). "
    "If the page lists multiple 10x10 climate controlled units, return "
    "the cheapest web rate. If no 10x10 climate controlled unit is found, "
    "return null."
)


def _scrape_with_retry(firecrawl: Firecrawl, url: str) -> Document | None:
    """Call Firecrawl scrape with exponential backoff on rate-limit errors."""
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


def extract_rate(firecrawl: Firecrawl, url: str) -> int | None:
    """
    Scrape a facility page and return the 10x10 CC monthly rate in dollars,
    or None if extraction failed or no matching unit was found.
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
        rate = json_data.get("monthly_rate")
    else:
        rate = getattr(json_data, "monthly_rate", None)

    if rate is None:
        log.warning("  No 10x10 CC rate found on %s", url)
        return None

    try:
        return int(rate)
    except (TypeError, ValueError):
        log.warning("  Non-integer rate value %r for %s", rate, url)
        return None


# ---------------------------------------------------------------------------
# Orchestrator
# ---------------------------------------------------------------------------


def run() -> None:
    """Main pipeline: fetch facilities → extract rates → log to Supabase."""
    supabase = get_supabase_client()
    firecrawl = get_firecrawl_client()

    facilities = fetch_facilities(supabase)
    if not facilities:
        log.info("No facilities to process — exiting.")
        return

    scraped_at = datetime.now(timezone.utc)
    success_count = 0

    for facility in facilities:
        facility_id = facility["id"]
        facility_name = facility.get("name", f"Facility #{facility_id}")
        url = facility["location_url"]

        rate = extract_rate(firecrawl, url)
        if rate is None:
            continue

        previous_price = get_previous_price(supabase, facility_id)

        insert_price(supabase, facility_id, rate, scraped_at)
        success_count += 1

        if previous_price is not None and previous_price != rate:
            send_slack_alert(facility_name, previous_price, rate)

    log.info(
        "Done. %d/%d facility(ies) scraped successfully.",
        success_count,
        len(facilities),
    )


if __name__ == "__main__":
    try:
        run()
    except KeyboardInterrupt:
        log.info("Interrupted.")
        sys.exit(130)
