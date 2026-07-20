import { NextResponse } from "next/server";

type LeadPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export async function POST(req: Request) {
  const webhookUrl = process.env.DISCORD_LEAD_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  try {
    const { firstName, lastName, email, phone } =
      (await req.json()) as LeadPayload;

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🚨 **NEW PARTIAL LEAD CAPTURED** 🚨\n• **Name:** ${firstName ?? ""} ${lastName ?? ""}\n• **Email:** ${email ?? ""}\n• **Phone:** ${phone ?? ""}`,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
