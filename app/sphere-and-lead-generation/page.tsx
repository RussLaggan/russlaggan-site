import type { Metadata } from "next";
import { PageView } from "./view";

const title = "Sphere of influence and lead generation | Russ Laggan";
const description =
  "Most lead generation dies in the follow-up. Jumpstart Masterclass teaches agents to build the same credibility with their sphere and with every lead in the CRM.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://www.russlaggan.com/sphere-and-lead-generation" },
  openGraph: {
    title,
    description,
    url: "https://www.russlaggan.com/sphere-and-lead-generation",
    images: ["https://www.russlaggan.com/images/russ-home.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://www.russlaggan.com/images/russ-home.webp"],
  },
};

export default function Page() {
  return (
    <>
      <PageView />
    </>
  );
}
