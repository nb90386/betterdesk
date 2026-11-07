import { test, expect, type Page } from "@playwright/test";

const ROUTES = ["/", "/platform", "/how-it-works", "/demo", "/pricing", "/roi", "/solutions", "/solutions/home-services", "/solutions/beauty-wellness", "/contact"];
const WIDTHS = [320, 375, 390, 768, 1024, 1440, 1920];

function watch(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("response", (r) => r.status() >= 400 && !r.url().endsWith("/nope") && errors.push(`${r.status()} ${r.url()}`));
  return errors;
}

for (const route of ROUTES) {
  test(`route ${route}: 200, one h1, metadata, no errors, no overflow`, async ({ page }) => {
    const errors = watch(page);
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    expect((await page.title()).length).toBeGreaterThan(10);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{40,}/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await page.waitForLoadState("networkidle");
    // Console/network errors are asserted for a clean load; the reloads below abort in-flight prefetches by design.
    const loadErrors = [...errors];
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.reload();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `horizontal overflow at ${w}px`).toBeLessThanOrEqual(0);
    }
    expect(loadErrors).toEqual([]);
  });
}

test("every internal link on every page resolves", async ({ page, request }) => {
  const seen = new Set<string>();
  for (const route of ROUTES) {
    await page.goto(route);
    const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href") || ""));
    for (const h of hrefs) {
      if (h.startsWith("mailto:")) {
        expect(h).toContain("hello@betterdesk.ai");
        continue;
      }
      expect(h, `external or empty link on ${route}`).toMatch(/^\/|^#/);
      if (h.startsWith("/")) seen.add(h.split("#")[0]);
    }
  }
  for (const h of seen) {
    const r = await request.get(h);
    expect(r.status(), h).toBe(200);
  }
});

test("unknown route renders the 404 page", async ({ page }) => {
  const res = await page.goto("/nope");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /didn.t pick up/ })).toBeVisible();
});

test("mobile menu opens, navigates and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const btn = page.getByRole("button", { name: "Open menu" });
  await btn.click();
  const menu = page.locator("#mobile-menu");
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(btn).toBeFocused();
  await btn.click();
  await menu.getByRole("link", { name: /Pricing/ }).click();
  await expect(page).toHaveURL(/\/pricing$/);
  await expect(page.locator("#mobile-menu")).toBeHidden();
});

test("lead journey: step, keyboard, play, and with/without", async ({ page }) => {
  await page.goto("/demo");
  const j = page.getByRole("region", { name: /Interactive walkthrough/ });
  await expect(j.getByText("Step 1 of 8")).toBeVisible();
  await j.getByRole("button", { name: "Next step" }).click();
  await expect(j.getByText("Step 2 of 8")).toBeVisible();
  await expect(j.getByRole("log")).toContainText("Sorry we missed your call");
  await j.getByRole("button", { name: "Next step" }).press("ArrowRight");
  await expect(j.getByText("Step 3 of 8")).toBeVisible();
  await j.getByRole("button", { name: "Without" }).click();
  await expect(j.getByText("Step 1 of 4")).toBeVisible();
  for (let i = 0; i < 3; i++) await j.getByRole("button", { name: "Next step" }).click();
  await expect(j.getByText("Booked with someone else")).toBeVisible();
  await expect(j.getByRole("button", { name: "Next step" })).toBeDisabled();
  await j.getByRole("tab", { name: /Late-night quote/ }).click();
  await expect(j.getByText("Step 1 of 3")).toBeVisible();
  await j.getByRole("button", { name: "With BetterDesk" }).click();
  await j.getByRole("button", { name: "Play walkthrough" }).click();
  await expect(j.getByRole("button", { name: "Pause" })).toBeVisible();
  await expect(j.getByText("Step 2 of 5")).toBeVisible({ timeout: 6000 });
  await j.getByRole("button", { name: "Pause" }).click();
  await expect(j.getByRole("button", { name: "Resume" })).toBeVisible();
});

test("product explorer: filter, calendar, handoff, approve draft", async ({ page }) => {
  await page.goto("/platform");
  await page.getByRole("button", { name: /^Instagram/ }).click();
  const list = page.getByRole("list", { name: "Conversations" });
  await expect(list.getByRole("button")).toHaveCount(1);
  await expect(list).toContainText("Leah K.");
  await page.getByRole("tab", { name: "Calendar" }).click();
  await page.getByRole("button", { name: /Water heater leak/ }).click();
  await expect(page.getByRole("log", { name: /Dana M\./ })).toBeVisible();
  await page.getByRole("tab", { name: /Needs a person/ }).click();
  await page.getByRole("listitem").filter({ hasText: "Marcus T." }).getByRole("button", { name: "Open conversation" }).click();
  await page.getByRole("button", { name: "Approve and send" }).click();
  await expect(page.getByText("sent after your approval")).toBeVisible();
  await page.getByRole("tab", { name: "Weekly summary" }).click();
  await expect(page.getByText(/6 conversations this week/)).toBeVisible();
  await expect(page.getByText(/nothing waiting on you/)).toBeVisible();
});

