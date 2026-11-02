export function PageView() {
  return (
    <div className="field hue-cro">
      <section className="section" style={{ paddingTop: "72px" }}>
        <div className="wrap" style={{ maxWidth: "760px" }}>
          <p className="label">Consulting</p>
          <h1>
            Stop the <em>bleeding.</em>
          </h1>
          <p className="lede">
            For owners who are lost in the business. People are leaving as fast as they come in.
            Russ troubleshoots the company and builds a plan you can run: the right people, the
            right direction, and the right tools.
          </p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cards">
            <article className="panel">
              <p className="label">The bucket</p>
              <h3>Plug the holes first</h3>
              <p>
                Pouring more people into a bucket full of holes does not grow the company. Find
                where it leaks, stop the failures, then collect the water.
              </p>
            </article>
            <article className="panel">
              <p className="label">The plan</p>
              <h3>Doable and predictable</h3>
              <p>
                What you have. What you need. What would make the company worth joining. Criteria,
                roles, and tools, written so the next quarter is a plan and not a hope.
              </p>
            </article>
            <article className="panel">
              <p className="label">Recruiting</p>
              <h3>Tasks and metrics</h3>
              <p>
                A high-level recruiting plan with specific tasks and specific numbers, so the ball
                actually moves.
              </p>
            </article>
          </div>
          <div className="cards two" style={{ marginTop: "18px" }}>
            <article className="panel">
              <p className="label">How it starts</p>
              <h3>A 30-minute assessment call</h3>
              <p>
                What you are doing. What you are trying to do. What the work would look like. Then
                the price. Every company is different, so the format comes after the call.
              </p>
            </article>
            <article className="panel">
              <p className="label">In the room</p>
              <h3>A working session when the call says so</h3>
              <p>
                Some of this work is face to face. A six-hour session in the room: what you have,
                what is working, what is failing, and how you stop the failures before you add more
                people.
              </p>
            </article>
          </div>
          <p style={{ marginTop: "28px" }}>
            <a className="btn" href="#contact" data-interest="Consulting">
              Book a 30-minute assessment
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
