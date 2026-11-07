import { ImageResponse } from "next/og";

export const alt = "BetterDesk: every inquiry deserves an answer. From the first ring to the booked appointment.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, color: "#101214", fontFamily: "sans-serif", background: "radial-gradient(100% 90% at 10% -10%, #ffffff 0%, #f2f2ef 60%)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 34, fontWeight: 600, letterSpacing: -1 }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
            <path d="M6.6 1.9V16.4A5.1 5.1 0 1 1 8.09 20.01" stroke="#101214" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="6.6" cy="21.5" r="1.7" fill="#e2462c" />
          </svg>
          BetterDesk
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 92, lineHeight: 0.98, letterSpacing: -4, fontWeight: 700 }}>
          <span>Every inquiry</span>
          <span>deserves an answer.</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 0, fontSize: 26, color: "#595d65" }}>
          <div style={{ display: "flex", width: 14, height: 14, borderRadius: 7, background: "#e2462c" }} />
          <div style={{ display: "flex", width: 300, height: 2, background: "#e2462c" }} />
          <div style={{ display: "flex", padding: "12px 18px", borderRadius: 10, background: "#fbfbf9", color: "#101214", fontSize: 26, boxShadow: "0 10px 30px rgba(16,18,20,0.15)" }}>Thu · 8:00–10:00 AM · booked</div>
        </div>
      </div>
    ),
    size,
  );
}
