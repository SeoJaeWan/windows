import type { ReactNode } from "react";

type FoundationRegistrationStageProps = {
  marker: string;
  label: string;
  children: ReactNode;
};

function FoundationRegistrationStage({ marker, label, children }: FoundationRegistrationStageProps) {
  return (
    <div data-marker={marker} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: 24 }}>
      <div style={{ fontSize: 11, color: "#888", fontFamily: "monospace" }}>{label}</div>
      {children}
    </div>
  );
}

export default FoundationRegistrationStage;
