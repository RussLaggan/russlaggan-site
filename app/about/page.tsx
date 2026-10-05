import type { Metadata } from "next";
import { PageView } from "./view";

export const metadata: Metadata = {
  title: "About | Russ Laggan",
  description: "Russ Laggan is a speaker, author, coach, and consultant.",
  alternates: { canonical: "https://www.russlaggan.com/about" },
  openGraph: {
    title: "About | Russ Laggan",
    description: "Russ Laggan is a speaker, author, coach, and consultant.",
    url: "https://www.russlaggan.com/about",
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
