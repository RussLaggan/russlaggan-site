import { CITIES, PROFILES } from "./schema";

const PHOTO_CITIES = new Set(["Plymouth", "Northville", "Birmingham", "Royal Oak", "Farmington", "Canton"]);

const CITY_PHOTOS: Record<
  string,
  { src: string; width: number; height: number; caption: string; alt: string; feature?: boolean }
> = {
  Plymouth: {
    src: "/images/real-estate/city-plymouth",
    width: 1600,
    height: 1378,
    caption: "Kellogg Park, Plymouth",
    alt: "Illustrative photograph of the fountain at Kellogg Park in Plymouth, Michigan. Not a current listing.",
  },
  Northville: {
    src: "/images/real-estate/city-northville",
    width: 1600,
    height: 1024,
    caption: "Downtown Northville",
    alt: "Illustrative photograph of downtown Northville storefronts. Not a current listing.",
  },
  "Royal Oak": {
    src: "/images/real-estate/city-royal-oak",
    width: 2000,
    height: 1107,
    caption: "Downtown Royal Oak",
    alt: "Illustrative aerial photograph of downtown Royal Oak at dusk. Not a current listing.",
    feature: true,
  },
  Birmingham: {
    src: "/images/real-estate/city-birmingham",
    width: 1600,
    height: 799,
    caption: "Downtown Birmingham",
    alt: "Illustrative photograph of a downtown Birmingham building facade. Not a current listing.",
  },
  Farmington: {
    src: "/images/real-estate/city-farmington",
    width: 1600,
    height: 900,
    caption: "Downtown Farmington",
    alt: "Illustrative aerial photograph of downtown Farmington. Not a current listing.",
  },
  Canton: {
    src: "/images/real-estate/city-canton",
    width: 1600,
    height: 914,
    caption: "Village Theater, Canton",
    alt: "Illustrative photograph of the Village Theater building in Canton Township. Not a current listing.",
  },
};

const GALLERY = [
  {
    src: "/images/real-estate/gallery-suburban",
    width: 2400,
    height: 3600,
    caption: "Tree-lined neighborhood",
    alt: "Illustrative photograph of a suburban house behind a hedge on an overcast day. Not a current listing.",
  },
  {
    src: "/images/real-estate/gallery-stone-dusk",
    width: 2400,
    height: 1692,
    caption: "Evening exterior",
    alt: "Illustrative photograph of a stone house lit at dusk with holiday lights. Not a current listing.",
  },
  {
    src: "/images/real-estate/gallery-brick-manor",
    width: 2400,
    height: 1599,
    caption: "Brick residence and gardens",
    alt: "Illustrative photograph of a brick house with gardens and lawn. Not a current listing.",
  },
  {
    src: "/images/real-estate/gallery-columns",
    width: 2400,
    height: 1569,
    caption: "Columned entry",
    alt: "Illustrative photograph of a brick house with a columned front porch. Not a current listing.",
  },
] as const;

