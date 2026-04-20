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

/* ── Component ────────────────────────────────────────────────── */

/**
 * Browser
 *
 * Single-input + children owner leaf. Public props are declared above.
 * Concrete render implementation is Phase 4+ work.
 * The contract (props, no-op rules, detail-state owner rule) is fixed at Phase 3.
 */
function Browser(_props: BrowserProps) {
  return null;
}

export default Browser;
