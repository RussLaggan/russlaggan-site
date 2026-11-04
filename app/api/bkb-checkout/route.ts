import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

// AI Done checkout. Prices live in Stripe (Laggan Holdings LLC).
// buildout: Ai Done, one payment of $4,500. monthly: Ai Done Monthly, $497 a month, cancel anytime.
// STRIPE_PRICE_AI_DONE and STRIPE_PRICE_AI_DONE_MONTHLY override the defaults.
const PLANS = {
  buildout: {
    price: process.env.STRIPE_PRICE_AI_DONE || "price_1UXtntKFIl1mC1gNx9QJKWUy",
    recurring: false,
    program: "ai_done_buildout",
    anchor: "included",
    message: "One payment for AI Done: 1-Month AI Buildout. We'll reach out within 1 business day to book your kickoff.",
  },
  monthly: {
    price: process.env.STRIPE_PRICE_AI_DONE_MONTHLY || "price_1UXu3BKFIl1mC1gNgB4W6s3P",
    recurring: true,
    program: "ai_done_monthly",
    anchor: "monthly",
    message: "Ai Done Monthly: $497 a month, cancel anytime. We'll reach out within 1 business day to book your first session.",
  },
} as const;

type Plan = keyof typeof PLANS;
const PAGE = "/ai-done";

function back(origin: string, reason: string, anchor: string) {
  return NextResponse.redirect(`${origin}${PAGE}?checkout=${reason}#${anchor}`, 303);
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
  const plan: Plan = requested === "monthly" ? "monthly" : "buildout";
  const config = PLANS[plan];

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    console.error("ai-done checkout missing configuration");
    return back(origin, "unavailable", config.anchor);
  }

  const stripe = new Stripe(secret);
  try {
    const price = await stripe.prices.retrieve(config.price);
    const typeOk = config.recurring ? price.type === "recurring" : price.type === "one_time";
    if (!price.active || !typeOk) {
      console.error(`ai-done checkout price for ${plan} is not active or has the wrong type`);
      return back(origin, "unavailable", config.anchor);
    }

    const shared = {
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: `${origin}${PAGE}/thank-you?plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${PAGE}?checkout=cancelled#${config.anchor}`,
      billing_address_collection: "required" as const,
      phone_number_collection: { enabled: true },
      metadata: { program: config.program },
      custom_text: { submit: { message: config.message } },
    };

    const session = config.recurring
      ? await stripe.checkout.sessions.create({
          ...shared,
          mode: "subscription",
          subscription_data: { metadata: { program: config.program } },
        })
      : await stripe.checkout.sessions.create({
          ...shared,
          mode: "payment",
          customer_creation: "always",
          invoice_creation: { enabled: true },
          payment_intent_data: { metadata: { program: config.program } },
        });

    if (session.url) {
      return NextResponse.redirect(session.url, 303);
    }
  } catch (error) {
    console.error("ai-done checkout failed", error instanceof Error ? error.message : "error");
  }

  return back(origin, "unavailable", config.anchor);
}
