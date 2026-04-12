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
      className={`taskbar-windows-button flex items-center justify-center w-10 h-10 rounded-md hover:bg-white hover:backdrop-blur-sm active:bg-white active:backdrop-blur-sm transition-colors ${className ?? ""}`.trim()}
      {...rest}
    >
      <Icon src={src} alt="Windows" className="size-[30px]" />
    </button>
  );
}

export default TaskbarWindowsButton;
