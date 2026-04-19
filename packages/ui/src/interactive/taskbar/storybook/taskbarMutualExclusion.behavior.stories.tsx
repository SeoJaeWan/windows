import type { Meta, StoryObj } from "@storybook/react";

import { MutualExclusionHarness } from "./taskbarBehaviorHarnesses";

const meta = {
  title: "Interactive/Taskbar/MutualExclusion",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * SerialHandoff
 *
 * Demonstrates consumer-owned serial handoff queue for mutual exclusion.
 *
 * Deviation from live immediate handoff:
 *   Live (closeGroupPanels-style): loser.close() and winner.open() are called
 *   in the same synchronous tick — both surfaces transition simultaneously.
 *   The winner mounts while the loser is still in its closing animation.
 *
 *   Serial handoff (this story): winner.open() is deferred via
 *   useSerialHandoffQueue until the loser's onExitComplete fires and
 *   notifyLoserFinalized() releases the queued winner. The winner does NOT
 *   mount until the loser has fully finalized.
 *
 * Winner rules (host-owned, hook-agnostic):
 *
 *   Context wins (right-click):
 *     1. hover.dismiss() — starts hover closing + pointer-reset gate.
 *     2. contextHoverQueue.requestWinner(openContext) — queues context open.
 *        If hover is already finalized, opens immediately. Otherwise waits.
 *     3. Hover's onExitComplete wrapper calls notifyLoserFinalized, releasing
 *        the queued context open (actual-open-time measurement).
 *
 *   Hover wins (hover opens while context is open):
 *     1. context.close() — starts context closing.
 *     2. Hover surface render gate (hoverPreview.isOpen && !contextPanel.isOpen)
 *        prevents hover surface from mounting until context.isOpen is false.
 *     3. Context's onExitComplete wrapper calls notifyLoserFinalized on
 *        hoverContextQueue. The hover surface appears after context finalizes.
 *
 *   Latest intent wins:
 *     A new requestWinner call replaces any previously queued winner.
 *     Only the last requested winner opens after loser finalize.
 *
 *   Dismiss-cancels-queued-winner:
 *     If Escape or outside click dismisses the surface while a winner is queued
 *     (before the loser finalizes), cancelWinner() drops the queued open.
 *     The winner never opens — the dismiss wins.
 *
 *   Resting pointer no-op:
 *     After context opens and hover is dismissed, the pointer resting over the
 *     trigger does NOT reopen hover. Only a fresh pointerleave → pointerenter
 *     sequence resets the gate and allows hover to reopen.
 *
 * Winner placement:
 *   context.open() is called at actual winner release time (notifyLoserFinalized),
 *   NOT at the moment of right-click. Placement is measured from actual DOMRects
 *   at release time, not from a stale pre-measure snapshot captured at queue time.
 *
 * Both hooks remain separate exports. Neither hook knows about the other.
 * All coordination — queue, loser close, winner open, placement — is host-owned.
 */
export const SerialHandoff: Story = {
  name: "Serial handoff (loser finalize → winner open, latest intent wins, dismiss cancels)",
  render: () => <MutualExclusionHarness />,
};
