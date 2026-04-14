import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/postcss";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// ---------------------------------------------------------------------------
// Registration-aware CSF indexer
// ---------------------------------------------------------------------------
// Storybook v8's default CSF indexer uses static analysis and rejects
// imported-variable titles.  Our story files reference
// `FOUNDATION_REGISTRATION.<key>.title` so that the registration helper is the
// single source of truth.  The custom indexer below resolves those dynamic
// titles by reading the registration source file at index-time.
// ---------------------------------------------------------------------------

let _regTitles: Record<string, string> | undefined;

function getRegistrationTitles(): Record<string, string> {
  if (_regTitles) return _regTitles;
  const regPath = resolve(
    __dirname,
    "../src/components/taskbar/storybook/foundationFigmaRegistration.ts",
  );
  const src = readFileSync(regPath, "utf8");
  _regTitles = {};
  for (const m of src.matchAll(/(\w+):\s*\{[^}]*title:\s*"([^"]+)"/gs)) {
    _regTitles[m[1]] = m[2];
  }
  return _regTitles;
}

const foundationIndexer = {
  test: /(stories|story)\.(m?js|ts)x?$/,
  async createIndex(
    fileName: string,
    options: { makeTitle: (userTitle?: string) => string },
  ) {
    const src = readFileSync(fileName, "utf8");

    // Check if this file uses FOUNDATION_REGISTRATION for title
    const titleMatch = src.match(
      /title:\s*FOUNDATION_REGISTRATION\.(\w+)\.title/,
    );

    if (!titleMatch) {
      // For non-registration story files, fall back to lightweight regex
      // parsing so we avoid importing @storybook/core/csf-tools (which
      // is a server-only module unavailable in Vitest test analysis).
      const literalTitleMatch = src.match(/title:\s*["']([^"']+)["']/);
      const fallbackTitle = literalTitleMatch?.[1];
      const fallbackExports: string[] = [];
      for (const m of src.matchAll(
        /export\s+(?:const|function)\s+(\w+)/g,
      )) {
        if (m[1] !== "default") fallbackExports.push(m[1]);
      }
      return fallbackExports.map((exportName) => ({
        type: "story" as const,
        importPath: fileName,
        exportName,
        ...(fallbackTitle ? { title: options.makeTitle(fallbackTitle) } : {}),
      }));
    }

    // Resolve the dynamic title from the registration source
    const regKey = titleMatch[1];
    const titles = getRegistrationTitles();
    const rawTitle = titles[regKey];
    if (!rawTitle) {
      throw new Error(
        `FOUNDATION_REGISTRATION.${regKey}.title not found in registration source`,
      );
    }

    // Collect named story exports (skip default export)
    const storyExports: string[] = [];
    for (const m of src.matchAll(/export\s+(?:const|function)\s+(\w+)/g)) {
      if (m[1] !== "default") storyExports.push(m[1]);
    }

    return storyExports.map((exportName) => ({
      type: "story" as const,
      importPath: fileName,
      exportName,
      title: options.makeTitle(rawTitle),
    }));
  },
};

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
  ],
  // Replace the built-in CSF indexer with our registration-aware variant.
  // The function form receives the previous indexers array (which includes the
  // default CSF indexer prepended by the common preset); we swap it entirely so
  // that dynamic-title files are handled before the static-analysis parser
  // rejects them.
  experimental_indexers: () => [foundationIndexer],
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
