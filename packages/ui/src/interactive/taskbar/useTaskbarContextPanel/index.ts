'use client'

/**
 * useTaskbarContextPanel
 *
 * Taskbar-specific hook for context panel open/close orchestration.
 *
 * Runtime responsibilities:
 *   - Wires onto useTaskbarSurfaceController for placement·phase·dismiss lifecycle
 *   - explicit taskbarRootRef required: missing ref → warn + no-op on open
 *   - Global dismiss: document-level Escape keydown + outside pointerdown
 *     (taskbarRoot included in whitelist via controller)
 *   - Focus restore: triggerRef.current.focus() on close completion (onFinalize)
 *   - Mounted surface root registration: surfaceProps.ref (callback ref from controller)
 *   - Observable phase lifecycle: "opening" → "open" → "closing" → finalize
 *   - Duplicate close requests are no-op (controller-enforced)
 *   - "closing" phase is maintained until onExitComplete fires (leaf exit)
 *   - Reduced motion: skips "closing" phase, finalizes immediately
 *   - Stale onExitComplete after a reopen is a no-op (latest intent wins)
 */

import { useCallback, useRef, type RefObject } from 'react'
import type { SurfacePhase } from '../../../components/panels/taskbarAttachedSurface/shared'
import type { MotionPreference } from '../internal/useReducedMotion'
import { useTaskbarSurfaceController } from '../internal/useTaskbarSurfaceController'

export type { MotionPreference }

export interface TaskbarContextPanelHookOptions {
  motionPreference?: MotionPreference
  triggerRef: RefObject<HTMLElement | null>
  taskbarRootRef: RefObject<HTMLElement | null>
  /**
   * panelWidth/panelHeight are NOT used for placement truth.
   * Placement is measured from actual DOM rects via useTaskbarSurfaceController.
   * These fields are kept in the type for consumer backward-compatibility only.
   */
  panelWidth?: number
  panelHeight?: number
}

export interface TaskbarContextPanelHookResult {
  phase: SurfacePhase
  isOpen: boolean
  placement: { x: number; y: number }
  /**
   * Root wiring — attach to the mounted surface root element.
   * Provides:
   *   - ref: callback ref from useTaskbarSurfaceController (canonical surface wiring)
   */
  surfaceProps: { ref: (el: HTMLElement | null) => void }
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
    taskbarRootRef,
  } = options

  // Keep refs stable across renders for use in onFinalize callback
  const triggerRefRef = useRef(triggerRef)
  triggerRefRef.current = triggerRef

  const taskbarRootRefRef = useRef(taskbarRootRef)
  taskbarRootRefRef.current = taskbarRootRef

  // ── Focus restore — context-specific ──

  const onFinalize = useCallback(() => {
    triggerRefRef.current?.current?.focus()
  }, [])

  // ── Shared surface controller ──

  const controller = useTaskbarSurfaceController({
    motionPreference,
    onFinalize,
  })

  // ── Open: delegate to controller with explicit refs ──

  const open = useCallback(
    (_event: React.MouseEvent | React.KeyboardEvent) => {
      const tRef = triggerRefRef.current
      const rRef = taskbarRootRefRef.current

      if (!tRef) {
        console.warn(
          '[useTaskbarContextPanel] open: triggerRef is not provided — no-op'
        )
        return
      }
      if (!rRef) {
        console.warn(
          '[useTaskbarContextPanel] open: taskbarRootRef is not provided — no-op'
        )
        return
      }

      controller.open(tRef, rRef)
    },
    [controller]
  )

  const surfaceProps = {
    ref: controller.surfaceRef,
  }

  return {
    phase: controller.phase,
    isOpen: controller.isOpen,
    placement: controller.placement,
    surfaceProps,
    open,
    close: controller.close,
    onExitComplete: controller.onExitComplete,
  }
}
