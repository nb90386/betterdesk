// Screenshot helper for design review: node scripts/shoot.mjs <url> <out.png> [width=1440] [height=900] [full=0] [engine=chromium] [scrollY=0]
// Uses the same browser locations as playwright.config.ts.
import path from "node:path";
import { chromium, webkit } from "@playwright/test";

process.env.PLAYWRIGHT_BROWSERS_PATH ??= path.resolve(".pw-browsers");
const [url, out, w = "1440", h = "900", full = "0", engine = "chromium", scrollY = "0"] = process.argv.slice(2);
if (!url || !out) {
  console.error("usage: node scripts/shoot.mjs <url> <out.png> [width] [height] [full 0|1] [chromium|webkit] [scrollY]");
  process.exit(1);
}
const exe = `${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
const browser = engine === "webkit" ? await webkit.launch() : await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? exe });
const page = await browser.newPage({ viewport: { width: Number(w), height: Number(h) }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
if (full === "1") {
  // Walk the page so scroll-revealed content settles before a full capture.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(500);
} else if (Number(scrollY) > 0) {
  await page.evaluate((y) => window.scrollTo(0, y), Number(scrollY));
  await page.waitForTimeout(700);
}
await page.waitForTimeout(400);
await page.screenshot({ path: out, fullPage: full === "1" });
await browser.close();
console.log("saved", out);
