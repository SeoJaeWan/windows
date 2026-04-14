import type { ComponentPropsWithoutRef } from "react";

import { Search20Regular } from "@fluentui/react-icons";

type TaskbarSearchProps = ComponentPropsWithoutRef<"input"> & {
  className?: string;
};

function TaskbarSearch({ className, ...inputProps }: TaskbarSearchProps) {
  return (
    <div
      className={`taskbar-search group relative h-[30px] shrink-0 ${className ?? ""}`.trim()}
    >
      <input
        type="text"
        className="taskbar-search-input peer block h-full w-full rounded-full border border-[var(--taskbar-border)] bg-white/90 px-3 pl-[38px] text-sm text-[var(--taskbar-foreground)] placeholder:text-[var(--taskbar-foreground-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] outline-none transition-[background-color,box-shadow] duration-300 ease-out group-hover:bg-white/50 focus:bg-white"
        {...inputProps}
      />
      <span
        className="taskbar-search-icon pointer-events-none absolute left-[10px] top-1/2 -translate-y-1/2 flex items-center justify-center text-[var(--taskbar-search-icon-base)]"
        aria-hidden="true"
        data-fluent-icon="Search20Regular"
      >
        <Search20Regular />
      </span>
    </div>
  );
}

export default TaskbarSearch;
