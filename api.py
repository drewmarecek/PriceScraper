"""
FastAPI application that serves the latest competitor prices by industry.

Run:
    uvicorn api:app --reload --port 8000
"""

from __future__ import annotations

import os
from datetime import datetime

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Security
from fastapi.security import APIKeyHeader
from pydantic import BaseModel
from supabase import Client, create_client

load_dotenv()

SUPABASE_URL: str = os.environ["SUPABASE_URL"]
SUPABASE_KEY: str = os.environ["SUPABASE_KEY"]

app = FastAPI(
    title="Price Tracker API",
    version="1.0.0",
    description="Query the latest SaaS competitor prices by industry.",
)

# ---------------------------------------------------------------------------
# Supabase client (re-used across requests)
# ---------------------------------------------------------------------------

_supabase: Client | None = None


def get_supabase() -> Client:
    global _supabase
    if _supabase is None:
        _supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _supabase


# ---------------------------------------------------------------------------
# API-key authentication
# ---------------------------------------------------------------------------

API_KEY_HEADER = APIKeyHeader(name="X-API-Key")


def verify_api_key(
    api_key: str = Security(API_KEY_HEADER),
    supabase: Client = Depends(get_supabase),
) -> dict:
    """Validate the key against the ``api_keys`` table and return the row."""
    result = (
        supabase.table("api_keys")
        .select("id, client_name")
        .eq("key", api_key)
        .eq("is_active", True)
        .limit(1)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=401, detail="Invalid or inactive API key")
    return result.data[0]


# ---------------------------------------------------------------------------
# Response models
# ---------------------------------------------------------------------------


class CompetitorPrice(BaseModel):
    company: str
    domain: str
    price: float
    scraped_at: str


class PriceResponse(BaseModel):
    industry: str
    count: int
    prices: list[CompetitorPrice]


class WebhookCreate(BaseModel):
    client_name: str
    webhook_url: str


class WebhookOut(BaseModel):
    id: int
    client_name: str
    webhook_url: str
    is_active: bool


# ---------------------------------------------------------------------------
# Endpoint
# ---------------------------------------------------------------------------


@app.get(
    "/api/v1/prices/{industry}",
    response_model=PriceResponse,
    summary="Latest prices by industry",
)
def get_prices_by_industry(
    industry: str,
    caller: dict = Depends(verify_api_key),
    supabase: Client = Depends(get_supabase),
) -> PriceResponse:
    """
    Return the most recent scraped price for every company in the given
    industry.  The ``industry`` path parameter is matched case-insensitively
    against ``Companies.Industry``.
    """
    companies = (
        supabase.table("Companies")
        .select("id, Name, Domain, Industry")
        .ilike("Industry", industry)
        .execute()
    )

    if not companies.data:
        raise HTTPException(
            status_code=404,
            detail=f"No companies found for industry '{industry}'",
        )

    prices: list[CompetitorPrice] = []

    for company in companies.data:
        latest = (
            supabase.table("Price_History")
            .select("Scraped_Price, Date")
            .eq("Company_ID", company["id"])
            .order("Date", desc=True)
            .limit(1)
            .execute()
        )
        if latest.data:
            row = latest.data[0]
            prices.append(
                CompetitorPrice(
                    company=company["Name"],
                    domain=company["Domain"],
                    price=row["Scraped_Price"],
                    scraped_at=row["Date"],
                )
            )

    return PriceResponse(
        industry=industry,
        count=len(prices),
        prices=prices,
    )


# ---------------------------------------------------------------------------
# Webhook management
# ---------------------------------------------------------------------------


@app.get(
    "/api/v1/webhooks",
    response_model=list[WebhookOut],
    summary="List all webhooks",
)
def list_webhooks(
    caller: dict = Depends(verify_api_key),
    supabase: Client = Depends(get_supabase),
) -> list[WebhookOut]:
    """Return every registered webhook."""
    result = (
        supabase.table("webhooks")
        .select("id, client_name, webhook_url, is_active")
        .execute()
    )
    return [WebhookOut(**row) for row in result.data]


@app.post(
    "/api/v1/webhooks",
    response_model=WebhookOut,
    status_code=201,
    summary="Register a webhook",
)
def create_webhook(
    body: WebhookCreate,
    caller: dict = Depends(verify_api_key),
    supabase: Client = Depends(get_supabase),
) -> WebhookOut:
    """Register a new webhook URL to receive price-change notifications."""
    result = (
        supabase.table("webhooks")
        .insert({"client_name": body.client_name, "webhook_url": body.webhook_url})
        .execute()
    )
    return WebhookOut(**result.data[0])


@app.delete(
    "/api/v1/webhooks/{webhook_id}",
    status_code=204,
    summary="Delete a webhook",
)
def delete_webhook(
    webhook_id: int,
    caller: dict = Depends(verify_api_key),
    supabase: Client = Depends(get_supabase),
) -> None:
    """Remove a webhook registration."""
    result = (
        supabase.table("webhooks")
        .delete()
        .eq("id", webhook_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Webhook not found")
