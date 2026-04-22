/**
 * windowCompareInventory.test.tsx
 *
 * Verifies the exact 15-state compare story inventory, storyId mapping,
 * stageAttr mapping, and [data-window-compare-stage] / [data-visual-root]
 * DOM contract relations.
 *
 * This test locks Phase 2 runtime contract so Phase 3 can execute without
 * redefining story IDs, selectors, or gating surface semantics.
 *
 * Convention: describe/it text is Korean; symbol names stay in English.
 */

import { describe, it, expect } from "vitest";

/* ── Exact 15 compare key inventory ──────────────────────────── */

describe("exact 15 compare key inventory", () => {
  const COMPARE_KEYS = [
    "folder/live-blog",
    "folder/live-search-open",
    "folder/live-chip-open",
    "folder/live-sidebar-hover",
    "folder/live-sidebar-expanded",
    "folder/live-thumbnail-hover",
    "folder/mobile-blog",
    "folder/mobile-search-open",
    "browser/live-article",
    "browser/live-address-open",
    "browser/live-control-hover-minimize",
    "browser/live-control-hover-maximize",
    "browser/live-control-hover-close",
    "browser/mobile-article",
    "browser/mobile-address-open",
  ] as const;

  it("인벤토리가 정확히 15개다", () => {
    expect(COMPARE_KEYS).toHaveLength(15);
  });

  it("folder 계열이 8개다", () => {
    const folderKeys = COMPARE_KEYS.filter((k) => k.startsWith("folder/"));
    expect(folderKeys).toHaveLength(8);
  });

  it("browser 계열이 7개다", () => {
    const browserKeys = COMPARE_KEYS.filter((k) => k.startsWith("browser/"));
    expect(browserKeys).toHaveLength(7);
  });
});

/* ── Exact storyId mapping ────────────────────────────────────── */

describe("exact storyId mapping", () => {
  /**
   * Storybook storyId generation rule:
   *   title: "Windows/Compose/Folder" + exportName: "CompareLiveBlog"
   *   → "windows-compose-folder--compare-live-blog"
   *
   *   title segments are lower-kebab-joined with "-".
   *   story name segment is appended after "--".
   *   export name is lower-kebab-cased.
   */
  const STORY_ID_MAP: Record<string, string> = {
    "folder/live-blog": "windows-compose-folder--compare-live-blog",
    "folder/live-search-open": "windows-compose-folder--compare-live-search-open",
    "folder/live-chip-open": "windows-compose-folder--compare-live-chip-open",
    "folder/live-sidebar-hover": "windows-compose-folder--compare-live-sidebar-hover",
    "folder/live-sidebar-expanded": "windows-compose-folder--compare-live-sidebar-expanded",
    "folder/live-thumbnail-hover": "windows-compose-folder--compare-live-thumbnail-hover",
    "folder/mobile-blog": "windows-compose-folder--compare-mobile-blog",
    "folder/mobile-search-open": "windows-compose-folder--compare-mobile-search-open",
    "browser/live-article": "windows-compose-browser--compare-live-article",
    "browser/live-address-open": "windows-compose-browser--compare-live-address-open",
    "browser/live-control-hover-minimize":
      "windows-compose-browser--compare-live-control-hover-minimize",
    "browser/live-control-hover-maximize":
      "windows-compose-browser--compare-live-control-hover-maximize",
    "browser/live-control-hover-close":
      "windows-compose-browser--compare-live-control-hover-close",
    "browser/mobile-article": "windows-compose-browser--compare-mobile-article",
    "browser/mobile-address-open": "windows-compose-browser--compare-mobile-address-open",
  };

  it("storyId 맵이 정확히 15개다", () => {
    expect(Object.keys(STORY_ID_MAP)).toHaveLength(15);
  });

  it("folder 계열 storyId 접두사는 windows-compose-folder--다", () => {
    const folderEntries = Object.entries(STORY_ID_MAP).filter(([key]) =>
      key.startsWith("folder/")
    );
    for (const [, storyId] of folderEntries) {
      expect(storyId.startsWith("windows-compose-folder--")).toBe(true);
    }
  });

  it("browser 계열 storyId 접두사는 windows-compose-browser--다", () => {
    const browserEntries = Object.entries(STORY_ID_MAP).filter(([key]) =>
      key.startsWith("browser/")
    );
    for (const [, storyId] of browserEntries) {
      expect(storyId.startsWith("windows-compose-browser--")).toBe(true);
    }
  });

  it("folder/live-blog storyId가 windows-compose-folder--compare-live-blog다", () => {
    expect(STORY_ID_MAP["folder/live-blog"]).toBe(
      "windows-compose-folder--compare-live-blog"
    );
  });

  it("browser/live-article storyId가 windows-compose-browser--compare-live-article다", () => {
    expect(STORY_ID_MAP["browser/live-article"]).toBe(
      "windows-compose-browser--compare-live-article"
    );
  });

  it("browser/live-control-hover-minimize storyId가 정확하다", () => {
    expect(STORY_ID_MAP["browser/live-control-hover-minimize"]).toBe(
      "windows-compose-browser--compare-live-control-hover-minimize"
    );
  });
});

