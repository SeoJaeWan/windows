import type { ComponentPropsWithoutRef } from "react";

import Icon from "../internal/icon";
import windowsMark from "../internal/icon/assets/windows-mark.png";

type TaskbarWindowsButtonProps = ComponentPropsWithoutRef<"button">;

const iconSrc =
  typeof windowsMark === "string" ? windowsMark : windowsMark.src;

function TaskbarWindowsButton({
  className,
  ...rest
}: TaskbarWindowsButtonProps) {
  return (
    <button className={`taskbar-windows-button ${className ?? ""}`.trim()} {...rest}>
      <Icon src={iconSrc} alt="Windows" />
    </button>
  );
}

export default TaskbarWindowsButton;
