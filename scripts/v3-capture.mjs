// Usage: node scripts/v3-capture.mjs <baseUrl> <outDir> [widths=1440,390] [path=/] [browser=chromium]
// Captures the first viewport, pinned-act beats (scroll-scrubbed, motion on) and a full page per width.
import { chromium, webkit } from "@playwright/test";
import fs from "node:fs";

const [base, out, widthsArg = "1440,390", path = "/", browserName = "chromium"] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const exe = `${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
process.env.PLAYWRIGHT_BROWSERS_PATH ??= new URL("../.pw-browsers", import.meta.url).pathname;
const browser = browserName === "webkit" ? await webkit.launch() : await chromium.launch({ executablePath: exe });
const slug = path === "/" ? "home" : path.slice(1).replaceAll("/", "_");
const report = [];

for (const w of widthsArg.split(",").map(Number)) {
  const h = w < 800 ? 844 : w < 1300 ? 800 : 900;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: process.env.REDUCE ? "reduce" : "no-preference" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 200)));
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(2800);
  const tag = `${slug}-${w}${process.env.REDUCE ? "-reduced" : ""}`;
  await page.screenshot({ path: `${out}/${tag}-0-first.png` });

  if (path === "/" && !process.env.REDUCE) {
    const beats = [
      ["missed", "section[aria-labelledby=missed-title]", [0.05, 0.4, 0.62, 0.92]],
      ["signal", "#conversation", [0.04, 0.24, 0.45, 0.68, 0.95]],
    ];
    for (const [name, sel, ps] of beats) {
      for (const p of ps) {
        await page.evaluate(([s, pr]) => {
          const el = document.querySelector(s);
          const top = el.getBoundingClientRect().top + window.scrollY;
          window.scrollTo(0, top + pr * (el.offsetHeight - window.innerHeight));
        }, [sel, p]);
        await page.waitForTimeout(900);
        await page.screenshot({ path: `${out}/${tag}-${name}-${Math.round(p * 100)}.png` });
      }
    }
    for (const sel of ["#inbox-title", "#answers-title", "#value-title", "#pricing-title", "#close-title"]) {
      await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: "start" }), sel);
      await page.evaluate(() => window.scrollBy(0, -90));
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${out}/${tag}-${sel.slice(1)}.png` });
    }
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (process.env.FULL) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${out}/${tag}-full.png`, fullPage: true });
  }
  report.push({ path, width: w, overflow, errors });
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(report));
