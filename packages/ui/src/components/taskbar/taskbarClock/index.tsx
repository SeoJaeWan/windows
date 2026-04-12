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
      className={`taskbar-clock flex flex-col justify-center text-right text-xs text-[var(--taskbar-foreground)] leading-tight px-3 min-w-[5em] cursor-default ${className ?? ""}`.trim()}
      {...rest}
    >
      <span>{timeLabel}</span>
      <span>{dateLabel}</span>
    </div>
  );
}

export default TaskbarClock;
