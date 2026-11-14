import type { Metadata } from "next";
import { PageView } from "./view";

const title = "30 Points to Success | A daily scorecard | Russ Laggan";
const description =
  "Thirty points of success. A daily scorecard from Russ Laggan: 30 points a day, 150 a week, 600 a month. Hit the day and you are done.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://www.russlaggan.com/points" },
  openGraph: {
    title,
    description,
    url: "https://www.russlaggan.com/points",
    images: ["https://www.russlaggan.com/images/russ-home.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://www.russlaggan.com/images/russ-home.webp"],
  },
};

export default function Page() {
  return <PageView />;
}
