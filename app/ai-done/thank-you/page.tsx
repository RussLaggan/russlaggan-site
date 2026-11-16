import type { Metadata } from "next";
import Stripe from "stripe";
import { thankYouPlan, type CheckoutSessionLike } from "@/lib/ai-done-partnership";
import { PAGE, THANK_YOU } from "../copy";

export const metadata: Metadata = {
  title: `You're in | ${PAGE.title}`,
  description: "Your payment went through. We'll reach out within 1 business day to book your kickoff.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function isSessionId(value: string): boolean {
  return /^cs_[A-Za-z0-9_]+$/.test(value) && value.length <= 255;
}

async function loadThankYouSession(sessionId: string): Promise<CheckoutSessionLike | null> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret || !isSessionId(sessionId)) return null;
  const stripe = new Stripe(secret);
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["payment_intent"] });
    return {
      mode: session.mode,
      payment_status: session.payment_status,
      metadata: session.metadata,
      payment_intent: session.payment_intent,
    };
  } catch (error) {
    console.error("ai-done thank-you session lookup failed", error instanceof Error ? error.message : "error");
    return null;
  }
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; session_id?: string }>;
}) {
  const { plan, session_id: sessionId } = await searchParams;
  const session = sessionId ? await loadThankYouSession(sessionId) : null;
  const kind = thankYouPlan({ session, planParam: plan, hadSessionId: Boolean(sessionId) });
  const lede = kind === "partnership" ? THANK_YOU.partnership : kind === "buildout" ? THANK_YOU.buildout : THANK_YOU.next;
  return (
    <div className="field">
      <section className="section" style={{ paddingTop: "72px", paddingBottom: "96px" }}>
        <div className="wrap" style={{ maxWidth: "720px" }}>
          <p className="label">Payment received</p>
          <h1>{THANK_YOU.title}</h1>
          <p className="lede">{lede}</p>
          <div className="lattice-card" style={{ marginTop: "28px" }}>
            <h3>What happens next</h3>
            <ol style={{ margin: "8px 0 0", paddingLeft: "20px", color: "var(--muted)", lineHeight: 1.6 }}>
              <li>Watch your email for your Stripe receipt.</li>
              <li>{THANK_YOU.next}</li>
            </ol>
          </div>
          <p style={{ marginTop: "28px" }}>
            <a className="btn" href="/">
              Back to the site
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
