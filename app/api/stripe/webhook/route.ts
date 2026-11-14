import { NextResponse } from "next/server";
import Stripe from "stripe";
import { handleAiDoneStripeEvent } from "@/lib/ai-done-webhook";

export const runtime = "nodejs";

/**
 * AI Done webhook. Register this URL in Stripe for
 * checkout.session.completed, invoice.paid, and invoice.payment_failed.
 * Signature uses STRIPE_WEBHOOK_SECRET. A missing secret refuses the event
 * and does not affect checkout or the build.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error(
      "AI Done webhook: STRIPE_WEBHOOK_SECRET is not set. Refusing the event. Checkout is unaffected.",
    );
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET is not set" }, { status: 500 });
  }
  if (!secret) {
    console.error("AI Done webhook: STRIPE_SECRET_KEY is not set. Refusing the event. Checkout is unaffected.");
    return NextResponse.json({ error: "STRIPE_SECRET_KEY is not set" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  const stripe = new Stripe(secret);
  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    console.error("AI Done webhook signature failed");
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const handled = await handleAiDoneStripeEvent(stripe, event);
  if (handled) return handled;
  return NextResponse.json({ received: true });
}
