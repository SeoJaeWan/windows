import type { KeyboardEvent, ReactNode } from "react";

import WindowFrame from "../internal/windowFrame";
import type { BrowserAddressDropdownItem } from "../shared/types";

/**
 * BrowserProps — public contract for the Browser window component.
 *
 * Public surface (single-input + children owner):
 *   Inputs:    addressValue
 *   Arrays:    addressDropdownItems?
 *   Body:      children (host-owned)
 *   Callbacks: see below
 *
 * Winner rule:
 *   Displayed value is always `addressValue` (host-owned).
 *   The component does NOT update `addressValue` or `children` internally.
 *
 * Detail-state owner:
 *   `browser/live-control-hover-minimize`, `browser/live-control-hover-maximize`,
 *   `browser/live-control-hover-close`, `browser/mobile-address-open`
 *   are storybook/internal review owner only. These are NOT public props.
 *
 * No-op rule:
 *   - `addressDropdownItems` ids are unique within this array only (Browser address domain).
 *   - Hidden dropdown affordance without callback = no-op.
 *   - Source array items with unknown ids = no-op.
 *   - Address selection does NOT fall through to onAddressValueChange,
 *     onAddressSubmit, nav callbacks, or window-control callbacks.
 */
export type BrowserProps = {
  /** Window title displayed in the titlebar chrome. */
  title: string;

  /* ── Address input (host-owned) ─────────────────────────────── */

  /** Current displayed value of the address input. Host-owned. */
  addressValue: string;

  /* ── Item arrays ────────────────────────────────────────────── */

  /**
   * Dropdown rows for the address input.
   * IDs unique within this array only (Browser address domain, domain-local).
   * Render key prefix: `address-dropdown:{id}`
   */
  addressDropdownItems?: BrowserAddressDropdownItem[];

  /* ── Address input callbacks ────────────────────────────────── */

  /** Notification only — no args. Called when the address input dropdown should open. */
  onOpenAddressDropdown?: () => void;
  /** Raw string handoff. Called on every keystroke in the address input. */
  onAddressValueChange?: (nextValue: string) => void;
  /**
   * Current winner submit. Called on Enter with the current `addressValue`.
   * Does NOT alter `addressValue` internally.
   */
  onAddressSubmit?: (addressValue: string) => void;
  /**
   * Exact source item selection.
   * Called with the exact `BrowserAddressDropdownItem` from `addressDropdownItems`.
   * No id/index/DOM event appended.
   * Does NOT fall through to onAddressValueChange, onAddressSubmit,
   * nav callbacks, or window-control callbacks.
   */
  onSelectAddressDropdownItem?: (item: BrowserAddressDropdownItem) => void;

  /* ── Navigation callbacks (notification-only, no args) ──────── */

  /** Notification only — no args. */
  onBack?: () => void;
  /** Notification only — no args. */
  onForward?: () => void;
  /** Notification only — no args. */
  onReload?: () => void;

  /* ── Window control callbacks (notification-only, no args) ──── */

  /** Notification only — no args. */
  onMinimize?: () => void;
  /** Notification only — no args. */
  onToggleMaximize?: () => void;
  /** Notification only — no args. */
  onClose?: () => void;

  /* ── Body ───────────────────────────────────────────────────── */

  /**
   * Body content — host-owned.
   * The component does NOT modify or wrap children.
   */
  children?: ReactNode;
};

/**
 * Browser
 *
 * Single-input + children owner window leaf component.
 *
 * Owns:
 *   - Window frame shell (via WindowFrame internal)
 *   - Navigation controls (back, forward, reload)
 *   - Address input row (chrome-level)
 *   - Window control buttons
 *   - Children slot (body)
 *
 * Does NOT own:
 *   - addressValue state (host-owned)
 *   - children content state (host-owned)
 *   - Dropdown open/close state (storybook/internal review owner)
 *   - Control-hover detail states (storybook/internal review owner)
 *   - Mobile address-open detail state (storybook/internal review owner)
 *   - Route / history model
 *   - Article-specific alternate body prop
 *   - Public loading / empty / status model
 *
 * Callback fallthrough rule:
 *   Address dropdown selection is ONLY delivered to onSelectAddressDropdownItem.
 *   It does NOT trigger onAddressValueChange, onAddressSubmit, nav callbacks,
 *   or window-control callbacks.
 */
function Browser({
  title,
  addressValue,
  addressDropdownItems = [],
  onOpenAddressDropdown,
  onAddressValueChange,
  onAddressSubmit,
  onSelectAddressDropdownItem,
  onBack,
  onForward,
  onReload,
  onMinimize,
  onToggleMaximize,
  onClose,
  children,
}: BrowserProps) {
  function handleAddressKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onAddressSubmit?.(addressValue);
    }
  }

  const chrome = (
    <div className="flex flex-col w-full">
      {/* Titlebar row: title + window controls */}
      <div className="flex items-center justify-between px-3 h-8 shrink-0">
        <span className="text-sm font-medium text-gray-700 truncate">{title}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="window-control-btn rounded flex items-center justify-center"
            aria-label="Minimize"
            onClick={() => onMinimize?.()}
          >
            <span className="w-2.5 h-0.5 bg-gray-600 block" />
          </button>
          <button
            type="button"
            className="window-control-btn rounded flex items-center justify-center"
            aria-label="Toggle maximize"
            onClick={() => onToggleMaximize?.()}
          >
            <span className="w-2.5 h-2.5 border border-gray-600 block rounded-sm" />
          </button>
          <button
            type="button"
            className="window-control-btn rounded flex items-center justify-center hover:bg-red-400"
            aria-label="Close"
            onClick={() => onClose?.()}
          >
            <span className="text-gray-600 text-xs leading-none">✕</span>
          </button>
        </div>
      </div>

      {/* Navigation + address input row */}
      <div className="flex items-center gap-2 px-3 py-1">
        {/* Navigation controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-200 text-gray-600"
            aria-label="Back"
            onClick={() => onBack?.()}
          >
            ‹
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-200 text-gray-600"
            aria-label="Forward"
            onClick={() => onForward?.()}
          >
            ›
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-200 text-gray-600"
            aria-label="Reload"
            onClick={() => onReload?.()}
          >
            ↻
          </button>
        </div>

        {/* Address input */}
        <div className="relative flex-1">
          <input
            type="text"
            className="w-full text-sm bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-400"
            value={addressValue}
            placeholder="Address"
            aria-label="Address"
            onChange={(e) => onAddressValueChange?.(e.target.value)}
            onFocus={() => onOpenAddressDropdown?.()}
            onKeyDown={handleAddressKeyDown}
          />
          {/* Address dropdown rows (storybook/internal review: open state scaffolded externally) */}
          {addressDropdownItems.length > 0 && (
            <div className="absolute z-10 top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-md w-full">
              {addressDropdownItems.map((item) => (
                <button
                  key={`address-dropdown:${item.id}`}
                  type="button"
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 flex flex-col"
                  onClick={() => onSelectAddressDropdownItem?.(item)}
                >
                  <span>{item.label}</span>
                  {item.hint && <span className="text-xs text-gray-400">{item.hint}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <WindowFrame chrome={chrome}>
      {children}
    </WindowFrame>
  );
}

export default Browser;
