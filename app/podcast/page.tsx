import type { Metadata } from "next";
import { PageView } from "./view";

export const metadata: Metadata = {
  title: "The Russ Laggan Podcast",
  description: "The Russ Laggan Podcast. Leadership, building a team, and being followable.",
  alternates: { canonical: "https://www.russlaggan.com/podcast" },
  openGraph: {
    title: "The Russ Laggan Podcast",
    description: "The Russ Laggan Podcast. Leadership, building a team, and being followable.",
    url: "https://www.russlaggan.com/podcast",
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
