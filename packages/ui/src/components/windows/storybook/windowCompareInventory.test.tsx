/**
 * windowCompareInventory.test
 *
 * Positive inventory signal — locks the 15 canonical Folder + Browser
 * compare states to their DOM contract.
 *
 * What this owner locks:
 *   - Exactly one `[data-window-compare-stage="{variant}"]` per story
 *   - Exactly one nested
 *     `[data-visual-root][data-visual-kind=KIND][data-visual-state=STATE]`
 *     under that stage
 *   - The nesting is `stage > root` (stage wraps visual-root)
 *   - Inventory size is exactly 8 Folder + 7 Browser = 15 entries
 *
 * What this owner does NOT lock:
 *   - Internal tree of Folder / Browser (those are renderer-owned)
 *   - Runtime visual diff (capture scripts are out of scope)
 *
 * Convention: describe/it text is Korean; symbol names stay in English.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";

// Required for React's act() to work in jsdom
// @ts-expect-error global flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

import {
  FOLDER_LIVE_BLOG,
  FOLDER_LIVE_SEARCH_OPEN,
  FOLDER_LIVE_CHIP_OPEN,
  FOLDER_LIVE_SIDEBAR_HOVER,
  FOLDER_LIVE_SIDEBAR_EXPANDED,
  FOLDER_LIVE_THUMBNAIL_HOVER,
  FOLDER_MOBILE_BLOG,
  FOLDER_MOBILE_SEARCH_OPEN,
} from "./folderReferenceFixtures";
import {
  BROWSER_LIVE_ARTICLE,
  BROWSER_LIVE_ADDRESS_OPEN,
  BROWSER_LIVE_CONTROL_HOVER_MINIMIZE,
  BROWSER_LIVE_CONTROL_HOVER_MAXIMIZE,
  BROWSER_LIVE_CONTROL_HOVER_CLOSE,
  BROWSER_MOBILE_ARTICLE,
  BROWSER_MOBILE_ADDRESS_OPEN,
} from "./browserReferenceFixtures";
import * as FolderStories from "../folder/folder.stories";
import * as BrowserStories from "../browser/browser.stories";

type InventoryEntry = {
  kind: "folder" | "browser";
  state: string;
  variant: "desktop" | "mobile";
  storyExportName: string;
  story: { render: () => React.ReactNode };
};

/* ── Canonical 15-entry inventory ───────────────────────────── */

