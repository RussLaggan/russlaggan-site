import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const SLUGS = {
  month: "8x228s0rtf2Ec1T5pn6J204",
} as const;

const SUCCESS = "https://www.russlaggan.com/thank-you?session_id={CHECKOUT_SESSION_ID}";
const CANCEL = "https://www.russlaggan.com/coaching";

const AI_LINKS = {
  ai: process.env.STRIPE_LINK_AI_DONE || "",
  "ai-month": process.env.STRIPE_LINK_AI_MONTH || "",
} as const;

function stripeLink() {
  return `https://buy.stripe.com/${SLUGS.month}`;
}

export async function GET(request: Request) {
  const plan = new URL(request.url).searchParams.get("plan");

  if (plan === "ai" || plan === "ai-month") {
    const url = AI_LINKS[plan];
    if (url.startsWith("https://")) {
      return NextResponse.redirect(url, 303);
    }
    const flag = plan === "ai" ? "ai" : "month";
    return NextResponse.redirect(`https://www.russlaggan.com/ai-done?checkout=${flag}#checkout`, 303);
  }

  // Upfront plan removed; fall back to the monthly 3-month coaching offer.
  if (plan !== "month" && plan !== "upfront" && plan !== null && plan !== "") {
    return NextResponse.redirect(CANCEL, 303);
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    // Payment Link path: the 3-payment end is enforced by the stripe-webhook schedule.
    return NextResponse.redirect(stripeLink(), 303);
  }

  const stripe = new Stripe(secret);
  const listed = await stripe.paymentLinks.list({ limit: 100 });
  const link = listed.data.find((item) => item.url.includes(SLUGS.month));
  if (!link) {
    // Payment Link path: the 3-payment end is enforced by the stripe-webhook schedule.
    return NextResponse.redirect(stripeLink(), 303);
  }

  try {
    await stripe.paymentLinks.update(link.id, {
      after_completion: {
        type: "redirect",
        redirect: { url: SUCCESS },
      },
    });
  } catch {
    // The checkout session below still sends the buyer to the confirmation page.
  }

  const lineItems = await stripe.paymentLinks.listLineItems(link.id, { limit: 10 });
  const items = lineItems.data.flatMap((item) => {
    const price = item.price;
    const priceId = typeof price === "string" ? price : price?.id;
    if (!priceId) return [];
    return [{ price: priceId, quantity: item.quantity || 1 }];
  });
  if (!items.length) {
    // Payment Link path: the 3-payment end is enforced by the stripe-webhook schedule.
    return NextResponse.redirect(link.url, 303);
  }

  const recurring = lineItems.data.some((item) => {
    const price = item.price;
    return typeof price !== "string" && Boolean(price?.recurring);
  });

  try {
    // Checkout Session subscription_data has no cancel_at; the 3-payment end
    // is enforced by the stripe-webhook subscription schedule (iterations: 3).
    const session = await stripe.checkout.sessions.create({
      mode: recurring ? "subscription" : "payment",
      line_items: items,
      success_url: SUCCESS,
      cancel_url: CANCEL,
      allow_promotion_codes: true,
    });
    if (session.url) {
      return NextResponse.redirect(session.url, 303);
    }
  } catch {
    // Payment Link path: the 3-payment end is enforced by the stripe-webhook schedule.
    return NextResponse.redirect(link.url, 303);
  }

  // Payment Link path: the 3-payment end is enforced by the stripe-webhook schedule.
  return NextResponse.redirect(link.url, 303);
}
