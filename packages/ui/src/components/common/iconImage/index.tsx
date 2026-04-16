import type { ComponentPropsWithoutRef } from "react";

import { cn } from "../../../internal/cn";

type IconImageProps = Omit<ComponentPropsWithoutRef<"img">, "className"> & {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
};

function IconImage({ src, alt, className, imgClassName, ...rest }: IconImageProps) {
  return (
    <span className={cn("inline-flex items-center justify-center", className)}>
      <img
        {...rest}
        src={src}
        alt={alt}
        draggable={false}
        loading="lazy"
        className={cn("size-full object-contain", imgClassName)}
      />
    </span>
  );
}

export default IconImage;
