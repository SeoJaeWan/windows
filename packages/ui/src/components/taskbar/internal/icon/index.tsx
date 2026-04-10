import type { ComponentPropsWithoutRef } from "react";

type IconProps = ComponentPropsWithoutRef<"img"> & {
  src: string;
  alt: string;
};

function Icon({ src, alt, className, ...rest }: IconProps) {
  return (
    <span className={`taskbar-icon${className ? ` ${className}` : ""}`}>
      <img src={src} alt={alt} draggable={false} loading="lazy" {...rest} />
    </span>
  );
}

export default Icon;
