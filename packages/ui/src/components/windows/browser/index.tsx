import { useState, type ComponentPropsWithoutRef, type ReactNode } from "react";

import {
  Subtract16Regular,
  SquareMultiple16Regular,
  Dismiss16Regular,
  ArrowLeft16Regular,
  ArrowRight16Regular,
} from "@fluentui/react-icons";

import { cn } from "../../../internal/cn";
import WindowFrame from "../internal/windowFrame";

/* ── Dropdown item types ────────────────────────────────────────── */

type BrowserAddressDropdownItem = {
  id: string;
  label: string;
};

type BrowserProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  title: string;
  icon?: ReactNode;
  /**
   * Fallback display value for the address bar when `addressValue` is not
   * provided. Used for the uncontrolled address surface case.
   */
  addressLabel: string;
  children: ReactNode;
  /**
   * Address dropdown item list. Prop-driven surface.
   * When addressValue is provided, items are shown alongside it.
   */
  addressDropdownItems?: BrowserAddressDropdownItem[];
  /**
   * Called when a valid rendered dropdown item is activated.
   * - Exactly once per activation.
   * - After valid activation, dropdown closes unless host keeps it open via
   *   addressDropdownOpen.
   * - Same rendered item can be activated multiple times (each is independent).
   * - addressDropdownItems=[] → no activatable item, no callback.
   */
  onAddressDropdownItemSelect?: (itemId: string) => void;

  /* ── Controlled address prop surface ────────────────────────────
   * When provided, these props override the internal uncontrolled state.
   * Host is responsible for keeping them in sync.
   *
   * addressDropdownOpen / onAddressDropdownOpenChange — controlled open state.
   *   If omitted, dropdown open/close is managed internally.
   *
   * addressValue / onAddressValueChange — controlled address bar display value.
   *   If provided, addressLabel is not shown (addressValue takes precedence).
   *   If omitted, addressLabel is the canonical display value.
   */
  addressDropdownOpen?: boolean;
  onAddressDropdownOpenChange?: (open: boolean) => void;
  addressValue?: string;
  onAddressValueChange?: (value: string) => void;
};

/* ── Browser Chrome ─────────────────────────────────────────────── */

/**
 * BrowserChrome
 *
 * Internal chrome for the Browser window. Two-row structure matching the live
 * browser-style tab titlebar grammar:
 *
 * Row 1 — Tab titlebar (h-[30px]):
 *   [tab: icon + title + × close] + spacer + [minimize][maximize][close]
 *   The tab itself contains the close button (browser-style).
 *
 * Row 2 — Toolbar (h-[36px]):
 *   [←][→] nav + address bar (flex-1, full remaining width)
 *   Clicking address bar toggles the dropdown open state.
 *
 * Address dropdown:
 * - Open state is either controlled (via dropdownOpen/onDropdownOpenChange props)
 *   or managed internally when those props are absent.
 * - Shown below toolbar when open
 * - Item activation: callback once + closes dropdown
 * - Address display: addressValue takes precedence over addressLabel
 */
