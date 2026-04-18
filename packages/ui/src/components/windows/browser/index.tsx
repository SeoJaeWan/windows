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
  addressLabel: string;
  children: ReactNode;
  /**
   * Address dropdown item list. Prop-driven surface.
   * No selected/default item pair — addressLabel remains canonical display value.
   */
  addressDropdownItems?: BrowserAddressDropdownItem[];
  /**
   * Called when a valid rendered dropdown item is activated.
   * - Exactly once per activation.
   * - After valid activation, internal dropdown closes (returns to closed state).
   * - addressLabel, children, route-like meaning unchanged until host updates props.
   * - Same rendered item can be activated multiple times (each is independent callback).
   * - addressDropdownItems=[] → no activatable item, no callback.
   */
  onAddressDropdownItemSelect?: (itemId: string) => void;
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
 *   Clicking address bar opens internal dropdown (if addressDropdownItems provided).
 *
 * Address dropdown:
 * - Internal-only open state (no public prop)
 * - Shown below toolbar when dropdownOpen=true
 * - Item activation: callback once + closes dropdown
 * - addressLabel is canonical display value (not changed by dropdown activation)
 */
function BrowserChrome({
  title,
  icon,
  addressLabel,
  addressDropdownItems,
  dropdownOpen,
  onAddressClick,
  onDropdownItemActivate,
}: {
  title: string;
  icon?: ReactNode;
  addressLabel: string;
  addressDropdownItems: BrowserAddressDropdownItem[];
  dropdownOpen: boolean;
  onAddressClick: () => void;
  onDropdownItemActivate: (itemId: string) => void;
}) {
  return (
    <>
      {/* Row 1: Tab titlebar */}
      <div className="browser-titlebar flex items-end gap-0 bg-gray-100 border-b border-shell select-none h-[30px]">
        {/* Active tab */}
        <div className="browser-tab flex items-center gap-1.5 px-2 h-[30px] bg-white border-t border-l border-r border-shell -mb-px rounded-t shrink-0 max-w-[200px]">
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

      {/* Row 2: Toolbar */}
      <div className="browser-toolbar flex items-center gap-1 px-2 bg-white border-b border-shell h-[36px]">
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

        {/* Address bar — full remaining width. Clicking opens internal dropdown. */}
        <button
          type="button"
          className={cn(
            "browser-address flex items-center gap-1.5 flex-1 h-7 bg-gray-50 border rounded px-2 overflow-hidden min-w-0 cursor-default text-left",
            dropdownOpen ? "border-blue-500 ring-1 ring-blue-500" : "border-shell"
          )}
          onClick={onAddressClick}
        >
          {icon && (
            <span className="inline-flex items-center justify-center w-3.5 h-3.5 shrink-0" aria-hidden>
              {icon}
            </span>
          )}
          <span className="browser-address-label text-xs text-gray-700 truncate leading-none">{addressLabel}</span>
        </button>
      </div>

      {/* Address dropdown — internal-only open state */}
      {dropdownOpen && addressDropdownItems.length > 0 && (
        <div className="browser-address-dropdown bg-white border border-shell shadow-md rounded mx-2 overflow-hidden">
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
 * - Address dropdown: internal-only open state, shown below toolbar on address click
 *
 * Layout:
 * - WindowFrame chrome (tab titlebar + toolbar + optional dropdown) — always present
 * - Body slot: children rendered in a scrollable container
 *
 * Address dropdown contract:
 * - No public open prop (internal-only state)
 * - No selected/default item pair — addressLabel is canonical display value
 * - Valid item activation: callback once + dropdown closes
 * - Same item can be activated multiple times (each independent callback)
 * - addressDropdownItems=[] → no dropdown rendered, no callback
 * - addressLabel, children, route-like meaning unchanged until host updates props
 *
 * No sidebar. No variant prop, no route props, no 404 boolean,
 * no public window-control toggles — those are host concerns.
 */
function Browser({
  title,
  icon,
  addressLabel,
  addressDropdownItems = [],
  onAddressDropdownItemSelect,
  children,
  className,
  ...rest
}: BrowserProps) {
  // Internal dropdown open state — no public prop
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function handleDropdownItemActivate(itemId: string) {
    // Callback exactly once
    onAddressDropdownItemSelect?.(itemId);
    // Close dropdown after activation
    setDropdownOpen(false);
  }

  return (
    <WindowFrame
      chrome={
        <BrowserChrome
          title={title}
          icon={icon}
          addressLabel={addressLabel}
          addressDropdownItems={addressDropdownItems}
          dropdownOpen={dropdownOpen}
          onAddressClick={() => setDropdownOpen((prev) => !prev)}
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
