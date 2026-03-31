"""
Headless self-storage price scraper using:
- Playwright (async)
- Supabase Python client for persistence

How it works:
1) Loads SUPABASE_URL and SUPABASE_SERVICE_KEY from .env
2) Opens each competitor URL in headless Chromium
3) Waits for network idle and a short additional settle delay
4) Extracts unit-size + price pairs from rendered visual text
5) Inserts/upserts rows into Supabase table: competitor_prices

This file is intentionally modular so you can tune heuristics over time.
"""

from __future__ import annotations

import asyncio
import json
import os
import re
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional, Tuple, Set
from urllib.parse import urljoin

from dotenv import load_dotenv
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
from supabase import Client, create_client


# -----------------------------
# Config (safe defaults)
# -----------------------------

# Unit sizes you care about most. Add/remove as needed.
TARGET_SIZES = {"5x5", "5x10", "8x10", "10x5", "10x10", "10x15", "10x20", "10x25", "10x30"}

# Regex that catches size formats like:
# 10x10, 10 x 10, 10' x 10', 10 ft x 10 ft, 10 by 10, 10×10, etc.
SIZE_PATTERN = re.compile(
    r"\b(\d{1,2})\s*(?:ft\.?|feet)?\s*['\u2019]?\s*(?:[xX×]|by)\s*(\d{1,2})\s*(?:ft\.?|feet)?\s*['\u2019]?\b",
    re.IGNORECASE,
)

# Regex that catches common USD price strings: $99, $99.00, $54
PRICE_PATTERN = re.compile(r"\$\s*(\d{1,4}(?:\.\d{1,2})?)\b")
# Fallback numeric candidate when "$" is omitted near pricing keywords.
GENERIC_NUMBER_PATTERN = re.compile(r"\b(\d{2,4}(?:\.\d{1,2})?)\b")

# Playwright timing controls
PAGE_TIMEOUT_MS = 45_000
POST_LOAD_DELAY_MS = 2_500
UPSERT_CONFLICT_COLUMNS = "competitor_url,unit_size,scraped_at"
SLIDING_LOOK_AHEAD_LINES = 8  # tight window: avoid fee/disclosure lines below the card
# Rent band: floor excludes typical admin ($25–29); cap excludes garbage.
RENT_PRICE_MIN = 30.0
RENT_PRICE_MAX = 1000.0
# Full-page blob fallback: chars after a size match to search for $ / rates
BLOB_WINDOW_CHARS = 420
# Post-scroll wait for third-party iframe widgets (Storable / SiteLink, etc.)
POST_SCROLL_IFRAME_WAIT_MS = 6_000
# Deep-navigate at most this many sandboxed widget iframes per listing URL.
MAX_EMBED_IFRAME_DEEP_NAV = 5
# iframe[src] must match one of these (substring, case-insensitive) to open in a new tab.
IFRAME_SRC_EMBED_KEYWORDS: Tuple[str, ...] = (
    "sitelink",
    "storable",
    "storage",
    "units",
    "pages",
)
JSON_DIAG_SNIPPET_CHARS = 1500

# Response URL substrings that often indicate inventory / pricing APIs.
JSON_URL_HINT_KEYWORDS: Tuple[str, ...] = (
    "unit",
    "inventory",
    "pricing",
    "available",
    "api",
)

# JSON XHR/Fetch: if body contains these (case-insensitive), run heuristic extraction on raw text.
JSON_CAPTURE_KEYWORDS: Tuple[str, ...] = (
    "price",
    "rate",
    "size",
    "10x10",
    "10 x 10",
    "monthly",
    "rent",
    "unit",
    "width",
    "length",
    "dimension",
)

# Fallback for layouts that omit "$" but include pricing context. Do NOT use \\b? after \\b (invalid in re).
PRICE_CONTEXT_PATTERN = re.compile(
    r"\b(?:rate|web|online|special|promo|month|monthly|rent|per\s+mo|now|starting|admin)\b|/mo\b|/month\b",
    re.IGNORECASE,
)

# Fallback list if TARGET_URLS env var is not set.
# Keep this empty so the script fails fast instead of scraping placeholders.
DEFAULT_TARGET_URLS: List[str] = []


def utc_now_iso() -> str:
    """Return current UTC timestamp as ISO-8601 string."""
    return datetime.now(timezone.utc).isoformat()


