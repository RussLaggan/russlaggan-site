import { YouTube } from "@/components/youtube";
import { BuyButton, CheckoutNotice } from "./checkout";
import { faq } from "./faq";

function Check() {
  return (
    <svg viewBox="0 0 20 20" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd"></path>
    </svg>
  );
}

const INCLUDED = [
  "A website marked up so Google and AI can read your business. The website is yours.",
  "Your Google Business Profile and directory records, corrected and kept current",
  "Every inquiry gets a text, an email, and the file or quote in minutes",
  "AI training that saves 5 to 10 hours a week",
];

const STEPS = [
  {
    when: "Today",
    title: "Check out",
    body: "One payment of $4,500 through Stripe. No subscription.",
  },
  {
    when: "Within 1 business day",
    title: "Book your kickoff",
    body: "We reach out within 1 business day to book your kickoff.",
  },
  {
    when: "During the month",
    title: "We build",
    body: "The site and its markup, your Business Profile and directory records, inquiry responses in minutes, and your AI training.",
  },
  {
    when: "End of the month",
    title: "Decide whether to hold your market",
    body: "The single month does not lock your market. If your market is open, the twelve-month plan holds your category in your pack.",
  },
];

const FOR = [
  {
    label: "Real estate",
    title: "Agents and teams who already close",
    body: "You close deals. You want your town's search working for you, instead of buying people from a portal who already searched your town.",
  },
  {
    label: "Lending and CPA",
    title: "Mortgage lenders, brokers, and CPA firms",
    body: "Same Map Pack, separate categories. A lender and a CPA firm can each be the name in the same pack.",
  },
  {
    label: "Personal brands",
    title: "When your name is the product",
    body: "Speakers, coaches, and authors who need AI and Google to know who they are and what they do.",
  },
];

