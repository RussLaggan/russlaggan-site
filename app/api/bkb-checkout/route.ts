import { NextResponse } from "next/server";
import Stripe from "stripe";
import { CHECKOUT_COPY } from "@/app/ai-done/copy";
import {
  PARTNERSHIP_MONTHLY_PRICE,
  PARTNERSHIP_OFFER,
  PARTNERSHIP_SETUP_PRICE,
  PARTNERSHIP_TERM_MONTHS,
  parseAiDonePlan,
} from "@/lib/ai-done-partnership";

export const runtime = "nodejs";

// AI Done checkout. Prices live in Stripe (Laggan Holdings LLC, acct_1ULkwBKFIl1mC1gN).
// partnership: $2,500 on invoice 1 ($497 recurring + $2,003 once), then $497 for months 2-12.
// buildout: one payment of $4,500. STRIPE_PRICE_AI_DONE overrides the buildout price.
// plan=monthly (cancel anytime) is retired and is not sold.
const BUILDOUT_PRICE = process.env.STRIPE_PRICE_AI_DONE || "price_1UXtntKFIl1mC1gNx9QJKWUy";
const PAGE = "/ai-done";

function back(origin: string, reason: string, anchor: string) {
  return NextResponse.redirect(`${origin}${PAGE}?checkout=${reason}#${anchor}`, 303);
}

async function activePrice(stripe: Stripe, priceId: string, recurring: boolean) {
  const price = await stripe.prices.retrieve(priceId);
  const typeOk = recurring ? price.type === "recurring" : price.type === "one_time";
  if (!price.active || !typeOk) return null;
  return price;
}

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  let requested = "buildout";
  try {
    const form = await request.formData();
    requested = String(form.get("plan") || "buildout");
  } catch {
    // No form body: treat as the buildout.
  }

  const plan = parseAiDonePlan(requested);
  if (plan === "rejected") {
    console.error("ai-done checkout rejected plan", requested);
    return back(origin, "unavailable", "options");
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    console.error("ai-done checkout missing configuration");
    return back(origin, "unavailable", plan);
  }

  const stripe = new Stripe(secret);
  try {
    if (plan === "partnership") {
      const monthly = await activePrice(stripe, PARTNERSHIP_MONTHLY_PRICE, true);
      const setup = await activePrice(stripe, PARTNERSHIP_SETUP_PRICE, false);
      if (!monthly || !setup) {
        console.error("ai-done partnership price is not active or has the wrong type");
        return back(origin, "unavailable", "partnership");
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          { price: monthly.id, quantity: 1 },
          { price: setup.id, quantity: 1 },
        ],
        subscription_data: {
          description: CHECKOUT_COPY.partnership.description,
          metadata: { offer: PARTNERSHIP_OFFER, term_months: PARTNERSHIP_TERM_MONTHS },
        },
        metadata: { offer: PARTNERSHIP_OFFER, term_months: PARTNERSHIP_TERM_MONTHS, plan: "partnership" },
        billing_address_collection: "auto",
        phone_number_collection: { enabled: true },
        // FOUNDER code: $1,500 off first invoice, partnership only
        allow_promotion_codes: true,
        custom_text: { submit: { message: CHECKOUT_COPY.partnership.submit } },
        success_url: `${origin}${PAGE}/thank-you?plan=partnership&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}${PAGE}?checkout=cancelled#partnership`,
      });

      if (session.url) return NextResponse.redirect(session.url, 303);
    } else {
      const price = await activePrice(stripe, BUILDOUT_PRICE, false);
      if (!price) {
        console.error("ai-done checkout price for buildout is not active or has the wrong type");
        return back(origin, "unavailable", "buildout");
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{ price: price.id, quantity: 1 }],
        success_url: `${origin}${PAGE}/thank-you?plan=buildout&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}${PAGE}?checkout=cancelled#buildout`,
        billing_address_collection: "required",
        phone_number_collection: { enabled: true },
        metadata: { program: "ai_done_buildout" },
        custom_text: { submit: { message: CHECKOUT_COPY.buildout.submit } },
        customer_creation: "always",
        invoice_creation: { enabled: true },
        payment_intent_data: { metadata: { program: "ai_done_buildout" } },
      });

      if (session.url) return NextResponse.redirect(session.url, 303);
    }
  } catch (error) {
    console.error("ai-done checkout failed", error instanceof Error ? error.message : "error");
  }

  return back(origin, "unavailable", plan);
}
