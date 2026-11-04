"use client";

import { useEffect, useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onClick(event: MouseEvent) {
      const target = event.target as Element | null;
      if (!target) return;
      if (target.closest(".nav-toggle")) return;
      if (open && !target.closest("#site-nav")) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  function close() {
    setOpen(false);
  }

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a className="wordmark" href="/" onClick={close}>
          <span>russ</span>laggan
        </a>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open ? "true" : "false"}
          aria-controls="site-nav"
          aria-label="Menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span></span>
        </button>
        <nav className={open ? "nav-links open" : "nav-links"} id="site-nav" aria-label="Primary">
          <a href="/speaking" onClick={close}>
            Speaker
          </a>
          <a href="/author" onClick={close}>
            Author
          </a>
          <a href="/coaching" onClick={close}>
            Coach
          </a>
          <a href="/trainer" onClick={close}>
            Trainer
          </a>
          <a href="/consulting" onClick={close}>
            Consulting
          </a>
          <a href="/ai-done" onClick={close}>
            AI Done
          </a>
          <a href="/about" onClick={close}>
            About
          </a>
          <a href="https://www.bestknownbrand.com" target="_blank" rel="noopener noreferrer" onClick={close}>
            Branding
          </a>
          <a className="btn" href="#contact" onClick={close}>
            Contact Russ
          </a>
        </nav>
      </div>
    </header>
  );
}
