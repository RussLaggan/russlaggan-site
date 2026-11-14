import type { Metadata } from "next";
import { PageView } from "./view";

const title = "The Jellyfish Method | Russ Laggan";
const description =
  "The Jellyfish Method. Put something valuable where people already are, and they run into it. A 30-minute talk from Russ Laggan on massive growth.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://www.russlaggan.com/jellyfish-method" },
  openGraph: {
    title,
    description,
    url: "https://www.russlaggan.com/jellyfish-method",
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
