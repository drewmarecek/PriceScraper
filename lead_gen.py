"""
Lead generation script for self-storage facilities.

Searches Google Maps (Places API New) for storage facilities in Maine and
New Hampshire, extracts business name, website, and phone number, and
saves to CSV. Excludes national chains (Public Storage, Extra Space).

Requires a Google Maps API key with Places API (New) enabled.
Add GOOGLE_MAPS_API_KEY to your .env file.

Run:
    python3 lead_gen.py
"""

from __future__ import annotations

import csv
import logging
import os
import time
from typing import Any

import requests
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
)
log = logging.getLogger(__name__)

GOOGLE_MAPS_API_KEY: str = os.environ["GOOGLE_MAPS_API_KEY"]

SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"

EXCLUDED_NAMES = ["public storage", "extra space"]

QUERIES = [
    "Self Storage in Maine",
    "Self Storage in New Hampshire",
]

OUTPUT_FILE = "leads.csv"

FIELD_MASK = "places.displayName,places.id,places.nationalPhoneNumber,places.websiteUri"


def text_search(query: str) -> list[dict[str, Any]]:
    """Run a Places (New) Text Search, paginating through all results."""
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
        places = data.get("places", [])
        results.extend(places)
        log.info("  Fetched %d results so far for '%s'", len(results), query)

        page_token = data.get("nextPageToken")
        if not page_token:
            break

        time.sleep(1)

    return results


def is_excluded(name: str) -> bool:
    name_lower = name.lower()
    return any(exc in name_lower for exc in EXCLUDED_NAMES)


def run() -> None:
    seen_ids: set[str] = set()
    leads: list[dict[str, str | None]] = []

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
                log.info("  Skipping excluded: %s", name)
                continue

            website = place.get("websiteUri")
            phone = place.get("nationalPhoneNumber")

            leads.append({
                "name": name,
                "website": website,
                "phone": phone,
            })
            log.info("  %s — %s — %s", name, phone or "no phone", website or "no website")

    with open(OUTPUT_FILE, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "website", "phone"])
        writer.writeheader()
        writer.writerows(leads)

    log.info("Done. %d leads saved to %s", len(leads), OUTPUT_FILE)


if __name__ == "__main__":
    run()
