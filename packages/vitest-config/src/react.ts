import { baseConfig } from "./index.js";

/**
 * Vitest config preset for React component packages.
 * Uses jsdom environment. Does NOT import any Next.js or app-specific setup.
 */
export const reactConfig = {
  ...baseConfig,
  test: {
    ...baseConfig.test,
    environment: "jsdom" as const,
  },
};

export default reactConfig;
