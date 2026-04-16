import type { ComponentPropsWithoutRef } from "react";

import { Pin16Regular, PinOff16Regular, Dismiss16Regular } from "@fluentui/react-icons";
import { cn } from "../../../internal/cn";
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
  /** Optional app identifier row rendered after the divider. */
  appIdentifier?: { label: string; iconSrc: string };
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
 * 0. "작업" section header (always)
 * 1. Caller app rows in array order — bitmap icon via `IconImage` + label
 * 2. Divider (visual separator)
 * 2a. Optional `appIdentifier` row (button, same hover as other rows)
 * 3. Pin action row (`data-action-id="pin-taskbar"`):
 *    - pinned  → label `작업 표시줄에서 제거`, icon `PinOff16Regular`
 *    - unpinned → label `작업 표시줄에 고정`, icon `Pin16Regular`
 * 4. Close-all row (`data-action-id="close-all"`):
 *    - label `모든 창 닫기` (always), icon `Dismiss16Regular`
 *
 * All rows are `<button type="button">` for accessibility and
 * consistent hover behaviour. cursor-default is kept to match the
 * Windows 11 context-menu feel.
 *
 * Does NOT own: onSelect callback, onClose callback, anchorRect
 * positioning, open/close orchestration, placement logic, generic
 * actions array, footer rows, or render-row customisation.
 */
function TaskbarContextMenu({ appRows, taskbarPinState, appIdentifier, className, ...rest }: TaskbarContextMenuProps) {
  const isPinned = taskbarPinState === "pinned";

  return (
    <div
      {...rest}
      className={cn(
        "bg-gray-50/95 backdrop-blur-2xl shadow-lg rounded-lg border border-gray-200 py-2 w-[300px]",
        className
      )}
      data-state={isPinned ? "context-pinned" : "context-unpinned"}
    >
      {/* Section header */}
      <p className="text-xs text-gray-500 px-4 pb-1">작업</p>

      {/* App rows */}
      {appRows.map((row) => (
        <button
          key={row.id}
          type="button"
          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-black/5 transition-colors cursor-default"
          data-app-row={row.id}
        >
          <IconImage src={row.iconSrc} alt={row.label} className="size-4 shrink-0" />
          <span className="min-w-0 flex-1 truncate text-xs text-gray-800 text-left">
            {row.label}
          </span>
        </button>
      ))}

      {/* Divider */}
      <div className="border-t border-gray-200 my-1" />

      {/* App identifier row (optional) */}
      {appIdentifier && (
        <button
          type="button"
          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-black/5 transition-colors cursor-default"
          data-app-identifier
        >
          <IconImage src={appIdentifier.iconSrc} alt={appIdentifier.label} className="size-4 shrink-0" />
          <span className="min-w-0 flex-1 truncate text-xs text-gray-800 text-left">
            {appIdentifier.label}
          </span>
        </button>
      )}

      {/* Pin action row */}
      <button
        type="button"
        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-black/5 transition-colors cursor-default"
        data-action-id="pin-taskbar"
      >
        {isPinned ? (
          <PinOff16Regular className="size-4 shrink-0 text-gray-600" aria-hidden="true" />
        ) : (
          <Pin16Regular className="size-4 shrink-0 text-gray-600" aria-hidden="true" />
        )}
        <span className="min-w-0 flex-1 truncate text-xs text-gray-800 text-left">
          {isPinned ? "작업 표시줄에서 제거" : "작업 표시줄에 고정"}
        </span>
      </button>

      {/* Close-all row */}
      <button
        type="button"
        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-black/5 transition-colors cursor-default"
        data-action-id="close-all"
      >
        <Dismiss16Regular className="size-4 shrink-0 text-gray-600" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-xs text-gray-800 text-left">
          모든 창 닫기
        </span>
      </button>
    </div>
  );
}

export default TaskbarContextMenu;
