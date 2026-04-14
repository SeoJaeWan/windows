import type { ComponentPropsWithoutRef, ReactNode } from "react";

type TaskbarProps = ComponentPropsWithoutRef<"div"> & {
  children?: ReactNode;
};

function Taskbar({ className, children, ...rest }: TaskbarProps) {
  return (
    <div
      className={`taskbar taskbar-glass h-taskbar flex items-center gap-1 px-2 rounded-xl ${className ?? ""}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Taskbar;
