"""Google Places API (New) text search with pagination — shared by lead scripts."""

from __future__ import annotations

import logging
import time
from typing import Any

import requests

SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"

log = logging.getLogger(__name__)


def places_text_search(
    api_key: str,
    query: str,
    *,
    field_mask: str,
    timeout_sec: int = 15,
) -> list[dict[str, Any]]:
    """Run a paginated text search; returns raw ``places`` list items."""
    results: list[dict[str, Any]] = []
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": field_mask,
    }
    page_token: str | None = None

    while True:
        body: dict[str, Any] = {"textQuery": query, "pageSize": 20}
        if page_token:
            body["pageToken"] = page_token

        resp = requests.post(SEARCH_URL, json=body, headers=headers, timeout=timeout_sec)

        if resp.status_code != 200:
            log.error("Places search error %d: %s", resp.status_code, resp.text[:300])
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
