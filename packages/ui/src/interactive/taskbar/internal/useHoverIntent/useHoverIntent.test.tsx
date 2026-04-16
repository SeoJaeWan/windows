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
    it('onPointerEnter와 onPointerLeave 핸들러를 반환한다', () => {
      const h = createHarness({ onOpen: vi.fn(), onClose: vi.fn() })
      const props = h.result.getTriggerProps()
      expect(typeof props.onPointerEnter).toBe('function')
      expect(typeof props.onPointerLeave).toBe('function')
      h.unmount()
    })
  })

  describe('getSurfaceProps', () => {
    it('onPointerEnter와 onPointerLeave 핸들러를 반환한다', () => {
      const h = createHarness({ onOpen: vi.fn(), onClose: vi.fn() })
      const props = h.result.getSurfaceProps()
      expect(typeof props.onPointerEnter).toBe('function')
      expect(typeof props.onPointerLeave).toBe('function')
      h.unmount()
    })
  })

  describe('열기 지연', () => {
    it('openDelayMs 이전에는 onOpen을 호출하지 않는다', () => {
      const onOpen = vi.fn()
      const h = createHarness({ openDelayMs: 1000, onOpen, onClose: vi.fn() })
      act(() => { h.result.getTriggerProps().onPointerEnter?.({} as any) })
      act(() => { vi.advanceTimersByTime(999) })
      expect(onOpen).not.toHaveBeenCalled()
      h.unmount()
    })

    it('openDelayMs 후 onOpen을 호출한다', () => {
      const onOpen = vi.fn()
      const h = createHarness({ openDelayMs: 1000, onOpen, onClose: vi.fn() })
      act(() => { h.result.getTriggerProps().onPointerEnter?.({} as any) })
      act(() => { vi.advanceTimersByTime(1000) })
      expect(onOpen).toHaveBeenCalledTimes(1)
      h.unmount()
    })

    it('커스텀 openDelayMs를 사용한다', () => {
      const onOpen = vi.fn()
      const h = createHarness({ openDelayMs: 300, onOpen, onClose: vi.fn() })
      act(() => { h.result.getTriggerProps().onPointerEnter?.({} as any) })
      act(() => { vi.advanceTimersByTime(300) })
      expect(onOpen).toHaveBeenCalledTimes(1)
      h.unmount()
    })
  })

  describe('닫기 지연', () => {
    it('포인터가 떠난 후 closeDelayMs 뒤에 onClose를 호출한다', () => {
      const onClose = vi.fn()
      const h = createHarness({ closeDelayMs: 500, onOpen: vi.fn(), onClose })
      act(() => { h.result.getTriggerProps().onPointerLeave?.({} as any) })
      act(() => { vi.advanceTimersByTime(500) })
      expect(onClose).toHaveBeenCalledTimes(1)
      h.unmount()
    })

    it('커스텀 closeDelayMs를 사용한다', () => {
      const onClose = vi.fn()
      const h = createHarness({ closeDelayMs: 200, onOpen: vi.fn(), onClose })
      act(() => { h.result.getTriggerProps().onPointerLeave?.({} as any) })
      act(() => { vi.advanceTimersByTime(200) })
      expect(onClose).toHaveBeenCalledTimes(1)
      h.unmount()
    })
  })

  describe('타이머 취소', () => {
    it('openDelayMs 이전에 leave가 발생하면 대기 중인 open을 취소한다', () => {
      const onOpen = vi.fn()
      const h = createHarness({ openDelayMs: 1000, onOpen, onClose: vi.fn() })
      act(() => { h.result.getTriggerProps().onPointerEnter?.({} as any) })
      act(() => { vi.advanceTimersByTime(500) })
      act(() => { h.result.getTriggerProps().onPointerLeave?.({} as any) })
      act(() => { vi.advanceTimersByTime(1000) })
      expect(onOpen).not.toHaveBeenCalled()
      h.unmount()
    })

    it('닫기 대기 중에 enter가 발생하면 대기 중인 close를 취소한다', () => {
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
    it('surface onPointerEnter가 대기 중인 close를 취소한다', () => {
      const onClose = vi.fn()
      const h = createHarness({ closeDelayMs: 500, onOpen: vi.fn(), onClose })
      act(() => { h.result.getTriggerProps().onPointerLeave?.({} as any) })
      act(() => { vi.advanceTimersByTime(250) })
      act(() => { h.result.getSurfaceProps().onPointerEnter?.({} as any) })
      act(() => { vi.advanceTimersByTime(500) })
      expect(onClose).not.toHaveBeenCalled()
      h.unmount()
    })

    it('surface onPointerLeave가 close를 예약한다', () => {
      const onClose = vi.fn()
      const h = createHarness({ closeDelayMs: 500, onOpen: vi.fn(), onClose })
      act(() => { h.result.getSurfaceProps().onPointerLeave?.({} as any) })
      act(() => { vi.advanceTimersByTime(500) })
      expect(onClose).toHaveBeenCalledTimes(1)
      h.unmount()
    })
  })
})
