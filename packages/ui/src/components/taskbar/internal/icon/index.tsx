import React from "react";

import fileFallback from "./assets/file.png";
import folderFallback from "./assets/folder.png";

const FALLBACK_ASSETS: Record<string, string> = {
  file: fileFallback,
  folder: folderFallback,
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
