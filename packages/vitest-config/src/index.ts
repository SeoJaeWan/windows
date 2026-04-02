import type { UserConfig } from "vitest/config";

/**
 * Base Vitest config shared across all packages and apps.
 * Does NOT hardcode any app-specific path aliases.
 * Each consumer merges this with their own `resolve.alias` if needed.
 */
export const baseConfig = {
  test: {
    globals: true,
    passWithNoTests: true,
    reporters: ["verbose"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
} satisfies UserConfig;

export default baseConfig;
