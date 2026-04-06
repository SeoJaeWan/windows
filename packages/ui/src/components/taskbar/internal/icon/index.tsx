import React from "react";
import filePng from "./assets/file.png";
import folderPng from "./assets/folder.png";

// Normalize: Vite returns string, Next.js returns { src: string, ... }
const resolveSrc = (imported: string | { src: string }): string =>
  typeof imported === "string" ? imported : imported.src;

const FALLBACK: Record<string, string> = {
  file: resolveSrc(filePng as string | { src: string }),
  folder: resolveSrc(folderPng as string | { src: string }),
};

type IconProps = {
  src?: string;
  kind?: "file" | "folder";
  alt?: string;
  className?: string;
};

const BASE_CLASS = "taskbar-icon";

export default function Icon({ src, kind, alt, className }: IconProps) {
  const resolvedSrc = src ?? (kind ? FALLBACK[kind] : undefined);
  const mergedClass = className ? `${BASE_CLASS} ${className}` : BASE_CLASS;

  return <img src={resolvedSrc} alt={alt} className={mergedClass} />;
}
