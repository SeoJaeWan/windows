import type { ReactNode } from "react";

import { cn } from "../../../../internal/cn";

/**
 * WindowFrame — internal-only shared shell owner
 *
 * This component is the canonical shared structure for the windows family
 * (Folder, Browser). It owns:
 *
 *   - Outer frame geometry: border, shadow, radius (frame-surface)
 *   - Shared chrome slot: titlebar area height and background (chrome-surface)
 *   - Control cluster slot: affordance placement (control-surface)
 *   - Content body slot: background and flex boundary (content-surface)
 *
 * Leaf-specific chrome variants are NOT owned here:
 *   - Folder chrome: tab-bar style titlebar, sidebar layout
 *   - Browser chrome: address bar, navigation controls
 *   These belong to the respective leaf owners (Phase 3+).
 *
 * Mobile hierarchy rules (fixed at foundation boundary):
 *   Folder  — content-first grid: sidebar collapses to drawer,
 *             grid items fill the viewport. Desktop sidebar shrink is invalid.
 *   Browser — simplified chrome / content-first reading hierarchy:
 *             address bar and control cluster simplify on mobile,
 *             content fills viewport. Desktop chrome density copy is invalid.
 *
 * panels import is invalid — this component does NOT reuse any surface
 * from the panels domain. windows family owns its own shell.
 *
 * Public export: NONE — this is an internal helper.
 * Consumers (Folder, Browser) import directly from this file path.
 */

type WindowFrameProps = {
  /**
   * Leaf-specific chrome slot.
   * Folder passes its tab-bar titlebar; Browser passes its address-bar chrome.
   * WindowFrame does not constrain the chrome variant — slot is open.
   */
  chrome: ReactNode;
  /**
   * Window control cluster slot (minimize, maximize, close affordances).
   * Placement is shared (trailing edge of chrome), but appearance is leaf-owned.
   */
  controls?: ReactNode;
  /**
   * Content body slot. Fills the remaining height below the chrome.
   * Leaf determines content layout (grid, scroll, sidebar+main, etc.).
   */
  children: ReactNode;
  /** Additional className applied to the outermost frame element. */
  className?: string;
};

/**
 * WindowFrame
 *
 * Internal shared shell for Folder and Browser windows.
 * Renders a vertical flex column:
 *
 *   ┌─────────────────────────────────┐  ← window-frame (frame-surface)
 *   │  [chrome slot]   [controls slot]│  ← window-chrome (chrome-surface)
 *   ├─────────────────────────────────┤
 *   │                                 │
 *   │  [children — content slot]      │  ← window-content (content-surface)
 *   │                                 │
 *   └─────────────────────────────────┘
 *
 * Chrome and controls are rendered together in the chrome row.
 * The chrome slot is flex-1 so the controls slot always trails.
 */
function WindowFrame({ chrome, controls, children, className }: WindowFrameProps) {
  return (
    <div className={cn("window-frame flex flex-col", className)}>
      {/* Chrome row — shared shell owns row layout; leaf owns chrome content */}
      <div className="window-chrome flex items-center shrink-0">
        {/* Leaf chrome slot — tab-bar (Folder) or address-bar (Browser) */}
        <div className="flex-1 min-w-0 h-full flex items-center">{chrome}</div>
        {/* Control cluster slot — trailing edge, leaf supplies affordances */}
        {controls != null && (
          <div className="shrink-0 flex items-center">{controls}</div>
        )}
      </div>
      {/* Content body slot — leaf determines layout (grid / scroll / sidebar+main) */}
      <div className="window-content flex flex-col">{children}</div>
    </div>
  );
}

export type { WindowFrameProps };
export default WindowFrame;
