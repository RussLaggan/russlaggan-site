import type { Metadata } from "next";
import { PageView } from "./view";

export const metadata: Metadata = {
  title: "Be Followable | Russ Laggan",
  description: "Be Followable by Russ Laggan. The leader's guide to inspiring others and building lasting impact.",
  alternates: { canonical: "https://www.russlaggan.com/author" },
  openGraph: {
    title: "Be Followable | Russ Laggan",
    description: "Be Followable by Russ Laggan. The leader's guide to inspiring others and building lasting impact.",
    url: "https://www.russlaggan.com/author",
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
