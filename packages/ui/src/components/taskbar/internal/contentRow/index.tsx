import React from "react";

type ContentRowProps = React.ComponentPropsWithoutRef<"div"> & {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

function ContentRow({ leading, trailing, children, className, ...rest }: ContentRowProps) {
  return (
    <div className={className} {...rest}>
      {leading}
      <div>{children}</div>
      {trailing}
    </div>
  );
}

export default ContentRow;
