import { defineConfig, mergeConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { reactConfig } from "../../packages/vitest-config/src/react.ts";

export default mergeConfig(reactConfig, defineConfig({
  plugins: [react()],
}));
