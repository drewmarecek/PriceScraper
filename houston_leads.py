"""
Independent self-storage lead scraper for North Houston.

Searches Google Places API for facilities in Conroe, Spring, and Tomball TX.
Filters out national chains, then scrapes each facility's website for a
public email address. Saves results to houston_leads.csv.

Requires GOOGLE_MAPS_API_KEY in .env with Places API (New) enabled.

Run:
    python3 houston_leads.py
"""

from __future__ import annotations

import csv
import logging
import os
import re
import time
from typing import Any
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
)
log = logging.getLogger(__name__)

GOOGLE_MAPS_API_KEY: str = os.environ["GOOGLE_MAPS_API_KEY"]

SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"
FIELD_MASK = "places.displayName,places.id,places.websiteUri"

QUERIES = [
    "Self Storage in Conroe, TX",
    "Self Storage in Spring, TX",
    "Self Storage in Tomball, TX",
]

EXCLUDED_CHAINS = [
    "extra space",
    "public storage",
    "cubesmart",
    "u-haul",
    "life storage",
    "securcare",
    "storagemart",
]

OUTPUT_FILE = "houston_leads.csv"
REQUEST_TIMEOUT = 5

EMAIL_RE = re.compile(
    r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}",
)

JUNK_EMAIL_PATTERNS = [
    "example.com",
    "sentry.io",
    "wixpress.com",
    "googleapis.com",
    "schema.org",
    "w3.org",
    "wordpress.org",
    "gravatar.com",
    "your",
    "email@",
    "@email",
    ".png",
    ".jpg",
    ".svg",
    ".gif",
    ".webp",
    ".css",
    ".js",
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
}


def text_search(query: str) -> list[dict[str, Any]]:
    """Run a Places (New) Text Search with pagination."""
    results: list[dict[str, Any]] = []
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": FIELD_MASK,
    }
    page_token: str | None = None

    while True:
        body: dict[str, Any] = {"textQuery": query, "pageSize": 20}
        if page_token:
            body["pageToken"] = page_token

        resp = requests.post(SEARCH_URL, json=body, headers=headers, timeout=15)
        if resp.status_code != 200:
            log.error("Search error %d: %s", resp.status_code, resp.text[:300])
            break

        data = resp.json()
        results.extend(data.get("places", []))
        log.info("  Fetched %d results so far for '%s'", len(results), query)

        page_token = data.get("nextPageToken")
        if not page_token:
            break
        time.sleep(1)

    return results


def is_excluded(name: str) -> bool:
    name_lower = name.lower()
    return any(chain in name_lower for chain in EXCLUDED_CHAINS)


def is_junk_email(email: str) -> bool:
    email_lower = email.lower()
    return any(pat in email_lower for pat in JUNK_EMAIL_PATTERNS)


def extract_emails_from_html(html: str) -> set[str]:
    """Pull email addresses from raw HTML, filtering out junk."""
    raw = set(EMAIL_RE.findall(html))
    return {e for e in raw if not is_junk_email(e)}


def scrape_email(website: str) -> str | None:
    """Try to find a public email on the homepage and /contact page."""
    pages_to_try = [website]

    contact_url = urljoin(website.rstrip("/") + "/", "contact")
    pages_to_try.append(contact_url)

    if not contact_url.endswith("/"):
        pages_to_try.append(contact_url + "/")

    all_emails: set[str] = set()

    for url in pages_to_try:
        try:
            resp = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT, allow_redirects=True)
            if resp.status_code != 200:
                continue

            all_emails.update(extract_emails_from_html(resp.text))

            soup = BeautifulSoup(resp.text, "html.parser")
            for link in soup.find_all("a", href=True):
                href = link["href"]
                if href.startswith("mailto:"):
                    addr = href.replace("mailto:", "").split("?")[0].strip()
                    if addr and not is_junk_email(addr):
                        all_emails.add(addr)

            if all_emails:
                break

        except requests.RequestException:
            continue

    return sorted(all_emails)[0] if all_emails else None


def run() -> None:
    seen_ids: set[str] = set()
    facilities: list[dict[str, Any]] = []

    for query in QUERIES:
        log.info("Searching: %s", query)
        results = text_search(query)

        for place in results:
            place_id = place.get("id", "")
            display_name = place.get("displayName", {})
            name = display_name.get("text", "") if isinstance(display_name, dict) else str(display_name)

            if place_id in seen_ids:
                continue
            seen_ids.add(place_id)

            if is_excluded(name):
                log.info("  Skipping chain: %s", name)
                continue

            website = place.get("websiteUri")
            facilities.append({"name": name, "website": website})

    log.info("Found %d independent facilities. Scraping emails...", len(facilities))

    leads: list[dict[str, str]] = []

    for fac in facilities:
        name = fac["name"]
        website = fac["website"]

        if not website:
            log.info("  %s — no website, skipping", name)
            continue

        log.info("  Scraping %s (%s)...", name, website)
        email = scrape_email(website)

        if email:
            leads.append({"Facility Name": name, "Email": email})
            log.info("    Found: %s", email)
        else:
            log.info("    No email found")

        time.sleep(0.5)

    with open(OUTPUT_FILE, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["Facility Name", "Email"])
        writer.writeheader()
        writer.writerows(leads)

    log.info("Done. %d leads with emails saved to %s", len(leads), OUTPUT_FILE)


if __name__ == "__main__":
    run()
