import type Stripe from "stripe";

/** Live prices on acct_1ULkwBKFIl1mC1gN. The $2,003 price is invoice 1 only and must not be added to the schedule. */
export const PARTNERSHIP_MONTHLY_PRICE = "price_1Ubn9NKFIl1mC1gN2MjMJYND";
export const PARTNERSHIP_SETUP_PRICE = "price_1Ubn9QKFIl1mC1gNZ0n8mlrI";
export const PARTNERSHIP_OFFER = "ai_done_12mo";
export const PARTNERSHIP_TERM_MONTHS = "12";
export const PARTNERSHIP_TERM_COUNT = 12;

/**
 * Setup fee today, then 6 monthly charges starting one calendar month later.
 * Live price IDs are the defaults. A Vercel Preview with test keys sets
 * AI_DONE_SETUP_PRICE_STANDARD, AI_DONE_SETUP_PRICE_FOUNDER, and AI_DONE_MONTHLY_PRICE.
 * Legacy ai_done_12mo prices above stay fixed so existing subscribers are unchanged.
 */
export function priceIdFromEnv(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export const SETUP_PRICE_STANDARD = priceIdFromEnv(
  process.env.AI_DONE_SETUP_PRICE_STANDARD,
  "price_1UcExSKFIl1mC1gNjQd42CUN",
);
export const SETUP_PRICE_FOUNDER = priceIdFromEnv(
  process.env.AI_DONE_SETUP_PRICE_FOUNDER,
  "price_1UcExTKFIl1mC1gNY71eFIuJ",
);
export const MONTHLY_PRICE = priceIdFromEnv(
  process.env.AI_DONE_MONTHLY_PRICE,
  "price_1Ubn9NKFIl1mC1gN2MjMJYND",
);
export const LEGACY_SETUP_OFFER = "ai_done_setup_12";
export const LEGACY_BILLING_MODEL = "setup_then_12";
export const SETUP_OFFER = "ai_done_setup_6";
export const BILLING_MODEL = "setup_then_6";
export const MONTHLY_PAYMENTS = 6;
export const SETUP_PLAN_STANDARD = "standard";
export const SETUP_PLAN_FOUNDER = "founder";

export type SetupPlan = typeof SETUP_PLAN_STANDARD | typeof SETUP_PLAN_FOUNDER;
export type SetupCollection = "charge_automatically" | "send_invoice";

/** Card, Link, bank debit, and Cash App can be charged later when the method is actually saved. */
const OFF_SESSION_PAYMENT_METHOD_TYPES = new Set([
  "card",
  "link",
  "cashapp",
  "us_bank_account",
  "sepa_debit",
  "acss_debit",
  "bacs_debit",
  "au_becs_debit",
  "nz_bank_account",
]);

export type AiDonePlan = "partnership" | "buildout";

/** Empty stays the one-time buildout. plan=monthly is the retired cancel-anytime offer. */
export function parseAiDonePlan(value: string): AiDonePlan | "rejected" {
  if (value === "partnership") return "partnership";
  if (value === "buildout" || value === "") return "buildout";
  return "rejected";
}

export function isPartnershipCheckout(session: {
  mode: string | null;
  metadata: Stripe.Metadata | null;
}): boolean {
  return session.mode === "subscription" && session.metadata?.offer === PARTNERSHIP_OFFER;
}

type PhaseLike = {
  items: Array<{ price: string | { id: string }; quantity?: number | null }>;
  iterations?: number | null;
  duration?: { interval: string; interval_count?: number | null } | null;
};

export function phasePriceIds(phase: PhaseLike): string[] {
  return phase.items.map((item) => (typeof item.price === "string" ? item.price : item.price.id));
}

export function phaseIsTwelveMonthly(phase: PhaseLike): boolean {
  const prices = phasePriceIds(phase);
  const onlyMonthly = prices.length === 1 && prices[0] === PARTNERSHIP_MONTHLY_PRICE;
  const twelveIterations = phase.iterations === PARTNERSHIP_TERM_COUNT;
  const twelveMonths =
    phase.duration?.interval === "month" && phase.duration.interval_count === PARTNERSHIP_TERM_COUNT;
  return onlyMonthly && (twelveIterations || twelveMonths);
}

export function scheduleEndsPartnership(schedule: {
  end_behavior: string;
  phases: PhaseLike[];
}): boolean {
  return schedule.end_behavior === "cancel" && schedule.phases.some(phaseIsTwelveMonthly);
}

/**
 * SDK 18 / API 2025-08-27.basil supports phase duration and marks iterations as deprecated.
 * Six months from the phase start. The $2,003 setup price is not a phase item.
 */
export function partnershipScheduleUpdate(startDate: number): Stripe.SubscriptionScheduleUpdateParams {
  return {
    end_behavior: "cancel",
    proration_behavior: "none",
    metadata: {
      offer: PARTNERSHIP_OFFER,
      term_months: PARTNERSHIP_TERM_MONTHS,
      plan: "partnership",
    },
    phases: [
      {
        start_date: startDate,
        items: [{ price: PARTNERSHIP_MONTHLY_PRICE, quantity: 1 }],
        duration: { interval: "month", interval_count: PARTNERSHIP_TERM_COUNT },
        metadata: { offer: PARTNERSHIP_OFFER, term_months: PARTNERSHIP_TERM_MONTHS },
      },
    ],
  };
}

/**
 * Legacy ai_done_12mo only. The setup_then_6 (and leftover setup_then_12) schedule
 * already ends after the paid invoices, so this guard must not cancel those subscriptions early.
 */
export function shouldCancelPartnership(input: {
  offer: string | null | undefined;
  hasSchedule: boolean;
  paidInvoices: number;
  cancelAtPeriodEnd: boolean;
}): boolean {
  return (
    input.offer === PARTNERSHIP_OFFER &&
    !input.hasSchedule &&
    input.paidInvoices >= PARTNERSHIP_TERM_COUNT &&
    !input.cancelAtPeriodEnd
  );
}

export function subscriptionIdFrom(value: string | { id: string } | null | undefined): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

export function subscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const parent = invoice.parent;
  if (parent?.type !== "subscription_details") return null;
  return subscriptionIdFrom(parent.subscription_details?.subscription);
}

