"""
Seed the ``webhooks`` table with the Slack webhook from .env.

Run:
    python3 seed_webhooks.py
"""

from __future__ import annotations

import os

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL: str = os.environ["SUPABASE_URL"]
SUPABASE_KEY: str = os.environ["SUPABASE_KEY"]
SLACK_WEBHOOK_URL: str = os.environ["SLACK_WEBHOOK_URL"]

WEBHOOKS_TABLE = "webhooks"

WEBHOOKS = [
    {
        "client_name": "slack-price-tracker",
        "webhook_url": SLACK_WEBHOOK_URL,
        "is_active": True,
    },
]


def main() -> None:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    for hook in WEBHOOKS:
        existing = (
            supabase.table(WEBHOOKS_TABLE)
            .select("id")
            .eq("webhook_url", hook["webhook_url"])
            .limit(1)
            .execute()
        )
        if existing.data:
            print(f"  Webhook already exists: {hook['webhook_url']}")
            continue

        supabase.table(WEBHOOKS_TABLE).insert(hook).execute()
        print(f"  Inserted webhook for {hook['client_name']}")

    print("Done.")


if __name__ == "__main__":
    main()
