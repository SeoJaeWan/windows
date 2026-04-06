import React from "react";
import Icon from "../internal/icon";

type TaskbarIconButtonStatus = "default" | "open" | "active";

type TaskbarIconButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  icon?: React.ReactNode;
  kind?: React.ComponentProps<typeof Icon>["kind"];
  label?: string;
  status?: TaskbarIconButtonStatus;
};

export default function TaskbarIconButton({
  icon,
  kind,
  label,
  status = "default",
  ...buttonProps
}: TaskbarIconButtonProps) {
  const resolvedIcon = icon ?? (kind ? <Icon kind={kind} alt={label ? "" : kind} /> : null);

  return (
    <div data-status={status}>
      <button type="button" {...buttonProps}>
        {resolvedIcon}
        {label && <span>{label}</span>}
      </button>
      {status === "open" && <div aria-hidden="true" />}
      {status === "active" && <div aria-hidden="true" role="presentation" />}
    </div>
  );
}
