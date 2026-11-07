import { test, expect, type Page } from "@playwright/test";

const ROUTES = ["/", "/product", "/scout", "/how-it-works", "/solutions/commercial-cleaning", "/pricing", "/security", "/demo", "/contact"];
const APP = ["/app", "/app/scout", "/app/opportunities", "/app/inbox", "/app/pipeline", "/app/calendar", "/app/customers", "/app/analytics", "/app/settings"];
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
});

test("retired V3 routes redirect to their V4 pages", async ({ page }) => {
  for (const [from, to] of [["/platform", "/product"], ["/roi", "/pricing"], ["/solutions/home-services", "/solutions/commercial-cleaning"]]) {
    await page.goto(from);
    await expect(page).toHaveURL(new RegExp(`${to}$`));
  }
});

for (const route of APP) {
  test(`app ${route}: renders the sample workspace without errors`, async ({ page }) => {
    const errors = watch(page);
    await page.goto(route);
    await expect(page.getByText("Sample workspace · DEMO")).toBeVisible();
    await expect(page.locator("main h1")).toHaveCount(1);
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
}

async function runSampleScout(page: Page) {
  await page.goto("/app/scout");
  await page.getByRole("button", { name: /Use the sample list/ }).click();
  await expect(page.getByText(/10 rows ready, 1 skipped/)).toBeVisible();
  await page.getByRole("button", { name: "Import and start Scout" }).click();
  await expect(page.getByText("Waiting for your approval").first()).toBeVisible({ timeout: 15000 });
}

test("workflow: import, dedupe, qualify with evidence, draft, approve, simulate, reply, book, timeline", async ({ page }) => {
  await runSampleScout(page);
  const run = page.locator("section", { hasText: "Runs" }).first();
  await expect(run.getByText(/drafted, 1 need a business contact first, 1 blocked by suppression/)).toBeVisible();
  // Duplicate Cobalt Coworking was not imported twice.
  await page.goto("/app/customers");
  await expect(page.getByRole("link", { name: /Cobalt Coworking/ })).toHaveCount(1);
  // Suppressed contact got no draft.
  await page.goto("/app/scout");
  await expect(page.getByText("Sam Ortiz")).toHaveCount(0);
  // Qualification evidence is inspectable.
  await page.goto("/app/opportunities");
  await page.getByRole("button", { name: "Juniper Lane Law" }).click();
  const insp = page.getByRole("complementary", { name: /Qualification for Juniper Lane Law/ });
  await expect(insp.getByText("Inside your service area")).toBeVisible();
  await expect(insp.getByText(/Source: sample-prospects.csv/).first()).toBeVisible();
  // Approve requires a person and does not send.
  await page.goto("/app/scout#drafts");
  const card = page.locator("article", { hasText: "Elena Brooks" });
  await card.getByRole("button", { name: "Approve" }).click();
  await expect(page.locator("section", { hasText: "Recently reviewed" }).getByText("Not sent")).toBeVisible();
  await page.locator("li", { hasText: "Juniper Lane Law" }).getByRole("button", { name: /Simulate delivery/ }).click();
  // Simulated reply updates the record; booking moves the pipeline.
  await page.goto("/app/opportunities");
  await page.getByRole("button", { name: "Juniper Lane Law" }).click();
  await page.getByRole("link", { name: "Open record and timeline" }).click();
  await page.getByRole("button", { name: "Asks for a walkthrough" }).click();
  await expect(page.getByText(/Reply from Elena Brooks \(simulated\)/)).toBeVisible();
  await page.locator("section", { hasText: "Walkthrough" }).getByRole("button").first().click();
  await expect(page.getByText(/sample calendar; no real invite sent/)).toBeVisible();
  const timeline = page.locator("section", { hasText: "Timeline" }).first();
  for (const t of [/imported from sample-prospects.csv/, /strong fit/, /Introduction drafted/, /approved the introduction/, /Simulated delivery/, /Walkthrough at Juniper Lane Law booked/]) await expect(timeline.getByText(t).first()).toBeVisible();
  // Persistence: survives reload (browser-local).
  await page.reload();
  await expect(page.getByText(/Walkthrough at Juniper Lane Law booked/)).toBeVisible();
  await page.goto("/app/pipeline");
  const col = page.getByRole("listitem").filter({ has: page.getByRole("heading", { name: /Walkthrough scheduled/ }) });
  await expect(col.getByRole("link", { name: "Juniper Lane Law" })).toBeVisible();
});

test("honesty check blocks a deceptive edit; reset restores the baseline", async ({ page }) => {
  await runSampleScout(page);
  const card = page.locator("article").first();
  await card.getByLabel("Subject").fill("Re: our call");
  await expect(card.getByText("Subject can't pretend to be a reply or forward.")).toBeVisible();
  await expect(card.getByRole("button", { name: /approve/i })).toBeDisabled();
  await page.getByRole("button", { name: /Reset sample/ }).click();
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page.getByText("No runs yet")).toBeVisible();
});

test("canceling a run stops it; an unavailable provider shows a useful error", async ({ page }) => {
  await page.goto("/app/scout");
  await page.getByRole("button", { name: /Use the sample list/ }).click();
  await page.getByRole("button", { name: "Import and start Scout" }).click();
  await page.getByRole("button", { name: "Cancel run" }).click();
  await expect(page.getByText("Canceled", { exact: true })).toBeVisible();
  await page.waitForTimeout(2500);
  await expect(page.getByText("Nothing to approve")).toBeVisible();
  await page.getByRole("button", { name: "Try it anyway" }).click();
  await expect(page.getByRole("alert").filter({ hasText: /No business-data provider is connected/ }).first()).toBeVisible();
});

test("malformed CSV upload reports the problem instead of importing", async ({ page }) => {
  await page.goto("/app/scout");
  await page.getByLabel("Upload a prospect CSV").setInputFiles({ name: "bad.csv", mimeType: "text/csv", buffer: Buffer.from("foo,bar\n1,2\n") });
  await expect(page.getByText(/Missing a "name" column/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Import and start Scout" })).toBeDisabled();
});

test("suppression list: added addresses block replies", async ({ page }) => {
  await page.goto("/app/settings");
  await page.getByPlaceholder(/name@business.com/).fill("maya@alderfinch.example");
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.locator("li", { hasText: "do-not-contact" }).getByText("maya@alderfinch.example")).toBeVisible();
  await page.goto("/app/inbox");
  await page.getByLabel("Your reply").fill("Hi Maya, happy to help.");
  await page.getByRole("button", { name: /Record reply/ }).click();
  await expect(page.getByRole("alert").filter({ hasText: "opted out" })).toBeVisible();
});

test("website inquiry joins the inbox and creates an opportunity", async ({ page }) => {
  await page.goto("/app/inbox");
  await page.getByRole("button", { name: "Simulate a website inquiry" }).click();
  await page.getByRole("button", { name: "Submit sample inquiry" }).click();
  await expect(page.getByRole("button", { name: /Granite Peak Orthodontics/ })).toBeVisible();
  await page.goto("/app/opportunities");
  await expect(page.getByRole("button", { name: "Granite Peak Orthodontics" })).toBeVisible();
});

test("contact form validates, then composes the email", async ({ page }) => {
  await page.goto("/contact?plan=growth");
  await page.getByRole("button", { name: "Write the email" }).click();
  await expect(page.getByText("Tell us your name.")).toBeVisible();
  await page.getByLabel("Your name").fill("Sam Rivera");
  await page.getByLabel("Business name").fill("Rivera Cleaning Co");
  await page.getByLabel("Email").fill("sam@");
  await page.getByRole("button", { name: "Write the email" }).click();
  await expect(page.getByText("That email doesn't look complete.")).toBeVisible();
  await page.getByLabel("Email").fill("sam@example.com");
  await expect(page.getByLabel(/Plan you/)).toHaveValue("growth");
  await page.getByRole("button", { name: "Write the email" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Your email app should now be open" })).toContainText("Interested in: Growth (proposed $249/mo)");
});

test("pricing is labelled as a proposal and plan buttons go to the demo form", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page.getByText("Proposed early-access pricing. Not yet available to buy.").first()).toBeVisible();
  for (const id of ["essential", "growth", "team"]) await expect(page.locator(`a[href="/contact?plan=${id}"]`)).toHaveCount(1);
});

test("homepage: reduced motion renders the journey statically with no hydration errors", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = watch(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "One opportunity, start to finish." }).last()).toBeVisible();
  await expect(page.getByText("Won · recurring contract").last()).toBeVisible();
  await page.waitForLoadState("networkidle");
  expect(errors).toEqual([]);
  await ctx.close();
});

test("homepage without JavaScript still explains the product", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("More walkthroughs. Less chasing leads.");
  await expect(page.getByText("Today, one prospect lives in six places.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore BetterDesk" }).first()).toBeVisible();
  await ctx.close();
});

test("header turns dark over the petrol hero and light over limestone", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header")).toHaveAttribute("data-dark", "true");
  await page.locator("#scatter-title").scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 200));
  await expect(page.locator("header")).not.toHaveAttribute("data-dark", /.*/);
});
