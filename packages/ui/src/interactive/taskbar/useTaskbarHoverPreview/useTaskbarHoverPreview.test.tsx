import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createElement, createRef, type ReactNode, type RefObject } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { act } from 'react'

// Required for React's act() to work in jsdom
// @ts-expect-error global flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

import { useTaskbarHoverPreview } from '.'
import type { TaskbarHoverPreviewHookOptions, TaskbarHoverPreviewHookResult } from '.'

/* ── Harness ─────────────────────────────────────────────────── */

/**
 * Simple hook harness: renders a component that calls the hook and
 * exposes the result via a mutable ref so tests can inspect it.
 *
 * options는 항상 required (triggerRef + taskbarRootRef 포함).
 * null ref를 전달하면 runtime no-op 경로를 검증할 수 있다.
 */
const NULL_TRIGGER_REF: RefObject<HTMLElement | null> = { current: null }
const NULL_TASKBAR_ROOT_REF: RefObject<HTMLElement | null> = { current: null }
const NULL_OPTIONS: TaskbarHoverPreviewHookOptions = {
  triggerRef: NULL_TRIGGER_REF,
  taskbarRootRef: NULL_TASKBAR_ROOT_REF,
}

function createHarness() {
  const resultRef: { current: TaskbarHoverPreviewHookResult | null } = { current: null }

  function Harness({ options }: { options: TaskbarHoverPreviewHookOptions }) {
    const result = useTaskbarHoverPreview(options)
    resultRef.current = result
    return null
  }

  return { resultRef, Harness }
}

/* ── Helpers ─────────────────────────────────────────────────── */

function makeTriggerEl(rect: Partial<DOMRect> = {}) {
  const el = document.createElement('button')
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    left: rect.left ?? 300,
    top: rect.top ?? 752,
    width: rect.width ?? 48,
    height: rect.height ?? 48,
    right: (rect.left ?? 300) + (rect.width ?? 48),
    bottom: (rect.top ?? 752) + (rect.height ?? 48),
    x: rect.left ?? 300,
    y: rect.top ?? 752,
    toJSON: () => ({}),
  } as DOMRect)
  document.body.appendChild(el)
  return el
}

function makeTaskbarRootEl(rect: Partial<DOMRect> = {}) {
  const el = document.createElement('div')
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    left: rect.left ?? 0,
    top: rect.top ?? 752,
    width: rect.width ?? 1280,
    height: rect.height ?? 48,
    right: (rect.left ?? 0) + (rect.width ?? 1280),
    bottom: (rect.top ?? 752) + (rect.height ?? 48),
    x: rect.left ?? 0,
    y: rect.top ?? 752,
    toJSON: () => ({}),
  } as DOMRect)
  document.body.appendChild(el)
  return el
}

/* ── Setup ───────────────────────────────────────────────────── */

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  vi.useFakeTimers()
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

function render(ui: ReactNode) {
  act(() => { root.render(ui) })
}

/* ── Tests ───────────────────────────────────────────────────── */