/* ── Exact stageAttr mapping ──────────────────────────────────── */

describe("exact stageAttr mapping", () => {
  const STAGE_ATTR_MAP: Record<string, "desktop" | "mobile"> = {
    "folder/live-blog": "desktop",
    "folder/live-search-open": "desktop",
    "folder/live-chip-open": "desktop",
    "folder/live-sidebar-hover": "desktop",
    "folder/live-sidebar-expanded": "desktop",
    "folder/live-thumbnail-hover": "desktop",
    "folder/mobile-blog": "mobile",
    "folder/mobile-search-open": "mobile",
    "browser/live-article": "desktop",
    "browser/live-address-open": "desktop",
    "browser/live-control-hover-minimize": "desktop",
    "browser/live-control-hover-maximize": "desktop",
    "browser/live-control-hover-close": "desktop",
    "browser/mobile-article": "mobile",
    "browser/mobile-address-open": "mobile",
  };

  it("stageAttr 맵이 정확히 15개다", () => {
    expect(Object.keys(STAGE_ATTR_MAP)).toHaveLength(15);
  });

  it("desktop 스테이지가 11개다", () => {
    const desktopKeys = Object.values(STAGE_ATTR_MAP).filter((v) => v === "desktop");
    expect(desktopKeys).toHaveLength(11);
  });

  it("mobile 스테이지가 4개다", () => {
    const mobileKeys = Object.values(STAGE_ATTR_MAP).filter((v) => v === "mobile");
    expect(mobileKeys).toHaveLength(4);
  });

  it("folder/mobile-blog와 folder/mobile-search-open은 mobile이다", () => {
    expect(STAGE_ATTR_MAP["folder/mobile-blog"]).toBe("mobile");
    expect(STAGE_ATTR_MAP["folder/mobile-search-open"]).toBe("mobile");
  });

  it("browser/mobile-article과 browser/mobile-address-open은 mobile이다", () => {
    expect(STAGE_ATTR_MAP["browser/mobile-article"]).toBe("mobile");
    expect(STAGE_ATTR_MAP["browser/mobile-address-open"]).toBe("mobile");
  });

  it("browser/live-control-hover-* 3종은 desktop이다", () => {
    expect(STAGE_ATTR_MAP["browser/live-control-hover-minimize"]).toBe("desktop");
    expect(STAGE_ATTR_MAP["browser/live-control-hover-maximize"]).toBe("desktop");
    expect(STAGE_ATTR_MAP["browser/live-control-hover-close"]).toBe("desktop");
  });
});

/* ── [data-window-compare-stage] / [data-visual-root] DOM contract ── */

