// node scripts/sections.mjs <url> <outDir> <width> <selector,...>  — element screenshots + one mid-scroll viewport
import { chromium } from "@playwright/test";
import fs from "node:fs";
const [url, out, w, sels] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: `${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell` });
const p = await (await b.newContext({ viewport: { width: Number(w), height: 844 }, reducedMotion: "reduce" })).newPage();
await p.goto(url, { waitUntil: "networkidle" });
let i = 0;
for (const s of sels.split(",")) {
  const el = p.locator(s).first();
  await el.scrollIntoViewIfNeeded();
  await el.screenshot({ path: `${out}/sec-${w}-${i++}.png` });
}
await p.evaluate(() => window.scrollTo(0, 2600));
await p.waitForTimeout(500);
await p.screenshot({ path: `${out}/scroll-${w}.png` });
await b.close();
console.log("ok", i);
