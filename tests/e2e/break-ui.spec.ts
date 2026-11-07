import { test, expect } from "@playwright/test";

/** break-ui: worst-case records through the real import path, then every workspace screen at phone and desktop widths. */
const NASTY = [
  "company,website,street,city,state,zip,category,sqft,contact name,role,email,notes",
  `"${"Northwestern Regional Pediatric and Family Dental Associates of Greater Central Denver Metropolitan Area LLC".slice(0, 120)}",averyveryveryveryveryverylongdomainnamewithoutanybreaksatall.example,1 Main St,Denver,CO,80203,Dental practice,9999999,Alexandria Konstantinopoulou-Vandersteenhoven,Practice administrator and facilities coordinator,alexandria.konstantinopoulou.vandersteenhoven@averyveryveryveryveryverylongdomainnamewithoutanybreaksatall.example,`,
  `"清洁服务 Café Zürich 🧽",cafe.example,2 Main St,Denver,CO,80206,Office,5200,李明,Owner,li@cafe.example,`,
  `X,x.example,3 Main St,Denver,CO,80218,Office,5000,Q,Ops,q@x.example,`,
].join("\n");

for (const width of [390, 1440]) {
  test(`worst-case data stays inside the layout @${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/app/scout");
    await page.locator('input[type="file"]').setInputFiles({ name: "worst.csv", mimeType: "text/csv", buffer: Buffer.from(NASTY) });
    await page.getByRole("button", { name: "Import and start Scout" }).click();
    await expect(page.getByText(/Waiting for your approval|drafts? (are|is) waiting/).first()).toBeVisible({ timeout: 20_000 });
    for (const route of ["/app", "/app/scout", "/app/opportunities", "/app/pipeline", "/app/customers", "/app/inbox"]) {
      await page.goto(route);
      await expect(page.getByText("Sample workspace · DEMO")).toBeVisible();
      await page.waitForTimeout(300);
      await page.screenshot({ path: `test-results/break-ui/${route.replace(/\//g, "_")}-${width}.png`, fullPage: true });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      const culprits = await page.evaluate(() => Array.from(document.querySelectorAll("main *")).filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1 && !el.closest("[role=region]")).slice(0, 4).map((el) => `${el.tagName}.${String((el as HTMLElement).className).slice(0, 60)}`));
      expect(overflow, `${route} overflows by ${overflow}px: ${culprits.join(" | ")}`).toBeLessThanOrEqual(0);
    }
  });
}
