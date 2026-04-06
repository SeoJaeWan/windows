import React from "react";

type TaskbarIconButtonStatus = "default" | "open" | "active";

type TaskbarIconButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  icon?: React.ReactNode;
  label?: string;
  status?: TaskbarIconButtonStatus;
};

export default function TaskbarIconButton({
  icon,
  label,
  status = "default",
  ...buttonProps
}: TaskbarIconButtonProps) {
  return (
    <div data-status={status}>
      <button type="button" {...buttonProps}>
        {icon}
        {label && <span>{label}</span>}
      </button>
      {status === "open" && <div aria-hidden="true" />}
      {status === "active" && <div aria-hidden="true" role="presentation" />}
    </div>
  );
}
