import { useRef, useEffect, useCallback } from "react";

import { Pin16Regular, PinOff16Regular, Dismiss16Regular } from "@fluentui/react-icons";
import { cn } from "../../../internal/cn";
import IconImage from "../../common/iconImage";
import type { SurfacePhase } from "../taskbarAttachedSurface/shared";
import { getMotionClass, attachExitListener } from "../taskbarAttachedSurface/motion";

/* ── Types ───────────────────────────────────────────────────── */

type TaskbarContextMenuAppRow = {
  id: string;
  label: string;
  iconSrc?: string;
};

type TaskbarContextMenuProps = {
  appRows: [TaskbarContextMenuAppRow, ...TaskbarContextMenuAppRow[]];
  taskbarPinState: "pinned" | "unpinned";
  /** Optional app identifier row rendered after divider, before pin action. */
  appIdentifier?: { id: string; label: string; iconSrc?: string };
  /** Animation lifecycle phase. Controls data-phase marker. */
  phase: SurfacePhase;
  /** Called when the closing animation completes. */
  onExitComplete: () => void;
  /**
   * Host-level props merged onto the root element.
   * Package-owned data-state and data-phase cannot be overridden via surfaceProps.
   */
  surfaceProps?: React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> };
  /** Called when the user activates an app row. */
  onSelectAppRow: (id: string) => void;
  /** Called when the user activates the app identifier row. */
  onSelectAppIdentifier: (id: string) => void;
  /** Called when the user activates the pin/unpin action. */
  onPinTaskbar: () => void;
  /** Called when the user activates the close-all action. */
  onCloseAll: () => void;
  className?: string;
};

/* ── Component ───────────────────────────────────────────────── */

/**
 * TaskbarContextMenu
 *
 * Interactive context menu surface for taskbar icon right-click.
 * Receives a non-empty `appRows` array and a `taskbarPinState` to
 * render the fixed row topology with keyboard navigation.
 *
 * Canonical states (exactly 2, selected by `taskbarPinState`):
 * - `context-pinned`   — `taskbarPinState === "pinned"`
 * - `context-unpinned` — `taskbarPinState === "unpinned"`
 *
 * Package-owned DOM markers:
 * - `data-state` — "context-pinned" | "context-unpinned"
 * - `data-phase` — mirrors the `phase` prop; surfaceProps cannot override
 *
 * Row order (canonical, package-owned):
 * 1. "작업" section header
 * 2. appRows (in array order)
 * 3. Divider
 * 4. Optional appIdentifier row
 * 5. Pin action row (data-action-id="pin-taskbar")
 * 6. Close-all row (data-action-id="close-all")
 *
 * Internal roving focus:
 * - ArrowDown / ArrowUp — move focus between interactive rows
 * - Home / End — jump to first / last interactive row
 * - Enter / Space — activate focused row
 * - Escape — bridged to surfaceProps.onKeyDown (host handles close)
 *
 * Does NOT own: onClose callback, anchorRect positioning, open/close
 * orchestration, placement logic, generic actions array, footer rows,
 * or render-row customisation. Does NOT wrap ContextPanel.
 */
