import type { Metadata } from "next";
import { PageView } from "./view";

export const metadata: Metadata = {
  title: "Three recipes | Russ Laggan",
  description: "Three recipes for a sphere of influence business, a working session with Russ Laggan.",
  alternates: { canonical: "https://www.russlaggan.com/three-recipes" },
  openGraph: {
    title: "Three recipes | Russ Laggan",
    description: "Three recipes for a sphere of influence business, a working session with Russ Laggan.",
    url: "https://www.russlaggan.com/three-recipes",
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
