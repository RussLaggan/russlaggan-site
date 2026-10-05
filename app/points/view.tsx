"use client";

import { useEffect, useMemo, useState } from "react";

const items: [string, string, number][] = [
  ["text", "Text or message to get referrals", 1],
  ["prospect", "New prospect", 2],
  ["zoom", "Zoom or meet with an agent", 2],
  ["event", "Networking event, each agent added to your sphere", 2],
  ["meeting", "State meeting, AAC meeting, or teach a class", 5],
  ["call", "Phone call with a new prospect", 5],
  ["three", "Three-way call with a prospect", 5],
  ["follow", "Follow-up with a prospect", 5],
  ["lunch", "Lunch and learn with a referral", 10],
  ["webinar", "Webinar with a referral", 10],
  ["application", "Agent fills out an application", 20],
  ["referral", "Referral joins", 20],
  ["joins", "Agent joins", 30],
];

function dayKey(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return "russ-attraction-" + local.toISOString().slice(0, 10);
}

function readDay(date: Date) {
  if (typeof window === "undefined") return {} as Record<string, number>;
  try {
    return (JSON.parse(localStorage.getItem(dayKey(date)) || "{}").counts || {}) as Record<string, number>;
  } catch {
    return {} as Record<string, number>;
  }
}

function score(counts: Record<string, number>) {
  return items.reduce((sum, item) => sum + item[2] * (counts[item[0]] || 0), 0);
}

export function PageView() {
  const today = useMemo(() => new Date(), []);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCounts(readDay(today));
    setReady(true);
  }, [today]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(dayKey(today), JSON.stringify({ counts }));
  }, [counts, ready, today]);

  const dayTotal = score(counts);
  const weekStart = new Date(today);
  const weekday = weekStart.getDay();
  weekStart.setDate(weekStart.getDate() + (weekday === 0 ? -6 : 1 - weekday));
  weekStart.setHours(0, 0, 0, 0);
  let week = 0;
  for (let day = new Date(weekStart); day <= today; day.setDate(day.getDate() + 1)) {
    const same = day.toDateString() === today.toDateString();
    week += score(same ? counts : readDay(day));
  }
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  let month = 0;
  for (let day = new Date(monthStart); day <= today; day.setDate(day.getDate() + 1)) {
    const same = day.toDateString() === today.toDateString();
    month += score(same ? counts : readDay(day));
  }

  function change(id: string, by: number) {
    setCounts((current) => ({ ...current, [id]: Math.max(0, (current[id] || 0) + by) }));
  }

  return (
    <div className="field">
      <section className="section" style={{ paddingTop: "56px" }}>
        <div className="wrap">
          <p className="label">30 Points to Success</p>
          <h1>
            Score the
            <br />
            <em>attraction</em> work.
          </h1>
          <p className="lede">
            30 points a day. 150 a week. 600 a month. Hit the day and you are done.{" "}
            <a href="/30-points-attraction.pdf">Download the sheet</a>.
          </p>
          <div className="offer-shell">
            <div className="offer-card">
              <h2 className="offer-title" id="status" style={{ fontSize: "32px", margin: 0 }}>
                {dayTotal >= 30 ? "Done for the day." : "Today"}
              </h2>
              <ul className="plan-list" id="rows">
                {items.map((item) => (
                  <li key={item[0]} style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" }}>
                    <span>
                      {item[1]} · {item[2]} {item[2] === 1 ? "point" : "points"}
                    </span>
                    <span>
                      <button className="tick" type="button" aria-label="Remove" onClick={() => change(item[0], -1)}>
                        −
                      </button>
                      <strong className="count">{counts[item[0]] || 0}</strong>
                      <button className="tick" type="button" aria-label="Add" onClick={() => change(item[0], 1)}>
                        +
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="offer-pay">
              <p className="big" id="total">
                {dayTotal}
              </p>
              <p id="of">of 30 today</p>
              <p style={{ marginTop: "18px" }} id="week">
                {ready ? `${week} of 150 this week` : "0 of 150 this week"}
              </p>
              <p id="month">{ready ? `${month} of 600 this month` : "0 of 600 this month"}</p>
              <div className="lattice-card" style={{ marginTop: "22px", color: "#18181b" }}>
                <p>A phone call means you talked to the contact. A voicemail does not count.</p>
                <p style={{ marginTop: "10px" }}>A join means the paperwork is signed and the license has been switched.</p>
                <p style={{ marginTop: "10px" }}>Follow-up is a phone call or a text. Email does not score.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <style>{`
        .tick{border:0;background:transparent;color:#fff;font-size:20px;cursor:pointer;width:28px}
        .count{display:inline-block;min-width:1.5rem;text-align:center}
        .offer-pay .lattice-card p{color:#18181b}
      `}</style>
    </div>
  );
}