function TaskbarContextMenu({
  appRows,
  taskbarPinState,
  appIdentifier,
  phase,
  onExitComplete,
  surfaceProps,
  onSelectAppRow,
  onSelectAppIdentifier,
  onPinTaskbar,
  onCloseAll,
  className,
}: TaskbarContextMenuProps) {
  const isPinned = taskbarPinState === "pinned";
  const menuRef = useRef<HTMLDivElement>(null);

  const { ref: surfaceRef, onKeyDown: surfaceOnKeyDown, ...restSurfaceProps } = surfaceProps ?? {};

  // Stable ref for onExitComplete to avoid re-attaching listener on every render
  const onExitCompleteRef = useRef(onExitComplete);
  onExitCompleteRef.current = onExitComplete;

  // closing-only guard: attach native animationend listener to root element.
  // Fires onExitComplete only when phase === "closing" and event target is root.
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    return attachExitListener(el, phase, () => onExitCompleteRef.current());
  }, [phase]);

  // Build ordered list of interactive row refs for roving focus
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Total interactive rows: appRows + optional appIdentifier + pin + close-all
  const totalRows =
    appRows.length + (appIdentifier ? 1 : 0) + 2;

  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, totalRows);
  }, [totalRows]);

  const getFocusableRows = useCallback((): HTMLButtonElement[] => {
    return rowRefs.current.filter((r): r is HTMLButtonElement => r !== null);
  }, []);

  const getCurrentIndex = useCallback((): number => {
    const rows = getFocusableRows();
    return rows.findIndex((r) => r === document.activeElement);
  }, [getFocusableRows]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const rows = getFocusableRows();
      const currentIdx = getCurrentIndex();

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const next = currentIdx < rows.length - 1 ? currentIdx + 1 : 0;
          rows[next]?.focus();
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prev = currentIdx > 0 ? currentIdx - 1 : rows.length - 1;
          rows[prev]?.focus();
          break;
        }
        case "Home": {
          e.preventDefault();
          rows[0]?.focus();
          break;
        }
        case "End": {
          e.preventDefault();
          rows[rows.length - 1]?.focus();
          break;
        }
        case "Escape": {
          // Leaf interprets Escape and bridges to surfaceProps.onKeyDown
          // Host is responsible for closing; leaf does not call onExitComplete directly
          surfaceOnKeyDown?.(e as unknown as React.KeyboardEvent<HTMLElement>);
          break;
        }
        default:
          break;
      }
    },
    [getFocusableRows, getCurrentIndex, surfaceOnKeyDown],
  );

  // Row ref assignment helpers
  let rowIndex = 0;
  const assignRef = (el: HTMLButtonElement | null) => {
    rowRefs.current[rowIndex] = el;
    rowIndex++;
  };

  return (
    <div
      {...restSurfaceProps}
      ref={(el) => {
        (menuRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        if (typeof surfaceRef === "function") {
          (surfaceRef as (el: HTMLDivElement | null) => void)(el);
        } else if (surfaceRef && typeof surfaceRef === "object") {
          (surfaceRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }
      }}
      className={cn(
        "bg-gray-50/95 backdrop-blur-2xl shadow-lg rounded-lg border border-gray-200 py-2 w-[300px]",
        getMotionClass(phase),
        restSurfaceProps.className,
        className
      )}
      onKeyDown={handleKeyDown}
      // Package-owned markers — always win over surfaceProps
      data-state={isPinned ? "context-pinned" : "context-unpinned"}
      data-phase={phase}
    >
      {/* 1. Section header */}
      <p className="text-xs text-gray-500 px-4 pb-1">작업</p>

      {/* 2. App rows */}
      {appRows.map((row, i) => {
        const localIndex = i;
        return (
          <button
            key={row.id}
            ref={(el) => { rowRefs.current[localIndex] = el; }}
            type="button"
            className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-black/5 transition-colors cursor-default focus:outline-none focus:bg-black/5"
            data-app-row={row.id}
            onClick={() => onSelectAppRow(row.id)}
          >
            {row.iconSrc && (
              <IconImage src={row.iconSrc} alt={row.label} className="size-4 shrink-0" />
            )}
            <span className="min-w-0 flex-1 truncate text-xs text-gray-800 text-left">
              {row.label}
            </span>
          </button>
        );
      })}

      {/* 3. Divider */}
      <div className="border-t border-gray-200 my-1" />

      {/* 4. Optional app identifier row */}
      {appIdentifier && (
        <button
          ref={(el) => { rowRefs.current[appRows.length] = el; }}
          type="button"
          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-black/5 transition-colors cursor-default focus:outline-none focus:bg-black/5"
          data-app-identifier={appIdentifier.id}
          onClick={() => onSelectAppIdentifier(appIdentifier.id)}
        >
          {appIdentifier.iconSrc && (
            <IconImage src={appIdentifier.iconSrc} alt={appIdentifier.label} className="size-4 shrink-0" />
          )}
          <span className="min-w-0 flex-1 truncate text-xs text-gray-800 text-left">
            {appIdentifier.label}
          </span>
        </button>
      )}

      {/* 5. Pin action row */}
      <button
        ref={(el) => { rowRefs.current[appRows.length + (appIdentifier ? 1 : 0)] = el; }}
        type="button"
        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-black/5 transition-colors cursor-default focus:outline-none focus:bg-black/5"
        data-action-id="pin-taskbar"
        onClick={onPinTaskbar}
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

      {/* 6. Close-all row */}
      <button
        ref={(el) => { rowRefs.current[appRows.length + (appIdentifier ? 1 : 0) + 1] = el; }}
        type="button"
        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-black/5 transition-colors cursor-default focus:outline-none focus:bg-black/5"
        data-action-id="close-all"
        onClick={onCloseAll}
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
