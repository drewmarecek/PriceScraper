"""
Draft cold emails with Gemini and save them as Gmail drafts (does not send).

Input: ``texas_leads.csv`` with columns ``Facility Name``, ``Email``.

Needs ``GEMINI_API_KEY`` in ``.env``, ``credentials.json`` (Gmail OAuth desktop
client from Google Cloud Console), and packages: ``google-api-python-client``,
``google-auth-oauthlib``, ``google-genai``.

Gmail: enable Gmail API; OAuth consent with scope
``https://www.googleapis.com/auth/gmail.compose``; create a Desktop OAuth client
and save as ``credentials.json``. First run opens a browser; ``token.json`` is
stored for later runs.

Run: ``python3 ai_mailroom.py``
"""

from __future__ import annotations

import base64
import csv
import logging
import os
import sys
import time
from email.mime.text import MIMEText

from dotenv import load_dotenv
from google import genai
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
)
log = logging.getLogger(__name__)

GEMINI_API_KEY: str = os.environ["GEMINI_API_KEY"]
LEADS_FILE = "texas_leads.csv"
SCOPES = ["https://www.googleapis.com/auth/gmail.compose"]
SENDER_EMAIL = "drewmarecek@gmail.com"

SYSTEM_PROMPT = """You are a concise B2B cold email writer for a self-storage pricing 
intelligence product called PriceRadar API. Write exactly 3 sentences. Be conversational, 
not salesy. No subject line — just the email body. Do not include a greeting line like 
"Hi [Name]" — start directly with the first sentence. Sign off with just:

Best,
Drew"""

EMAIL_SUBJECT = "Quick heads up on Extra Space pricing in your area"


def get_gmail_service():
    """Authenticate with Gmail API and return the service object."""
    creds = None

    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists("credentials.json"):
                log.error(
                    "credentials.json not found. See setup instructions in this file's docstring."
                )
                sys.exit(1)
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)

        with open("token.json", "w") as f:
            f.write(creds.to_json())

    return build("gmail", "v1", credentials=creds)


def generate_email_body(client: genai.Client, facility_name: str) -> str:
    """Use Gemini to draft a 3-sentence cold email."""
    user_prompt = (
        f"Write a cold email for the owner of '{facility_name}'. Use this angle: "
        f"I noticed you run {facility_name}. My tracking API just caught Extra Space "
        f"in your area aggressively dropping their 10x10 rates to $114. Would it be "
        f"helpful if I plugged your email into my alert feed for two weeks so you can "
        f"see if your promos are beating the national algorithms?"
    )

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=user_prompt,
        config=genai.types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            temperature=0.7,
            max_output_tokens=300,
        ),
    )

    return response.text.strip()


def create_draft(service, to_email: str, subject: str, body: str) -> str:
    """Create a Gmail draft (does NOT send). Returns the draft ID."""
    message = MIMEText(body)
    message["to"] = to_email
    message["from"] = SENDER_EMAIL
    message["subject"] = subject

    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    draft = service.users().drafts().create(
        userId="me",
        body={"message": {"raw": raw}},
    ).execute()

    return draft["id"]


def read_leads() -> list[dict[str, str]]:
    """Read leads from CSV. Expects columns: Facility Name, Email."""
    if not os.path.exists(LEADS_FILE):
        log.error("Leads file '%s' not found.", LEADS_FILE)
        sys.exit(1)

    with open(LEADS_FILE, newline="") as f:
        reader = csv.DictReader(f)
        leads = [row for row in reader if row.get("Email")]

    log.info("Loaded %d leads with email addresses from %s", len(leads), LEADS_FILE)
    return leads


def run() -> None:
    leads = read_leads()
    if not leads:
        log.info("No leads to process.")
        return

    log.info("Authenticating with Gmail API...")
    service = get_gmail_service()

    gemini_client = genai.Client(api_key=GEMINI_API_KEY)

    draft_count = 0

    for lead in leads:
        facility_name = lead["Facility Name"]
        email = lead["Email"]

        log.info("Drafting email for %s (%s)...", facility_name, email)

        body = generate_email_body(gemini_client, facility_name)
        draft_id = create_draft(service, email, EMAIL_SUBJECT, body)
        draft_count += 1

        log.info("  Draft created (id=%s)", draft_id)
        log.info("  Preview: %s", body[:80].replace("\n", " ") + "...")

        time.sleep(0.5)

    log.info(
        "Done. %d draft(s) saved to Gmail. Review them in your Drafts folder before sending.",
        draft_count,
    )


if __name__ == "__main__":
    try:
        run()
    except KeyboardInterrupt:
        log.info("Interrupted.")
        sys.exit(130)
