import type { ReactNode } from "react";
import type { CanonicalCompareState } from "./windowFigmaReviewRegistration";

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
 * - [data-visual-kind]       → "folder" | "browser" (derived from state prefix)
 * - [data-visual-state]      → full canonical Figma state key (e.g. "folder/desktop-blog")
 *
 * `state` must be a CanonicalCompareState literal from CANONICAL_COMPARE_STATES.
 * `data-visual-kind` is derived from the prefix of `state` (the segment before "/").
 * This ensures consumers can match `data-visual-state` directly against
 * CANONICAL_COMPARE_STATES without any concatenation or reconstruction.
 *
 * Stage ownership is separate — [data-window-compare-stage] is owned by
 * CompareWindowDesktopStage / CompareWindowMobileStage in compareWindowStage.tsx.
 *
 * windowCompareInventory.test.tsx reads these markers to validate invariants.
 */
type WindowCompareRootProps = {
  state: CanonicalCompareState;
  children: ReactNode;
};

function WindowCompareRoot({ state, children }: WindowCompareRootProps) {
  const kind = state.split("/")[0] as "folder" | "browser";
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

export type { WindowCompareRootProps };
export default WindowCompareRoot;
