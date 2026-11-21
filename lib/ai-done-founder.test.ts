import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { BILLING_MODEL, SETUP_OFFER, SETUP_PLAN_FOUNDER, SETUP_PRICE_FOUNDER } from "./ai-done-partnership.ts";
import {
  FOUNDER_COPY,
  FOUNDER_PAYMENT_SEARCH,
  FOUNDER_SPOT_CAP,
  countPaidFounderSetups,
  createFounderRateLimiter,
  founderCapReached,
  founderCheckoutResult,
  founderCheckoutSessionParams,
  founderClientIp,
  founderNotice,
  founderWordMatches,
  searchUnavailable,
  sessionIsPaidFounderSetup,
  type FounderStripe,
} from "./ai-done-founder.ts";

const FIXTURE_WORD = "unit-test-word";
const ORIGIN = "https://www.russlaggan.com";
const SETUP_PRICE = "price_founder_setup";
const MONTHLY_PRICE = "price_monthly";

test("founder word matches trimmed case-insensitive input and rejects a missing env", () => {
  assert.equal(founderWordMatches(FIXTURE_WORD, FIXTURE_WORD), true);
  assert.equal(founderWordMatches(`  ${FIXTURE_WORD.toUpperCase()}  `, FIXTURE_WORD), true);
  assert.equal(founderWordMatches(FIXTURE_WORD, `  ${FIXTURE_WORD.toUpperCase()}  `), true);
  assert.equal(founderWordMatches("different-word", FIXTURE_WORD), false);
  assert.equal(founderWordMatches("", FIXTURE_WORD), false);
  assert.equal(founderWordMatches(FIXTURE_WORD, undefined), false);
  assert.equal(founderWordMatches(FIXTURE_WORD, null), false);
  assert.equal(founderWordMatches(FIXTURE_WORD, ""), false);
  assert.equal(founderWordMatches(FIXTURE_WORD, "   "), false);
  assert.equal(founderWordMatches(`${FIXTURE_WORD} `, `${FIXTURE_WORD}-extra`), false);
});

test("founder notices are fixed strings", () => {
  assert.equal(founderNotice("mismatch"), "That word doesn't match.");
  assert.equal(founderNotice("full"), "Founder spots are full.");
  assert.equal(founderNotice("limited"), "Try again in a moment.");
  assert.equal(founderNotice(undefined), null);
  assert.equal(founderNotice("other"), null);
  assert.equal(FOUNDER_COPY.headline, "Founder rate");
  assert.equal(
    FOUNDER_COPY.body,
    "Founder rate: $1,000 setup today, then $497/month for 6 months starting next month. Limited to the collaboration group.",
  );
  assert.equal(FOUNDER_COPY.field, "Secret word");
  assert.equal(FOUNDER_COPY.button, "Unlock founder checkout");
  assert.equal(JSON.stringify(FOUNDER_COPY).includes("$1,500"), false);
  assert.equal(/\$1,500 off/i.test(JSON.stringify(FOUNDER_COPY)), false);
});

test("paid founder sessions count only when the setup succeeded", () => {
  const founder = { plan: "founder", offer: "ai_done_setup_12" };
  assert.equal(sessionIsPaidFounderSetup({ id: "cs_1", payment_status: "paid", metadata: founder }), true);
  assert.equal(
    sessionIsPaidFounderSetup({
      id: "cs_2",
      payment_status: "paid",
      metadata: {},
      payment_intent: { metadata: founder, status: "succeeded" },
    }),
    true,
  );
  assert.equal(sessionIsPaidFounderSetup({ id: "cs_3", payment_status: "unpaid", metadata: founder }), false);
  assert.equal(
    sessionIsPaidFounderSetup({
      id: "cs_4",
      payment_status: "paid",
      metadata: { plan: "standard", offer: "ai_done_setup_12" },
    }),
    false,
  );
  assert.equal(
    sessionIsPaidFounderSetup({
      id: "cs_5",
      payment_status: "paid",
      metadata: { plan: "founder", offer: "ai_done_12mo" },
    }),
    false,
  );
  assert.equal(founderCapReached(FOUNDER_SPOT_CAP - 1), false);
  assert.equal(founderCapReached(FOUNDER_SPOT_CAP), true);
  assert.equal(founderCapReached(FOUNDER_SPOT_CAP + 1), true);
});

