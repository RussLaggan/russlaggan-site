import type { Metadata } from "next";
import { PAGE, THANK_YOU } from "../copy";

export const metadata: Metadata = {
  title: `You're in | ${PAGE.title}`,
  description: "Your payment went through. We'll reach out within 1 business day to book your kickoff.",
  robots: { index: false, follow: false },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  const lede =
    plan === "partnership" ? THANK_YOU.partnership : plan === "buildout" || !plan ? THANK_YOU.buildout : THANK_YOU.next;
  return (
    <div className="field">
      <section className="section" style={{ paddingTop: "72px", paddingBottom: "96px" }}>
        <div className="wrap" style={{ maxWidth: "720px" }}>
          <p className="label">Payment received</p>
          <h1>{THANK_YOU.title}</h1>
          <p className="lede">{lede}</p>
          <div className="lattice-card" style={{ marginTop: "28px" }}>
            <h3>What happens next</h3>
            <ol style={{ margin: "8px 0 0", paddingLeft: "20px", color: "var(--muted)", lineHeight: 1.6 }}>
              <li>Watch your email for your Stripe receipt.</li>
              <li>{THANK_YOU.next}</li>
            </ol>
          </div>
          <p style={{ marginTop: "28px" }}>
            <a className="btn" href="/">
              Back to the site
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
