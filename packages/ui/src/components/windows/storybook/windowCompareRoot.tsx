import type { ReactNode } from "react";

/**
 * Allowed `data-visual-kind` values for windows compare surfaces.
 *
 * Scoped to the windows family only:
 * - folder  — Folder window component
 * - browser — Browser window component
 */
type WindowVisualKind = "folder" | "browser";

type WindowCompareRootProps = {
  /** Kebab-case surface name — constrained to the windows family inventory. */
  kind: WindowVisualKind;
  /** Kebab-case state meaning (e.g. "desktop-blog", "mobile-article"). */
  state: string;
  children: ReactNode;
};

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
 * DOM contract:
 * - [data-visual-root]       → always present on root element
 * - [data-visual-kind]       → "folder" | "browser"
 * - [data-visual-state]      → kebab-case state key
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
