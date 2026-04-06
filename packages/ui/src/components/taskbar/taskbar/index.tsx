import React from "react";

type TaskbarProps = {
  startButton: React.ReactNode;
  search: React.ReactNode;
  items: React.ReactNode[];
  clock: React.ReactNode;
};

export default function Taskbar({ startButton, search, items, clock }: TaskbarProps) {
  return (
    <nav>
      <div>{startButton}</div>
      <div>{search}</div>
      <div>
        {items.map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      </div>
      <div>{clock}</div>
    </nav>
  );
}
