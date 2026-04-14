import type { ComponentPropsWithoutRef } from "react";

import IconImage from "../../common/iconImage";
import windowsMark from "./assets/windows-mark.png";

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
      <IconImage src={src} alt="Windows" className="size-7.5" />
    </button>
  );
}

export default TaskbarWindowsButton;
