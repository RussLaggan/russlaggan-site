import type { Metadata } from "next";
import faq from "./faq.json";
import { PageView } from "./view";

const title = "3-Month Private Coaching | Russ Laggan";
const description =
  "Private coaching with Russ Laggan. $1,500 a month for 3 months. Ends automatically after the third payment. Ten seats.";
const url = "https://www.russlaggan.com/coaching";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    images: ["https://www.russlaggan.com/images/russ-home.webp"],
  },
};

const offerSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Private coaching with Russ Laggan",
  serviceType: "Business coaching",
  provider: { "@id": "https://www.russlaggan.com/#person" },
  url,
  description,
  offers: {
    "@type": "Offer",
    name: "3-month private coaching",
    price: "1500",
    priceCurrency: "USD",
    url,
    description:
      "$1,500 a month for 3 months. Ends automatically after the third payment. Nothing renews. Ten seats.",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: "1500",
      priceCurrency: "USD",
      billingDuration: "P3M",
      unitText: "MONTH",
    },
  },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <PageView />
    </>
  );
}
