import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    passWithNoTests: true,
    reporters: ["verbose"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
    // packages/*는 구현체가 완성된 후 추가한다. 현재는 runner CLI 계약만 검증.
    projects: ["apps/*/vitest.config.ts"],
  },
});
