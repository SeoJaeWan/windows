import React from "react";

type TaskbarProps = {
  startButton: React.ReactNode;
  search: React.ReactNode;
  items: React.ReactNode[];
  clock: React.ReactNode;
  className?: string;
};

const BASE_CLASS =
  "taskbar flex items-center justify-center h-[var(--taskbar-height)] taskbar-surface border-t border-[var(--taskbar-border)] shadow-[var(--taskbar-shadow)] text-[var(--taskbar-foreground)]";

export default function Taskbar({ startButton, search, items, clock, className }: TaskbarProps) {
  const mergedClass = className ? `${BASE_CLASS} ${className}` : BASE_CLASS;

  return (
    <nav className={mergedClass}>
      <div data-slot="start-button">{startButton}</div>
      <div data-slot="search">{search}</div>
      <div data-slot="items">{items}</div>
      <div data-slot="clock">{clock}</div>
    </nav>
  );
}
