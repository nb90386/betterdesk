import { readFile } from "node:fs/promises";
import { join } from "node:path";
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

export default async function OG() {
  const [semibold, regular] = await Promise.all([
    readFile(join(process.cwd(), "assets/og/GeneralSans-Semibold.otf")),
    readFile(join(process.cwd(), "assets/og/GeneralSans-Regular.otf")),
  ]);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ecebe6", color: "#151719", fontFamily: "General Sans", padding: 64, gap: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 560 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 32, fontWeight: 600, letterSpacing: -1 }}>
            <svg width="38" height="38" viewBox="0 0 32 32" fill="#151719"><rect x="6" y="3" width="5" height="26" rx="1.2" /><path d="M13.5 29V13.5A15.5 15.5 0 0 1 29 29z" /></svg>
            BetterDesk
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 66, lineHeight: 1, letterSpacing: -2.6, fontWeight: 600 }}>
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
      fonts: [
        { name: "General Sans", data: semibold, weight: 600, style: "normal" },
        { name: "General Sans", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