def normalize_size(raw_size: str) -> str:
    """
    Normalize unit size strings into canonical 'NxM' form.
    Example: '10 x 10' -> '10x10'
    """
    m = SIZE_PATTERN.search(raw_size)
    if not m:
        return raw_size.strip().lower()
    return f"{m.group(1)}x{m.group(2)}"


def parse_price_to_float(raw_price: str) -> Optional[float]:
    """
    Convert price text to float when possible.
    Returns None if no numeric price found.
    """
    m = PRICE_PATTERN.search(raw_price)
    if not m:
        return None
    try:
        return float(m.group(1))
    except ValueError:
        return None


def _build_row(competitor_url: str, unit_size: str, price: float, scraped_at: str) -> Dict[str, Any]:
    """Build a normalized DB row payload."""
    return {
        "competitor_url": competitor_url,
        "unit_size": unit_size,
        "price": price,
        "scraped_at": scraped_at,
    }


def _first_valid_rent_price(block_text: str) -> Optional[float]:
    """
    First price in reading order that looks like monthly rent (not min across alternatives).
    Prefers explicit $ amounts in textual order, then context-backed plain numbers.
    """
    normalized = block_text.replace(",", "")

    for m in PRICE_PATTERN.finditer(normalized):
        try:
            p = float(m.group(1))
        except ValueError:
            continue
        if RENT_PRICE_MIN <= p < RENT_PRICE_MAX:
            return p

    if PRICE_CONTEXT_PATTERN.search(normalized):
        for m in GENERIC_NUMBER_PATTERN.finditer(normalized):
            try:
                p = float(m.group(1))
            except ValueError:
                continue
            if RENT_PRICE_MIN <= p < RENT_PRICE_MAX:
                return p

    return None


def extract_rows_from_text_lines_sliding_window(
    competitor_url: str,
    scraped_at: str,
    lines: List[str],
    look_ahead: int = 8,
) -> List[Dict[str, Any]]:
    """
    Sliding-window heuristic over visual text lines.
    - If a line has a size, scan that line + next N lines for prices
    - Use the first valid rent in reading order (avoids min() picking admin/insurance fees)
    - Advance index past window once a pair is captured
    """
    rows: List[Dict[str, Any]] = []
    seen = set()
    i = 0
    while i < len(lines):
        line = lines[i]
        size_match = SIZE_PATTERN.search(line)
        if not size_match:
            i += 1
            continue

        unit_size = normalize_size(size_match.group(0))
        if TARGET_SIZES and unit_size not in TARGET_SIZES:
            i += 1
            continue

        window_end = min(len(lines), i + look_ahead + 1)
        window_text = " ".join(lines[i:window_end])
        price = _first_valid_rent_price(window_text)
        if price is None:
            i += 1
            continue

        dedupe_key = (competitor_url, unit_size, price)
        if dedupe_key not in seen:
            seen.add(dedupe_key)
            rows.append(_build_row(competitor_url, unit_size, price, scraped_at))

        # Advance past the matched window to reduce double counting.
        i = window_end

    return rows


def extract_rows_from_full_text_blob(
    competitor_url: str,
    scraped_at: str,
    blob: str,
    window_chars: int = BLOB_WINDOW_CHARS,
) -> List[Dict[str, Any]]:
    """
    Second pass: same line layout sometimes merges units into one line or odd breaks.
    For each size match, scan the following window_chars for prices.
    """
    if not blob:
        return []

    normalized = " ".join(blob.replace("\u00a0", " ").split())
    rows: List[Dict[str, Any]] = []
    seen = set()

    for size_match in SIZE_PATTERN.finditer(normalized):
        unit_size = normalize_size(size_match.group(0))
        if TARGET_SIZES and unit_size not in TARGET_SIZES:
            continue
        start = size_match.end()
        chunk = normalized[start : start + window_chars]
        price = _first_valid_rent_price(chunk)
        if price is None:
            continue
        dedupe_key = (competitor_url, unit_size, price)
        if dedupe_key in seen:
            continue
        seen.add(dedupe_key)
        rows.append(_build_row(competitor_url, unit_size, price, scraped_at))

    return rows


