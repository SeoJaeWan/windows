/**
 * Base Vitest config shared across all packages and apps.
 * Does NOT hardcode any app-specific path aliases.
 * Each consumer merges this with their own `resolve.alias` if needed.
 */
export const baseConfig = {
  test: {
    globals: true as const,
    passWithNoTests: true as const,
    reporters: ["verbose" as const],
    coverage: {
      provider: "v8" as const,
      reporter: ["text" as const, "json" as const, "html" as const],
    },
  },
};

export default baseConfig;
