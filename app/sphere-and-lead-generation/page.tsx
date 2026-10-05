import type { Metadata } from "next";
import { PageView } from "./view";

export const metadata: Metadata = {
  title: "Sphere of influence and lead generation | Russ Laggan",
  description: "Sphere of influence and lead generation, from Russ Laggan.",
  alternates: { canonical: "https://www.russlaggan.com/sphere-and-lead-generation" },
  openGraph: {
    title: "Sphere of influence and lead generation | Russ Laggan",
    description: "Sphere of influence and lead generation, from Russ Laggan.",
    url: "https://www.russlaggan.com/sphere-and-lead-generation",
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
