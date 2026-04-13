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
 */
function WindowsPanelReferenceStage({ label, children }: WindowsPanelReferenceStageProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "700px",
        padding: "2em",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#888",
          fontFamily: "monospace",
          padding: "0.25em 0",
          marginBottom: "1em",
        }}
      >
        {label}
      </div>
      {/* Bright desktop backdrop — decorative storybook context only */}
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          width: 500,
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
