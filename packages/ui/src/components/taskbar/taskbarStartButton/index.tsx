import React from "react";

type TaskbarStartButtonProps = React.ComponentPropsWithoutRef<"button">;

const BASE_CLASS =
  "inline-flex items-center justify-center rounded-sm p-2 text-[var(--taskbar-foreground)] hover:bg-[var(--taskbar-surface-hover)] active:bg-[var(--taskbar-surface-active)] focus-visible:taskbar-focus-ring transition-colors duration-150";

export default function TaskbarStartButton({ className, ...props }: TaskbarStartButtonProps) {
  const mergedClass = className ? `${BASE_CLASS} ${className}` : BASE_CLASS;

  return <button type="button" className={mergedClass} {...props} />;
}
