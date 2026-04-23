import type { KeyboardEvent, ReactNode } from "react";
import {
  ArrowClockwise16Regular,
  ChevronLeft16Regular,
  ChevronRight16Regular,
  Dismiss12Regular,
  Square12Regular,
  Subtract12Regular,
} from "@fluentui/react-icons";

import { cn } from "../../../internal/cn";
import WindowFrame from "../internal/windowFrame";
import type { DropdownItem } from "../shared/types";

type BrowserProps = {
  title: string;

  /* ── Address input ───────────────────────────────────────── */
  addressValue: string;
  addressDropdownItems?: DropdownItem[];
  onOpenAddressDropdown?: () => void;
  onAddressValueChange?: (value: string) => void;
  onAddressSubmit?: (value: string) => void;
  onSelectAddressDropdownItem?: (item: DropdownItem) => void;

  /* ── Nav controls ────────────────────────────────────────── */
  onBack?: () => void;
  onForward?: () => void;
  onReload?: () => void;

  /* ── Window controls ─────────────────────────────────────── */
  onMinimize?: () => void;
  onToggleMaximize?: () => void;
  onClose?: () => void;

  /* ── Body content ────────────────────────────────────────── */
  children?: ReactNode;
};

/**
 * Browser
 *
 * Public windows-family leaf for a browser-style window. Pure UI:
 * no internal route, history, or filtering. The host owns the body
 * (article / 404 / any ReactNode renders through `children`).
 *
 * Public contract boundary:
 *   - Enter in address field → `onAddressSubmit(addressValue)`.
 *   - Absent or empty address dropdown → surface NOT rendered.
 *   - Missing callback → silent no-op.
 *   - Detail states (address-open, control-hover-*) are storybook-owned
 *     via fixture scaffolding, NOT public props.
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
  return (
    <div className="browser flex flex-col h-full" data-browser-title={title}>
      <WindowFrame
        className="flex-1 min-h-0"
        chrome={
          <>
            <NavCluster onBack={onBack} onForward={onForward} onReload={onReload} />
            <AddressInput
              value={addressValue}
              items={addressDropdownItems}
              onOpen={onOpenAddressDropdown}
              onChange={onAddressValueChange}
              onSubmit={onAddressSubmit}
              onSelectItem={onSelectAddressDropdownItem}
            />
          </>
        }
        controls={
          <WindowControls
            onMinimize={onMinimize}
            onToggleMaximize={onToggleMaximize}
            onClose={onClose}
          />
        }
      >
        <div className="browser-body flex-1 min-w-0 overflow-y-auto bg-white p-4">
          {children}
        </div>
      </WindowFrame>
    </div>
  );
}

/* ── Nav cluster ────────────────────────────────────────────── */

function NavCluster({
  onBack,
  onForward,
  onReload,
}: {
  onBack?: () => void;
  onForward?: () => void;
  onReload?: () => void;
}) {
  return (
    <div className="browser-nav flex items-center gap-1 shrink-0">
      <button
        type="button"
        onClick={onBack}
        aria-label="back"
        data-browser-nav="back"
        className="hidden md:inline-flex w-7 h-7 items-center justify-center rounded-sm text-shell hover:bg-shell-surface-hover"
      >
        <ChevronLeft16Regular aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onForward}
        aria-label="forward"
        data-browser-nav="forward"
        className="hidden md:inline-flex w-7 h-7 items-center justify-center rounded-sm text-shell hover:bg-shell-surface-hover"
      >
        <ChevronRight16Regular aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onReload}
        aria-label="reload"
        data-browser-nav="reload"
        className="inline-flex w-7 h-7 items-center justify-center rounded-sm text-shell hover:bg-shell-surface-hover"
      >
        <ArrowClockwise16Regular aria-hidden="true" />
      </button>
    </div>
  );
}

/* ── Address input ──────────────────────────────────────────── */

function AddressInput({
  value,
  items,
  onOpen,
  onChange,
  onSubmit,
  onSelectItem,
}: {
  value: string;
  items?: DropdownItem[];
  onOpen?: () => void;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onSelectItem?: (item: DropdownItem) => void;
}) {
  const hasDropdown = !!items && items.length > 0;
  return (
    <div
      className="browser-address relative flex-1 min-w-0"
      data-browser-address-open={hasDropdown ? "" : undefined}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => onOpen?.()}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit?.(value);
          }
        }}
        className="browser-address-input w-full h-7 px-2 text-sm text-shell bg-white border border-shell rounded-md outline-none focus:taskbar-focus-ring"
        aria-label="address"
      />
      {hasDropdown ? (
        <ul
          className="browser-address-dropdown absolute left-0 top-full mt-1 w-full bg-white border border-shell rounded-md shadow-sm z-10"
          role="listbox"
          data-browser-address-dropdown=""
        >
          {items!.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelectItem?.(item)}
                className="browser-address-dropdown-item w-full text-left px-2 h-7 text-sm text-shell hover:bg-shell-surface flex items-center gap-2"
              >
                {item.iconUrl ? (
                  <img
                    src={item.iconUrl}
                    alt=""
                    aria-hidden="true"
                    className="w-4 h-4 shrink-0"
                  />
                ) : null}
                <span className="truncate">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/* ── Window controls ────────────────────────────────────────── */

function WindowControls({
  onMinimize,
  onToggleMaximize,
  onClose,
}: {
  onMinimize?: () => void;
  onToggleMaximize?: () => void;
  onClose?: () => void;
}) {
  return (
    <>
      <ControlButton
        kind="minimize"
        onClick={onMinimize}
        aria-label="minimize"
        icon={<Subtract12Regular aria-hidden="true" />}
      />
      <ControlButton
        kind="maximize"
        onClick={onToggleMaximize}
        aria-label="maximize"
        icon={<Square12Regular aria-hidden="true" />}
      />
      <ControlButton
        kind="close"
        onClick={onClose}
        aria-label="close"
        icon={<Dismiss12Regular aria-hidden="true" />}
      />
    </>
  );
}

function ControlButton({
  kind,
  onClick,
  icon,
  ...rest
}: {
  kind: "minimize" | "maximize" | "close";
  onClick?: () => void;
  icon: ReactNode;
  "aria-label": string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-window-control={kind}
      className={cn(
        "window-control-btn inline-flex items-center justify-center rounded-sm text-shell transition-colors",
        kind === "close"
          ? "hover:bg-red-500 hover:text-white"
          : "hover:bg-shell-surface-hover"
      )}
      {...rest}
    >
      {icon}
    </button>
  );
}

export type { BrowserProps };
export default Browser;
