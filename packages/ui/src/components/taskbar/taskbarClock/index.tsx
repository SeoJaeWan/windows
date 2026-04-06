import React from "react";

type TaskbarClockProps = React.ComponentPropsWithoutRef<"div"> & {
  timeLabel: string;
  dateLabel: string;
};

const BASE_CLASS =
  "taskbar-clock inline-flex flex-col items-center justify-center rounded-sm px-2 py-1 text-[var(--taskbar-foreground-muted)] hover:bg-[var(--taskbar-surface-hover)] transition-colors duration-150";

export default function TaskbarClock({
  timeLabel,
  dateLabel,
  className,
  ...divProps
}: TaskbarClockProps) {
  const mergedClass = className ? `${BASE_CLASS} ${className}` : BASE_CLASS;

  return (
    <div className={mergedClass} {...divProps}>
      <span>{timeLabel}</span>
      <span>{dateLabel}</span>
    </div>
  );
}
