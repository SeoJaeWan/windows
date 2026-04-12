import type { ComponentPropsWithoutRef, CSSProperties } from "react";

type TaskbarSearchProps = ComponentPropsWithoutRef<"input"> & {
  className?: string;
};

const SEARCH_ICON_SVG =
  "url(\"data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke-width='2' d='M15,15 L22,22 L15,15 Z M9.5,17 C13.6421356,17 17,13.6421356 17,9.5 C17,5.35786438 13.6421356,2 9.5,2 C5.35786438,2 2,5.35786438 2,9.5 C2,13.6421356 5.35786438,17 9.5,17 Z'/%3E%3C/svg%3E\")";

const searchIconStyle: CSSProperties = {
  width: 18,
  height: 18,
  backgroundColor: "var(--taskbar-foreground)",
  WebkitMaskImage: SEARCH_ICON_SVG,
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  WebkitMaskSize: "contain",
  maskImage: SEARCH_ICON_SVG,
  maskRepeat: "no-repeat",
  maskPosition: "center",
  maskSize: "contain",
};

function TaskbarSearch({ className, ...inputProps }: TaskbarSearchProps) {
  return (
    <div
      className={`taskbar-search group relative w-[220px] h-full ${className ?? ""}`.trim()}
    >
      <input
        type="text"
        className="w-full h-full border border-[var(--taskbar-border)] p-1.5 pl-[30px] rounded-full text-sm bg-white/90 text-[var(--taskbar-foreground)] placeholder:text-[var(--taskbar-foreground-muted)] outline-none peer group-hover:bg-white/50 focus:taskbar-focus-ring"
        {...inputProps}
      />
      <span
        className="taskbar-search-icon pointer-events-none absolute left-[10px] top-[60%] -translate-y-1/2"
        aria-hidden="true"
        style={searchIconStyle}
      />
    </div>
  );
}

export default TaskbarSearch;
