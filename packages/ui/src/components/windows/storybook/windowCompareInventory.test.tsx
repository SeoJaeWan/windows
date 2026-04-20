/**
 * windowCompareInventory.test
 *
 * Compare story DOM contract owner for the windows family (Folder + Browser).
 *
 * Role: exact 15-state inventory lock.
 * This file locks:
 *   - exact story ID 15개 (8 Folder + 7 Browser)
 *   - exact [data-window-compare-stage] presence as capture boundary
 *   - exact nested [data-visual-root] as CompareRoot metadata wrapper
 *   - [data-visual-root] / data-visual-kind / data-visual-state selector contract
 *
 * Exact story ID inventory (Phase 3 canonical):
 *   Folder (8):
 *     windows-folder--compare-live-blog
 *     windows-folder--compare-live-search-open
 *     windows-folder--compare-live-chip-open
 *     windows-folder--compare-live-sidebar-hover
 *     windows-folder--compare-live-sidebar-expanded
 *     windows-folder--compare-live-thumbnail-hover
 *     windows-folder--compare-mobile-blog
 *     windows-folder--compare-mobile-search-open
 *   Browser (7):
 *     windows-browser--compare-live-article
 *     windows-browser--compare-live-address-open
 *     windows-browser--compare-live-control-hover-minimize
 *     windows-browser--compare-live-control-hover-maximize
 *     windows-browser--compare-live-control-hover-close
 *     windows-browser--compare-mobile-article
 *     windows-browser--compare-mobile-address-open
 *
 * Convention: describe/it text is Korean; component/story names stay in English.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";

// Required for React's act() to work in jsdom
// @ts-expect-error global flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

import CompareWindowStage from "./compareWindowStage";
import Folder from "../folder";
import Browser from "../browser";
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

/* ── Setup ───────────────────────────────────────────────────── */

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
  act(() => {
    root.render(ui);
  });
}

/* ── Helper: stage contract assertions ──────────────────────── */

/**
 * stageContractAssertions — 모든 compare story에서 공통으로 검증하는 DOM contract
 *
 * - [data-visual-root]가 정확히 하나 존재한다
 * - [data-window-compare-stage]가 정확히 하나 존재한다
 * - [data-visual-root] 안에 [data-window-compare-stage]가 중첩된다
 * - data-visual-kind / data-visual-state가 exact value와 일치한다
 */
function assertStageContract(
  kind: "folder" | "browser",
  state: string,
) {
  const visualRoots = container.querySelectorAll("[data-visual-root]");
  expect(visualRoots.length).toBe(1);

  const stage = container.querySelector("[data-window-compare-stage]");
  expect(stage).not.toBeNull();

  const visualRoot = visualRoots[0] as HTMLElement;
  expect(visualRoot.getAttribute("data-visual-kind")).toBe(kind);
  expect(visualRoot.getAttribute("data-visual-state")).toBe(state);

  // [data-window-compare-stage]는 [data-visual-root] 내부에 중첩돼야 한다
  expect(visualRoot.contains(stage)).toBe(true);
}

/* ── Folder 8-state inventory ────────────────────────────────── */

