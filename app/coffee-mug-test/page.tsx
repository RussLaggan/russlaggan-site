import type { Metadata } from "next";
import { PageView } from "./view";

export const metadata: Metadata = {
  title: "The Coffee Mug Test | Russ Laggan",
  description: "The Coffee Mug Test. Change how you see it, and you start to see everything differently.",
  alternates: { canonical: "https://www.russlaggan.com/coffee-mug-test" },
  openGraph: {
    title: "The Coffee Mug Test | Russ Laggan",
    description: "The Coffee Mug Test. Change how you see it, and you start to see everything differently.",
    url: "https://www.russlaggan.com/coffee-mug-test",
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
