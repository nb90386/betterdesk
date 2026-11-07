import { ImageResponse } from "next/og";

export const alt = "BetterDesk: every missed call, answered before they call someone else";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#f7f6f3",
          fontFamily: "sans-serif",
          background: "radial-gradient(110% 90% at 6% -10%, rgba(244,169,71,0.22) 0%, rgba(244,169,71,0.05) 35%, #0d0e10 65%)",
          backgroundColor: "#0d0e10",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, fontWeight: 600, letterSpacing: -1 }}>
          <svg width="52" height="52" viewBox="0 0 32 32" fill="none">
            <path d="M7.5 6.5v19" stroke="#f7f6f3" strokeWidth="3.6" strokeLinecap="round" />
            <path d="M7.5 6.5h4.5a9.5 9.5 0 0 1 0 19H7.5" stroke="#f7f6f3" strokeWidth="3.2" strokeLinejoin="round" />
            <path d="M24.4 8.2a12.6 12.6 0 0 1 0 15.6" stroke="#f4a947" strokeWidth="1.9" strokeLinecap="round" />
            <path d="M27.9 5.2a17 17 0 0 1 0 21.6" stroke="#f4a947" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.55" />
          </svg>
          BetterDesk
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 86, lineHeight: 1, letterSpacing: -3, fontWeight: 600 }}>
          <span>Every missed call, answered</span>
          <span style={{ color: "#a4a8ae" }}>before they call someone else.</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 26, color: "#a4a8ae" }}>
          <div style={{ display: "flex", padding: "12px 18px", borderRadius: 14, background: "#f3f1ec", color: "#111214", fontSize: 26 }}>Thu · 8:00–10:00 AM · booked</div>
          <span>The front desk for service businesses</span>
        </div>
      </div>
    ),
    size,
  );
}
