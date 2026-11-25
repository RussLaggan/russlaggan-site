/**
 * Sale landing page copy. Voice is "we". No em dashes.
 * To rename the sale (for example to "Cyber Monday sale"), change SALE_NAME only.
 * There is no end date on the page on purpose.
 */
export const SALE_NAME = "Black Friday sale";

export const SALE_CODE = "LARRYSDISCOUNT";

export const SALE = {
  product: "AI Done: 12-Month Partnership",
  intro:
    "We start with the AI you already use and get it set up right, then add the Grok and Claude workflows we use in our own business.",
  priceLabel: "Setup today",
  regular: "$2,500",
  price: "$1,000",
  codeNote: `Code ${SALE_CODE} is applied for you at checkout.`,
  thenPrice: "then $497 a month",
  thenCaption: "for 12 months starting next month",
  commitment: "12-month commitment",
  cta: "Start for $1,000 today",
  secure: "Secure checkout by Stripe. Nothing to copy or paste.",
  deliveredTitle: "What you get",
  monthOneLabel: "Month 1, the full systems buildout",
  ongoingLabel: "Months 2 through 12",
  terms: `$1,000 setup today with code ${SALE_CODE} (regular $2,500), then $497 a month for 12 months starting next month. Monthly billing ends after those 12 payments. Continuing after that is optional, month to month, at $497.`,
  details: "Full details on the AI Done page",
  /** Shown on the Stripe Checkout pay button when the code is pre-applied. */
  checkoutSubmit: `Code ${SALE_CODE} applied: $1,000 setup today, then $497/month for 12 months starting next month.`,
};

export function saleTitle() {
  return `${SALE_NAME}: AI Done`;
}
