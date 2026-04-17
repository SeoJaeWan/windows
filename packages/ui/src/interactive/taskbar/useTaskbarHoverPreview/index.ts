'use client'

/**
 * useTaskbarHoverPreview
 *
 * Taskbar-specific hook for managing hover preview surface lifecycle.
 *
 * - Uses useHoverIntent for pointer-based open/close timing
 * - Uses useReducedMotion to short-circuit exit animation when needed
 * - Global dismiss: document-level Escape keydown + outside pointerdown
 *   (active only while the surface is open; cleaned up on finalize)
 * - Mounted surface root registration: getSurfaceProps() returned root wiring (ref)
 * - After dismiss, a fresh leave → enter sequence is required before reopen
 * - opening/closing lifecycle is observable via phase
 * - Hover placement remains host-owned; no generic placement API is exposed
 */

import { useState, useCallback, useRef, useEffect, type MutableRefObject } from 'react'
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
  /**
   * Optional ref to the trigger element.
   * When provided, used for the outside-click whitelist.
   */
  triggerRef?: MutableRefObject<HTMLElement | null>
}

export interface TaskbarHoverPreviewHookResult {
  phase: SurfacePhase
  isOpen: boolean
  getTriggerProps: () => React.HTMLAttributes<HTMLElement>
  /**
   * getSurfaceProps()
   *
   * Returns props for the mounted surface root element.
   * Includes:
   *   - onPointerEnter / onPointerLeave for hover intent wiring
   *   - ref: canonical path for mounted surface root registration (whitelist)
   */
  getSurfaceProps: () => React.HTMLAttributes<HTMLElement> & { ref: MutableRefObject<HTMLElement | null> }
  onExitComplete: () => void
  /**
   * dismiss()
   *
   * Imperatively closes the hover preview and activates the pointer-reset gate.
   * After calling dismiss(), the hover will not reopen even if the pointer is
   * still resting over the trigger — a fresh pointerleave → pointerenter
   * sequence is required.
   *
   * Also installs global dismiss listeners if the surface is currently open.
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
    triggerRef,
  } = options

  const isReducedMotion = useReducedMotion(motionPreference)

  // "open" means rendered; phase controls animation lifecycle
  const [isOpen, setIsOpen] = useState(false)
  const isOpenRef = useRef(false)
  isOpenRef.current = isOpen
  const [phase, setPhase] = useState<SurfacePhase>('opening')

  // Mounted surface root — canonical registration via getSurfaceProps().ref
  const surfaceRootRef = useRef<HTMLElement | null>(null)

  // AbortController for document-level listeners — one per open session
  const dismissAbortRef = useRef<AbortController | null>(null)

  // ── Cleanup document-level listeners ──

  const cancelDismissListeners = useCallback(() => {
    dismissAbortRef.current?.abort()
    dismissAbortRef.current = null
  }, [])

  // ── Finalize (used by hoverIntent close path and dismiss) ──

  const handleClose = useCallback(() => {
    if (!isOpenRef.current) return
    cancelDismissListeners()
    if (isReducedMotion) {
      // Skip closing phase — finalize immediately via microtask
      setIsOpen(false)
    } else {
      setPhase('closing')
    }
  }, [isReducedMotion, cancelDismissListeners])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    setPhase('opening')
    // Immediately transition to open (no entrance animation contract in this hook)
    // Entrance animation is handled by the leaf component via data-phase
    setPhase('open')
  }, [])

  const hoverIntent = useHoverIntent({
    openDelayMs,
    closeDelayMs,
    onOpen: handleOpen,
    onClose: handleClose,
  })

  // ── Install document-level global dismiss listeners ──

  const installDismissListeners = useCallback(() => {
    cancelDismissListeners()
    const ctrl = new AbortController()
    dismissAbortRef.current = ctrl
    const { signal } = ctrl

    // Escape — focus-agnostic: always fires while surface is open
    document.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          hoverIntent.dismiss()
        }
      },
      { signal }
    )

    // Outside pointerdown — composedPath() whitelist
    document.addEventListener(
      'pointerdown',
      (e: PointerEvent) => {
        const path = e.composedPath()
        const triggerEl = triggerRef?.current ?? null
        const surfaceEl = surfaceRootRef.current
        const isInside =
          (triggerEl !== null && path.includes(triggerEl)) ||
          (surfaceEl !== null && path.includes(surfaceEl))
        if (!isInside) {
          hoverIntent.dismiss()
        }
      },
      { signal }
    )
  }, [cancelDismissListeners, hoverIntent, triggerRef])

  // Install/cleanup dismiss listeners whenever isOpen changes
  useEffect(() => {
    if (isOpen) {
      installDismissListeners()
    } else {
      cancelDismissListeners()
    }
    return () => {
      // No-op: listeners are managed by open/close transitions
    }
  }, [isOpen, installDismissListeners, cancelDismissListeners])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelDismissListeners()
    }
  }, [cancelDismissListeners])

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
    (): React.HTMLAttributes<HTMLElement> & { ref: MutableRefObject<HTMLElement | null> } => ({
      ...hoverIntent.getSurfaceProps(),
      ref: surfaceRootRef,
    }),
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
