import type { Metadata } from "next";
import { PageView } from "./view";

const title = "About Russ Laggan | Speaker, author, and coach";
const description =
  "Russ Laggan is a speaker, author, coach, and consultant. He wrote Be Followable, is co-founder and CRO of Best Known Brand, and a former eXp Realty VP.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://www.russlaggan.com/about" },
  openGraph: {
    title,
    description,
    url: "https://www.russlaggan.com/about",
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
