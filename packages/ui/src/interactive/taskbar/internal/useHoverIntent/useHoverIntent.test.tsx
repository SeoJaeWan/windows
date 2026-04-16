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

  describe('dismiss', () => {
    it('dismiss 함수를 노출한다', () => {
      const h = createHarness({ onOpen: vi.fn(), onClose: vi.fn() })
      expect(typeof h.result.dismiss).toBe('function')
      h.unmount()
    })

    it('dismiss 호출 시 onClose를 즉시 호출한다', () => {
      const onClose = vi.fn()
      const h = createHarness({ openDelayMs: 100, onOpen: vi.fn(), onClose })
      act(() => { h.result.dismiss() })
      expect(onClose).toHaveBeenCalledTimes(1)
      h.unmount()
    })

    it('대기 중인 open 타이머가 dismiss로 취소된다', () => {
      const onOpen = vi.fn()
      const h = createHarness({ openDelayMs: 500, onOpen, onClose: vi.fn() })
      // open 타이머 시작
      act(() => { h.result.getTriggerProps().onPointerEnter?.({} as any) })
      // dismiss — open 타이머 취소
      act(() => { h.result.dismiss() })
      // 충분한 시간 경과 후에도 onOpen이 호출되지 않아야 한다
      act(() => { vi.advanceTimersByTime(1000) })
      expect(onOpen).not.toHaveBeenCalled()
      h.unmount()
    })

    it('대기 중인 close 타이머가 dismiss로 취소된다', () => {
      const onClose = vi.fn()
      const h = createHarness({ closeDelayMs: 500, onOpen: vi.fn(), onClose })
      // close 타이머 시작
      act(() => { h.result.getTriggerProps().onPointerLeave?.({} as any) })
      // dismiss — close 타이머 취소 후 onClose를 즉시 호출
      act(() => { h.result.dismiss() })
      // dismiss 시점에서 onClose가 1회 호출됨
      expect(onClose).toHaveBeenCalledTimes(1)
      // 기존 close 타이머가 추가로 발화하지 않아야 한다
      act(() => { vi.advanceTimersByTime(1000) })
      expect(onClose).toHaveBeenCalledTimes(1)
      h.unmount()
    })

    it('dismiss 후 포인터가 그대로 있어도 onOpen을 호출하지 않는다 (resting pointer no-op)', () => {
      const onOpen = vi.fn()
      const h = createHarness({ openDelayMs: 200, onOpen, onClose: vi.fn() })
      // dismiss로 suppression 설정
      act(() => { h.result.dismiss() })
      // pointerleave 없이 바로 pointerenter — suppression 중이므로 무시
      act(() => { h.result.getTriggerProps().onPointerEnter?.({} as any) })
      act(() => { vi.advanceTimersByTime(500) })
      expect(onOpen).not.toHaveBeenCalled()
      h.unmount()
    })

    it('dismiss 후 pointerleave → pointerenter 순서로 suppression이 해제되어 reopen 가능하다', () => {
      const onOpen = vi.fn()
      const h = createHarness({ openDelayMs: 200, onOpen, onClose: vi.fn() })
      // dismiss로 suppression 설정
      act(() => { h.result.dismiss() })
      // 신선한 leave로 gate 해제
      act(() => { h.result.getTriggerProps().onPointerLeave?.({} as any) })
      // leave timer가 발화하지 않도록 충분히 짧게 대기 후 재진입
      act(() => { vi.advanceTimersByTime(0) })
      // 재진입 → open 타이머 시작
      act(() => { h.result.getTriggerProps().onPointerEnter?.({} as any) })
      act(() => { vi.advanceTimersByTime(200) })
      expect(onOpen).toHaveBeenCalledTimes(1)
      h.unmount()
    })
  })
})