function stripeWith(options: {
  total?: number;
  pages?: Array<{ data: Array<{ id: string }>; has_more: boolean; next_page?: string | null }>;
  sessions?: Array<{ data: Parameters<typeof sessionIsPaidFounderSetup>[0][]; has_more: boolean }>;
  searchError?: unknown;
  listError?: unknown;
}): { stripe: FounderStripe; calls: { search: number; list: number } } {
  const calls = { search: 0, list: 0 };
  let searchPage = 0;
  let listPage = 0;
  const stripe: FounderStripe = {
    paymentIntents: {
      async search() {
        calls.search += 1;
        if (options.searchError) throw options.searchError;
        if (options.pages) {
          const page = options.pages[searchPage] ?? { data: [], has_more: false, next_page: null };
          searchPage += 1;
          return page;
        }
        return {
          data: [],
          has_more: false,
          next_page: null,
          total_count: options.total ?? 0,
        };
      },
    },
    checkout: {
      sessions: {
        async list() {
          calls.list += 1;
          if (options.listError) throw options.listError;
          const page = options.sessions?.[listPage] ?? { data: [], has_more: false };
          listPage += 1;
          return page;
        },
        async create() {
          return { url: "https://checkout.stripe.com/c/pay/cs_test_unused" };
        },
      },
    },
    prices: {
      async retrieve(id: string) {
        return { id, active: true, type: "one_time" };
      },
    },
  };
  return { stripe, calls };
}

test("founder cap uses the search total and stops at 20", async () => {
  const open = stripeWith({ total: 19 });
  assert.equal(await countPaidFounderSetups(open.stripe), 19);
  assert.equal(open.calls.search, 1);
  assert.equal(open.calls.list, 1);

  const full = stripeWith({ total: 20 });
  assert.equal(await countPaidFounderSetups(full.stripe), 20);
  assert.equal(full.calls.list, 0);

  const paged = stripeWith({
    pages: [
      { data: Array.from({ length: 15 }, (_, index) => ({ id: `pi_${index}` })), has_more: true, next_page: "page-2" },
      { data: Array.from({ length: 6 }, (_, index) => ({ id: `pi_b_${index}` })), has_more: false, next_page: null },
    ],
  });
  assert.equal(await countPaidFounderSetups(paged.stripe), 21);
  assert.equal(paged.calls.search, 2);
  assert.equal(paged.calls.list, 0);
});

test("founder cap falls back to paid checkout sessions when search is unavailable", async () => {
  assert.equal(searchUnavailable({ code: "search_unavailable" }), true);
  assert.equal(searchUnavailable(new Error("network")), false);
  const founder = { plan: "founder", offer: "ai_done_setup_12" };
  const listed = stripeWith({
    searchError: Object.assign(new Error("search unavailable"), { code: "search_unavailable" }),
    sessions: [
      {
        has_more: false,
        data: [
          { id: "cs_paid", payment_status: "paid", metadata: founder },
          { id: "cs_open", payment_status: "unpaid", metadata: founder },
          { id: "cs_standard", payment_status: "paid", metadata: { plan: "standard", offer: "ai_done_setup_12" } },
          { id: "cs_link", payment_status: "paid", metadata: null, payment_intent: { metadata: founder } },
        ],
      },
    ],
  });
  assert.equal(await countPaidFounderSetups(listed.stripe), 2);

  const ahead = stripeWith({
    total: 18,
    sessions: [{ has_more: false, data: Array.from({ length: 19 }, (_, index) => ({ id: `cs_${index}`, payment_status: "paid", metadata: founder })) }],
  });
  assert.equal(await countPaidFounderSetups(ahead.stripe), 19);

  await assert.rejects(() => countPaidFounderSetups(stripeWith({ searchError: new Error("network") }).stripe));
  assert.equal(FOUNDER_PAYMENT_SEARCH.includes("status:'succeeded'"), true);
  assert.equal(FOUNDER_PAYMENT_SEARCH.includes("metadata['plan']:'founder'"), true);
  assert.equal(FOUNDER_PAYMENT_SEARCH.includes("metadata['offer']:'ai_done_setup_12'"), true);
});

