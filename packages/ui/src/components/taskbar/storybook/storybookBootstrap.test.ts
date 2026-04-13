import { type ComponentType, createElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
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

type StoryArgs = Record<string, unknown>;

type CompareStoryMeta = {
  title?: string;
  component?: ComponentType<StoryArgs>;
  args?: StoryArgs;
  render?: (args: StoryArgs, context?: unknown) => ReactElement;
};

type CompareStoryObject = {
  args?: StoryArgs;
  render?: (args: StoryArgs, context?: unknown) => ReactElement;
};

type TaskbarStoryModule = {
  default?: CompareStoryMeta;
  Compare?: CompareStoryObject | ((args: StoryArgs) => ReactElement);
};

type PanelStoryModule = {
  default?: CompareStoryMeta;
  ComparePinnedDefault?: CompareStoryObject | ((args: StoryArgs) => ReactElement);
  CompareAllList?: CompareStoryObject | ((args: StoryArgs) => ReactElement);
  CompareAllIndex?: CompareStoryObject | ((args: StoryArgs) => ReactElement);
  CompareSearchResults?: CompareStoryObject | ((args: StoryArgs) => ReactElement);
  CompareSearchEmpty?: CompareStoryObject | ((args: StoryArgs) => ReactElement);
};

const taskbarStoryLoaders = import.meta.glob<TaskbarStoryModule>(
  "../taskbar/taskbar.stories.tsx",
);
const panelStoryLoaders = import.meta.glob<PanelStoryModule>(
  "../windowsPanelShell/windowsPanelShell.stories.tsx",
);
const panelStorySources = import.meta.glob(
  "../windowsPanelShell/windowsPanelShell.stories.tsx",
  {
    eager: true,
    import: "default",
    query: "?raw",
  },
);

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

async function loadStoryModule<T>(loaders: Record<string, () => Promise<T>>) {
  const entries = Object.entries(loaders).sort((left, right) =>
    left[0].localeCompare(right[0]),
  );

  expect(entries).toHaveLength(1);

  const loader = entries[0]?.[1];

  if (!loader) {
    return null;
  }

  return await loader();
}

function renderNamedCompareStory(
  storyModule: { default?: CompareStoryMeta; [key: string]: unknown },
  exportName: string,
) {
  const storyMeta = storyModule.default;
  const compareStory = storyModule[exportName] as
    | CompareStoryObject
    | ((args: StoryArgs) => ReactElement)
    | undefined;

  expect(compareStory).toBeDefined();

  if (!compareStory) {
    return { markup: "", meta: storyMeta };
  }

  const args =
    typeof compareStory === "function"
      ? { ...(storyMeta?.args ?? {}) }
      : { ...(storyMeta?.args ?? {}), ...(compareStory.args ?? {}) };

  if (typeof compareStory === "function") {
    return {
      markup: renderToStaticMarkup(compareStory(args)),
      meta: storyMeta,
    };
  }

  const render =
    typeof compareStory.render === "function"
      ? compareStory.render
      : storyMeta?.render;

  if (typeof render === "function") {
    return {
      markup: renderToStaticMarkup(render(args, {})),
      meta: storyMeta,
    };
  }

  expect(storyMeta?.component).toBeDefined();

  if (!storyMeta?.component) {
    return { markup: "", meta: storyMeta };
  }

  return {
    markup: renderToStaticMarkup(createElement(storyMeta.component, args)),
    meta: storyMeta,
  };
}

function parseMarkup(markup: string) {
  const container = document.createElement("div");

  container.innerHTML = markup;

  return container;
}

function assertCompareRoot(
  rendered: HTMLElement,
  expectedKind: string,
  expectedState: string,
) {
  const roots = rendered.querySelectorAll("[data-visual-root]");

  expect(roots).toHaveLength(1);

  const root = roots[0] as HTMLElement;

  expect(root.getAttribute("data-visual-kind")).toBe(expectedKind);
  expect(root.getAttribute("data-visual-state")).toBe(expectedState);
}

function assertNoHumanReviewDecorations(rendered: HTMLElement) {
  // No marker attribute (FoundationRegistrationStage / Reference stage marker)
  expect(rendered.querySelector("[data-marker]")).toBeNull();

  // No label text with monospace font style
  const styledElements = rendered.querySelectorAll("[style]");

  for (const el of styledElements) {
    const style = (el as HTMLElement).getAttribute("style") ?? "";

    expect(style).not.toContain("monospace");
  }

  // No desktop backdrop (linear-gradient)
  for (const el of styledElements) {
    const style = (el as HTMLElement).getAttribute("style") ?? "";

    expect(style).not.toContain("linear-gradient");
  }

  // No outer padding frame (min-height + padding wrapper from WindowsPanelReferenceStage)
  for (const el of styledElements) {
    const style = (el as HTMLElement).getAttribute("style") ?? "";

    expect(style).not.toContain("min-height");
  }
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

describe("Taskbar composite compare contract", () => {
  it("full taskbar Compare가 정확히 하나의 compare root와 taskbar/default kind/state를 렌더링한다", async () => {
    const taskbarStoryModule = await loadStoryModule(taskbarStoryLoaders);

    expect(taskbarStoryModule).not.toBeNull();

    if (!taskbarStoryModule) {
      return;
    }

    const { markup } = renderNamedCompareStory(taskbarStoryModule, "Compare");
    const rendered = parseMarkup(markup);

    assertCompareRoot(rendered, "taskbar", "default");
    assertNoHumanReviewDecorations(rendered);
  });

  it("full taskbar Compare source에 외부 route/baseline/pixelmatch prerequisite가 없다", () => {
    const fullRailStoryText = getSingleRawText(fullRailStorySources);

    expect(fullRailStoryText).not.toMatch(forbiddenPrerequisitePattern);
    expect(fullRailStoryText).not.toContain("pixelmatch");
    expect(fullRailStoryText).not.toContain("localhost");
    expect(fullRailStoryText).not.toContain("apps/web");
    expect(fullRailStoryText).not.toContain("sandbox/taskbar");
  });

  it("panel ComparePinnedDefault가 정확히 하나의 compare root와 windows-panel-shell/pinned-default를 렌더링한다", async () => {
    const panelStoryModule = await loadStoryModule(panelStoryLoaders);

    expect(panelStoryModule).not.toBeNull();

    if (!panelStoryModule) {
      return;
    }

    const { markup } = renderNamedCompareStory(panelStoryModule, "ComparePinnedDefault");
    const rendered = parseMarkup(markup);

    assertCompareRoot(rendered, "windows-panel-shell", "pinned-default");
    assertNoHumanReviewDecorations(rendered);
  });

  it("panel CompareAllList가 정확히 하나의 compare root와 windows-panel-shell/all-list를 렌더링한다", async () => {
    const panelStoryModule = await loadStoryModule(panelStoryLoaders);

    expect(panelStoryModule).not.toBeNull();

    if (!panelStoryModule) {
      return;
    }

    const { markup } = renderNamedCompareStory(panelStoryModule, "CompareAllList");
    const rendered = parseMarkup(markup);

    assertCompareRoot(rendered, "windows-panel-shell", "all-list");
    assertNoHumanReviewDecorations(rendered);
  });

  it("panel CompareAllIndex가 정확히 하나의 compare root와 windows-panel-shell/all-index를 렌더링한다", async () => {
    const panelStoryModule = await loadStoryModule(panelStoryLoaders);

    expect(panelStoryModule).not.toBeNull();

    if (!panelStoryModule) {
      return;
    }

    const { markup } = renderNamedCompareStory(panelStoryModule, "CompareAllIndex");
    const rendered = parseMarkup(markup);

    assertCompareRoot(rendered, "windows-panel-shell", "all-index");
    assertNoHumanReviewDecorations(rendered);
  });

  it("panel CompareSearchResults가 정확히 하나의 compare root와 windows-panel-shell/search-results를 렌더링한다", async () => {
    const panelStoryModule = await loadStoryModule(panelStoryLoaders);

    expect(panelStoryModule).not.toBeNull();

    if (!panelStoryModule) {
      return;
    }

    const { markup } = renderNamedCompareStory(panelStoryModule, "CompareSearchResults");
    const rendered = parseMarkup(markup);

    assertCompareRoot(rendered, "windows-panel-shell", "search-results");
    assertNoHumanReviewDecorations(rendered);
  });

  it("panel CompareSearchEmpty가 정확히 하나의 compare root와 windows-panel-shell/search-empty를 렌더링한다", async () => {
    const panelStoryModule = await loadStoryModule(panelStoryLoaders);

    expect(panelStoryModule).not.toBeNull();

    if (!panelStoryModule) {
      return;
    }

    const { markup } = renderNamedCompareStory(panelStoryModule, "CompareSearchEmpty");
    const rendered = parseMarkup(markup);

    assertCompareRoot(rendered, "windows-panel-shell", "search-empty");
    assertNoHumanReviewDecorations(rendered);
  });

  it("panel compare story source에 외부 route/baseline/pixelmatch prerequisite가 없다", () => {
    const panelStoryText = getSingleRawText(panelStorySources);

    expect(panelStoryText).not.toMatch(forbiddenPrerequisitePattern);
    expect(panelStoryText).not.toContain("pixelmatch");
    expect(panelStoryText).not.toContain("localhost");
    expect(panelStoryText).not.toContain("apps/web");
    expect(panelStoryText).not.toContain("sandbox/taskbar");
  });
});
