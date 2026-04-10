import type { ComponentPropsWithoutRef } from "react";

import Icon from "../internal/icon";
import windowsMark from "../internal/icon/assets/windows-mark.png";

function TaskbarWindowsButton({
  className,
  ...rest
}: ComponentPropsWithoutRef<"button">) {
  const src = typeof windowsMark === "string" ? windowsMark : windowsMark.src;

  return (
    <button
      className={`taskbar-windows-button flex items-center justify-center size-10 rounded-md hover:bg-[var(--taskbar-surface-hover)] transition-colors ${className ?? ""}`.trim()}
      {...rest}
    >
      <Icon src={src} alt="Windows" className="size-5" />
    </button>
  );
}

export default TaskbarWindowsButton;
