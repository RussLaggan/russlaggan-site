function Check({ children }: { children: string }) {
  return (
    <li>
      <svg viewBox="0 0 20 20" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
          clipRule="evenodd"
        />
      </svg>
      <span>{children}</span>
    </li>
  );
}

export function PageView({ pending = "" }: { pending?: string }) {
  return (
    <div className="field hue-coach">
      <section className="section" style={{ paddingTop: "72px" }}>
        <div className="wrap" style={{ maxWidth: "760px" }}>
          <p className="label">AI Done</p>
          <h1>
            Done for you. Done <em>with</em> you.
          </h1>
          <p className="lede">
            You keep getting parts from trainers, seminars, and half-finished setups. None of them
            function together. You get stuck, frustrated, and you still cannot use the thing.
          </p>
          <p className="lede">
            Picture a puzzle. The cover shows one picture. The pieces in the box belong to that
            picture. AI Done lines your pieces up with that cover, then builds the picture so you
            can use it. Right now you have pieces from fifteen different puzzles. They will never
            make the picture on the box.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <p className="label">Five layers</p>
          <h2>One system, from the person using it to the stack it runs on.</h2>
          <div className="cards" style={{ marginTop: "28px" }}>
            <article className="panel">
              <p className="label">01</p>
              <h3>The human operator</h3>
              <p>The person who actually uses the AI. The training starts there, with you.</p>
            </article>
            <article className="panel">
              <p className="label">02</p>
              <h3>The harness</h3>
              <p>
                Hands-on training on Claude, Grok, or the model you already chose. This is how you
                drive it, and how it starts to carry the work a virtual assistant was doing.
              </p>
            </article>
            <article className="panel">
              <p className="label">03</p>
              <h3>The context layer</h3>
              <p>
                A shared source of truth, so your tools can talk to each other and stop inventing a
                different version of your business every time.
              </p>
            </article>
            <article className="panel">
              <p className="label">04</p>
              <h3>The content layer</h3>
              <p>
                How you create the work that goes out: social, email, YouTube, and the other
                surfaces you already use.
              </p>
            </article>
            <article className="panel">
              <p className="label">05</p>
              <h3>The tech stack</h3>
              <p>
                The sources of truth, wired in. Marketing and operations both run on the same
                system.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} id="checkout">
        <div className="wrap">
          <div className="cards two">
            <article className="offer-card">
              <p className="label">One time</p>
              <h2 className="offer-title" style={{ fontSize: "32px", margin: "0" }}>
                AI setup
              </h2>
              <p>One-to-one. Built around your stack, your work, and the places you are stuck.</p>
              <ul className="offer-list results">
                <Check>Three private 90-minute sessions</Check>
                <Check>Extra 45-minute training sessions when the work needs them</Check>
                <Check>Claude and Grok, set up to replace or augment a virtual assistant</Check>
                <Check>A context layer your tools can share</Check>
                <Check>A way to produce content, and a stack that stays usable</Check>
              </ul>
              <p className="big">$4,500</p>
              <p>one time</p>
              {pending === "ai" ? (
                <p style={{ marginTop: "18px" }}>
                  The $4,500 checkout is not live yet. Russ is publishing that Stripe product.
                  Contact him and he will send the link.
                </p>
              ) : null}
              <p style={{ marginTop: "22px" }}>
                <a className="btn" href="/api/checkout?plan=ai">
                  Pay $4,500
                </a>
              </p>
            </article>
            <article className="offer-card">
              <p className="label">After the setup</p>
              <h2 className="offer-title" style={{ fontSize: "32px", margin: "0" }}>
                Monthly upkeep
              </h2>
              <p>
                Once a month, one-on-one, with an AI expert. Right now that session is with Brett.
                Maintenance on what we built, plus more training as the work changes.
              </p>
              <ul className="offer-list results">
                <Check>One scheduled session each month</Check>
                <Check>The stack stays current</Check>
                <Check>Room for the next thing that gets stuck</Check>
              </ul>
              <p style={{ marginTop: "18px" }}>
                The monthly price is on the Stripe product Russ is creating. It is not listed here
                until that product is live.
              </p>
              {pending === "month" ? (
                <p style={{ marginTop: "18px" }}>
                  The monthly checkout is not live yet. Contact Russ and he will send the link.
                </p>
              ) : null}
              <p style={{ marginTop: "22px" }}>
                <a className="btn" href="/api/checkout?plan=ai-month">
                  Start monthly upkeep
                </a>
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
