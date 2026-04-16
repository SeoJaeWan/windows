'use client'

/**
 * useHoverIntent
 *
 * Pointer-enter / pointer-leave based hover intent timer.
 *
 * - Calls onOpen after openDelayMs following pointer enter
 * - Calls onClose after closeDelayMs following pointer leave
 * - Entering cancels pending close; leaving cancels pending open
 *
 * Returns getTriggerProps() and getSurfaceProps() for easy wiring.
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
}

export function useHoverIntent(options: UseHoverIntentOptions): UseHoverIntentResult {
  const { openDelayMs = 1000, closeDelayMs = 500, onOpen, onClose } = options

  const onOpenRef = useRef(onOpen)
  const onCloseRef = useRef(onClose)
  onOpenRef.current = onOpen
  onCloseRef.current = onClose

  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    // Cancel any pending close
    cancelCloseTimer()
    // Schedule open
    openTimerRef.current = setTimeout(() => {
      openTimerRef.current = null
      onOpenRef.current()
    }, openDelayMs)
  }, [cancelCloseTimer, openDelayMs])

  const handleLeave = useCallback(() => {
    // Cancel any pending open
    cancelOpenTimer()
    // Schedule close
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null
      onCloseRef.current()
    }, closeDelayMs)
  }, [cancelOpenTimer, closeDelayMs])

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

  return { getTriggerProps, getSurfaceProps }
}
