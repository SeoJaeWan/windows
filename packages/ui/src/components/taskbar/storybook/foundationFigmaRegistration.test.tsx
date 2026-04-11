import { createElement, type ComponentType, type ReactElement } from "react";
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

type StoryArgs = Record<string, unknown>;

type StoryMeta = {
  title?: string;
  component?: ComponentType<StoryArgs>;
  args?: StoryArgs;
  render?: (args: StoryArgs, context?: unknown) => ReactElement;
};

type StoryObject = {
  args?: StoryArgs;
  render?: (args: StoryArgs, context?: unknown) => ReactElement;
};

type StoryModule = {
  default?: StoryMeta;
  Reference?: StoryObject | ((args: StoryArgs) => ReactElement);
};

const foundationRegistrationSources = import.meta.glob(
  "./foundationFigmaRegistration.ts",
  {
    eager: true,
    import: "default",
    query: "?raw",
  },
);
const foundationIconAssetSources = import.meta.glob(
  "./assets/taskbar-foundation-icon.png",
  {
    eager: true,
    import: "default",
    query: "?url",
  },
);
const windowsStorySourceModules = import.meta.glob(
  "../taskbarWindowsButton/taskbarWindowsButton.stories.tsx",
  {
    eager: true,
    import: "default",
    query: "?raw",
  },
);
const searchStorySourceModules = import.meta.glob(
  "../taskbarSearch/taskbarSearch.stories.tsx",
  {
    eager: true,
    import: "default",
    query: "?raw",
  },
);
const iconStorySourceModules = import.meta.glob(
  "../taskbarIconButton/taskbarIconButton.stories.tsx",
  {
    eager: true,
    import: "default",
    query: "?raw",
  },
);
const clockStorySourceModules = import.meta.glob(
  "../taskbarClock/taskbarClock.stories.tsx",
  {
    eager: true,
    import: "default",
    query: "?raw",
  },
);
const windowsStoryLoaders = import.meta.glob<StoryModule>(
  "../taskbarWindowsButton/taskbarWindowsButton.stories.tsx",
);
const searchStoryLoaders = import.meta.glob<StoryModule>(
  "../taskbarSearch/taskbarSearch.stories.tsx",
);
const iconStoryLoaders = import.meta.glob<StoryModule>(
  "../taskbarIconButton/taskbarIconButton.stories.tsx",
);
const clockStoryLoaders = import.meta.glob<StoryModule>(
  "../taskbarClock/taskbarClock.stories.tsx",
);
const recipientFileKey = ["NrUGK", "PZUewpuA8XuHI0v5n"].join("");
const recipientUrl = [
  "https://www.figma.com/design/",
  recipientFileKey,
  "/Windows?node-id=0-1&t=VdO3yK32gZWtlxSi-1",
].join("");
const combinedStoryPattern =
  /Taskbar Foundation\/Taskbar|Taskbar\/Reference Shell|Taskbar\/Projection States|Taskbar\/Standalone Surfaces|sandbox\/taskbar|apps\/web/;

function getSingleText(rawModules: Record<string, unknown>) {
  const entries = Object.entries(rawModules);

  expect(entries).toHaveLength(1);

  if (entries.length === 0) {
    return "";
  }

  const rawText = entries[0]?.[1];

  expect(typeof rawText).toBe("string");

  return typeof rawText === "string" ? rawText : "";
}

