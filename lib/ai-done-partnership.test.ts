import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { CHECKOUT_COPY, THANK_YOU } from "../app/ai-done/copy.ts";
import {
  BILLING_MODEL,
  MONTHLY_PAYMENTS,
  MONTHLY_PRICE,
  PARTNERSHIP_MONTHLY_PRICE,
  PARTNERSHIP_SETUP_PRICE,
  SETUP_OFFER,
  SETUP_PRICE_FOUNDER,
  SETUP_PRICE_STANDARD,
  parseAiDonePlan,
  partnershipScheduleUpdate,
  phaseIsTwelveMonthly,
  priceIdFromEnv,
  scheduleEndsPartnership,
  setupCollectionFor,
  setupThen12BillingStart,
  setupThen12IdempotencyKey,
  setupThen12InvoiceTimes,
  setupThen12PhaseEnd,
  setupThen12ScheduleCreateParams,
  shouldCancelPartnership,
  standardSetupTerm,
  isPartnershipCheckout,
  isSetupThen12Checkout,
  thankYouPlan,
} from "./ai-done-partnership.ts";

test("retired monthly plan is rejected and partnership is the named plan", () => {
  assert.equal(parseAiDonePlan("partnership"), "partnership");
  assert.equal(parseAiDonePlan("buildout"), "buildout");
  assert.equal(parseAiDonePlan(""), "buildout");
  assert.equal(parseAiDonePlan("monthly"), "rejected");
});

test("schedule update keeps only the monthly price for 12 months and cancels", () => {
  const update = partnershipScheduleUpdate(1_700_000_000);
  assert.equal(update.end_behavior, "cancel");
  assert.equal(update.proration_behavior, "none");
  assert.equal(update.phases?.length, 1);
  const phase = update.phases?.[0];
  assert.equal(phase?.start_date, 1_700_000_000);
  assert.deepEqual(phase?.items, [{ price: PARTNERSHIP_MONTHLY_PRICE, quantity: 1 }]);
  assert.deepEqual(phase?.duration, { interval: "month", interval_count: 12 });
  assert.equal(JSON.stringify(update).includes(PARTNERSHIP_SETUP_PRICE), false);
  assert.equal(phase?.iterations, undefined);
});

test("a configured schedule is recognized and a setup-price phase is not", () => {
  assert.equal(
    scheduleEndsPartnership({
      end_behavior: "cancel",
      phases: [{ items: [{ price: PARTNERSHIP_MONTHLY_PRICE, quantity: 1 }], duration: { interval: "month", interval_count: 12 } }],
    }),
    true,
  );
  assert.equal(
    phaseIsTwelveMonthly({
      items: [
        { price: PARTNERSHIP_MONTHLY_PRICE },
        { price: PARTNERSHIP_SETUP_PRICE },
      ],
      iterations: 12,
    }),
    false,
  );
  assert.equal(
    scheduleEndsPartnership({
      end_behavior: "release",
      phases: [{ items: [{ price: PARTNERSHIP_MONTHLY_PRICE }], iterations: 12 }],
    }),
    false,
  );
});

test("invoice guard cancels only an unscheduled partnership after 12 paid invoices", () => {
  const base = { offer: "ai_done_12mo", hasSchedule: false, paidInvoices: 12, cancelAtPeriodEnd: false };
  assert.equal(shouldCancelPartnership(base), true);
  assert.equal(shouldCancelPartnership({ ...base, paidInvoices: 11 }), false);
  assert.equal(shouldCancelPartnership({ ...base, hasSchedule: true }), false);
  assert.equal(shouldCancelPartnership({ ...base, offer: "ai_done_buildout" }), false);
  assert.equal(shouldCancelPartnership({ ...base, offer: "ai_done_setup_12" }), false);
  assert.equal(shouldCancelPartnership({ ...base, cancelAtPeriodEnd: true }), false);
});

test("checkout session must be the partnership subscription", () => {
  assert.equal(isPartnershipCheckout({ mode: "subscription", metadata: { offer: "ai_done_12mo" } }), true);
  assert.equal(isPartnershipCheckout({ mode: "payment", metadata: { offer: "ai_done_12mo" } }), false);
  assert.equal(isPartnershipCheckout({ mode: "subscription", metadata: { program: "ai_done_monthly" } }), false);
});

