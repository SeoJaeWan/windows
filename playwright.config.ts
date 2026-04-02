import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  /* E2E 스펙이 없어도 실패하지 않도록 */
  testMatch: "**/*.spec.ts",
  /* 각 테스트의 최대 실행 시간 */
  timeout: 30_000,
  /* 리포터 */
  reporter: [["list"], ["html", { outputFolder: "playwright-report" }]],
  /* 아티팩트 저장 경로 */
  outputDir: "test-results",
  use: {
    /* 웹 서버 기본 URL */
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  /* apps/web next dev 서버 연결 */
  webServer: {
    command: "pnpm --filter @windows/web dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
