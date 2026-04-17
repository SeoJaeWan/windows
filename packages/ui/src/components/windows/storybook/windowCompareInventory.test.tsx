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

const cases: { story: StoryWithRender; kind: string; state: string }[] = [
  { story: CompareDesktopBlog as unknown as StoryWithRender, kind: "folder", state: "desktop-blog" },
  { story: CompareMobileBlog as unknown as StoryWithRender, kind: "folder", state: "mobile-blog" },
  { story: CompareDesktopArticle as unknown as StoryWithRender, kind: "browser", state: "desktop-article" },
  { story: CompareMobileArticle as unknown as StoryWithRender, kind: "browser", state: "mobile-article" },
];

describe("windowCompareInventory", () => {
  cases.forEach(({ story, kind, state }) => {
    it(`${kind}/${state} — [data-visual-root]가 정확히 하나이고 kind/state pair가 일치한다`, () => {
      render(createElement(() => story.render() as React.ReactElement));

      const roots = container.querySelectorAll("[data-visual-root]");
      expect(roots).toHaveLength(1);

      const visualRoot = roots[0]!;
      expect(visualRoot.getAttribute("data-visual-kind")).toBe(kind);
      expect(visualRoot.getAttribute("data-visual-state")).toBe(state);
    });
  });
});
