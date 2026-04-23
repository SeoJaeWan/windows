import type { ReactNode } from "react";

import CompareRoot from "../../taskbar/storybook/compareRoot";

type CompareWindowStageVariant = "desktop" | "mobile";

type CompareWindowStageProps = {
  /** Surface name — constrained to windows-family kinds. */
  kind: "folder" | "browser";
  /** Kebab-case state meaning (e.g. "live-blog", "live-search-open"). */
  state: string;
  /** Viewport variant controlling stage canvas geometry. */
  variant: CompareWindowStageVariant;
  children: ReactNode;
};

/**
 * CompareWindowStage
 *
 * Machine-capture owner for Folder / Browser compare stories.
 * Emits a stable DOM contract consumed by future visual-diff tooling:
 *
 *   <div data-window-compare-stage="{variant}" style="width: Wpx; height: Hpx;">
 *     <div data-visual-root data-visual-kind="{kind}" data-visual-state="{state}">
 *       {children}
 *     </div>
 *   </div>
 *
 * Stage wraps the CompareRoot so capture tools can select the stage by
 * `[data-window-compare-stage="desktop"]` and the compare surface by the
 * nested `[data-visual-root]` under the same element. The inventory test
 * locks both `stage` and `stage > root` together.
 *
 * Variant geometry:
 *   desktop → 1024 × 700
 *   mobile  → 375  × 680
 *
 * No decorative backdrop, no labels, no linear-gradient — capture surface only.
 */
function CompareWindowStage({
  kind,
  state,
  variant,
  children,
}: CompareWindowStageProps) {
  const geometry =
    variant === "mobile" ? { w: 375, h: 680 } : { w: 1024, h: 700 };

  return (
    <div
      data-window-compare-stage={variant}
      style={{
        width: geometry.w,
        height: geometry.h,
        display: "flex",
      }}
    >
      <CompareRoot kind={kind} state={state}>
        {children}
      </CompareRoot>
    </div>
  );
}

export type { CompareWindowStageProps, CompareWindowStageVariant };
export default CompareWindowStage;
