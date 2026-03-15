"""
One-time setup: create the api_keys table and seed a test key,
then backfill Industry on existing Companies rows.

Usage:
    source .venv/bin/activate
    python seed_api.py
"""

import os
import secrets

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

supabase = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_KEY"])

# ------------------------------------------------------------------
# Backfill Industry on existing companies
# ------------------------------------------------------------------
INDUSTRY_MAP = {
    "notion.com": "Productivity",
    "slack.com": "Productivity",
    "dropbox.com": "Cloud Storage",
    "trello.com": "Productivity",
    "1password.com": "Security",
}

for domain, industry in INDUSTRY_MAP.items():
    supabase.table("Companies").update({"Industry": industry}).eq("Domain", domain).execute()
    print(f"  Set {domain} → {industry}")

# ------------------------------------------------------------------
# Seed a test API key
# ------------------------------------------------------------------
test_key = f"pt_test_{secrets.token_hex(16)}"

result = (
    supabase.table("api_keys")
    .insert({"key": test_key, "client_name": "dev-local", "is_active": True})
    .execute()
)
print(f"\n  Created API key for 'dev-local': {test_key}")
print("  Store this key — you'll need it in the X-API-Key header.\n")
