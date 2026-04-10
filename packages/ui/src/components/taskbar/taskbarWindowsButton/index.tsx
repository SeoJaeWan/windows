import type { ComponentPropsWithoutRef } from "react";

import Icon from "../internal/icon";
import windowsMark from "../internal/icon/assets/windows-mark.png";

function TaskbarWindowsButton({
  className,
  ...rest
}: ComponentPropsWithoutRef<"button">) {
  const src = typeof windowsMark === "string" ? windowsMark : windowsMark.src;

  return (
    <button className={`taskbar-windows-button ${className ?? ""}`.trim()} {...rest}>
      <Icon src={src} alt="Windows" />
    </button>
  );
}

export default TaskbarWindowsButton;
