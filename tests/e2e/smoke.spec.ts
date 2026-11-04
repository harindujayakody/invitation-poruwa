import { test, expect } from "@playwright/test";

const locales = ["si", "en"];
const pages = [
  { path: "", name: "home" },
  { path: "/design", name: "design" },
];

for (const locale of locales) {
  for (const p of pages) {
    test(`${p.name} page in [${locale}] loads without horizontal scroll`, async ({ page }) => {
      const url = `/${locale}${p.path}`;
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      await page.locator("h1").waitFor({ state: "visible" });

      // Small settle delay for fonts and layout
      await page.waitForTimeout(300);

      // Verify no horizontal overflow
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth
      );
      expect(overflow).toBe(false);

      // Save screenshot for the report
      const viewport = page.viewportSize();
      const width = viewport ? viewport.width : "unknown";
      await page.screenshot({
        path: `screenshots/${p.name}-${locale}-${width}.png`,
        fullPage: true,
      });
    });
  }
}
