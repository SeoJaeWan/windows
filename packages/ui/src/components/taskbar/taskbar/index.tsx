import React from "react";

type TaskbarProps = Omit<React.ComponentPropsWithoutRef<"nav">, "children"> & {
  startButton: React.ReactNode;
  search: React.ReactNode;
  items: React.ReactNode[];
  clock: React.ReactNode;
};

const BASE_CLASS =
  "taskbar flex items-center justify-center gap-2 h-[var(--taskbar-height)] taskbar-surface border-t border-[var(--taskbar-border)] shadow-[var(--taskbar-shadow)] text-[var(--taskbar-foreground)]";

export default function Taskbar({ startButton, search, items, clock, className, ...navProps }: TaskbarProps) {
  const mergedClass = className ? `${BASE_CLASS} ${className}` : BASE_CLASS;

  return (
    <nav className={mergedClass} {...navProps}>
      <div data-slot="start-button">{startButton}</div>
      <div data-slot="search">{search}</div>
      <div data-slot="items" className="flex items-center">{items}</div>
      <div data-slot="clock">{clock}</div>
    </nav>
  );
}
