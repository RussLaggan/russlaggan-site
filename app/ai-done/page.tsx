import type { Metadata } from "next";
import { site } from "@/site";
import { PAGE } from "./copy";
import { faqSchema } from "./faq";
import { PageView } from "./view";
import "./bkb.css";

const title = `${PAGE.title} | ${site.name}`;
const description = PAGE.description;
const url = `${site.url}/ai-done`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, type: "website", siteName: site.name },
  twitter: { card: "summary_large_image", title, description },
};

const offerSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: PAGE.title,
  serviceType: "AI setup and training",
  provider: { "@id": "https://bestknownbrand.com/#organization" },
  url,
  description,
  offers: {
    "@type": "Offer",
    name: "AI Done: 1-Month Buildout",
    price: "4500",
    priceCurrency: "USD",
    url,
    description: "One payment of $4,500 for about 30 days of consulting and systems setup.",
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
