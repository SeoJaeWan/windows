import type { ComponentPropsWithoutRef } from "react";

type IconImageProps = Omit<ComponentPropsWithoutRef<"img">, "className"> & {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
};

function IconImage({ src, alt, className, imgClassName, ...rest }: IconImageProps) {
  return (
    <span className={`inline-flex items-center justify-center${className ? ` ${className}` : ""}`}>
      <img
        {...rest}
        src={src}
        alt={alt}
        draggable={false}
        loading="lazy"
        className={`size-full object-contain${imgClassName ? ` ${imgClassName}` : ""}`}
      />
    </span>
  );
}

export default IconImage;