const INVENTORY: InventoryEntry[] = [
  // Folder (8)
  {
    kind: "folder",
    state: FOLDER_LIVE_BLOG.state,
    variant: FOLDER_LIVE_BLOG.variant,
    storyExportName: "CompareLiveBlog",
    story: FolderStories.CompareLiveBlog,
  },
  {
    kind: "folder",
    state: FOLDER_LIVE_SEARCH_OPEN.state,
    variant: FOLDER_LIVE_SEARCH_OPEN.variant,
    storyExportName: "CompareLiveSearchOpen",
    story: FolderStories.CompareLiveSearchOpen,
  },
  {
    kind: "folder",
    state: FOLDER_LIVE_CHIP_OPEN.state,
    variant: FOLDER_LIVE_CHIP_OPEN.variant,
    storyExportName: "CompareLiveChipOpen",
    story: FolderStories.CompareLiveChipOpen,
  },
  {
    kind: "folder",
    state: FOLDER_LIVE_SIDEBAR_HOVER.state,
    variant: FOLDER_LIVE_SIDEBAR_HOVER.variant,
    storyExportName: "CompareLiveSidebarHover",
    story: FolderStories.CompareLiveSidebarHover,
  },
  {
    kind: "folder",
    state: FOLDER_LIVE_SIDEBAR_EXPANDED.state,
    variant: FOLDER_LIVE_SIDEBAR_EXPANDED.variant,
    storyExportName: "CompareLiveSidebarExpanded",
    story: FolderStories.CompareLiveSidebarExpanded,
  },
  {
    kind: "folder",
    state: FOLDER_LIVE_THUMBNAIL_HOVER.state,
    variant: FOLDER_LIVE_THUMBNAIL_HOVER.variant,
    storyExportName: "CompareLiveThumbnailHover",
    story: FolderStories.CompareLiveThumbnailHover,
  },
  {
    kind: "folder",
    state: FOLDER_MOBILE_BLOG.state,
    variant: FOLDER_MOBILE_BLOG.variant,
    storyExportName: "CompareMobileBlog",
    story: FolderStories.CompareMobileBlog,
  },
  {
    kind: "folder",
    state: FOLDER_MOBILE_SEARCH_OPEN.state,
    variant: FOLDER_MOBILE_SEARCH_OPEN.variant,
    storyExportName: "CompareMobileSearchOpen",
    story: FolderStories.CompareMobileSearchOpen,
  },
  // Browser (7)
  {
    kind: "browser",
    state: BROWSER_LIVE_ARTICLE.state,
    variant: BROWSER_LIVE_ARTICLE.variant,
    storyExportName: "CompareLiveArticle",
    story: BrowserStories.CompareLiveArticle,
  },
  {
    kind: "browser",
    state: BROWSER_LIVE_ADDRESS_OPEN.state,
    variant: BROWSER_LIVE_ADDRESS_OPEN.variant,
    storyExportName: "CompareLiveAddressOpen",
    story: BrowserStories.CompareLiveAddressOpen,
  },
  {
    kind: "browser",
    state: BROWSER_LIVE_CONTROL_HOVER_MINIMIZE.state,
    variant: BROWSER_LIVE_CONTROL_HOVER_MINIMIZE.variant,
    storyExportName: "CompareLiveControlHoverMinimize",
    story: BrowserStories.CompareLiveControlHoverMinimize,
  },
  {
    kind: "browser",
    state: BROWSER_LIVE_CONTROL_HOVER_MAXIMIZE.state,
    variant: BROWSER_LIVE_CONTROL_HOVER_MAXIMIZE.variant,
    storyExportName: "CompareLiveControlHoverMaximize",
    story: BrowserStories.CompareLiveControlHoverMaximize,
  },
  {
    kind: "browser",
    state: BROWSER_LIVE_CONTROL_HOVER_CLOSE.state,
    variant: BROWSER_LIVE_CONTROL_HOVER_CLOSE.variant,
    storyExportName: "CompareLiveControlHoverClose",
    story: BrowserStories.CompareLiveControlHoverClose,
  },
  {
    kind: "browser",
    state: BROWSER_MOBILE_ARTICLE.state,
    variant: BROWSER_MOBILE_ARTICLE.variant,
    storyExportName: "CompareMobileArticle",
    story: BrowserStories.CompareMobileArticle,
  },
  {
    kind: "browser",
    state: BROWSER_MOBILE_ADDRESS_OPEN.state,
    variant: BROWSER_MOBILE_ADDRESS_OPEN.variant,
    storyExportName: "CompareMobileAddressOpen",
    story: BrowserStories.CompareMobileAddressOpen,
  },
];

/* ── Setup ──────────────────────────────────────────────────── */

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

function renderStory(entry: InventoryEntry) {
  act(() => {
    root.render(entry.story.render() as React.ReactElement);
  });
}

/* ── Inventory size ─────────────────────────────────────────── */

describe("windowCompareInventory — 인벤토리 크기", () => {
  it("정확히 15개의 엔트리 (folder 8 + browser 7) 를 가진다", () => {
    expect(INVENTORY.length).toBe(15);
    expect(INVENTORY.filter((e) => e.kind === "folder").length).toBe(8);
    expect(INVENTORY.filter((e) => e.kind === "browser").length).toBe(7);
  });

  it("각 (kind, state) 쌍이 고유하다", () => {
    const keys = INVENTORY.map((e) => `${e.kind}:${e.state}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

/* ── Per-entry DOM contract ─────────────────────────────────── */

describe.each(INVENTORY)(
  "windowCompareInventory — $kind / $state",
  (entry) => {
    it("정확히 하나의 [data-window-compare-stage] 엘리먼트가 variant 값과 함께 존재한다", () => {
      renderStory(entry);
      const stages = container.querySelectorAll("[data-window-compare-stage]");
      expect(stages.length).toBe(1);
      expect(stages[0].getAttribute("data-window-compare-stage")).toBe(
        entry.variant
      );
    });

    it(
      "정확히 하나의 nested [data-visual-root][data-visual-kind][data-visual-state] 가 존재한다",
      () => {
        renderStory(entry);
        const roots = container.querySelectorAll(
          `[data-visual-root][data-visual-kind="${entry.kind}"][data-visual-state="${entry.state}"]`
        );
        expect(roots.length).toBe(1);
      }
    );

    it("nesting 은 stage > root 이다 (stage 가 visual-root 를 감싼다)", () => {
      renderStory(entry);
      const stage = container.querySelector(
        "[data-window-compare-stage]"
      ) as HTMLElement | null;
      expect(stage).not.toBeNull();
      const nestedRoot = stage!.querySelector(
        `[data-visual-root][data-visual-kind="${entry.kind}"][data-visual-state="${entry.state}"]`
      );
      expect(nestedRoot).not.toBeNull();
    });
  }
);
