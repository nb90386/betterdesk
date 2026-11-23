import { ImageResponse } from "next/og";

export const alt = "BetterDesk: find better accounts, be easier to find, book more walkthroughs. For commercial cleaning companies.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ROWS: [string, string, boolean][] = [
  ["Your website", "3 fixes found", false],
  ["Alder & Finch Architects", "Reply now", true],
  ["Juniper Lane Law", "Draft ready", false],
  ["Harborline Dental", "Walkthrough Tue 8:00", false],
];

// Rendered with next/og's bundled default font: the ITF font files used before cannot be redistributed.
export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ecebe6", color: "#151719", padding: 64, gap: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 560 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 32, fontWeight: 500, letterSpacing: -0.5 }}>
            <svg aria-hidden="true" width="38" height="38" viewBox="0 0 32 32" fill="#151719"><rect x="5" y="3" width="4.8" height="26" rx="1.4" /><path d="M12.2 3h3.3a13 13 0 0 1 0 26h-3.3z" /></svg>
            BetterDesk
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 64, lineHeight: 1.02, letterSpacing: -1.4, fontWeight: 500 }}>
            <span>Find better accounts.</span>
            <span>Be easier to find.</span>
            <span>Book more walkthroughs.</span>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#3a3d41", fontWeight: 400 }}>For commercial cleaning companies.</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, background: "#1d1f22", borderRadius: 16, padding: "28px 30px", color: "#eeede8" }}>
          <div style={{ display: "flex", fontSize: 17, color: "#a3a5a9", paddingBottom: 14, borderBottom: "1px solid #36393e" }}>Sample workspace · fictional company</div>
          {ROWS.map(([name, state, lit]) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 0", borderBottom: "1px solid #36393e", fontSize: 24 }}>
              <div style={{ display: "flex", width: 12, height: 12, borderRadius: 6, background: lit ? "#ffb547" : "#4a4d52" }} />
              <div style={{ display: "flex", flex: 1, fontWeight: 600 }}>{name}</div>
              <div style={{ display: "flex", fontSize: 19, color: lit ? "#ffb547" : "#a3a5a9" }}>{state}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
