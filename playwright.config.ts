import { defineConfig } from "@playwright/test";

const port = process.env.PORT || 3972;
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  use: { baseURL },
  workers: 1,
  projects: [
    { name: "phone-360", use: { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true } },
    { name: "tablet-768", use: { viewport: { width: 768, height: 1024 } } },
    { name: "desktop-1280", use: { viewport: { width: 1280, height: 800 } } },
  ],
  webServer: { command: `npm run dev -- -p ${port}`, url: baseURL, reuseExistingServer: true },
});
