import type { ReactNode } from "react";

type FoundationRegistrationStageProps = {
  marker: string;
  label: string;
  children: ReactNode;
};

/**
 * FoundationRegistrationStage
 *
 * Leaf-level Storybook stage wrapper. Provides a bright taskbar rail context
 * using the shared Taskbar shell tokens (taskbar-glass, --taskbar-height,
 * --taskbar-foreground-muted) so that individual leaf components are displayed
 * against the same glass surface used in the real taskbar.
 *
 * Each leaf is rendered inside a mini rail slot with a bright desktop backdrop
 * above it, matching the look in reference captures.
 */
function FoundationRegistrationStage({ marker, label, children }: FoundationRegistrationStageProps) {
  return (
    <div
      data-marker={marker}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: 120,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "var(--taskbar-foreground-muted)",
          fontFamily: "monospace",
          padding: "4px 0",
        }}
      >
        {label}
      </div>
      {/* Bright desktop backdrop */}
      <div
        style={{
          width: "100%",
          height: 60,
          background: "linear-gradient(135deg, #1e90ff 0%, #87ceeb 50%, #4fc3f7 100%)",
          borderRadius: "8px 8px 0 0",
        }}
      />
      {/* Taskbar glass rail slot — uses shared shell tokens */}
      <div
        className="taskbar-glass"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "var(--taskbar-height)",
          borderRadius: "0 0 8px 8px",
          padding: "0 8px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default FoundationRegistrationStage;
