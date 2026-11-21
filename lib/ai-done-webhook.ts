import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  BILLING_MODEL,
  PARTNERSHIP_OFFER,
  isPartnershipCheckout,
  isSetupThen12Checkout,
  partnershipScheduleUpdate,
  scheduleEndsPartnership,
  paymentMethodSupportsOffSession,
  setupCollectionFor,
  setupPlanFromMetadata,
  setupThen12BillingStart,
  setupThen12IdempotencyKey,
  setupThen12ScheduleCreateParams,
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

function attachedCustomerId(paymentMethod: Stripe.PaymentMethod): string | null {
  const customer = paymentMethod.customer;
  if (!customer) return null;
  return typeof customer === "string" ? customer : customer.id;
}

async function metadataMatchesSession(
  load: (startingAfter?: string) => Promise<{ data: Array<{ id: string; metadata: Stripe.Metadata | null }>; has_more: boolean }>,
  sessionId: string,
): Promise<boolean> {
  let startingAfter: string | undefined;
  for (let page = 0; page < 10; page += 1) {
    const listed = await load(startingAfter);
    if (listed.data.some((item) => item.metadata?.checkout_session === sessionId)) return true;
    if (!listed.has_more) return false;
    startingAfter = listed.data.at(-1)?.id;
    if (!startingAfter) return false;
  }
  return false;
}

async function setupThen12AlreadyScheduled(stripe: Stripe, customerId: string, sessionId: string): Promise<boolean> {
  const scheduleMatch = await metadataMatchesSession(async (startingAfter) => {
    const listed = await stripe.subscriptionSchedules.list({
      customer: customerId,
      limit: 100,
      starting_after: startingAfter,
    });
    return { data: listed.data, has_more: listed.has_more };
  }, sessionId);
  if (scheduleMatch) return true;
  return metadataMatchesSession(async (startingAfter) => {
    const listed = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 100,
      starting_after: startingAfter,
    });
    return { data: listed.data, has_more: listed.has_more };
  }, sessionId);
}

async function loadSetupPaymentIntent(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
): Promise<Stripe.PaymentIntent | null> {
  const paymentIntentId = subscriptionIdFrom(session.payment_intent);
  if (!paymentIntentId) return null;
  const expanded = typeof session.payment_intent === "object" ? session.payment_intent : null;
  if (
    expanded &&
    expanded.payment_method &&
    typeof expanded.payment_method === "object" &&
    expanded.latest_charge &&
    typeof expanded.latest_charge === "object"
  ) {
    return expanded;
  }
  return stripe.paymentIntents.retrieve(paymentIntentId, { expand: ["payment_method", "latest_charge"] });
}

async function setupPaidUnix(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
  paymentIntent: Stripe.PaymentIntent | null,
): Promise<number> {
  const charge = paymentIntent?.latest_charge;
  if (charge && typeof charge === "object") return charge.created;
  if (typeof charge === "string") {
    const loaded = await stripe.charges.retrieve(charge);
    return loaded.created;
  }
  return paymentIntent?.created || session.created;
}

/**
 * Attach a card, Link, bank, or Cash App method and make it the customer default.
 * saved is false when the method is missing, is Klarna or another one-time method,
 * or Stripe refuses to attach it. Callers still create the 12 invoices.
 */
async function resolveOffSessionPaymentMethod(
  stripe: Stripe,
  customerId: string,
  paymentIntent: Stripe.PaymentIntent | null,
): Promise<{ id: string | null; type: string | null; saved: boolean }> {
  const paymentMethod = paymentIntent?.payment_method;
  const paymentMethodId = typeof paymentMethod === "string" ? paymentMethod : paymentMethod?.id;
  if (!paymentMethodId) return { id: null, type: null, saved: false };
  let method: Stripe.PaymentMethod;
  try {
    method =
      paymentMethod && typeof paymentMethod !== "string"
        ? paymentMethod
        : await stripe.paymentMethods.retrieve(paymentMethodId);
  } catch (error) {
    console.error(
      `AI Done setup_then_12 could not read payment method ${paymentMethodId}`,
      error instanceof Error ? error.message : "error",
    );
    return { id: paymentMethodId, type: null, saved: false };
  }
  if (!paymentMethodSupportsOffSession(method.type)) return { id: method.id, type: method.type, saved: false };
  const attachedTo = attachedCustomerId(method);
  if (attachedTo && attachedTo !== customerId) return { id: method.id, type: method.type, saved: false };
  try {
    if (!attachedTo) await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
    await stripe.customers.update(customerId, { invoice_settings: { default_payment_method: paymentMethodId } });
  } catch (error) {
    console.error(
      `AI Done setup_then_12 could not save payment method ${paymentMethodId} type=${method.type} for off_session`,
      error instanceof Error ? error.message : "error",
    );
    return { id: method.id, type: method.type, saved: false };
  }
  return { id: method.id, type: method.type, saved: true };
}

