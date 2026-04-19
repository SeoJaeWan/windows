import type { ReactNode } from "react";

type WindowStageProps = {
  children: ReactNode;
};

/**
 * CompareWindowDesktopStage
 *
 * Machine-capture canvas for Folder/Browser desktop compare stories.
 * Provides fixed 1282×752px viewport geometry for stable visual diff capture.
 * Matches canonical outer geometry locked in Phase 1 baseline inventory.
 * No human-review decoration (no gradient, no label, no padding frame).
 *
 * Owns [data-window-compare-stage="desktop"] — package-owned compare contract.
 * Sole DOM owner of [data-window-compare-stage] — WindowFrame does not own this attribute.
 *
 * Exception taxonomy:
 * - fixed capture canvas — bounded exception for stable capture geometry
 */
export function CompareWindowDesktopStage({ children }: WindowStageProps) {
  return (
    <div
      data-window-compare-stage="desktop"
      style={{
        width: 1282,
        height: 752,
        overflow: "hidden",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
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
 * Provides fixed 392×796px viewport geometry for stable visual diff capture.
 * Matches canonical outer geometry locked in Phase 1 baseline inventory.
 * No human-review decoration (no gradient, no label, no padding frame).
 *
 * Owns [data-window-compare-stage="mobile"] — package-owned compare contract.
 * Sole DOM owner of [data-window-compare-stage] — WindowFrame does not own this attribute.
 *
 * Exception taxonomy:
 * - fixed capture canvas — bounded exception for stable capture geometry
 */
export function CompareWindowMobileStage({ children }: WindowStageProps) {
  return (
    <div
      data-window-compare-stage="mobile"
      style={{
        width: 392,
        height: 796,
        overflow: "hidden",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  );
}
