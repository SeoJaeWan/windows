import React from "react";

type ContentRowProps = React.ComponentPropsWithoutRef<"div"> & {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

const BASE_CLASS = "taskbar-content-row";

function ContentRow({ leading, trailing, children, className, ...rest }: ContentRowProps) {
  const mergedClass = className ? `${BASE_CLASS} ${className}` : BASE_CLASS;

  return (
    <div className={mergedClass} {...rest}>
      {leading != null && <span data-slot="leading">{leading}</span>}
      <div data-slot="content">{children}</div>
      {trailing != null && <span data-slot="trailing">{trailing}</span>}
    </div>
  );
}

export default ContentRow;
