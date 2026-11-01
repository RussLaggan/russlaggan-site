import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "You're in | Best Known Brand 1-Month Buildout",
  description: "Your payment went through. We'll reach out within 1 business day to book your kickoff.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="field">
      <section className="section" style={{ paddingTop: "72px", paddingBottom: "96px" }}>
        <div className="wrap" style={{ maxWidth: "720px" }}>
          <p className="label">Payment received</p>
          <h1>You're in.</h1>
          <p className="lede">
            Your 1-Month Buildout is paid. We'll reach out within 1 business day to book your kickoff.
          </p>
          <div className="lattice-card" style={{ marginTop: "28px" }}>
            <h3>What happens next</h3>
            <ol style={{ margin: "8px 0 0", paddingLeft: "20px", color: "var(--muted)", lineHeight: 1.6 }}>
              <li>Watch your email for your Stripe receipt.</li>
              <li>We reach out within 1 business day to book your kickoff.</li>
              <li>Have your domain login and Google Business Profile access handy for the kickoff.</li>
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