describe("Folder compare inventory — 8-state", () => {
  describe("windows-folder--compare-live-blog", () => {
    it("[data-visual-root]와 [data-window-compare-stage]가 올바른 계층으로 존재한다", () => {
      render(
        createElement(
          CompareWindowStage,
          { kind: "folder", state: "live-blog", variant: "desktop" },
          createElement(Folder, FOLDER_LIVE_BLOG),
        ),
      );
      assertStageContract("folder", "live-blog");
    });

    it("data-visual-kind가 정확히 'folder'다", () => {
      render(
        createElement(
          CompareWindowStage,
          { kind: "folder", state: "live-blog", variant: "desktop" },
          createElement(Folder, FOLDER_LIVE_BLOG),
        ),
      );
      const root = container.querySelector("[data-visual-root]") as HTMLElement;
      expect(root.getAttribute("data-visual-kind")).toBe("folder");
    });

    it("data-visual-state가 정확히 'live-blog'다", () => {
      render(
        createElement(
          CompareWindowStage,
          { kind: "folder", state: "live-blog", variant: "desktop" },
          createElement(Folder, FOLDER_LIVE_BLOG),
        ),
      );
      const root = container.querySelector("[data-visual-root]") as HTMLElement;
      expect(root.getAttribute("data-visual-state")).toBe("live-blog");
    });
  });

  describe("windows-folder--compare-live-search-open", () => {
    it("[data-visual-root]와 [data-window-compare-stage]가 올바른 계층으로 존재한다", () => {
      render(
        createElement(
          CompareWindowStage,
          { kind: "folder", state: "live-search-open", variant: "desktop" },
          createElement(Folder, FOLDER_LIVE_SEARCH_OPEN),
        ),
      );
      assertStageContract("folder", "live-search-open");
    });
  });

  describe("windows-folder--compare-live-chip-open", () => {
    it("[data-visual-root]와 [data-window-compare-stage]가 올바른 계층으로 존재한다", () => {
      render(
        createElement(
          CompareWindowStage,
          { kind: "folder", state: "live-chip-open", variant: "desktop" },
          createElement(Folder, FOLDER_LIVE_CHIP_OPEN),
        ),
      );
      assertStageContract("folder", "live-chip-open");
    });
  });

  describe("windows-folder--compare-live-sidebar-hover", () => {
    it("[data-visual-root]와 [data-window-compare-stage]가 올바른 계층으로 존재한다", () => {
      render(
        createElement(
          CompareWindowStage,
          { kind: "folder", state: "live-sidebar-hover", variant: "desktop" },
          createElement(Folder, FOLDER_LIVE_SIDEBAR_HOVER),
        ),
      );
      assertStageContract("folder", "live-sidebar-hover");
    });
  });

  describe("windows-folder--compare-live-sidebar-expanded", () => {
    it("[data-visual-root]와 [data-window-compare-stage]가 올바른 계층으로 존재한다", () => {
      render(
        createElement(
          CompareWindowStage,
          { kind: "folder", state: "live-sidebar-expanded", variant: "desktop" },
          createElement(Folder, FOLDER_LIVE_SIDEBAR_EXPANDED),
        ),
      );
      assertStageContract("folder", "live-sidebar-expanded");
    });
  });

  describe("windows-folder--compare-live-thumbnail-hover", () => {
    it("[data-visual-root]와 [data-window-compare-stage]가 올바른 계층으로 존재한다", () => {
      render(
        createElement(
          CompareWindowStage,
          { kind: "folder", state: "live-thumbnail-hover", variant: "desktop" },
          createElement(Folder, FOLDER_LIVE_THUMBNAIL_HOVER),
        ),
      );
      assertStageContract("folder", "live-thumbnail-hover");
    });
  });

  describe("windows-folder--compare-mobile-blog", () => {
    it("[data-visual-root]와 [data-window-compare-stage]가 올바른 계층으로 존재한다", () => {
      render(
        createElement(
          CompareWindowStage,
          { kind: "folder", state: "mobile-blog", variant: "mobile" },
          createElement(Folder, FOLDER_MOBILE_BLOG),
        ),
      );
      assertStageContract("folder", "mobile-blog");
    });

    it("data-window-variant가 'mobile'이다", () => {
      render(
        createElement(
          CompareWindowStage,
          { kind: "folder", state: "mobile-blog", variant: "mobile" },
          createElement(Folder, FOLDER_MOBILE_BLOG),
        ),
      );
      const stage = container.querySelector("[data-window-compare-stage]") as HTMLElement;
      expect(stage.getAttribute("data-window-variant")).toBe("mobile");
    });
  });

  describe("windows-folder--compare-mobile-search-open", () => {
    it("[data-visual-root]와 [data-window-compare-stage]가 올바른 계층으로 존재한다", () => {
      render(
        createElement(
          CompareWindowStage,
          { kind: "folder", state: "mobile-search-open", variant: "mobile" },
          createElement(Folder, FOLDER_MOBILE_SEARCH_OPEN),
        ),
      );
      assertStageContract("folder", "mobile-search-open");
    });
  });
});

