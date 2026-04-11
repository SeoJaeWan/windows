import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    {
      directory: "../src/components/taskbar",
      files: "**/*.stories.tsx",
    },
  ],
  framework: "@storybook/react-vite",
};

export default config;
