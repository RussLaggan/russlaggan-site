import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingIncludes: {
    "/play": ["./legacy/play.html"],
    "/pentatype-assessment": ["./legacy/pentatype-assessment.html"],
    "/types/[slug]": ["./legacy/types/*.html"],
  },
  async redirects() {
    return [
      { source: "/best-known-brand", destination: "/ai-done", permanent: false },
      { source: "/best-known-brand/:path*", destination: "/ai-done/:path*", permanent: false },
      { source: "/adventure", destination: "/coachingquiz", permanent: false },
      { source: "/index", destination: "/", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/:path*.html", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
