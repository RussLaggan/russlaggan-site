import type { Metadata } from "next";
import { realEstateSchema } from "./schema";
import { PageView } from "./view";
import "./real-estate.css";

const title = "Russ Laggan, REALTOR® | eXp Realty LLC | Livonia and nearby communities";
const description =
  "Russ Laggan, REALTOR®, is a licensed Michigan real estate agent with eXp Realty. He helps people buy and sell homes in Livonia and nearby communities. Stop chasing. Start attracting.";
const url = "https://www.russlaggan.com/real-estate";
const image = "https://www.russlaggan.com/images/russ-home.webp";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    title,
    description,
    url,
    type: "website",
    images: [{ url: image, width: 575, height: 800, alt: "Russ Laggan, REALTOR®" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
  },
};

export default function Page() {
  return (
    <>
      <link rel="preload" as="image" href="/images/real-estate/hero-dusk.avif" fetchPriority="high" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateSchema) }} />
      <PageView />
    </>
  );
}
