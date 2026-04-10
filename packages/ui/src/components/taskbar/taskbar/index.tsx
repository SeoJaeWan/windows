import type { ComponentPropsWithoutRef, ReactNode } from "react";

type TaskbarProps = ComponentPropsWithoutRef<"div"> & {
  children?: ReactNode;
};

function Taskbar({ className, children, ...rest }: TaskbarProps) {
  return (
    <div
      className={`taskbar taskbar-surface h-[var(--taskbar-height)] flex items-center gap-1 px-2 rounded-xl border border-[var(--taskbar-border)] shadow-[var(--taskbar-shadow)] ${className ?? ""}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Taskbar;