function Picture({
  src,
  width,
  height,
  alt,
  className,
  sizes,
  priority = false,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <picture>
      <source type="image/avif" srcSet={`${src}.avif`} />
      <source type="image/webp" srcSet={`${src}.webp`} />
      <img
        src={`${src}.jpg`}
        width={width}
        height={height}
        alt={alt}
        className={className}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}

export function PageView() {
  return (
    <div className="re-page">
      <p className="re-mobile-disclosure">
        Licensed with eXp Realty LLC, 39555 Orchard Hill Place, Suite 600, Novi, MI 48375, 888-501-7085. Michigan real
        estate license #65010317013.
      </p>

      <section className="re-hero" aria-label="Russ Laggan, REALTOR®">
        <div className="re-hero-media" aria-hidden="false">
          <picture>
            <source
              media="(max-width: 700px)"
              type="image/avif"
              srcSet="/images/real-estate/hero-dusk-mobile.avif"
            />
            <source media="(max-width: 700px)" type="image/webp" srcSet="/images/real-estate/hero-dusk-mobile.webp" />
            <source media="(max-width: 700px)" srcSet="/images/real-estate/hero-dusk-mobile.jpg" />
            <source type="image/avif" srcSet="/images/real-estate/hero-dusk.avif" />
            <source type="image/webp" srcSet="/images/real-estate/hero-dusk.webp" />
            <img
              className="re-hero-photo"
              src="/images/real-estate/hero-dusk.jpg"
              width={2800}
              height={1624}
              alt="Illustrative photograph of a brick home at dusk. Not a current listing."
              sizes="100vw"
              fetchPriority="high"
              decoding="sync"
            />
          </picture>
          <div className="re-hero-scrim" aria-hidden="true" />
        </div>

        <div className="re-hero-inner wrap">
          <div className="re-hero-copy">
            <h1 className="re-name">Russ Laggan, REALTOR®</h1>
            <p className="re-broker">Licensed Michigan real estate agent with eXp Realty LLC</p>
            <p className="re-disclosure re-disclosure-hero">
              Licensed with eXp Realty LLC, 39555 Orchard Hill Place, Suite 600, Novi, MI 48375, 888-501-7085. Michigan
              real estate license #65010317013.
            </p>
            <p className="re-lede">
              I help people buy and sell homes in Livonia and nearby communities. Stop chasing. Start attracting.
            </p>
            <p className="re-illustrative">Images are illustrative, not current listings.</p>
            <a className="re-ghost" href="mailto:russ@russlaggan.com">
              Email Russ
            </a>
          </div>
          <img
            src="/images/russ-home.webp"
            width={575}
            height={800}
            alt="Russ Laggan, REALTOR®"
            className="re-portrait"
          />
        </div>
      </section>

      <section className="re-section re-about">
        <div className="wrap re-measure">
          <p className="re-label">About Russ</p>
          <h2 className="re-h2">A Michigan REALTOR® shaped by the hard years.</h2>
          <p className="re-body">
            I&apos;m Russ Laggan, REALTOR®, a licensed Michigan real estate agent with eXp Realty. I got my license in
            Detroit at 33, in 2005, right before the market fell apart. I learned the business the hard way. At 36, in
            mid-2008, I became broker of record of my own Tampa office, and that office grew to 770 sales and 70 agents. I
            later spent about 10 years as an eXp executive, as Vice President of Training and Vice President of Growth.
            I&apos;m the author of Be Followable. I live in Detroit, and I help people buy and sell homes in Livonia and
            nearby communities. That still shapes how I work. Stop chasing. Start attracting.
          </p>
          <p className="re-hours">
            <strong>Hours.</strong> Monday–Friday 9:00 a.m.–5:00 p.m. Eastern. Closed Saturday and Sunday.
          </p>
          <p className="re-also">
            <a href="/">Home</a>
            {" · "}
            <a href="/about">About</a>
          </p>
        </div>
      </section>

      <section className="re-section re-gallery">
        <div className="wrap">
          <p className="re-label">Gallery</p>
          <h2 className="re-h2">Homes and neighborhoods we serve</h2>
          <p className="re-illustrative re-illustrative-inline">Images are illustrative, not current listings.</p>
          <ul className="re-gallery-list">
            {GALLERY.map((item) => (
              <li key={item.src}>
                <figure className="re-gallery-figure">
                  <Picture
                    src={item.src}
                    width={item.width}
                    height={item.height}
                    alt={item.alt}
                    className="re-gallery-img"
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 560px"
                  />
                  <figcaption>{item.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="re-section re-cities-section">
        <div className="wrap">
          <p className="re-label">Service areas</p>
          <h2 className="re-h2">Communities across Metro Detroit</h2>
          <p className="re-body re-measure">Areas served: Livonia and the communities listed here.</p>
          <ul className="re-city-grid">
            {CITIES.map((city) => {
              const photo = CITY_PHOTOS[city];
              if (photo && PHOTO_CITIES.has(city)) {
                return (
                  <li key={city} className={photo.feature ? "re-city-card re-city-feature" : "re-city-card"}>
                    <figure>
                      <Picture
                        src={photo.src}
                        width={photo.width}
                        height={photo.height}
                        alt={photo.alt}
                        className="re-city-img"
                        sizes={photo.feature ? "(max-width: 700px) 100vw, 66vw" : "(max-width: 700px) 50vw, 33vw"}
                      />
                      <figcaption>
                        <span className="re-city-name">{city}</span>
                        <span className="re-city-place">{photo.caption}</span>
                      </figcaption>
                    </figure>
                  </li>
                );
              }
              return (
                <li key={city} className="re-city-card re-city-text">
                  <span className="re-city-name">{city}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="re-section re-process">
        <div className="wrap re-measure">
          <p className="re-label">How I work</p>
          <h2 className="re-h2">Stop chasing. Start attracting.</h2>
          <ol className="re-beats">
            <li>
              <h3>Listen first</h3>
              <p>Start with where you are, and what you actually want from the move.</p>
            </li>
            <li>
              <h3>Tell the truth about the market</h3>
              <p>Clear numbers, clear tradeoffs, and no theater around the hard parts.</p>
            </li>
            <li>
              <h3>Attract the right buyer or the right home</h3>
              <p>Position the property—or your search—so the right people come to you.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="re-section re-contact">
        <div className="wrap re-measure">
          <p className="re-label">Contact</p>
          <h2 className="re-h2">Contact</h2>
          <p className="re-body">
            Email:{" "}
            <a className="re-link" href="mailto:russ@russlaggan.com">
              russ@russlaggan.com
            </a>
          </p>
          <p className="re-hours">Monday–Friday 9:00 a.m.–5:00 p.m. Eastern. Closed Saturday and Sunday.</p>
          <h3 className="re-h3">Find me on</h3>
          <ul className="re-profiles">
            {PROFILES.map((profile) => (
              <li key={profile.href}>
                <a className="re-link" href={profile.href} target="_blank" rel="noopener noreferrer">
                  {profile.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="re-section re-credits" aria-label="Image credits">
        <div className="wrap re-measure">
          <p className="re-label">Credits</p>
          <h2 className="re-h2">Media credits</h2>
          <ul className="re-credit-list">
            <li>
              Hero: Carlos de Miguel, <em>Red brick house at dusk</em>,{" "}
              <a className="re-link" href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">
                Unsplash License
              </a>
              ,{" "}
              <a
                className="re-link"
                href="https://unsplash.com/photos/red-brick-house-at-dusk-VoghxilbfEI"
                target="_blank"
                rel="noopener noreferrer"
              >
                source
              </a>
              ; cropped/resized.
            </li>
            <li>
              Gallery — tree-lined neighborhood: Sergej, <em>Suburban houses with trees and overcast sky</em>,{" "}
              <a className="re-link" href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">
                Unsplash License
              </a>
              ,{" "}
              <a
                className="re-link"
                href="https://unsplash.com/photos/suburban-houses-with-trees-and-overcast-sky-2OAfQvzGacI"
                target="_blank"
                rel="noopener noreferrer"
              >
                source
              </a>
              ; resized.
            </li>
            <li>
              Gallery — evening exterior: Eli Chamoun, <em>A luxurious stone house at sunset</em>,{" "}
              <a className="re-link" href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">
                Unsplash License
              </a>
              ,{" "}
              <a
                className="re-link"
                href="https://unsplash.com/photos/a-luxurious-stone-house-at-sunset-wJWIkGd0Jjw"
                target="_blank"
                rel="noopener noreferrer"
              >
                source
              </a>
              ; resized. (Ottawa; illustrative only.)
            </li>
            <li>
              Gallery — brick residence: Tanya Barrow, <em>Grand brick manor house with lush gardens and trees</em>,{" "}
              <a className="re-link" href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">
                Unsplash License
              </a>
              ,{" "}
              <a
                className="re-link"
                href="https://unsplash.com/photos/grand-brick-manor-house-with-lush-gardens-and-trees-f9tjpqwrUgQ"
                target="_blank"
                rel="noopener noreferrer"
              >
                source
              </a>
              ; resized.
            </li>
            <li>
              Gallery — columned entry: Roger Starnes Sr, <em>A large house with columns and pillars on the front of it</em>
              ,{" "}
              <a className="re-link" href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">
                Unsplash License
              </a>
              ,{" "}
              <a
                className="re-link"
                href="https://unsplash.com/photos/a-large-house-with-columns-and-pillars-on-the-front-of-it-poxP7wHb9iE"
                target="_blank"
                rel="noopener noreferrer"
              >
                source
              </a>
              ; resized.
            </li>
            <li>
              Plymouth city card: Antony-22, <em>Kellogg Park Pymouth 2019</em>,{" "}
              <a
                className="re-link"
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                CC BY-SA 4.0
              </a>
              ,{" "}
              <a
                className="re-link"
                href="https://commons.wikimedia.org/wiki/File:Kellogg_Park_Pymouth_2019.jpg"
                target="_blank"
                rel="noopener noreferrer"
              >
                source
              </a>
              ; cropped/resized.
            </li>
            <li>
              Northville city card: Dave Parker, <em>Northville Michigan Downtown</em>,{" "}
              <a
                className="re-link"
                href="https://creativecommons.org/licenses/by/3.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                CC BY 3.0
              </a>
              ,{" "}
              <a
                className="re-link"
                href="https://commons.wikimedia.org/wiki/File:NorthvilleMichiganDowntown1.jpg"
                target="_blank"
                rel="noopener noreferrer"
              >
                source
              </a>
              ; resized.
            </li>
            <li>
              Royal Oak city card: Lrgjr72, <em>Downtown Royal Oak, Michigan</em>,{" "}
              <a
                className="re-link"
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                CC BY-SA 4.0
              </a>
              ,{" "}
              <a
                className="re-link"
                href="https://commons.wikimedia.org/wiki/File:Downtown_Royal_Oak,_Michigan.jpg"
                target="_blank"
                rel="noopener noreferrer"
              >
                source
              </a>
              ; resized.
            </li>
            <li>
              Birmingham city card: Ken Lund, <em>Downtown Birmingham, Michigan</em>,{" "}
              <a
                className="re-link"
                href="https://creativecommons.org/licenses/by-sa/2.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                CC BY-SA 2.0
              </a>
              ,{" "}
              <a
                className="re-link"
                href="https://commons.wikimedia.org/wiki/File:Downtown_Birmingham,_Michigan.jpg"
                target="_blank"
                rel="noopener noreferrer"
              >
                source
              </a>
              ; cropped/resized to remove street-level numbers.
            </li>
            <li>
              Farmington city card: Lrgjr72, <em>Downtown Farmington MI (2022)</em>,{" "}
              <a
                className="re-link"
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                CC BY-SA 4.0
              </a>
              ,{" "}
              <a
                className="re-link"
                href="https://commons.wikimedia.org/wiki/File:Downtown_Farmington_MI_(2022).jpg"
                target="_blank"
                rel="noopener noreferrer"
              >
                source
              </a>
              ; resized.
            </li>
            <li>
              Canton city card: Dwight Burdette, <em>Village Theater Canton Twp. Michigan</em>,{" "}
              <a
                className="re-link"
                href="https://creativecommons.org/licenses/by/3.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                CC BY 3.0
              </a>
              ,{" "}
              <a
                className="re-link"
                href="https://commons.wikimedia.org/wiki/File:Village_Theater_Canton_Twp._Michigan.JPG"
                target="_blank"
                rel="noopener noreferrer"
              >
                source
              </a>
              ; cropped/resized to remove address numerals.
            </li>
          </ul>
          <p className="re-credit-note">
            Full source, license, author, retrieved date, and crop notes:{" "}
            <a className="re-link" href="/images/real-estate/CREDITS.md">
              CREDITS.md
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
