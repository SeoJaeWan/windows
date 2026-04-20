import type { ReactNode } from "react";

/**
 * WindowReferenceStage — human review stage for windows family
 *
 * Provides a desktop backdrop for Storybook so reviewers see Folder and
 * Browser components in spatial context. Both components share the same
 * stage geometry contract.
 *
 * Mobile hierarchy comparison:
 *   Folder  — content-first grid: sidebar collapses, grid fills viewport.
 *             Use `variant="mobile"` to show the mobile hierarchy state.
 *   Browser — simplified chrome / content-first reading hierarchy:
 *             address bar and control cluster simplify, content fills viewport.
 *             Use `variant="mobile"` to show the mobile hierarchy state.
 *
 * Exception taxonomy (storybook bounded exceptions):
 * - Decorative desktop backdrop: fixed canvas geometry — screenshot capture
 *   requires stable width/height; position:relative enables host-composition
 *   overlay placement.
 * - Mobile canvas: narrower fixed width to demonstrate mobile hierarchy.
 */

type WindowReferenceStageVariant = "desktop" | "mobile";

type WindowReferenceStageProps = {
  /** Human-readable label rendered above the stage for review context. */
  label: string;
  /**
   * Stage geometry variant.
   * - desktop: full window canvas (1024 × 700)
   * - mobile: narrow canvas (375 × 680) demonstrating mobile hierarchy
   */
  variant?: WindowReferenceStageVariant;
  children: ReactNode;
};

const STAGE_GEOMETRY: Record<
  WindowReferenceStageVariant,
  { width: number; height: number }
> = {
  desktop: { width: 1024, height: 700 },
  mobile: { width: 375, height: 680 },
};

function WindowReferenceStage({
  label,
  variant = "desktop",
  children,
}: WindowReferenceStageProps) {
  const { width, height } = STAGE_GEOMETRY[variant];

  return (
    <div className="sb-stage-outer sb-stage-outer--window">
      <div className="sb-stage-label">{label}</div>
      {/* Desktop/mobile backdrop canvas — decorative bounded exception.
          Fixed canvas geometry required for stable screenshot capture.
          position:relative enables host-composition overlay placement. */}
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width,
          height,
          background:
            "linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 40%, #4fc3f7 100%)",
          borderRadius: 12,
          padding: 24,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export type { WindowReferenceStageProps, WindowReferenceStageVariant };
export default WindowReferenceStage;
