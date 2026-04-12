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
      className={`taskbar-icon-button taskbar-icon-button--${status} relative flex items-center justify-center w-10 h-10 rounded-md hover:bg-white hover:backdrop-blur-sm transition-colors ${className ?? ""}`.trim()}
      {...rest}
    >
      <Icon src={iconSrc} alt="" className="size-[30px] active:scale-[0.8] transition-transform duration-200" />
      {status !== "default" && (
        <span
          className="taskbar-icon-button__indicator absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all"
          style={{
            width: status === "active" ? "12px" : "6px",
            backgroundColor:
              status === "active"
                ? "var(--taskbar-active)"
                : "var(--taskbar-inactive)",
          }}
          aria-hidden="true"
        />
      )}
    </button>
  );
}

export default TaskbarIconButton;
