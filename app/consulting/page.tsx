import type { Metadata } from "next";
import { PageView } from "./view";

export const metadata: Metadata = {
  title: "Consulting | Russ Laggan",
  description: "Bring Russ Laggan in as a fractional chief revenue officer.",
  alternates: { canonical: "https://www.russlaggan.com/consulting" },
  openGraph: {
    title: "Consulting | Russ Laggan",
    description: "Bring Russ Laggan in as a fractional chief revenue officer.",
    url: "https://www.russlaggan.com/consulting",
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
