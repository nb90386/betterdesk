import { ImageResponse } from "next/og";

export const alt = "BetterDesk: missed calls become booked appointments";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f3eee4", padding: 72, color: "#15181f", fontFamily: "serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, fontFamily: "sans-serif", fontWeight: 600 }}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: "#15181f", display: "flex", alignItems: "center", justifyContent: "center", color: "#fbf8f2", fontSize: 28 }}>B</div>
          BetterDesk
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, lineHeight: 1.02, letterSpacing: -2 }}>
          <span>Missed calls become</span>
          <span style={{ color: "#1e5a46", fontStyle: "italic" }}>booked appointments.</span>
        </div>
        <svg width="1056" height="40" viewBox="0 0 1056 40">
          <path d="M0 20 C 40 4, 60 36, 100 18 S 160 8, 220 20 L 1040 20" fill="none" stroke="#c23b1e" strokeWidth="3" />
          <circle cx="1040" cy="20" r="9" fill="#1e5a46" />
        </svg>
      </div>
    ),
    size,
  );
}
