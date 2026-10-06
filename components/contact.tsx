"use client";

import { useEffect, useState } from "react";
import { site } from "@/site";

const CHOICES = [
  {
    name: "Speaking",
    blurb: "A keynote or a panel. Fun, funny, and built with steps people can use.",
  },
  {
    name: "Coaching",
    blurb: "Coaching on how to get where you want to go.",
  },
  {
    name: "Training",
    blurb: "Train your team. Get them on the same page, with measurable metrics, and build business from their sphere.",
  },
  {
    name: "Fractional CRO",
    blurb: "Get Russ as a fractional chief revenue officer for your organization to drive growth.",
  },
];

function Req() {
  return (
    <span className="rq-req" aria-hidden="true">
      *
    </span>
  );
}

export function Contact() {
  const [open, setOpen] = useState(false);
  const [interest, setInterest] = useState<string[]>([]);
  const [hover, setHover] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as Element | null;
      if (!target) return;
      const toggle = target.closest(".nav-toggle");
      const nav = document.getElementById("site-nav");
      if (toggle && nav) {
        const isOpen = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        return;
      }
      if (nav && nav.classList.contains("open") && !target.closest("#site-nav")) {
        nav.classList.remove("open");
        document.querySelector(".nav-toggle")?.setAttribute("aria-expanded", "false");
      }
      const link = target.closest("a");
      if (!link || link.getAttribute("href") !== "#contact") return;
      event.preventDefault();
      const preset = link.getAttribute("data-interest") || "";
      setInterest(preset && CHOICES.some((choice) => choice.name === preset) ? [preset] : []);
      setHover("");
      setSent(false);
      setError("");
      setOpen(true);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  function toggle(name: string) {
    setInterest((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name]
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const company = String(data.get("company") || "").trim();
    setSending(true);
    const payload = {
      first: String(data.get("first") || "").trim(),
      last: String(data.get("last") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      interest: interest.length ? interest.join(", ") : "Inquiry",
      message: String(data.get("message") || "").trim(),
      page: location.pathname,
      company,
    };
    try {
      const res = await fetch(site.contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setError("That did not send. Try again.");
        return;
      }
      if (!company) {
        setSent(true);
        form.reset();
        setInterest([]);
        setHover("");
      }
    } catch {
      setError("That did not send. Try again.");
    } finally {
      setSending(false);
    }
  }

  const shown = CHOICES.find((choice) => choice.name === hover);

  return (
    <>
      <style>{`
        .rq{position:fixed;inset:0;z-index:80;display:grid;place-items:center;padding:24px}
        .rq[hidden]{display:none}
        .rq-back{position:absolute;inset:0;background:rgba(18,8,24,.62)}
        .rq-card{position:relative;width:min(520px,100%);max-height:min(720px,calc(100vh - 48px));overflow:auto;background:#fff;color:#18181b;border-radius:16px;padding:28px 24px 24px;box-shadow:0 24px 60px -20px rgba(0,0,0,.45)}
        .rq-x{position:absolute;top:12px;right:12px;border:0;background:transparent;font-size:24px;line-height:1;cursor:pointer;color:#52525b}
        .rq-label{margin:0;font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#1a4e8c}
        .rq h2{margin:8px 0 0;font-size:32px;letter-spacing:-.04em;line-height:1}
        .rq-lede{margin:10px 0 18px;color:#52525b;font-size:15px;line-height:1.5}
        .rq form{display:grid;gap:12px}
        .rq-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .rq label{display:grid;gap:6px;font-size:13px;font-weight:600}
        .rq input,.rq textarea{width:100%;border:1px solid rgba(24,24,27,.14);border-radius:8px;padding:10px 12px;font:inherit;font-size:16px;font-weight:400;color:#18181b;background:#fff}
        .rq input:focus,.rq textarea:focus{outline:2px solid #ef5d17;border-color:transparent}
        .rq fieldset{border:0;margin:0;padding:0}
        .rq legend{font-size:13px;font-weight:600;margin-bottom:8px}
        .rq-req{color:#dc2626;font-size:16px;font-weight:700;line-height:1}
        .rq-opt{color:#71717a;font-weight:500}
        .rq-pills{display:flex;flex-wrap:wrap;gap:8px}
        .rq-pills button{border:1px solid rgba(24,24,27,.16);background:#fff;border-radius:8px;padding:8px 14px;font:inherit;font-size:14px;font-weight:600;cursor:pointer;color:#18181b}
        .rq-pills button[aria-pressed='true']{background:#ef5d17;border-color:#ef5d17;color:#fff}
        .rq-blurb{min-height:42px;margin:8px 0 0;color:#3f3f46;font-size:14px;font-weight:500;line-height:1.45}
        .rq-hp{position:absolute;left:-9999px;height:0;overflow:hidden}
        .rq-err{margin:0;color:#9a3412;font-size:14px}
        .rq-send{width:100%}
        .rq-done{display:grid;gap:12px}
        @media(max-width:560px){.rq{padding:0;align-items:end}.rq-card{width:100%;max-height:92vh;border-radius:16px 16px 0 0}.rq-row{grid-template-columns:1fr}}
      `}</style>
      <div className="rq" hidden={!open}>
        <div className="rq-back" onClick={close} />
        <div className="rq-card" role="dialog" aria-modal="true" aria-labelledby="rq-title">
          <button type="button" className="rq-x" onClick={close} aria-label="Close">
            ×
          </button>
          {sent ? (
            <div className="rq-done">
              <p className="rq-label">Sent</p>
              <h2>Russ has this.</h2>
              <p className="rq-lede">He will reply to you.</p>
              <button type="button" className="btn" onClick={close}>
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <p className="rq-label">Contact</p>
              <h2 id="rq-title">Contact Russ</h2>
              <p className="rq-lede">Name and email are enough. The rest is optional.</p>
              <div className="rq-row">
                <label>
                  <span>First name <Req /></span>
                  <input name="first" required autoComplete="given-name" />
                </label>
                <label>
                  <span>Last name <Req /></span>
                  <input name="last" required autoComplete="family-name" />
                </label>
              </div>
              <label>
                <span>Email <Req /></span>
                <input type="email" name="email" required autoComplete="email" />
              </label>
              <label>
                <span>Phone <span className="rq-opt">optional</span></span>
                <input type="tel" name="phone" autoComplete="tel" />
              </label>
              <fieldset>
                <legend>What do you want to talk about? <span className="rq-opt">optional</span></legend>
                <div className="rq-pills" onMouseLeave={() => setHover("")}>
                  {CHOICES.map((choice) => (
                    <button
                      key={choice.name}
                      type="button"
                      aria-pressed={interest.includes(choice.name)}
                      onMouseEnter={() => setHover(choice.name)}
                      onFocus={() => setHover(choice.name)}
                      onBlur={() => setHover("")}
                      onClick={() => toggle(choice.name)}
                    >
                      {choice.name}
                    </button>
                  ))}
                </div>
                <p className="rq-blurb" id="rq-blurb">
                  {shown ? shown.blurb : "You can skip these."}
                </p>
              </fieldset>
              <label>
                <span>Message <span className="rq-opt">optional</span></span>
                <textarea name="message" rows={4} />
              </label>
              <label className="rq-hp">
                Company
                <input name="company" tabIndex={-1} autoComplete="off" />
              </label>
              {error ? <p className="rq-err">{error}</p> : null}
              <button className="btn rq-send" type="submit" disabled={sending}>
                {sending ? "Sending" : "Send"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
