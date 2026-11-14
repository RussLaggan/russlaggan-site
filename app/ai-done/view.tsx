import { YouTube } from "@/components/youtube";
import { BuyButton, CheckoutNotice } from "./checkout";
import {
  AUDIENCE,
  BUILDOUT,
  CLOSER,
  HERO,
  INCLUDED,
  MARKET,
  ONGOING,
  OPTIONS,
  PARTNERSHIP,
  PROVIDE,
  QUESTIONS,
  STEPS,
  SUBTITLE,
  VIDEOS,
  faq,
} from "./copy";

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

function Items({ items }: { items: string[] }) {
  return (
    <ul className="offer-list results">
      {items.map((item) => (
        <li key={item}>
          <Check />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const SITE_PHOTO = {
  src: "/images/russ-whiteboard.webp",
  alt: "Russ Laggan at the whiteboard",
};

const VIDEO_ALT: Record<string, string> = {
  NP8GTmC4AKQ: "Who Does AI Say Is the Best Agent in Your Town? The 5 Layers of AI",
  "4NdYxezxLgw": "AI for Real Estate Agents: Why You Keep Getting Stuck, and the Fix",
};

const SITE_BIO =
  "Russ Laggan has been in real estate since he was licensed at 33 in 2005, and became a broker at 36 in 2008. He wrote Be Followable. He works one-on-one with you to optimize the AI you already use and add workflows built on Grok and Claude. He runs his own business the same way.";

const SITE_PROOF = [
  { stat: "1,692", body: "Agents recruited in 12 months. A recruiting engine, at 5.8 per person." },
  { stat: "28", body: "Offices managed. Each one a team, with its own leader." },
  { stat: "$970M", body: "Closed volume in 2017, across those offices." },
];

export function PageView() {
  return (
    <div className="field hue-coach bkb">
      <section className="section coach-hero" style={{ paddingTop: "72px" }}>
        <div className="wrap hero-grid">
          <div>
            <p className="label">{HERO.label}</p>
            <h1>
              {HERO.titleLead}
              <em>{HERO.titleEm}</em>
            </h1>
            <p className="lede">{SUBTITLE}</p>
            <p className="bkb-solve">{HERO.solve}</p>
            <div className="hero-actions">
              <BuyButton label={HERO.primaryCta} plan="partnership" />
              <a className="btn ghost" href="#options">
                {HERO.secondaryCta}
              </a>
            </div>
            <p className="lede" style={{ marginTop: "16px", color: "rgba(255,255,255,.78)", fontSize: "15px" }}>
              {HERO.note}
            </p>
          </div>
          <img className="coach-shot" src={SITE_PHOTO.src} alt={SITE_PHOTO.alt} fetchPriority="high" />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="label">Real world results</p>
          <div className="cards">
            {SITE_PROOF.map((item) => (
              <article key={item.stat} className="offer-card proof-card pop-vest">
                <div className="stat">{item.stat}</div>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <p className="label">{VIDEOS.label}</p>
          <h2>{VIDEOS.title}</h2>
          <div className="cards two">
            {VIDEOS.items.map((item) => (
              <article key={item.id} className="panel">
                <YouTube id={item.id} title={item.title} alt={VIDEO_ALT[item.id] ?? ""} />
                <h3>{item.title}</h3>
                <p>{item.caption}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="options" style={{ paddingTop: 0 }}>
        <span id="included" hidden />
        <div className="wrap">
          <p className="label">{OPTIONS.label}</p>
          <h2>{OPTIONS.title}</h2>
          <p className="lede" style={{ maxWidth: "40rem" }}>
            {OPTIONS.intro}
          </p>
          <CheckoutNotice />
          <div className="bkb-plans">
            <article className="bkb-plan is-primary" id={PARTNERSHIP.id}>
              <div className="offer-card">
                <p className="bkb-recommend">{PARTNERSHIP.badge}</p>
                <h2 className="offer-title" style={{ fontSize: "32px", margin: "0" }}>
                  {PARTNERSHIP.name}
                </h2>
                <p>{PARTNERSHIP.summary}</p>
                <h3 style={{ marginTop: "28px" }}>{PARTNERSHIP.monthOneLabel}</h3>
                <Items items={INCLUDED} />
                <h3 style={{ marginTop: "28px" }}>{PARTNERSHIP.ongoingLabel}</h3>
                <Items items={ONGOING} />
                <h3 style={{ marginTop: "28px" }}>What you provide</h3>
                <Items items={PROVIDE} />
              </div>
              <div className="offer-pay">
                <p style={{ color: "#71717a" }}>12-month commitment</p>
                <p className="big">{PARTNERSHIP.price}</p>
                <p>{PARTNERSHIP.priceCaption}</p>
                <p style={{ marginTop: "8px" }}>{PARTNERSHIP.thenPrice}</p>
                <p style={{ color: "#71717a" }}>{PARTNERSHIP.thenCaption}</p>
                <p className="bkb-terms">{PARTNERSHIP.terms}</p>
                <div style={{ marginTop: "22px" }}>
                  <BuyButton plan="partnership" label={PARTNERSHIP.cta} />
                </div>
                <p style={{ marginTop: "14px", color: "#71717a", fontSize: "14px" }}>Secure checkout by Stripe.</p>
              </div>
            </article>

            <article className="bkb-plan" id={BUILDOUT.id} aria-label={BUILDOUT.name}>
              <div className="offer-card">
                <h2 className="offer-title" style={{ fontSize: "32px", margin: "0" }}>
                  {BUILDOUT.name}
                </h2>
                <p>{BUILDOUT.summary}</p>
                <h3 style={{ marginTop: "28px" }}>{BUILDOUT.includedLabel}</h3>
                <Items items={INCLUDED} />
                <h3 style={{ marginTop: "28px" }}>What you provide</h3>
                <Items items={PROVIDE} />
              </div>
              <div className="offer-pay">
                <p style={{ color: "#71717a" }}>One month, paid once</p>
                <p className="big">{BUILDOUT.price}</p>
                <p>{BUILDOUT.priceCaption}</p>
                <p className="bkb-terms">{BUILDOUT.terms}</p>
                <div style={{ marginTop: "22px" }}>
                  <BuyButton plan="buildout" label={BUILDOUT.cta} variant="ghost" />
                </div>
                <p style={{ marginTop: "14px", color: "#71717a", fontSize: "14px" }}>
                  The system is yours. Secure checkout by Stripe.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: "760px" }}>
          <p className="label">{STEPS.label}</p>
          <h2>{STEPS.title}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "28px" }}>
            {STEPS.items.map((step) => (
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
          <p className="label">{AUDIENCE.label}</p>
          <h2>{AUDIENCE.title}</h2>
          <div className="cards">
            {AUDIENCE.items.map((item) => (
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
              {MARKET.label}
            </p>
            <h2 className="offer-title" style={{ fontSize: "32px", margin: "10px 0 0" }}>
              {MARKET.title}
            </h2>
            <p style={{ marginTop: "14px" }}>{MARKET.body}</p>
            <p style={{ marginTop: "22px" }}>
              <a className="btn" href={MARKET.href} target="_blank" rel="noopener noreferrer">
                {MARKET.cta}
              </a>
            </p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: "760px" }}>
          <p className="label">{QUESTIONS.label}</p>
          <h2>{QUESTIONS.title}</h2>
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
            <p className="label">{CLOSER.label}</p>
            <h2 style={{ margin: "10px 0 14px" }}>{CLOSER.title}</h2>
            <p>{SITE_BIO}</p>
            <div className="hero-actions">
              <BuyButton label={CLOSER.primaryCta} plan="partnership" />
              <a className="btn ghost" href="#contact">
                {CLOSER.secondaryCta}
              </a>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
