import React from "react";

const FALLBACK_ASSETS: Record<string, string> = {
  file: "/assets/icons/file.png",
  folder: "/assets/icons/folder.png",
};

type IconProps = {
  src?: string;
  kind?: "file" | "folder";
  alt?: string;
  className?: string;
};

function Icon({ src, kind, alt, className }: IconProps) {
  const resolvedSrc = src ?? (kind ? FALLBACK_ASSETS[kind] : undefined);

  if (!resolvedSrc) {
    return null;
  }

  return <img src={resolvedSrc} alt={alt} className={className} />;
}

export default Icon;
