"""
Seed the Supabase `urls` table with SaaS pricing page URLs for testing.

Usage:
    source .venv/bin/activate
    python seed_urls.py
"""

import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

supabase = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_KEY"])

COMPETITOR_URLS = [
    "https://www.notion.com/pricing",
    "https://slack.com/pricing",
    "https://www.dropbox.com/plans",
    "https://trello.com/pricing",
    "https://1password.com/pricing",
]

for url in COMPETITOR_URLS:
    result = supabase.table("urls").upsert({"url": url}, on_conflict="url").execute()
    print(f"  Upserted: {url}")

print(f"\nDone — {len(COMPETITOR_URLS)} URLs seeded.")
