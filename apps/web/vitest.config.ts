import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { reactConfig } from "@windows/vitest-config/react";

export default defineConfig({
  ...reactConfig,
  plugins: [react()],
});
