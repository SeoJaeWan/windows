import type { ComponentPropsWithoutRef, ReactNode } from "react";

import {
  Subtract16Regular,
  SquareMultiple16Regular,
  Dismiss16Regular,
  ArrowLeft16Regular,
  ArrowRight16Regular,
} from "@fluentui/react-icons";

import { cn } from "../../../../internal/cn";

/**
 * Reserved package-owned marker keys.
 * These must not be overrideable via consumer `...rest` spread.
 * Strip them from rest before forwarding, then apply canonical values after spread.
 */
const RESERVED_FRAME_MARKERS = [
  "data-window-frame-root",
  "data-window-frame-chrome",
  "data-window-frame-body",
  "data-window-compare-stage",
] as const;

type WindowFrameProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  title: string;
  icon?: ReactNode;
  addressLabel: string;
  /** Show back/forward navigation chrome buttons (visual-only, no-op). Default false. */
  showNavControls?: boolean;
  children: ReactNode;
};

/**
 * WindowFrame
 *
 * Internal-only foundation shared by Folder and Browser windows.
 * Provides the window chrome (title bar, address bar) and a flex body slot.
 *
 * - Title row: icon + title text + window control buttons (visual-only, no-op)
 * - Address bar: addressLabel text display (with optional back/forward nav)
 * - Body slot: flex-1 overflow-hidden — children own scrolling
 *
 * NOT exported from package root.
 *
 * Reserved marker contract:
 * - [data-window-frame-root]     → root div
 * - [data-window-frame-chrome]   → chrome wrapper (titlebar + address bar)
 * - [data-window-frame-body]     → body slot div
 * - [data-window-compare-stage]  → owned by CompareWindowStage host, NOT frame root
 *
 * These markers are package-owned. Consumer attrs forwarded via ...rest are
 * stripped before spread to ensure canonical marker values always win.
 * data-window-compare-stage is stripped to prevent consumer pass-through from
 * creating duplicate markers alongside the CompareWindowStage host canvas.
 */
function WindowFrame({ title, icon, addressLabel, showNavControls = false, children, className, ...rest }: WindowFrameProps) {
  // Strip reserved marker keys from consumer rest to prevent override.
  // Package-owned canonical values are applied explicitly after the spread.
  const safeRest = { ...rest } as Record<string, unknown>;
  for (const key of RESERVED_FRAME_MARKERS) {
    delete safeRest[key];
  }

  return (
    <div
      className={cn(
        "window-frame flex flex-col h-full rounded-lg border border-shell bg-gray-50 shadow-sm overflow-hidden",
        className
      )}
      {...safeRest}
      data-window-frame-root=""
    >
      {/* Chrome: titlebar + address bar */}
      <div className="window-frame-chrome shrink-0" data-window-frame-chrome="">
        {/* Title row */}
        <div className="window-frame-titlebar flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 border-b border-shell select-none min-h-[28px]">
          {icon && (
            <span className="window-frame-icon inline-flex items-center justify-center w-3.5 h-3.5 shrink-0" aria-hidden>
              {icon}
            </span>
          )}
          <span className="window-frame-title flex-1 text-xs font-medium text-gray-800 truncate">
            {title}
          </span>
          {/* Window controls — visual-only, click no-op */}
          <div className="window-frame-controls flex items-center gap-0 shrink-0" aria-hidden>
            <button
              type="button"
              onClick={undefined}
              className="window-frame-btn w-[46px] h-[28px] inline-flex items-center justify-center hover:bg-gray-200 text-gray-600"
              tabIndex={-1}
            >
              <Subtract16Regular />
            </button>
            <button
              type="button"
              onClick={undefined}
              className="window-frame-btn w-[46px] h-[28px] inline-flex items-center justify-center hover:bg-gray-200 text-gray-600"
              tabIndex={-1}
            >
              <SquareMultiple16Regular />
            </button>
            <button
              type="button"
              onClick={undefined}
              className="window-frame-btn w-[46px] h-[28px] inline-flex items-center justify-center hover:bg-red-500 hover:text-white text-gray-600"
              tabIndex={-1}
            >
              <Dismiss16Regular />
            </button>
          </div>
        </div>

        {/* Address bar */}
        <div className="window-frame-addressbar flex items-center gap-1 px-2 py-0.5 bg-gray-50 border-b border-shell min-h-[24px]">
          {showNavControls && (
            <div className="window-frame-nav flex items-center gap-0 shrink-0" aria-hidden>
              <button
                type="button"
                tabIndex={-1}
                className="window-frame-nav-btn w-6 h-[22px] inline-flex items-center justify-center text-gray-400 hover:bg-gray-200"
              >
                <ArrowLeft16Regular />
              </button>
              <button
                type="button"
                tabIndex={-1}
                className="window-frame-nav-btn w-6 h-[22px] inline-flex items-center justify-center text-gray-400 hover:bg-gray-200"
              >
                <ArrowRight16Regular />
              </button>
            </div>
          )}
          <div className="window-frame-address-pill flex-1 flex items-center h-[18px] bg-white border border-gray-200 rounded px-1.5 overflow-hidden">
            <span className="window-frame-address text-[11px] text-gray-500 truncate leading-none">{addressLabel}</span>
          </div>
        </div>
      </div>

      {/* Body slot */}
      <div className="window-frame-body flex-1 overflow-hidden" data-window-frame-body="">{children}</div>
    </div>
  );
}

export default WindowFrame;
