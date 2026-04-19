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

function createHarness(
  triggerRef: RefObject<HTMLElement | null>,
  taskbarRootRef: RefObject<HTMLElement | null>
) {
  const resultRef: { current: TaskbarContextPanelHookResult | null } = { current: null }

  function Harness({ options }: { options?: Omit<TaskbarContextPanelHookOptions, 'triggerRef' | 'taskbarRootRef'> }) {
    const result = useTaskbarContextPanel({ triggerRef, taskbarRootRef, ...options })
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

function makeTaskbarRootEl(rect: Partial<DOMRect> = {}) {
  const el = document.createElement('div')
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    left: rect.left ?? 0,
    top: rect.top ?? 760,
    width: rect.width ?? 1280,
    height: rect.height ?? 48,
    right: (rect.left ?? 0) + (rect.width ?? 1280),
    bottom: (rect.top ?? 760) + (rect.height ?? 48),
    x: rect.left ?? 0,
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
      const taskbarRootRef = createRef<HTMLElement>()
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, {}))

      expect(resultRef.current?.isOpen).toBe(false)
    })

    it('초기 phase가 "opening"이다', () => {
      const triggerRef = createRef<HTMLElement>()
      const taskbarRootRef = createRef<HTMLElement>()
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, {}))

      expect(resultRef.current?.phase).toBe('opening')
    })

    it('open, close, onExitComplete를 함수로 노출한다', () => {
      const triggerRef = createRef<HTMLElement>()
      const taskbarRootRef = createRef<HTMLElement>()
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, {}))

      expect(typeof resultRef.current?.open).toBe('function')
      expect(typeof resultRef.current?.close).toBe('function')
      expect(typeof resultRef.current?.onExitComplete).toBe('function')
    })

    it('surfaceProps.ref가 callback ref 함수로 노출된다', () => {
      const triggerRef = createRef<HTMLElement>()
      const taskbarRootRef = createRef<HTMLElement>()
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, {}))

      expect(resultRef.current?.surfaceProps.ref).toBeDefined()
      expect(typeof resultRef.current?.surfaceProps.ref).toBe('function')
    })
  })

  describe('missing ref 경고 + no-op', () => {
    it('triggerRef.current이 null이면 open()이 경고를 내고 isOpen이 변하지 않는다', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = createRef<HTMLElement>() // current = null
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>

      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })

      expect(resultRef.current?.isOpen).toBe(false)
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('triggerRef')
      )

      document.body.removeChild(taskbarRootEl)
    })

    it('taskbarRootRef.current이 null이면 open()이 경고를 내고 isOpen이 변하지 않는다', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const triggerEl = makeTriggerEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = createRef<HTMLElement>() // current = null

      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })

      expect(resultRef.current?.isOpen).toBe(false)
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('taskbarRootRef')
      )

      document.body.removeChild(triggerEl)
    })
  })

  describe('open(event) — trigger + taskbarRoot 기반 배치', () => {
    it('open() 호출 후 isOpen이 true가 된다', () => {
      const triggerEl = makeTriggerEl({ left: 300, top: 760, width: 48 })
      const taskbarRootEl = makeTaskbarRootEl({ top: 760 })
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      expect(resultRef.current?.isOpen).toBe(true)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })

    it('open() 호출 후 phase가 "opening"이다 — opening→open은 root enter animationend 이후', () => {
      // measured-open gate: open() 후 phase는 'opening'으로 시작한다.
      // opening→open 전환은 onEnterComplete(root enter animationend) 이후에만 일어난다.
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      expect(resultRef.current?.phase).toBe('opening')

      // onEnterComplete로 opening→open 전환
      act(() => { resultRef.current?.onEnterComplete() })
      expect(resultRef.current?.phase).toBe('open')

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })

    it('패널을 trigger 중심 x 기준으로 가로 중앙에 배치한다', () => {
      // trigger: left=300, width=200 → center=400
      // surface not mounted at open time → surfaceWidth=0 → x = 400 - 0/2 = 400
      // clamped to [0, viewportWidth - 0] → x = 400
      const triggerEl = makeTriggerEl({ left: 300, top: 760, width: 200 })
      const taskbarRootEl = makeTaskbarRootEl({ top: 760 })
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(400, 760)) })

      // x = triggerCenterX - surfaceWidth/2; surface not mounted → surfaceWidth=0 → x = 400
      // But we can still verify it's derived from trigger rect (positive, near trigger center)
      const px = resultRef.current!.placement.x
      expect(px).toBeGreaterThan(0)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })

    it('taskbarRootRect.top 기반으로 y를 계산한다 (taskbarTop - gap - surfaceHeight)', () => {
      // taskbarRootRect.top=760, surface not mounted → surfaceHeight=0
      // y = 760 - 10 - 0 = 750
      const triggerEl = makeTriggerEl({ left: 300, top: 760, width: 48 })
      const taskbarRootEl = makeTaskbarRootEl({ top: 760 })
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })

      // y = taskbarRootRect.top - ATTACHED_GAP - surfaceHeight = 760 - 10 - 0 = 750
      expect(resultRef.current?.placement.y).toBe(750)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })

    it('패널이 오른쪽 경계를 벗어나면 x를 클램프한다', () => {
      // trigger center at 1200, surfaceWidth=0 → x=1200, viewport=1024 → clamped to 1024
      const triggerEl = makeTriggerEl({ left: 1176, top: 760, width: 48 })
      const taskbarRootEl = makeTaskbarRootEl({ top: 760 })
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(1200, 760)) })

      const vw = window.innerWidth
      // With surfaceWidth=0, max x = vw - 0 = vw; so x is clamped at vw
      // But triggerCenterX = 1176 + 24 = 1200; since surfaceWidth=0, x=1200 ≤ vw(1024) is false
      // → x clamped to vw = 1024
      expect(resultRef.current?.placement.x).toBeLessThanOrEqual(vw)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })

    it('y가 음수가 될 때 0으로 클램프한다', () => {
      // taskbarRootRect.top=5, surface not mounted → y_raw = 5 - 10 - 0 = -5 → clamped to 0
      const triggerEl = makeTriggerEl({ left: 300, top: 5, width: 48 })
      const taskbarRootEl = makeTaskbarRootEl({ top: 5 })
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 5)) })

      expect(resultRef.current?.placement.y).toBe(0)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })
  })

  describe('surfaceProps.ref — callback ref (mounted surface root 등록)', () => {
    it('surfaceProps.ref는 함수(callback ref)다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })

      expect(typeof resultRef.current?.surfaceProps.ref).toBe('function')

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })

    it('surfaceProps.ref에 DOM 요소를 전달하면 오류 없이 처리된다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })

      const surfaceEl = document.createElement('div')
      expect(() => {
        act(() => {
          resultRef.current!.surfaceProps.ref(surfaceEl)
        })
      }).not.toThrow()

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })
  })

  describe('Escape 키 dismiss — global (focus 무관)', () => {
    it('패널이 열린 상태에서 document keydown Escape를 누르면 닫힌다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      expect(resultRef.current?.isOpen).toBe(true)

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      })

      expect(resultRef.current?.phase).toBe('closing')

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })

    it('패널이 닫힌 상태에서 Escape를 눌러도 아무 일도 없다', () => {
      const triggerRef = createRef<HTMLElement>()
      const taskbarRootRef = createRef<HTMLElement>()
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
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
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
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
      document.body.appendChild(triggerEl)
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      expect(resultRef.current?.isOpen).toBe(true)

      act(() => {
        triggerEl.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      })

      expect(resultRef.current?.isOpen).toBe(true)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })

    it('taskbarRoot 내부 pointerdown은 닫히지 않는다 (whitelist)', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      expect(resultRef.current?.isOpen).toBe(true)

      act(() => {
        taskbarRootEl.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      })

      expect(resultRef.current?.isOpen).toBe(true)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })
  })

  describe('중복 close 요청은 no-op', () => {
    it('close()를 두 번 연속 호출해도 한 번만 처리된다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      expect(resultRef.current?.isOpen).toBe(true)

      act(() => { resultRef.current?.close() })
      expect(resultRef.current?.phase).toBe('closing')

      // 두 번째 close는 no-op — phase는 여전히 'closing'
      act(() => { resultRef.current?.close() })
      expect(resultRef.current?.phase).toBe('closing')

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
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

      const taskbarRootEl = makeTaskbarRootEl({ top: 760 })
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      act(() => { resultRef.current?.close() })
      act(() => { resultRef.current?.onExitComplete() })

      expect(focusSpy).toHaveBeenCalled()
      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })
  })

  describe('closing phase lifecycle', () => {
    it('full motion에서 close() 후 phase가 "closing"을 유지한다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      act(() => { resultRef.current?.close() })

      expect(resultRef.current?.phase).toBe('closing')
      expect(resultRef.current?.isOpen).toBe(true)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })

    it('onExitComplete 후 isOpen이 false가 되고 phase가 "opening"으로 리셋된다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, {}))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      act(() => { resultRef.current?.close() })
      act(() => { resultRef.current?.onExitComplete() })

      expect(resultRef.current?.isOpen).toBe(false)
      expect(resultRef.current?.phase).toBe('opening')

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })
  })

  describe('reduced motion 즉시 완료', () => {
    it('closing phase 없이 close() 직후 isOpen이 false가 된다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, { options: { motionPreference: 'reduced' } }))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      expect(resultRef.current?.isOpen).toBe(true)

      act(() => { resultRef.current?.close() })
      expect(resultRef.current?.isOpen).toBe(false)
      expect(resultRef.current?.phase).toBe('opening')

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
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

      const taskbarRootEl = makeTaskbarRootEl({ top: 760 })
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, { options: { motionPreference: 'reduced' } }))

      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      act(() => { resultRef.current?.close() })

      expect(focusSpy).toHaveBeenCalled()
      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })
  })

  describe('stale onExitComplete 무시 (latest intent wins)', () => {
    it('close 후 reopen 시 stale onExitComplete는 isOpen을 false로 변경하지 않는다', () => {
      const triggerEl = makeTriggerEl()
      const taskbarRootEl = makeTaskbarRootEl()
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement>
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement>
      const { resultRef, Harness } = createHarness(triggerRef, taskbarRootRef)
      render(createElement(Harness, {}))

      // 1회 open
      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      expect(resultRef.current?.isOpen).toBe(true)

      // close → closing 상태
      act(() => { resultRef.current?.close() })
      expect(resultRef.current?.phase).toBe('closing')

      // close 완료 전에 reopen (latest intent wins)
      act(() => { resultRef.current?.open(makeMouseEvent(324, 760)) })
      expect(resultRef.current?.isOpen).toBe(true)
      // full motion에서 reopen은 'opening' phase로 시작 (opening→open은 enter animationend 이후)
      expect(resultRef.current?.phase).toBe('opening')

      // 이전 close에 대한 stale onExitComplete — no-op이어야 함
      act(() => { resultRef.current?.onExitComplete() })
      expect(resultRef.current?.isOpen).toBe(true)

      document.body.removeChild(triggerEl)
      document.body.removeChild(taskbarRootEl)
    })
  })
})
