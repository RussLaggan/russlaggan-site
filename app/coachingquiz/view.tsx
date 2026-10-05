"use client";

import { useState } from "react";

const scenes = [
  {
    prompt: "Monday is already full. A partner wants a second business on top of the one that pays you.",
    options: [
      ["Keep the work that pays. Let the rest be a byproduct.", 1, null],
      ["Split the week in half so both feel fair.", 1, null],
      ["Hand the leads to someone else and stay the face.", 99, "no"],
    ],
  },
  {
    prompt: "You know the number you want. You do not know which work only you can do.",
    options: [
      ["Evaluate the day, cut what does not move it, then execute.", 2, null],
      ["Add a new system and keep everything already on the plate.", 2, null],
      ["Buy a website and a map pack and call that the plan.", 99, "no"],
    ],
  },
  {
    prompt: "The quarter is open. What do you actually want from Russ?",
    options: [
      ["The system. I will run it.", 99, "class"],
      ["Russ with me, on the work.", 99, "coach"],
      ["Him inside the company, on the revenue.", 99, "cro"],
    ],
  },
] as const;

const results: Record<string, [string, string]> = {
  class: [
    "Jumpstart.",
    "You want the system, and you will run it. Production, the people you already have, and a day you can score.",
  ],
  coach: [
    "Coaching.",
    "You want Russ with you. Coaching is $2,500 a month, or 10% off if you pay up front.",
  ],
  cro: [
    "Fractional chief revenue officer.",
    "He leads the revenue plan, the team, and the forecast. About four to five hours a month. About $10,000 a month.",
  ],
  no: [
    "This is not a fit.",
    "If you want someone else to generate the leads, or you want a website and a map pack, that is not his work. That conversation lives at bestknownbrand.com.",
  ],
};

export function PageView() {
  const [step, setStep] = useState(0);
  const [door, setDoor] = useState<string | null>(null);
  const scene = scenes[step];

  return (
    <div className="field">
      <section className="section" style={{ paddingTop: "56px" }}>
        <div className="wrap scene">
          <p className="label">Coaching quiz</p>
          <h2 id="qtitle">{door ? results[door][0] : "Where are you."}</h2>
          <p className="lede" id="qprompt">
            {door ? results[door][1] : scene.prompt}
          </p>
          <div className="choice" id="qopts">
            {door
              ? null
              : scene.options.map((option) => (
                  <button
                    key={option[0]}
                    type="button"
                    onClick={() => {
                      if (option[2]) setDoor(option[2]);
                      else setStep(option[1]);
                    }}
                  >
                    {option[0]}
                  </button>
                ))}
          </div>
          <div className="hero-actions" id="qend" hidden={!door}>
            {door === "no" ? (
              <a className="btn" href="https://bestknownbrand.com">
                bestknownbrand.com
              </a>
            ) : door ? (
              <a className="btn" href="#contact" data-interest="Coaching">
                Contact Russ
              </a>
            ) : null}{" "}
            {door ? (
              <button
                type="button"
                className="btn ghost"
                onClick={() => {
                  setStep(0);
                  setDoor(null);
                }}
              >
                Start over
              </button>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
