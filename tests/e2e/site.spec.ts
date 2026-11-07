import { test, expect, type Page } from "@playwright/test";
import { PUBLIC_ROUTES } from "../../lib/site";

// Every public route, from the same list the sitemap uses, so new pages can't escape these checks.
const ROUTES: string[] = [...PUBLIC_ROUTES];
const WIDTHS = [320, 390, 768, 1024, 1440, 1920];

function watch(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("response", (r) => r.status() >= 400 && !r.url().endsWith("/nope") && !r.url().includes("/api/") && errors.push(`${r.status()} ${r.url()}`));
  return errors;
}

for (const route of ROUTES) {
  test(`route ${route}: 200, one h1, metadata, Sentient + General Sans, no errors, no overflow`, async ({ page }) => {
    const errors = watch(page);
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    expect(await page.title()).toMatch(/BetterDesk/);
    expect(await page.locator('meta[name="description"]').getAttribute("content")).toBeTruthy();
    expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toContain(route === "/" ? "" : route);
    const font = await page.evaluate(() => getComputedStyle(document.querySelector("h1")!).fontFamily);
    expect(font).toMatch(/sentient/i);
    expect(font).not.toMatch(/funnel|geist|instrument/i);
    const body = await page.evaluate(() => getComputedStyle(document.querySelector("main p")!).fontFamily);
    expect(body).toMatch(/general/i);
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: 900 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `overflow at ${w}px`).toBeLessThanOrEqual(0);
    }
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
}

test("no text pills: nothing with words inside is fully rounded", async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route);
    const pills = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>("body *"))
        .filter((el) => {
          const r = el.getBoundingClientRect();
          if (r.width < 24 || r.height < 14 || !el.textContent?.trim()) return false;
          const radius = parseFloat(getComputedStyle(el).borderTopLeftRadius);
          return radius >= r.height / 2 - 1 && r.width > r.height * 1.6;
        })
        .map((el) => `${el.tagName} "${el.textContent!.trim().slice(0, 30)}"`),
    );
    expect(pills, `${route}: ${pills.join(", ")}`).toEqual([]);
  }
});

test("every internal link on every page resolves", async ({ page, request }) => {
  const seen = new Set<string>();
  for (const route of ROUTES) {
    await page.goto(route);
    const hrefs = await page.$$eval("a[href^='/']", (as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!.split("#")[0]));
    hrefs.forEach((h) => h && seen.add(h));
  }
  for (const h of seen) {
    const r = await request.get(h);
    expect(r.status(), h).toBeLessThan(400);
  }
  for (const r of ROUTES) expect(seen.has(r) || r === "/", `${r} is linked from somewhere`).toBeTruthy();
});

test("sitemap and robots match the public routes", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const r of ROUTES) expect(xml).toContain(`${r === "/" ? "" : r}</loc>`);
  expect(xml).not.toContain("/app");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Disallow: \/app|Disallow: \//);
});

test("unknown route renders the directory 404", async ({ page }) => {
  const res = await page.goto("/nope");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /isn’t in the directory/ })).toBeVisible();
});

test("product popover opens from its trigger, closes on Escape and returns focus", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Product" });
  await trigger.click();
  await expect(page.getByRole("link", { name: /Presence/ }).first()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("mobile menu opens, navigates and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.locator("#mobile-menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-menu")).toHaveCount(0);
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.locator("#mobile-menu").getByRole("link", { name: /^Presence/ }).click();
  await expect(page).toHaveURL(/\/presence$/);
});

test("logo is a link home", async ({ page }) => {
  await page.goto("/pricing");
  await page.getByRole("link", { name: "BetterDesk home" }).first().click();
  await expect(page).toHaveURL(/\/$/);
});

test("review form: validates each step, then says truthfully that delivery isn't connected", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("What’s the business called?")).toBeVisible();
  await expect(page.getByLabel("Business name")).toBeFocused();
  await page.getByLabel("Business name").fill("Northfield Cleaning");
  await page.getByLabel("Where you clean").fill("Aurora");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Send request" }).click();
  await expect(page.getByText("Who should we reply to?")).toBeVisible();
  await page.getByLabel("Your name").fill("Pat Lee");
  await page.getByLabel("Work email").fill("pat@northfield.example.com");
  await page.getByText("Customers don’t find us online").click();
  await page.getByRole("checkbox").check();
  await page.waitForTimeout(2600); // the server rejects forms filled faster than a person types
  await page.getByRole("button", { name: "Send request" }).click();
  // On a deployment without LEAD_WEBHOOK_URL the honest outcome is "not connected", never a fake success.
  const blocked = page.getByRole("heading", { name: "This preview can’t deliver requests yet." });
  const sent = page.getByRole("heading", { name: "Your request is in." });
  await expect(blocked.or(sent)).toBeVisible();
  if (await blocked.isVisible()) await expect(page.getByRole("link", { name: "Email this request" })).toHaveAttribute("href", /^mailto:hello@betterdesk\.ai\?subject=Review%20request/);
});

