import type { Metadata } from "next";
import { PageView } from "./view";

export const metadata: Metadata = {
  title: "Consulting | Russ Laggan",
  description:
    "High-level consulting with Russ Laggan. Stop the bleeding, plug the holes, and leave with a plan you can run. Start with a 30-minute assessment call.",
  alternates: { canonical: "https://www.russlaggan.com/consulting" },
  openGraph: {
    title: "Consulting | Russ Laggan",
    description:
      "Troubleshoot the business. A doable plan, the right people, and a recruiting system with tasks and metrics.",
    url: "https://www.russlaggan.com/consulting",
    images: ["https://www.russlaggan.com/images/russ-home.webp"],
  },
};

export default function Page() {
  return <PageView />;
}
