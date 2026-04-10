import type { ComponentPropsWithoutRef } from "react";

import Icon from "../internal/icon";

type TaskbarIconButtonProps = ComponentPropsWithoutRef<"button"> & {
  status: "default" | "active" | "hide";
  iconSrc: string;
};

function TaskbarIconButton({
  className,
  status,
  iconSrc,
  ...rest
}: TaskbarIconButtonProps) {
  return (
    <button
      className={`taskbar-icon-button taskbar-icon-button--${status} ${className ?? ""}`.trim()}
      {...rest}
    >
      <Icon src={iconSrc} alt="" />
      {status !== "default" && (
        <span
          className={`taskbar-icon-button__indicator taskbar-icon-button__indicator--${status}`}
          aria-hidden="true"
        />
      )}
    </button>
  );
}

export default TaskbarIconButton;
