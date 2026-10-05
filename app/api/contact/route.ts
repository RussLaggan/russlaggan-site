import { NextResponse } from "next/server";

const TO = "russ@russlaggan.com";
const CC = "brett@brettkmoore.com";

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

  const res = await fetch(`https://formsubmit.co/ajax/${TO}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: `${first} ${last}`,
      email,
      phone,
      interest,
      message,
      page,
      _subject: `Russ Laggan site: ${interest} from ${first} ${last}`,
      _replyto: email,
      _cc: CC,
      _template: "table",
      _captcha: "false",
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    return NextResponse.json({ error: "Mail did not send" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
