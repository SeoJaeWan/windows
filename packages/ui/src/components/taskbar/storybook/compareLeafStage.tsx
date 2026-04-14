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
 * The glass rail div mirrors the real Taskbar component's classes exactly
 * (`taskbar-glass`, layout utilities, `--taskbar-height` token) so the
 * leaf renders in the same context as production — nothing more, nothing less.
 */
function CompareLeafStage({ kind, state, children }: CompareLeafStageProps) {
  return (
    <CompareRoot kind={kind} state={state}>
      <div className="taskbar-glass h-taskbar flex items-center gap-1 px-2 rounded-xl">
        {children}
      </div>
    </CompareRoot>
  );
}

export default CompareLeafStage;
