import type { ReactNode } from "react";

import CompareRoot from "./compareRoot";

type CompareTaskbarStageProps = {
  /** Kebab-case state meaning (e.g. "default"). */
  state: string;
  children: ReactNode;
};

/**
 * CompareTaskbarStage
 *
 * Minimal full-taskbar compare wrapper for visual capture. Wraps the
 * full Taskbar rail composition in a CompareRoot with `kind="taskbar"`
 * and applies a fixed capture width via a scoped style tag targeting
 * the CompareRoot's own `data-visual-kind` attribute.
 *
 * This avoids injecting `className` or `style` into CompareRoot,
 * keeping the capture surface contract locked down.
 */
function CompareTaskbarStage({ state, children }: CompareTaskbarStageProps) {
  return (
    <CompareRoot kind="taskbar" state={state}>
      <style>{`[data-visual-kind="taskbar"] { width: 1024px; }`}</style>
      {children}
    </CompareRoot>
  );
}

export default CompareTaskbarStage;
