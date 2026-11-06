import { chromium } from "@playwright/test";
const b = await chromium.launch({ executablePath: `${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell` });
const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" })).newPage();
await p.goto("http://localhost:3917/pricing", { waitUntil: "networkidle" });
console.log(await p.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.right > window.innerWidth + 1) {
      let a = el.parentElement, clipped = false;
      while (a) { const o = getComputedStyle(a).overflowX; if (o !== "visible") { clipped = true; break; } a = a.parentElement; }
      out.push(el.tagName + "." + String(el.className).slice(0, 50) + " right=" + Math.round(r.right) + " clip=" + (clipped ? a.tagName + "." + String(a.className).slice(0, 60) + " ox=" + getComputedStyle(a).overflowX : "none"));
    }
  }
  return [document.documentElement.scrollWidth, out.slice(0, 6)];
}));
await b.close();
