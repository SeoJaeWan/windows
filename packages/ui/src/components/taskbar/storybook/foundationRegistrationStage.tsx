import type { ReactNode } from "react";

type FoundationRegistrationStageProps = {
  marker: string;
  label: string;
  children: ReactNode;
};

/**
 * FoundationRegistrationStage
 *
 * Canonical leaf-level Storybook stage wrapper. Provides a bright taskbar rail
 * context using the shared Taskbar shell tokens (taskbar-glass, --taskbar-height,
 * --taskbar-foreground-muted) so that individual leaf components are displayed
 * against the same glass surface used in the real taskbar.
 *
 * The desktop backdrop height is derived from --taskbar-height so the stage
 * scales with the token system rather than depending on a fixed canvas size.
 * The taskbar rail slot uses the shared taskbar-glass utility exclusively.
 */
function FoundationRegistrationStage({ marker, label, children }: FoundationRegistrationStageProps) {
  return (
    <div
      data-marker={marker}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: "8em",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "var(--taskbar-foreground-muted)",
          fontFamily: "monospace",
          padding: "0.25em 0",
        }}
      >
        {label}
      </div>
      {/* Bright desktop backdrop — decorative storybook context only.
          Height is token-relative so the stage scales with --taskbar-height. */}
      <div
        style={{
          width: "100%",
          height: "calc(var(--taskbar-height) * 1.5)",
          background: "linear-gradient(135deg, #1e90ff 0%, #87ceeb 50%, #4fc3f7 100%)",
          borderRadius: "8px 8px 0 0",
        }}
      />
      {/* Taskbar glass rail slot — uses shared shell tokens only */}
      <div
        className="taskbar-glass"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "var(--taskbar-height)",
          borderRadius: "0 0 8px 8px",
          padding: "0 0.5em",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default FoundationRegistrationStage;
