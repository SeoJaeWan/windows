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
      className={`taskbar-icon-button taskbar-icon-button--${status} relative flex flex-col items-center justify-center size-10 rounded-md hover:bg-[var(--taskbar-surface-hover)] transition-colors ${className ?? ""}`.trim()}
      {...rest}
    >
      <Icon src={iconSrc} alt="" className="size-5" />
      {status !== "default" && (
        <span
          className={`taskbar-icon-button__indicator taskbar-icon-button__indicator--${status} absolute bottom-0.5 rounded-full ${
            status === "active"
              ? "w-4 h-[3px] bg-[var(--taskbar-accent)]"
              : "w-2 h-0.5 bg-[var(--taskbar-foreground-muted)]"
          }`}
          aria-hidden="true"
        />
      )}
    </button>
  );
}

export default TaskbarIconButton;
