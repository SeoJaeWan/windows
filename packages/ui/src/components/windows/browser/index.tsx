/**
 * Browser — windows family leaf component
 *
 * Public contract (Phase 3):
 *
 * Input ownership:
 *   - single-input owner: addressValue (host-controlled)
 *   - content owner: children (host-controlled)
 *   - dropdown data: addressDropdownItems (host-controlled)
 *
 * Callback handoff (callback-only, no internal state mutation):
 *   - address: onOpenAddressDropdown, onAddressValueChange, onAddressSubmit,
 *              onSelectAddressDropdownItem
 *   - nav:     onBack, onForward, onReload
 *   - window:  onMinimize, onToggleMaximize, onClose
 *
 * No-op / invalid rules:
 *   - If addressDropdownItems is absent/empty, the address dropdown open surface
 *     is NOT rendered.
 *   - Invalid id from onSelectAddressDropdownItem does not change addressValue or
 *     children internally — host prop must update for the view to change.
 *   - After select, addressValue and children do NOT change internally
 *     until the host provides new prop values.
 *   - Missing callbacks are silently ignored (no error thrown).
 *   - Enter key always fires onAddressSubmit(currentAddressValue).
 *
 * Detail-state owner rule (story-only surface — NOT public props):
 *   The following detail states are owned by storybook/internal review surface.
 *   They are NOT public props and are never exposed on the component interface:
 *     browser/live-control-hover-minimize — minimize button hover affordance
 *     browser/live-control-hover-maximize — maximize button hover affordance
 *     browser/live-control-hover-close    — close button hover affordance
 *     browser/mobile-address-open         — mobile address overlay open state
 *   These states are scaffolded via story harness/fixture; no public prop models them.
 *
 * Mobile hierarchy:
 *   Mobile is simplified chrome / content-first reading hierarchy.
 *   Address bar and control cluster simplify on mobile; content fills viewport.
 *   Desktop chrome density copy is NOT valid mobile.
 *
 * Token namespace: --window-* (no --panel-* or raw literals).
 * Shell: uses WindowFrame as internal shared shell owner.
 */

import type { ReactNode } from "react";

import type { DropdownItem } from "../shared/types";
import { cn } from "../../../internal/cn";
import WindowFrame from "../internal/windowFrame";

/* ── Public props ─────────────────────────────────────────────── */

export type BrowserProps = {
  /** Window title shown in the chrome area. */
  title: string;

  // ── Address input ────────────────────────────────────────────
  /** Current controlled value of the address input. */
  addressValue: string;
  /**
   * Dropdown rows for the address input.
   * If absent or empty, the address dropdown open surface is NOT rendered.
   */
  addressDropdownItems?: DropdownItem[];
  /** Fired when the address input requests dropdown open. */
  onOpenAddressDropdown?: () => void;
  /** Fired on every keystroke in the address input. */
  onAddressValueChange?: (value: string) => void;
  /** Fired when Enter is pressed in the address input. */
  onAddressSubmit?: (value: string) => void;
  /** Fired when an address dropdown row is selected. */
  onSelectAddressDropdownItem?: (item: DropdownItem) => void;

  // ── Navigation controls ──────────────────────────────────────
  /** Fired when the back navigation control is activated. */
  onBack?: () => void;
  /** Fired when the forward navigation control is activated. */
  onForward?: () => void;
  /** Fired when the reload control is activated. */
  onReload?: () => void;

  // ── Window controls ──────────────────────────────────────────
  /** Fired when the minimize control is activated. */
  onMinimize?: () => void;
  /** Fired when the maximize/restore control is activated. */
  onToggleMaximize?: () => void;
  /** Fired when the close control is activated. */
  onClose?: () => void;

  // ── Content body ─────────────────────────────────────────────
  /**
   * Content body slot — host-owned.
   * The host supplies and fully controls the article/page content.
   * Browser does not interpret or transform children.
   */
  children?: ReactNode;
};

/* ── Window control buttons ───────────────────────────────────── */

type ControlButtonProps = {
  label: string;
  variant: "minimize" | "maximize" | "close";
  onClick?: () => void;
};

