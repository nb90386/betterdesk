// Collect console errors/warnings and page errors: node scripts/console.mjs <url> [width]
import path from "node:path";
import { chromium } from "@playwright/test";
process.env.PLAYWRIGHT_BROWSERS_PATH ??= path.resolve(".pw-browsers");
const [url, w = "1440"] = process.argv.slice(2);
const exe = `${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? exe });
const p = await b.newPage({ viewport: { width: Number(w), height: 900 } });
const out = [];
p.on("console", (m) => { if (["error", "warning"].includes(m.type())) out.push(`[${m.type()}] ${m.text().slice(0, 4000)}`); });
p.on("pageerror", (e) => out.push(`[pageerror] ${e.message.slice(0, 600)}`));
p.on("response", (r) => { if (r.status() >= 400) out.push(`[http ${r.status()}] ${r.url()}`); });
await p.goto(url, { waitUntil: "networkidle" });
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); } });
await p.waitForTimeout(800);
const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
console.log(out.length ? out.join("\n") : "no console errors");
console.log("horizontal overflow px:", overflow);
await b.close();
