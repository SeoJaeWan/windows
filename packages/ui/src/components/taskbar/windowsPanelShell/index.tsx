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
 * and top search row. Geometry mirrors the Windows 11 start panel reference
 * (h-[600px], rounded-lg, border, bg-gray-50).
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
      className={`windows-panel-shell h-[600px] w-[360px] rounded-lg border border-[var(--taskbar-border,#e0e0e0)] bg-gray-50 shadow-sm flex flex-col ${className ?? ""}`.trim()}
      {...rest}
    >
      <div className="windows-panel-search-row px-5 pt-5 pb-3 shrink-0">
        <TaskbarSearch
          placeholder={searchPlaceholder}
          value={searchValue}
          readOnly
        />
      </div>
      <div className="windows-panel-body flex-1 min-h-0 px-5 pb-5">
        {children}
      </div>
    </div>
  );
}

export default WindowsPanelShell;
