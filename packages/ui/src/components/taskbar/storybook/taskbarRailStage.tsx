import type { ReactNode } from "react";

/**
 * TaskbarRailStage
 *
 * Storybook stage helper that provides a bright desktop background with a
 * bottom-positioned taskbar rail slot. Consumes the shared Taskbar shell
 * tokens (taskbar-glass, --taskbar-height, --taskbar-foreground-muted)
 * so that leaf stories appear in the same rail context as the real taskbar.
 *
 * Replaces the old dark-card isolation stage for leaf-level visual comparison.
 */

type TaskbarRailStageProps = {
  /** Label displayed above the desktop area */
  label?: string;
  children: ReactNode;
};

function TaskbarRailStage({ label, children }: TaskbarRailStageProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minWidth: 480,
        maxWidth: 800,
      }}
    >
      {label && (
        <div
          style={{
            fontSize: 11,
            color: "var(--taskbar-foreground-muted)",
            fontFamily: "monospace",
            padding: "8px 12px 4px",
          }}
        >
          {label}
        </div>
      )}
      {/* Desktop area — bright background matching Windows 11 desktop */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 320,
          background: "linear-gradient(135deg, #1e90ff 0%, #87ceeb 50%, #4fc3f7 100%)",
          borderRadius: "8px 8px 0 0",
          overflow: "hidden",
        }}
      />
      {/* Taskbar rail slot — uses shared shell tokens */}
      <div
        className="taskbar-glass"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
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

export default TaskbarRailStage;
