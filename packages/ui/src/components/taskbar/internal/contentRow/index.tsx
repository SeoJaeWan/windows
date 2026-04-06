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
      {leading}
      <div>{children}</div>
      {trailing}
    </div>
  );
}

export default ContentRow;
