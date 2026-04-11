import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    {
      directory: "../src/components/taskbar",
      files: "**/*.stories.tsx",
    },
  ],
  framework: "@storybook/react-vite",
  viteFinal(viteConfig) {
    // Prevent Vite from inheriting PostCSS / Tailwind config via
    // ancestor-directory auto-discovery. This keeps the Storybook
    // build fully self-contained within @windows/ui.
    viteConfig.css = {
      ...viteConfig.css,
      postcss: { plugins: [] },
    };
    return viteConfig;
  },
};

export default config;
