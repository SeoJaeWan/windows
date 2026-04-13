import type { ReactNode } from "react";

import CompareRoot from "./compareRoot";
import type { VisualKind } from "./compareRoot";

type CompareLeafStageProps = {
  /** Kebab-case surface name from the allowed inventory. */
  kind: VisualKind;
  /** Kebab-case state meaning (e.g. "default", "active"). */
  state: string;
  children: ReactNode;
};

/**
 * CompareLeafStage
 *
 * Minimal leaf-level compare wrapper for visual capture. Places the leaf
 * component inside a taskbar glass rail slot with just enough context
 * to render correctly, then wraps the whole thing in a CompareRoot.
 *
 * Unlike FoundationRegistrationStage, this helper omits:
 * - Labels
 * - Desktop backdrop (linear-gradient)
 * - Extra padding frames
 *
 * The glass rail context uses the same `taskbar-glass` utility and
 * `--taskbar-height` token as the real taskbar shell.
 */
function CompareLeafStage({ kind, state, children }: CompareLeafStageProps) {
  return (
    <CompareRoot kind={kind} state={state}>
      <div
        className="taskbar-glass"
        style={{
          display: "flex",
          alignItems: "center",
          height: "var(--taskbar-height)",
          padding: "0 0.5em",
        }}
      >
        {children}
      </div>
    </CompareRoot>
  );
}

export default CompareLeafStage;
