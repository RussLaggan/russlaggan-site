"use client";

import { useState } from "react";

const MONTH = "https://buy.stripe.com/8x25kE1vxcUw3vng416J200";
const UPFRONT = "https://buy.stripe.com/cNi9AU0rtbQs0jb8Bz6J201";

export function PriceToggle() {
  const [up, setUp] = useState(false);
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
        <a className="btn" href={up ? UPFRONT : MONTH}>
          Buy now
        </a>
      </p>
    </div>
  );
}
