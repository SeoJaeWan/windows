import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "../../../internal/cn";

type TaskbarProps = ComponentPropsWithoutRef<"div"> & {
  children?: ReactNode;
};

function Taskbar({ className, children, ...rest }: TaskbarProps) {
  return (
    <div
      className={cn(
        "taskbar taskbar-glass h-taskbar flex items-center gap-1 px-2 rounded-xl",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Taskbar;
