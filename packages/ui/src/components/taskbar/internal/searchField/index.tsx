import React from "react";

type SearchFieldProps = React.ComponentPropsWithoutRef<"input"> & {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

const BASE_CLASS = "taskbar-search-field";

function SearchField({ leading, trailing, className, ...rest }: SearchFieldProps) {
  const mergedClass = className ? `${BASE_CLASS} ${className}` : BASE_CLASS;

  return (
    <div className={mergedClass}>
      {leading != null && <span data-slot="leading">{leading}</span>}
      <input type="search" {...rest} />
      {trailing != null && <span data-slot="trailing">{trailing}</span>}
    </div>
  );
}

export default SearchField;
