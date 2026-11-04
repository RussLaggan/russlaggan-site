import { ImageResponse } from "next/og";

export const alt = "AI Done: 1-Month AI Buildout";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          color: "#fff",
          background: "linear-gradient(165deg, #3a62a8 0%, #1a4e8c 52%, #122848 100%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, textTransform: "uppercase", opacity: 0.85 }}>
          Best Known Brand · 1-Month AI Buildout
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2 }}>
            Put AI to work in your
          </div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2, color: "#ef5d17" }}>
            business.
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 30, opacity: 0.88 }}>
            1-Month AI Buildout. $4,500 one time.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 28 }}>
          <div style={{ display: "flex" }}>russlaggan.com/ai-done</div>
          <div style={{ display: "flex", padding: "12px 24px", borderRadius: 10, background: "#ef5d17", fontWeight: 700 }}>
            $4,500 one time
          </div>
        </div>
      </div>
    ),
    size,
  );
}
