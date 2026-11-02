import type { MetadataRoute } from "next";
import { site } from "@/site";

const paths = [
  "/",
  "/about",
  "/ai-done",
  "/articles",
  "/attraction-advantage",
  "/author",
  "/coaching",
  "/coffee-mug-test",
  "/consulting",
  "/jellyfish-method",
  "/jumpstart",
  "/legacy",
  "/podcast",
  "/points",
  "/speaking",
  "/sphere-and-lead-generation",
  "/three-recipes",
  "/trainer",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: path === "/" ? `${site.url}/` : `${site.url}${path}`,
  }));
}
