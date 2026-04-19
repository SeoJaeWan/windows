'use client'

/**
 * useSerialHandoffQueue
 *
 * Consumer-owned serial handoff queue for taskbar mutual exclusion.
 *
 * Deviation from live immediate handoff:
 *   Live: loser.close() and winner.open() happen in the same call stack
 *         (immediate parallel handoff via closeGroupPanels-style function).
 *   Serial: winner.open() is deferred until loser.onExitComplete fires.
 *           The loser must fully finalize before the winner mounts.
 *
 * Contract:
 *   - requestWinner(openWinner):
 *       If no loser is currently closing, calls openWinner() immediately.
 *       If a loser is closing, queues openWinner(). Latest intent wins —
 *       a new requestWinner replaces any previously queued winner.
 *   - notifyLoserFinalized():
 *       Must be called by the host after the loser's onExitComplete fires.
 *       If a winner is queued, releases it by calling the queued openWinner().
 *       Stale calls (no pending winner) are no-op.
 *   - cancelWinner():
 *       Cancels any queued winner. Use when dismiss is called after a winner
 *       was queued (dismiss-cancels-queued-winner contract).
 *
 * No-op / invalid rules:
 *   - Stale notifyLoserFinalized after cancelWinner is no-op.
 *   - cancelWinner with no queued winner is no-op.
 *   - requestWinner while no loser is closing calls openWinner immediately.
 *
 * Does NOT own:
 *   - The loser's close sequence (consumer calls loser.close() or loser.dismiss())
 *   - The winner's open sequence (consumer provides openWinner callback)
 *   - Focus restore or pointer-reset gate (hook-owned)
 *   - Hook-internal sibling awareness (this is strictly consumer-side)
 */

import { useCallback, useRef } from 'react'

export interface UseSerialHandoffQueueOptions {
  /**
   * Returns true if the loser surface is still in its closing sequence
   * (i.e. isOpen is true but phase is 'closing', waiting for onExitComplete).
   * The host provides this predicate so the queue can decide whether to
   * open the winner immediately or defer.
   */
  isLoserClosing: () => boolean
}

export interface UseSerialHandoffQueueResult {
  /**
   * Request winner open.
   *
   * If isLoserClosing() returns false, calls openWinner() immediately.
   * If isLoserClosing() returns true, queues openWinner(). Latest intent wins
   * — subsequent requestWinner calls replace the previously queued winner.
   */
  requestWinner: (openWinner: () => void) => void
  /**
   * Notify queue that the loser has fully finalized (onExitComplete fired).
   *
   * If a winner is queued, releases it by calling the stored openWinner().
   * Stale calls (no queued winner) are no-op.
   */
  notifyLoserFinalized: () => void
  /**
   * Cancel any queued winner.
   *
   * Use when dismiss is called on the queued winner's surface before the loser
   * has finalized. Ensures dismiss-cancels-queued-winner contract.
   * No-op if no winner is currently queued.
   */
  cancelWinner: () => void
}

export function useSerialHandoffQueue(
  options: UseSerialHandoffQueueOptions
): UseSerialHandoffQueueResult {
  const { isLoserClosing } = options

  // Stable ref for the isLoserClosing predicate
  const isLoserClosingRef = useRef(isLoserClosing)
  isLoserClosingRef.current = isLoserClosing

  // Queued winner callback. null when no winner is pending.
  // Latest intent wins: new requestWinner replaces old.
  const pendingWinnerRef = useRef<(() => void) | null>(null)

  const requestWinner = useCallback((openWinner: () => void) => {
    if (!isLoserClosingRef.current()) {
      // No loser closing — open winner immediately (no serial wait needed)
      pendingWinnerRef.current = null
      openWinner()
    } else {
      // Loser is still closing — queue winner. Latest intent wins.
      pendingWinnerRef.current = openWinner
    }
  }, [])

  const notifyLoserFinalized = useCallback(() => {
    const pending = pendingWinnerRef.current
    if (pending === null) return
    // Clear before calling to prevent any re-entrant trigger
    pendingWinnerRef.current = null
    pending()
  }, [])

  const cancelWinner = useCallback(() => {
    pendingWinnerRef.current = null
  }, [])

  return {
    requestWinner,
    notifyLoserFinalized,
    cancelWinner,
  }
}
