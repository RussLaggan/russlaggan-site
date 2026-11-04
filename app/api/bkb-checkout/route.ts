import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

// Best Known Brand 1-Month Buildout: one payment of $4,500.
// The price lives in Stripe (Laggan Holdings LLC). STRIPE_PRICE_BKB_BUILDOUT overrides the default.
const DEFAULT_PRICE = "price_1UWgXCKFIl1mC1gNnJ7IL9tO";
const PAGE = "/ai-done";

function back(origin: string, reason: string) {
  return NextResponse.redirect(`${origin}${PAGE}?checkout=${reason}#buildout`, 303);
}

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const secret = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_BKB_BUILDOUT || DEFAULT_PRICE;
  if (!secret) {
    console.error("bkb checkout missing configuration");
    return back(origin, "unavailable");
  }

  const stripe = new Stripe(secret);
  try {
    const price = await stripe.prices.retrieve(priceId);
    if (!price.active || price.type !== "one_time") {
      console.error("bkb checkout price is not an active one-time price");
      return back(origin, "unavailable");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: `${origin}${PAGE}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${PAGE}?checkout=cancelled#buildout`,
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
      customer_creation: "always",
      invoice_creation: { enabled: true },
      metadata: { program: "bkb_buildout_1mo" },
      payment_intent_data: { metadata: { program: "bkb_buildout_1mo" } },
      custom_text: {
        submit: {
          message: "One payment for AI Done: 1-Month AI Buildout. We'll reach out within 1 business day to book your kickoff.",
        },
      },
    });
    if (session.url) {
      return NextResponse.redirect(session.url, 303);
    }
  } catch (error) {
    console.error("bkb checkout failed", error instanceof Error ? error.message : "error");
  }

  return back(origin, "unavailable");
}
