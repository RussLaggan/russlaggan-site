import type { Metadata } from "next";
import { PageView } from "./view";

export const metadata: Metadata = {
  title: "Thank you | Russ Laggan",
  description: "Russ will be in touch within one business day to schedule your first session.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageView />;
}
