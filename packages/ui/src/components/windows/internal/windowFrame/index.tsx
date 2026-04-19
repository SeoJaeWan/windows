import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "../../../../internal/cn";

/**
 * Reserved package-owned marker keys.
 * These must not be overrideable via consumer `...rest` spread.
 * Strip them from rest before forwarding, then apply canonical values after spread.
 */
const RESERVED_FRAME_MARKERS = [
  "data-window-frame-root",
  "data-window-frame-chrome",
  "data-window-frame-body",
  "data-window-compare-stage",
] as const;

type WindowFrameProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  /**
   * Chrome slot — Folder and Browser each own their chrome structure.
   * Renders above the body slot with `shrink-0` so it never scrolls.
   */
  chrome: ReactNode;
  children: ReactNode;
};

/**
 * WindowFrame
 *
 * Internal-only foundation shared by Folder and Browser windows.
 * Owns the outermost window shell geometry (rounded border, shadow, flex column)
 * and the body slot boundary. Chrome is a caller-supplied slot so each window
 * type (Folder: titlebar + toolbar + search area; Browser: tab titlebar + toolbar)
 * can compose its own chrome without a shared prop interface.
 *
 * - Chrome slot: shrink-0, renders titlebar/toolbar rows
 * - Body slot:   flex-1 overflow-hidden — children own scrolling
 *
 * NOT exported from package root.
 *
 * Reserved marker contract:
 * - [data-window-frame-root]     → root div
 * - [data-window-frame-chrome]   → chrome wrapper (owned by caller, placed inside)
 * - [data-window-frame-body]     → body slot div
 * - [data-window-compare-stage]  → owned by CompareWindowStage host, NOT frame root
 *
 * These markers are package-owned. Consumer attrs forwarded via ...rest are
 * stripped before spread to ensure canonical marker values always win.
 * data-window-compare-stage is stripped to prevent consumer pass-through from
 * creating duplicate markers alongside the CompareWindowStage host canvas.
 *
 * Phase 3 blocking surface boundary (Figma first-pass parity):
 * BLOCKING:
 *   - Outer boundary: h-full fills compare stage (1282×752 desktop, 392×796 mobile).
 *     rounded-lg + border border-shell + overflow-hidden define the outer window box.
 *   - Chrome boundary: shrink-0 on chrome wrapper ensures chrome rows are never
 *     compressed — body starts at the correct vertical offset after all chrome rows.
 *   - Body boundary: flex-1 overflow-hidden — body fills remaining height exactly;
 *     no overflow or clipping drift relative to chrome bottom edge.
 *
 * NON-BLOCKING (out of Phase 3 scope):
 *   - Exact border-radius pixel value (rounded-lg = 8px; shape is acceptable)
 *   - shadow-sm exact shadow spread
 *   - bg-white frame background (Phase 5 closure: changed from bg-gray-50 to match Figma)
 */
function WindowFrame({ chrome, children, className, ...rest }: WindowFrameProps) {
  // Strip reserved marker keys from consumer rest to prevent override.
  // Package-owned canonical values are applied explicitly after the spread.
  const safeRest = { ...rest } as Record<string, unknown>;
  for (const key of RESERVED_FRAME_MARKERS) {
    delete safeRest[key];
  }

  return (
    <div
      className={cn(
        "window-frame flex flex-col h-full rounded-lg border border-shell bg-white shadow-sm overflow-hidden",
        className
      )}
      {...safeRest}
      data-window-frame-root=""
    >
      {/* Chrome slot — provided by Folder or Browser */}
      <div className="window-frame-chrome shrink-0" data-window-frame-chrome="">
        {chrome}
      </div>

      {/* Body slot */}
      <div className="window-frame-body flex-1 overflow-hidden" data-window-frame-body="">{children}</div>
    </div>
  );
}

export default WindowFrame;
