import type { ComponentPropsWithoutRef } from "react";

type IconProps = ComponentPropsWithoutRef<"img"> & {
  src: string;
  alt: string;
};

function Icon({ src, alt, className, ...rest }: IconProps) {
  return (
    <span className={`taskbar-icon inline-flex items-center justify-center${className ? ` ${className}` : ""}`}>
      <img src={src} alt={alt} draggable={false} loading="lazy" className="size-full object-contain" {...rest} />
    </span>
  );
}

export default Icon;
