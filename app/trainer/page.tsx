import type { Metadata } from "next";
import { PageView } from "./view";

export const metadata: Metadata = {
  title: "Trainer | Russ Laggan",
  description: "Have Russ Laggan train your team. Sphere of influence, one hour a week.",
  alternates: { canonical: "https://www.russlaggan.com/trainer" },
  openGraph: {
    title: "Trainer | Russ Laggan",
    description: "Have Russ Laggan train your team. Sphere of influence, one hour a week.",
    url: "https://www.russlaggan.com/trainer",
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
