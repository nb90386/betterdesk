// Batch capture: node scripts/capture.mjs <base> <outDir>
import path from "node:path";
import fs from "node:fs";
import { chromium, webkit } from "@playwright/test";
process.env.PLAYWRIGHT_BROWSERS_PATH ??= path.resolve(".pw-browsers");
const [base, out] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const exe = `${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
const routes = ["/", "/product", "/product/presence", "/product/scout", "/product/desk", "/solutions/commercial-cleaning", "/solutions/b2b-services", "/how-it-works", "/integrations", "/demo", "/pricing", "/resources", "/resources/guides/why-you-dont-show-up-in-local-search", "/contact", "/about", "/security", "/privacy", "/nope", "/app", "/app/presence", "/app/pipeline"];
const name = (r) => (r === "/" ? "home" : r.slice(1).replace(/\//g, "-"));
async function settle(p) {
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(600);
}
const cb = await chromium.launch({ executablePath: exe });
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const ctx = await cb.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  for (const r of routes) {
    await p.goto(base + r, { waitUntil: "networkidle" });
    await settle(p);
    await p.screenshot({ path: `${out}/${name(r)}-${w}-full.png`, fullPage: true });
    await p.screenshot({ path: `${out}/${name(r)}-${w}-first.png` });
  }
  await ctx.close();
}
for (const [w, h] of [[320, 700], [768, 1024], [1920, 1080]]) {
  const p = await cb.newPage({ viewport: { width: w, height: h } });
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${out}/home-${w}-first.png` });
  await p.close();
}
// states: popover open, mobile menu, form error
{ const p = await cb.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(base + "/", { waitUntil: "networkidle" }); await p.getByRole("button", { name: "Product" }).click(); await p.waitForTimeout(400);
  await p.screenshot({ path: `${out}/state-product-popover-1440.png` });
  await p.goto(base + "/contact", { waitUntil: "networkidle" }); await p.getByRole("button", { name: "Continue" }).click(); await p.waitForTimeout(300);
  await p.screenshot({ path: `${out}/state-contact-error-1440.png` });
  await p.keyboard.press("Tab"); await p.screenshot({ path: `${out}/state-contact-focus-1440.png` });
  await p.close();
  const m = await cb.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(base + "/", { waitUntil: "networkidle" }); await m.getByRole("button", { name: "Open menu" }).click(); await m.waitForTimeout(400);
  await m.screenshot({ path: `${out}/state-mobile-menu-390.png` }); await m.close(); }
await cb.close();
const wb = await webkit.launch();
const wp = await wb.newPage({ viewport: { width: 1440, height: 900 } });
await wp.goto(base + "/", { waitUntil: "networkidle" }); await wp.waitForTimeout(600);
await wp.screenshot({ path: `${out}/home-1440-webkit-first.png` });
await wb.close();
console.log("captured", fs.readdirSync(out).length, "files");