test("shared copy has one subtitle, no em dash, and no retired monthly offer", () => {
  const copy = readFileSync(new URL("../app/ai-done/copy.ts", import.meta.url), "utf8");
  assert.equal(copy.includes("—"), false);
  assert.equal(copy.includes("–"), false);
  assert.equal(copy.includes("Co-founder & CRO"), false);
  assert.equal(copy.includes("plan=monthly"), false);
  assert.equal((copy.match(/export const SUBTITLE/g) || []).length, 1);
  assert.equal(copy.includes("AI Done: 12-Month Partnership"), true);
  assert.equal(copy.includes("AI Done: 6-Month Partnership"), false);
  assert.equal(copy.includes("AI Done: 1-Month Buildout"), true);
  assert.equal(copy.includes("$4,500"), true);
  assert.equal(copy.includes("$2,500"), true);
  assert.equal(copy.includes("$497"), true);
  assert.equal(copy.includes("11 months"), false);
  assert.equal(copy.includes("$1,500"), false);
  assert.equal(/trial/i.test(copy), false);
  assert.equal(/discount/i.test(copy), false);
  assert.equal(
    CHECKOUT_COPY.partnership.submit,
    "$2,500 setup today, then $497/month for 12 months starting next month.",
  );
  assert.equal(CHECKOUT_COPY.partnership.description, "AI Done Partnership setup fee");
});

const DAY = 24 * 60 * 60;

function utc(iso: string): number {
  return Date.parse(iso) / 1000;
}

test("setup then 6 bills exactly 6 full invoices starting one calendar month later", () => {
  const setup = utc("2026-03-15T16:30:00.000Z");
  const invoices = setupThen12InvoiceTimes(setup);
  const start = setupThen12BillingStart(setup);
  const end = setupThen12PhaseEnd(setup);
  assert.equal(invoices.length, MONTHLY_PAYMENTS);
  assert.equal(invoices.length, 6);
  assert.equal(start, utc("2026-04-15T16:30:00.000Z"));
  assert.equal(invoices[0], start);
  assert.equal(invoices[5], utc("2026-09-15T16:30:00.000Z"));
  assert.equal(end, utc("2026-10-15T16:30:00.000Z"));
  assert.equal(invoices.includes(end), false);
  assert.equal(invoices[0] - setup >= 28 * DAY && invoices[0] - setup <= 31 * DAY, true);
  for (let index = 1; index < invoices.length; index += 1) {
    const gap = invoices[index] - invoices[index - 1];
    assert.equal(gap >= 28 * DAY && gap <= 31 * DAY, true);
  }
});

test("a January 31 setup clamps the first invoice to February and still bills 6 times", () => {
  const setup = utc("2026-01-31T00:00:00.000Z");
  const invoices = setupThen12InvoiceTimes(setup);
  assert.equal(invoices[0], utc("2026-02-28T00:00:00.000Z"));
  assert.equal(invoices[1], utc("2026-03-28T00:00:00.000Z"));
  assert.equal(invoices.length, 6);
  assert.equal(setupThen12PhaseEnd(setup), utc("2026-08-28T00:00:00.000Z"));
  const leap = utc("2024-01-31T00:00:00.000Z");
  assert.equal(setupThen12BillingStart(leap), utc("2024-02-29T00:00:00.000Z"));
});

