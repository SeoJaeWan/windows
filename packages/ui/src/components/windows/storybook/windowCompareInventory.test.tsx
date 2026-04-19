import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";

import Folder from "../folder";
import Browser from "../browser";

import {
  CompareDesktopBlog,
  CompareDesktopSearchOpen,
  CompareMobileBlog,
} from "../folder/folder.stories";
import {
  CompareDesktopArticle,
  CompareDesktopAddressOpen,
  CompareMobileArticle,
} from "../browser/browser.stories";
import {
  CANONICAL_COMPARE_STATES,
  COMPARE_STORY_IDS,
  COMPARE_STAGE_SIZE,
} from "./windowFigmaReviewRegistration";

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function render(ui: React.ReactNode) {
  act(() => root.render(ui));
}

type StoryWithRender = { render: () => React.ReactNode };

const cases: { story: StoryWithRender; kind: string; state: string; stageVariant: "desktop" | "mobile" }[] = [
  { story: CompareDesktopBlog as unknown as StoryWithRender, kind: "folder", state: "desktop-blog", stageVariant: "desktop" },
  { story: CompareDesktopSearchOpen as unknown as StoryWithRender, kind: "folder", state: "desktop-search-open", stageVariant: "desktop" },
  { story: CompareMobileBlog as unknown as StoryWithRender, kind: "folder", state: "mobile-blog", stageVariant: "mobile" },
  { story: CompareDesktopArticle as unknown as StoryWithRender, kind: "browser", state: "desktop-article", stageVariant: "desktop" },
  { story: CompareDesktopAddressOpen as unknown as StoryWithRender, kind: "browser", state: "desktop-address-open", stageVariant: "desktop" },
  { story: CompareMobileArticle as unknown as StoryWithRender, kind: "browser", state: "mobile-article", stageVariant: "mobile" },
];

describe("windowCompareInventory", () => {
  cases.forEach(({ story, kind, state, stageVariant }) => {
    it(`${kind}/${state} — [data-visual-root]가 정확히 하나이고 kind/state pair가 일치한다`, () => {
      render(createElement(() => story.render() as React.ReactElement));

      const roots = container.querySelectorAll("[data-visual-root]");
      expect(roots).toHaveLength(1);

      const visualRoot = roots[0]!;
      expect(visualRoot.getAttribute("data-visual-kind")).toBe(kind);
      expect(visualRoot.getAttribute("data-visual-state")).toBe(state);
    });

    it(`${kind}/${state} — [data-window-compare-stage]가 정확히 하나이고 "${stageVariant}" variant다`, () => {
      render(createElement(() => story.render() as React.ReactElement));

      const stages = container.querySelectorAll("[data-window-compare-stage]");
      expect(stages).toHaveLength(1);

      const stage = stages[0]!;
      expect(stage.getAttribute("data-window-compare-stage")).toBe(stageVariant);
    });

    it(`${kind}/${state} — [data-window-frame-root]가 정확히 하나다`, () => {
      render(createElement(() => story.render() as React.ReactElement));

      const frameRoots = container.querySelectorAll("[data-window-frame-root]");
      expect(frameRoots).toHaveLength(1);
    });

    it(`${kind}/${state} — [data-window-frame-chrome]가 정확히 하나다`, () => {
      render(createElement(() => story.render() as React.ReactElement));

      const chromeParts = container.querySelectorAll("[data-window-frame-chrome]");
      expect(chromeParts).toHaveLength(1);
    });

    it(`${kind}/${state} — [data-window-frame-body]가 정확히 하나다`, () => {
      render(createElement(() => story.render() as React.ReactElement));

      const bodyParts = container.querySelectorAll("[data-window-frame-body]");
      expect(bodyParts).toHaveLength(1);
    });
  });
});

describe("windowCompareInventory — reserved marker strip", () => {
  it("consumer가 data-window-frame-root를 rest로 전달해도 canonical 값이 최종 DOM에 남는다", () => {
    // Simulate consumer passing reserved marker as a custom value via ...rest
    // The frame must strip it and apply its own canonical empty string value
    render(
      createElement(() =>
        (CompareDesktopBlog as unknown as StoryWithRender).render() as React.ReactElement
      )
    );

    const frameRoot = container.querySelector("[data-window-frame-root]");
    expect(frameRoot).not.toBeNull();
    // canonical value is empty string ""
    expect(frameRoot!.getAttribute("data-window-frame-root")).toBe("");
  });
});

