import { NextResponse } from "next/server";
import Stripe from "stripe";
import { CHECKOUT_COPY } from "@/app/ai-done/copy";
import {
  BILLING_MODEL,
  MONTHLY_PRICE,
  SETUP_OFFER,
  SETUP_PLAN_STANDARD,
  SETUP_PRICE_STANDARD,
  parseAiDonePlan,
} from "@/lib/ai-done-partnership";

export const runtime = "nodejs";

// AI Done checkout. Prices live in Stripe (Laggan Holdings LLC, acct_1ULkwBKFIl1mC1gN).
// partnership: $2,500 setup today, then the webhook starts 12 charges of $497 one calendar month later.
// AI_DONE_SETUP_PRICE_STANDARD and AI_DONE_MONTHLY_PRICE override those live price IDs.
// buildout: one payment of $4,500. STRIPE_PRICE_AI_DONE overrides the buildout price.
// plan=monthly (cancel anytime) is retired and is not sold.
// Payment methods stay Dashboard-managed.
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
      const setup = await activePrice(stripe, SETUP_PRICE_STANDARD, false);
      const monthly = await activePrice(stripe, MONTHLY_PRICE, true);
      if (!setup || !monthly) {
        console.error("ai-done partnership price is not active or has the wrong type");
        return back(origin, "unavailable", "partnership");
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{ price: setup.id, quantity: 1 }],
        customer_creation: "always",
        payment_intent_data: {
          setup_future_usage: "off_session",
          description: CHECKOUT_COPY.partnership.description,
          metadata: { offer: SETUP_OFFER, plan: SETUP_PLAN_STANDARD, billing_model: BILLING_MODEL },
        },
        metadata: { offer: SETUP_OFFER, plan: SETUP_PLAN_STANDARD, billing_model: BILLING_MODEL },
        billing_address_collection: "auto",
        phone_number_collection: { enabled: true },
        allow_promotion_codes: false,
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
