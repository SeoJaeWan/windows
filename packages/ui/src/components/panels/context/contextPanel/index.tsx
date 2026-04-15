import type { ComponentPropsWithoutRef, ReactNode } from "react";

/* ── Types ───────────────────────────────────────────────────── */

type ContextPanelItem = {
  id: string;
  label: string;
  /** Tooltip-only metadata — rendered as the row button `title` attribute. */
  description?: string;
  /** Leading visual slot. When absent the text block starts immediately. */
  icon?: ReactNode;
  /** When `true` the row renders with disabled style and `onAction` is a no-op. */
  disabled?: boolean;
};

type ContextPanelProps = ComponentPropsWithoutRef<"div"> & {
  items: ContextPanelItem[];
  /** Called with the item `id` when an enabled row is activated. */
  onAction?: (id: string) => void;
};

/* ── Component ───────────────────────────────────────────────── */

/**
 * ContextPanel
 *
 * Generic action-list leaf surface for context menus.
 * Receives an `items` array and an optional `onAction` callback.
 * Each row is an actionable button with a single-line label.
 *
 * Layout rules:
 * - Root width is fixed at 200px.
 * - `icon` present → leading visual slot + label.
 * - `icon` absent  → no blank slot; text block starts immediately.
 * - `description`  → button `title` attribute only; no second-line text.
 * - `disabled`     → visible disabled style, `onAction` no-op.
 *
 * Does NOT own: positioning, provider/store, open/close orchestration,
 * click-away detection, keyboard handling, divider, danger color,
 * submenu arrow, footer/header slot.
 */
function ContextPanel({ items, onAction, className, ...rest }: ContextPanelProps) {
  return (
    <div
      {...rest}
      className={`bg-gray-50/95 backdrop-blur-2xl shadow-lg rounded-lg border border-gray-200 py-1 w-[200px] ${className ?? ""}`.trim()}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`w-full flex items-center gap-2 px-3 py-1.5 transition-colors cursor-default text-left ${
            item.disabled
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-black/5"
          }`}
          title={item.description}
          disabled={item.disabled}
          data-action-id={item.id}
          onClick={() => {
            if (!item.disabled) {
              onAction?.(item.id);
            }
          }}
        >
          {item.icon && (
            <span className="size-4 shrink-0 flex items-center justify-center text-gray-600" aria-hidden="true">
              {item.icon}
            </span>
          )}
          <span className="min-w-0 flex-1 truncate text-xs text-gray-800">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}

export type { ContextPanelItem, ContextPanelProps };
export default ContextPanel;
