'use client'

/**
 * useTaskbarSurfaceController
 *
 * Internal primitive for taskbar attached surface lifecycle.
 *
 * Responsibilities (shared between hover preview and context panel):
 *   - Accepts explicit ref inputs at open(): triggerRef, taskbarRootRef
 *   - Owns an internally-managed callback ref (surfaceRef) for the surface root element.
 *     When the host assigns ref={surfaceRef}, the primitive stores the element and
 *     automatically re-measures placement if a pending measurement is queued (i.e.
 *     phase is 'opening' and surface was not yet mounted at open() time).
 *   - Measures placement from actual DOM rects at open time (trigger + taskbar root + surface)
 *   - Re-measures placement automatically when surface mounts (callback ref fires with element)
 *     so that the first open always uses the actual measured surface rect.
 *   - Manages opening/open/closing phase lifecycle:
 *       opening → open:       after root enter animationend (onEnterComplete called by leaf)
 *       open    → closing:    on close() request
 *       closing → [finalize]: after root exit animationend (onExitComplete called by leaf)
 *         or immediately on reduced motion
 *   - Reduced motion: opening phase is skipped (open immediately), closing phase skipped (finalize immediately)
 *   - Latest intent wins: new open/close cancels any in-progress stale transition
 *   - Missing triggerRef/taskbarRootRef at open(): console.warn + no-op
 *   - Session guard: document dismiss listeners active only while surface is open
 *   - Stale enter/exit completion is ignored after a reopen (latest intent wins)
 *   - Unmount: when callback ref fires with null, clears stored element but does NOT auto-close
 *
 * opening→open gate (no immediate phase overwrite):
 *   open() sets isOpen=true and phase='opening'. The phase stays at 'opening'
 *   until onEnterComplete() is called by the leaf after the root enter animationend.
 *   This means setPhase('opening') and setPhase('open') are NEVER called in the
 *   same synchronous call stack (except in reduced motion where 'opening' is skipped).
 *
 * Placement measurement gate:
 *   open() measures placement with zero-size surfaceRect when the surface is not yet
 *   mounted. The callback ref fires after the surface mounts and automatically
 *   re-measures with the real DOMRect. Since the surface is invisible during
 *   'opening' phase (opacity 0 → 1 enter animation), the initial zero-size
 *   placement is corrected before the surface becomes opaque.
 *
 * Does NOT own:
 *   - Sibling arbitration (winner/loser between hover and context)
 *   - Pointer-reset gate (hover-specific; owned by useHoverIntent)
 *   - Focus restore (context-specific; owned by useTaskbarContextPanel)
 *   - Hover timing (openDelayMs/closeDelayMs; owned by useHoverIntent)
 */

import { useState, useCallback, useRef, useEffect, type RefObject } from 'react'
import type { SurfacePhase } from '../../../../components/panels/taskbarAttachedSurface/shared'
import { calculateTaskbarPlacement } from '../useTaskbarPlacement'
import type { MotionPreference } from '../useReducedMotion'
import { useReducedMotion } from '../useReducedMotion'

export type { MotionPreference }

export interface TaskbarSurfaceControllerOptions {
  /** Motion preference override. Default: 'auto'. */
  motionPreference?: MotionPreference
  /**
   * Called when finalize completes (after exit animation or immediately on
   * reduced motion close). Use for focus restore or consumer-level cleanup.
   */
  onFinalize?: () => void
}

export interface TaskbarSurfaceControllerResult {
  phase: SurfacePhase
  isOpen: boolean
  placement: { x: number; y: number }
  /**
   * Callback ref for the surface root element.
   * Wire this to the surface root: <div ref={surfaceRef} ...>
   *
   * When the element mounts (callback fires with a non-null element), the
   * primitive automatically stores it and — if a pending measurement is queued
   * from a recent open() call — re-measures placement using the real DOMRect.
   *
   * When the element unmounts (callback fires with null), the primitive clears
   * the stored element but does NOT automatically close.
   */
  surfaceRef: (el: HTMLElement | null) => void
  /** Open the surface. Sets phase='opening'; opening→open transition requires onEnterComplete. */
  open: (
    triggerRef: RefObject<HTMLElement | null>,
    taskbarRootRef: RefObject<HTMLElement | null>
  ) => void
  /** Begin close sequence (or finalize immediately on reduced motion). */
  close: () => void
  /**
   * Wire to the leaf surface's onEnterComplete prop.
   * Confirms the opening→open transition after the root enter animation completes.
   * Same mounted root contract: the root that owns the enter animation class fires this.
   * Stale calls (from a prior session or when not in opening phase) are no-op.
   */
  onEnterComplete: () => void
  /**
   * Wire to the leaf surface's onExitComplete prop.
   * Finalizes the surface after the exit animation completes.
   * Same mounted root contract: the root that owns the exit animation class fires this.
   * Stale calls (after a reopen) are no-op.
   */
  onExitComplete: () => void
}

