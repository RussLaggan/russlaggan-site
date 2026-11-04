import type { Metadata } from "next";
import { faqSchema } from "./faq";
import { PageView } from "./view";
import "./bkb.css";

const title = "AI Done: 1-Month AI Buildout | Russ Laggan";
const description =
  "A one-time $4,500, one-month AI buildout: four one-on-one sessions, Claude set up with you, your website built out together, and HighLevel for social posting.";
const url = "https://www.russlaggan.com/ai-done";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, type: "website", siteName: "Russ Laggan" },
  twitter: { card: "summary_large_image", title, description },
};

const offerSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "AI Done: 1-Month AI Buildout",
  serviceType: "AI setup and training",
  provider: { "@id": "https://bestknownbrand.com/#organization" },
  url,
  description,
  offers: {
    "@type": "Offer",
    price: "4500",
    priceCurrency: "USD",
    url,
  },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PageView />
    </>
  );
}
