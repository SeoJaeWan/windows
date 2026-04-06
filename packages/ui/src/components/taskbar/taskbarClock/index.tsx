import React from "react";

type TaskbarClockProps = React.ComponentPropsWithoutRef<"div"> & {
  timeLabel: string;
  dateLabel: string;
};

export default function TaskbarClock({
  timeLabel,
  dateLabel,
  ...divProps
}: TaskbarClockProps) {
  return (
    <div {...divProps}>
      <span>{timeLabel}</span>
      <span>{dateLabel}</span>
    </div>
  );
}