function paymentMethodTypeOf(paymentIntent: Stripe.PaymentIntent | null): string | null {
  const paymentMethod = paymentIntent?.payment_method;
  if (!paymentMethod || typeof paymentMethod === "string") return null;
  return paymentMethod.type;
}

function paymentMethodIdOf(paymentIntent: Stripe.PaymentIntent | null): string | null {
  const paymentMethod = paymentIntent?.payment_method;
  if (!paymentMethod) return null;
  return typeof paymentMethod === "string" ? paymentMethod : paymentMethod.id;
}

async function handleSetupThen12Checkout(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
): Promise<NextResponse> {
  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true, skipped: true });
  }
  if (session.metadata?.program === "ai_done_buildout" && session.metadata.billing_model !== BILLING_MODEL) {
    return NextResponse.json({ received: true, skipped: true });
  }
  if (session.metadata?.billing_model && session.metadata.billing_model !== BILLING_MODEL) {
    return NextResponse.json({ received: true, skipped: true });
  }

  try {
    const paymentIntent = await loadSetupPaymentIntent(stripe, session);
    if (
      !isSetupThen12Checkout({
        mode: session.mode,
        payment_status: session.payment_status,
        metadata: session.metadata,
        payment_intent: paymentIntent,
      })
    ) {
      return NextResponse.json({ received: true, skipped: true });
    }

    const customerId = subscriptionIdFrom(session.customer);
    if (!customerId) {
      console.error(
        `AI Done setup_then_12 missing customer session=${session.id}. No subscription created. Stripe will not be asked to retry.`,
      );
      return NextResponse.json({ received: true, skipped: true, reason: "missing_customer" });
    }
    if (await setupThen12AlreadyScheduled(stripe, customerId, session.id)) {
      return NextResponse.json({ received: true, skipped: true, reason: "already_scheduled" });
    }

    const resolved = await resolveOffSessionPaymentMethod(stripe, customerId, paymentIntent);
    const collection = setupCollectionFor({
      paymentMethodType: resolved.type ?? paymentMethodTypeOf(paymentIntent),
      savedForOffSession: resolved.saved,
    });
    if (collection === "send_invoice") {
      console.error(
        `AI Done setup_then_12 payment method missing or not reusable for off_session session=${session.id} customer=${customerId} payment_method=${resolved.id ?? paymentMethodIdOf(paymentIntent) ?? "missing"} type=${resolved.type ?? paymentMethodTypeOf(paymentIntent) ?? "none"}. collection_fallback=send_invoice days_until_due=7`,
      );
    }

    const setupUnix = await setupPaidUnix(stripe, session, paymentIntent);
    const start = setupThen12BillingStart(setupUnix);
    const now = Math.floor(Date.now() / 1000);
    if (start <= now) {
      console.error(
        `AI Done setup_then_12 billing start ${start} is not in the future session=${session.id} customer=${customerId}. Not creating a backdated subscription.`,
      );
      return NextResponse.json({ received: true, skipped: true, reason: "start_in_past" });
    }

    await stripe.subscriptionSchedules.create(
      setupThen12ScheduleCreateParams({
        customerId,
        setupUnix,
        sessionId: session.id,
        plan: setupPlanFromMetadata(session.metadata, paymentIntent?.metadata),
        collection,
        paymentMethodId: resolved.saved ? resolved.id : null,
      }),
      { idempotencyKey: setupThen12IdempotencyKey(session.id) },
    );
    return NextResponse.json({ received: true, collection });
  } catch (error) {
    console.error("AI Done setup_then_12 failed", error instanceof Error ? error.message : "error");
    return NextResponse.json({ error: "schedule failed" }, { status: 500 });
  }
}

async function handleCheckoutCompleted(stripe: Stripe, session: Stripe.Checkout.Session) {
  if (session.mode === "payment") {
    return handleSetupThen12Checkout(stripe, session);
  }
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
    // ai_done_setup_12 ends from its own schedule. This guard is ai_done_12mo only.
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
  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
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
