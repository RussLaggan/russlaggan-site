import { CITIES, PROFILES } from "./schema";

const display = { fontSize: "var(--re-display)" } as const;

export function PageView() {
  return (
    <div className="field hue-coach re-page">
      <section className="section hero-wash re-hero">
        <div className="wrap re-hero-grid">
          <div>
            <h1 className="re-name" style={display}>
              Russ Laggan, REALTOR®
            </h1>
            <p className="re-broker" style={display}>
              Licensed Michigan real estate agent with eXp Realty LLC
            </p>
            <p className="re-disclosure">
              Licensed with eXp Realty LLC, 39555 Orchard Hill Place, Suite 600, Novi, MI 48375, 888-501-7085. Michigan real estate license #65010317013.
            </p>
            <p className="lede">
              I help people buy and sell homes in Livonia and nearby communities. Stop chasing. Start attracting.
            </p>
          </div>
          <img
            src="/images/russ-home.webp"
            width={575}
            height={800}
            alt="Russ Laggan, REALTOR®"
            className="portrait re-portrait"
            fetchPriority="high"
          />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="label">Hours</p>
          <h2>Hours</h2>
          <p className="lede">Monday–Friday 9:00 a.m.–5:00 p.m. Eastern. Closed Saturday and Sunday.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="label">Bio</p>
          <p className="lede">
            I&apos;m Russ Laggan, REALTOR®, a licensed Michigan real estate agent with eXp Realty. I got my license in Detroit at 33, in 2005, right before the market fell apart. I learned the business the hard way. At 36, in mid-2008, I became broker of record of my own Tampa office, and that office grew to 770 sales and 70 agents. I later spent about 10 years as an eXp executive, as Vice President of Training and Vice President of Growth. I&apos;m the author of Be Followable. I live in Detroit, and I help people buy and sell homes in Livonia and nearby communities. That still shapes how I work. Stop chasing. Start attracting.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="label">Service areas</p>
          <p className="lede">Areas served: Livonia and the communities listed here.</p>
          <ul className="re-cities">
            {CITIES.map((city) => (
              <li key={city}>{city}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="label">Contact</p>
          <h2>Contact</h2>
          <p className="lede">
            Email:{" "}
            <a className="re-text" href="mailto:russ@russlaggan.com">
              russ@russlaggan.com
            </a>
          </p>
          <h2 style={{ marginTop: 36 }}>Find me on</h2>
          <ul className="re-profiles">
            {PROFILES.map((profile) => (
              <li key={profile.href}>
                <a className="re-text" href={profile.href} target="_blank" rel="noopener noreferrer">
                  {profile.name}
                </a>
              </li>
            ))}
          </ul>
          <p className="lede re-also">
            <a className="re-text" href="/">
              Home
            </a>
            {" · "}
            <a className="re-text" href="/about">
              About
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
