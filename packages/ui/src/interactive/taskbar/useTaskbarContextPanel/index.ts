'use client'

/**
 * useTaskbarContextPanel
 *
 * Taskbar-specific hook for context panel open/close orchestration.
 *
 * - Captures pointer origin from open(event) for placement calculation
 * - Uses useTaskbarPlacement to compute panel position
 * - Uses usePresencePhase for SurfacePhase management
 * - Bridges Escape key from surfaceProps.onKeyDown → close()
 * - Restores focus to triggerRef.current on close
 * - Reduced motion: skips closing phase, finalizes immediately
 */

import { useState, useCallback, useRef, type RefObject } from 'react'
import type { SurfacePhase } from '../../../components/panels/taskbarAttachedSurface/shared'
import { useReducedMotion, type MotionPreference } from '../internal/useReducedMotion'
import { calculateTaskbarPlacement } from '../internal/useTaskbarPlacement'

export interface TaskbarContextPanelHookOptions {
  motionPreference?: MotionPreference
  triggerRef: RefObject<HTMLElement | null>
  panelWidth?: number
  panelHeight?: number
}

export interface TaskbarContextPanelHookResult {
  phase: SurfacePhase
  isOpen: boolean
  placement: { x: number; y: number }
  /** Root wiring — includes onKeyDown for Escape bridge */
  surfaceProps: React.HTMLAttributes<HTMLElement>
  open: (event: React.MouseEvent | React.KeyboardEvent) => void
  close: () => void
  onExitComplete: () => void
}

export function useTaskbarContextPanel(
  options: TaskbarContextPanelHookOptions
): TaskbarContextPanelHookResult {
  const {
    motionPreference = 'auto',
    triggerRef,
    panelWidth = 200,
    panelHeight = 300,
  } = options

  const isReducedMotion = useReducedMotion(motionPreference)

  const [isOpen, setIsOpen] = useState(false)
  const [phase, setPhase] = useState<SurfacePhase>('opening')
  const [placement, setPlacement] = useState({ x: 0, y: 0 })

  // Store latest triggerRef in a ref to avoid stale closure
  const triggerRefRef = useRef(triggerRef)
  triggerRefRef.current = triggerRef

  const open = useCallback(
    (event: React.MouseEvent | React.KeyboardEvent) => {
      // Capture pointer origin
      let pointerX = 0
      let pointerY = 0
      if ('clientX' in event) {
        pointerX = event.clientX
        pointerY = event.clientY
      } else {
        // Keyboard event: use trigger element bounding rect center
        const el = triggerRefRef.current.current
        if (el) {
          const rect = el.getBoundingClientRect()
          pointerX = rect.left + rect.width / 2
          pointerY = rect.top
        }
      }

      const vw = typeof window !== 'undefined' ? window.innerWidth : 1280
      const vh = typeof window !== 'undefined' ? window.innerHeight : 800

      const computed = calculateTaskbarPlacement({
        pointerX,
        pointerY,
        panelWidth,
        panelHeight,
        viewportWidth: vw,
        viewportHeight: vh,
      })

      setPlacement(computed)
      setIsOpen(true)
      setPhase('opening')
      // Immediately advance to open (entrance animation controlled by leaf)
      setPhase('open')
    },
    [panelWidth, panelHeight]
  )

  const close = useCallback(() => {
    if (isReducedMotion) {
      // Skip closing animation
      setIsOpen(false)
      setPhase('opening')
      // Restore focus
      triggerRefRef.current.current?.focus()
    } else {
      setPhase('closing')
      // Focus restore happens in onExitComplete
    }
  }, [isReducedMotion])

  const onExitComplete = useCallback(() => {
    setIsOpen(false)
    setPhase('opening')
    // Restore focus to trigger
    triggerRefRef.current.current?.focus()
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    },
    [close]
  )

  const surfaceProps: React.HTMLAttributes<HTMLElement> = {
    onKeyDown: handleKeyDown,
  }

  return {
    phase,
    isOpen,
    placement,
    surfaceProps,
    open,
    close,
    onExitComplete,
  }
}
