import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";

type WindowsPanelShellProps = ComponentPropsWithoutRef<"div"> & {
  searchPlaceholder?: string;
  searchValue?: string;
  children?: ReactNode;
};

/* Search icon data-uri — embedded to avoid external dependency */
const SEARCH_ICON_SVG =
  "url(\"data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke-width='2' d='M15,15 L22,22 L15,15 Z M9.5,17 C13.6421356,17 17,13.6421356 17,9.5 C17,5.35786438 13.6421356,2 9.5,2 C5.35786438,2 2,5.35786438 2,9.5 C2,13.6421356 5.35786438,17 9.5,17 Z'/%3E%3C/svg%3E\")";

const searchIconStyle: CSSProperties & { "--taskbar-search-icon-mask": string } = {
  "--taskbar-search-icon-mask": SEARCH_ICON_SVG,
};

/**
 * WindowsPanelShell
 *
 * Desktop-only panel card that provides the rounded container, bright background,
 * and top search row. Geometry mirrors the blog reference implementation:
 *
 * - Container: h-[600px], rounded-lg, border border-border-subtle, bg-gray-50,
 *   backdrop-blur-2xl, shadow-sm
 * - Inner layout: px-5 pt-5, text-sm
 * - Search input: full-width rounded-full with left icon, p-1.5 pl-[30px]
 * - Body region: flex-1 overflow-hidden (content provides its own pt-7 spacing)
 *
 * State orchestration (open/close, anchor, render-target, key-dismiss,
 * click-away) is intentionally excluded — those concerns belong to a future
 * interactive layer.
 */
function WindowsPanelShell({
  searchPlaceholder,
  searchValue,
  children,
  className,
  ...rest
}: WindowsPanelShellProps) {
  return (
    <div
      className={`windows-panel-shell h-[600px] w-[360px] rounded-lg border border-[var(--border-subtle,#e0e0e0)] bg-gray-50 backdrop-blur-2xl shadow-sm text-sm flex flex-col px-5 pt-5 ${className ?? ""}`.trim()}
      {...rest}
    >
      <form className="windows-panel-search-row shrink-0">
        <span className="relative block">
          <input
            type="text"
            className="windows-panel-search-input w-full border border-[var(--taskbar-border,#d1d5db)] p-1.5 pl-[30px] rounded-full text-sm bg-white/90"
            placeholder={searchPlaceholder}
            value={searchValue}
            readOnly
          />
          <span
            className="taskbar-search-icon pointer-events-none absolute left-[10px] top-[60%] -translate-y-1/2"
            aria-hidden="true"
            style={searchIconStyle}
          />
        </span>
      </form>
      <div className="windows-panel-body flex-1 min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export default WindowsPanelShell;
