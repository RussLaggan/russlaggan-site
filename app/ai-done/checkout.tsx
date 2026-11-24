"use client";

import { useEffect, useState } from "react";
import { BUILDOUT, NOTICES } from "./copy";

export function BuyButton({
  label = "Start the 12-month partnership",
  plan = "partnership",
  variant = "solid",
  trackOption = false,
}: {
  label?: string;
  plan?: "partnership" | "buildout";
  variant?: "solid" | "ghost";
  trackOption?: boolean;
}) {
  return (
    <form action="/api/bkb-checkout" method="post" className={trackOption ? "bkb-buy has-addon" : "bkb-buy"}>
      <input type="hidden" name="plan" value={plan} />
      {trackOption ? (
        <label className="bkb-track-opt">
          <input type="checkbox" name="addon" value="track" />
          <span>{BUILDOUT.trackOption}</span>
        </label>
      ) : null}
      <button className={variant === "ghost" ? "btn ghost" : "btn"} type="submit">
        {label}
      </button>
    </form>
  );
}

export function CheckoutNotice() {
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const reason = new URLSearchParams(window.location.search).get("checkout") || "";
    setNotice(NOTICES[reason as keyof typeof NOTICES] || "");
  }, []);
  if (!notice) return null;
  return (
    <p className="bkb-notice" role="status">
      {notice}
    </p>
  );
}
