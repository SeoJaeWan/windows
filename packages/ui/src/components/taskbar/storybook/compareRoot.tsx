import type { ReactNode } from "react";

/**
 * Allowed `data-visual-kind` values for taskbar compare surfaces.
 *
 * Each value maps to a kebab-case package surface name:
 * - taskbar-windows-button — TaskbarWindowsButton leaf
 * - taskbar-search         — TaskbarSearch leaf
 * - taskbar-icon-button    — TaskbarIconButton leaf
 * - taskbar-clock          — TaskbarClock leaf
 * - taskbar                — full Taskbar rail composition
 * - windows-panel-shell    — WindowsPanelShell card
 */
type VisualKind =
  | "taskbar-windows-button"
  | "taskbar-search"
  | "taskbar-icon-button"
  | "taskbar-clock"
  | "taskbar"
  | "windows-panel-shell";

type CompareRootProps = {
  /** Kebab-case surface name — constrained to the allowed inventory. */
  kind: VisualKind;
  /** Kebab-case state meaning (e.g. "default", "active", "pinned-default"). */
  state: string;
  /** Optional CSS class for dimension overrides (e.g. fixed capture width). */
  className?: string;
  children: ReactNode;
};

/**
 * CompareRoot
 *
 * Machine-capture wrapper for visual diff tooling. Renders a single
 * `data-visual-root` element with `data-visual-kind` and `data-visual-state`
 * metadata so external tools can locate and capture the compare surface
 * with a stable `[data-visual-root]` selector.
 *
 * This helper intentionally omits all human-review decorations:
 * no labels, no linear-gradient backdrops, no desktop canvas, no extra
 * padding frames, no consumer-injectable style overrides. It provides
 * the minimal DOM needed for visual capture only.
 *
 * For components like TaskbarSearch where the outer wrapper does not pass
 * arbitrary DOM props, this wrapper owns the compare root instead of the
 * component itself.
 */
function CompareRoot({ kind, state, className, children }: CompareRootProps) {
  return (
    <div
      data-visual-root=""
      data-visual-kind={kind}
      data-visual-state={state}
      className={className}
    >
      {children}
    </div>
  );
}

export type { VisualKind, CompareRootProps };
export default CompareRoot;
