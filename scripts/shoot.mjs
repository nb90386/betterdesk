// Usage: node scripts/shoot.mjs <baseUrl> <outDir> [paths comma-sep] [widths comma-sep] [browser]
import { chromium, webkit, firefox } from "@playwright/test";
import fs from "node:fs";
const [base, out, pathsArg = "/", widthsArg = "390,1440", browserName = "chromium"] = process.argv.slice(2);
const engines = { chromium, webkit, firefox };
fs.mkdirSync(out, { recursive: true });
const exe = browserName === "chromium" ? (process.env.CHROMIUM_PATH ?? `${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell`) : undefined;
const browser = await engines[browserName].launch(exe ? { executablePath: exe } : {});
const report = [];
for (const p of pathsArg.split(",")) {
  for (const w of widthsArg.split(",").map(Number)) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, deviceScaleFactor: 1, reducedMotion: process.env.MOTION === "1" ? "no-preference" : "reduce" });
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("response", (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`));
    await page.goto(base + p, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const name = `${(p === "/" ? "home" : p.slice(1).replaceAll("/", "_"))}-${w}-${browserName}`;
    await page.screenshot({ path: `${out}/${name}.png`, fullPage: process.env.FULL !== "0" });
    report.push({ path: p, width: w, browser: browserName, overflowPx: overflow, errors });
    await ctx.close();
  }
}
await browser.close();
fs.writeFileSync(`${out}/report-${browserName}.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.map((r) => [r.path, r.width, r.overflowPx, r.errors.length])));
