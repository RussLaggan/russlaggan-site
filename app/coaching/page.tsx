import type { Metadata } from "next";
import faq from "./faq.json";
import { PageView } from "./view";

export const metadata: Metadata = {
  title: "Coaching | Russ Laggan",
  description: "Private coaching with Russ Laggan. Where you are, where you want to be, and how you get there.",
  alternates: { canonical: "https://www.russlaggan.com/coaching" },
  openGraph: {
    title: "Coaching | Russ Laggan",
    description: "Private coaching with Russ Laggan. Where you are, where you want to be, and how you get there.",
    url: "https://www.russlaggan.com/coaching",
    images: ["https://www.russlaggan.com/images/russ-home.webp"],
  },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <PageView />
    </>
  );
}
