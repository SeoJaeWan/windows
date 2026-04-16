'use client'

/**
 * useTaskbarHoverPreview
 *
 * Taskbar-specific hook for managing hover preview surface lifecycle.
 *
 * - Uses useHoverIntent for pointer-based open/close timing
 * - Uses usePresencePhase for SurfacePhase management
 * - Uses useReducedMotion to short-circuit exit animation when needed
 * - Exposes dismiss() so consumer can imperatively close hover and lock
 *   the re-entry gate (requires fresh leave → enter to reopen).
 */

import { useState, useCallback } from 'react'
import type { SurfacePhase } from '../../../components/panels/taskbarAttachedSurface/shared'
import { useReducedMotion, type MotionPreference } from '../internal/useReducedMotion'
import { useHoverIntent } from '../internal/useHoverIntent'

export interface TaskbarHoverPreviewHookOptions {
  /** Delay before opening after pointer enters (default: 1000ms) */
  openDelayMs?: number
  /** Delay before closing after pointer leaves (default: 500ms) */
  closeDelayMs?: number
  /** Motion preference override (default: 'auto') */
  motionPreference?: MotionPreference
}

export interface TaskbarHoverPreviewHookResult {
  phase: SurfacePhase
  isOpen: boolean
  getTriggerProps: () => React.HTMLAttributes<HTMLElement>
  getSurfaceProps: () => React.HTMLAttributes<HTMLElement>
  onExitComplete: () => void
  /**
   * dismiss()
   *
   * Imperatively closes the hover preview and activates the pointer-reset gate.
   * After calling dismiss(), the hover will not reopen even if the pointer is
   * still resting over the trigger — a fresh pointerleave → pointerenter
   * sequence is required.
   *
   * Does NOT import or interact with useTaskbarContextPanel.
   * Winner-rule coordination remains consumer-owned.
   */
  dismiss: () => void
}

export function useTaskbarHoverPreview(
  options: TaskbarHoverPreviewHookOptions = {}
): TaskbarHoverPreviewHookResult {
  const {
    openDelayMs = 1000,
    closeDelayMs = 500,
    motionPreference = 'auto',
  } = options

  const isReducedMotion = useReducedMotion(motionPreference)

  // "open" means rendered; phase controls animation lifecycle
  const [isOpen, setIsOpen] = useState(false)
  const [phase, setPhase] = useState<SurfacePhase>('opening')

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    setPhase('opening')
    // Immediately transition to open (no entrance animation contract in this hook)
    // Entrance animation is handled by the leaf component via data-phase
    setPhase('open')
  }, [])

  const handleClose = useCallback(() => {
    if (isReducedMotion) {
      // Skip closing phase — finalize immediately via microtask
      setIsOpen(false)
    } else {
      setPhase('closing')
    }
  }, [isReducedMotion])

  const hoverIntent = useHoverIntent({
    openDelayMs,
    closeDelayMs,
    onOpen: handleOpen,
    onClose: handleClose,
  })

  const onExitComplete = useCallback(() => {
    setIsOpen(false)
    setPhase('opening')
  }, [])

  const getTriggerProps = useCallback(
    (): React.HTMLAttributes<HTMLElement> => hoverIntent.getTriggerProps(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hoverIntent.getTriggerProps]
  )

  const getSurfaceProps = useCallback(
    (): React.HTMLAttributes<HTMLElement> => hoverIntent.getSurfaceProps(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hoverIntent.getSurfaceProps]
  )

  /**
   * Public dismiss: delegates to hoverIntent.dismiss() which cancels timers,
   * sets the pointer-reset gate, and calls onClose (→ handleClose above).
   * Consumer does NOT need to call onClose separately.
   */
  const dismiss = useCallback(() => {
    hoverIntent.dismiss()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverIntent.dismiss])

  return {
    phase,
    isOpen,
    getTriggerProps,
    getSurfaceProps,
    onExitComplete,
    dismiss,
  }
}
