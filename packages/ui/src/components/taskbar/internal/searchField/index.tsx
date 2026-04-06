import React from "react";

type SearchFieldProps = React.ComponentPropsWithoutRef<"input"> & {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

function SearchField({ leading, trailing, className, ...rest }: SearchFieldProps) {
  return (
    <div className={className}>
      {leading}
      <input type="search" {...rest} />
      {trailing}
    </div>
  );
}

export default SearchField;
