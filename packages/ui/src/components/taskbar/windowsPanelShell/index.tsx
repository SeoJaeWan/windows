import type { ComponentPropsWithoutRef, ReactNode } from "react";

import TaskbarSearch from "../taskbarSearch";

type WindowsPanelShellProps = ComponentPropsWithoutRef<"div"> & {
  searchPlaceholder?: string;
  searchValue?: string;
  children?: ReactNode;
};

/**
 * WindowsPanelShell
 *
 * Desktop-only panel card that provides the rounded container, bright background,
 * and top search row. Geometry mirrors the blog reference implementation:
 *
 * - Container: h-[600px], rounded-lg, border border-taskbar-border, bg-gray-50,
 *   backdrop-blur-2xl, shadow-sm
 * - Inner layout: px-5 pt-5, text-sm
 * - Search input: full-width rounded-full with left icon (via TaskbarSearch)
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
      className={`windows-panel-shell h-[600px] w-[360px] rounded-lg border border-[var(--taskbar-border)] bg-gray-50 backdrop-blur-2xl shadow-sm text-sm flex flex-col px-5 pt-5 ${className ?? ""}`.trim()}
      {...rest}
    >
      <div className="windows-panel-search-row shrink-0">
        <TaskbarSearch
          className="w-full"
          placeholder={searchPlaceholder}
          value={searchValue}
          readOnly
        />
      </div>
      <div className="windows-panel-body flex-1 min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export default WindowsPanelShell;
