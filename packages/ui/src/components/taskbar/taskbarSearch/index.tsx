import type { ComponentPropsWithoutRef } from "react";

type TaskbarSearchProps = ComponentPropsWithoutRef<"input"> & {
  className?: string;
};

function TaskbarSearch({ className, ...inputProps }: TaskbarSearchProps) {
  return (
    <div
      className={`taskbar-search relative flex items-center w-[220px] h-full rounded-full border border-[var(--taskbar-border)] bg-white/90 focus-within:taskbar-focus-ring ${className ?? ""}`.trim()}
    >
      <span
        className="taskbar-search-icon pointer-events-none absolute left-2.5 top-[60%] -translate-y-1/2 shrink-0"
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="size-[18px] text-[var(--taskbar-foreground)]"
        >
          <path
            d="M15 15L22 22"
            strokeLinecap="round"
          />
          <circle cx="9.5" cy="9.5" r="7.5" />
        </svg>
      </span>
      <input
        type="text"
        className="flex-1 h-full bg-transparent pl-[30px] pr-3 text-sm text-[var(--taskbar-foreground)] placeholder:text-[var(--taskbar-foreground-muted)] outline-none"
        {...inputProps}
      />
    </div>
  );
}

export default TaskbarSearch;
