import type { ReactNode } from "react";

type WindowFrameProps = {
  /** Titlebar / chrome slot — rendered above the content boundary. */
  chrome: ReactNode;
  /** Body content slot — rendered below the chrome boundary. */
  children: ReactNode;
  /** Optional extra className appended to the outer frame element. */
  className?: string;
};

/**
 * WindowFrame
 *
 * Internal-only shared shell owner for the windows family (Folder, Browser).
 *
 * Owns:
 *   - frame-surface: outer frame border, shadow, radius (window-frame utility)
 *   - chrome-surface: titlebar area background and chrome/content separator (window-chrome utility)
 *   - content-surface: body area background and inset (window-content utility)
 *   - shell flex layout: column direction, full height
 *
 * Does NOT own:
 *   - leaf chrome detail (location input, address bar, tab bar, search input)
 *   - window control button hover/active variants (leaf-specific)
 *   - open/close orchestration
 *   - positioning (absolute/fixed)
 *   - public export — this component is internal boundary only
 *
 * Usage (leaf components only):
 *   import WindowFrame from '../internal/windowFrame';
 *
 * Public export: NONE. Do not re-export from packages/ui/src/index.ts.
 */
function WindowFrame({ chrome, children, className }: WindowFrameProps) {
  return (
    <div className={["window-frame flex flex-col w-full h-full", className].filter(Boolean).join(" ")}>
      {/* chrome-surface: titlebar + control cluster area */}
      <div className="window-chrome shrink-0 flex items-center">
        {chrome}
      </div>

      {/* content-surface: body area */}
      <div className="window-content">
        {children}
      </div>
    </div>
  );
}

export default WindowFrame;