export type CheckoutSessionLike = {
  mode: string | null;
  payment_status?: string | null;
  metadata: Stripe.Metadata | null;
  payment_intent?: string | { metadata?: Stripe.Metadata | null } | null;
};

export function billingModelOf(session: {
  metadata: Stripe.Metadata | null;
  payment_intent?: CheckoutSessionLike["payment_intent"];
}): string | null {
  if (session.metadata?.billing_model) return session.metadata.billing_model;
  const paymentIntent = session.payment_intent;
  if (paymentIntent && typeof paymentIntent !== "string") return paymentIntent.metadata?.billing_model ?? null;
  return null;
}

function setupPlanOf(session: {
  metadata: Stripe.Metadata | null;
  payment_intent?: CheckoutSessionLike["payment_intent"];
}): string | null {
  if (session.metadata?.plan) return session.metadata.plan;
  const paymentIntent = session.payment_intent;
  if (paymentIntent && typeof paymentIntent !== "string") return paymentIntent.metadata?.plan ?? null;
  return null;
}

/** Founder Payment Links store plan on the PaymentIntent when the session metadata is empty. */
export function isKnownSetupBillingModel(model: string | null): boolean {
  return model === BILLING_MODEL || model === LEGACY_BILLING_MODEL;
}

export function isFounderSetupThankYou(session: CheckoutSessionLike): boolean {
  return isKnownSetupBillingModel(billingModelOf(session)) && setupPlanOf(session) === SETUP_PLAN_FOUNDER;
}

/**
 * Paid payment-mode checkout for the setup fee.
 * Founder Payment Links do not copy link metadata onto the session.
 * payment_intent_data.metadata is on the PaymentIntent, so that counts too.
 */
export function isSetupThen12Checkout(session: CheckoutSessionLike): boolean {
  return session.mode === "payment" && session.payment_status === "paid" && isKnownSetupBillingModel(billingModelOf(session));
}

