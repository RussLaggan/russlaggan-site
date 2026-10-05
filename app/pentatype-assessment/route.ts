import { readFileSync } from "fs";
import path from "path";

export function GET() {
  const html = readFileSync(path.join(process.cwd(), "legacy", "pentatype-assessment.html"), "utf8");
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
