import type { Metadata } from "next";
import { Anton } from "next/font/google";
import { FOUNDER_COPY, founderNotice } from "@/lib/ai-done-founder";
import "./founder.css";

const anton = Anton({ weight: "400", subsets: ["latin"], display: "swap" });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Founder rate",
  description: FOUNDER_COPY.body,
  robots: { index: false, follow: false },
};

export default async function FounderPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string | string[] }>;
}) {
  const { notice } = await searchParams;
  const message = founderNotice(notice);
  return (
    <div className="founder-gate">
      <div className="wrap">
        <h1 className={anton.className}>{FOUNDER_COPY.headline}</h1>
        <p className="founder-body">{FOUNDER_COPY.body}</p>
        {message ? (
          <p className="founder-notice" role="alert">
            {message}
          </p>
        ) : null}
        <form className="founder-form" action="/api/ai-done-founder" method="post">
          <label htmlFor="founder-word">{FOUNDER_COPY.field}</label>
          <input
            id="founder-word"
            name="word"
            type="text"
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            required
          />
          <button type="submit">{FOUNDER_COPY.button}</button>
        </form>
      </div>
    </div>
  );
}