test("review API rejects bots, bad input and wrong content types", async ({ request }) => {
  expect((await request.post("/api/review-request", { data: "x", headers: { "content-type": "text/plain" } })).status()).toBe(415);
  const tooFast = await request.post("/api/review-request", { data: { business: "A", serviceArea: "B", name: "C", email: "c@d.com", pain: "other", consent: true, startedAt: Date.now() } });
  expect(tooFast.status()).toBe(400);
  const honeypot = await request.post("/api/review-request", { data: { company_url: "spam", startedAt: Date.now() - 10_000 } });
  expect(honeypot.status()).toBe(400);
  const invalid = await request.post("/api/review-request", { data: { business: "", email: "bad", startedAt: Date.now() - 10_000 } });
  expect(invalid.status()).toBe(422);
  expect((await invalid.json()).errors.email).toBeTruthy();
});

test("presence: sample explorer creates a task; live audit refuses private addresses and missing authorization", async ({ page, request }) => {
  await page.goto("/product/presence");
  await page.locator("#sample").getByRole("button", { name: "Make this a task" }).first().click();
  await expect(page.locator("#sample").getByText(/^Task created for/).filter({ visible: true }).first()).toBeVisible();
  const noAuth = await request.post("/api/presence/audit", { data: { url: "https://example.com", businessName: "X", serviceArea: "Y", serviceCategory: "Z" } });
  expect((await noAuth.json()).code).toBe("not_authorized");
  for (const url of ["http://127.0.0.1", "http://169.254.169.254/latest/meta-data", "http://localhost:3000", "http://[::1]/", "http://2130706433/"]) {
    const r = await request.post("/api/presence/audit", { data: { url, businessName: "X", serviceArea: "Y", serviceCategory: "Z", authorized: true } });
    expect((await r.json()).code, url).toBe("blocked_url");
  }
});

test("guided demo runs the whole journey on the shared store and resets", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/demo");
  await page.getByRole("button", { name: "Make it a task" }).click();
  // The prepared sample already has yesterday's Scout run, so the demo moves straight to the introduction.
  await expect(page.getByRole("heading", { name: "Approve the introduction" })).toBeVisible();
  await page.getByRole("button", { name: /^Approve$/ }).click();
  await page.getByRole("button", { name: "Simulate delivery" }).click();
  await page.getByRole("button", { name: "Play the sample reply" }).click();
  await page.locator("main button", { hasText: /AM|PM/ }).first().click();
  await expect(page.getByText(/Walkthrough at Juniper Lane Law booked/)).toBeVisible();
  await page.getByRole("link", { name: "Open the record in the workspace" }).click();
  await expect(page).toHaveURL(/\/app\/customers\/acc_/);
  await expect(page.getByText("Sample workspace · DEMO")).toBeVisible();
  await expect(page.getByText(/Juniper Lane Law moved from In conversation to\s+Walkthrough scheduled/).first()).toBeVisible();
  await page.goto("/demo");
  await page.getByRole("button", { name: "Reset the sample" }).click();
  await expect(page.getByRole("heading", { name: "Check the website" })).toBeVisible();
});

test("homepage: reduced motion shows the board with step controls and no errors", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const errors = watch(page);
  await page.goto("/");
  await expect(page.getByText("Juniper Lane Law").first()).toBeVisible();
  await page.getByRole("button", { name: /Step 4: Customer/ }).click();
  await expect(page.getByText(/becomes a customer/)).toBeVisible();
  await page.waitForLoadState("networkidle");
  expect(errors).toEqual([]);
  await ctx.close();
});

test("homepage without JavaScript still says who it's for and what it does", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Find better accounts.");
  await expect(page.getByText(/one workspace for commercial cleaning companies/i)).toBeVisible();
  await expect(page.getByText("One Tuesday, five places to look.")).toBeVisible();
  await ctx.close();
});

test("pricing estimator responds immediately and uses the proposed math", async ({ page }) => {
  await page.goto("/pricing");
  const research = page.getByLabel("Businesses you’d have Scout check each month");
  await research.fill("1000"); // 500 over the included 500 = 2 top-ups of $39
  await page.getByLabel("Inquiries and replies each month").fill("300"); // exactly included
  await expect(page.getByText("$327", { exact: true })).toBeVisible();
  await research.fill("0");
  await expect(page.getByText("$249", { exact: true }).last()).toBeVisible();
});
