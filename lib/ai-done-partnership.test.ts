import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  PARTNERSHIP_MONTHLY_PRICE,
  PARTNERSHIP_SETUP_PRICE,
  parseAiDonePlan,
  partnershipScheduleUpdate,
  phaseIsTwelveMonthly,
  scheduleEndsPartnership,
  shouldCancelPartnership,
  isPartnershipCheckout,
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
  assert.equal(/cancel anytime/i.test(copy), false);
  assert.equal(copy.includes("plan=monthly"), false);
  assert.equal((copy.match(/export const SUBTITLE/g) || []).length, 1);
  assert.equal(copy.includes("AI Done: 12-Month Partnership"), true);
  assert.equal(copy.includes("AI Done: 1-Month Buildout"), true);
  assert.equal(copy.includes("$4,500"), true);
  assert.equal(copy.includes("$2,500"), true);
  assert.equal(copy.includes("$497"), true);
});
