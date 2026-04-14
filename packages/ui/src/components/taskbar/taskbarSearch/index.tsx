import type { ComponentPropsWithoutRef, CSSProperties } from "react";

type TaskbarSearchProps = ComponentPropsWithoutRef<"input"> & {
  className?: string;
};

const SEARCH_ICON_SVG =
  "url(\"data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke-width='2' d='M15,15 L22,22 L15,15 Z M9.5,17 C13.6421356,17 17,13.6421356 17,9.5 C17,5.35786438 13.6421356,2 9.5,2 C5.35786438,2 2,5.35786438 2,9.5 C2,13.6421356 5.35786438,17 9.5,17 Z'/%3E%3C/svg%3E\")";

const searchIconStyle: CSSProperties & { "--taskbar-search-icon-mask": string } = {
  "--taskbar-search-icon-mask": SEARCH_ICON_SVG,
};

function TaskbarSearch({ className, ...inputProps }: TaskbarSearchProps) {
  return (
    <div
      className={`taskbar-search group relative h-[30px] shrink-0 ${className ?? ""}`.trim()}
    >
      <input
        type="text"
        className="taskbar-search-input peer block h-full w-full rounded-full border border-[var(--taskbar-border)] bg-white/90 px-3 pl-[30px] text-sm text-[var(--taskbar-foreground)] placeholder:text-[var(--taskbar-foreground-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] outline-none transition-[background-color,box-shadow] duration-300 ease-out group-hover:bg-white/50 focus:bg-white"
        {...inputProps}
      />
      <span
        className="taskbar-search-icon pointer-events-none absolute left-[10px] top-1/2"
        aria-hidden="true"
        style={searchIconStyle}
      />
    </div>
  );
}

export default TaskbarSearch;
