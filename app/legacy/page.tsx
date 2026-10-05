import type { Metadata } from "next";
import { PageView } from "./view";

export const metadata: Metadata = {
  title: "Build a Legacy | Russ Laggan",
  description: "Build a legacy. Money first. Then time. Then what you leave behind.",
  alternates: { canonical: "https://www.russlaggan.com/legacy" },
  openGraph: {
    title: "Build a Legacy | Russ Laggan",
    description: "Build a legacy. Money first. Then time. Then what you leave behind.",
    url: "https://www.russlaggan.com/legacy",
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
