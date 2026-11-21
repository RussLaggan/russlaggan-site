import { NextResponse } from "next/server";
import Stripe from "stripe";
import { MONTHLY_PRICE, SETUP_PRICE_FOUNDER } from "@/lib/ai-done-partnership";
import { createFounderRateLimiter, founderCheckoutResult } from "@/lib/ai-done-founder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limiter = createFounderRateLimiter();

export async function POST(request: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const result = await founderCheckoutResult(request, {
    secretWord: process.env.AI_DONE_FOUNDER_WORD,
    stripeSecret,
    priceId: SETUP_PRICE_FOUNDER,
    monthlyPriceId: MONTHLY_PRICE,
    limiter,
    createStripe: stripeSecret ? () => new Stripe(stripeSecret) : undefined,
  });
  const response = NextResponse.redirect(result.url, 303);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
