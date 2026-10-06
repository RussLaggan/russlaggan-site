export function SiteHeader() {
  return (
    <header className="nav"><div className="wrap nav-inner"><a className="wordmark" href="/"><span>russ</span>laggan</a><button className="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Menu"><span></span></button><nav className="nav-links" id="site-nav" aria-label="Primary"><a href="/speaking">Speaker</a><a href="/author">Author</a><a href="/coaching">Coach</a><a href="/trainer">Trainer</a><a href="/about">About</a><a href="https://www.bestknownbrand.com" target="_blank" rel="noopener noreferrer">Branding</a><a className="btn" href="#contact">Contact Russ</a></nav></div></header>
  );
}
