import type { ComponentPropsWithoutRef } from "react";

import Icon from "../internal/icon";

const WINDOWS_MARK_SRC = new URL(
  "../internal/icon/assets/windows-mark.png",
  import.meta.url,
).href;

function TaskbarWindowsButton({
  className,
  ...rest
}: ComponentPropsWithoutRef<"button">) {
  return (
    <button className={`taskbar-windows-button ${className ?? ""}`.trim()} {...rest}>
      <Icon src={WINDOWS_MARK_SRC} alt="Windows" />
    </button>
  );
}

export default TaskbarWindowsButton;
