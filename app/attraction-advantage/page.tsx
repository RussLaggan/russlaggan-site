import type { Metadata } from "next";
import { PageView } from "./view";

export const metadata: Metadata = {
  title: "The Attraction Advantage | Russ Laggan",
  description: "The Attraction Advantage. The best recruiters don't recruit. They attract.",
  alternates: { canonical: "https://www.russlaggan.com/attraction-advantage" },
  openGraph: {
    title: "The Attraction Advantage | Russ Laggan",
    description: "The Attraction Advantage. The best recruiters don't recruit. They attract.",
    url: "https://www.russlaggan.com/attraction-advantage",
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