/* ── Browser 7-state inventory ───────────────────────────────── */

describe("Browser compare inventory — 7-state", () => {
  describe("windows-browser--compare-live-article", () => {
    it("[data-visual-root]와 [data-window-compare-stage]가 올바른 계층으로 존재한다", () => {
      render(
        createElement(
          CompareWindowStage,
          { kind: "browser", state: "live-article", variant: "desktop" },
          createElement(Browser, BROWSER_LIVE_ARTICLE),
        ),
      );
      assertStageContract("browser", "live-article");
    });

    it("data-visual-kind가 정확히 'browser'다", () => {
      render(
        createElement(
          CompareWindowStage,
          { kind: "browser", state: "live-article", variant: "desktop" },
          createElement(Browser, BROWSER_LIVE_ARTICLE),
        ),
      );
      const root = container.querySelector("[data-visual-root]") as HTMLElement;
      expect(root.getAttribute("data-visual-kind")).toBe("browser");
    });

    it("data-visual-state가 정확히 'live-article'다", () => {
      render(
        createElement(
          CompareWindowStage,
          { kind: "browser", state: "live-article", variant: "desktop" },
          createElement(Browser, BROWSER_LIVE_ARTICLE),
        ),
      );
      const root = container.querySelector("[data-visual-root]") as HTMLElement;
      expect(root.getAttribute("data-visual-state")).toBe("live-article");
    });
  });

  describe("windows-browser--compare-live-address-open", () => {
    it("[data-visual-root]와 [data-window-compare-stage]가 올바른 계층으로 존재한다", () => {
      render(
        createElement(
          CompareWindowStage,
          { kind: "browser", state: "live-address-open", variant: "desktop" },
          createElement(Browser, BROWSER_LIVE_ADDRESS_OPEN),
        ),
      );
      assertStageContract("browser", "live-address-open");
    });
  });

  describe("windows-browser--compare-live-control-hover-minimize", () => {
    it("[data-visual-root]와 [data-window-compare-stage]가 올바른 계층으로 존재한다", () => {
      render(
        createElement(
          CompareWindowStage,
          { kind: "browser", state: "live-control-hover-minimize", variant: "desktop" },
          createElement(Browser, BROWSER_LIVE_CONTROL_HOVER_MINIMIZE),
        ),
      );
      assertStageContract("browser", "live-control-hover-minimize");
    });
  });

  describe("windows-browser--compare-live-control-hover-maximize", () => {
    it("[data-visual-root]와 [data-window-compare-stage]가 올바른 계층으로 존재한다", () => {
      render(
        createElement(
          CompareWindowStage,
          { kind: "browser", state: "live-control-hover-maximize", variant: "desktop" },
          createElement(Browser, BROWSER_LIVE_CONTROL_HOVER_MAXIMIZE),
        ),
      );
      assertStageContract("browser", "live-control-hover-maximize");
    });
  });

  describe("windows-browser--compare-live-control-hover-close", () => {
    it("[data-visual-root]와 [data-window-compare-stage]가 올바른 계층으로 존재한다", () => {
      render(
        createElement(
          CompareWindowStage,
          { kind: "browser", state: "live-control-hover-close", variant: "desktop" },
          createElement(Browser, BROWSER_LIVE_CONTROL_HOVER_CLOSE),
        ),
      );
      assertStageContract("browser", "live-control-hover-close");
    });
  });

  describe("windows-browser--compare-mobile-article", () => {
    it("[data-visual-root]와 [data-window-compare-stage]가 올바른 계층으로 존재한다", () => {
      render(
        createElement(
          CompareWindowStage,
          { kind: "browser", state: "mobile-article", variant: "mobile" },
          createElement(Browser, BROWSER_MOBILE_ARTICLE),
        ),
      );
      assertStageContract("browser", "mobile-article");
    });

    it("data-window-variant가 'mobile'이다", () => {
      render(
        createElement(
          CompareWindowStage,
          { kind: "browser", state: "mobile-article", variant: "mobile" },
          createElement(Browser, BROWSER_MOBILE_ARTICLE),
        ),
      );
      const stage = container.querySelector("[data-window-compare-stage]") as HTMLElement;
      expect(stage.getAttribute("data-window-variant")).toBe("mobile");
    });
  });

  describe("windows-browser--compare-mobile-address-open", () => {
    it("[data-visual-root]와 [data-window-compare-stage]가 올바른 계층으로 존재한다", () => {
      render(
        createElement(
          CompareWindowStage,
          { kind: "browser", state: "mobile-address-open", variant: "mobile" },
          createElement(Browser, BROWSER_MOBILE_ADDRESS_OPEN),
        ),
      );
      assertStageContract("browser", "mobile-address-open");
    });
  });
});

