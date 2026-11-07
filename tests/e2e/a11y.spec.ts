import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = ["/", "/product", "/product/presence", "/product/scout", "/product/desk", "/how-it-works", "/solutions/commercial-cleaning", "/pricing", "/security", "/demo", "/contact", "/resources", "/resources/guides/ai-search-for-service-businesses", "/app", "/app/presence", "/app/scout", "/app/opportunities", "/app/inbox", "/app/pipeline", "/app/customers", "/app/settings"];

for (const route of ROUTES) {
  for (const width of [390, 1440]) {
    test(`axe: ${route} @${width}`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      const page = await ctx.newPage();
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      const summary = r.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
      expect(summary, summary.join("\n")).toEqual([]);
      await ctx.close();
    });
  }
}