test("founder checkout session is a one-time setup with off-session reuse and founder metadata", () => {
  const params = founderCheckoutSessionParams({ origin: ORIGIN, priceId: SETUP_PRICE_FOUNDER });
  assert.equal(params.mode, "payment");
  assert.equal(params.allow_promotion_codes, false);
  assert.equal("payment_method_types" in params, false);
  assert.equal(params.customer_creation, "always");
  assert.equal(params.payment_intent_data?.setup_future_usage, "off_session");
  assert.deepEqual(params.metadata, {
    offer: SETUP_OFFER,
    plan: SETUP_PLAN_FOUNDER,
    billing_model: BILLING_MODEL,
  });
  assert.equal(SETUP_OFFER, "ai_done_setup_12");
  assert.equal(SETUP_PLAN_FOUNDER, "founder");
  assert.equal(BILLING_MODEL, "setup_then_12");
  assert.deepEqual(params.payment_intent_data?.metadata, params.metadata);
  assert.deepEqual(params.line_items, [{ price: SETUP_PRICE_FOUNDER, quantity: 1 }]);
  assert.equal(
    params.success_url,
    `${ORIGIN}/ai-done/thank-you?session_id={CHECKOUT_SESSION_ID}&plan=founder`,
  );
  assert.equal(params.cancel_url, `${ORIGIN}/ai-done/founder`);
  assert.equal(JSON.stringify(params).includes("$1,500"), false);
  assert.equal(JSON.stringify(params).includes("payment_method_types"), false);
});

function checkoutRequest(word: string, ip = "203.0.113.10") {
  return new Request(`${ORIGIN}/api/ai-done-founder`, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "x-forwarded-for": `${ip}, 10.0.0.8`,
    },
    body: new URLSearchParams({ word }),
  });
}

function checkoutStripe(options?: {
  total?: number;
  searchError?: unknown;
  setup?: { active: boolean; type: string };
  monthly?: { active: boolean; type: string };
  url?: string | null;
}) {
  const calls = { create: 0, search: 0 };
  let params: unknown;
  const stripe: FounderStripe = {
    paymentIntents: {
      async search() {
        calls.search += 1;
        if (options?.searchError) throw options.searchError;
        return { data: [], has_more: false, next_page: null, total_count: options?.total ?? 0 };
      },
    },
    checkout: {
      sessions: {
        async list() {
          return { data: [], has_more: false };
        },
        async create(next) {
          calls.create += 1;
          params = next;
          return { url: options && "url" in options ? (options.url ?? null) : "https://checkout.stripe.com/c/pay/cs_test_founder" };
        },
      },
    },
    prices: {
      async retrieve(id: string) {
        if (id === MONTHLY_PRICE) return { id, active: true, type: "recurring", ...options?.monthly };
        return { id, active: true, type: "one_time", ...options?.setup };
      },
    },
  };
  return { stripe, calls, params: () => params };
}

function deps(stripe: FounderStripe, secretWord: string | null = FIXTURE_WORD) {
  return {
    secretWord: secretWord ?? undefined,
    stripeSecret: "sk_test_example",
    priceId: SETUP_PRICE,
    monthlyPriceId: MONTHLY_PRICE,
    limiter: createFounderRateLimiter(),
    stripe,
  };
}

test("checkout redirects only after the word matches and the cap is open", async () => {
  const open = checkoutStripe({ total: 19 });
  const ok = await founderCheckoutResult(checkoutRequest(`  ${FIXTURE_WORD.toUpperCase()} `), deps(open.stripe));
  assert.equal(ok.url, "https://checkout.stripe.com/c/pay/cs_test_founder");
  assert.equal(open.calls.create, 1);
  assert.deepEqual(
    open.params(),
    founderCheckoutSessionParams({ origin: ORIGIN, priceId: SETUP_PRICE }),
  );

  const wrong = checkoutStripe();
  const mismatch = await founderCheckoutResult(checkoutRequest("different-word"), deps(wrong.stripe));
  assert.equal(mismatch.url, `${ORIGIN}/ai-done/founder?notice=mismatch`);
  assert.equal(wrong.calls.create, 0);
  assert.equal(wrong.calls.search, 0);

  const missing = checkoutStripe();
  const rejected = await founderCheckoutResult(checkoutRequest(FIXTURE_WORD), deps(missing.stripe, null));
  assert.equal(rejected.url, `${ORIGIN}/ai-done/founder?notice=mismatch`);
  assert.equal(missing.calls.create, 0);

  const blank = checkoutStripe();
  const blankEnv = await founderCheckoutResult(checkoutRequest(FIXTURE_WORD), deps(blank.stripe, "  "));
  assert.equal(blankEnv.url, `${ORIGIN}/ai-done/founder?notice=mismatch`);
  assert.equal(blank.calls.create, 0);

  const full = checkoutStripe({ total: 20 });
  const closed = await founderCheckoutResult(checkoutRequest(FIXTURE_WORD), deps(full.stripe));
  assert.equal(closed.url, `${ORIGIN}/ai-done/founder?notice=full`);
  assert.equal(full.calls.create, 0);

  const inactive = checkoutStripe({ setup: { active: false, type: "one_time" } });
  const blocked = await founderCheckoutResult(checkoutRequest(FIXTURE_WORD), deps(inactive.stripe));
  assert.equal(blocked.url, `${ORIGIN}/ai-done/founder?notice=unavailable`);
  assert.equal(inactive.calls.create, 0);

  const down = checkoutStripe({ searchError: new Error("network") });
  const failed = await founderCheckoutResult(checkoutRequest(FIXTURE_WORD), deps(down.stripe));
  assert.equal(failed.url, `${ORIGIN}/ai-done/founder?notice=unavailable`);
  assert.equal(down.calls.create, 0);
});

