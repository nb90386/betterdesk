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

test("signal-to-booking: Play runs the whole conversation without scrolling", async ({ page }) => {
  await page.goto("/");
  await page.locator("#conversation").scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 40));
  const play = page.getByRole("button", { name: "Play the conversation" });
  await expect(play).toBeVisible();
  await play.click();
  await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
  await expect(page.locator("#conversation").getByText("Added to Alder Plumbing", { exact: false })).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole("button", { name: "Replay the conversation" })).toBeVisible({ timeout: 3000 });
  // Text equivalent is always present for assistive tech.
  await expect(page.locator("#conversation ol.sr-only li")).toHaveCount(5);
});

test("inbox: choosing a conversation shows its thread", async ({ page }) => {
  await page.goto("/platform");
  const list = page.getByRole("list", { name: "Conversations" });
  await list.getByRole("button", { name: /Dan K\./ }).click();
  await expect(list.getByRole("button", { name: /Dan K\./ })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Please leave the house now", { exact: false })).toBeVisible();
  await list.getByRole("button", { name: /Priya S\./ }).click();
  await expect(page.getByText("nothing is sent until you approve", { exact: false })).toBeVisible();
});

test("value calculator recomputes from inputs and shows its formula", async ({ page }) => {
  await page.goto("/roi");
  // Range inputs can't be typed into; set them the way a drag would (native setter + input event).
  const setRange = (label: RegExp, v: number) =>
    page.getByLabel(label).evaluate((el, val) => {
      const input = el as HTMLInputElement;
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, String(val));
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }, v);
  await setRange(/miss or answer late, per week/, 10);
  await setRange(/Average value of one job/, 300);
  // 10 × 4.33 × 40% × 30% × $300 = $1,560
  await expect(page.getByText("$1,560", { exact: true })).toBeVisible();
  await expect(page.getByText(/Math: 10 a week/)).toBeVisible();
  await page.getByLabel(/Scale/).check();
  await expect(page.getByText("$499 / mo")).toBeVisible();
});

test("contact form validates, then composes the email", async ({ page }) => {
  await page.goto("/contact?plan=growth");
  await page.getByRole("button", { name: "Write the email" }).click();
  await expect(page.getByText("Tell us your name.")).toBeVisible();
  await expect(page.getByLabel("Your name")).toBeFocused();
  await page.getByLabel("Your name").fill("Sam Rivera");
  await page.getByLabel("Business name").fill("Alder Test Co");
  await page.getByLabel("Email").fill("sam@");
  await page.getByRole("button", { name: "Write the email" }).click();
  await expect(page.getByText("That email doesn't look complete.")).toBeVisible();
  await page.getByLabel("Email").fill("sam@example.com");
  await expect(page.getByLabel(/Plan you/)).toHaveValue("growth");
  await page.getByRole("button", { name: "Write the email" }).click();
  await expect(page.getByRole("status")).toContainText("Your email app should now be open");
  await expect(page.getByRole("status")).toContainText("Interested in: Growth (proposed $249/mo)");
});

test("pricing: every plan is labelled as a proposal and links to the demo form", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page.getByText(/Proposed\. Currently published at/)).toHaveCount(3);
  for (const id of ["starter", "growth", "scale"]) await expect(page.locator(`a[href="/contact?plan=${id}"]`)).toHaveCount(1);
});

test("reduced motion: acts render statically with the full story", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const errors = watch(page);
  await page.goto("/");
  await expect(page.locator("section[data-pinned]")).toHaveCount(0);
  expect(errors, "no hydration mismatch under reduced motion").toEqual([]);
  await expect(page.locator("#conversation").getByText("Thanks Jess. We can be there Thursday", { exact: false })).toBeVisible();
  await expect(page.getByRole("heading", { name: "The call you couldn’t take." })).toBeVisible();
  await ctx.close();
});

test("mobile sticky CTA appears after the hero, steps aside on pinned acts and the close, absent on /contact", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const bar = page.locator("div.fixed.bottom-0").filter({ hasText: "See it on your own missed calls." });
  await expect(bar).toHaveAttribute("aria-hidden", "true");
  await page.locator("#inbox-title").scrollIntoViewIfNeeded();
  await expect(bar).toHaveAttribute("aria-hidden", "false");
  await page.locator("[data-close-cta]").scrollIntoViewIfNeeded();
  await expect(bar).toHaveAttribute("aria-hidden", "true");
  await page.locator("#inbox-title").scrollIntoViewIfNeeded();
  await bar.getByRole("link", { name: "Book a demo" }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator("div.fixed.bottom-0").filter({ hasText: "See it on your own missed calls." })).toHaveCount(0);
});

test("header turns to graphite over the dark act", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("header");
  await expect(header).not.toHaveAttribute("data-dark", /.*/);
  await page.evaluate(() => {
    const el = document.querySelector("#conversation") as HTMLElement;
    window.scrollTo(0, el.offsetTop + 200);
  });
  await expect(header).toHaveAttribute("data-dark", "true");
});
