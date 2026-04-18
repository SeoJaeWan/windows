import type { ComponentPropsWithoutRef, ReactNode } from "react";

import {
  Subtract16Regular,
  SquareMultiple16Regular,
  Dismiss16Regular,
  ArrowLeft16Regular,
  ArrowRight16Regular,
} from "@fluentui/react-icons";

import { cn } from "../../../internal/cn";
import WindowFrame from "../internal/windowFrame";

type BrowserProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  title: string;
  icon?: ReactNode;
  addressLabel: string;
  children: ReactNode;
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
 *
 * Address bar is a closed-state recipient: no dropdown open/close logic
 * in this component — that belongs to the host (Phase 3).
 */
function BrowserChrome({ title, icon, addressLabel }: { title: string; icon?: ReactNode; addressLabel: string }) {
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

        {/* Address bar — full remaining width. Closed-state recipient: no open/close logic here */}
        <div className="browser-address flex items-center gap-1.5 flex-1 h-7 bg-gray-50 border border-shell rounded px-2 overflow-hidden min-w-0">
          {icon && (
            <span className="inline-flex items-center justify-center w-3.5 h-3.5 shrink-0" aria-hidden>
              {icon}
            </span>
          )}
          <span className="browser-address-label text-xs text-gray-700 truncate leading-none">{addressLabel}</span>
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
 *
 * Layout:
 * - WindowFrame chrome (tab titlebar + toolbar) — always present
 * - Body slot: children rendered in a scrollable container
 *
 * No sidebar (browser never uses a sidebar).
 * No variant prop, no route props, no 404 boolean,
 * no public window-control toggles — those are host concerns.
 */
function Browser({ title, icon, addressLabel, children, className, ...rest }: BrowserProps) {
  return (
    <WindowFrame
      chrome={<BrowserChrome title={title} icon={icon} addressLabel={addressLabel} />}
      className={cn("browser", className)}
      {...rest}
    >
      <div className="browser-body flex-1 overflow-y-auto h-full">{children}</div>
    </WindowFrame>
  );
}

export type { BrowserProps };
export default Browser;
