export function PageView() {
  return (
    <div className="field">
      <section className="section" style={{ paddingTop: "72px", paddingBottom: "96px" }}>
        <div className="wrap" style={{ maxWidth: "720px" }}>
          <p className="label">Payment received</p>
          <h1>You're in.</h1>
          <p className="lede">
            Your payment went through. Russ will be in touch within one business day to schedule your first session.
          </p>
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
