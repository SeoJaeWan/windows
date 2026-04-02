import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    passWithNoTests: true,
    reporters: ["verbose"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
    projects: ["apps/*/vitest.config.ts", "packages/*/vitest.config.ts"],
  },
});
