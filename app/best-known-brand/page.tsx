import type { Metadata } from "next";
import { faqSchema } from "./faq";
import { PageView } from "./view";
import "./bkb.css";

const title = "1-Month Buildout | Best Known Brand with Russ Laggan";
const description =
  "Get found and become the best known brand in your market. A one-time $4,500 buildout: a site Google and AI can read, a corrected Business Profile, and every inquiry answered in minutes.";
const url = "https://www.russlaggan.com/best-known-brand";

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
  name: "Best Known Brand 1-Month Buildout",
  serviceType: "AI search and Google Map Pack buildout",
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