describe('useTaskbarHoverPreview', () => {
  describe('초기값', () => {
    it('초기 상태에서 닫혀 있다 (isOpen: false)', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: NULL_OPTIONS }))

      expect(resultRef.current?.isOpen).toBe(false)
    })

    it('초기 phase가 "opening"이다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: NULL_OPTIONS }))

      expect(resultRef.current?.phase).toBe('opening')
    })

    it('초기 placement가 { x: 0, y: 0 }이다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: NULL_OPTIONS }))

      expect(resultRef.current?.placement).toEqual({ x: 0, y: 0 })
    })

    it('getTriggerProps를 함수로 노출한다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: NULL_OPTIONS }))

      expect(typeof resultRef.current?.getTriggerProps).toBe('function')
    })

    it('getSurfaceProps를 함수로 노출한다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: NULL_OPTIONS }))

      expect(typeof resultRef.current?.getSurfaceProps).toBe('function')
    })

    it('dismiss를 함수로 노출한다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: NULL_OPTIONS }))

      expect(typeof resultRef.current?.dismiss).toBe('function')
    })

    it('getTriggerProps가 onPointerEnter와 onPointerLeave 핸들러를 반환한다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: NULL_OPTIONS }))

      const props = resultRef.current!.getTriggerProps()
      expect(typeof props.onPointerEnter).toBe('function')
      expect(typeof props.onPointerLeave).toBe('function')
    })

    it('getSurfaceProps가 onPointerEnter와 onPointerLeave 핸들러를 반환한다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: NULL_OPTIONS }))

      const props = resultRef.current!.getSurfaceProps()
      expect(typeof props.onPointerEnter).toBe('function')
      expect(typeof props.onPointerLeave).toBe('function')
    })

    it('getSurfaceProps가 callback ref 함수를 반환한다 (root wiring)', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: NULL_OPTIONS }))

      const props = resultRef.current!.getSurfaceProps()
      expect(props.ref).toBeDefined()
      expect(typeof props.ref).toBe('function')
    })
  })

  describe('missing ref 경고 + no-op', () => {
    it('triggerRef.current이 null이면 경고를 내고 isOpen이 변하지 않는다', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      // triggerRef.current이 null (runtime element 없음); taskbarRootRef는 실제 요소
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef: RefObject<HTMLElement | null> = { current: null }
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>

      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 0, triggerRef, taskbarRootRef } }))

      const triggerProps = resultRef.current!.getTriggerProps()
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(0) })

      expect(resultRef.current?.isOpen).toBe(false)
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('triggerRef')
      )

      document.body.removeChild(taskbarRootEl)
    })

    it('taskbarRootRef.current이 null이면 경고를 내고 isOpen이 변하지 않는다', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      // taskbarRootRef.current이 null (runtime element 없음); triggerRef는 실제 요소
      const triggerEl = makeTriggerEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef: RefObject<HTMLElement | null> = { current: null }

      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 0, triggerRef, taskbarRootRef } }))

      const triggerProps = resultRef.current!.getTriggerProps()
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(0) })

      expect(resultRef.current?.isOpen).toBe(false)
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('taskbarRootRef')
      )

      document.body.removeChild(triggerEl)
    })
  })

  describe('기본 openDelayMs (1000ms)', () => {
    it('1000ms 이전에는 열리지 않는다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>

      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { triggerRef, taskbarRootRef } }))

      const triggerProps = resultRef.current!.getTriggerProps()
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })

      act(() => { vi.advanceTimersByTime(999) })
      expect(resultRef.current?.isOpen).toBe(false)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })

    it('기본값으로 1000ms 후 열린다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>

      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { triggerRef, taskbarRootRef } }))

      const triggerProps = resultRef.current!.getTriggerProps()
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })

      act(() => { vi.advanceTimersByTime(1000) })
      expect(resultRef.current?.isOpen).toBe(true)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })
  })

  describe('openDelayMs 커스텀', () => {
    it('커스텀 지연 후 열린다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>

      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 200, triggerRef, taskbarRootRef } }))

      const triggerProps = resultRef.current!.getTriggerProps()
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })

      act(() => { vi.advanceTimersByTime(199) })
      expect(resultRef.current?.isOpen).toBe(false)

      act(() => { vi.advanceTimersByTime(1) })
      expect(resultRef.current?.isOpen).toBe(true)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })
  })

  describe('closeDelayMs 커스텀', () => {
    it('커스텀 지연 후 닫힌다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>

      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 0, closeDelayMs: 300, triggerRef, taskbarRootRef } }))

      const triggerProps = resultRef.current!.getTriggerProps()

      // Open
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(0) })
      expect(resultRef.current?.isOpen).toBe(true)

      // Leave — should not close yet
      act(() => { triggerProps.onPointerLeave?.(new PointerEvent('pointerleave') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(299) })
      expect(resultRef.current?.isOpen).toBe(true)

      // Now it should close
      act(() => { vi.advanceTimersByTime(1) })
      act(() => { resultRef.current?.onExitComplete() })
      expect(resultRef.current?.isOpen).toBe(false)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })
  })

  describe('hover intent 열기 → 닫기 경로 (leave-close)', () => {
    it('enter 지연 후 열리고, leave 지연 + onExitComplete 후 닫힌다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>

      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 100, closeDelayMs: 200, triggerRef, taskbarRootRef } }))

      const triggerProps = resultRef.current!.getTriggerProps()

      // Hover enter
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })
      expect(resultRef.current?.isOpen).toBe(true)
      expect(resultRef.current?.phase).toBe('open')

      // Hover leave → closing phase
      act(() => { triggerProps.onPointerLeave?.(new PointerEvent('pointerleave') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(200) })
      expect(resultRef.current?.phase).toBe('closing')

      // Animation done
      act(() => { resultRef.current?.onExitComplete() })
      expect(resultRef.current?.isOpen).toBe(false)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })
  })

  describe('대기 타이머 취소', () => {
    it('open 완료 전 leave가 발생하면 대기 중인 open 타이머를 취소한다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>

      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 500, triggerRef, taskbarRootRef } }))

      const triggerProps = resultRef.current!.getTriggerProps()

      // Enter → partial wait → leave
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(300) })
      act(() => { triggerProps.onPointerLeave?.(new PointerEvent('pointerleave') as unknown as React.PointerEvent<HTMLElement>) })

      // Advance past original openDelay — should NOT open
      act(() => { vi.advanceTimersByTime(300) })
      expect(resultRef.current?.isOpen).toBe(false)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })

    it('close 대기 중 enter가 발생하면 대기 중인 close 타이머를 취소한다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>

      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 100, closeDelayMs: 500, triggerRef, taskbarRootRef } }))

      const triggerProps = resultRef.current!.getTriggerProps()

      // Open
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })
      expect(resultRef.current?.isOpen).toBe(true)

      // Leave → start close timer
      act(() => { triggerProps.onPointerLeave?.(new PointerEvent('pointerleave') as unknown as React.PointerEvent<HTMLElement>) })

      // Re-enter before close fires → cancels close
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(600) })

      // Should still be open (close was cancelled, new open timer fired)
      expect(resultRef.current?.isOpen).toBe(true)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })
  })

  describe('reduced motion 즉시 종료', () => {
    it('closing phase 없이 즉시 isOpen을 false로 설정한다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>

      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 100, closeDelayMs: 100, motionPreference: 'reduced', triggerRef, taskbarRootRef } }))

      const triggerProps = resultRef.current!.getTriggerProps()

      // Open
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })
      expect(resultRef.current?.isOpen).toBe(true)

      // Leave → with reduced motion, isOpen becomes false immediately (no closing phase)
      act(() => { triggerProps.onPointerLeave?.(new PointerEvent('pointerleave') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })

      // Should be closed without going through closing phase
      expect(resultRef.current?.isOpen).toBe(false)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })
  })

  describe('global dismiss — Escape 키', () => {
    it('패널이 열린 상태에서 document keydown Escape를 누르면 닫힌다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>

      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 100, closeDelayMs: 200, triggerRef, taskbarRootRef } }))

      const triggerProps = resultRef.current!.getTriggerProps()

      // Open
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })
      expect(resultRef.current?.isOpen).toBe(true)

      // Escape from document (focus-agnostic)
      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      })

      expect(resultRef.current?.phase).toBe('closing')

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })

    it('패널이 닫힌 상태에서 Escape를 눌러도 아무 일도 없다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: NULL_OPTIONS }))

      expect(resultRef.current?.isOpen).toBe(false)

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      })

      expect(resultRef.current?.isOpen).toBe(false)
    })
  })

  describe('global dismiss — outside pointerdown', () => {
    it('surface 외부 pointerdown 시 닫힌다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>

      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 100, closeDelayMs: 200, triggerRef, taskbarRootRef } }))

      const triggerProps = resultRef.current!.getTriggerProps()

      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })
      expect(resultRef.current?.isOpen).toBe(true)

      act(() => {
        document.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      })

      expect(resultRef.current?.phase).toBe('closing')

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })

    it('trigger 요소 내부 pointerdown은 닫히지 않는다 (whitelist)', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>

      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 100, closeDelayMs: 200, triggerRef, taskbarRootRef } }))

      const triggerProps = resultRef.current!.getTriggerProps()

      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })
      expect(resultRef.current?.isOpen).toBe(true)

      act(() => {
        triggerEl.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      })

      expect(resultRef.current?.isOpen).toBe(true)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })

    it('taskbarRoot 요소 내부 pointerdown은 닫히지 않는다 (whitelist)', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>

      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 100, closeDelayMs: 200, triggerRef, taskbarRootRef } }))

      const triggerProps = resultRef.current!.getTriggerProps()

      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })
      expect(resultRef.current?.isOpen).toBe(true)

      act(() => {
        taskbarRootEl.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      })

      expect(resultRef.current?.isOpen).toBe(true)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })
  })

  describe('getSurfaceProps — root registration (callback ref)', () => {
    it('getSurfaceProps().ref는 함수(callback ref)다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: NULL_OPTIONS }))

      const surfaceProps = resultRef.current!.getSurfaceProps()
      expect(typeof surfaceProps.ref).toBe('function')
    })

    it('getSurfaceProps().ref에 DOM 요소를 전달하면 오류 없이 처리된다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: NULL_OPTIONS }))

      const surfaceProps = resultRef.current!.getSurfaceProps()
      const surfaceEl = document.createElement('div')

      expect(() => {
        act(() => {
          surfaceProps.ref(surfaceEl)
        })
      }).not.toThrow()
    })
  })

  describe('opening/closing observable lifecycle', () => {
    it('열릴 때 phase가 "open"이 된다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>

      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 100, triggerRef, taskbarRootRef } }))

      const triggerProps = resultRef.current!.getTriggerProps()
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })

      expect(resultRef.current?.phase).toBe('open')

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })

    it('닫힐 때 phase가 "closing"이 된다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>

      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 100, closeDelayMs: 100, triggerRef, taskbarRootRef } }))

      const triggerProps = resultRef.current!.getTriggerProps()
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })

      act(() => { triggerProps.onPointerLeave?.(new PointerEvent('pointerleave') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })

      expect(resultRef.current?.phase).toBe('closing')

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })

    it('onExitComplete 후 phase가 "opening"으로 리셋된다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>

      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 100, closeDelayMs: 100, triggerRef, taskbarRootRef } }))

      const triggerProps = resultRef.current!.getTriggerProps()
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })
      act(() => { triggerProps.onPointerLeave?.(new PointerEvent('pointerleave') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })
      act(() => { resultRef.current?.onExitComplete() })

      expect(resultRef.current?.phase).toBe('opening')
      expect(resultRef.current?.isOpen).toBe(false)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })
  })

  describe('포커스 복원 없음 (hover-specific)', () => {
    it('onExitComplete 후 triggerRef.current.focus()가 호출되지 않는다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const focusSpy = vi.spyOn(triggerEl, 'focus')
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>

      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 100, closeDelayMs: 100, triggerRef, taskbarRootRef } }))

      const triggerProps = resultRef.current!.getTriggerProps()
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })
      act(() => { triggerProps.onPointerLeave?.(new PointerEvent('pointerleave') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })
      act(() => { resultRef.current?.onExitComplete() })

      expect(focusSpy).not.toHaveBeenCalled()

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })
  })

  describe('dismiss', () => {
    it('dismiss 호출 시 hover가 닫힌다 (context open → hover dismissed 시나리오)', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>

      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 100, closeDelayMs: 200, triggerRef, taskbarRootRef } }))

      const triggerProps = resultRef.current!.getTriggerProps()

      // hover를 열어둠
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })
      expect(resultRef.current?.isOpen).toBe(true)

      // consumer가 context를 열며 hover를 dismiss
      act(() => { resultRef.current!.dismiss() })

      // closing phase로 전환되어야 한다
      expect(resultRef.current?.phase).toBe('closing')

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })

    it('dismiss 후 onExitComplete 호출 시 완전히 닫힌다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>

      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 100, closeDelayMs: 200, triggerRef, taskbarRootRef } }))

      const triggerProps = resultRef.current!.getTriggerProps()

      // hover를 열어둠
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })
      expect(resultRef.current?.isOpen).toBe(true)

      // dismiss 후 animation 완료
      act(() => { resultRef.current!.dismiss() })
      act(() => { resultRef.current!.onExitComplete() })
      expect(resultRef.current?.isOpen).toBe(false)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })

    it('dismiss 후 포인터가 그대로 있어도 hover가 재열리지 않는다 (resting pointer no-op)', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>

      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 100, triggerRef, taskbarRootRef } }))

      const triggerProps = resultRef.current!.getTriggerProps()

      // hover를 열고 닫음
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })
      act(() => { resultRef.current!.dismiss() })
      act(() => { resultRef.current!.onExitComplete() })
      expect(resultRef.current?.isOpen).toBe(false)

      // pointerleave 없이 바로 pointerenter — suppression 중이므로 무시
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(500) })
      expect(resultRef.current?.isOpen).toBe(false)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })

    it('dismiss 후 fresh leave → enter intent 후에만 hover가 재열린다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>

      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 100, closeDelayMs: 200, triggerRef, taskbarRootRef } }))

      const triggerProps = resultRef.current!.getTriggerProps()

      // hover를 열고 닫음
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })
      act(() => { resultRef.current!.dismiss() })
      act(() => { resultRef.current!.onExitComplete() })
      expect(resultRef.current?.isOpen).toBe(false)

      // 신선한 leave로 gate 해제 (close 타이머는 이미 없으므로 추가 발화 없음)
      act(() => { triggerProps.onPointerLeave?.(new PointerEvent('pointerleave') as unknown as React.PointerEvent<HTMLElement>) })
      // close 타이머가 발화하기 전에 재진입
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })

      // gate가 해제됐으므로 hover가 열려야 한다
      expect(resultRef.current?.isOpen).toBe(true)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })
  })

  describe('placement — measured DOMRect 기반', () => {
    it('open 후 placement가 triggerRect와 taskbarRootRect 기반으로 계산된다', () => {
      // triggerRect: left=300, width=48 → centerX=324
      // taskbarRootRect: top=752 → y = 752 - 10 - 0 (surface not mounted) = 742
      // x = 324 - 0/2 = 324 (surfaceWidth=0 at first open; placement will be ~324)
      const triggerEl = makeTriggerEl({ left: 300, top: 752, width: 48, height: 48 })
      const taskbarRootEl = makeTaskbarRootEl({ left: 0, top: 752, width: 1280, height: 48 })
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>

      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 0, triggerRef, taskbarRootRef } }))

      const triggerProps = resultRef.current!.getTriggerProps()
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(0) })

      expect(resultRef.current?.isOpen).toBe(true)
      // x is derived from trigger center (324); exact value depends on surface width (0 before mount)
      const px = resultRef.current!.placement.x
      expect(px).toBeGreaterThanOrEqual(0)
      // y = taskbarRootTop - gap - surfaceHeight = 752 - 10 - 0 = 742
      expect(resultRef.current!.placement.y).toBe(742)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })
  })
})

// Keep unused import from causing lint errors when createRef is imported but not used in some tests
const _createRef = createRef
void _createRef
