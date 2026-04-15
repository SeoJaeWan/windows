import type { ReactNode } from "react";

type CompareContextPanelStageProps = {
  /** Kebab-case state meaning (e.g. "default", "iconless", "disabled"). */
  state: string;
  children: ReactNode;
};

/**
 * CompareContextPanelStage
 *
 * Minimal context-panel compare wrapper for visual capture.
 * Owns only `[data-visual-root]` — no decorative backdrop, width
 * override, host frame, or labels. The panel renders at its natural
 * 200px width inside this wrapper.
 */
function CompareContextPanelStage({ state, children }: CompareContextPanelStageProps) {
  return (
    <div
      data-visual-root=""
      data-visual-kind="context-panel"
      data-visual-state={state}
    >
      {children}
    </div>
  );
}

export default CompareContextPanelStage;
