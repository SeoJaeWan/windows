import type { ReactNode } from "react";

type WindowsPanelReferenceStageProps = {
  label: string;
  children: ReactNode;
};

/**
 * WindowsPanelReferenceStage
 *
 * Panel-only centered canvas for Storybook. Provides a bright desktop backdrop
 * behind the panel card so reviewers see the panel in spatial context without
 * needing the full taskbar rail composition.
 *
 * Separate from foundationRegistrationStage.tsx which wraps individual taskbar
 * leaf components in a glass rail slot.
 *
 * Exception taxonomy:
 * - Outer container layout → sb-stage-outer sb-stage-outer--panel (central class)
 * - Label row → sb-stage-label (central class)
 * - Decorative canvas: fixed width/height + backdrop gradient — bounded exception
 *   (screenshot capture geometry, host-composition overlay absolute placement)
 */
function WindowsPanelReferenceStage({ label, children }: WindowsPanelReferenceStageProps) {
  return (
    <div className="sb-stage-outer sb-stage-outer--panel">
      <div className="sb-stage-label">{label}</div>
      {/* Bright desktop backdrop — decorative storybook context only.
          Fixed canvas geometry is a bounded exception: screenshot capture
          requires stable width/height, and position:relative enables
          host-composition overlay placement. */}
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          width: 820,
          height: 660,
          background: "linear-gradient(135deg, #1e90ff 0%, #87ceeb 50%, #4fc3f7 100%)",
          borderRadius: 12,
          paddingBottom: 20,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default WindowsPanelReferenceStage;