test("a saved card schedules charge_automatically for 6 full months", () => {
  assert.equal(setupCollectionFor({ paymentMethodType: "card", savedForOffSession: true }), "charge_automatically");
  assert.equal(setupCollectionFor({ paymentMethodType: "link", savedForOffSession: true }), "charge_automatically");
  assert.equal(
    setupCollectionFor({ paymentMethodType: "us_bank_account", savedForOffSession: true }),
    "charge_automatically",
  );
  assert.equal(setupCollectionFor({ paymentMethodType: "cashapp", savedForOffSession: true }), "charge_automatically");
  const setup = utc("2026-06-02T12:00:00.000Z");
  const params = setupThen12ScheduleCreateParams({
    customerId: "cus_card",
    setupUnix: setup,
    sessionId: "cs_test_card",
    plan: "standard",
    collection: "charge_automatically",
    paymentMethodId: "pm_card",
  });
  const phase = params.phases?.[0];
  assert.equal(params.end_behavior, "cancel");
  assert.equal(params.start_date, setupThen12InvoiceTimes(setup)[0]);
  assert.equal(params.default_settings?.collection_method, "charge_automatically");
  assert.equal(params.default_settings?.default_payment_method, "pm_card");
  assert.equal(params.default_settings?.invoice_settings, undefined);
  assert.equal(phase?.collection_method, "charge_automatically");
  assert.equal(phase?.default_payment_method, "pm_card");
  assert.equal(phase?.invoice_settings, undefined);
  assert.deepEqual(phase?.duration, { interval: "month", interval_count: 6 });
  assert.deepEqual(phase?.items, [{ price: MONTHLY_PRICE, quantity: 1 }]);
  assert.equal(phase?.proration_behavior, "none");
  assert.equal(phase?.billing_cycle_anchor, "phase_start");
  assert.equal(phase?.discounts, "");
  assert.equal(JSON.stringify(params).includes("trial"), false);
  assert.equal(params.metadata?.offer, SETUP_OFFER);
  assert.equal(params.metadata?.billing_model, BILLING_MODEL);
  assert.equal(params.metadata?.plan, "standard");
  assert.equal(params.metadata?.checkout_session, "cs_test_card");
  assert.equal(params.metadata?.collection_fallback, undefined);
  assert.equal(phase?.metadata?.collection_fallback, undefined);
  assert.equal(setupThen12IdempotencyKey("cs_test_card"), "setup12-cs_test_card");
});

test("Klarna, Cash App that cannot be saved, and a missing method use emailed invoices", () => {
  assert.equal(setupCollectionFor({ paymentMethodType: "klarna", savedForOffSession: false }), "send_invoice");
  assert.equal(setupCollectionFor({ paymentMethodType: "klarna", savedForOffSession: true }), "send_invoice");
  assert.equal(setupCollectionFor({ paymentMethodType: "cashapp", savedForOffSession: false }), "send_invoice");
  assert.equal(setupCollectionFor({ paymentMethodType: "card", savedForOffSession: false }), "send_invoice");
  assert.equal(setupCollectionFor({ paymentMethodType: null, savedForOffSession: false }), "send_invoice");
  const setup = utc("2026-06-02T12:00:00.000Z");
  const params = setupThen12ScheduleCreateParams({
    customerId: "cus_klarna",
    setupUnix: setup,
    sessionId: "cs_test_klarna",
    plan: "founder",
    collection: "send_invoice",
  });
  const phase = params.phases?.[0];
  assert.equal(params.start_date, setupThen12BillingStart(setup));
  assert.equal(params.end_behavior, "cancel");
  assert.equal(params.default_settings?.collection_method, "send_invoice");
  assert.equal(params.default_settings?.default_payment_method, undefined);
  assert.equal(params.default_settings?.invoice_settings?.days_until_due, 7);
  assert.equal(phase?.collection_method, "send_invoice");
  assert.equal(phase?.default_payment_method, undefined);
  assert.equal(phase?.invoice_settings?.days_until_due, 7);
  assert.deepEqual(phase?.duration, { interval: "month", interval_count: 6 });
  assert.equal(phase?.items?.[0]?.price, MONTHLY_PRICE);
  assert.equal(params.metadata?.collection_fallback, "send_invoice");
  assert.equal(params.metadata?.plan, "founder");
  assert.equal(params.metadata?.offer, "ai_done_setup_6");
  assert.equal(params.metadata?.billing_model, "setup_then_6");
  assert.equal(JSON.stringify(params).includes("trial"), false);
  assert.throws(() =>
    setupThen12ScheduleCreateParams({
      customerId: "cus_card",
      setupUnix: setup,
      sessionId: "cs_test_card",
      plan: "standard",
      collection: "charge_automatically",
    }),
  );
});