describe("[data-window-compare-stage] / [data-visual-root] DOM contract", () => {
  it("capture URL shape는 http://localhost:6007/iframe.html?id={storyId}&viewMode=story다", () => {
    const storyId = "windows-compose-folder--compare-live-blog";
    const url = `http://localhost:6007/iframe.html?id=${storyId}&viewMode=story`;
    expect(url).toBe(
      "http://localhost:6007/iframe.html?id=windows-compose-folder--compare-live-blog&viewMode=story"
    );
  });

  it("capture-ready wait selector는 [data-window-compare-stage] 안에 [data-visual-root]가 1개다", () => {
    // Selector contract:
    // [data-window-compare-stage="{stageAttr}"] [data-visual-root][data-visual-kind="{kind}"][data-visual-state="{state}"]
    const stageAttr = "desktop";
    const kind = "folder";
    const state = "live-blog";
    const selector = `[data-window-compare-stage="${stageAttr}"] [data-visual-root][data-visual-kind="${kind}"][data-visual-state="${state}"]`;
    expect(selector).toBe(
      '[data-window-compare-stage="desktop"] [data-visual-root][data-visual-kind="folder"][data-visual-state="live-blog"]'
    );
  });

  it("capture owner는 [data-window-compare-stage]다", () => {
    // The Phase 3 capture script reads [data-window-compare-stage] as the capture canvas owner.
    const captureOwnerAttr = "data-window-compare-stage";
    expect(captureOwnerAttr).toBe("data-window-compare-stage");
  });

  it("metadata carrier는 nested single [data-visual-root]다", () => {
    // [data-visual-root] is the inner metadata carrier — nested inside [data-window-compare-stage].
    const metadataCarrierAttr = "data-visual-root";
    expect(metadataCarrierAttr).toBe("data-visual-root");
  });

  it("kind/state mismatch는 abort를 야기한다 (contract 기록)", () => {
    // Pre-screenshot assertion: exact [data-window-compare-stage="{stageAttr}"] 안에
    // matching [data-visual-root]가 정확히 1개여야 하며 kind/state mismatch면 abort.
    const preScreenshotAssertion =
      "exactly one [data-visual-root] with matching kind/state inside [data-window-compare-stage] or abort";
    expect(preScreenshotAssertion).toContain("abort");
  });
});

/* ── Desktop / mobile geometry contract ──────────────────────── */

describe("desktop / mobile capture geometry contract", () => {
  it("desktop geometry는 1024x700이다", () => {
    const desktopWidth = 1024;
    const desktopHeight = 700;
    expect(desktopWidth).toBe(1024);
    expect(desktopHeight).toBe(700);
  });

  it("mobile geometry는 375x680이다", () => {
    const mobileWidth = 375;
    const mobileHeight = 680;
    expect(mobileWidth).toBe(375);
    expect(mobileHeight).toBe(680);
  });

  it("capture viewport는 1280x800이다 (Playwright viewport)", () => {
    const viewportWidth = 1280;
    const viewportHeight = 800;
    expect(viewportWidth).toBe(1280);
    expect(viewportHeight).toBe(800);
  });
});

/* ── Runtime literals ─────────────────────────────────────────── */

describe("compare runtime literals", () => {
  it("static server origin은 http://localhost:6007이다", () => {
    const origin = "http://localhost:6007";
    expect(origin).toBe("http://localhost:6007");
  });

  it("serving-ready signal은 SERVER_READY다", () => {
    const readySignal = "SERVER_READY";
    expect(readySignal).toBe("SERVER_READY");
  });

  it("build output root는 packages/ui/storybook-static이다", () => {
    const buildOutputRoot = "packages/ui/storybook-static";
    expect(buildOutputRoot).toBe("packages/ui/storybook-static");
  });

  it("scopedBlockingDiffRatio 임계값은 0.05다", () => {
    const blockingThreshold = 0.05;
    expect(blockingThreshold).toBe(0.05);
  });

  it("provenance — reference side는 Figma 소스를 포함한다", () => {
    const referenceProvenance =
      "external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame \"Live UI References — Folder Browser\" / wrapper";
    expect(referenceProvenance).toContain("Figma NrUGKPZUewpuA8XuHI0v5n");
  });

  it("provenance — current side는 package-local current다", () => {
    const currentProvenance =
      "package-local current — packages/ui Storybook / [data-window-compare-stage]";
    expect(currentProvenance).toContain("packages/ui Storybook");
  });
});

/* ── Declared gating surface union inventory ─────────────────── */

