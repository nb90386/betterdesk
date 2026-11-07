// Visual QA capture: node scripts/capture-pass.mjs <passName> [baseUrl] [engine]
// Writes docs/quality-v2/screenshots/<pass>/ plus an index.html contact sheet.
import { webkit, chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const pass = process.argv[2] ?? "pass";
const base = process.argv[3] ?? "http://localhost:3917";
const engine = process.argv[4] === "chromium" ? chromium : webkit;
const out = `docs/quality-v2/screenshots/${pass}`;
mkdirSync(out, { recursive: true });

const WIDTHS = [
  [320, 700],
  [390, 844],
  [768, 1024],
  [1440, 900],
  [1920, 1080],
];
const PAGES = ["/platform", "/how-it-works", "/demo", "/pricing", "/solutions", "/roi", "/contact"];
const shots = [];
const browser = await engine.launch();

async function settle(page) {
  await page.waitForTimeout(1300);
}

for (const [w, h] of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: w < 800 ? 2 : 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await settle(page);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  const frames = [["top", 0], ["mid", 0.33], ["mid2", 0.55], ["bottom", 1]];
  for (const [name, f] of frames) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, H * f - (f === 1 ? h : 0)));
    await settle(page);
    const file = `home-${w}-${name}.png`;
    await page.screenshot({ path: `${out}/${file}` });
    shots.push({ file, label: `/ ${w} ${name}` });
  }
  if (w === 1440 || w === 390) {
    await page.evaluate(() => window.scrollTo(0, 0));
    // walk the page so scroll-driven content renders, then full-page
    for (let y = 0; y < H; y += h) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(250);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await settle(page);
    const file = `home-${w}-full.png`;
    await page.screenshot({ path: `${out}/${file}`, fullPage: true });
    shots.push({ file, label: `/ ${w} full` });
    for (const p of PAGES) {
      await page.goto(base + p, { waitUntil: "networkidle" });
      await settle(page);
      const f2 = `${p.slice(1).replace(/\//g, "_")}-${w}-top.png`;
      await page.screenshot({ path: `${out}/${f2}` });
      shots.push({ file: f2, label: `${p} ${w} top` });
    }
  }
  console.log(`${w}px height=${H} overflowX=${overflow} errors=${errors.length ? errors.join(" | ") : "none"}`);
  await ctx.close();
}
await browser.close();

writeFileSync(
  `${out}/index.html`,
  `<!doctype html><meta charset=utf-8><title>${pass}</title><style>body{font:13px system-ui;background:#111;color:#ddd;margin:20px}div{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}figure{margin:0}img{width:100%;border:1px solid #333}</style><h1>${pass}</h1><div>${shots
    .map((s) => `<figure><a href="${s.file}"><img src="${s.file}" loading=lazy></a><figcaption>${s.label}</figcaption></figure>`)
    .join("")}</div>`,
);
console.log(`wrote ${shots.length} shots to ${out}`);
