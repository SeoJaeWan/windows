import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/postcss";

const config: StorybookConfig = {
  stories: [
    {
      directory: "../src/components/taskbar",
      files: "**/*.stories.tsx",
    },
    {
      directory: "../src/components/panels/windows",
      files: "**/*.stories.tsx",
    },
    {
      directory: "../src/components/panels/search",
      files: "**/*.stories.tsx",
    },
    {
      directory: "../src/components/panels/taskbarHoverPreview",
      files: "**/*.stories.tsx",
    },
    {
      directory: "../src/components/panels/taskbarContextMenu",
      files: "**/*.stories.tsx",
    },
    {
      directory: "../src/components/panels/context",
      files: "**/*.stories.tsx",
    },
    {
      directory: "../src/components/windows",
      files: "**/*.stories.tsx",
    },
  ],
  framework: "@storybook/react-vite",
  viteFinal(viteConfig) {
    // Replace ancestor-directory PostCSS auto-discovery with a
    // package-local Tailwind v4 pipeline scoped to @windows/ui.
    viteConfig.css = {
      ...viteConfig.css,
      postcss: { plugins: [tailwindcss()] },
    };
    return viteConfig;
  },
};

export default config;
