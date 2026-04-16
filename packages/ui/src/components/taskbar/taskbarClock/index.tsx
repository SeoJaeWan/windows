import type { ComponentPropsWithoutRef } from "react";

import { cn } from "../../../internal/cn";

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
      className={cn(
        "taskbar-clock flex flex-col justify-center text-right text-xs text-shell leading-tight px-3 min-w-15 cursor-default",
        className
      )}
      {...rest}
    >
      <p>{timeLabel}</p>
      <p>{dateLabel}</p>
    </div>
  );
}

export default TaskbarClock;
