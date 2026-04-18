'use client'

/**
 * useTaskbarHoverPreview
 *
 * Taskbar-specific hook for managing hover preview surface lifecycle.
 *
 * - Uses useHoverIntent for pointer-based open/close timing
 * - Uses useTaskbarSurfaceController for shared placement·phase·dismiss lifecycle
 * - explicit taskbarRootRef required: missing ref → warn + no-op on open
 * - Global dismiss: document-level Escape keydown + outside pointerdown
 *   (document whitelist; includes triggerRef and taskbarRootRef)
 * - Mounted surface root registration: surfaceRef callback ref (from controller)
 * - After dismiss, a fresh leave → enter sequence is required before reopen
 *   (pointer-reset gate owned by useHoverIntent)
 * - opening/closing lifecycle is observable via phase
 * - NO focus restore on close (hover-specific; context owns focus restore)
 */

import { useCallback, useRef, type RefObject } from 'react'
import type { SurfacePhase } from '../../../components/panels/taskbarAttachedSurface/shared'
import type { MotionPreference } from '../internal/useReducedMotion'
import { useHoverIntent } from '../internal/useHoverIntent'
import { useTaskbarSurfaceController } from '../internal/useTaskbarSurfaceController'

export type { MotionPreference }

export interface TaskbarHoverPreviewHookOptions {
  /** Delay before opening after pointer enters (default: 1000ms) */
  openDelayMs?: number
  /** Delay before closing after pointer leaves (default: 500ms) */
  closeDelayMs?: number
  /** Motion preference override (default: 'auto') */
  motionPreference?: MotionPreference
  /**
   * Ref to the trigger element. Used for outside-click whitelist and as the
   * triggerRef passed to useTaskbarSurfaceController.open().
   * Missing ref → open is a warn + no-op.
   */
  triggerRef?: RefObject<HTMLElement | null>
  /**
   * Ref to the taskbar root element. Required for measured placement and
   * the outside-click whitelist. Missing ref → open is a warn + no-op.
   */
  taskbarRootRef?: RefObject<HTMLElement | null>
}

export interface TaskbarHoverPreviewHookResult {
  phase: SurfacePhase
  isOpen: boolean
  placement: { x: number; y: number }
  getTriggerProps: () => React.HTMLAttributes<HTMLElement>
  /**
   * getSurfaceProps()
   *
   * Returns props for the mounted surface root element.
   * Includes:
   *   - onPointerEnter / onPointerLeave for hover intent wiring
   *   - ref: callback ref from useTaskbarSurfaceController (canonical surface wiring)
   */
  getSurfaceProps: () => React.HTMLAttributes<HTMLElement> & { ref: (el: HTMLElement | null) => void }
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
    triggerRef,
    taskbarRootRef,
  } = options

  // Keep triggerRef and taskbarRootRef in refs to avoid stale closures
  const triggerRefRef = useRef(triggerRef)
  triggerRefRef.current = triggerRef

  const taskbarRootRefRef = useRef(taskbarRootRef)
  taskbarRootRefRef.current = taskbarRootRef

  // ── Shared surface controller ──

  const controller = useTaskbarSurfaceController({
    motionPreference,
    // No onFinalize: hover does NOT restore focus
  })

  // ── Open: delegate to controller with explicit refs ──

  const handleOpen = useCallback(() => {
    const tRef = triggerRefRef.current
    const rRef = taskbarRootRefRef.current

    if (!tRef) {
      console.warn(
        '[useTaskbarHoverPreview] open: triggerRef is not provided — no-op'
      )
      return
    }
    if (!rRef) {
      console.warn(
        '[useTaskbarHoverPreview] open: taskbarRootRef is not provided — no-op'
      )
      return
    }

    controller.open(tRef, rRef)
  }, [controller])

  // ── Close: delegate to controller ──

  const handleClose = useCallback(() => {
    controller.close()
  }, [controller])

  // ── Hook up hoverIntent ──

  const hoverIntent = useHoverIntent({
    openDelayMs,
    closeDelayMs,
    onOpen: handleOpen,
    onClose: handleClose,
  })

  const getTriggerProps = useCallback(
    (): React.HTMLAttributes<HTMLElement> => hoverIntent.getTriggerProps(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hoverIntent.getTriggerProps]
  )

  const getSurfaceProps = useCallback(
    (): React.HTMLAttributes<HTMLElement> & { ref: (el: HTMLElement | null) => void } => ({
      ...hoverIntent.getSurfaceProps(),
      ref: controller.surfaceRef,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hoverIntent.getSurfaceProps, controller.surfaceRef]
  )

  /**
   * Public dismiss: delegates to hoverIntent.dismiss() which cancels timers,
   * sets the pointer-reset gate, and calls onClose (→ handleClose → controller.close()).
   * Consumer does NOT need to call onClose separately.
   */
  const dismiss = useCallback(() => {
    hoverIntent.dismiss()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverIntent.dismiss])

  return {
    phase: controller.phase,
    isOpen: controller.isOpen,
    placement: controller.placement,
    getTriggerProps,
    getSurfaceProps,
    onExitComplete: controller.onExitComplete,
    dismiss,
  }
}
