import type { ReactNode } from "react";

import { cn } from "../../../../internal/cn";

type WindowFrameProps = {
  /** Chrome row content — titlebar / inputs / address bar. Leaf-owned. */
  chrome: ReactNode;
  /** Optional window control cluster rendered at the end of the chrome row. */
  controls?: ReactNode;
  /** Body content slot. */
  children: ReactNode;
  className?: string;
};

/**
 * WindowFrame
 *
 * Internal-only shared shell for the windows family (Folder, Browser).
 * Owns:
 *   - outer frame radius / border / shadow  (via `window-frame` utility)
 *   - chrome row height + surface           (via `window-chrome` utility)
 *   - content body slot                      (via `window-content` utility)
 *
 * Does NOT own leaf-specific chrome content (tab-bar vs address bar) — that
 * is leaf-owned and passed through `chrome` / `controls` / `children`.
 *
 * NOT exported from `packages/ui/src/index.ts`. The package's public
 * surface is the `Folder` and `Browser` leaves only. `index.test.ts`
 * asserts `"WindowFrame" in WindowsUI === false`.
 */
function WindowFrame({ chrome, controls, children, className }: WindowFrameProps) {
  return (
    <div className={cn("window-frame flex flex-col", className)}>
      <div className="window-chrome flex items-center shrink-0 px-2 gap-2">
        <div className="flex-1 min-w-0 flex items-center gap-2">{chrome}</div>
        {controls ? (
          <div className="shrink-0 flex items-center gap-1">{controls}</div>
        ) : null}
      </div>
      <div className="window-content flex">{children}</div>
    </div>
  );
}

export default WindowFrame;
