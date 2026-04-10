import type { ComponentPropsWithoutRef } from "react";

type TaskbarClockProps = ComponentPropsWithoutRef<"div"> & {
  timeLabel: string;
  dateLabel: string;
};

function TaskbarClock({
  className,
  timeLabel,
  dateLabel,
  ...rest
}: TaskbarClockProps) {
  return (
    <div
      className={`taskbar-clock flex flex-col items-center justify-center px-2 text-xs text-[var(--taskbar-foreground)] leading-tight ${className ?? ""}`.trim()}
      {...rest}
    >
      <span>{timeLabel}</span>
      <span>{dateLabel}</span>
    </div>
  );
}

export default TaskbarClock;
