import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || String(body.company || "").trim()) {
    return NextResponse.json({ ok: true });
  }

  const first = String(body.first || "").trim();
  const last = String(body.last || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const interest = String(body.interest || "").trim();
  const message = String(body.message || "").trim();
  const page = String(body.page || "").trim();

  if (!first || !last || !email || !interest || !email.includes("@")) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const hook = process.env.CONTACT_WEBHOOK_URL;
  if (!hook) {
    return NextResponse.json({ error: "Mailbox is not connected" }, { status: 503 });
  }

  const res = await fetch(hook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ first, last, email, phone, interest, message, page }),
    redirect: "follow",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) {
    return NextResponse.json({ error: "Mail did not send" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
