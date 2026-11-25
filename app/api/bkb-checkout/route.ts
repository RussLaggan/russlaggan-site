import { NextResponse } from "next/server";
import Stripe from "stripe";
import { CHECKOUT_COPY } from "@/app/ai-done/copy";
import { SALE } from "@/app/black-friday/copy";
import {
  LEGACY_BILLING_MODEL,
  LEGACY_SETUP_OFFER,
  MONTHLY_PRICE,
  SETUP_PLAN_STANDARD,
  SETUP_PRICE_STANDARD,
  TRACK_ADDON,
  TRACK_PRICE,
  parseAiDonePlan,
} from "@/lib/ai-done-partnership";

export const runtime = "nodejs";

// AI Done checkout. Prices live in Stripe (Laggan Holdings LLC, acct_1ULkwBKFIl1mC1gN).
// partnership: $2,500 setup today, then the webhook starts 12 charges of $497 one calendar month later.
// AI_DONE_SETUP_PRICE_STANDARD and AI_DONE_MONTHLY_PRICE override those live price IDs.
// buildout: one payment of $4,500. STRIPE_PRICE_AI_DONE overrides the buildout price.
// addon=track keeps that one-time payment, saves the customer and payment method,
// and marks the session. The webhook starts AI Done Track on TRACK_PRICE one month later.
// plan=monthly (cancel anytime) is retired and is not sold on its own.
// Payment methods stay Dashboard-managed.
const BUILDOUT_PRICE = process.env.STRIPE_PRICE_AI_DONE || "price_1UXtntKFIl1mC1gNx9QJKWUy";
const PAGE = "/ai-done";

// Sale landing page (/black-friday). promo=bf is opt-in and only changes the partnership checkout:
// the LARRYSDISCOUNT promotion code is pre-applied server-side. The client never sends a Stripe ID.
// If Stripe refuses the discount (inactive, exhausted, expired), checkout falls back to the
// standard session with the promo code field open, and the page shows the code.
const SALE_PROMO_PARAM = "bf";
const SALE_PAGE = "/black-friday";
const SALE_PROMOTION_CODE = "promo_1UfR7SKFIl1mC1gN3uKuMSa3"; // LARRYSDISCOUNT

function back(origin: string, reason: string, anchor: string, page: string = PAGE) {
  return NextResponse.redirect(`${origin}${page}?checkout=${reason}#${anchor}`, 303);
}

async function activePrice(stripe: Stripe, priceId: string, recurring: boolean) {
  const price = await stripe.prices.retrieve(priceId);
  const typeOk = recurring ? price.type === "recurring" : price.type === "one_time";
  if (!price.active || !typeOk) return null;
  return price;
}

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  let requested = "buildout";
  let addon = "";
  let promo = "";
  try {
    const form = await request.formData();
    requested = String(form.get("plan") || "buildout");
    addon = String(form.get("addon") || "");
    promo = String(form.get("promo") || "");
  } catch {
    // No form body: treat as the buildout.
  }

  const plan = parseAiDonePlan(requested);
  if (plan === "rejected") {
    console.error("ai-done checkout rejected plan", requested);
    return back(origin, "unavailable", "options");
  }
  const sale = plan === "partnership" && promo === SALE_PROMO_PARAM;
  const returnPage = sale ? SALE_PAGE : PAGE;

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    console.error("ai-done checkout missing configuration");
    return back(origin, "unavailable", plan, returnPage);
  }

  const stripe = new Stripe(secret);
  try {
    if (plan === "partnership") {
      const setup = await activePrice(stripe, SETUP_PRICE_STANDARD, false);
      const monthly = await activePrice(stripe, MONTHLY_PRICE, true);
      if (!setup || !monthly) {
        console.error("ai-done partnership price is not active or has the wrong type");
        return back(origin, "unavailable", "partnership", returnPage);
      }

      const metadata = { offer: LEGACY_SETUP_OFFER, plan: SETUP_PLAN_STANDARD, billing_model: LEGACY_BILLING_MODEL };
      const params: Stripe.Checkout.SessionCreateParams = {
        mode: "payment",
        line_items: [{ price: setup.id, quantity: 1 }],
        customer_creation: "always",
        payment_intent_data: {
          setup_future_usage: "off_session",
          description: CHECKOUT_COPY.partnership.description,
          metadata,
        },
        metadata,
        billing_address_collection: "auto",
        phone_number_collection: { enabled: true },
        allow_promotion_codes: true,
        custom_text: { submit: { message: CHECKOUT_COPY.partnership.submit } },
        success_url: `${origin}${PAGE}/thank-you?plan=partnership&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}${returnPage}?checkout=cancelled#partnership`,
      };

      let session: Stripe.Checkout.Session | null = null;
      if (sale) {
        // Stripe rejects allow_promotion_codes together with discounts.
        const { allow_promotion_codes: _open, ...rest } = params;
        try {
          session = await stripe.checkout.sessions.create({
            ...rest,
            discounts: [{ promotion_code: SALE_PROMOTION_CODE }],
            custom_text: { submit: { message: SALE.checkoutSubmit } },
          });
        } catch (error) {
          console.error(
            "ai-done sale discount not applied, falling back to promo code field",
            error instanceof Error ? error.message : "error",
          );
        }
      }
      if (!session) session = await stripe.checkout.sessions.create(params);

      if (session.url) return NextResponse.redirect(session.url, 303);
    } else {
      const price = await activePrice(stripe, BUILDOUT_PRICE, false);
      if (!price) {
        console.error("ai-done checkout price for buildout is not active or has the wrong type");
        return back(origin, "unavailable", "buildout");
      }

      const withTrack = addon === TRACK_ADDON;
      if (withTrack) {
        const track = await activePrice(stripe, TRACK_PRICE, true);
        if (!track) {
          console.error("ai-done track price is not active or has the wrong type");
          return back(origin, "unavailable", "buildout");
        }
      }

      const metadata: Stripe.MetadataParam = withTrack
        ? { program: "ai_done_buildout", addon: "track" }
        : { program: "ai_done_buildout" };
      const paymentIntentData: Stripe.Checkout.SessionCreateParams.PaymentIntentData = { metadata };
      if (withTrack) paymentIntentData.setup_future_usage = "off_session";
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{ price: price.id, quantity: 1 }],
        success_url: `${origin}${PAGE}/thank-you?plan=${withTrack ? "buildout-track" : "buildout"}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}${PAGE}?checkout=cancelled#buildout`,
        billing_address_collection: "required",
        phone_number_collection: { enabled: true },
        metadata,
        custom_text: {
          submit: { message: withTrack ? CHECKOUT_COPY.buildout.trackSubmit : CHECKOUT_COPY.buildout.submit },
        },
        customer_creation: "always",
        invoice_creation: { enabled: true },
        payment_intent_data: paymentIntentData,
      });

      if (session.url) return NextResponse.redirect(session.url, 303);
    }
  } catch (error) {
    console.error("ai-done checkout failed", error instanceof Error ? error.message : "error");
  }

  return back(origin, "unavailable", plan, returnPage);
}
