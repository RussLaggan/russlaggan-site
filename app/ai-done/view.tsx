import { YouTube } from "@/components/youtube";
import { BuyButton, CheckoutNotice } from "./checkout";
import { faq } from "./faq";

function Check() {
  return (
    <svg viewBox="0 0 20 20" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const INCLUDED = [
  "Four 45-minute one-on-one training sessions",
  "Claude desktop app installed, with instruction on Claude Cowork and Claude Code",
  "A website build-out or optimization done together in working sessions, with training on doing it yourself with Claude. The system is yours.",
  "A HighLevel sub-account for social media posting",
  "Training on setting up and optimizing your Google Business Profile using Claude",
  "Training on using Claude Code to edit video",
  "Training on using Claude to research social media content",
];

const PROVIDE = [
  "Your domain or website access",
  "Your business details, social logins, and a computer for Claude",
  "Time for the kickoff and the sessions",
];

const MONTHLY = [
  "One 90-minute training session each month, one-on-one or with a small group from your team",
  "New skills, and anything you want to try but don't know how to do yet",
  "Continual skill updates for your AI, including Claude and Grok",
  "Best practices as AI changes, so you stay up to speed",
  "Email support for maintenance and technical issues, with a quick call when something needs fixing",
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
    body: "Your four one-on-one sessions, Claude setup, the website working sessions, and your HighLevel setup.",
  },
  {
    when: "End of the month",
    title: "Decide what's next",
    body: "At the end of the month, decide whether to continue with the twelve-month plan.",
  },
];

const FOR = [
  {
    label: "Real estate",
    title: "Agents and teams who already close",
    body: "You close deals. You want Claude handling the work that eats your week, and a website and social presence you can run yourself.",
  },
  {
    label: "Lending",
    title: "Mortgage lenders and brokers",
    body: "Learn to use Claude for your website, your Google Business Profile, and your social content.",
  },
  {
    label: "Personal brands",
    title: "When your name is the product",
    body: "Speakers, coaches, and authors who want to research, edit video, and post with Claude.",
  },
];

export function PageView() {
  return (
    <div className="field hue-coach bkb">
      <section className="section coach-hero" style={{ paddingTop: "72px" }}>
        <div className="wrap hero-grid">
          <div>
            <p className="label">AI Done · 1-Month AI Buildout</p>
            <h1>
              Put AI to work in your <em>business.</em>
            </h1>
            <p className="lede">
              We optimize and build out your AI together, to serve you and save you time.
            </p>
            <div className="hero-actions">
              <BuyButton label="Start the buildout · $4,500" />
              <a className="btn ghost" href="#included">
                See what's included
              </a>
            </div>
            <p className="lede" style={{ marginTop: "16px", color: "rgba(255,255,255,.78)", fontSize: "15px" }}>
              One payment, no subscription. The system is yours.
            </p>
          </div>
          <img
            className="coach-shot"
            src="/images/russ-whiteboard.webp"
            alt="Russ Laggan at the whiteboard"
            fetchPriority="high"
          />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="label">Real world results</p>
          <div className="cards">
            <article className="offer-card proof-card pop-vest">
              <div className="stat">1,692</div>
              <p>Agents recruited in 12 months. A recruiting engine, at 5.8 per person.</p>
            </article>
            <article className="offer-card proof-card pop-vest">
              <div className="stat">28</div>
              <p>Offices managed. Each one a team, with its own leader.</p>
            </article>
            <article className="offer-card proof-card pop-vest">
              <div className="stat">$970M</div>
              <p>Closed volume in 2017, across those offices.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <p className="label">Watch</p>
          <h2>Russ on who AI says is best.</h2>
          <div className="cards two">
            <article className="panel">
              <YouTube id="NP8GTmC4AKQ" title="Who Does AI Say Is the Best Agent in Your Town? The 5 Layers of AI" />
              <h3>Who Does AI Say Is the Best Agent in Your Town?</h3>
              <p>The 5 Layers of AI.</p>
            </article>
            <article className="panel">
              <YouTube id="4NdYxezxLgw" title="AI for Real Estate Agents: Why You Keep Getting Stuck, and the Fix" />
              <h3>Why you keep getting stuck</h3>
              <p>AI for real estate agents, and the fix.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" id="included" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <p className="label">The buildout</p>
          <h2>One month. One payment.</h2>
          <CheckoutNotice />
          <div className="offer-shell">
            <div className="offer-card">
              <h2 className="offer-title" style={{ fontSize: "32px", margin: "0" }}>
                Ai Done For You
              </h2>
              <p>Claude, your website, and HighLevel, set up with you.</p>
              <ul className="offer-list results">
                {INCLUDED.map((item) => (
                  <li key={item}>
                    <Check />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <h3 style={{ marginTop: "28px" }}>What you provide</h3>
              <ul className="offer-list results">
                {PROVIDE.map((item) => (
                  <li key={item}>
                    <Check />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="offer-pay">
              <p style={{ color: "#71717a" }}>One month, paid once</p>
              <p className="big">$4,500</p>
              <p>one time</p>
              <p style={{ marginTop: "8px", color: "#71717a" }}>No subscription.</p>
              <div style={{ marginTop: "22px" }}>
                <BuyButton />
              </div>
              <p style={{ marginTop: "14px", color: "#71717a", fontSize: "14px" }}>
                The system is yours. Secure checkout by Stripe.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="monthly" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <p className="label">Ai Done Monthly</p>
          <h2>Keep growing after the buildout.</h2>
          <div className="offer-shell">
            <div className="offer-card">
              <h2 className="offer-title" style={{ fontSize: "32px", margin: "0" }}>
                Ai Done Monthly
              </h2>
              <p>
                Ongoing training and development that empowers you to take your AI to the next level, every month. Not just maintenance.
              </p>
              <ul className="offer-list results">
                {MONTHLY.map((item) => (
                  <li key={item}>
                    <Check />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="offer-pay">
              <p style={{ color: "#71717a" }}>Ongoing, month to month</p>
              <p className="big">$497</p>
              <p>per month</p>
              <p style={{ marginTop: "8px", color: "#71717a" }}>Cancel anytime.</p>
              <div style={{ marginTop: "22px" }}>
                <BuyButton plan="monthly" label="Start Ai Done Monthly" />
              </div>
              <p style={{ marginTop: "14px", color: "#71717a", fontSize: "14px" }}>
                Secure checkout by Stripe.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: "760px" }}>
          <p className="label">How it works</p>
          <h2>From checkout to running in a month.</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "28px" }}>
            {STEPS.map((step) => (
              <article key={step.title} className="lattice-card">
                <p className="label">{step.when}</p>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <p className="label">Who it's for</p>
          <h2>Business owners ready to put AI to work.</h2>
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

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <article className="offer-card proof-card pop-vest">
            <p className="label" style={{ color: "rgba(255,255,255,.72)" }}>
              After the buildout
            </p>
            <h2 className="offer-title" style={{ fontSize: "32px", margin: "10px 0 0" }}>
              Keep going with the twelve-month plan.
            </h2>
            <p style={{ marginTop: "14px" }}>
              At the end of your month, you decide whether to continue with the twelve-month plan.
            </p>
            <p style={{ marginTop: "22px" }}>
              <a className="btn" href="https://www.bestknownbrand.com/start/" target="_blank" rel="noopener noreferrer">
                Is your market open?
              </a>
            </p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: "760px" }}>
          <p className="label">Questions</p>
          <h2>What people are asking.</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "28px" }}>
            {faq.map((item) => (
              <article key={item.q} className="lattice-card">
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ maxWidth: "760px" }}>
          <article className="lattice-card">
            <p className="label">Start this month</p>
            <h2 style={{ margin: "10px 0 14px" }}>Get AI done in your business this month.</h2>
            <p>
              Russ Laggan has been in real estate since he was licensed at 33 in 2005, and became a broker at 36 in 2008. He wrote Be Followable. He works one-on-one with you to set up Claude and train you to use it.
            </p>
            <div className="hero-actions">
              <BuyButton label="Start the buildout · $4,500" />
              <a className="btn ghost" href="#contact">
                Ask Russ a question
              </a>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
