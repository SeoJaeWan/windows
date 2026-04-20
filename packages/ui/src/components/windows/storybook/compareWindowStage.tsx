import type { ReactNode } from "react";

import CompareRoot from "../../taskbar/storybook/compareRoot";

/**
 * CompareWindowStage — machine capture owner for windows family
 *
 * Canonical capture owner for Folder and Browser visual diff tooling.
 * Renders an exact `[data-window-compare-stage]` element as the capture
 * boundary, ensuring later compare stories use the same geometry owner
 * and selector contract.
 *
 * Capture selector contract:
 *   [data-window-compare-stage]  — primary capture boundary (this component)
 *   [data-visual-root]           — CompareRoot metadata wrapper (inherited)
 *
 * Geometry family:
 *   desktop: 1024 × 700px canvas — Folder and Browser desktop state capture
 *   mobile:  375 × 680px canvas  — mobile hierarchy capture
 *             Folder: content-first grid state
 *             Browser: simplified chrome / content-first reading state
 *
 * This component does NOT inject className or style into CompareRoot.
 * The scoped style tag targets `[data-window-compare-stage]` directly
 * to fix capture geometry without polluting the CompareRoot contract.
 */

type CompareWindowStageVariant = "desktop" | "mobile";

type CompareWindowStageProps = {
  /** VisualKind surface name — "folder" or "browser". */
  kind: "folder" | "browser";
  /** Kebab-case state meaning (e.g. "default", "mobile-grid"). */
  state: string;
  /**
   * Geometry variant.
   * - desktop: 1024 × 700 capture canvas
   * - mobile: 375 × 680 capture canvas (mobile hierarchy state)
   */
  variant?: CompareWindowStageVariant;
  children?: ReactNode;
};

const CAPTURE_GEOMETRY: Record<
  CompareWindowStageVariant,
  { width: number; height: number }
> = {
  desktop: { width: 1024, height: 700 },
  mobile: { width: 375, height: 680 },
};

function CompareWindowStage({
  kind,
  state,
  variant = "desktop",
  children,
}: CompareWindowStageProps) {
  const { width, height } = CAPTURE_GEOMETRY[variant];

  return (
    <CompareRoot kind={kind} state={state}>
      {/* Scoped style fixes capture canvas geometry without injecting
          className or style into CompareRoot. Bounded exception:
          fixed capture canvas for visual diff tooling. */}
      <style>{`[data-window-compare-stage] { width: ${width}px; height: ${height}px; display: flex; align-items: center; justify-content: center; }`}</style>
      {/* Exact capture boundary — canonical owner selector for windows family */}
      <div data-window-compare-stage="" data-window-variant={variant}>
        {children}
      </div>
    </CompareRoot>
  );
}

export type { CompareWindowStageProps, CompareWindowStageVariant };
export default CompareWindowStage;