function ControlButton({ label, variant, onClick }: ControlButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "window-control-btn shrink-0 flex items-center justify-center rounded-full transition-colors",
        variant === "close" && "hover:bg-red-500",
        variant === "minimize" && "hover:bg-yellow-400",
        variant === "maximize" && "hover:bg-green-500",
      )}
      style={{
        width: "var(--window-control-size)",
        height: "var(--window-control-size)",
        backgroundColor: "var(--window-chrome-border)",
      }}
    />
  );
}

/* ── Nav button ───────────────────────────────────────────────── */

type NavButtonProps = {
  label: string;
  symbol: string;
  onClick?: () => void;
};

function NavButton({ label, symbol, onClick }: NavButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="shrink-0 flex items-center justify-center w-7 h-7 rounded text-shell hover:bg-gray-100 transition-colors"
      style={{ fontSize: 14 }}
    >
      {symbol}
    </button>
  );
}

/* ── Address input ────────────────────────────────────────────── */

type AddressInputProps = {
  value: string;
  dropdownItems?: DropdownItem[];
  onFocus?: () => void;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onSelectItem?: (item: DropdownItem) => void;
};

function AddressInput({
  value,
  dropdownItems,
  onFocus,
  onChange,
  onSubmit,
  onSelectItem,
}: AddressInputProps) {
  const hasDropdown =
    dropdownItems != null && dropdownItems.length > 0;

  return (
    <div className="relative flex-1 min-w-0">
      <input
        type="text"
        value={value}
        readOnly={onChange == null}
        onFocus={onFocus}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit?.(value);
        }}
        className="w-full h-7 px-3 text-sm rounded-full border text-shell bg-white border-shell focus:outline-none"
        style={{ fontSize: 12 }}
        aria-label="주소"
      />
      {hasDropdown && (
        <ul
          className="absolute top-full left-0 right-0 z-10 mt-0.5 rounded border border-shell bg-white shadow-md"
          role="listbox"
        >
          {dropdownItems!.map((item) => (
            <li
              key={item.id}
              role="option"
              aria-selected={false}
              className="px-3 py-1.5 text-xs text-shell cursor-pointer hover:bg-gray-100"
              onClick={() => onSelectItem?.(item)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Component ────────────────────────────────────────────────── */

/**
 * Browser
 *
 * Single-input + children owner leaf. Renders a browser-style window
 * using WindowFrame as the shared shell owner.
 *
 * Chrome layout: [nav buttons] + [address input] + [reload button]
 * Content layout: [children slot — host-owned]
 *
 * Public contract (Phase 3) is preserved — no new props added.
 */
function Browser({
  title,
  addressValue,
  addressDropdownItems,
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
  const chrome = (
    <div className="flex items-center gap-2 px-3 w-full h-full">
      {/* Title — minimal label in chrome */}
      <span
        className="text-sm font-medium text-shell shrink-0 hidden sm:block"
        style={{ fontSize: 13, maxWidth: 120 }}
        title={title}
      >
        <span className="truncate block">{title}</span>
      </span>
      {/* Nav controls */}
      <div className="flex items-center gap-0.5 shrink-0">
        <NavButton label="뒤로" symbol="‹" onClick={onBack} />
        <NavButton label="앞으로" symbol="›" onClick={onForward} />
      </div>
      {/* Address input */}
      <AddressInput
        value={addressValue}
        dropdownItems={addressDropdownItems}
        onFocus={onOpenAddressDropdown}
        onChange={onAddressValueChange}
        onSubmit={onAddressSubmit}
        onSelectItem={onSelectAddressDropdownItem}
      />
      {/* Reload */}
      <NavButton label="새로고침" symbol="↺" onClick={onReload} />
    </div>
  );

  const controls = (
    <div className="flex items-center gap-1 pr-2">
      <ControlButton label="최소화" variant="minimize" onClick={onMinimize} />
      <ControlButton label="최대화/복원" variant="maximize" onClick={onToggleMaximize} />
      <ControlButton label="닫기" variant="close" onClick={onClose} />
    </div>
  );

  return (
    <WindowFrame
      chrome={chrome}
      controls={controls}
      className="w-full h-full"
    >
      {/* Content slot — host-owned. Scroll is content responsibility. */}
      <div className="flex-1 min-h-0 overflow-y-auto window-content">
        {children}
      </div>
    </WindowFrame>
  );
}

export default Browser;
