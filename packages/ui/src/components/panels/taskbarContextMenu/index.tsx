import type { ComponentPropsWithoutRef } from "react";

import { Pin16Regular, PinOff16Regular, Dismiss16Regular } from "@fluentui/react-icons";
import IconImage from "../../common/iconImage";

/* ── Types ───────────────────────────────────────────────────── */

type TaskbarContextMenuAppRow = {
  id: string;
  label: string;
  iconSrc: string;
};

type TaskbarContextMenuProps = ComponentPropsWithoutRef<"div"> & {
  appRows: [TaskbarContextMenuAppRow, ...TaskbarContextMenuAppRow[]];
  taskbarPinState: "pinned" | "unpinned";
};

/* ── Component ───────────────────────────────────────────────── */

/**
 * TaskbarContextMenu
 *
 * Visual-only context menu surface for taskbar icon right-click.
 * Receives a non-empty `appRows` array and a `taskbarPinState` to
 * render the fixed row topology.
 *
 * Canonical states (exactly 2, selected by `taskbarPinState`):
 * - `context-pinned`   — `taskbarPinState === "pinned"`
 * - `context-unpinned` — `taskbarPinState === "unpinned"`
 *
 * Row topology (fixed, package-owned):
 * 1. Caller app rows in array order — bitmap icon via `IconImage` + label
 * 2. Divider (visual separator)
 * 3. Pin action row (`data-action-id="pin-taskbar"`):
 *    - pinned  → label `작업 표시줄에서 제거`, icon `PinOff16Regular`
 *    - unpinned → label `작업 표시줄에 고정`, icon `Pin16Regular`
 * 4. Close-all row (`data-action-id="close-all"`):
 *    - label `모든 창 닫기` (always), icon `Dismiss16Regular`
 *
 * Label winner rule follows the same conditional pattern as
 * `panelSearchResultsView` pin-taskbar action.
 *
 * Does NOT own: onSelect callback, onClose callback, anchorRect
 * positioning, open/close orchestration, placement logic, generic
 * actions array, footer rows, or render-row customisation.
 */
function TaskbarContextMenu({ appRows, taskbarPinState, className, ...rest }: TaskbarContextMenuProps) {
  const isPinned = taskbarPinState === "pinned";

  return (
    <div
      className={`bg-gray-50/95 backdrop-blur-xl shadow-lg rounded-lg border border-gray-200 py-1.5 w-[280px] ${className ?? ""}`.trim()}
      data-state={isPinned ? "context-pinned" : "context-unpinned"}
      {...rest}
    >
      {/* App rows */}
      {appRows.map((row) => (
        <div
          key={row.id}
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-black/5 transition-colors cursor-default"
          data-app-row={row.id}
        >
          <IconImage src={row.iconSrc} alt={row.label} className="size-4 shrink-0" />
          <span className="min-w-0 flex-1 truncate text-xs text-gray-800">
            {row.label}
          </span>
        </div>
      ))}

      {/* Divider */}
      <div className="border-t border-gray-200 my-1" />

      {/* Pin action row */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 hover:bg-black/5 transition-colors cursor-default"
        data-action-id="pin-taskbar"
      >
        <span className="shrink-0 text-gray-600" aria-hidden="true">
          {isPinned ? <PinOff16Regular className="size-4" /> : <Pin16Regular className="size-4" />}
        </span>
        <span className="min-w-0 flex-1 truncate text-xs text-gray-800">
          {isPinned ? "작업 표시줄에서 제거" : "작업 표시줄에 고정"}
        </span>
      </div>

      {/* Close-all row */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 hover:bg-black/5 transition-colors cursor-default"
        data-action-id="close-all"
      >
        <span className="shrink-0 text-gray-600" aria-hidden="true">
          <Dismiss16Regular className="size-4" />
        </span>
        <span className="min-w-0 flex-1 truncate text-xs text-gray-800">
          모든 창 닫기
        </span>
      </div>
    </div>
  );
}

export default TaskbarContextMenu;
