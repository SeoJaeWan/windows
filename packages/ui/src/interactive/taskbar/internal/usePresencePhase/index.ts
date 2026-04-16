'use client'

/**
 * usePresencePhase
 *
 * Manages SurfacePhase-based presence state for taskbar attached surfaces.
 *
 * Lifecycle:
 *   mount:   "opening" → (animation completes) → "open"
 *   unmount: "closing" → (onExitComplete called) → caller unmounts
 *
 * immediate (reduced motion):
 *   close path skips "closing" phase and calls onExitComplete via
 *   microtask/setTimeout(0) so the caller can synchronously unmount.
 */

import { useState, useCallback, useRef } from 'react'
import type { SurfacePhase } from '../../../../components/panels/taskbarAttachedSurface/shared'

export interface UsePresencePhaseOptions {
  immediate?: boolean
  onExitComplete?: () => void
}

export interface UsePresencePhaseResult {
  phase: SurfacePhase
  /** Call to start the open sequence: sets phase to "opening" */
  startOpen: () => void
  /** Call when open animation is done: sets phase to "open" */
  confirmOpen: () => void
  /** Call to start the close sequence */
  startClose: () => void
  /** Should be wired to the leaf component's onExitComplete prop */
  handleExitComplete: () => void
}

export function usePresencePhase(
  options: UsePresencePhaseOptions = {}
): UsePresencePhaseResult {
  const { immediate = false, onExitComplete } = options
  const onExitCompleteRef = useRef(onExitComplete)
  onExitCompleteRef.current = onExitComplete

  const [phase, setPhase] = useState<SurfacePhase>('opening')

  const startOpen = useCallback(() => {
    setPhase('opening')
  }, [])

  const confirmOpen = useCallback(() => {
    setPhase('open')
  }, [])

  const startClose = useCallback(() => {
    if (immediate) {
      // Reduced motion: skip closing animation, finalize immediately via microtask
      setTimeout(() => {
        onExitCompleteRef.current?.()
      }, 0)
    } else {
      setPhase('closing')
    }
  }, [immediate])

  const handleExitComplete = useCallback(() => {
    onExitCompleteRef.current?.()
  }, [])

  return {
    phase,
    startOpen,
    confirmOpen,
    startClose,
    handleExitComplete,
  }
}
