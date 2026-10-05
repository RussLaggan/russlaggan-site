import type { Metadata } from "next";
import { PageView } from "./view";

export const metadata: Metadata = {
  title: "The Jellyfish Method | Russ Laggan",
  description: "The Jellyfish Method. Put something valuable where people already are.",
  alternates: { canonical: "https://www.russlaggan.com/jellyfish-method" },
  openGraph: {
    title: "The Jellyfish Method | Russ Laggan",
    description: "The Jellyfish Method. Put something valuable where people already are.",
    url: "https://www.russlaggan.com/jellyfish-method",
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
