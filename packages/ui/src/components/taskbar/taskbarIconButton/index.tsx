import React from "react";
import Icon from "../internal/icon";

type TaskbarIconButtonStatus = "default" | "open" | "active";

type TaskbarIconButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  icon?: React.ReactNode;
  kind?: React.ComponentProps<typeof Icon>["kind"];
  label?: string;
  status?: TaskbarIconButtonStatus;
};

const STATUS_WRAPPER_CLASS: Record<TaskbarIconButtonStatus, string> = {
  default:
    "taskbar-icon-button relative inline-flex flex-col items-center",
  open:
    "taskbar-icon-button relative inline-flex flex-col items-center bg-[var(--taskbar-surface-hover)]",
  active:
    "taskbar-icon-button relative inline-flex flex-col items-center bg-[var(--taskbar-surface-active)]",
};

const BUTTON_BASE_CLASS =
  "inline-flex items-center justify-center rounded-sm p-2 text-[var(--taskbar-foreground)] hover:bg-[var(--taskbar-surface-hover)] active:bg-[var(--taskbar-surface-active)] focus-visible:taskbar-focus-ring transition-colors duration-150";

const INDICATOR_OPEN_CLASS =
  "absolute bottom-0 left-1/2 h-0.5 w-3 -translate-x-1/2 rounded-full bg-[var(--taskbar-foreground-muted)]";

const INDICATOR_ACTIVE_CLASS =
  "absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[var(--taskbar-accent)]";

export default function TaskbarIconButton({
  icon,
  kind,
  label,
  status = "default",
  className,
  ...buttonProps
}: TaskbarIconButtonProps) {
  const resolvedIcon = icon ?? (kind ? <Icon kind={kind} alt={label ? "" : kind} /> : null);
  const wrapperClass = STATUS_WRAPPER_CLASS[status];
  const mergedButtonClass = className ? `${BUTTON_BASE_CLASS} ${className}` : BUTTON_BASE_CLASS;

  return (
    <div data-status={status} className={wrapperClass}>
      <button type="button" className={mergedButtonClass} {...buttonProps}>
        {resolvedIcon}
        {label && <span>{label}</span>}
      </button>
      {status === "open" && <div aria-hidden="true" className={INDICATOR_OPEN_CLASS} />}
      {status === "active" && <div aria-hidden="true" role="presentation" className={INDICATOR_ACTIVE_CLASS} />}
    </div>
  );
}
