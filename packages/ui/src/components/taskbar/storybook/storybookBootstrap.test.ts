import { describe, expect, it } from "vitest";

declare global {
  interface ImportMeta {
    glob<T = unknown>(
      pattern: string,
      options: {
        eager: true;
        import: string;
        query?: string;
      },
    ): Record<string, T>;
    glob<T = unknown>(
      pattern: string,
      options?: {
        eager?: false;
        import?: string;
        query?: string;
      },
    ): Record<string, () => Promise<T>>;
  }
}

type StoryEntry =
  | string
  | {
      directory?: string;
      files?: string;
    };

type StorybookMainConfig = {
  stories?: StoryEntry[];
};

const packageJsonSources = import.meta.glob("../../../../package.json", {
  eager: true,
  import: "default",
  query: "?raw",
});
const storybookConfigSources = import.meta.glob("../../../../.storybook/**/*", {
  eager: true,
  import: "default",
  query: "?raw",
});
const storybookMainConfigLoaders = import.meta.glob<{
  default?: StorybookMainConfig;
}>("../../../../.storybook/main.{ts,tsx,js,jsx,mjs,cjs}");
const expectedStoriesPattern =
  /(?:^|\/)src\/components\/taskbar\/\*\*\/\*\.stories\.tsx$/;
const expectedStoriesDirectoryPattern = /(?:^|\/)src\/components\/taskbar$/;
const recipientFileKey = ["NrUGK", "PZUewpuA8XuHI0v5n"].join("");
const phaseTwoBootstrapLiterals = [
  "Taskbar Foundation/Windows",
  "Taskbar Foundation/Search",
  "Taskbar Foundation/Icon",
  "Taskbar Foundation/Clock",
  "taskbar-foundation-windows--reference",
  "taskbar-foundation-search--reference",
  "taskbar-foundation-icon--reference",
  "taskbar-foundation-clock--reference",
  "taskbar-foundation-windows-reference",
  "taskbar-foundation-search-reference",
  "taskbar-foundation-icon-default-reference",
  "taskbar-foundation-icon-active-reference",
  "taskbar-foundation-icon-hide-reference",
  "taskbar-foundation-clock-reference",
  recipientFileKey,
];
const fullRailStorySources = import.meta.glob(
  "../taskbar/taskbar.stories.tsx",
  {
    eager: true,
    import: "default",
    query: "?raw",
  },
);
const forbiddenPrerequisitePattern =
  /@windows\/web dev|localhost:3000|sandbox\/taskbar/;

function normalizePath(value: string) {
  return value.replace(/\\/g, "/");
}

function getSingleRawText(rawModules: Record<string, unknown>) {
  const entries = Object.entries(rawModules);

  expect(entries).toHaveLength(1);

  if (entries.length === 0) {
    return "";
  }

  const rawText = entries[0]?.[1];

  expect(typeof rawText).toBe("string");

  return typeof rawText === "string" ? rawText : "";
}

function getRawTexts(rawModules: Record<string, unknown>) {
  return Object.values(rawModules).filter(
    (rawText): rawText is string => typeof rawText === "string",
  );
}

function hasExpectedStoryEntry(stories: StoryEntry[]) {
  return stories.some((storyEntry) => {
    if (typeof storyEntry === "string") {
      return expectedStoriesPattern.test(normalizePath(storyEntry));
    }

    if (
      storyEntry &&
      typeof storyEntry === "object" &&
      typeof storyEntry.directory === "string" &&
      typeof storyEntry.files === "string"
    ) {
      return (
        expectedStoriesDirectoryPattern.test(
          normalizePath(storyEntry.directory),
        ) && storyEntry.files === "**/*.stories.tsx"
      );
    }

    return false;
  });
}

async function loadMainConfig() {
  const entries = Object.entries(storybookMainConfigLoaders).sort((left, right) =>
    left[0].localeCompare(right[0]),
  );

  expect(entries.length).toBeGreaterThan(0);

  const loader = entries[0]?.[1];

  if (!loader) {
    return null;
  }

  const mainConfigModule = await loader();

  expect(mainConfigModule.default).toBeDefined();

  return mainConfigModule.default ?? null;
}

describe("Taskbar Storybook bootstrap contract", () => {
  it("package.json이 @windows/ui 안에서 Storybook script와 devDependency owner를 닫는다", () => {
    const packageJsonText = getSingleRawText(packageJsonSources);
    const packageJson = JSON.parse(packageJsonText) as {
      scripts?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const storybookScript = packageJson.scripts?.storybook;
    const buildStorybookScript = packageJson.scripts?.["build-storybook"];
    const storybookDependencyNames = Object.keys(
      packageJson.devDependencies ?? {},
    ).filter((dependencyName) => dependencyName.includes("storybook"));

    expect(storybookScript).toEqual(expect.any(String));
    expect(buildStorybookScript).toEqual(expect.any(String));
    expect(storybookScript ?? "").toMatch(/storybook/i);
    expect(buildStorybookScript ?? "").toMatch(/storybook/i);
    expect(storybookDependencyNames.length).toBeGreaterThan(0);
    expect(packageJsonText).not.toMatch(forbiddenPrerequisitePattern);
  });

  it("main config가 taskbar leaf discovery만 열고 app/web prerequisite와 Phase 2 literal은 아직 요구하지 않는다", async () => {
    const storybookFiles = getRawTexts(storybookConfigSources);

    expect(storybookFiles.length).toBeGreaterThan(0);

    const storybookConfig = await loadMainConfig();
    const stories = storybookConfig?.stories ?? [];
    const combinedConfigText = storybookFiles.join("\n");

    expect(Array.isArray(stories)).toBe(true);
    expect(hasExpectedStoryEntry(stories)).toBe(true);
    expect(combinedConfigText).not.toMatch(forbiddenPrerequisitePattern);

    for (const phaseTwoLiteral of phaseTwoBootstrapLiterals) {
      expect(combinedConfigText).not.toContain(phaseTwoLiteral);
    }
  });

  it("Taskbar Foundation/Taskbar 전체 rail reference story가 존재하고 package-only bootstrap contract를 유지한다", () => {
    const fullRailStoryText = getSingleRawText(fullRailStorySources);

    expect(fullRailStoryText).toContain("Taskbar Foundation/Taskbar");
    expect(fullRailStoryText).toContain("export const Reference");
    expect(fullRailStoryText).toContain("TaskbarWindowsButton");
    expect(fullRailStoryText).toContain("TaskbarSearch");
    expect(fullRailStoryText).toContain("TaskbarIconButton");
    expect(fullRailStoryText).toContain("TaskbarClock");
    expect(fullRailStoryText).toContain('aria-label="Windows"');
    expect(fullRailStoryText).toContain('placeholder="검색"');
    expect(fullRailStoryText).toContain('timeLabel="오전 10:18"');
    expect(fullRailStoryText).toContain('dateLabel="2026-04-10"');
    expect(fullRailStoryText).not.toMatch(forbiddenPrerequisitePattern);
  });
});
