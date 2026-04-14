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

from dotenv import load_dotenv

from places_search import places_text_search

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
)
log = logging.getLogger(__name__)

GOOGLE_MAPS_API_KEY: str = os.environ["GOOGLE_MAPS_API_KEY"]

EXCLUDED_NAMES = ["public storage", "extra space"]

QUERIES = [
    "Self Storage in Maine",
    "Self Storage in New Hampshire",
]

OUTPUT_FILE = "leads.csv"

FIELD_MASK = "places.displayName,places.id,places.nationalPhoneNumber,places.websiteUri"


def is_excluded(name: str) -> bool:
    name_lower = name.lower()
    return any(exc in name_lower for exc in EXCLUDED_NAMES)


def run() -> None:
    seen_ids: set[str] = set()
    leads: list[dict[str, str | None]] = []

    for query in QUERIES:
        log.info("Searching: %s", query)
        results = places_text_search(
            GOOGLE_MAPS_API_KEY, query, field_mask=FIELD_MASK
        )

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
