import type { ReactNode } from "react";
import type { BrowserCompareState, FolderCompareState } from "./windowFigmaReviewRegistration";

/**
 * Allowed `data-visual-kind` values for windows compare surfaces.
 *
 * Scoped to the windows family only:
 * - folder  — Folder window component
 * - browser — Browser window component
 */
type WindowVisualKind = "folder" | "browser";

/**
 * Discriminated union on kind so state is constrained to the canonical
 * per-kind suffix values derived from CANONICAL_COMPARE_STATES.
 *
 * When kind is "folder", state must be a FolderCompareState suffix
 * (e.g. "desktop-blog", "desktop-search-open", "mobile-blog").
 * When kind is "browser", state must be a BrowserCompareState suffix
 * (e.g. "desktop-article", "desktop-address-open", "mobile-article").
 *
 * Both types are automatically computed from the canonical array in
 * windowFigmaReviewRegistration.ts — no hand-written literal union needed.
 * Legacy aliases desktop-card, mobile-card, desktop-chrome, mobile-chrome
 * are retired and will cause a type error here.
 */
type WindowCompareRootProps =
  | { kind: "folder"; state: FolderCompareState; children: ReactNode }
  | { kind: "browser"; state: BrowserCompareState; children: ReactNode };

/**
 * WindowCompareRoot
 *
 * Windows-owned machine-capture wrapper for visual diff tooling.
 * Renders a single `data-visual-root` element with `data-visual-kind` and
 * `data-visual-state` metadata so external tools can locate and capture the
 * compare surface with a stable `[data-visual-root]` selector.
 *
 * Scoped to the windows family (folder, browser) — does not accept taskbar
 * or panel kind values.
 *
 * This helper intentionally omits all human-review decorations:
 * no labels, no linear-gradient backdrops, no desktop canvas, no extra
 * padding frames, no consumer-injectable style overrides. It provides
 * the minimal DOM needed for visual capture only.
 *
 * DOM contract (owner):
 * - [data-visual-root]       → always present on root element
 * - [data-visual-kind]       → "folder" | "browser"
 * - [data-visual-state]      → canonical Figma state key (e.g. "desktop-blog", "desktop-article")
 *
 * Stage ownership is separate — [data-window-compare-stage] is owned by
 * CompareWindowDesktopStage / CompareWindowMobileStage in compareWindowStage.tsx.
 *
 * windowCompareInventory.test.tsx reads these markers to validate invariants.
 */
function WindowCompareRoot({ kind, state, children }: WindowCompareRootProps) {
  return (
    <div
      data-visual-root=""
      data-visual-kind={kind}
      data-visual-state={state}
    >
      {children}
    </div>
  );
}

export type { WindowVisualKind, WindowCompareRootProps };
export default WindowCompareRoot;