test("setup checkout is recognized from the session or the PaymentIntent", () => {
  const paid = { mode: "payment", payment_status: "paid", metadata: { billing_model: "setup_then_12", plan: "standard" } };
  assert.equal(isSetupThen12Checkout(paid), true);
  assert.equal(
    isSetupThen12Checkout({
      mode: "payment",
      payment_status: "paid",
      metadata: null,
      payment_intent: { metadata: { billing_model: "setup_then_12", plan: "founder", offer: "ai_done_setup_12" } },
    }),
    true,
  );
  assert.equal(isSetupThen12Checkout({ ...paid, payment_status: "unpaid" }), false);
  assert.equal(isSetupThen12Checkout({ ...paid, mode: "subscription" }), false);
  assert.equal(
    isSetupThen12Checkout({ mode: "payment", payment_status: "paid", metadata: { program: "ai_done_buildout" } }),
    false,
  );
});

test("thank-you works for a payment-mode session and a founder link with only a session id", () => {
  assert.equal(
    thankYouPlan({
      session: { mode: "payment", metadata: { billing_model: "setup_then_12" }, payment_status: "paid" },
      hadSessionId: true,
    }),
    "partnership",
  );
  assert.equal(
    thankYouPlan({
      session: {
        mode: "payment",
        metadata: {},
        payment_status: "paid",
        payment_intent: { metadata: { billing_model: "setup_then_12", plan: "founder" } },
      },
      hadSessionId: true,
    }),
    "founder",
  );
  assert.equal(
    thankYouPlan({
      session: { mode: "payment", metadata: { program: "ai_done_buildout" }, payment_status: "paid" },
      planParam: "partnership",
      hadSessionId: true,
    }),
    "buildout",
  );
  assert.equal(thankYouPlan({ session: null, planParam: "partnership", hadSessionId: false }), "partnership");
  assert.equal(thankYouPlan({ session: null, hadSessionId: false }), "buildout");
  assert.equal(thankYouPlan({ session: null, hadSessionId: true }), "partnership");
});

test("thank-you uses founder copy for a founder session, standard copy otherwise, and plan=founder when Stripe cannot be loaded", () => {
  assert.equal(
    thankYouPlan({
      session: {
        mode: "payment",
        payment_status: "paid",
        metadata: { billing_model: "setup_then_12", plan: "founder" },
      },
      hadSessionId: true,
    }),
    "founder",
  );
  assert.equal(
    thankYouPlan({
      session: {
        mode: "payment",
        payment_status: "paid",
        metadata: { billing_model: "setup_then_12", plan: "standard" },
      },
      planParam: "founder",
      hadSessionId: true,
    }),
    "partnership",
  );
  assert.equal(thankYouPlan({ session: null, planParam: "founder", hadSessionId: true }), "founder");
  assert.equal(
    THANK_YOU.founder,
    "You're in at the founder rate. Your $1,000 setup is paid. Monthly billing of $497 starts next month and runs for 6 months, then it ends.",
  );
  assert.equal(
    THANK_YOU.partnership,
    "Your setup is paid. Monthly billing of $497 starts next month and runs for 12 months. We'll reach out within 1 business day to book your kickoff.",
  );
  assert.equal(THANK_YOU.founder.includes("$1,500"), false);
  assert.equal(/\$1,500 off/i.test(THANK_YOU.founder), false);
});

test("setup price ids default to live prices and can be overridden", () => {
  assert.equal(priceIdFromEnv(undefined, "price_1UcExSKFIl1mC1gNjQd42CUN"), "price_1UcExSKFIl1mC1gNjQd42CUN");
  assert.equal(priceIdFromEnv("  ", "price_1UcExSKFIl1mC1gNjQd42CUN"), "price_1UcExSKFIl1mC1gNjQd42CUN");
  assert.equal(priceIdFromEnv(" price_test ", "price_1UcExSKFIl1mC1gNjQd42CUN"), "price_test");
  assert.equal(SETUP_PRICE_STANDARD, priceIdFromEnv(process.env.AI_DONE_SETUP_PRICE_STANDARD, "price_1UcExSKFIl1mC1gNjQd42CUN"));
  assert.equal(SETUP_PRICE_FOUNDER, priceIdFromEnv(process.env.AI_DONE_SETUP_PRICE_FOUNDER, "price_1UcExTKFIl1mC1gNY71eFIuJ"));
  assert.equal(MONTHLY_PRICE, priceIdFromEnv(process.env.AI_DONE_MONTHLY_PRICE, "price_1Ubn9NKFIl1mC1gN2MjMJYND"));
  assert.equal(PARTNERSHIP_MONTHLY_PRICE, "price_1Ubn9NKFIl1mC1gN2MjMJYND");
});

