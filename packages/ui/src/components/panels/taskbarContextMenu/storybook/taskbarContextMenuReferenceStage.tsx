import type { ReactNode } from "react";

type TaskbarContextMenuReferenceStageProps = {
  label: string;
  children: ReactNode;
};

function TaskbarContextMenuReferenceStage({ label, children }: TaskbarContextMenuReferenceStageProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "500px",
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
      {/* Desktop backdrop with taskbar hint */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          width: 400,
          height: 500,
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

export default TaskbarContextMenuReferenceStage;
