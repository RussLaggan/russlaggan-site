import type { Metadata } from "next";
import { PageView } from "./view";

export const metadata: Metadata = {
  title: "AI Done | Russ Laggan",
  description:
    "AI Done is a one-to-one setup. Three private 90-minute sessions, plus 45-minute sessions as needed. $4,500 one time.",
  alternates: { canonical: "https://www.russlaggan.com/ai-done" },
  openGraph: {
    title: "AI Done | Russ Laggan",
    description:
      "One system that works. Claude and Grok, set up with you, so the pieces make one picture. $4,500.",
    url: "https://www.russlaggan.com/ai-done",
    images: ["https://www.russlaggan.com/images/russ-home.webp"],
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const params = await searchParams;
  return <PageView pending={params.checkout || ""} />;
}
