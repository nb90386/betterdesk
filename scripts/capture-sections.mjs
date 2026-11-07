// node scripts/capture-sections.mjs <pass> [baseUrl] : element/section screenshots for critique
import { webkit } from "@playwright/test";
import { mkdirSync } from "node:fs";
const pass = process.argv[2] ?? "sections", base = process.argv[3] ?? "http://localhost:3918";
const out = `docs/quality-v2/screenshots/${pass}`; mkdirSync(out, { recursive: true });
const JOBS = [
  ["/", '[aria-labelledby="endings-title"]', "endings"],
  ["/", '[aria-labelledby="price-title"]', "home-pricing"],
  ["/", '[aria-labelledby="walk-title"]', "walkthrough"],
  ["/contact", "main", "contact"],
  ["/solutions/home-services", "main > section:first-of-type", "solution-hero"],
  ["/demo", "main", "demo"],
  ["/", '[aria-labelledby="cta-title"]', "close"],
  ["/", '[aria-labelledby="story-title"]', "story-to-peak"],
  ["/pricing", '[aria-labelledby="compare-title"]', "pricing-table"],
  ["/platform", '[aria-labelledby="control-title"]', "modeswitcher"],
  ["/solutions", "main", "solutions-index"],
];
const b = await webkit.launch();
for (const w of [1440, 390]) {
  const ctx = await b.newContext({ viewport: { width: w, height: w > 800 ? 900 : 844 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  for (const [route, sel, name] of JOBS) {
    await p.goto(base + route, { waitUntil: "networkidle" });
    const el = p.locator(sel).first();
    await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
    const box = await el.boundingBox();
    await p.screenshot({ path: `${out}/${name}-${w}.png`, fullPage: true, clip: { x: 0, y: box.y + (await p.evaluate(() => scrollY)), width: w, height: Math.min(box.height, 2400) } });
  }
  await ctx.close();
}
await b.close(); console.log("done");
