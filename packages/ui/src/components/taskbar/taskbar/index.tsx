import type { ComponentPropsWithoutRef, ReactNode } from "react";

type TaskbarProps = ComponentPropsWithoutRef<"div"> & {
  children?: ReactNode;
};

function Taskbar({ className, children, ...rest }: TaskbarProps) {
  return (
    <div className={`taskbar ${className ?? ""}`.trim()} {...rest}>
      {children}
    </div>
  );
}

export default Taskbar;
