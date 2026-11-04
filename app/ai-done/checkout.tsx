"use client";

import { useEffect, useState } from "react";

export function BuyButton({
  label = "Start the buildout",
  plan = "buildout",
}: {
  label?: string;
  plan?: "buildout" | "monthly";
}) {
  return (
    <form action="/api/bkb-checkout" method="post" className="bkb-buy">
      <input type="hidden" name="plan" value={plan} />
      <button className="btn" type="submit">
        {label}
      </button>
    </form>
  );
}

const NOTICES: Record<string, string> = {
  cancelled: "Checkout was cancelled. Nothing was charged. Start again when you're ready.",
  unavailable: "Checkout isn't open right now. Use Contact Russ and we'll send you a payment link.",
};

export function CheckoutNotice() {
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const reason = new URLSearchParams(window.location.search).get("checkout") || "";
    setNotice(NOTICES[reason] || "");
  }, []);
  if (!notice) return null;
  return (
    <p className="bkb-notice" role="status">
      {notice}
    </p>
  );
}
