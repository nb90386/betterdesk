// Lists elements wider than the viewport: node scripts/overflow.mjs <url> [width]
import path from "node:path";
import { chromium } from "@playwright/test";
process.env.PLAYWRIGHT_BROWSERS_PATH ??= path.resolve(".pw-browsers");
const [url, w = "320"] = process.argv.slice(2);
const exe = `${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
const b = await chromium.launch({ executablePath: exe });
const p = await b.newPage({ viewport: { width: Number(w), height: 800 } });
await p.goto(url, { waitUntil: "networkidle" });
const out = await p.evaluate(() => {
  const vw = window.innerWidth; const res = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 && !el.closest(".overflow-x-auto")) res.push(`${el.tagName}.${String(el.className).slice(0, 70)} right=${Math.round(r.right)}`);
  }
  return res.slice(0, 8);
});
console.log(out.join("\n") || "none");
await b.close();