test("rapid repeats from one ip are rejected before a checkout session is created", async () => {
  const stripe = checkoutStripe();
  const limiter = createFounderRateLimiter({ windowMs: 60_000, maxAttempts: 2 });
  const shared = { ...deps(stripe.stripe), limiter };
  const first = await founderCheckoutResult(checkoutRequest(FIXTURE_WORD, "198.51.100.4"), { ...shared, now: 1_000 });
  const second = await founderCheckoutResult(checkoutRequest("different-word", "198.51.100.4"), { ...shared, now: 1_500 });
  const third = await founderCheckoutResult(checkoutRequest(FIXTURE_WORD, "198.51.100.4"), { ...shared, now: 2_000 });
  const other = await founderCheckoutResult(checkoutRequest(FIXTURE_WORD, "198.51.100.9"), { ...shared, now: 2_000 });
  const later = await founderCheckoutResult(checkoutRequest(FIXTURE_WORD, "198.51.100.4"), { ...shared, now: 62_000 });
  assert.equal(first.url, "https://checkout.stripe.com/c/pay/cs_test_founder");
  assert.equal(second.url, `${ORIGIN}/ai-done/founder?notice=mismatch`);
  assert.equal(third.url, `${ORIGIN}/ai-done/founder?notice=limited`);
  assert.equal(other.url, "https://checkout.stripe.com/c/pay/cs_test_founder");
  assert.equal(later.url, "https://checkout.stripe.com/c/pay/cs_test_founder");
  assert.equal(stripe.calls.create, 3);
  const request = new Request(`${ORIGIN}/api/ai-done-founder`, {
    headers: { "x-forwarded-for": "203.0.113.9, 10.0.0.1" },
  });
  assert.equal(founderClientIp(request), "203.0.113.9");
});

test("the founder page stays unlinked, noindex, and out of the sitemap", () => {
  const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
  const page = read("../app/ai-done/founder/page.tsx");
  const route = read("../app/api/ai-done-founder/route.ts");
  const robots = read("../app/robots.ts");
  const sitemap = read("../app/sitemap.ts");
  const vercel = read("../vercel.json");
  assert.equal(page.includes("index: false"), true);
  assert.equal(page.includes("follow: false"), true);
  assert.equal(page.includes("FOUNDER_COPY.headline"), true);
  assert.equal(page.includes("FOUNDER_COPY.body"), true);
  assert.equal(page.includes("FOUNDER_COPY.field"), true);
  assert.equal(page.includes("FOUNDER_COPY.button"), true);
  assert.equal(page.includes('action="/api/ai-done-founder"'), true);
  assert.equal(page.includes("$1,500"), false);
  assert.equal(route.includes("process.env.AI_DONE_FOUNDER_WORD"), true);
  assert.equal(route.includes("SETUP_PRICE_FOUNDER"), true);
  assert.equal(route.includes("payment_method_types"), false);
  assert.equal(/AI_DONE_FOUNDER_WORD\s*(\|\||\?\?|=)/.test(route), false);
  assert.equal(robots.includes('"/ai-done/founder"'), true);
  assert.equal(sitemap.includes("ai-done/founder"), false);
  assert.match(vercel, /\/ai-done\/founder[\s\S]*noindex, nofollow/);
  for (const path of [
    "../components/site-header.tsx",
    "../components/site-footer.tsx",
    "../app/ai-done/page.tsx",
    "../app/ai-done/view.tsx",
    "../app/ai-done/checkout.tsx",
    "../app/sitemap.ts",
  ]) {
    assert.equal(read(path).includes("ai-done/founder"), false, path);
  }
});
