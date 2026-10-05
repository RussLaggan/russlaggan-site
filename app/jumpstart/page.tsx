import type { Metadata } from "next";
import { PageView } from "./view";

export const metadata: Metadata = {
  title: "Jumpstart Masterclass | Russ Laggan",
  description: "Jumpstart Masterclass with Russ Laggan.",
  alternates: { canonical: "https://www.russlaggan.com/jumpstart" },
  openGraph: {
    title: "Jumpstart Masterclass | Russ Laggan",
    description: "Jumpstart Masterclass with Russ Laggan.",
    url: "https://www.russlaggan.com/jumpstart",
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
