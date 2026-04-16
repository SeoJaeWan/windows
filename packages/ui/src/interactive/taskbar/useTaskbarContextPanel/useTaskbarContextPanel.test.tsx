import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createElement, createRef, type ReactNode, type RefObject } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { act } from 'react'

// Required for React's act() to work in jsdom
// @ts-expect-error global flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

import { useTaskbarContextPanel } from '.'
import type { TaskbarContextPanelHookOptions, TaskbarContextPanelHookResult } from '.'

/* ── Harness ─────────────────────────────────────────────────── */

function createHarness(triggerRef: RefObject<HTMLElement | null>) {
  const resultRef: { current: TaskbarContextPanelHookResult | null } = { current: null }

  function Harness({ options }: { options?: Omit<TaskbarContextPanelHookOptions, 'triggerRef'> }) {
    const result = useTaskbarContextPanel({ triggerRef, ...options })
    resultRef.current = result
    return null
  }

  return { resultRef, Harness }
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
})

function render(ui: ReactNode) {
  act(() => { root.render(ui) })
}

function makeMouseEvent(clientX: number, clientY: number): React.MouseEvent {
  return { clientX, clientY } as React.MouseEvent
}

/* ── Tests ───────────────────────────────────────────────────── */

describe('useTaskbarContextPanel', () => {
  describe('초기 상태', () => {
    it('초기 상태에서 닫혀 있다 (isOpen: false)', () => {
      const triggerRef = createRef<HTMLElement>()
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, {}))

      expect(resultRef.current?.isOpen).toBe(false)
    })

    it('초기 phase가 "opening"이다', () => {
      const triggerRef = createRef<HTMLElement>()
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, {}))

      expect(resultRef.current?.phase).toBe('opening')
    })

    it('open, close, onExitComplete를 함수로 노출한다', () => {
      const triggerRef = createRef<HTMLElement>()
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, {}))

      expect(typeof resultRef.current?.open).toBe('function')
      expect(typeof resultRef.current?.close).toBe('function')
      expect(typeof resultRef.current?.onExitComplete).toBe('function')
    })

    it('surfaceProps에 onKeyDown 핸들러가 포함된다', () => {
      const triggerRef = createRef<HTMLElement>()
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, {}))

      expect(typeof resultRef.current?.surfaceProps.onKeyDown).toBe('function')
    })
  })

  describe('open(event) — 마우스 이벤트', () => {
    it('open() 호출 후 isOpen이 true가 된다', () => {
      const triggerRef = createRef<HTMLElement>()
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(400, 700)) })
      expect(resultRef.current?.isOpen).toBe(true)
    })

    it('open() 호출 후 phase가 "open"이 된다', () => {
      const triggerRef = createRef<HTMLElement>()
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(400, 700)) })
      expect(resultRef.current?.phase).toBe('open')
    })
  })

  describe('포인터 원점 기반 배치 계산', () => {
    it('패널을 pointerX 기준으로 가로 중앙에 배치한다', () => {
      const triggerRef = createRef<HTMLElement>()
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, { options: { panelWidth: 200, panelHeight: 300 } }))

      // viewport: 1280×800 (jsdom default), pointer at (600, 720)
      // Expected x: 600 - 200/2 = 500 (clamped to [0, 1080])
      // Expected y: 720 - 300 = 420
      act(() => { resultRef.current?.open(makeMouseEvent(600, 720)) })

      expect(resultRef.current?.placement.x).toBe(500)
      expect(resultRef.current?.placement.y).toBe(420)
    })

    it('패널이 오른쪽 경계를 벗어나면 x를 클램프한다', () => {
      const triggerRef = createRef<HTMLElement>()
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, { options: { panelWidth: 200, panelHeight: 300 } }))

      // pointer at (1250, 720) → naive x = 1250 - 100 = 1150, but viewport=1280 → max = 1080
      act(() => { resultRef.current?.open(makeMouseEvent(1250, 720)) })

      // x should be clamped to viewportWidth - panelWidth = window.innerWidth - 200
      // jsdom sets window.innerWidth to 1024 by default
      const vw = window.innerWidth
      expect(resultRef.current?.placement.x).toBe(vw - 200)
    })

    it('패널이 왼쪽 경계를 벗어나면 x를 0으로 클램프한다', () => {
      const triggerRef = createRef<HTMLElement>()
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, { options: { panelWidth: 200, panelHeight: 300 } }))

      // pointer at (10, 720) → naive x = 10 - 100 = -90 → clamped to 0
      act(() => { resultRef.current?.open(makeMouseEvent(10, 720)) })

      expect(resultRef.current?.placement.x).toBe(0)
    })

    it('패널이 뷰포트 상단을 벗어나면 y를 0으로 클램프한다', () => {
      const triggerRef = createRef<HTMLElement>()
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, { options: { panelWidth: 200, panelHeight: 300 } }))

      // pointer at (400, 100) → naive y = 100 - 300 = -200 → clamped to 0
      act(() => { resultRef.current?.open(makeMouseEvent(400, 100)) })

      expect(resultRef.current?.placement.y).toBe(0)
    })
  })

  describe('surfaceProps.onKeyDown — Escape 브릿지', () => {
    it('surfaceProps.onKeyDown에서 Escape를 누르면 close()를 호출한다', () => {
      const triggerRef = createRef<HTMLElement>()
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, {}))

      // Open first
      act(() => { resultRef.current?.open(makeMouseEvent(400, 700)) })
      expect(resultRef.current?.isOpen).toBe(true)

      // Press Escape via surfaceProps.onKeyDown
      const escapeEvent = {
        key: 'Escape',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLElement>

      act(() => {
        resultRef.current?.surfaceProps.onKeyDown?.(escapeEvent)
      })

      expect(escapeEvent.preventDefault).toHaveBeenCalled()
      // With full motion, pressing Escape sets phase to "closing"
      expect(resultRef.current?.phase).toBe('closing')
    })

    it('Escape 외의 키에는 반응하지 않는다', () => {
      const triggerRef = createRef<HTMLElement>()
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(400, 700)) })

      const tabEvent = {
        key: 'Tab',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLElement>

      act(() => {
        resultRef.current?.surfaceProps.onKeyDown?.(tabEvent)
      })

      expect(resultRef.current?.isOpen).toBe(true)
      expect(tabEvent.preventDefault).not.toHaveBeenCalled()
    })
  })

  describe('닫을 때 포커스 복원', () => {
    it('onExitComplete 호출 시 triggerRef.current.focus()를 실행한다', () => {
      const triggerEl = document.createElement('button')
      const focusSpy = vi.spyOn(triggerEl, 'focus')
      document.body.appendChild(triggerEl)

      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(400, 700)) })
      act(() => { resultRef.current?.close() })
      act(() => { resultRef.current?.onExitComplete() })

      expect(focusSpy).toHaveBeenCalled()
      document.body.removeChild(triggerEl)
    })
  })

  describe('reduced motion 즉시 완료', () => {
    it('closing phase 없이 close() 직후 isOpen이 false가 된다', () => {
      const triggerRef = createRef<HTMLElement>()
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, { options: { motionPreference: 'reduced' } }))

      act(() => { resultRef.current?.open(makeMouseEvent(400, 700)) })
      expect(resultRef.current?.isOpen).toBe(true)

      // close() with reduced motion → immediately unmounts
      act(() => { resultRef.current?.close() })
      expect(resultRef.current?.isOpen).toBe(false)
      expect(resultRef.current?.phase).toBe('opening')
    })

    it('reduced motion close() 호출 시 즉시 포커스를 복원한다', () => {
      const triggerEl = document.createElement('button')
      const focusSpy = vi.spyOn(triggerEl, 'focus')
      document.body.appendChild(triggerEl)

      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, { options: { motionPreference: 'reduced' } }))

      act(() => { resultRef.current?.open(makeMouseEvent(400, 700)) })
      act(() => { resultRef.current?.close() })

      expect(focusSpy).toHaveBeenCalled()
      document.body.removeChild(triggerEl)
    })
  })
})
