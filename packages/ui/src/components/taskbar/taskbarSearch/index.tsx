import React from "react";

type TaskbarSearchProps = Omit<React.ComponentPropsWithoutRef<"input">, "className"> & {
  /** Applied to the root wrapper div, not the inner input. */
  className?: string;
};

const BASE_CLASS =
  "taskbar-search inline-flex items-center rounded-full bg-[var(--taskbar-surface-hover)] px-3 py-1 text-[var(--taskbar-foreground)] hover:bg-[var(--taskbar-surface-active)] focus-within:taskbar-focus-ring transition-colors duration-150";

export default function TaskbarSearch({ className, ...props }: TaskbarSearchProps) {
  const mergedClass = className ? `${BASE_CLASS} ${className}` : BASE_CLASS;

  return (
    <div className={mergedClass}>
      <input {...props} />
    </div>
  );
}
