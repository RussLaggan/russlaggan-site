import type { Metadata } from "next";
import { PageView } from "./view";

const title = "The Russ Laggan Podcast";
const description =
  "Join host Russ Laggan as he explores the human side of leadership, woodworking, grilling, team building, and being followable. On Apple and Spotify.";
const url = "https://www.russlaggan.com/podcast";
const image = "https://www.russlaggan.com/images/russ-laggan-podcast.jpg";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    images: [image],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
  },
};

export default function Page() {
  return (
    <>
      <PageView />
    </>
  );
}
