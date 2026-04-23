import type { ReactNode } from "react";

type WindowReferenceStageProps = {
  label: string;
  variant?: "desktop" | "mobile";
  children: ReactNode;
};

/**
 * WindowReferenceStage
 *
 * Human-review decorative backdrop for Folder / Browser reference stories.
 * Provides a desktop-style gradient canvas so reviewers see the window in
 * spatial context. Separate from `CompareWindowStage`, which owns the
 * machine-capture DOM contract.
 *
 * Bounded exception (per storybook.md):
 *   - decorative desktop backdrop gradient
 *   - fixed capture canvas geometry (width/height)
 * This file is a Storybook-only scaffold; no compare-owned identifier is
 * introduced here.
 */
function WindowReferenceStage({
  label,
  variant = "desktop",
  children,
}: WindowReferenceStageProps) {
  const geometry =
    variant === "mobile"
      ? { canvas: { w: 430, h: 812 }, window: { w: 375, h: 680 } }
      : { canvas: { w: 1280, h: 720 }, window: { w: 1024, h: 700 } };

  return (
    <div className="sb-stage-outer sb-stage-outer--window">
      <div className="sb-stage-label">{label}</div>
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: geometry.canvas.w,
          height: geometry.canvas.h,
          background:
            "linear-gradient(135deg, #1e90ff 0%, #87ceeb 50%, #4fc3f7 100%)",
          borderRadius: 12,
        }}
      >
        <div
          style={{
            width: geometry.window.w,
            height: geometry.window.h,
            display: "flex",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default WindowReferenceStage;