function BrowserChrome({
  title,
  icon,
  addressLabel,
  addressValue,
  onAddressValueChange,
  addressDropdownItems,
  dropdownOpen,
  onAddressClick,
  onDropdownItemActivate,
}: {
  title: string;
  icon?: ReactNode;
  addressLabel: string;
  addressValue?: string;
  onAddressValueChange?: (value: string) => void;
  addressDropdownItems: BrowserAddressDropdownItem[];
  dropdownOpen: boolean;
  onAddressClick: () => void;
  onDropdownItemActivate: (itemId: string) => void;
}) {
  const displayAddress = addressValue ?? addressLabel;

  return (
    <>
      {/* Row 1: Tab titlebar */}
      <div className="browser-titlebar flex items-end gap-0 bg-gray-100 border-b border-shell select-none h-[30px]">
        {/* Active tab */}
        <div className="browser-tab flex items-center gap-1.5 px-2 h-[30px] bg-[#f9d0cf] border-t border-l border-r border-shell -mb-px rounded-t shrink-0 max-w-[200px]">
          {icon && (
            <span className="inline-flex items-center justify-center w-3.5 h-3.5 shrink-0" aria-hidden>
              {icon}
            </span>
          )}
          <span className="browser-tab-title text-xs text-gray-800 truncate flex-1 min-w-0">{title}</span>
          {/* Tab close button — visual-only, no-op */}
          <button
            type="button"
            tabIndex={-1}
            className="inline-flex items-center justify-center w-4 h-4 shrink-0 text-gray-400 hover:bg-gray-200 rounded-sm"
            aria-hidden
          >
            <Dismiss16Regular />
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Window controls — visual-only, no-op */}
        <div className="flex items-center shrink-0" aria-hidden>
          <button
            type="button"
            className="window-btn w-[46px] h-[30px] hidden md:inline-flex items-center justify-center hover:bg-gray-200 text-gray-600"
            tabIndex={-1}
          >
            <Subtract16Regular />
          </button>
          <button
            type="button"
            className="window-btn w-[46px] h-[30px] hidden md:inline-flex items-center justify-center hover:bg-gray-200 text-gray-600"
            tabIndex={-1}
          >
            <SquareMultiple16Regular />
          </button>
          <button
            type="button"
            className="window-btn w-[46px] h-[30px] inline-flex items-center justify-center hover:bg-red-500 hover:text-white text-gray-600"
            tabIndex={-1}
          >
            <Dismiss16Regular />
          </button>
        </div>
      </div>

      {/* Row 2: Toolbar — bg-gray-50 matches Figma toolbar background (Phase 5 B6 closure). */}
      <div className="browser-toolbar flex items-center gap-1 px-2 bg-gray-50 border-b border-shell h-[36px]">
        {/* Nav controls */}
        <div className="flex items-center shrink-0" aria-hidden>
          <button
            type="button"
            tabIndex={-1}
            className="w-7 h-7 inline-flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded"
          >
            <ArrowLeft16Regular />
          </button>
          <button
            type="button"
            tabIndex={-1}
            className="w-7 h-7 inline-flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded"
          >
            <ArrowRight16Regular />
          </button>
        </div>

        {/* Address bar wrapper — position: relative so the dropdown anchors directly below this bar. */}
        <div className="relative flex-1 min-w-0">
          {/* Address bar — full remaining width. Clicking toggles dropdown.
              When onAddressValueChange is provided, renders an editable input
              alongside the dropdown trigger chevron area. Otherwise, renders
              a read-only button (fallback). */}
          {onAddressValueChange ? (
            <div
              className={cn(
                "browser-address flex items-center gap-1.5 w-full h-7 bg-gray-50 border rounded px-2 overflow-hidden min-w-0",
                dropdownOpen ? "border-blue-500 ring-1 ring-blue-500" : "border-shell"
              )}
            >
              {icon && (
                <span className="inline-flex items-center justify-center w-3.5 h-3.5 shrink-0" aria-hidden>
                  {icon}
                </span>
              )}
              <input
                type="text"
                className="browser-address-input flex-1 min-w-0 bg-transparent text-xs text-gray-700 leading-none outline-none border-none"
                value={displayAddress}
                onChange={(e) => onAddressValueChange(e.target.value)}
                onClick={onAddressClick}
              />
            </div>
          ) : (
            <button
              type="button"
              className={cn(
                "browser-address flex items-center gap-1.5 w-full h-7 bg-gray-50 border rounded px-2 overflow-hidden min-w-0 cursor-default text-left",
                dropdownOpen ? "border-blue-500 ring-1 ring-blue-500" : "border-shell"
              )}
              onClick={onAddressClick}
            >
              {icon && (
                <span className="inline-flex items-center justify-center w-3.5 h-3.5 shrink-0" aria-hidden>
                  {icon}
                </span>
              )}
              <span className="browser-address-label text-xs text-gray-700 truncate leading-none">{displayAddress}</span>
            </button>
          )}

          {/* Address dropdown overlay — open state controlled by props or internal state.
              Anchored below the address bar only (not the full toolbar width).
              Absolutely positioned so body layout is unaffected (no push).
              z-10 keeps it above article body content. */}
          {dropdownOpen && addressDropdownItems.length > 0 && (
            <div className="browser-address-dropdown absolute left-0 right-0 top-full z-10 bg-white border border-shell shadow-md rounded overflow-hidden">
              {addressDropdownItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  data-browser-dropdown-item={item.id}
                  className="browser-address-dropdown-item w-full flex items-center px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 cursor-default text-left"
                  onClick={() => onDropdownItemActivate(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * Browser
 *
 * Public component. Renders a Windows-style browser window built on WindowFrame.
 *
 * Chrome grammar (live shell alignment):
 * - Tab titlebar: single active tab (icon + title + × close) + spacer + window controls (−□×)
 * - Toolbar: back/forward nav + address bar (full remaining width)
 * - Address dropdown: shown below toolbar when open
 *
 * Controlled + uncontrolled address surface:
 * - addressDropdownOpen / onAddressDropdownOpenChange — host-controlled open state.
 *   If omitted, open/close is managed internally on address bar click.
 * - addressValue / onAddressValueChange — host-controlled address display value.
 *   If provided, takes precedence over addressLabel for the address bar display.
 *   If omitted, addressLabel is the canonical display value (fallback).
 *
 * Layout:
 * - WindowFrame chrome (tab titlebar + toolbar + optional dropdown) — always present
 * - Body slot: children rendered in a scrollable container
 *
 * Address dropdown contract:
 * - Valid item activation: onAddressDropdownItemSelect callback once + dropdown closes
 *   (sets internal state to closed, or calls onAddressDropdownOpenChange(false) when controlled)
 * - addressDropdownItems=[] → no dropdown rendered, no callback
 * - Dropdown selection does NOT cause real URL navigation or body content replacement
 *
 * Parity scope: windows frame/chrome only.
 * No sidebar. No variant prop, no route props, no 404 boolean,
 * no public window-control toggles — those are host concerns.
 *
 * Phase 3 blocking surface boundary (Figma first-pass parity):
 * BLOCKING:
 *   - WindowFrame outer boundary at canonical geometry (1282×752 desktop, 392×796 mobile).
 *   - Tab titlebar row: h-[30px] — presence, window-control placement, tab layout.
 *   - Toolbar row: h-[36px] — back/forward nav + address bar full remaining width.
 *   - Address dropdown: absolute left-0 right-0 top-full below address bar (desktop-address-open).
 *   - Body boundary: browser-body flex-1 overflow-y-auto h-full — correct vertical start.
 *
 * NON-BLOCKING (out of Phase 3 scope):
 *   - Toolbar icon glyph exact shape (ArrowLeft16Regular, ArrowRight16Regular)
 *   - Minor chrome copy drift (tab title truncation, address bar text)
 *
 * FIXTURE NOISE:
 *   - children body content (article copy, cover image, text length)
 *   - Exact dropdown suggestion text when geometry is unchanged
 */
function Browser({
  title,
  icon,
  addressLabel,
  addressDropdownItems = [],
  onAddressDropdownItemSelect,
  addressDropdownOpen,
  onAddressDropdownOpenChange,
  addressValue,
  onAddressValueChange,
  children,
  className,
  ...rest
}: BrowserProps) {
  // Internal dropdown open state — used only when addressDropdownOpen is not provided
  const [internalDropdownOpen, setInternalDropdownOpen] = useState(false);

  const isControlled = addressDropdownOpen !== undefined;
  const dropdownOpen = isControlled ? addressDropdownOpen : internalDropdownOpen;

  function handleAddressClick() {
    const next = !dropdownOpen;
    if (isControlled) {
      onAddressDropdownOpenChange?.(next);
    } else {
      setInternalDropdownOpen(next);
    }
  }

  function handleDropdownItemActivate(itemId: string) {
    // Callback exactly once
    onAddressDropdownItemSelect?.(itemId);
    // Close dropdown after activation
    if (isControlled) {
      onAddressDropdownOpenChange?.(false);
    } else {
      setInternalDropdownOpen(false);
    }
  }

  return (
    <WindowFrame
      chrome={
        <BrowserChrome
          title={title}
          icon={icon}
          addressLabel={addressLabel}
          addressValue={addressValue}
          onAddressValueChange={onAddressValueChange}
          addressDropdownItems={addressDropdownItems}
          dropdownOpen={dropdownOpen}
          onAddressClick={handleAddressClick}
          onDropdownItemActivate={handleDropdownItemActivate}
        />
      }
      className={cn("browser", className)}
      {...rest}
    >
      <div className="browser-body flex-1 overflow-y-auto h-full">{children}</div>
    </WindowFrame>
  );
}

export type { BrowserProps, BrowserAddressDropdownItem };
export default Browser;
