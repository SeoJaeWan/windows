import type { ReactNode } from "react";

import CompareRoot from "../../../taskbar/storybook/compareRoot";
import type { VisualKind } from "../../../taskbar/storybook/compareRoot";

type ComparePanelStageProps = {
  /** Kebab-case surface name — typically "windows-panel". */
  kind: VisualKind;
  /** Kebab-case state meaning (e.g. "pinned-default", "search-results"). */
  state: string;
  children: ReactNode;
};

/**
 * ComparePanelStage
 *
 * Minimal panel-level compare wrapper for visual capture. Wraps the
 * panel shell component in a CompareRoot with just enough structure
 * for the panel to render at its natural size.
 *
 * Unlike WindowsPanelReferenceStage, this helper omits:
 * - Labels
 * - Desktop backdrop (linear-gradient)
 * - Extra padding frames
 * - Fixed canvas sizing
 */
function ComparePanelStage({ kind, state, children }: ComparePanelStageProps) {
  return (
    <CompareRoot kind={kind} state={state}>
      {children}
    </CompareRoot>
  );
}

export default ComparePanelStage;