async function loadStoryModule(loaders: Record<string, () => Promise<StoryModule>>) {
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

function renderReferenceStory(storyModule: StoryModule) {
  const storyMeta = storyModule.default;
  const referenceStory = storyModule.Reference;

  expect(referenceStory).toBeDefined();

  if (!referenceStory) {
    return {
      markup: "",
      meta: storyMeta,
    };
  }

  const args =
    typeof referenceStory === "function"
      ? { ...(storyMeta?.args ?? {}) }
      : { ...(storyMeta?.args ?? {}), ...(referenceStory.args ?? {}) };

  if (typeof referenceStory === "function") {
    return {
      markup: renderToStaticMarkup(referenceStory(args)),
      meta: storyMeta,
    };
  }

  const render =
    typeof referenceStory.render === "function"
      ? referenceStory.render
      : storyMeta?.render;

  if (typeof render === "function") {
    return {
      markup: renderToStaticMarkup(render(args, {})),
      meta: storyMeta,
    };
  }

  expect(storyMeta?.component).toBeDefined();

  if (!storyMeta?.component) {
    return {
      markup: "",
      meta: storyMeta,
    };
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

describe("Taskbar foundation Figma registration contract", () => {
  it("foundationFigmaRegistration이 exact title/story id/marker/recipient literal의 단일 source of truth를 가진다", () => {
    const foundationRegistrationText = getSingleText(
      foundationRegistrationSources,
    );

    expect(foundationRegistrationText).toContain("Taskbar Foundation/Windows");
    expect(foundationRegistrationText).toContain("Taskbar Foundation/Search");
    expect(foundationRegistrationText).toContain("Taskbar Foundation/Icon");
    expect(foundationRegistrationText).toContain("Taskbar Foundation/Clock");
    expect(foundationRegistrationText).toContain(
      "taskbar-foundation-windows--reference",
    );
    expect(foundationRegistrationText).toContain(
      "taskbar-foundation-search--reference",
    );
    expect(foundationRegistrationText).toContain(
      "taskbar-foundation-icon--reference",
    );
    expect(foundationRegistrationText).toContain(
      "taskbar-foundation-clock--reference",
    );
    expect(foundationRegistrationText).toContain(
      "taskbar-foundation-windows-reference",
    );
    expect(foundationRegistrationText).toContain(
      "taskbar-foundation-search-reference",
    );
    expect(foundationRegistrationText).toContain(
      "taskbar-foundation-icon-default-reference",
    );
    expect(foundationRegistrationText).toContain(
      "taskbar-foundation-icon-active-reference",
    );
    expect(foundationRegistrationText).toContain(
      "taskbar-foundation-icon-hide-reference",
    );
    expect(foundationRegistrationText).toContain(
      "taskbar-foundation-clock-reference",
    );
    expect(foundationRegistrationText).toContain(recipientUrl);
  });

  it("registration source가 combined Taskbar story나 route prerequisite literal을 다시 열지 않는다", () => {
    const registrationSources = [
      getSingleText(foundationRegistrationSources),
      getSingleText(windowsStorySourceModules),
      getSingleText(searchStorySourceModules),
      getSingleText(iconStorySourceModules),
      getSingleText(clockStorySourceModules),
    ].join("\n");

    expect(registrationSources).not.toMatch(combinedStoryPattern);
  });

  it("Windows Reference story가 exact title/export와 marker, aria-label fixed prop을 소유한다", async () => {
    const windowsStoryModule = await loadStoryModule(windowsStoryLoaders);

    expect(windowsStoryModule).not.toBeNull();

    if (!windowsStoryModule) {
      return;
    }

    const { meta, markup } = renderReferenceStory(windowsStoryModule);
    const rendered = parseMarkup(markup);

    expect(meta?.title).toBe("Taskbar Foundation/Windows");
    expect(markup).toContain("taskbar-foundation-windows-reference");
    expect(markup).toContain('aria-label="Windows"');
    expect(rendered.querySelector("button")).not.toBeNull();
    expect(rendered.querySelector("img")).not.toBeNull();
  });

  it("Search Reference story가 exact title/export와 marker, placeholder fixed prop을 소유한다", async () => {
    const searchStoryModule = await loadStoryModule(searchStoryLoaders);

    expect(searchStoryModule).not.toBeNull();

    if (!searchStoryModule) {
      return;
    }

    const { meta, markup } = renderReferenceStory(searchStoryModule);
    const rendered = parseMarkup(markup);

    expect(meta?.title).toBe("Taskbar Foundation/Search");
    expect(markup).toContain("taskbar-foundation-search-reference");
    expect(markup).toContain('placeholder="Search"');
    expect(rendered.querySelector("input")).not.toBeNull();
  });

  it("Icon Reference story가 exact title/export와 default active hide trio marker를 같은 story에서 고정 순서로 렌더링한다", async () => {
    expect(Object.keys(foundationIconAssetSources)).toHaveLength(1);

    const iconStoryModule = await loadStoryModule(iconStoryLoaders);

    expect(iconStoryModule).not.toBeNull();

    if (!iconStoryModule) {
      return;
    }

    const { meta, markup } = renderReferenceStory(iconStoryModule);
    const rendered = parseMarkup(markup);
    const defaultMarkerIndex = markup.indexOf(
      "taskbar-foundation-icon-default-reference",
    );
    const activeMarkerIndex = markup.indexOf(
      "taskbar-foundation-icon-active-reference",
    );
    const hideMarkerIndex = markup.indexOf(
      "taskbar-foundation-icon-hide-reference",
    );
    const imageSources = Array.from(rendered.querySelectorAll("img"))
      .map((image) => image.getAttribute("src") ?? "")
      .filter(Boolean);

    expect(meta?.title).toBe("Taskbar Foundation/Icon");
    expect(defaultMarkerIndex).toBeGreaterThanOrEqual(0);
    expect(activeMarkerIndex).toBeGreaterThan(defaultMarkerIndex);
    expect(hideMarkerIndex).toBeGreaterThan(activeMarkerIndex);
    expect(markup).toContain("taskbar-icon-button--default");
    expect(markup).toContain("taskbar-icon-button--active");
    expect(markup).toContain("taskbar-icon-button--hide");
    expect(imageSources).toHaveLength(3);
    expect(new Set(imageSources).size).toBe(1);
  });

  it("Clock Reference story가 exact title/export와 marker, fixed time/date label을 소유한다", async () => {
    const clockStoryModule = await loadStoryModule(clockStoryLoaders);

    expect(clockStoryModule).not.toBeNull();

    if (!clockStoryModule) {
      return;
    }

    const { meta, markup } = renderReferenceStory(clockStoryModule);
    const rendered = parseMarkup(markup);

    expect(meta?.title).toBe("Taskbar Foundation/Clock");
    expect(markup).toContain("taskbar-foundation-clock-reference");
    expect(rendered.textContent).toContain("09:41");
    expect(rendered.textContent).toContain("2026-04-10");
  });
});
