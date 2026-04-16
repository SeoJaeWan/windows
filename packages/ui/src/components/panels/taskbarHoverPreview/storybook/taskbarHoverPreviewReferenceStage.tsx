import type { ReactNode } from "react";

type TaskbarHoverPreviewReferenceStageProps = {
  label: string;
  children: ReactNode;
};

/**
 * TaskbarHoverPreviewReferenceStage
 *
 * Decorative canvas for Storybook — provides a bright desktop backdrop with
 * a simulated taskbar strip so reviewers see the hover preview in spatial
 * context above the taskbar rail.
 *
 * Exception taxonomy:
 * - Outer container layout → sb-stage-outer sb-stage-outer--preview (central class)
 * - Label row → sb-stage-label (central class)
 * - Decorative canvas: fixed width/height + backdrop gradient + simulated taskbar
 *   strip — bounded exception (screenshot capture geometry, decorative desktop
 *   backdrop gradient, host-composition overlay placement)
 */
function TaskbarHoverPreviewReferenceStage({ label, children }: TaskbarHoverPreviewReferenceStageProps) {
  return (
    <div className="sb-stage-outer sb-stage-outer--preview">
      <div className="sb-stage-label">{label}</div>
      {/* Desktop backdrop with taskbar hint — decorative bounded exception */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          width: 720,
          height: 400,
          background: "linear-gradient(135deg, #1e90ff 0%, #87ceeb 50%, #4fc3f7 100%)",
          borderRadius: 12,
          paddingBottom: 60,
        }}
      >
        {children}
        {/* Simulated taskbar strip */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 48,
            background: "rgba(0,0,0,0.7)",
            borderRadius: "0 0 12px 12px",
          }}
        />
      </div>
    </div>
  );
}

export default TaskbarHoverPreviewReferenceStage;
