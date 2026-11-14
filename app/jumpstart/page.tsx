import type { Metadata } from "next";
import { PageView } from "./view";

const title = "Jumpstart Masterclass | The class you run | Russ Laggan";
const description =
  "Jumpstart Masterclass with Russ Laggan. Sphere, production, and the weekly activities. You work the system. Standard, Premium, and VIP plans are on Skool.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://www.russlaggan.com/jumpstart" },
  openGraph: {
    title,
    description,
    url: "https://www.russlaggan.com/jumpstart",
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
