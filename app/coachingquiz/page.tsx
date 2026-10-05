import type { Metadata } from "next";
import { PageView } from "./view";

export const metadata: Metadata = {
  title: "Coaching quiz | Russ Laggan",
  description: "A free coaching quiz with Russ Laggan.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.russlaggan.com/coachingquiz" },
  openGraph: {
    title: "Coaching quiz | Russ Laggan",
    description: "A free coaching quiz with Russ Laggan.",
    url: "https://www.russlaggan.com/coachingquiz",
    images: ["https://www.russlaggan.com/images/russ-home.webp"],
  },
};

export default function Page() {
  return <PageView />;
}
