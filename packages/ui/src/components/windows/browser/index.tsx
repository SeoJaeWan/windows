import type { ReactNode } from "react";

import { cn } from "../../../internal/cn";
import WindowFrame from "../internal/windowFrame";

type BrowserProps = {
  title: string;
  icon?: ReactNode;
  addressLabel: string;
  children: ReactNode;
  className?: string;
};

/**
 * Browser
 *
 * Public component. Renders a Windows-style browser window built on WindowFrame.
 *
 * Layout:
 * - WindowFrame chrome (title bar, address bar, window controls) — always present
 * - Body slot: children rendered in a scrollable flex container
 *
 * No sidebar, no variant prop, no route props, no 404 boolean,
 * no public window-control toggles — those are host concerns.
 */
function Browser({ title, icon, addressLabel, children, className }: BrowserProps) {
  return (
    <WindowFrame
      title={title}
      icon={icon}
      addressLabel={addressLabel}
      className={cn("browser", className)}
    >
      <div className="browser-body flex-1 overflow-y-auto h-full">{children}</div>
    </WindowFrame>
  );
}

export type { BrowserProps };
export default Browser;
