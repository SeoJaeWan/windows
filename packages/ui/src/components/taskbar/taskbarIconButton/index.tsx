import type { ComponentPropsWithoutRef } from "react";

import { cn } from "../../../internal/cn";
import IconImage from "../../common/iconImage";

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
      className={cn(
        "taskbar-icon-button relative flex h-10 w-10 items-center justify-center rounded-md transition-[background-color,box-shadow] duration-200 ease-out hover:bg-white/75 hover:backdrop-blur-sm",
        `taskbar-icon-button--${status}`,
        className
      )}
      {...rest}
    >
      <IconImage src={iconSrc} alt="" className="size-7.5 active:scale-80 transition-transform duration-200" />
      {status !== "default" && (
        <span
          className={cn(
            "taskbar-icon-button__indicator absolute bottom-0.75 left-1/2 h-0.75 -translate-x-1/2 rounded-full transition-[width,background-color,opacity] duration-200 ease-out",
            status === "active"
              ? "w-3 bg-shell-active opacity-100"
              : "w-1.5 bg-shell-inactive opacity-90"
          )}
          aria-hidden="true"
        />
      )}
    </button>
  );
}

export default TaskbarIconButton;