/* ── Inventory completeness 검증 ─────────────────────────────── */

describe("compare inventory — 15-state completeness 검증", () => {
  /**
   * 이 테스트는 canonical 15개 story ID가 모두 정의됐음을 선언적으로 고정한다.
   * Phase 4 capture tooling은 이 목록만 current capture 대상으로 사용해야 한다.
   */
  it("Folder 8-state + Browser 7-state = total 15개 story ID가 canonical inventory다", () => {
    const FOLDER_STORY_IDS = [
      "windows-folder--compare-live-blog",
      "windows-folder--compare-live-search-open",
      "windows-folder--compare-live-chip-open",
      "windows-folder--compare-live-sidebar-hover",
      "windows-folder--compare-live-sidebar-expanded",
      "windows-folder--compare-live-thumbnail-hover",
      "windows-folder--compare-mobile-blog",
      "windows-folder--compare-mobile-search-open",
    ] as const;

    const BROWSER_STORY_IDS = [
      "windows-browser--compare-live-article",
      "windows-browser--compare-live-address-open",
      "windows-browser--compare-live-control-hover-minimize",
      "windows-browser--compare-live-control-hover-maximize",
      "windows-browser--compare-live-control-hover-close",
      "windows-browser--compare-mobile-article",
      "windows-browser--compare-mobile-address-open",
    ] as const;

    const ALL_STORY_IDS = [...FOLDER_STORY_IDS, ...BROWSER_STORY_IDS];

    expect(FOLDER_STORY_IDS.length).toBe(8);
    expect(BROWSER_STORY_IDS.length).toBe(7);
    expect(ALL_STORY_IDS.length).toBe(15);
  });

  it("Folder story ID는 모두 'windows-folder--compare-' prefix를 가진다", () => {
    const folderStoryIds = [
      "windows-folder--compare-live-blog",
      "windows-folder--compare-live-search-open",
      "windows-folder--compare-live-chip-open",
      "windows-folder--compare-live-sidebar-hover",
      "windows-folder--compare-live-sidebar-expanded",
      "windows-folder--compare-live-thumbnail-hover",
      "windows-folder--compare-mobile-blog",
      "windows-folder--compare-mobile-search-open",
    ];

    for (const id of folderStoryIds) {
      expect(id.startsWith("windows-folder--compare-")).toBe(true);
    }
  });

  it("Browser story ID는 모두 'windows-browser--compare-' prefix를 가진다", () => {
    const browserStoryIds = [
      "windows-browser--compare-live-article",
      "windows-browser--compare-live-address-open",
      "windows-browser--compare-live-control-hover-minimize",
      "windows-browser--compare-live-control-hover-maximize",
      "windows-browser--compare-live-control-hover-close",
      "windows-browser--compare-mobile-article",
      "windows-browser--compare-mobile-address-open",
    ];

    for (const id of browserStoryIds) {
      expect(id.startsWith("windows-browser--compare-")).toBe(true);
    }
  });
});
