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
          <React.Fragment
            key={
              React.isValidElement(item) && item.key != null
                ? item.key
                : i
            }
          >
            {item}
          </React.Fragment>
        ))}
      </div>
      <div>{clock}</div>
    </nav>
  );
}
