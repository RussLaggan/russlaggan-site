import type { MetadataRoute } from "next";
import { site } from "@/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/coachingquiz" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
