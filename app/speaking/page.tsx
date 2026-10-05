import type { Metadata } from "next";
import { PageView } from "./view";

export const metadata: Metadata = {
  title: "Speaker | Russ Laggan",
  description: "Bring Russ Laggan to your stage. Keynotes and panels, with action items built in.",
  alternates: { canonical: "https://www.russlaggan.com/speaking" },
  openGraph: {
    title: "Speaker | Russ Laggan",
    description: "Bring Russ Laggan to your stage. Keynotes and panels, with action items built in.",
    url: "https://www.russlaggan.com/speaking",
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