export function setupPlanFromMetadata(
  sessionMetadata: Stripe.Metadata | null | undefined,
  paymentMetadata: Stripe.Metadata | null | undefined,
): SetupPlan {
  const plan = sessionMetadata?.plan || paymentMetadata?.plan;
  return plan === SETUP_PLAN_FOUNDER ? SETUP_PLAN_FOUNDER : SETUP_PLAN_STANDARD;
}

export function paymentMethodSupportsOffSession(type: string | null | undefined): boolean {
  return Boolean(type && OFF_SESSION_PAYMENT_METHOD_TYPES.has(type));
}

/** Reusable saved methods charge automatically. Klarna and anything we could not save get emailed invoices. */
export function setupCollectionFor(input: {
  paymentMethodType: string | null | undefined;
  savedForOffSession: boolean;
}): SetupCollection {
  if (input.savedForOffSession && paymentMethodSupportsOffSession(input.paymentMethodType)) {
    return "charge_automatically";
  }
  return "send_invoice";
}

export function setupThen12IdempotencyKey(sessionId: string): string {
  return `setup12-${sessionId}`;
}

/** Same calendar day next month, clamped to the last day when that month is shorter. Stripe bills in UTC. */
export function addCalendarMonths(unixSeconds: number, months: number): number {
  const date = new Date(unixSeconds * 1000);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  const targetIndex = month + months;
  const targetYear = year + Math.floor(targetIndex / 12);
  const targetMonth = ((targetIndex % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  const targetDay = Math.min(day, lastDay);
  return Math.floor(Date.UTC(targetYear, targetMonth, targetDay, hours, minutes, seconds) / 1000);
}

export function setupThen12BillingStart(setupUnix: number): number {
  return addCalendarMonths(setupUnix, 1);
}

/** Invoice n (1-based) is created at the start of each monthly period. There is no 13th timestamp. */
export function setupThen12InvoiceTimes(setupUnix: number): number[] {
  const start = setupThen12BillingStart(setupUnix);
  return Array.from({ length: MONTHLY_PAYMENTS }, (_, index) => addCalendarMonths(start, index));
}

/** End of the 6th prepaid month. The phase stops here, so invoice 7 is never opened. */
export function setupThen12PhaseEnd(setupUnix: number): number {
  return addCalendarMonths(setupThen12BillingStart(setupUnix), MONTHLY_PAYMENTS);
}

export type SetupCheckoutDisposition =
  | { action: "skip" }
  | { action: "six" }
  | {
      action: "twelve";
      payments: 12;
      billingModel: typeof LEGACY_BILLING_MODEL;
      offer: typeof LEGACY_SETUP_OFFER;
      plan: SetupPlan;
    };

/**
 * setup_then_12, standard or founder, is 12 full monthly charges.
 * setup_then_6 stays on MONTHLY_PAYMENTS. A buildout payment is not a setup.
 */
export function setupCheckoutDisposition(metadata: {
  billing_model?: string | null;
  plan?: string | null;
  program?: string | null;
} | null | undefined): SetupCheckoutDisposition {
  const model = metadata?.billing_model;
  if (metadata?.program === "ai_done_buildout" && model !== BILLING_MODEL) return { action: "skip" };
  if (
    model === LEGACY_BILLING_MODEL &&
    (metadata?.plan === SETUP_PLAN_STANDARD || metadata?.plan === SETUP_PLAN_FOUNDER)
  ) {
    return {
      action: "twelve",
      payments: 12,
      billingModel: LEGACY_BILLING_MODEL,
      offer: LEGACY_SETUP_OFFER,
      plan: metadata.plan === SETUP_PLAN_FOUNDER ? SETUP_PLAN_FOUNDER : SETUP_PLAN_STANDARD,
    };
  }
  if (model && model !== BILLING_MODEL) return { action: "skip" };
  return { action: "six" };
}

export function setupThen12Metadata(input: {
  sessionId: string;
  plan: SetupPlan;
  collection: SetupCollection;
  offer?: string;
  billingModel?: string;
}): Stripe.MetadataParam {
  return {
    offer: input.offer || SETUP_OFFER,
    plan: input.plan,
    billing_model: input.billingModel || BILLING_MODEL,
    checkout_session: input.sessionId,
    ...(input.collection === "send_invoice" ? { collection_fallback: "send_invoice" } : {}),
  };
}

/**
 * Six $497 invoices, the first one calendar month after the setup payment.
 *
 * Choice: a subscription schedule with start_date = setup time + 1 calendar month,
 * one phase, items [{ price: MONTHLY_PRICE }], duration 6 months,
 * billing_cycle_anchor phase_start, proration_behavior none, end_behavior cancel.
 * No trial period is used.
 *
 * Math, for a price that bills every month:
 * - The schedule stays not_started until start_date, so nothing is invoiced today.
 * - Invoice 1 is created when the schedule starts. The phase starts on that same
 *   timestamp, so the invoice is one full period at the monthly price.
 * - Invoice k is addCalendarMonths(start, k - 1) for k = 1..12.
 * - The phase ends at addCalendarMonths(start, 12), which is the end of the 12th
 *   prepaid period, not the opening of a 13th period.
 * - end_behavior cancel ends the subscription on that boundary.
 *
 * A phase that started today and waited a month before the first charge would
 * count that wait inside a 12-month phase and bill only 11 times, or it would
 * need a 13-month phase and would open a $0 invoice up front. Creating a
 * subscription with a future billing anchor and cancel_at needs a gap before
 * the 13th renewal, and Stripe drafts that renewal about an hour early.
 * The future schedule start does not have either problem.
 * discounts is an empty string so a coupon already on the customer is not applied.
 */
export function setupThen12ScheduleCreateParams(input: {
  customerId: string;
  setupUnix: number;
  sessionId: string;
  plan: SetupPlan;
  collection: SetupCollection;
  paymentMethodId?: string | null;
  priceId?: string;
  payments?: number;
  offer?: string;
  billingModel?: string;
}): Stripe.SubscriptionScheduleCreateParams {
  if (input.collection === "charge_automatically" && !input.paymentMethodId) {
    throw new Error("AI Done setup_then_12 charge_automatically requires a saved payment method");
  }
  const payments = input.payments ?? MONTHLY_PAYMENTS;
  const description = payments === 12 ? "AI Done: 12-Month Partnership" : "AI Done: 6-Month Partnership";
  const metadata = setupThen12Metadata(input);
  const price = input.priceId || MONTHLY_PRICE;
  const sendInvoice = input.collection === "send_invoice";
  const billing: Stripe.SubscriptionScheduleCreateParams.DefaultSettings = sendInvoice
    ? {
        collection_method: "send_invoice",
        billing_cycle_anchor: "phase_start",
        description,
        invoice_settings: { days_until_due: 7 },
      }
    : {
        collection_method: "charge_automatically",
        billing_cycle_anchor: "phase_start",
        description,
        default_payment_method: input.paymentMethodId || undefined,
      };
  const phase: Stripe.SubscriptionScheduleCreateParams.Phase = {
    items: [{ price, quantity: 1 }],
    duration: { interval: "month", interval_count: payments },
    billing_cycle_anchor: "phase_start",
    proration_behavior: "none",
    discounts: "",
    metadata,
    collection_method: input.collection,
    ...(sendInvoice
      ? { invoice_settings: { days_until_due: 7 } }
      : { default_payment_method: input.paymentMethodId || undefined }),
  };
  return {
    customer: input.customerId,
    start_date: setupThen12BillingStart(input.setupUnix),
    end_behavior: "cancel",
    metadata,
    default_settings: billing,
    phases: [phase],
  };
}

export type ThankYouKind = "founder" | "partnership" | "buildout" | "next";

export function thankYouPlan(input: {
  session: CheckoutSessionLike | null;
  planParam?: string;
  hadSessionId: boolean;
}): ThankYouKind {
  const session = input.session;
  if (session) {
    if (isFounderSetupThankYou(session)) return "founder";
    if (session.mode === "payment" && isKnownSetupBillingModel(billingModelOf(session))) return "partnership";
    if (isPartnershipCheckout({ mode: session.mode, metadata: session.metadata })) return "partnership";
    if (session.metadata?.program === "ai_done_buildout") return "buildout";
    return "next";
  }
  if (input.planParam === "founder") return "founder";
  if (input.planParam === "partnership") return "partnership";
  if (input.planParam === "buildout" || !input.hadSessionId) return "buildout";
  return "partnership";
}