# JS: body.innerText does not include open ShadowRoot content. Walk hosts and append shadow innerText.
COLLECT_VISUAL_TEXT_WITH_SHADOW_JS = """
() => {
  const parts = [];
  if (document.body) {
    parts.push(document.body.innerText || "");
  }
  function walk(node) {
    if (!node || node.nodeType !== 1) return;
    if (node.shadowRoot) {
      try {
        const t = node.shadowRoot.innerText || "";
        if (t && t.trim()) parts.push(t);
      } catch (e) {}
      walk(node.shadowRoot);
    }
    const children = node.children;
    if (!children) return;
    for (let i = 0; i < children.length; i++) {
      walk(children[i]);
    }
  }
  if (document.body) walk(document.body);
  return parts.filter(Boolean).join("\\n");
}
"""


def dedupe_rows_for_upsert(rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Deduplicate to one row per (competitor_url, unit_size) before DB write.
    If multiple rows exist for the same key, keep the higher price (prefer rent over fee noise).
    """
    by_key: Dict[Tuple[str, str], Dict[str, Any]] = {}
    for row in rows:
        key = (str(row["competitor_url"]), str(row["unit_size"]))
        current = by_key.get(key)
        if current is None or float(row["price"]) > float(current["price"]):
            by_key[key] = row
    return list(by_key.values())


def _lines_from_visual_text(text: str) -> List[str]:
    """Split rendered visual text into cleaned non-empty lines."""
    lines = []
    for raw in text.splitlines():
        clean = " ".join(raw.replace("\u00a0", " ").split())
        if clean:
            lines.append(clean)
    return lines


def _norm_json_key(key: str) -> str:
    return re.sub(r"[\s_-]+", "", key.lower())


def _flatten_json_to_lines(parsed: Any) -> List[str]:
    """
    Recursively flatten JSON into lines the sliding-window extractor can match:
    - width + length (or depth) pairs -> "10x10"
    - price-like numeric fields -> "$129" / "$129.00"
    - other numbers and size-like strings emitted as plain lines
    """
    lines: List[str] = []

    width_aliases: Set[str] = {
        "width",
        "unitwidth",
        "unitwidthft",
        "sizewidth",
        "storagewidth",
        "w",
    }
    length_aliases: Set[str] = {
        "length",
        "depth",
        "unitlength",
        "unitdepth",
        "sizelength",
        "storagelength",
        "l",
        "d",
    }

    def looks_price_key(k: str) -> bool:
        nk = _norm_json_key(k)
        hints = (
            "price",
            "rate",
            "rent",
            "cost",
            "amount",
            "monthly",
            "deposit",
            "fee",
            "promo",
            "web",
            "driveup",
            "climate",
        )
        return any(h in nk for h in hints)

    def as_number(v: Any) -> Optional[float]:
        if isinstance(v, bool) or v is None:
            return None
        if isinstance(v, (int, float)):
            return float(v)
        if isinstance(v, str):
            v = v.strip()
            if not v:
                return None
            m = re.search(r"-?\d+(?:\.\d+)?", v.replace(",", ""))
            if m:
                try:
                    return float(m.group(0))
                except ValueError:
                    return None
        return None

    def fmt_money(n: float) -> str:
        if abs(n - round(n)) < 1e-9:
            return str(int(round(n)))
        return format(n, "g")

    def dict_dims_to_line(d: Dict[str, Any]) -> Optional[str]:
        w_obj = l_obj = None
        for k, v in d.items():
            nk = _norm_json_key(k)
            if nk in width_aliases:
                w_obj = as_number(v)
            if nk in length_aliases:
                l_obj = as_number(v)
        if w_obj is not None and l_obj is not None and w_obj > 0 and l_obj > 0:
            return f"{int(round(w_obj))}x{int(round(l_obj))}"
        return None

    def walk(obj: Any) -> None:
        if isinstance(obj, dict):
            dim_line = dict_dims_to_line(obj)
            if dim_line:
                lines.append(dim_line)
            dim_key_norms = width_aliases | length_aliases if dim_line else set()

            for k, v in obj.items():
                if isinstance(v, (dict, list)):
                    walk(v)
                    continue
                num = as_number(v)
                if num is not None:
                    nk = _norm_json_key(k)
                    if dim_line and nk in dim_key_norms:
                        continue
                    if looks_price_key(k):
                        lines.append(f"${fmt_money(num)}")
                    else:
                        lines.append(fmt_money(num))
                    continue
                if isinstance(v, str) and v.strip() and SIZE_PATTERN.search(v):
                    lines.append(v.strip())
        elif isinstance(obj, list):
            for item in obj:
                walk(item)

    walk(parsed)
    return lines


def json_to_heuristic_text(raw: str) -> str:
    """Parse JSON, flatten to synthetic lines for regex extractors; fallback to raw / pretty JSON."""
    raw = raw.strip()
    if not raw:
        return ""
    try:
        parsed = json.loads(raw)
    except (json.JSONDecodeError, TypeError, ValueError):
        return raw

    flat_lines = _flatten_json_to_lines(parsed)
    if flat_lines:
        return "\n".join(flat_lines)

    try:
        return json.dumps(parsed, ensure_ascii=False, indent=2)
    except (TypeError, ValueError):
        return raw


def _should_capture_json_body(text: str) -> bool:
    low = text.lower()
    return any(k.lower() in low for k in JSON_CAPTURE_KEYWORDS)


def _response_url_suggests_inventory(response_url: str) -> bool:
    u = (response_url or "").lower()
    return any(k in u for k in JSON_URL_HINT_KEYWORDS)


def _is_inventory_like_json(parsed: Any) -> bool:
    """List of dicts, or list with enough rows to treat as inventory."""
    if isinstance(parsed, list):
        if len(parsed) > 3:
            return True
        if len(parsed) >= 1 and all(isinstance(x, dict) for x in parsed):
            return True
    return False


SCROLL_LAZY_LOAD_JS = """
async () => {
  const step = 400;
  const delay = 120;
  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
  const total = document.body.scrollHeight || document.documentElement.scrollHeight || 5000;
  for (let y = 0; y < total; y += step) {
    window.scrollTo({ top: y, behavior: "smooth" });
    await sleep(delay);
  }
  window.scrollTo({ top: total, behavior: "smooth" });
}
"""


def _resolve_iframe_src(base_url: str, src: str) -> Optional[str]:
    src = (src or "").strip()
    if not src or src.startswith(("data:", "javascript:", "about:", "#")):
        return None
    return urljoin(base_url, src)


async def _discover_embed_iframe_urls(page, listing_base_url: str) -> List[str]:
    """Find iframe src values that look like Storable/SiteLink/storage widgets."""
    srcs: List[str] = await page.evaluate(
        """(keys) => {
          const out = [];
          for (const el of document.querySelectorAll('iframe[src]')) {
            const s = (el.getAttribute('src') || '').trim();
            if (!s) continue;
            const low = s.toLowerCase();
            if (keys.some(k => low.includes(k))) out.push(s);
          }
          return [...new Set(out)];
        }""",
        list(IFRAME_SRC_EMBED_KEYWORDS),
    )
    resolved: List[str] = []
    base = page.url or listing_base_url
    for s in srcs:
        abs_url = _resolve_iframe_src(base, s)
        if abs_url and abs_url not in resolved:
            resolved.append(abs_url)
    return resolved


def _make_json_capture_handler(captured_json_bodies: List[str]):
    """Build a page.on('response') handler that fills captured_json_bodies."""

    async def on_response(response) -> None:
        try:
            ct = (response.headers.get("content-type") or "").lower()
            if "json" not in ct:
                return
            rt = response.request.resource_type
            if rt in ("image", "font", "media", "websocket"):
                return
            text = await response.text()
            if not text or len(text) > 2_000_000:
                return

            parsed: Optional[Any] = None
            try:
                parsed = json.loads(text)
            except (json.JSONDecodeError, TypeError, ValueError):
                parsed = None

            resp_url = response.url
            capture = False
            if parsed is not None:
                if _should_capture_json_body(text):
                    capture = True
                elif _response_url_suggests_inventory(resp_url):
                    capture = True
                elif _is_inventory_like_json(parsed):
                    capture = True
            elif _should_capture_json_body(text):
                capture = True

            if capture:
                captured_json_bodies.append(text)
        except Exception:
            pass

    return on_response


async def _scroll_for_lazy_load(page) -> None:
    await page.evaluate(SCROLL_LAZY_LOAD_JS)
    await page.wait_for_timeout(POST_SCROLL_IFRAME_WAIT_MS)


async def _gather_dom_text_lines(page) -> Tuple[List[str], int, int]:
    """Collect visual text lines from the main document and any same-origin frames."""
    all_lines: List[str] = []
    main_lines = 0
    frame_lines = 0
    try:
        main_visual_text = await page.evaluate(COLLECT_VISUAL_TEXT_WITH_SHADOW_JS)
        page_lines = _lines_from_visual_text(main_visual_text)
        all_lines.extend(page_lines)
        main_lines = len(page_lines)
    except Exception as exc:
        print(f"[WARN] Main-page visual text extraction failed: {exc}")

    for frame in page.frames:
        if frame == page.main_frame:
            continue
        try:
            frame_visual_text = await frame.evaluate(COLLECT_VISUAL_TEXT_WITH_SHADOW_JS)
            lines = _lines_from_visual_text(frame_visual_text)
            all_lines.extend(lines)
            frame_lines += len(lines)
        except Exception:
            pass

    return all_lines, main_lines, frame_lines


def _rows_from_dom_and_json(
    competitor_url: str,
    scraped_at: str,
    all_lines: List[str],
    captured_json_bodies: List[str],
    json_diag_prefix: str = "",
) -> List[Dict[str, Any]]:
    merged_blob = "\n".join(all_lines)

    rows_sliding = extract_rows_from_text_lines_sliding_window(
        competitor_url=competitor_url,
        scraped_at=scraped_at,
        lines=all_lines,
        look_ahead=SLIDING_LOOK_AHEAD_LINES,
    )
    rows_blob = extract_rows_from_full_text_blob(competitor_url, scraped_at, merged_blob)

    rows_api: List[Dict[str, Any]] = []
    for idx, raw_json in enumerate(captured_json_bodies):
        blob = json_to_heuristic_text(raw_json)
        payload_rows: List[Dict[str, Any]] = []
        if blob:
            lines_api = _lines_from_visual_text(blob)
            payload_rows.extend(
                extract_rows_from_text_lines_sliding_window(
                    competitor_url=competitor_url,
                    scraped_at=scraped_at,
                    lines=lines_api,
                    look_ahead=SLIDING_LOOK_AHEAD_LINES,
                )
            )
            payload_rows.extend(extract_rows_from_full_text_blob(competitor_url, scraped_at, blob))
        rows_api.extend(payload_rows)

        if not payload_rows:
            label = f"{json_diag_prefix} capture[{idx}]" if json_diag_prefix else f"capture[{idx}]"
            snippet = raw_json[:JSON_DIAG_SNIPPET_CHARS]
            print(f"[JSON][DIAG] {label}: 0 rows from payload ({len(raw_json)} chars). First {JSON_DIAG_SNIPPET_CHARS} chars:\n{snippet}\n---")

    return dedupe_rows_for_upsert(rows_sliding + rows_blob + rows_api)


async def _scrape_embed_page(
    context,
    embed_url: str,
    competitor_url: str,
    scraped_at: str,
) -> Tuple[List[Dict[str, Any]], int, int, int]:
    """
    Open a dedicated tab to a sandboxed widget URL; same DOM + JSON pipeline as main page.
    """
    captured: List[str] = []
    handler = _make_json_capture_handler(captured)
    child = await context.new_page()
    child.on("response", handler)
    main_lines = frame_lines = 0
    try:
        await child.goto(embed_url, wait_until="networkidle", timeout=PAGE_TIMEOUT_MS)
        await child.wait_for_timeout(POST_LOAD_DELAY_MS)
        await _scroll_for_lazy_load(child)
        all_lines, main_lines, frame_lines = await _gather_dom_text_lines(child)
        rows = _rows_from_dom_and_json(
            competitor_url,
            scraped_at,
            all_lines,
            captured,
            json_diag_prefix=f"embed<{embed_url[:120]}>",
        )
        return rows, main_lines, frame_lines, len(captured)
    finally:
        try:
            child.remove_listener("response", handler)
        except Exception:
            pass
        await child.close()


def build_supabase_client() -> Client:
    """Initialize Supabase client from environment variables."""
    load_dotenv()

    supabase_url = os.getenv("SUPABASE_URL")
    supabase_service_key = os.getenv("SUPABASE_SERVICE_KEY")

    if not supabase_url or not supabase_service_key:
        raise ValueError(
            "Missing SUPABASE_URL or SUPABASE_SERVICE_KEY. "
            "Create a .env file and set both values."
        )

    return create_client(supabase_url, supabase_service_key)


def resolve_target_urls() -> List[str]:
    """Resolve target URLs from env var or fallback defaults."""
    env_target_urls = os.getenv("TARGET_URLS", "")
    if env_target_urls.strip():
        urls = [u.strip() for u in env_target_urls.split(",") if u.strip()]
        if urls:
            return urls
    return DEFAULT_TARGET_URLS


async def scrape_single_url(page, url: str) -> List[Dict[str, Any]]:
    """
    Visit a single URL and extract price rows.
    Returns empty list on failures to keep overall run resilient.
    """
    captured_json_bodies: List[str] = []
    on_response = _make_json_capture_handler(captured_json_bodies)

    page.on("response", on_response)
    try:
        # Some sites use anti-bot/loaders. networkidle + settle delay often helps.
        await page.goto(url, wait_until="networkidle", timeout=PAGE_TIMEOUT_MS)
        await page.wait_for_timeout(POST_LOAD_DELAY_MS)

        await _scroll_for_lazy_load(page)

        scraped_at = utc_now_iso()
        all_lines, main_lines, frame_lines = await _gather_dom_text_lines(page)

        embed_urls = await _discover_embed_iframe_urls(page, url)

        rows = _rows_from_dom_and_json(
            url,
            scraped_at,
            all_lines,
            captured_json_bodies,
            json_diag_prefix="main",
        )

        embed_json_total = 0
        for embed_url in embed_urls[:MAX_EMBED_IFRAME_DEEP_NAV]:
            try:
                erows, _eml, _efr, ejc = await _scrape_embed_page(
                    page.context, embed_url, url, scraped_at
                )
                embed_json_total += ejc
                rows = dedupe_rows_for_upsert(rows + erows)
            except Exception as exc:
                print(f"[WARN] Deep iframe scrape failed {embed_url}: {exc}")

        print(
            "[SCRAPE] "
            f"{url} -> extracted={len(rows)} "
            f"(main_lines={main_lines}, "
            f"frame_lines={frame_lines}, "
            f"total_lines={len(all_lines)}, "
            f"json_captures={len(captured_json_bodies)}, "
            f"embed_navs={min(len(embed_urls), MAX_EMBED_IFRAME_DEEP_NAV)}, "
            f"embed_json_captures={embed_json_total})"
        )
        return rows

    except PlaywrightTimeoutError:
        print(f"[ERROR] Timeout while loading: {url}")
        return []
    except Exception as exc:
        print(f"[ERROR] Failed scraping {url}: {exc}")
        return []
    finally:
        try:
            page.remove_listener("response", on_response)
        except Exception:
            pass


def upsert_rows(supabase: Client, rows: List[Dict[str, Any]]) -> None:
    """
    Upsert rows into `competitor_prices`.

    Notes:
    - For true upsert behavior, your table should have a unique constraint
      aligned with the on_conflict columns below (or use insert instead).
    - If your schema does not support this upsert yet, switch to `.insert(rows)`.
    """
    rows = dedupe_rows_for_upsert(rows)

    if not rows:
        print("[DB] No rows to write.")
        return

    try:
        # Adjust on_conflict to match your unique index in Supabase.
        # Common choice: (competitor_url, unit_size, scraped_at)
        response = (
            supabase.table("competitor_prices")
            .upsert(rows, on_conflict=UPSERT_CONFLICT_COLUMNS)
            .execute()
        )
        inserted_count = len(response.data) if getattr(response, "data", None) else 0
        print(f"[DB] Upsert completed. Rows returned: {inserted_count}")
    except Exception as exc:
        print(f"[DB][WARN] Upsert failed ({exc}). Trying plain insert...")
        try:
            response = supabase.table("competitor_prices").insert(rows).execute()
            inserted_count = len(response.data) if getattr(response, "data", None) else 0
            print(f"[DB] Insert completed. Rows returned: {inserted_count}")
        except Exception as insert_exc:
            print(f"[DB][ERROR] Insert also failed: {insert_exc}")


async def run() -> None:
    """Main async entrypoint."""
    # Load .env once at startup so all env lookups see the same values.
    load_dotenv()

    try:
        supabase = build_supabase_client()
    except Exception as exc:
        print(f"[BOOT][ERROR] Supabase init failed: {exc}")
        return

    urls = resolve_target_urls()
    if not urls:
        print("[BOOT][ERROR] No target URLs configured.")
        return

    all_rows: List[Dict[str, Any]] = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            # Realistic UA can help bypass lightweight bot checks.
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/122.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1440, "height": 900},
        )

        page = await context.new_page()

        for url in urls:
            # Per-URL try/except happens inside scrape_single_url,
            # so one bad site does not kill the run.
            rows = await scrape_single_url(page, url)
            all_rows.extend(rows)

        await context.close()
        await browser.close()

    print(f"[RUN] Total extracted rows across all URLs: {len(all_rows)}")
    upsert_rows(supabase, all_rows)


if __name__ == "__main__":
    asyncio.run(run())

