import type { Metadata } from "next";
import { PageView } from "./view";

export const metadata: Metadata = {
  title: "Articles | Russ Laggan",
  description: "What Russ Laggan is teaching.",
  alternates: { canonical: "https://www.russlaggan.com/articles" },
  openGraph: {
    title: "Articles | Russ Laggan",
    description: "What Russ Laggan is teaching.",
    url: "https://www.russlaggan.com/articles",
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
