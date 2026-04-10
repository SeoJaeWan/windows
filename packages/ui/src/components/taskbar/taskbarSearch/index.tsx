import type { ComponentPropsWithoutRef } from "react";

type TaskbarSearchProps = ComponentPropsWithoutRef<"input"> & {
  className?: string;
};

function TaskbarSearch({ className, ...inputProps }: TaskbarSearchProps) {
  return (
    <div className={`taskbar-search ${className ?? ""}`.trim()}>
      <span className="taskbar-search-icon" aria-hidden="true" />
      <input {...inputProps} />
    </div>
  );
}

export default TaskbarSearch;
