import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const DEFAULT_PRICE = "price_1UN3qHKFIl1mC1gNrbJRX1UN";

function priceId() {
  return process.env.COACHING_MONTHLY_PRICE_ID || DEFAULT_PRICE;
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) {
    console.error("stripe webhook missing configuration");
    return NextResponse.json({ error: "not configured" }, { status: 500 });
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
    console.error("stripe webhook signature failed");
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  if (event.type !== "customer.subscription.created") {
    return NextResponse.json({ received: true });
  }

  const subscription = event.data.object as Stripe.Subscription;
  const monthly = priceId();
  const matches = subscription.items.data.some((item) => item.price?.id === monthly);
  if (!matches || subscription.schedule) {
    return NextResponse.json({ received: true, skipped: true });
  }

  try {
    const created = await stripe.subscriptionSchedules.create({
      from_subscription: subscription.id,
    });
    const start = created.phases[0]?.start_date;
    if (!start) {
      console.error("stripe schedule missing start");
      return NextResponse.json({ error: "schedule failed" }, { status: 500 });
    }
    await stripe.subscriptionSchedules.update(created.id, {
      end_behavior: "cancel",
      phases: [
        {
          items: [{ price: monthly, quantity: 1 }],
          start_date: start,
          iterations: 6,
        },
      ],
    });
  } catch (error) {
    console.error("stripe schedule failed", error instanceof Error ? error.message : "error");
    return NextResponse.json({ error: "schedule failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
