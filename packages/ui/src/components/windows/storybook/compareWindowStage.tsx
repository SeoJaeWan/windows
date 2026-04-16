import type { ReactNode } from "react";

type WindowStageProps = {
  children: ReactNode;
};

/**
 * CompareWindowDesktopStage
 *
 * Machine-capture canvas for Folder/Browser desktop compare stories.
 * Provides fixed 1280px viewport width geometry for stable visual diff capture.
 * No human-review decoration (no gradient, no label, no padding frame).
 *
 * Exception taxonomy:
 * - fixed capture canvas — bounded exception for stable capture geometry
 */
export function CompareWindowDesktopStage({ children }: WindowStageProps) {
  return (
    <div
      style={{
        width: 1280,
        height: 720,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}

/**
 * CompareWindowMobileStage
 *
 * Machine-capture canvas for Folder/Browser mobile compare stories.
 * Provides fixed 390px viewport width geometry for stable visual diff capture.
 * No human-review decoration (no gradient, no label, no padding frame).
 *
 * Exception taxonomy:
 * - fixed capture canvas — bounded exception for stable capture geometry
 */
export function CompareWindowMobileStage({ children }: WindowStageProps) {
  return (
    <div
      style={{
        width: 390,
        height: 720,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}
