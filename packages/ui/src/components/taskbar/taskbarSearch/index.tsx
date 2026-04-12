import type { ComponentPropsWithoutRef } from "react";

type TaskbarSearchProps = ComponentPropsWithoutRef<"input"> & {
  className?: string;
};

function TaskbarSearch({ className, ...inputProps }: TaskbarSearchProps) {
  return (
    <div
      className={`taskbar-search flex items-center gap-2 w-52 h-8 px-3 rounded-full bg-[var(--taskbar-surface-hover)] focus-within:taskbar-focus-ring ${className ?? ""}`.trim()}
    >
      <span className="taskbar-search-icon shrink-0" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-4 text-[var(--taskbar-foreground-muted)]"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <input
        className="flex-1 bg-transparent text-sm text-[var(--taskbar-foreground)] placeholder:text-[var(--taskbar-foreground-muted)] outline-none"
        {...inputProps}
      />
    </div>
  );
}

export default TaskbarSearch;
