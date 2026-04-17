import type { Meta, StoryObj } from "@storybook/react";

import { MutualExclusionHarness } from "./taskbarBehaviorHarnesses";

const meta = {
  title: "Interactive/Taskbar/MutualExclusion",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * ConsumerOwnedWinnerRule
 *
 * Demonstrates consumer-owned mutual exclusion via hover.dismiss() + context.close()
 * choreography. Neither hook knows about the other — all coordination is host-owned.
 *
 * Position/dismiss/motion fidelity (no overrides):
 *   - Both surfaces use motionPreference: 'auto' — full opening/closing phase
 *     transitions are observable.
 *   - Hover surface anchor: trigger-centered via getBoundingClientRect() (NOT left:50%).
 *   - Context surface anchor: trigger-centered via calculateTaskbarPlacement.
 *
 * Winner rules (host-owned, hook-agnostic):
 *
 *   Context winner (right-click):
 *     hover.dismiss() is called before contextPanel.open(). This:
 *       1. Cancels any pending hover open/close timer.
 *       2. Activates the pointer-reset gate — hover cannot reopen even if the
 *          pointer is still resting over the trigger (resting pointer no-op).
 *       3. Transitions hover to closing phase (or immediate close if reduced motion).
 *     Then contextPanel.open() computes placement and opens the context menu.
 *
 *   Hover winner (hover while context open):
 *     useEffect tracks hoverPreview.isOpen with prevHoverIsOpenRef. On false→true
 *     edge only, contextPanelRef.current.close() is called. This ensures that
 *     hover re-entering while context is already open will close the context,
 *     but dismiss() itself (which sets isOpen false) does not re-trigger the rule.
 *
 *   Resting pointer no-op:
 *     After context opens and hover is dismissed, the pointer resting over the
 *     trigger does NOT reopen hover. Only a fresh pointerleave → pointerenter
 *     sequence resets the gate and allows hover to reopen.
 */
export const ConsumerOwnedWinnerRule: Story = {
  name: "Consumer-owned winner rule (position/dismiss/motion fidelity)",
  render: () => <MutualExclusionHarness />,
};
