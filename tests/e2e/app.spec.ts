import { test, expect, type Page } from "@playwright/test";

// Workspace (sample) flows. Marketing routes live in site.spec.ts.
const APP = ["/app/presence", "/app", "/app/scout", "/app/opportunities", "/app/inbox", "/app/pipeline", "/app/calendar", "/app/customers", "/app/analytics", "/app/settings"];

function watch(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("response", (r) => r.status() >= 400 && !r.url().endsWith("/nope") && errors.push(`${r.status()} ${r.url()}`));
  return errors;
}


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
  await page.goto("/app/scout"); // the prepared sample already has drafts waiting
  const card = page.locator("article").first();
  await card.getByLabel("Subject").fill("Re: our call");
  await expect(card.getByText("Subject can't pretend to be a reply or forward.")).toBeVisible();
  await expect(card.getByRole("button", { name: /approve/i })).toBeDisabled();
  await page.getByRole("button", { name: /Reset sample/ }).click();
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  // Reset restores the prepared sample: yesterday's run, drafts waiting, and the deceptive edit gone.
  await expect(page.locator('input[value="Re: our call"]')).toHaveCount(0);
});

test("canceling a run stops it; an unavailable provider shows a useful error", async ({ page }) => {
  await page.goto("/app/scout");
  // New businesses (the sample list is already imported in the prepared workspace).
  await page.locator('input[type="file"]').setInputFiles({
    name: "new.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("company,website,street,city,state,zip,category,sqft,contact name,role,email\nNorthgate Clinic,northgate.example,100 Main St,Denver,CO,80203,Medical office,6000,Ana Ruiz,Office manager,ana@northgate.example\nEastline Offices,eastline.example,200 Main St,Denver,CO,80206,Office,9000,Ben Cho,Facilities,ben@eastline.example\n"),
  });
  await page.getByRole("button", { name: "Import and start Scout" }).click();
  await page.getByRole("button", { name: "Cancel run" }).click();
  await expect(page.getByText("Canceled", { exact: true })).toBeVisible();
  await page.waitForTimeout(2500);
  // A canceled run never drafts anything for the businesses it was given.
  await expect(page.locator("article", { hasText: "Northgate Clinic" })).toHaveCount(0);
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
