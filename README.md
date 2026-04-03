# PriceRadar / AA Price Tracker

Monorepo for **PriceRadarAPI**—competitor self-storage pricing intelligence: a marketing site, a read API backed by Supabase, and Playwright-based scrapers that collect unit sizes and rates from competitor sites.

## Repository layout

| Path | Purpose |
|------|---------|
| **`v0-site/`** | Next.js (App Router) marketing site: hero, pricing, features, contact. Package name: `priceradarapi-site`. |
| **`api.py`** | FastAPI service: authenticated endpoints to query latest prices from Supabase. Run with `uvicorn`. |
| **`priceradar-scraper/scraper.py`** | Headless Chromium scraper: visual text + shadow DOM, JSON response capture, optional deep navigation to embed URLs. Writes to Supabase (`competitor_prices` by default). |
| **`scraper.py`** (repo root) | Legacy/alternate scraper used by `render.yaml` cron; keep in sync with deployment expectations. |
| **`ai_mailroom.py`**, **`lead_gen.py`**, **`houston_leads.py`** | Lead generation and outreach helpers (separate workflows). |
| **`seed_webhooks.py`** | Webhook seeding helpers. |
| **`render.yaml`** | Render.com blueprint: API web service + scheduled scraper job. |

## Prerequisites

- **Python 3.12+** (see `render.yaml` for pinned version on deploy)
- **Node.js 18+** for the Next.js app

## Environment variables

Create a **`.env`** in the repo root (see `.gitignore`—never commit secrets). Typical keys:

| Variable | Used by |
|----------|---------|
| `SUPABASE_URL`, `SUPABASE_KEY` (or anon/service key per script) | `api.py`, scrapers |
| `SUPABASE_SERVICE_KEY` | `priceradar-scraper` (service role for upserts) |
| `TARGET_URLS` | Comma-separated listing URLs for `priceradar-scraper` |
| `FIRECRAWL_API_KEY` | Firecrawl-based flows if used |
| `SLACK_WEBHOOK_URL` | Alerts (cron / integrations) |

For **`priceradar-scraper`**, you can use a dedicated `priceradar-scraper/.env` with the same keys; `python-dotenv` loads it when you run the script from that directory.

## Quick start

### Marketing site (`v0-site`)

```bash
cd v0-site
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### API (`api.py`)

```bash
pip install -r requirements.txt
uvicorn api:app --reload --port 8000
```

### Playwright scraper (`priceradar-scraper`)

The scraper depends on **`playwright`**, **`supabase`**, and **`python-dotenv`** (root `requirements.txt` includes Supabase and dotenv; add `playwright` if it is not listed yet).

```bash
pip install -r requirements.txt
pip install playwright   # if not already pinned in requirements.txt
playwright install chromium   # once per machine
cd priceradar-scraper
python3 scraper.py
```

Configure `TARGET_URLS` and Supabase credentials before expecting database writes.

## Deployment

- **Render:** `render.yaml` defines a Python web service for `api.py` and a cron job for the root `scraper.py`. Set env vars in the Render dashboard.
- **Frontend:** Deploy `v0-site` like any Next.js app (Vercel, Netlify, Node host, etc.).

## License

Private project; all rights reserved unless you add an explicit license.
