import { test, expect, type Page } from "@playwright/test";

/**
 * Release blocker regression: a click to a different page must show the destination at its top
 * immediately. We start at the BOTTOM of a page, sample scrollY on every animation frame through the
 * navigation, and fail if any frame showing the destination's h1 is scrolled more than 40px, or if
 * the page settles anywhere but the top. Hash links, Back/Forward and query-only changes keep their
 * native behaviour.
 */

async function startAtBottom(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
  const fromH1 = await page.locator("h1").first().textContent();
  await page.evaluate(() => {
    const w = window as unknown as { __trace: [number, string][] };
    w.__trace = [];
    const t0 = performance.now();
    const tick = () => {
      w.__trace.push([Math.round(window.scrollY), document.querySelector("h1")?.textContent ?? ""]);
      if (performance.now() - t0 < 2500) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  return fromH1 ?? "";
}

async function expectArrivedAtTop(page: Page, url: RegExp, fromH1: string) {
  await expect(page).toHaveURL(url);
  await expect(page.locator("h1").first()).toBeVisible();
  await page.waitForTimeout(2600);
  const trace = await page.evaluate(() => (window as unknown as { __trace: [number, string][] }).__trace);
  const onNewPage = trace.filter(([, h1]) => h1 !== fromH1);
  expect(onNewPage.length, "the destination rendered").toBeGreaterThan(0);
  const scrolled = onNewPage.filter(([y]) => y > 40);
  expect(scrolled, `frames showing the new page away from the top: ${JSON.stringify(scrolled.slice(0, 5))}`).toEqual([]);
  expect(await page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(2);
  // The first heading clears the fixed header.
  const top = await page.locator("h1").first().evaluate((el) => el.getBoundingClientRect().top);
  expect(top).toBeGreaterThanOrEqual(68);
}

test.describe("navigation lands at the top", () => {
  test("header link from the bottom of home", async ({ page }) => {
    const from = await startAtBottom(page, "/");
    await page.locator("header").getByRole("link", { name: "Pricing" }).click();
    await expectArrivedAtTop(page, /\/pricing$/, from);
  });

  test("product menu link from the bottom of home", async ({ page }) => {
    const from = await startAtBottom(page, "/");
    await page.getByRole("button", { name: "Product" }).click();
    await page.locator("header").getByRole("link", { name: /^Scout/ }).click();
    await expectArrivedAtTop(page, /\/scout$/, from);
  });

  test("footer link from the bottom of presence", async ({ page }) => {
    const from = await startAtBottom(page, "/presence");
    await page.locator("#site-footer").getByRole("link", { name: "Desk", exact: true }).click();
    await expectArrivedAtTop(page, /\/desk$/, from);
  });

  test("pricing buttons", async ({ page }) => {
    const from = await startAtBottom(page, "/pricing");
    await page.getByRole("main").getByRole("link", { name: "Get a free check" }).first().click();
    await expectArrivedAtTop(page, /\/contact$/, from);
  });

  test("product CTA at the end of home", async ({ page }) => {
    const from = await startAtBottom(page, "/");
    await page.getByRole("main").getByRole("link", { name: "Try the demo first" }).click();
    await expectArrivedAtTop(page, /\/demo$/, from);
  });

  test("mobile menu on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const from = await startAtBottom(page, "/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator("#mobile-menu").getByRole("link", { name: "Pricing" }).click();
    await expectArrivedAtTop(page, /\/pricing$/, from);
    // The scroll lock is released and the page scrolls normally afterwards.
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
    await page.mouse.wheel(0, 600);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  });

  test("footer link on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const from = await startAtBottom(page, "/scout");
    await page.locator("#site-footer").getByRole("link", { name: "Security and data" }).click();
    await expectArrivedAtTop(page, /\/security$/, from);
  });

  test("reduced motion behaves the same", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    const from = await startAtBottom(page, "/product");
    await page.locator("#site-footer").getByRole("link", { name: "Pricing" }).click();
    await expectArrivedAtTop(page, /\/pricing$/, from);
    await ctx.close();
  });
});

test("hash link goes to its section, below the fixed header", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Check your own website" }).click();
  await expect(page).toHaveURL(/\/presence#check$/);
  await expect.poll(async () => page.locator("#check").evaluate((el) => Math.round(el.getBoundingClientRect().top))).toBeLessThan(140);
  const top = await page.locator("#check").evaluate((el) => el.getBoundingClientRect().top);
  expect(top).toBeGreaterThanOrEqual(0);
});

test("Back restores where you were; Forward returns to the top of the next page", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 2400));
  await page.waitForTimeout(300);
  await page.locator("header").getByRole("link", { name: "Pricing" }).click();
  await expect(page).toHaveURL(/\/pricing$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1500);
  await page.goForward();
  await expect(page).toHaveURL(/\/pricing$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(2);
});

test("keyboard: Enter on a nav link navigates and Tab continues from the top of the new page", async ({ page }) => {
  await page.goto("/");
  await page.locator("header").getByRole("link", { name: "Pricing" }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/pricing$/);
  expect(await page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(2);
  await page.keyboard.press("Tab");
  const focusedTop = await page.evaluate(() => (document.activeElement as HTMLElement | null)?.getBoundingClientRect().top ?? 0);
  expect(focusedTop).toBeLessThan(900);
});

test("query-only changes inside the workspace don't jump to the top", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 600 });
  await page.goto("/app/opportunities");
  await expect(page.getByText("Sample workspace · DEMO")).toBeVisible();
  const target = page.locator("main button, main a").filter({ hasText: /Tallgrass Pediatrics|Westwind Logistics|Maple & Main/ }).first();
  await target.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => window.scrollY);
  test.skip(before < 50, "list fits on screen at this size; nothing to preserve");
  await target.click();
  await expect(page).toHaveURL(/\?id=/);
  const after = await page.evaluate(() => window.scrollY);
  expect(Math.abs(after - before), `scrollY ${before} -> ${after}`).toBeLessThan(60);
});
