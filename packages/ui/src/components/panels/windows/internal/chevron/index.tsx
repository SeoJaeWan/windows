import type { CSSProperties } from "react";

import {
  ChevronLeft12Regular,
  ChevronRight12Regular,
  ChevronRight16Regular,
} from "@fluentui/react-icons";

type ChevronProps = {
  direction: "left" | "right";
  size?: number;
  className?: string;
  style?: CSSProperties;
  slotClassName?: string;
  fluentIcon?: string;
};

/**
 * Fluent chevron icon wrapper.
 * Replaces the previous inline SVG with sized Fluent Regular variants.
 */
function Chevron({ direction, size = 12, className, style, slotClassName, fluentIcon }: ChevronProps) {
  const resolvedFluentIcon =
    fluentIcon ??
    (direction === "left"
      ? "ChevronLeft12Regular"
      : size > 12
        ? "ChevronRight16Regular"
        : "ChevronRight12Regular");

  const Icon =
    direction === "left"
      ? ChevronLeft12Regular
      : size > 12
        ? ChevronRight16Regular
        : ChevronRight12Regular;

  return (
    <span
      className={`${slotClassName ?? ""} ${className ?? ""}`.trim() || undefined}
      style={style}
      aria-hidden="true"
      data-fluent-icon={resolvedFluentIcon}
    >
      <Icon />
    </span>
  );
}

export default Chevron;