test("standard partnership checkout is setup then 12 payments at the standard price", () => {
  assert.equal(standardSetupTerm({ billing_model: "setup_then_12", plan: "standard" })?.payments, 12);
  assert.equal(standardSetupTerm({ billing_model: "setup_then_12", plan: "standard" })?.billingModel, "setup_then_12");
  assert.equal(standardSetupTerm({ billing_model: "setup_then_12", plan: "standard" })?.offer, "ai_done_setup_12");
  assert.equal(standardSetupTerm({ billing_model: "setup_then_12", plan: "founder" }), null);
  assert.equal(standardSetupTerm({ billing_model: "setup_then_6", plan: "standard" }), null);
  const setup = utc("2026-03-15T16:30:00.000Z");
  const params = setupThen12ScheduleCreateParams({
    customerId: "cus_standard",
    setupUnix: setup,
    sessionId: "cs_test_standard",
    plan: "standard",
    collection: "charge_automatically",
    paymentMethodId: "pm_card",
    payments: 12,
    offer: "ai_done_setup_12",
    billingModel: "setup_then_12",
  });
  assert.deepEqual(params.phases?.[0]?.duration, { interval: "month", interval_count: 12 });
  assert.equal(params.metadata?.billing_model, "setup_then_12");
  assert.equal(params.metadata?.offer, "ai_done_setup_12");
  assert.equal(params.metadata?.plan, "standard");
  assert.equal(params.default_settings?.description, "AI Done: 12-Month Partnership");
  assert.deepEqual(params.phases?.[0]?.items, [{ price: MONTHLY_PRICE, quantity: 1 }]);
  assert.equal(params.phases?.[0]?.discounts, "");
  assert.equal(JSON.stringify(params).includes("$1,500"), false);
});

test("checkout route sells the setup fee and leaves the buildout payment alone", () => {
  const route = readFileSync(new URL("../app/api/bkb-checkout/route.ts", import.meta.url), "utf8");
  assert.equal(route.includes('mode: "subscription"'), false);
  assert.equal(route.includes("payment_method_types"), false);
  const partnership = route.slice(route.indexOf('if (plan === "partnership")'), route.indexOf("} else {"));
  const buildout = route.slice(route.indexOf("} else {"));
  assert.equal(partnership.includes("allow_promotion_codes: true"), true);
  assert.equal(partnership.includes("allow_promotion_codes: false"), false);
  assert.equal(buildout.includes("allow_promotion_codes"), false);
  assert.equal(route.includes("$1,500"), false);
  assert.equal(route.includes('customer_creation: "always"'), true);
  assert.equal(route.includes('setup_future_usage: "off_session"'), true);
  assert.equal(route.includes("SETUP_PRICE_STANDARD"), true);
  assert.equal(route.includes("billing_model: LEGACY_BILLING_MODEL"), true);
  assert.equal(route.includes("offer: LEGACY_SETUP_OFFER"), true);
  assert.equal(route.includes("billing_model: BILLING_MODEL"), false);
  assert.equal(route.includes("price_1UXtntKFIl1mC1gNx9QJKWUy"), true);
  assert.equal(route.includes('program: "ai_done_buildout"'), true);
  const webhook = readFileSync(new URL("./ai-done-webhook.ts", import.meta.url), "utf8");
  assert.equal(webhook.includes("checkout.session.async_payment_succeeded"), true);
  assert.equal(webhook.includes("setupThen12IdempotencyKey"), true);
  assert.equal(webhook.includes("collection_fallback=send_invoice"), true);
  const coaching = readFileSync(new URL("../app/api/stripe-webhook/route.ts", import.meta.url), "utf8");
  assert.equal(coaching.includes("checkout.session.async_payment_succeeded"), true);
  assert.equal(coaching.includes("customer.subscription.created"), true);
  assert.equal(coaching.includes("price_1UbpPOKFIl1mC1gNSYx6emd4"), true);
});
