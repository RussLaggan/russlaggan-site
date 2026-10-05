import type { Metadata } from "next";
import { PageView } from "./view";

export const metadata: Metadata = {
  title: "Russ Laggan | Speaker, author, coach",
  description: "Russ Laggan is a speaker, author, coach, and consultant. Stop chasing. Start attracting.",
  alternates: { canonical: "https://www.russlaggan.com/" },
  openGraph: {
    title: "Russ Laggan | Speaker, author, coach",
    description: "Russ Laggan is a speaker, author, coach, and consultant. Stop chasing. Start attracting.",
    url: "https://www.russlaggan.com/",
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
