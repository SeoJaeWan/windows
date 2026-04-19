import { defineConfig, devices } from "@playwright/test";

/**
 * Storybook browser runner config — @windows/ui Storybook owner
 *
 * Target  : @windows/ui Storybook — http://localhost:6006
 * testDir : ./e2e/storybook/**   (Phase 6 owner files live here)
 *
 * This config is intentionally separate from playwright.config.ts which
 * owns @windows/web / http://localhost:3000. Mixing these two owners in
 * a single config is invalid per Phase 5 boundary contract.
 *
 * Storybook readiness source:
 *   pnpm --filter @windows/ui storybook   (dev)
 *   pnpm --filter @windows/ui build-storybook  (build)
 */
export default defineConfig({
  testDir: "./e2e/storybook",
  testMatch: "**/*.spec.ts",
  timeout: 30_000,
  reporter: [["list"], ["html", { outputFolder: "playwright-report-storybook" }]],
  outputDir: "test-results-storybook",
  use: {
    baseURL: "http://localhost:6006",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  /* @windows/ui Storybook dev server — port 6006 */
  webServer: {
    command: "pnpm --filter @windows/ui storybook",
    url: "http://localhost:6006",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