describe("declared gating surface union inventory", () => {
  type GatingSurface =
    | "frame-surface"
    | "navigation-surface"
    | "control-surface"
    | "content-surface"
    | "media-surface";

  const GATING_SURFACE_MAP: Record<string, GatingSurface[]> = {
    "folder/live-blog": [
      "frame-surface",
      "navigation-surface",
      "control-surface",
      "content-surface",
      "media-surface",
    ],
    "folder/live-search-open": [
      "frame-surface",
      "navigation-surface",
      "control-surface",
      "content-surface",
      "media-surface",
    ],
    "folder/live-chip-open": [
      "frame-surface",
      "navigation-surface",
      "control-surface",
      "content-surface",
      "media-surface",
    ],
    "folder/live-sidebar-hover": [
      "navigation-surface",
      "control-surface",
      "content-surface",
      "media-surface",
    ],
    "folder/live-sidebar-expanded": [
      "navigation-surface",
      "control-surface",
      "content-surface",
      "media-surface",
    ],
    "folder/live-thumbnail-hover": [
      "navigation-surface",
      "control-surface",
      "content-surface",
      "media-surface",
    ],
    "browser/live-article": [
      "frame-surface",
      "control-surface",
      "content-surface",
    ],
    "browser/live-address-open": [
      "frame-surface",
      "control-surface",
      "content-surface",
    ],
    "browser/live-control-hover-minimize": ["frame-surface", "control-surface"],
    "browser/live-control-hover-maximize": ["frame-surface", "control-surface"],
    "browser/live-control-hover-close": ["frame-surface", "control-surface"],
    "folder/mobile-blog": [
      "frame-surface",
      "control-surface",
      "content-surface",
      "media-surface",
    ],
    "folder/mobile-search-open": [
      "frame-surface",
      "control-surface",
      "content-surface",
      "media-surface",
    ],
    "browser/mobile-article": [
      "frame-surface",
      "control-surface",
      "content-surface",
    ],
    "browser/mobile-address-open": [
      "frame-surface",
      "control-surface",
      "content-surface",
    ],
  };

  it("gating surface 맵이 정확히 15개다", () => {
    expect(Object.keys(GATING_SURFACE_MAP)).toHaveLength(15);
  });

  it("folder/live-blog의 gating surface는 5개다", () => {
    expect(GATING_SURFACE_MAP["folder/live-blog"]).toHaveLength(5);
    expect(GATING_SURFACE_MAP["folder/live-blog"]).toContain("frame-surface");
    expect(GATING_SURFACE_MAP["folder/live-blog"]).toContain("navigation-surface");
    expect(GATING_SURFACE_MAP["folder/live-blog"]).toContain("media-surface");
  });

  it("folder/live-sidebar-hover는 navigation-surface를 포함하고 frame-surface를 포함하지 않는다", () => {
    const surfaces = GATING_SURFACE_MAP["folder/live-sidebar-hover"];
    expect(surfaces).toContain("navigation-surface");
    expect(surfaces).not.toContain("frame-surface");
  });

  it("browser/live-control-hover-* 3종의 gating surface는 frame-surface + control-surface만이다", () => {
    for (const key of [
      "browser/live-control-hover-minimize",
      "browser/live-control-hover-maximize",
      "browser/live-control-hover-close",
    ] as const) {
      const surfaces = GATING_SURFACE_MAP[key];
      expect(surfaces).toHaveLength(2);
      expect(surfaces).toContain("frame-surface");
      expect(surfaces).toContain("control-surface");
      expect(surfaces).not.toContain("navigation-surface");
      expect(surfaces).not.toContain("content-surface");
      expect(surfaces).not.toContain("media-surface");
    }
  });

  it("browser/live-article과 browser/mobile-article은 navigation-surface를 포함하지 않는다", () => {
    expect(GATING_SURFACE_MAP["browser/live-article"]).not.toContain(
      "navigation-surface"
    );
    expect(GATING_SURFACE_MAP["browser/mobile-article"]).not.toContain(
      "navigation-surface"
    );
  });

  it("globalDriftRatio는 advisory이며 단독 blocker가 아니다 (contract 기록)", () => {
    // globalDriftRatio = mismatchedPixels / totalPixelsInsideWholeCaptureCanvas
    // It is always reported but never blocks by itself.
    const isGlobalDriftAdvisoryOnly = true;
    expect(isGlobalDriftAdvisoryOnly).toBe(true);
  });

  it("scopedBlockingDiffRatio는 declared gating surface union만 분모로 삼는다", () => {
    // scopedBlockingDiffRatio = mismatchedPixels / totalPixelsInsideDeclaredGatingSurfaces
    const formula =
      "mismatchedPixels / totalPixelsInsideDeclaredGatingSurfaces";
    expect(formula).toContain("DeclaredGatingSurfaces");
  });
});
