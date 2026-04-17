import type { ComponentPropsWithoutRef, ReactNode } from "react";

import {
  Subtract20Regular,
  SquareMultiple20Regular,
  Dismiss20Regular,
  ArrowLeft16Regular,
  ArrowRight16Regular,
} from "@fluentui/react-icons";

import { cn } from "../../../../internal/cn";

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
 * - Address bar: addressLabel text display
 * - Body slot: flex-1 overflow-hidden — children own scrolling
 *
 * NOT exported from package root.
 */
function WindowFrame({ title, icon, addressLabel, showNavControls = false, children, className, ...rest }: WindowFrameProps) {
  return (
    <div
      className={cn(
        "window-frame flex flex-col h-full rounded-lg border border-shell bg-gray-50 shadow-sm overflow-hidden",
        className
      )}
      {...rest}
    >
      {/* Chrome: title row */}
      <div className="window-frame-titlebar flex items-center gap-2 px-3 py-2 shrink-0 bg-gray-100 border-b border-shell select-none">
        {icon && (
          <span className="window-frame-icon inline-flex items-center justify-center w-5 h-5 shrink-0">
            {icon}
          </span>
        )}
        <span className="window-frame-title flex-1 text-sm font-medium text-gray-800 truncate">
          {title}
        </span>
        {/* Window controls — visual-only, click no-op */}
        <div className="window-frame-controls flex items-center gap-1 shrink-0" aria-hidden>
          <button
            type="button"
            onClick={undefined}
            className="window-frame-btn w-7 h-7 inline-flex items-center justify-center rounded hover:bg-gray-200 text-gray-600"
            tabIndex={-1}
          >
            <Subtract20Regular />
          </button>
          <button
            type="button"
            onClick={undefined}
            className="window-frame-btn w-7 h-7 inline-flex items-center justify-center rounded hover:bg-gray-200 text-gray-600"
            tabIndex={-1}
          >
            <SquareMultiple20Regular />
          </button>
          <button
            type="button"
            onClick={undefined}
            className="window-frame-btn w-7 h-7 inline-flex items-center justify-center rounded hover:bg-red-500 hover:text-white text-gray-600"
            tabIndex={-1}
          >
            <Dismiss20Regular />
          </button>
        </div>
      </div>

      {/* Address bar */}
      <div className="window-frame-addressbar flex items-center gap-2 px-3 py-1.5 shrink-0 bg-gray-50 border-b border-shell">
        {showNavControls && (
          <div className="window-frame-nav flex items-center gap-0.5 shrink-0" aria-hidden>
            <button
              type="button"
              tabIndex={-1}
              className="window-frame-nav-btn w-6 h-6 inline-flex items-center justify-center rounded text-gray-400 hover:bg-gray-200"
            >
              <ArrowLeft16Regular />
            </button>
            <button
              type="button"
              tabIndex={-1}
              className="window-frame-nav-btn w-6 h-6 inline-flex items-center justify-center rounded text-gray-400 hover:bg-gray-200"
            >
              <ArrowRight16Regular />
            </button>
          </div>
        )}
        <span className="window-frame-address text-xs text-gray-500 truncate">{addressLabel}</span>
      </div>

      {/* Body slot */}
      <div className="window-frame-body flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

export default WindowFrame;
