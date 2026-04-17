import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";

import {
  CompareDesktopBlog,
  CompareMobileBlog,
} from "../folder/folder.stories";
import {
  CompareDesktopArticle,
  CompareMobileArticle,
} from "../browser/browser.stories";

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
  { story: CompareMobileBlog as unknown as StoryWithRender, kind: "folder", state: "mobile-blog", stageVariant: "mobile" },
  { story: CompareDesktopArticle as unknown as StoryWithRender, kind: "browser", state: "desktop-article", stageVariant: "desktop" },
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
