import { existsSync, readdirSync, readFileSync } from "fs";
import path from "path";

const dir = path.join(process.cwd(), "legacy", "types");

export function generateStaticParams() {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(".html"))
    .map((name) => ({ slug: name.slice(0, -".html".length) }));
}

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return new Response("Not found", { status: 404 });
  }
  const file = path.join(dir, `${slug}.html`);
  if (!existsSync(file)) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(readFileSync(file), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
