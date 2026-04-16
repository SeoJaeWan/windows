'use client'

/**
 * useHoverIntent
 *
 * Pointer-enter / pointer-leave based hover intent timer.
 *
 * - Calls onOpen after openDelayMs following pointer enter
 * - Calls onClose after closeDelayMs following pointer leave
 * - Entering cancels pending close; leaving cancels pending open
 * - dismiss() cancels all pending timers and calls onClose immediately;
 *   after dismiss, a fresh leave → enter sequence is required before
 *   a new open timer can start (pointer-reset gate).
 *
 * Returns getTriggerProps(), getSurfaceProps(), and dismiss() for easy wiring.
 */

import { useRef, useCallback } from 'react'

export interface UseHoverIntentOptions {
  openDelayMs?: number
  closeDelayMs?: number
  onOpen: () => void
  onClose: () => void
}

export interface UseHoverIntentResult {
  getTriggerProps: () => React.HTMLAttributes<HTMLElement>
  getSurfaceProps: () => React.HTMLAttributes<HTMLElement>
  dismiss: () => void
}

export function useHoverIntent(options: UseHoverIntentOptions): UseHoverIntentResult {
  const { openDelayMs = 1000, closeDelayMs = 500, onOpen, onClose } = options

  const onOpenRef = useRef(onOpen)
  const onCloseRef = useRef(onClose)
  onOpenRef.current = onOpen
  onCloseRef.current = onClose

  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // pointer-reset gate: true after dismiss() until the next pointerleave clears it
  const suppressedRef = useRef(false)

  const cancelOpenTimer = useCallback(() => {
    if (openTimerRef.current !== null) {
      clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }
  }, [])

  const cancelCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const handleEnter = useCallback(() => {
    // While suppressed (post-dismiss, no fresh leave yet) ignore re-entry
    if (suppressedRef.current) return

    // Cancel any pending close
    cancelCloseTimer()
    // Schedule open
    openTimerRef.current = setTimeout(() => {
      openTimerRef.current = null
      onOpenRef.current()
    }, openDelayMs)
  }, [cancelCloseTimer, openDelayMs])

  const handleLeave = useCallback(() => {
    // A fresh leave always lifts suppression
    suppressedRef.current = false

    // Cancel any pending open
    cancelOpenTimer()
    // Schedule close
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null
      onCloseRef.current()
    }, closeDelayMs)
  }, [cancelOpenTimer, closeDelayMs])

  /**
   * dismiss()
   *
   * Immediately cancels all pending timers, calls onClose to begin the
   * closing transition, and sets the pointer-reset gate so that the next
   * open timer cannot start until the pointer has physically left and
   * re-entered the trigger.
   */
  const dismiss = useCallback(() => {
    cancelOpenTimer()
    cancelCloseTimer()
    suppressedRef.current = true
    onCloseRef.current()
  }, [cancelOpenTimer, cancelCloseTimer])

  const getTriggerProps = useCallback(
    (): React.HTMLAttributes<HTMLElement> => ({
      onPointerEnter: handleEnter,
      onPointerLeave: handleLeave,
    }),
    [handleEnter, handleLeave]
  )

  const getSurfaceProps = useCallback(
    (): React.HTMLAttributes<HTMLElement> => ({
      onPointerEnter: cancelCloseTimer,
      onPointerLeave: handleLeave,
    }),
    [cancelCloseTimer, handleLeave]
  )

  return { getTriggerProps, getSurfaceProps, dismiss }
}
