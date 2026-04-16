'use client'

/**
 * useTaskbarHoverPreview
 *
 * Taskbar-specific hook for managing hover preview surface lifecycle.
 *
 * - Uses useHoverIntent for pointer-based open/close timing
 * - Uses usePresencePhase for SurfacePhase management
 * - Uses useReducedMotion to short-circuit exit animation when needed
 */

import { useState, useCallback } from 'react'
import type { SurfacePhase } from '../../components/panels/taskbarAttachedSurface/shared'
import { useReducedMotion, type MotionPreference } from './internal/useReducedMotion'
import { useHoverIntent } from './internal/useHoverIntent'

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

  return {
    phase,
    isOpen,
    getTriggerProps,
    getSurfaceProps,
    onExitComplete,
  }
}
