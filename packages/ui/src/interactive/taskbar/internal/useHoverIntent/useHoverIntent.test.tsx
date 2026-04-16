import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createElement, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { act } from 'react'

// @ts-expect-error global flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

import { useHoverIntent, type UseHoverIntentOptions, type UseHoverIntentResult } from '.'

/* ── Harness ─────────────────────────────────────────────────── */

function createHarness(options: UseHoverIntentOptions) {
  let result!: UseHoverIntentResult

  function Harness({ opts }: { opts: UseHoverIntentOptions }) {
    result = useHoverIntent(opts)
    return null
  }

  let root!: Root
  const container = document.createElement('div')
  document.body.appendChild(container)

  act(() => {
    root = createRoot(container)
    root.render(createElement(Harness, { opts: options }))
  })

  return {
    get result() { return result },
    rerender(opts: UseHoverIntentOptions) {
      act(() => { root.render(createElement(Harness, { opts })) })
    },
    unmount() {
      act(() => { root.unmount() })
      container.remove()
    },
  }
}

/* ── Tests ───────────────────────────────────────────────────── */

describe('useHoverIntent', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  describe('getTriggerProps', () => {
    it('returns onPointerEnter and onPointerLeave handlers', () => {
      const h = createHarness({ onOpen: vi.fn(), onClose: vi.fn() })
      const props = h.result.getTriggerProps()
      expect(typeof props.onPointerEnter).toBe('function')
      expect(typeof props.onPointerLeave).toBe('function')
      h.unmount()
    })
  })

  describe('getSurfaceProps', () => {
    it('returns onPointerEnter and onPointerLeave handlers', () => {
      const h = createHarness({ onOpen: vi.fn(), onClose: vi.fn() })
      const props = h.result.getSurfaceProps()
      expect(typeof props.onPointerEnter).toBe('function')
      expect(typeof props.onPointerLeave).toBe('function')
      h.unmount()
    })
  })

  describe('open delay', () => {
    it('does not call onOpen before openDelayMs', () => {
      const onOpen = vi.fn()
      const h = createHarness({ openDelayMs: 1000, onOpen, onClose: vi.fn() })
      act(() => { h.result.getTriggerProps().onPointerEnter?.({} as any) })
      act(() => { vi.advanceTimersByTime(999) })
      expect(onOpen).not.toHaveBeenCalled()
      h.unmount()
    })

    it('calls onOpen after openDelayMs', () => {
      const onOpen = vi.fn()
      const h = createHarness({ openDelayMs: 1000, onOpen, onClose: vi.fn() })
      act(() => { h.result.getTriggerProps().onPointerEnter?.({} as any) })
      act(() => { vi.advanceTimersByTime(1000) })
      expect(onOpen).toHaveBeenCalledTimes(1)
      h.unmount()
    })

    it('uses custom openDelayMs', () => {
      const onOpen = vi.fn()
      const h = createHarness({ openDelayMs: 300, onOpen, onClose: vi.fn() })
      act(() => { h.result.getTriggerProps().onPointerEnter?.({} as any) })
      act(() => { vi.advanceTimersByTime(300) })
      expect(onOpen).toHaveBeenCalledTimes(1)
      h.unmount()
    })
  })

  describe('close delay', () => {
    it('calls onClose after closeDelayMs following pointer leave', () => {
      const onClose = vi.fn()
      const h = createHarness({ closeDelayMs: 500, onOpen: vi.fn(), onClose })
      act(() => { h.result.getTriggerProps().onPointerLeave?.({} as any) })
      act(() => { vi.advanceTimersByTime(500) })
      expect(onClose).toHaveBeenCalledTimes(1)
      h.unmount()
    })

    it('uses custom closeDelayMs', () => {
      const onClose = vi.fn()
      const h = createHarness({ closeDelayMs: 200, onOpen: vi.fn(), onClose })
      act(() => { h.result.getTriggerProps().onPointerLeave?.({} as any) })
      act(() => { vi.advanceTimersByTime(200) })
      expect(onClose).toHaveBeenCalledTimes(1)
      h.unmount()
    })
  })

  describe('timer cancellation', () => {
    it('cancels pending open when leave fires before openDelayMs', () => {
      const onOpen = vi.fn()
      const h = createHarness({ openDelayMs: 1000, onOpen, onClose: vi.fn() })
      act(() => { h.result.getTriggerProps().onPointerEnter?.({} as any) })
      act(() => { vi.advanceTimersByTime(500) })
      act(() => { h.result.getTriggerProps().onPointerLeave?.({} as any) })
      act(() => { vi.advanceTimersByTime(1000) })
      expect(onOpen).not.toHaveBeenCalled()
      h.unmount()
    })

    it('cancels pending close when enter fires during close window', () => {
      const onClose = vi.fn()
      const h = createHarness({ closeDelayMs: 500, onOpen: vi.fn(), onClose })
      act(() => { h.result.getTriggerProps().onPointerLeave?.({} as any) })
      act(() => { vi.advanceTimersByTime(250) })
      act(() => { h.result.getTriggerProps().onPointerEnter?.({} as any) })
      act(() => { vi.advanceTimersByTime(500) })
      expect(onClose).not.toHaveBeenCalled()
      h.unmount()
    })
  })

  describe('surface props', () => {
    it('surface onPointerEnter cancels pending close', () => {
      const onClose = vi.fn()
      const h = createHarness({ closeDelayMs: 500, onOpen: vi.fn(), onClose })
      act(() => { h.result.getTriggerProps().onPointerLeave?.({} as any) })
      act(() => { vi.advanceTimersByTime(250) })
      act(() => { h.result.getSurfaceProps().onPointerEnter?.({} as any) })
      act(() => { vi.advanceTimersByTime(500) })
      expect(onClose).not.toHaveBeenCalled()
      h.unmount()
    })

    it('surface onPointerLeave schedules close', () => {
      const onClose = vi.fn()
      const h = createHarness({ closeDelayMs: 500, onOpen: vi.fn(), onClose })
      act(() => { h.result.getSurfaceProps().onPointerLeave?.({} as any) })
      act(() => { vi.advanceTimersByTime(500) })
      expect(onClose).toHaveBeenCalledTimes(1)
      h.unmount()
    })
  })
})
