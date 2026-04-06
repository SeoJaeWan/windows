import React from "react";

type TaskbarStartButtonProps = React.ComponentPropsWithoutRef<"button">;

export default function TaskbarStartButton(props: TaskbarStartButtonProps) {
  return <button type="button" {...props} />;
}
