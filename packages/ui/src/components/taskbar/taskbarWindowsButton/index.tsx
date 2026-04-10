import type { ComponentPropsWithoutRef } from "react";

import Icon from "../internal/icon";

type TaskbarWindowsButtonProps = ComponentPropsWithoutRef<"button"> & {
  /** Public path to the Windows mark asset. Defaults to "/assets/windows-mark.png". */
  iconSrc?: string;
};

const DEFAULT_ICON_SRC = "/assets/windows-mark.png";

function TaskbarWindowsButton({
  className,
  iconSrc = DEFAULT_ICON_SRC,
  ...rest
}: TaskbarWindowsButtonProps) {
  return (
    <button className={`taskbar-windows-button ${className ?? ""}`.trim()} {...rest}>
      <Icon src={iconSrc} alt="Windows" />
    </button>
  );
}

export default TaskbarWindowsButton;
