"use client";

import { useState } from "react";

export function PriceToggle() {
  const [up, setUp] = useState(false);
  const plan = up ? "upfront" : "month";
  return (
    <div className="offer-pay">
      <div className="price-toggle">
        <button type="button" className={up ? "" : "on"} onClick={() => setUp(false)}>
          By the month
        </button>
        <button type="button" className={up ? "on" : ""} onClick={() => setUp(true)}>
          Pay up front
        </button>
      </div>
      <p style={{ marginTop: "18px", color: "#71717a" }}>
        {up ? "10% off, six months paid once" : "$2,500 a month"}
      </p>
      <p className="big">{up ? "$13,500" : "$2,500"}</p>
      <p>{up ? "paid up front" : "per month"}</p>
      <p style={{ marginTop: "22px" }}>
        <button
          type="button"
          className="btn"
          onClick={() => {
            window.location.href = `/api/checkout?plan=${plan}`;
          }}
        >
          Buy now
        </button>
      </p>
    </div>
  );
}
