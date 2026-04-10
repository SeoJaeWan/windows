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
    <div className={`taskbar-clock ${className ?? ""}`.trim()} {...rest}>
      <span>{timeLabel}</span>
      <span>{dateLabel}</span>
    </div>
  );
}

export default TaskbarClock;
