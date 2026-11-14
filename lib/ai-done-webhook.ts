import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  PARTNERSHIP_OFFER,
  isPartnershipCheckout,
  partnershipScheduleUpdate,
  scheduleEndsPartnership,
  shouldCancelPartnership,
  subscriptionIdFrom,
  subscriptionIdFromInvoice,
} from "./ai-done-partnership";

function scheduleIdOf(schedule: string | Stripe.SubscriptionSchedule | null): string | null {
  return subscriptionIdFrom(schedule);
}

async function loadSchedule(
  stripe: Stripe,
  schedule: string | Stripe.SubscriptionSchedule,
): Promise<Stripe.SubscriptionSchedule> {
  if (typeof schedule === "string") return stripe.subscriptionSchedules.retrieve(schedule);
  return schedule;
}

/**
 * Attach a 12-month canceling schedule once.
 * A schedule that already ends the partnership is left alone.
 * A schedule created on an earlier attempt that never received the 12-month update is completed.
 */
export async function ensurePartnershipSchedule(stripe: Stripe, subscriptionId: string): Promise<void> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  if (subscription.metadata?.offer !== PARTNERSHIP_OFFER) {
    throw new Error("AI Done subscription missing offer metadata");
  }

  if (subscription.schedule) {
    const existing = await loadSchedule(stripe, subscription.schedule);
    if (scheduleEndsPartnership(existing)) return;
    const start = existing.phases[0]?.start_date;
    if (!start) throw new Error("AI Done schedule missing start_date");
    await stripe.subscriptionSchedules.update(existing.id, partnershipScheduleUpdate(start));
    return;
  }

  let created: Stripe.SubscriptionSchedule;
  try {
    created = await stripe.subscriptionSchedules.create(
      { from_subscription: subscription.id },
      { idempotencyKey: `ai_done_12mo_schedule_${subscription.id}` },
    );
  } catch (error) {
    const again = await stripe.subscriptions.retrieve(subscription.id);
    const existingId = scheduleIdOf(again.schedule);
    if (!existingId) throw error;
    const existing = await stripe.subscriptionSchedules.retrieve(existingId);
    if (scheduleEndsPartnership(existing)) return;
    const start = existing.phases[0]?.start_date;
    if (!start) throw new Error("AI Done schedule missing start_date");
    await stripe.subscriptionSchedules.update(existing.id, partnershipScheduleUpdate(start));
    return;
  }

  if (scheduleEndsPartnership(created)) return;
  const start = created.phases[0]?.start_date;
  if (!start) throw new Error("AI Done schedule missing start_date");
  await stripe.subscriptionSchedules.update(created.id, partnershipScheduleUpdate(start));
}

async function handleCheckoutCompleted(stripe: Stripe, session: Stripe.Checkout.Session) {
  if (!isPartnershipCheckout(session)) {
    return NextResponse.json({ received: true, skipped: true });
  }
  const subscriptionId = subscriptionIdFrom(session.subscription);
  if (!subscriptionId) {
    console.error("AI Done checkout.session.completed missing subscription");
    return NextResponse.json({ error: "missing subscription" }, { status: 500 });
  }
  try {
    await ensurePartnershipSchedule(stripe, subscriptionId);
  } catch (error) {
    console.error("AI Done schedule failed", error instanceof Error ? error.message : "error");
    return NextResponse.json({ error: "schedule failed" }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}

async function handleInvoicePaid(stripe: Stripe, invoice: Stripe.Invoice) {
  const subscriptionId = subscriptionIdFromInvoice(invoice);
  if (!subscriptionId) return NextResponse.json({ received: true, skipped: true });

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (subscription.metadata?.offer !== PARTNERSHIP_OFFER) {
      return NextResponse.json({ received: true, skipped: true });
    }
    const paid = await stripe.invoices.list({ subscription: subscriptionId, status: "paid", limit: 100 });
    const listed = paid.has_more ? 100 : paid.data.length;
    const alreadyListed = Boolean(invoice.id && paid.data.some((item) => item.id === invoice.id));
    const paidInvoices = !paid.has_more && invoice.status === "paid" && !alreadyListed ? listed + 1 : listed;
    if (
      !shouldCancelPartnership({
        offer: subscription.metadata.offer,
        hasSchedule: Boolean(subscription.schedule),
        paidInvoices,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      })
    ) {
      return NextResponse.json({ received: true, skipped: true });
    }
    await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
  } catch (error) {
    console.error("AI Done invoice.paid guard failed", error instanceof Error ? error.message : "error");
    return NextResponse.json({ error: "invoice guard failed" }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}

function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = subscriptionIdFromInvoice(invoice);
  console.error(
    `AI Done invoice.payment_failed invoice=${invoice.id ?? "unknown"} subscription=${subscriptionId ?? "none"}`,
  );
  return NextResponse.json({ received: true });
}

/** Returns a response for AI Done events, or null when this event belongs to another handler. */
export async function handleAiDoneStripeEvent(
  stripe: Stripe,
  event: Stripe.Event,
): Promise<NextResponse | null> {
  if (event.type === "checkout.session.completed") {
    return handleCheckoutCompleted(stripe, event.data.object);
  }
  if (event.type === "invoice.paid") {
    return handleInvoicePaid(stripe, event.data.object);
  }
  if (event.type === "invoice.payment_failed") {
    return handleInvoicePaymentFailed(event.data.object);
  }
  return null;
}
