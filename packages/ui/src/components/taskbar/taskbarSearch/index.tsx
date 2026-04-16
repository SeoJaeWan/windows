import type { ComponentPropsWithoutRef } from "react";

import { Search20Regular } from "@fluentui/react-icons";
import { cn } from "../../../internal/cn";

type TaskbarSearchProps = ComponentPropsWithoutRef<"input"> & {
  className?: string;
};

function TaskbarSearch({ className, ...inputProps }: TaskbarSearchProps) {
  return (
    <div className={cn("taskbar-search group relative h-7.5 shrink-0", className)}>
      <input
        type="text"
        className="taskbar-search-input peer block h-full w-full rounded-full border border-shell bg-white/90 px-3 pl-9.5 text-sm text-shell placeholder:text-shell-muted shadow-shell-search-inset outline-none transition-[background-color,box-shadow] duration-300 ease-out group-hover:bg-white/50 focus:bg-white"
        {...inputProps}
      />
      <span
        className="taskbar-search-icon pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-shell-search-icon"
        aria-hidden="true"
        data-fluent-icon="Search20Regular"
      >
        <Search20Regular />
      </span>
    </div>
  );
}

export default TaskbarSearch;
