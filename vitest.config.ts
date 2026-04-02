import { defineConfig, mergeConfig } from "vitest/config";
import { baseConfig } from "./packages/vitest-config/src/index.ts";

export default mergeConfig(baseConfig, defineConfig({
  test: {
    projects: ["apps/web/vitest.config.ts"],
  },
}));
