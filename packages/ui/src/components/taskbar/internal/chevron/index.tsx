import type { CSSProperties } from "react";

type ChevronProps = {
  direction: "left" | "right";
  size?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Inline SVG chevron icon matching lucide-react's ChevronRight/ChevronLeft.
 * Used to avoid adding lucide-react as a package dependency.
 */
function Chevron({ direction, size = 12, className, style }: ChevronProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {direction === "right" ? (
        <path d="m9 18 6-6-6-6" />
      ) : (
        <path d="m15 18-6-6 6-6" />
      )}
    </svg>
  );
}

export default Chevron;
