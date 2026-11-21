import { createHash, timingSafeEqual } from "node:crypto";
import type Stripe from "stripe";

const SETUP_OFFER = "ai_done_setup_12";
const SETUP_PLAN_FOUNDER = "founder";
const BILLING_MODEL = "setup_then_12";

/** Founder checkout. The gate word is read only from AI_DONE_FOUNDER_WORD. */
export const FOUNDER_SPOT_CAP = 20;
export const FOUNDER_PAGE = "/ai-done/founder";
export const FOUNDER_RATE_WINDOW_MS = 60_000;
export const FOUNDER_RATE_MAX = 5;

export const FOUNDER_COPY = {
  headline: "Founder rate",
  body: "Founder rate: $1,000 setup today, then $497/month for 6 months starting next month. Limited to the collaboration group.",
  field: "Secret word",
  button: "Unlock founder checkout",
  submit: "Founder rate: $1,000 setup today, then $497/month for 6 months starting next month.",
  mismatch: "That word doesn't match.",
  full: "Founder spots are full.",
  limited: "Try again in a moment.",
  unavailable: "Checkout isn't open right now.",
} as const;

export type FounderNotice = "mismatch" | "full" | "limited" | "unavailable";

export const FOUNDER_PAYMENT_SEARCH = `status:'succeeded' AND metadata['plan']:'${SETUP_PLAN_FOUNDER}' AND metadata['offer']:'${SETUP_OFFER}'`;

const METADATA = {
  offer: SETUP_OFFER,
  plan: SETUP_PLAN_FOUNDER,
  billing_model: BILLING_MODEL,
} as const;

export function founderNotice(code: string | string[] | undefined): string | null {
  const value = Array.isArray(code) ? code[0] : code;
  if (value === "mismatch") return FOUNDER_COPY.mismatch;
  if (value === "full") return FOUNDER_COPY.full;
  if (value === "limited") return FOUNDER_COPY.limited;
  if (value === "unavailable") return FOUNDER_COPY.unavailable;
  return null;
}

/** Trimmed, case-insensitive match. Missing or blank env always rejects. Digest compare stays constant-time. */
export function founderWordMatches(input: string, secret: string | undefined | null): boolean {
  if (typeof secret !== "string") return false;
  const expected = secret.trim();
  if (!expected) return false;
  if (typeof input !== "string" || input.length > 4096) return false;
  const given = createHash("sha256").update(input.trim().toLowerCase(), "utf8").digest();
  const actual = createHash("sha256").update(expected.toLowerCase(), "utf8").digest();
  if (given.length !== actual.length) return false;
  return timingSafeEqual(given, actual);
}

export function founderClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const first = forwarded.split(",")[0]?.trim() || request.headers.get("x-real-ip")?.trim() || "unknown";
  return first.slice(0, 80) || "unknown";
}

export type FounderRateLimiter = {
  allow(ip: string, now?: number): boolean;
};

export function createFounderRateLimiter(options?: {
  windowMs?: number;
  maxAttempts?: number;
}): FounderRateLimiter {
  const windowMs = options?.windowMs ?? FOUNDER_RATE_WINDOW_MS;
  const maxAttempts = options?.maxAttempts ?? FOUNDER_RATE_MAX;
  const attempts = new Map<string, number[]>();
  return {
    allow(ip: string, now = Date.now()) {
      const key = ip.slice(0, 80) || "unknown";
      const recent = (attempts.get(key) ?? []).filter((at) => now - at < windowMs);
      if (recent.length >= maxAttempts) {
        attempts.set(key, recent);
        if (attempts.size > 500) {
          for (const [stored, times] of attempts) {
            if (times.every((at) => now - at >= windowMs)) attempts.delete(stored);
          }
        }
        return false;
      }
      recent.push(now);
      attempts.set(key, recent);
      return true;
    },
  };
}

export function founderMetadataMatches(metadata: Stripe.Metadata | null | undefined): boolean {
  return metadata?.plan === SETUP_PLAN_FOUNDER && metadata?.offer === SETUP_OFFER;
}

export type FounderSessionRecord = {
  id: string;
  payment_status?: string | null;
  metadata?: Stripe.Metadata | null;
  payment_intent?:
    | string
    | { status?: string | null; metadata?: Stripe.Metadata | null }
    | null;
};

/** A succeeded founder setup: paid checkout, with plan and offer on the session or its PaymentIntent. */
export function sessionIsPaidFounderSetup(session: FounderSessionRecord): boolean {
  if (session.payment_status !== "paid") return false;
  if (founderMetadataMatches(session.metadata)) return true;
  const paymentIntent = session.payment_intent;
  if (!paymentIntent || typeof paymentIntent === "string") return false;
  return founderMetadataMatches(paymentIntent.metadata);
}

type SearchPage = {
  data: Array<{ id: string }>;
  has_more: boolean;
  next_page?: string | null;
  total_count?: number;
};

type SessionPage = {
  data: FounderSessionRecord[];
  has_more: boolean;
};

export type FounderStripe = {
  paymentIntents: {
    search(params: Stripe.PaymentIntentSearchParams): Promise<SearchPage>;
  };
  checkout: {
    sessions: {
      list(params: Stripe.Checkout.SessionListParams): Promise<SessionPage>;
      create(params: Stripe.Checkout.SessionCreateParams): Promise<{ id?: string; url: string | null }>;
    };
  };
  prices: {
    retrieve(id: string): Promise<{ id: string; active: boolean; type: string }>;
  };
};

const MAX_COUNT_PAGES = 20;

export function searchUnavailable(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const code = "code" in error ? String((error as { code?: unknown }).code ?? "") : "";
  if (code === "search_unavailable") return true;
  const message = error instanceof Error ? error.message : "";
  return /search/i.test(message) && /unavailable|not available/i.test(message);
}

