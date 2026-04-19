import type { Meta, StoryObj } from "@storybook/react";

import { MutualExclusionHarness } from "./taskbarBehaviorHarnesses";

const meta = {
  title: "Interactive/Taskbar/MutualExclusion",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * ConsumerOwnedWinnerRule — browser acceptance recipient
 *
 * Browser gate target: Interactive/Taskbar/MutualExclusion > ConsumerOwnedWinnerRule
 * Selector vocabulary (data-testid):
 *   mutual-trigger              — the shared trigger button (hover + context)
 *   mutual-hover-surface-root   — hover surface root (absent until hover isOpen && !context.isOpen)
 *   mutual-context-surface-root — context surface root (absent until context isOpen && !hover.isOpen)
 *   mutual-outside              — explicit outside-click target
 *   mutual-taskbar              — taskbar strip
 *   mutual-backdrop             — desktop backdrop container
 *
 * Browser-only acceptance checklist (cannot be closed by compare or jsdom alone):
 *
 *   MUST happen — serial handoff: context wins (right-click while hover is open):
 *   [ ] mutual-hover-surface-root is present and in 'open' phase before right-click.
 *   [ ] Right-click dispatches dismiss (hover begins closing) and queues context open.
 *   [ ] mutual-hover-surface-root enters 'closing' phase — surface stays mounted
 *       during hover exit animation. mutual-context-surface-root must NOT appear yet.
 *   [ ] After hover exit animationend fires (onExitComplete → notifyLoserFinalized),
 *       mutual-hover-surface-root disappears and mutual-context-surface-root appears.
 *       Winner open happens at actual release time, not at right-click time.
 *   [ ] Context placement is measured from actual DOMRects at winner release time
 *       (not from a stale snapshot captured at right-click time).
 *
 *   MUST happen — serial handoff: hover wins (hover opens while context is open):
 *   [ ] mutual-context-surface-root is present and in 'open' phase before hover.
 *   [ ] Pointer enters trigger → hover intent timer starts → context begins closing.
 *   [ ] mutual-context-surface-root enters 'closing' phase.
 *       mutual-hover-surface-root must NOT appear until context exit animationend fires.
 *   [ ] After context exit animationend fires (onExitComplete → notifyLoserFinalized),
 *       mutual-context-surface-root disappears and mutual-hover-surface-root appears.
 *
 *   MUST happen — latest intent wins:
 *   [ ] If multiple right-clicks arrive before the loser finalizes, only the last
 *       winner opens after finalize. Intermediate winners are silently dropped.
 *
 *   MUST happen — dismiss cancels queued winner:
 *   [ ] If Escape or outside pointerdown fires while a winner is queued (before the
 *       loser finalizes), cancelWinner() prevents the queued winner from opening.
 *       Neither surface appears after the loser finalizes.
 *
 *   MUST NOT happen:
 *   [ ] Both mutual-hover-surface-root and mutual-context-surface-root must NEVER
 *       be present in the DOM at the same time (mutual exclusion invariant).
 *   [ ] Winner surface must NOT mount while the loser surface is still in its
 *       closing animation (no simultaneous transitions).
 *   [ ] After context wins, pointer resting over trigger must NOT reopen hover.
 *       Only a fresh pointerleave → pointerenter cycle can reopen.
 *
 * Live (immediate) handoff deviation — what this story replaces in the browser:
 *   Live (closeGroupPanels-style): loser.close() and winner.open() are called in
 *   the same synchronous tick — both surfaces transition simultaneously. The winner
 *   mounts while the loser is still in its closing animation.
 *
 *   Serial handoff (this story): winner.open() is deferred via useSerialHandoffQueue
 *   until loser's onExitComplete fires and notifyLoserFinalized() releases the queued
 *   winner. The winner does NOT mount until the loser has fully finalized. This is the
 *   contract that must be verified in a real browser with actual CSS animations.
 *
 * What compare stories prove (compare is NOT a substitute for browser acceptance):
 *   Compare stories (Taskbar/Compose/HoverPreview, Taskbar/Compose/ContextMenu)
 *   prove only the visual baseline of each surface in its rested open state.
 *   They do NOT prove: serial handoff timing, simultaneous surface exclusion,
 *   latest-intent winner rule, dismiss-cancels-queued-winner, or animation boundary
 *   between loser close and winner open. These require a real browser.
 *
 * What @windows/web route proves:
 *   The web app E2E owns its own navigation and routing contract.
 *   It does NOT substitute for mutual exclusion / serial handoff verification.
 *   If later materialization cannot target this Storybook story with the existing
 *   runner, it must leave an explicit setup blocker rather than falling back to
 *   the web route or compare story.
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
export const ConsumerOwnedWinnerRule: Story = {
  name: "Serial handoff (loser finalize → winner open, latest intent wins, dismiss cancels)",
  render: () => <MutualExclusionHarness />,
};