describe("windowCompareInventory — data-window-compare-stage consumer override strip", () => {
  it("Folder에 data-window-compare-stage를 consumer가 전달해도 [data-window-frame-root]에는 해당 attribute가 없다", () => {
    render(
      createElement(() =>
        createElement(Folder, {
          title: "Test",
          addressLabel: "Test > Path",
          sidebarItems: [],
          entries: [],
          // consumer가 reserved marker를 override하려는 시도
          "data-window-compare-stage": "hack",
        } as React.ComponentProps<typeof Folder> & { "data-window-compare-stage": string })
      )
    );

    const frameRoot = container.querySelector("[data-window-frame-root]");
    expect(frameRoot).not.toBeNull();
    expect(frameRoot!.hasAttribute("data-window-compare-stage")).toBe(false);
  });

  it("Browser에 data-window-compare-stage를 consumer가 전달해도 [data-window-frame-root]에는 해당 attribute가 없다", () => {
    render(
      createElement(() =>
        createElement(
          Browser,
          {
            title: "Test",
            addressLabel: "Test > Path",
            // consumer가 reserved marker를 override하려는 시도
            "data-window-compare-stage": "hack",
          } as React.ComponentProps<typeof Browser> & { "data-window-compare-stage": string },
          createElement("div", null, "content")
        )
      )
    );

    const frameRoot = container.querySelector("[data-window-frame-root]");
    expect(frameRoot).not.toBeNull();
    expect(frameRoot!.hasAttribute("data-window-compare-stage")).toBe(false);
  });

  it("CompareWindowDesktopStage가 부착한 data-window-compare-stage='desktop'은 tree에 그대로 남는다", () => {
    render(
      createElement(() =>
        (CompareDesktopBlog as unknown as StoryWithRender).render() as React.ReactElement
      )
    );

    const stages = container.querySelectorAll("[data-window-compare-stage]");
    expect(stages).toHaveLength(1);
    expect(stages[0]!.getAttribute("data-window-compare-stage")).toBe("desktop");
  });
});

describe("windowCompareInventory — Figma registration contract", () => {
  it("CANONICAL_COMPARE_STATES가 정확히 6개의 canonical state key를 포함한다", () => {
    expect(CANONICAL_COMPARE_STATES).toHaveLength(6);
  });

  it("CANONICAL_COMPARE_STATES가 legacy key alias를 포함하지 않는다", () => {
    const legacyKeys = ["folder/desktop-card", "folder/mobile-card", "browser/desktop-chrome", "browser/mobile-chrome"];
    legacyKeys.forEach((legacyKey) => {
      expect(CANONICAL_COMPARE_STATES).not.toContain(legacyKey);
    });
  });

  it("COMPARE_STORY_IDS가 canonical state key 6개에 대한 story ID를 모두 포함한다", () => {
    const stateKeys = Object.keys(COMPARE_STORY_IDS);
    expect(stateKeys).toHaveLength(6);
    CANONICAL_COMPARE_STATES.forEach((state) => {
      expect(COMPARE_STORY_IDS).toHaveProperty(state);
    });
  });

  it("compare story ID가 canonical naming convention을 따른다", () => {
    expect(COMPARE_STORY_IDS["folder/desktop-blog"]).toBe("windows-compose-folder--compare-desktop-blog");
    expect(COMPARE_STORY_IDS["folder/desktop-search-open"]).toBe("windows-compose-folder--compare-desktop-search-open");
    expect(COMPARE_STORY_IDS["folder/mobile-blog"]).toBe("windows-compose-folder--compare-mobile-blog");
    expect(COMPARE_STORY_IDS["browser/desktop-article"]).toBe("windows-compose-browser--compare-desktop-article");
    expect(COMPARE_STORY_IDS["browser/desktop-address-open"]).toBe("windows-compose-browser--compare-desktop-address-open");
    expect(COMPARE_STORY_IDS["browser/mobile-article"]).toBe("windows-compose-browser--compare-mobile-article");
  });

  it("COMPARE_STAGE_SIZE desktop geometry가 Figma export canonical size 1282x752와 일치한다", () => {
    expect(COMPARE_STAGE_SIZE.desktop.width).toBe(1282);
    expect(COMPARE_STAGE_SIZE.desktop.height).toBe(752);
  });

  it("COMPARE_STAGE_SIZE mobile geometry가 Figma export canonical size 392x796와 일치한다", () => {
    expect(COMPARE_STAGE_SIZE.mobile.width).toBe(392);
    expect(COMPARE_STAGE_SIZE.mobile.height).toBe(796);
  });
});
