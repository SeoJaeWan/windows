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
      className="sb-foundation-col"
    >
      <div className="sb-foundation-label">
        {label}
      </div>
      {/* Bright desktop backdrop — decorative storybook context only.
          Height is token-relative so the stage scales with --taskbar-height. */}
      <div className="sb-foundation-backdrop" />
      {/* Taskbar glass rail slot — uses shared shell tokens only */}
      <div className="taskbar-glass sb-foundation-rail">
        {children}
      </div>
    </div>
  );
}

export default FoundationRegistrationStage;
