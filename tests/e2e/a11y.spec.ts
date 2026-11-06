import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = ["/", "/platform", "/how-it-works", "/demo", "/pricing", "/roi", "/solutions", "/solutions/home-services", "/solutions/beauty-wellness", "/contact"];

for (const route of ROUTES) {
  for (const width of [390, 1440]) {
    test(`axe: ${route} @${width}`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      const page = await ctx.newPage();
      await page.goto(route);
      const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      const summary = r.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
      expect(summary, summary.join("\n")).toEqual([]);
      await ctx.close();
    });
  }
}
