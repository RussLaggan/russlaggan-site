import type { Metadata } from "next";
import { Anton } from "next/font/google";
import { BuyButton, CheckoutNotice } from "@/app/ai-done/checkout";
import { INCLUDED, ONGOING } from "@/app/ai-done/copy";
import { site } from "@/site";
import { SALE, SALE_NAME, saleTitle } from "./copy";
import "./black-friday.css";

const anton = Anton({ weight: "400", subsets: ["latin"], display: "swap" });

const title = `${saleTitle()} | ${site.name}`;
const description = `${SALE.product}. ${SALE.terms}`;
const url = `${site.url}/black-friday`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, type: "website", siteName: site.name },
  twitter: { card: "summary_large_image", title, description },
};

function Check() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Items({ items }: { items: string[] }) {
  return (
    <ul className="bf-list">
      {items.map((item) => (
        <li key={item}>
          <Check />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Buy() {
  return <BuyButton plan="partnership" promo="bf" label={SALE.cta} className="bf-btn" />;
}

export default function BlackFridayPage() {
  return (
    <div className="bf">
      <section className="bf-hero">
        <div className="wrap bf-grid">
          <div className="bf-copy">
            <p className="bf-tag">{SALE_NAME}</p>
            <h1 className={anton.className}>
              AI Done<span>12-Month Partnership</span>
            </h1>
            <p className="bf-intro">{SALE.intro}</p>
          </div>

          <div className="bf-card" id="partnership">
            <CheckoutNotice />
            <p className="bf-label">{SALE.priceLabel}</p>
            <p className="bf-price">
              <s aria-label={`Regular price ${SALE.regular}`}>{SALE.regular}</s>
              <strong className={anton.className}>{SALE.price}</strong>
            </p>
            <p className="bf-code">{SALE.codeNote}</p>
            <p className="bf-then">{SALE.thenPrice}</p>
            <p className="bf-muted">{SALE.thenCaption}</p>
            <p className="bf-muted">{SALE.commitment}</p>
            <div className="bf-buy">
              <Buy />
            </div>
            <p className="bf-small">{SALE.secure}</p>
          </div>
        </div>
      </section>

      <section className="bf-section">
        <div className="wrap bf-narrow">
          <h2 className={anton.className}>{SALE.deliveredTitle}</h2>
          <h3>{SALE.monthOneLabel}</h3>
          <Items items={INCLUDED} />
          <h3>{SALE.ongoingLabel}</h3>
          <Items items={ONGOING} />
          <div className="bf-close">
            <p className="bf-terms">{SALE.terms}</p>
            <div className="bf-buy">
              <Buy />
            </div>
            <p className="bf-small">
              {SALE.secure} <a href="/ai-done">{SALE.details}</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
