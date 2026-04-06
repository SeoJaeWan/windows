import React from "react";

type TaskbarSearchProps = React.ComponentPropsWithoutRef<"input">;

export default function TaskbarSearch(props: TaskbarSearchProps) {
  return (
    <div>
      <input {...props} />
    </div>
  );
}