async function countFromSearch(stripe: FounderStripe): Promise<number> {
  let page: string | undefined;
  let count = 0;
  for (let index = 0; index < MAX_COUNT_PAGES; index += 1) {
    const params: Stripe.PaymentIntentSearchParams = {
      query: FOUNDER_PAYMENT_SEARCH,
      limit: 100,
      page,
    };
    if (index === 0) params.expand = ["total_count"];
    const result = await stripe.paymentIntents.search(params);
    if (index === 0 && typeof result.total_count === "number") return result.total_count;
    count += result.data.length;
    if (count >= FOUNDER_SPOT_CAP || !result.has_more || !result.next_page) return count;
    page = result.next_page;
  }
  if (count >= FOUNDER_SPOT_CAP) return count;
  throw new Error("AI Done founder search did not finish");
}

async function countFromSessions(stripe: FounderStripe): Promise<number> {
  let startingAfter: string | undefined;
  let count = 0;
  for (let index = 0; index < MAX_COUNT_PAGES; index += 1) {
    const result = await stripe.checkout.sessions.list({
      limit: 100,
      status: "complete",
      starting_after: startingAfter,
      expand: ["data.payment_intent"],
    });
    for (const session of result.data) {
      if (sessionIsPaidFounderSetup(session)) count += 1;
    }
    if (count >= FOUNDER_SPOT_CAP || !result.has_more || result.data.length === 0) return count;
    const last = result.data[result.data.length - 1];
    if (!last?.id) return count;
    startingAfter = last.id;
  }
  if (count >= FOUNDER_SPOT_CAP) return count;
  throw new Error("AI Done founder session list did not finish");
}

/**
 * Paid founder setups. Search is one indexed count; the session list catches
 * payments search has not indexed yet. The higher count wins, and 20 blocks checkout.
 */
export async function countPaidFounderSetups(stripe: FounderStripe): Promise<number> {
  let searched: number | null = null;
  try {
    searched = await countFromSearch(stripe);
  } catch (error) {
    if (!searchUnavailable(error)) throw error;
  }
  if (searched !== null && searched >= FOUNDER_SPOT_CAP) return searched;
  try {
    const listed = await countFromSessions(stripe);
    return Math.max(searched ?? 0, listed);
  } catch (error) {
    if (searched !== null) return searched;
    throw error;
  }
}

export function founderCapReached(paidCount: number): boolean {
  return paidCount >= FOUNDER_SPOT_CAP;
}

export function founderCheckoutSessionParams(input: {
  origin: string;
  priceId: string;
}): Stripe.Checkout.SessionCreateParams {
  return {
    mode: "payment",
    line_items: [{ price: input.priceId, quantity: 1 }],
    customer_creation: "always",
    payment_intent_data: {
      setup_future_usage: "off_session",
      description: FOUNDER_COPY.submit,
      metadata: { ...METADATA },
    },
    metadata: { ...METADATA },
    billing_address_collection: "auto",
    phone_number_collection: { enabled: true },
    allow_promotion_codes: false,
    custom_text: { submit: { message: FOUNDER_COPY.submit } },
    success_url: `${input.origin}/ai-done/thank-you?session_id={CHECKOUT_SESSION_ID}&plan=founder`,
    cancel_url: `${input.origin}${FOUNDER_PAGE}`,
  };
}

export type FounderCheckoutDeps = {
  secretWord: string | undefined;
  stripeSecret: string | undefined;
  priceId: string;
  monthlyPriceId: string;
  limiter: FounderRateLimiter;
  now?: number;
  stripe?: FounderStripe;
  createStripe?: () => FounderStripe;
};

function noticeUrl(origin: string, notice: FounderNotice): string {
  return `${origin}${FOUNDER_PAGE}?notice=${notice}`;
}

async function readWord(request: Request): Promise<string> {
  try {
    const form = await request.formData();
    const raw = form.get("word");
    return typeof raw === "string" ? raw : "";
  } catch {
    return "";
  }
}

function stripeClient(deps: FounderCheckoutDeps): FounderStripe | null {
  if (!deps.stripeSecret) return null;
  if (deps.stripe) return deps.stripe;
  return deps.createStripe?.() ?? null;
}

/** Always returns a redirect URL. Wrong words and a missing env word share one message. */
export async function founderCheckoutResult(request: Request, deps: FounderCheckoutDeps): Promise<{ url: string }> {
  const origin = new URL(request.url).origin;
  if (!deps.limiter.allow(founderClientIp(request), deps.now)) return { url: noticeUrl(origin, "limited") };

  const word = await readWord(request);
  if (!founderWordMatches(word, deps.secretWord)) return { url: noticeUrl(origin, "mismatch") };

  try {
    const stripe = stripeClient(deps);
    if (!stripe) return { url: noticeUrl(origin, "unavailable") };
    const paid = await countPaidFounderSetups(stripe);
    if (founderCapReached(paid)) return { url: noticeUrl(origin, "full") };

    const setup = await stripe.prices.retrieve(deps.priceId);
    const monthly = await stripe.prices.retrieve(deps.monthlyPriceId);
    if (!setup.active || setup.type !== "one_time" || !monthly.active || monthly.type !== "recurring") {
      console.error("ai-done founder price is not active or has the wrong type");
      return { url: noticeUrl(origin, "unavailable") };
    }

    const session = await stripe.checkout.sessions.create(
      founderCheckoutSessionParams({ origin, priceId: setup.id }),
    );
    if (!session.url) return { url: noticeUrl(origin, "unavailable") };
    return { url: session.url };
  } catch (error) {
    console.error("ai-done founder checkout failed", error instanceof Error ? error.message : "error");
    return { url: noticeUrl(origin, "unavailable") };
  }
}
