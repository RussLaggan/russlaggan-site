import type { Metadata } from "next";
import { PageView } from "./view";

const title = "Build a Legacy | Russ Laggan";
const description =
  "Build a legacy. Money first. Then time. Then what you leave behind. Then helping other people build theirs. A 14-minute talk from eXp Build 2024 Detroit.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://www.russlaggan.com/legacy" },
  openGraph: {
    title,
    description,
    url: "https://www.russlaggan.com/legacy",
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
  return (
    <>
      <PageView />
    </>
  );
}
