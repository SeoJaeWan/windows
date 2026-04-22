import type { ReactNode } from "react";

import CompareRoot from "../../taskbar/storybook/compareRoot";
import type { VisualKind } from "../../taskbar/storybook/compareRoot";

/**
 * Stage attribute values for compareWindowStage.
 *
 * Exact contract — only these two values are valid:
 *   "desktop" — live/desktop states (1024x700)
 *   "mobile"  — mobile states (375x680)
 *
 * Do not invent additional values (e.g. "tablet", "wide", "live").
 * Phase 3 compare runtime reads this attribute for capture dispatch.
 */
type WindowStageAttr = "desktop" | "mobile";

type CompareWindowStageProps = {
  /** Kebab-case surface name — "folder" or "browser". */
  kind: VisualKind;
  /** Kebab-case state key (e.g. "live-blog", "mobile-article"). */
  state: string;
  /**
   * Stage geometry selector value.
   * Exact values: "desktop" (1024x700) | "mobile" (375x680).
   * The Phase 3 capture script reads [data-window-compare-stage="{stageAttr}"]
   * to resolve the capture canvas. Do not change after Phase 1.
   */
  stageAttr: WindowStageAttr;
  children: ReactNode;
};

/**
 * CompareWindowStage
 *
 * Machine-capture wrapper for windows family (Folder, Browser) visual diff tooling.
 *
 * DOM contract:
 *   [data-window-compare-stage="{stageAttr}"] — outer capture stage owner
 *   [data-visual-root]                         — inner metadata carrier (from CompareRoot)
 *   [data-visual-kind="{kind}"]
 *   [data-visual-state="{state}"]
 *
 * Capture dimensions (exact contract — do not modify after Phase 1):
 *   desktop: 1024 × 700 px
 *   mobile:  375  × 680 px
 *
 * The <style> block fixes the capture canvas width via a scoped selector so
 * CompareRoot's data-visual-root DOM contract is preserved without injecting
 * className or style onto CompareRoot itself. This is a bounded exception
 * per the Storybook convention (CompareRoot public DOM contract preservation
 * using scoped width rule).
 *
 * Phase 3 capture script: reads [data-window-compare-stage] as the capture
 * owner. Kind/state mismatch with the nested [data-visual-root] causes abort.
 * Do NOT change stage selector or geometry after Phase 1 lock.
 */
function CompareWindowStage({ kind, state, stageAttr, children }: CompareWindowStageProps) {
  const isDesktop = stageAttr === "desktop";
  const width = isDesktop ? 1024 : 375;
  const height = isDesktop ? 700 : 680;

  return (
    <div data-window-compare-stage={stageAttr}>
      <style>{`
        [data-window-compare-stage="${stageAttr}"] [data-visual-root] {
          width: ${width}px;
          height: ${height}px;
          overflow: hidden;
        }
      `}</style>
      <CompareRoot kind={kind} state={state}>
        {children}
      </CompareRoot>
    </div>
  );
}

export type { WindowStageAttr };
export default CompareWindowStage;
