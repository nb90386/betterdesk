// Usage: node scripts/v4-site-capture.mjs <baseUrl> <outDir> <widths comma> <paths comma> [chromium|webkit]
import { chromium, webkit } from "@playwright/test";
import fs from "node:fs";

const [base, out, widthsArg = "1440,390", pathsArg = "/", engine = "chromium"] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const exe = `${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
const browser = engine === "webkit" ? await webkit.launch() : await chromium.launch({ executablePath: exe });
const report = [];
for (const path of pathsArg.split(",")) {
  for (const w of widthsArg.split(",").map(Number)) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 800 ? 844 : w < 1300 ? 800 : 900 }, reducedMotion: process.env.REDUCE ? "reduce" : "no-preference" });
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 160)));
    page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));
    await page.goto(base + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(2600);
    const slug = (path === "/" ? "home" : path.slice(1).replaceAll("/", "_")) + `-${w}${process.env.REDUCE ? "-reduced" : ""}${engine === "webkit" ? "-webkit" : ""}`;
    await page.screenshot({ path: `${out}/${slug}-first.png` });
    if (path === "/" && w >= 1024 && !process.env.REDUCE) {
      for (const p of [0.05, 0.3, 0.55, 0.75, 0.97]) {
        await page.evaluate((pr) => {
          const el = document.querySelector("section[aria-labelledby=journey-title]");
          const top = el.getBoundingClientRect().top + window.scrollY;
          window.scrollTo(0, top + pr * (el.offsetHeight - window.innerHeight));
        }, p);
        await page.waitForTimeout(1100);
        await page.screenshot({ path: `${out}/${slug}-journey-${Math.round(p * 100)}.png` });
      }
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (process.env.FULL) { await page.evaluate(() => window.scrollTo(0, 0)); await page.screenshot({ path: `${out}/${slug}-full.png`, fullPage: true }); }
    report.push({ path, w, overflow, errors: errors.length ? errors : undefined });
    await ctx.close();
  }
}
await browser.close();
console.log(JSON.stringify(report));
