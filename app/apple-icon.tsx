import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1d1f22" }}>
        <svg aria-hidden="true" width="118" height="118" viewBox="0 0 32 32" fill="#eeede8"><rect x="5" y="3" width="4.8" height="26" rx="1.4" /><path d="M12.2 3h3.3a13 13 0 0 1 0 26h-3.3z" /></svg>
      </div>
    ),
    size,
  );
}