test("ROI calculator validates input and shows the formula", async ({ page }) => {
  await page.goto("/roi");
  const missed = page.getByLabel("Unanswered inquiries per week", { exact: true });
  await missed.fill("abc");
  await expect(page.getByRole("form", { name: "Your assumptions" }).getByRole("alert")).toContainText("Enter a number from 0 to 200");
  await missed.fill("10");
  await expect(page.getByRole("form", { name: "Your assumptions" }).getByRole("alert")).toHaveCount(0);
  const value = page.getByLabel("Average value of one job", { exact: true });
  await value.fill("300");
  // 10 × 4.33 × 40% × 30% × $300 = $1,560
  await expect(page.getByText("= $1,560 / month")).toBeVisible();
  await page.getByText(/Scale · \$599/).click();
  await expect(page.getByText("After Scale ($599)")).toBeVisible();
});

test("contact form validates, then composes the email", async ({ page }) => {
  await page.goto("/contact?plan=growth");
  await page.getByRole("button", { name: "Write the email" }).click();
  await expect(page.getByText("Tell us your name.")).toBeVisible();
  await expect(page.getByLabel("Your name")).toBeFocused();
  await page.getByLabel("Your name").fill("Sam Rivera");
  await page.getByLabel("Business name").fill("Ridgeline Test Co");
  await page.getByLabel("Email").fill("sam@");
  await page.getByRole("button", { name: "Write the email" }).click();
  await expect(page.getByText("That email doesn't look complete.")).toBeVisible();
  await page.getByLabel("Email").fill("sam@example.com");
  await expect(page.getByLabel(/Plan you/)).toHaveValue("growth");
  await page.getByRole("button", { name: "Write the email" }).click();
  await expect(page.getByRole("status")).toContainText("Your email app should now be open");
  await expect(page.getByRole("status")).toContainText("Interested in: Growth ($299/mo)");
});

test("reduced motion: hero shows the finished scene immediately", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  const booked = page.locator("figure").getByText("Thu · 8:00–10:00 AM");
  await expect(booked).toBeVisible();
  // v2: the booked card carries the entrance animation (3.1s delay when motion is allowed).
  // A 500ms bound still proves "immediate" while tolerating WebKit applying the reduced-motion emulation a frame late.
  await expect(page.locator("figure .pearl-card").first()).toHaveCSS("opacity", "1", { timeout: 500 });
  await ctx.close();
});

test("mobile sticky CTA appears after the hero, hides at the closing band and on /contact", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const bar = page.locator("div.fixed.bottom-0").filter({ hasText: "$149/mo" });
  await expect(bar).toHaveAttribute("aria-hidden", "true");
  await page.evaluate(() => window.scrollTo(0, 2400));
  await expect(bar).toHaveAttribute("aria-hidden", "false");
  await bar.getByRole("link", { name: "Book a demo" }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator("div.fixed.bottom-0").filter({ hasText: "$149/mo" })).toHaveCount(0);
  await page.goto("/");
  await page.locator("#cta-title").scrollIntoViewIfNeeded();
  await expect(bar).toHaveAttribute("aria-hidden", "true");
});

test("explorer: filtering away the open thread selects one that is visible", async ({ page }) => {
  await page.goto("/platform");
  await expect(page.getByRole("log", { name: /Dana M\./ })).toBeVisible();
  await page.getByRole("button", { name: /^Email/ }).click();
  await expect(page.getByRole("log", { name: /Omar R\./ })).toBeVisible();
});

// Regression: pearl surfaces inside the night token scope once rendered pearl-on-pearl text that axe did not flag.
test("reply-mode switcher: every text node meets contrast in all three modes", async ({ page }) => {
  await page.goto("/platform");
  const section = page.locator('[aria-labelledby="control-title"]');
  await section.scrollIntoViewIfNeeded();
  for (const mode of ["Assisted", "Escalation", "Autonomous"]) {
    await section.getByRole("button", { name: new RegExp(mode) }).first().click();
    await page.waitForTimeout(350);
    const failures = await section.evaluate((root) => {
      // Normalise any CSS colour (rgb, oklab, color-mix…) to sRGBA through a 1×1 canvas.
      const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
      const parse = (c: string) => {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = "#000";
        ctx.fillStyle = c;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
        return [r, g, b, a / 255];
      };
      const lum = ([r, g, b]: number[]) => {
        const f = (v: number) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const out: string[] = [];
      for (const el of Array.from(root.querySelectorAll<HTMLElement>("*"))) {
        const own = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent!.trim());
        if (!own || el.getClientRects().length === 0) continue;
        let bg: number[] | null = null;
        for (let a: HTMLElement | null = el; a; a = a.parentElement) {
          const cs = getComputedStyle(a);
          if (cs.backgroundImage !== "none") break; // gradient surface: not resolvable here
          const c = parse(cs.backgroundColor);
          if (c[3] > 0.9) { bg = c; break; }
        }
        if (!bg) continue;
        const raw = parse(getComputedStyle(el).color);
        const fg = [0, 1, 2].map((k) => raw[k] * raw[3] + bg![k] * (1 - raw[3])); // composite text alpha over its surface
        const [l1, l2] = [lum(fg), lum(bg)].sort((x, y) => y - x);
        const ratio = (l1 + 0.05) / (l2 + 0.05);
        if (ratio < 4.5) out.push(`${el.textContent!.trim().slice(0, 40)} (${ratio.toFixed(2)})`);
      }
      return out;
    });
    expect(failures, `${mode}: ${failures.join(" | ")}`).toEqual([]);
  }
});
