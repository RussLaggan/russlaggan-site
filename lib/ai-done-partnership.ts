import type Stripe from "stripe";

/** Live prices on acct_1ULkwBKFIl1mC1gN. The $2,003 price is invoice 1 only and must not be added to the schedule. */
export const PARTNERSHIP_MONTHLY_PRICE = "price_1Ubn9NKFIl1mC1gN2MjMJYND";
export const PARTNERSHIP_SETUP_PRICE = "price_1Ubn9QKFIl1mC1gNZ0n8mlrI";
export const PARTNERSHIP_OFFER = "ai_done_12mo";
export const PARTNERSHIP_TERM_MONTHS = "12";
export const PARTNERSHIP_TERM_COUNT = 12;

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
 * Twelve months from the phase start. The $2,003 setup price is not a phase item.
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
