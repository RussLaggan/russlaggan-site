"use client";

import { useEffect, useState } from "react";
import { NOTICES } from "./copy";

export function BuyButton({
  label = "Start the 12-month partnership",
  plan = "partnership",
  variant = "solid",
}: {
  label?: string;
  plan?: "partnership" | "buildout";
  variant?: "solid" | "ghost";
}) {
  return (
    <form action="/api/bkb-checkout" method="post" className="bkb-buy">
      <input type="hidden" name="plan" value={plan} />
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
