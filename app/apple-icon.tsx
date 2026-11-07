import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1d1f22" }}>
        <svg width="118" height="118" viewBox="0 0 32 32" fill="#eeede8"><rect x="6" y="3" width="5" height="26" rx="1.2" /><path d="M13.5 29V13.5A15.5 15.5 0 0 1 29 29z" /></svg>
      </div>
    ),
    size,
  );
}