export function useTaskbarSurfaceController(
  options: TaskbarSurfaceControllerOptions = {}
): TaskbarSurfaceControllerResult {
  const { motionPreference = 'auto', onFinalize } = options

  const isReducedMotion = useReducedMotion(motionPreference)

  const [isOpen, setIsOpen] = useState(false)
  const [phase, setPhase] = useState<SurfacePhase>('opening')
  const [placement, setPlacement] = useState({ x: 0, y: 0 })

  // Track isOpen in a ref so document-level listeners read the latest value
  const isOpenRef = useRef(false)
  isOpenRef.current = isOpen

  // Track closing-in-progress to prevent duplicate close requests
  const isClosingRef = useRef(false)

  // Surface root element — stored by the callback ref
  const surfaceElRef = useRef<HTMLElement | null>(null)

  // Store the last trigger and taskbarRoot refs used in open() so the callback
  // ref can re-measure when the surface mounts after open().
  const lastTriggerRefRef = useRef<RefObject<HTMLElement | null> | null>(null)
  const lastTaskbarRootRefRef = useRef<RefObject<HTMLElement | null> | null>(null)

  // Flag: set to true when open() was called but surface was not yet mounted.
  // Cleared when the callback ref fires with the element and re-measures.
  const pendingMeasureRef = useRef(false)

  // onFinalize ref — keeps the latest callback without recreating close/open
  const onFinalizeRef = useRef(onFinalize)
  onFinalizeRef.current = onFinalize

  // AbortController for document-level dismiss listeners — one per open session
  const dismissAbortRef = useRef<AbortController | null>(null)

  // ── Cleanup document-level listeners ──

  const cancelDismissListeners = useCallback(() => {
    dismissAbortRef.current?.abort()
    dismissAbortRef.current = null
  }, [])

  // ── Finalize ──

  const finalize = useCallback(() => {
    isClosingRef.current = false
    setIsOpen(false)
    setPhase('opening')
    onFinalizeRef.current?.()
  }, [])

  // ── Close ──

  const close = useCallback(() => {
    if (!isOpenRef.current) return
    if (isClosingRef.current) return

    isClosingRef.current = true
    cancelDismissListeners()

    if (isReducedMotion) {
      finalize()
    } else {
      setPhase('closing')
    }
  }, [isReducedMotion, cancelDismissListeners, finalize])

  // ── onEnterComplete — called by leaf after root enter animationend ──
  // Same mounted root contract: the root that owns the enter motion class fires this.
  // Confirms opening→open transition.

  const onEnterComplete = useCallback(() => {
    // Only confirm opening→open if:
    //   - surface is still open (not being finalized)
    //   - not in a closing session (user closed during enter animation)
    //   - phase is still 'opening' (not already advanced)
    if (!isOpenRef.current) return
    if (isClosingRef.current) return
    setPhase((prev) => (prev === 'opening' ? 'open' : prev))
  }, [])

  // ── onExitComplete — called by leaf after root exit animationend ──

  const onExitComplete = useCallback(() => {
    // Only finalize if we are still in the closing session that started this exit.
    // If open() was called since close() (new session), this is a stale event.
    if (!isClosingRef.current) return
    finalize()
  }, [finalize])

  // ── Install document-level dismiss listeners ──

  const installDismissListeners = useCallback(
    (
      triggerRef: RefObject<HTMLElement | null>,
      taskbarRootRef: RefObject<HTMLElement | null>
    ) => {
      cancelDismissListeners()
      const ctrl = new AbortController()
      dismissAbortRef.current = ctrl
      const { signal } = ctrl

      // Escape — focus-agnostic: always fires while surface is open
      document.addEventListener(
        'keydown',
        (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            close()
          }
        },
        { signal }
      )

      // Outside pointerdown — composedPath() whitelist
      document.addEventListener(
        'pointerdown',
        (e: PointerEvent) => {
          const path = e.composedPath()
          const triggerEl = triggerRef.current
          const taskbarEl = taskbarRootRef.current
          const surfaceEl = surfaceElRef.current
          const isInside =
            (triggerEl !== null && path.includes(triggerEl)) ||
            (taskbarEl !== null && path.includes(taskbarEl)) ||
            (surfaceEl !== null && path.includes(surfaceEl))
          if (!isInside) {
            close()
          }
        },
        { signal }
      )
    },
    [cancelDismissListeners, close]
  )

  // ── Re-measure helper ──

  const remeasurePlacement = useCallback(
    (
      triggerRef: RefObject<HTMLElement | null>,
      taskbarRootRef: RefObject<HTMLElement | null>,
      surfaceEl: HTMLElement
    ) => {
      const triggerEl = triggerRef.current
      const taskbarRootEl = taskbarRootRef.current

      if (!triggerEl || !taskbarRootEl) return

      const triggerRect = triggerEl.getBoundingClientRect()
      const taskbarRootRect = taskbarRootEl.getBoundingClientRect()
      const surfaceRect = surfaceEl.getBoundingClientRect()
      const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1280

      const computed = calculateTaskbarPlacement({
        triggerRect,
        surfaceRect,
        taskbarRootRect,
        viewportWidth,
      })

      setPlacement(computed)
    },
    []
  )

  // ── Callback ref for surface root element ──

  const surfaceRef = useCallback(
    (el: HTMLElement | null) => {
      surfaceElRef.current = el

      if (el !== null) {
        // Surface has mounted. If open() was called before the element existed,
        // re-measure now with the real DOMRect. The surface is in 'opening' phase
        // (opacity 0 → 1 enter animation), so this corrects placement before
        // the surface becomes opaque.
        if (pendingMeasureRef.current) {
          pendingMeasureRef.current = false
          const triggerRef = lastTriggerRefRef.current
          const taskbarRootRef = lastTaskbarRootRefRef.current
          if (triggerRef && taskbarRootRef) {
            remeasurePlacement(triggerRef, taskbarRootRef, el)
          }
        }
      }
      // When el === null: element unmounted. Clear the stored ref but do NOT auto-close.
    },
    [remeasurePlacement]
  )

  // ── Open ──

  const open = useCallback(
    (
      triggerRef: RefObject<HTMLElement | null>,
      taskbarRootRef: RefObject<HTMLElement | null>
    ) => {
      const triggerEl = triggerRef.current
      const taskbarRootEl = taskbarRootRef.current

      // Validate required refs — only triggerRef and taskbarRootRef are required at open() time
      if (!triggerEl) {
        console.warn(
          '[useTaskbarSurfaceController] open: triggerRef.current is null — no-op'
        )
        return
      }
      if (!taskbarRootEl) {
        console.warn(
          '[useTaskbarSurfaceController] open: taskbarRootRef.current is null — no-op'
        )
        return
      }

      // Measure rects
      const triggerRect = triggerEl.getBoundingClientRect()
      const taskbarRootRect = taskbarRootEl.getBoundingClientRect()

      // Surface rect: use measured rect if already mounted, otherwise zero-size placeholder.
      // When the surface is not yet mounted (first open), placement will be
      // re-measured automatically when the callback ref fires with the element.
      // The surface is in 'opening' phase (opacity 0→1) so the initial zero-size
      // placement is corrected before the surface becomes opaque.
      const surfaceEl = surfaceElRef.current
      const surfaceRect = surfaceEl
        ? surfaceEl.getBoundingClientRect()
        : ({ left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => ({}) } as DOMRect)

      const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1280

      const computed = calculateTaskbarPlacement({
        triggerRect,
        surfaceRect,
        taskbarRootRect,
        viewportWidth,
      })

      // Store refs for deferred re-measure when surface mounts
      lastTriggerRefRef.current = triggerRef
      lastTaskbarRootRefRef.current = taskbarRootRef

      // If surface is not yet mounted, queue a pending measurement
      pendingMeasureRef.current = surfaceEl === null

      // Latest intent wins: cancel stale close
      cancelDismissListeners()
      isClosingRef.current = false

      setPlacement(computed)
      setIsOpen(true)

      if (isReducedMotion) {
        // Reduced motion: skip opening phase, go directly to open
        setPhase('open')
      } else {
        // Full motion: start at opening phase.
        // opening→open transition requires onEnterComplete() to be called by the leaf
        // after root enter animationend (same mounted root contract).
        // setPhase('open') is NOT called here — no immediate phase overwrite.
        setPhase('opening')
      }

      installDismissListeners(triggerRef, taskbarRootRef)
    },
    [isReducedMotion, cancelDismissListeners, installDismissListeners]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelDismissListeners()
    }
  }, [cancelDismissListeners])

  return {
    phase,
    isOpen,
    placement,
    surfaceRef,
    open,
    close,
    onEnterComplete,
    onExitComplete,
  }
}
