import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const SLUGS = {
  month: "8x25kE1vxcUw3vng416J200",
  upfront: "cNi9AU0rtbQs0jb8Bz6J201",
} as const;

const SUCCESS = "https://www.russlaggan.com/thank-you?session_id={CHECKOUT_SESSION_ID}";
const CANCEL = "https://www.russlaggan.com/coaching";

const AI_LINKS = {
  ai: process.env.STRIPE_LINK_AI_DONE || "",
  "ai-month": process.env.STRIPE_LINK_AI_MONTH || "",
} as const;

function stripeLink(plan: keyof typeof SLUGS) {
  return `https://buy.stripe.com/${SLUGS[plan]}`;
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

  if (plan !== "month" && plan !== "upfront") {
    return NextResponse.redirect(CANCEL, 303);
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.redirect(stripeLink(plan), 303);
  }

  const stripe = new Stripe(secret);
  const listed = await stripe.paymentLinks.list({ limit: 100 });
  const link = listed.data.find((item) => item.url.includes(SLUGS[plan]));
  if (!link) {
    return NextResponse.redirect(stripeLink(plan), 303);
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
    return NextResponse.redirect(link.url, 303);
  }

  const recurring = lineItems.data.some((item) => {
    const price = item.price;
    return typeof price !== "string" && Boolean(price?.recurring);
  });

  try {
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
    return NextResponse.redirect(link.url, 303);
  }

  return NextResponse.redirect(link.url, 303);
}
