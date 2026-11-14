"use client";

export function PriceToggle() {
  return (
    <div className="offer-pay">
      <p style={{ marginTop: "18px", color: "#71717a" }}>$1,500 a month for 3 months</p>
      <p className="big">$1,500</p>
      <p>per month for 3 months</p>
      <p style={{ marginTop: "12px", color: "#71717a" }}>
        Ends automatically after the third payment. Nothing renews. Ten seats.
      </p>
      <p style={{ marginTop: "22px" }}>
        <button
          type="button"
          className="btn"
          onClick={() => {
            window.location.href = "/api/checkout?plan=month";
          }}
        >
          Buy now
        </button>
      </p>
    </div>
  );
}
