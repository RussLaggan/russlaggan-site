export function PageView() {
  return (
    <div className="field hue-cro">
      <section className="section coach-hero" style={{ paddingTop: "72px" }}>
        <div className="wrap hero-grid">
          <div>
            <p className="label">Consulting</p>
            <h1>
              Stop the <em>bleeding.</em>
            </h1>
            <p className="lede">
              For owners who are lost in the business. People are leaving as fast as they come in. Russ troubleshoots the company and builds a plan you can run: the right people, the right direction, and the right tools.
            </p>
            <div className="hero-actions">
              <a className="btn" href="#contact" data-interest="Consulting">
                Book a 30-minute assessment
              </a>
            </div>
          </div>
          <img className="coach-shot" src="/images/russ-point.webp" alt="Russ Laggan" fetchPriority="high" />
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
          <p className="label">The work</p>
          <h2>Plug the holes. Then grow.</h2>
          <div className="cards">
            <article className="panel">
              <p className="label">The bucket</p>
              <h3>Plug the holes first</h3>
              <p>
                Pouring more people into a bucket full of holes does not grow the company. Find where it leaks, stop the failures, then collect the water.
              </p>
            </article>
            <article className="panel">
              <p className="label">The plan</p>
              <h3>Doable and predictable</h3>
              <p>
                What you have. What you need. What would make the company worth joining. Criteria, roles, and tools, written so the next quarter is a plan you can run.
              </p>
            </article>
            <article className="panel">
              <p className="label">Recruiting</p>
              <h3>Tasks and metrics</h3>
              <p>A high-level recruiting plan with specific tasks and specific numbers, so the ball actually moves.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cards two">
            <article className="lattice-card">
              <p className="label">How it starts</p>
              <h3>A 30-minute assessment call</h3>
              <p>
                What you are doing. What you are trying to do. What the work would look like. Then the price. Every company is different, so the format comes after the call.
              </p>
            </article>
            <article className="lattice-card">
              <p className="label">In the room</p>
              <h3>A working session when the call says so</h3>
              <p>
                Some of this work is face to face. A six-hour session in the room: what you have, what is working, what is failing, and how you stop the failures before you add more people.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ maxWidth: "760px" }}>
          <article className="lattice-card">
            <p className="label">Start here</p>
            <h2 style={{ margin: "10px 0 14px" }}>Book the assessment.</h2>
            <p>
              Thirty minutes. We look at what is leaking, what you are trying to build, and what the engagement would be. The price comes after that call.
            </p>
            <div className="hero-actions">
              <a className="btn" href="#contact" data-interest="Consulting">
                Book a 30-minute assessment
              </a>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
