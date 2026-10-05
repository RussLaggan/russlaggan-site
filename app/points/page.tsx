import type { Metadata } from "next";
import { PageView } from "./view";

export const metadata: Metadata = {
  title: "30 Points to Success | Russ Laggan",
  description: "Thirty points of success. A daily scorecard from Russ Laggan.",
  alternates: { canonical: "https://www.russlaggan.com/points" },
  openGraph: {
    title: "30 Points to Success | Russ Laggan",
    description: "Thirty points of success. A daily scorecard from Russ Laggan.",
    url: "https://www.russlaggan.com/points",
    images: ["https://www.russlaggan.com/images/russ-home.webp"],
  },
};

export default function Page() {
  return <PageView />;
}