export function PageView() {
  return (
    <div className="field hue-coach bkb">
      <section className="section coach-hero" style={{ paddingTop: "72px" }}>
        <div className="wrap hero-grid">
          <div>
            <p className="label">Best Known Brand · 1-Month Buildout</p>
            <h1>
              Be the name AI and Google <em>recommend.</em>
            </h1>
            <p className="lede">
              We help brands get found and become the best known brand in their market. In one month we build the
              foundation: a site Google and AI can read, a corrected Business Profile and directory records, and every
              inquiry answered in minutes.
            </p>
            <div className="hero-actions">
              <BuyButton label="Start the buildout · $4,500" />
              <a className="btn ghost bkb-ghost" href="#included">
                See what's included
              </a>
            </div>
            <p className="bkb-fine">One payment. No subscription. The website is yours.</p>
          </div>
          <img className="coach-shot" src="/images/russ-point.webp" alt="Russ Laggan" fetchPriority="high" />
        </div>
      </section>

      <section className="section" style={{ paddingTop: "56px" }}>
        <div className="wrap">
          <p className="label">The problem</p>
          <h2>AI and the Map Pack pick one name per market.</h2>
          <p className="lede">
            Ask an AI who the best agent in your town is. It gives an answer. Search Google and the Map Pack shows a few
            businesses around the address. Everyone else is further down the page.
          </p>
          <div className="cards">
            <article className="lattice-card">
              <p className="label">AI search</p>
              <h3>AI answers with a name</h3>
              <p>It doesn't hand people ten blue links. It recommends someone. If it can't read your business, it recommends someone it can.</p>
            </article>
            <article className="lattice-card">
              <p className="label">The Map Pack</p>
              <h3>Google shows the pack first</h3>
              <p>Your market is your category in the Map Pack around your Business Profile's address. That is where people look before they look anywhere else.</p>
            </article>
            <article className="lattice-card">
              <p className="label">The context layer</p>
              <h3>They read what describes you</h3>
              <p>Your site, your Business Profile, and every record about you. When those are thin, wrong, or don't agree, the answer goes to someone else.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "0" }}>
        <div className="wrap">
          <p className="label">Watch</p>
          <h2>Russ on who AI says is best.</h2>
          <div className="cards two bkb-videos">
            <div>
              <YouTube id="NP8GTmC4AKQ" title="Who Does AI Say Is the Best Agent in Your Town? The 5 Layers of AI" />
              <p className="bkb-caption">Who Does AI Say Is the Best Agent in Your Town? The 5 Layers of AI</p>
            </div>
            <div>
              <YouTube id="4NdYxezxLgw" title="AI for Real Estate Agents: Why You Keep Getting Stuck, and the Fix" />
              <p className="bkb-caption">AI for Real Estate Agents: Why You Keep Getting Stuck, and the Fix</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="included" style={{ paddingTop: "0" }}>
        <div className="wrap" id="buildout">
          <CheckoutNotice />
          <div className="offer-shell">
            <div className="offer-card">
              <h2 className="offer-title" style={{ fontSize: "32px", margin: "0" }}>
                Best Known Brand: 1-Month Buildout
              </h2>
              <p>A website and AI buildout, done in one month.</p>
              <ul className="offer-list results bkb-list">
                {INCLUDED.map((item) => (
                  <li key={item}>
                    <Check />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="bkb-note">
                The single month does not include market exclusivity. The twelve-month plan holds your category in your pack.
              </p>
            </div>
            <div className="offer-pay">
              <p style={{ color: "#71717a" }}>One month, paid once</p>
              <p className="big">$4,500</p>
              <p>one time</p>
              <div style={{ marginTop: "22px" }}>
                <BuyButton />
              </div>
              <p className="bkb-fine" style={{ marginTop: "14px" }}>
                The website is yours. Secure checkout by Stripe.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: "760px" }}>
          <p className="label">How it works</p>
          <h2>From checkout to live in a month.</h2>
          <ol className="bkb-steps">
            {STEPS.map((step, index) => (
              <li key={step.title} className="lattice-card">
                <span className="bkb-num">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p className="label">{step.when}</p>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "0" }}>
        <div className="wrap">
          <p className="label">Who it's for</p>
          <h2>Businesses people find by searching their town.</h2>
          <div className="cards">
            {FOR.map((item) => (
              <article key={item.title} className="lattice-card">
                <p className="label">{item.label}</p>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "0" }}>
        <div className="wrap">
          <div className="offer-card proof-card bkb-upgrade">
            <p className="label">After the buildout</p>
            <h2 className="offer-title" style={{ fontSize: "32px", margin: "10px 0 0" }}>
              Become Best Known. Twelve months, one per market.
            </h2>
            <p style={{ marginTop: "14px" }}>
              The buildout gets you found. The twelve-month plan holds your category in your pack, so one business
              per category owns that spot in its market. The single month does not.
            </p>
            <p style={{ marginTop: "22px" }}>
              <a className="btn" href="https://www.bestknownbrand.com/start/" target="_blank" rel="noopener noreferrer">
                Is your market open?
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: "760px" }}>
          <p className="label">Questions</p>
          <h2>What people are asking.</h2>
          <div className="bkb-faq">
            {faq.map((item) => (
              <details key={item.q} className="lattice-card">
                <summary>
                  <h3>{item.q}</h3>
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "0" }}>
        <div className="wrap" style={{ maxWidth: "760px" }}>
          <div className="lattice-card bkb-final">
            <p className="label">Start this month</p>
            <h2>Get found. Become the best known brand in your market.</h2>
            <p>
              Russ Laggan has been in real estate since he was licensed at 33 in 2005, and became a broker at 36 in 2008.
              He wrote Be Followable. The buildout is how Best Known Brand puts your name where people and AI look first.
            </p>
            <div className="hero-actions">
              <BuyButton label="Start the buildout · $4,500" />
              <a className="btn ghost" href="#contact">
                Ask Russ a question
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
