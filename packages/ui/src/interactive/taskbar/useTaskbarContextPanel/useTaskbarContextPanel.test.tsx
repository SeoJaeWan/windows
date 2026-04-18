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
  vi.restoreAllMocks()
})

function render(ui: ReactNode) {
  act(() => { root.render(ui) })
}

function makeMouseEvent(clientX: number, clientY: number): React.MouseEvent {
  return { clientX, clientY } as React.MouseEvent
}

function makeTriggerEl(rect: Partial<DOMRect> = {}) {
  const el = document.createElement('button')
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    left: rect.left ?? 300,
    top: rect.top ?? 760,
    width: rect.width ?? 48,
    height: rect.height ?? 40,
    right: (rect.left ?? 300) + (rect.width ?? 48),
    bottom: (rect.top ?? 760) + (rect.height ?? 40),
    x: rect.left ?? 300,
    y: rect.top ?? 760,
    toJSON: () => ({}),
  } as DOMRect)
  document.body.appendChild(el)
  return el
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

    it('surfaceProps.ref가 MutableRefObject로 노출된다', () => {
      const triggerRef = createRef<HTMLElement>()
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, {}))

      expect(resultRef.current?.surfaceProps.ref).toBeDefined()
      expect(typeof resultRef.current?.surfaceProps.ref).toBe('object')
    })
  })

  describe('open(event) — trigger 중심 기반 배치', () => {
    it('open() 호출 후 isOpen이 true가 된다', () => {
      const triggerEl = makeTriggerEl({ left: 300, top: 760, width: 48 })
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      expect(resultRef.current?.isOpen).toBe(true)

      document.body.removeChild(triggerEl)
    })

    it('open() 호출 후 phase가 "open"이 된다', () => {
      const triggerEl = makeTriggerEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      expect(resultRef.current?.phase).toBe('open')

      document.body.removeChild(triggerEl)
    })

    it('패널을 trigger 중심 x 기준으로 가로 중앙에 배치한다', () => {
      // trigger: left=300, width=200 → center=400
      // panelWidth=200 → x = 400 - 100 = 300
      const triggerEl = makeTriggerEl({ left: 300, top: 760, width: 200 })
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, { options: { panelWidth: 200, panelHeight: 300 } }))

      act(() => { resultRef.current?.open(makeMouseEvent(400, 760)) })

      expect(resultRef.current?.placement.x).toBe(300)

      document.body.removeChild(triggerEl)
    })

    it('trigger top 기반으로 y를 계산한다 (triggerTop - gap - panelHeight)', () => {
      // trigger: top=760
      // ATTACHED_GAP=10, panelHeight=300 → y = 760 - 10 - 300 = 450
      const triggerEl = makeTriggerEl({ left: 300, top: 760, width: 48 })
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, { options: { panelWidth: 200, panelHeight: 300 } }))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })

      // y = 760 - 10 - 300 = 450
      expect(resultRef.current?.placement.y).toBe(450)

      document.body.removeChild(triggerEl)
    })

    it('패널이 오른쪽 경계를 벗어나면 x를 클램프한다', () => {
      // trigger center at 1200, panelWidth=200 → naive x=1100
      // viewportWidth = window.innerWidth (jsdom: 1024) → max = 1024-200 = 824
      const triggerEl = makeTriggerEl({ left: 1176, top: 760, width: 48 })
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, { options: { panelWidth: 200, panelHeight: 300 } }))

      act(() => { resultRef.current?.open(makeMouseEvent(1200, 760)) })

      const vw = window.innerWidth
      expect(resultRef.current?.placement.x).toBe(vw - 200)

      document.body.removeChild(triggerEl)
    })

    it('패널이 뷰포트 상단을 벗어나도 수직 클램프 없이 음수 y를 그대로 반환한다', () => {
      // trigger top=100, panelHeight=300, gap=10 → y = 100 - 10 - 300 = -210 (no vertical clamp)
      const triggerEl = makeTriggerEl({ left: 300, top: 100, width: 48 })
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, { options: { panelWidth: 200, panelHeight: 300 } }))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 100)) })

      expect(resultRef.current?.placement.y).toBe(-210)

      document.body.removeChild(triggerEl)
    })
  })

  describe('surfaceProps.ref — mounted surface root 등록', () => {
    it('surfaceProps.ref에 DOM 요소를 할당하면 whitelist로 등록된다', () => {
      const triggerEl = makeTriggerEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })

      const surfaceEl = document.createElement('div')
      act(() => {
        // Simulate ref assignment (as React would do)
        resultRef.current!.surfaceProps.ref.current = surfaceEl
      })

      expect(resultRef.current?.surfaceProps.ref.current).toBe(surfaceEl)

      document.body.removeChild(triggerEl)
    })
  })

  describe('Escape 키 dismiss — global (focus 무관)', () => {
    it('패널이 열린 상태에서 document keydown Escape를 누르면 닫힌다', () => {
      const triggerEl = makeTriggerEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      expect(resultRef.current?.isOpen).toBe(true)

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      })

      expect(resultRef.current?.phase).toBe('closing')

      document.body.removeChild(triggerEl)
    })

    it('패널이 닫힌 상태에서 Escape를 눌러도 아무 일도 없다', () => {
      const triggerRef = createRef<HTMLElement>()
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, {}))

      expect(resultRef.current?.isOpen).toBe(false)

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      })

      expect(resultRef.current?.isOpen).toBe(false)
    })
  })

  describe('outside click dismiss', () => {
    it('surface 외부 pointerdown 시 닫힌다', () => {
      const triggerEl = makeTriggerEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      expect(resultRef.current?.isOpen).toBe(true)

      act(() => {
        document.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      })

      expect(resultRef.current?.phase).toBe('closing')

      document.body.removeChild(triggerEl)
    })

    it('trigger 요소 내부 pointerdown은 닫히지 않는다 (whitelist)', () => {
      const triggerEl = makeTriggerEl()
      document.body.appendChild(triggerEl)
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      expect(resultRef.current?.isOpen).toBe(true)

      act(() => {
        triggerEl.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      })

      expect(resultRef.current?.isOpen).toBe(true)

      document.body.removeChild(triggerEl)
    })

    it('surface root 내부 pointerdown은 닫히지 않는다 (whitelist)', () => {
      const triggerEl = makeTriggerEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      expect(resultRef.current?.isOpen).toBe(true)

      // Register surface root
      const surfaceEl = document.createElement('div')
      document.body.appendChild(surfaceEl)
      act(() => {
        resultRef.current!.surfaceProps.ref.current = surfaceEl
      })

      act(() => {
        surfaceEl.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      })

      expect(resultRef.current?.isOpen).toBe(true)

      document.body.removeChild(triggerEl)
      document.body.removeChild(surfaceEl)
    })
  })

  describe('중복 close 요청은 no-op', () => {
    it('close()를 두 번 연속 호출해도 한 번만 처리된다', () => {
      const triggerEl = makeTriggerEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      expect(resultRef.current?.isOpen).toBe(true)

      act(() => { resultRef.current?.close() })
      expect(resultRef.current?.phase).toBe('closing')

      // 두 번째 close는 no-op — phase는 여전히 'closing'
      act(() => { resultRef.current?.close() })
      expect(resultRef.current?.phase).toBe('closing')

      document.body.removeChild(triggerEl)
    })
  })

  describe('닫을 때 포커스 복원', () => {
    it('onExitComplete 호출 시 triggerRef.current.focus()를 실행한다', () => {
      const triggerEl = document.createElement('button')
      const focusSpy = vi.spyOn(triggerEl, 'focus')
      vi.spyOn(triggerEl, 'getBoundingClientRect').mockReturnValue({
        left: 300, top: 760, width: 48, height: 40,
        right: 348, bottom: 800, x: 300, y: 760,
        toJSON: () => ({}),
      } as DOMRect)
      document.body.appendChild(triggerEl)

      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      act(() => { resultRef.current?.close() })
      act(() => { resultRef.current?.onExitComplete() })

      expect(focusSpy).toHaveBeenCalled()
      document.body.removeChild(triggerEl)
    })
  })

  describe('closing phase lifecycle', () => {
    it('full motion에서 close() 후 phase가 "closing"을 유지한다', () => {
      const triggerEl = makeTriggerEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      act(() => { resultRef.current?.close() })

      expect(resultRef.current?.phase).toBe('closing')
      expect(resultRef.current?.isOpen).toBe(true)

      document.body.removeChild(triggerEl)
    })

    it('onExitComplete 후 isOpen이 false가 되고 phase가 "opening"으로 리셋된다', () => {
      const triggerEl = makeTriggerEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      act(() => { resultRef.current?.close() })
      act(() => { resultRef.current?.onExitComplete() })

      expect(resultRef.current?.isOpen).toBe(false)
      expect(resultRef.current?.phase).toBe('opening')

      document.body.removeChild(triggerEl)
    })
  })

  describe('reduced motion 즉시 완료', () => {
    it('closing phase 없이 close() 직후 isOpen이 false가 된다', () => {
      const triggerEl = makeTriggerEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, { options: { motionPreference: 'reduced' } }))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      expect(resultRef.current?.isOpen).toBe(true)

      act(() => { resultRef.current?.close() })
      expect(resultRef.current?.isOpen).toBe(false)
      expect(resultRef.current?.phase).toBe('opening')

      document.body.removeChild(triggerEl)
    })

    it('reduced motion close() 호출 시 즉시 포커스를 복원한다', () => {
      const triggerEl = document.createElement('button')
      const focusSpy = vi.spyOn(triggerEl, 'focus')
      vi.spyOn(triggerEl, 'getBoundingClientRect').mockReturnValue({
        left: 300, top: 760, width: 48, height: 40,
        right: 348, bottom: 800, x: 300, y: 760,
        toJSON: () => ({}),
      } as DOMRect)
      document.body.appendChild(triggerEl)

      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef)
      render(createElement(Harness, { options: { motionPreference: 'reduced' } }))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      act(() => { resultRef.current?.close() })

      expect(focusSpy).toHaveBeenCalled()
      document.body.removeChild(triggerEl)
    })
  })
})
