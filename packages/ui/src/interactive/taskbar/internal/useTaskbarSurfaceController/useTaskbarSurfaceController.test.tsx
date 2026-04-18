import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createElement, createRef, type ReactNode, type RefObject } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { act } from 'react'

// Required for React's act() to work in jsdom
// @ts-expect-error global flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

import { useTaskbarSurfaceController } from '.'
import type {
  TaskbarSurfaceControllerOptions,
  TaskbarSurfaceControllerResult,
} from '.'

/* ── Harness ─────────────────────────────────────────────────── */

function createHarness(options?: TaskbarSurfaceControllerOptions) {
  const resultRef: { current: TaskbarSurfaceControllerResult | null } = {
    current: null,
  }

  function Harness({ opts }: { opts?: TaskbarSurfaceControllerOptions }) {
    const result = useTaskbarSurfaceController(opts)
    resultRef.current = result
    return null
  }

  return { resultRef, Harness, options }
}

/* ── DOM 픽스처 헬퍼 ─────────────────────────────────────────── */

function makeDomEl(rect: Partial<DOMRect> = {}) {
  const el = document.createElement('div')
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    left: rect.left ?? 0,
    top: rect.top ?? 0,
    width: rect.width ?? 0,
    height: rect.height ?? 0,
    right: (rect.left ?? 0) + (rect.width ?? 0),
    bottom: (rect.top ?? 0) + (rect.height ?? 0),
    x: rect.left ?? 0,
    y: rect.top ?? 0,
    toJSON: () => ({}),
  } as DOMRect)
  document.body.appendChild(el)
  return el
}

function makeTriggerRef(rect: Partial<DOMRect> = {}): RefObject<HTMLElement | null> {
  const el = makeDomEl(rect)
  return { current: el } as RefObject<HTMLElement | null>
}

function makeTaskbarRootRef(rect: Partial<DOMRect> = {}): RefObject<HTMLElement | null> {
  const el = makeDomEl(rect)
  return { current: el } as RefObject<HTMLElement | null>
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
  // Remove any stray elements added during tests
  document
    .querySelectorAll('body > div:not(#root)')
    .forEach((el) => el.parentNode?.removeChild(el))
})

function render(ui: ReactNode) {
  act(() => {
    root.render(ui)
  })
}

/* ── Tests ───────────────────────────────────────────────────── */

describe('useTaskbarSurfaceController', () => {
  describe('초기 상태', () => {
    it('마운트 직후 isOpen이 false다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      expect(resultRef.current?.isOpen).toBe(false)
    })

    it('초기 phase가 "opening"이다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      expect(resultRef.current?.phase).toBe('opening')
    })

    it('open, close, onExitComplete를 함수로 노출한다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      expect(typeof resultRef.current?.open).toBe('function')
      expect(typeof resultRef.current?.close).toBe('function')
      expect(typeof resultRef.current?.onExitComplete).toBe('function')
    })

    it('surfaceRootRef를 MutableRefObject로 노출한다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      expect(resultRef.current?.surfaceRootRef).toBeDefined()
      expect(typeof resultRef.current?.surfaceRootRef).toBe('object')
    })
  })

  describe('explicit ref input contract', () => {
    it('triggerRef.current가 null이면 warn + no-op (isOpen 변화 없음)', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const nullTriggerRef = createRef<HTMLElement>()
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(nullTriggerRef, taskbarRootRef)
      })

      expect(resultRef.current?.isOpen).toBe(false)
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('triggerRef.current is null')
      )
    })

    it('taskbarRootRef.current가 null이면 warn + no-op (isOpen 변화 없음)', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const nullTaskbarRef = createRef<HTMLElement>()

      act(() => {
        resultRef.current!.open(triggerRef, nullTaskbarRef)
      })

      expect(resultRef.current?.isOpen).toBe(false)
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('taskbarRootRef.current is null')
      )
    })
  })

  describe('opening → open 경로', () => {
    it('open() 호출 후 isOpen이 true가 된다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })

      expect(resultRef.current?.isOpen).toBe(true)
    })

    it('open() 호출 후 phase가 "open"이 된다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })

      expect(resultRef.current?.phase).toBe('open')
    })

    it('open() 호출 시 measured rect 기반으로 placement를 계산한다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      // trigger: left=576, width=48 → centerX=600
      // surface: not mounted → width=0 → x = 600 - 0 = 600, clamped to min(600, 1280-0)=600
      // taskbarRoot: top=758, height=40
      // y = 758 - 10 - 0 = 748 (surfaceRect.height=0 since not mounted)
      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })

      // With surfaceRootRef.current = null → surfaceRect height = 0
      // y = 758 - 10 - 0 = 748
      expect(resultRef.current?.placement.y).toBe(748)
    })
  })

  describe('open → closing 경로', () => {
    it('close() 호출 후 phase가 "closing"이 된다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })

      act(() => {
        resultRef.current!.close()
      })

      expect(resultRef.current?.phase).toBe('closing')
      expect(resultRef.current?.isOpen).toBe(true)
    })

    it('onExitComplete 호출 후 isOpen이 false가 되고 phase가 "opening"으로 리셋된다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      act(() => {
        resultRef.current!.close()
      })
      act(() => {
        resultRef.current!.onExitComplete()
      })

      expect(resultRef.current?.isOpen).toBe(false)
      expect(resultRef.current?.phase).toBe('opening')
    })

    it('중복 close() 요청은 no-op이다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      act(() => {
        resultRef.current!.close()
      })
      expect(resultRef.current?.phase).toBe('closing')

      // 두 번째 close는 no-op
      act(() => {
        resultRef.current!.close()
      })
      expect(resultRef.current?.phase).toBe('closing')
    })
  })

  describe('reduced motion 즉시 finalize', () => {
    it('reduced motion에서 close() 직후 isOpen이 false가 된다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { opts: { motionPreference: 'reduced' } }))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      expect(resultRef.current?.isOpen).toBe(true)

      act(() => {
        resultRef.current!.close()
      })

      expect(resultRef.current?.isOpen).toBe(false)
      expect(resultRef.current?.phase).toBe('opening')
    })

    it('reduced motion에서 onExitComplete 호출 없이도 finalize가 완료된다', () => {
      const onFinalize = vi.fn()
      const { resultRef, Harness } = createHarness()
      render(
        createElement(Harness, {
          opts: { motionPreference: 'reduced', onFinalize },
        })
      )

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      act(() => {
        resultRef.current!.close()
      })

      // onExitComplete를 호출하지 않아도 onFinalize가 불려야 한다
      expect(onFinalize).toHaveBeenCalledTimes(1)
    })
  })

  describe('stale closing completion은 reopen 이후 무효', () => {
    it('close() 후 open()을 다시 호출하면 이후 onExitComplete는 무시된다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      // 열기
      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      expect(resultRef.current?.isOpen).toBe(true)

      // 닫기 시작
      act(() => {
        resultRef.current!.close()
      })
      expect(resultRef.current?.phase).toBe('closing')

      // 애니메이션 완료 전 다시 열기 (latest intent wins)
      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      expect(resultRef.current?.isOpen).toBe(true)
      expect(resultRef.current?.phase).toBe('open')

      // stale onExitComplete — 무시되어야 한다
      act(() => {
        resultRef.current!.onExitComplete()
      })

      // 여전히 열려 있어야 한다
      expect(resultRef.current?.isOpen).toBe(true)
      expect(resultRef.current?.phase).toBe('open')
    })
  })

  describe('onFinalize 콜백', () => {
    it('full motion에서 onExitComplete 후 onFinalize가 호출된다', () => {
      const onFinalize = vi.fn()
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { opts: { onFinalize } }))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      act(() => {
        resultRef.current!.close()
      })
      act(() => {
        resultRef.current!.onExitComplete()
      })

      expect(onFinalize).toHaveBeenCalledTimes(1)
    })

    it('열린 상태에서 close() 없이 onExitComplete를 호출해도 onFinalize가 불리지 않는다', () => {
      const onFinalize = vi.fn()
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { opts: { onFinalize } }))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })

      // close() 없이 onExitComplete 호출 — no-op
      act(() => {
        resultRef.current!.onExitComplete()
      })

      expect(onFinalize).not.toHaveBeenCalled()
      expect(resultRef.current?.isOpen).toBe(true)
    })
  })

  describe('document dismiss — Escape 키', () => {
    it('패널이 열린 상태에서 Escape를 누르면 닫힌다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      expect(resultRef.current?.isOpen).toBe(true)

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      })

      expect(resultRef.current?.phase).toBe('closing')
    })

    it('패널이 닫힌 상태에서 Escape를 눌러도 아무 일도 없다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      })

      expect(resultRef.current?.isOpen).toBe(false)
    })
  })

  describe('document dismiss — outside pointerdown', () => {
    it('surface 외부 pointerdown 시 닫힌다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })

      act(() => {
        document.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      })

      expect(resultRef.current?.phase).toBe('closing')
    })

    it('trigger 요소 내부 pointerdown은 닫히지 않는다 (whitelist)', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerEl = makeDomEl({ left: 576, top: 748, width: 48, height: 40 })
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement | null>
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      expect(resultRef.current?.isOpen).toBe(true)

      act(() => {
        triggerEl.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      })

      expect(resultRef.current?.isOpen).toBe(true)
    })

    it('surfaceRoot 요소 내부 pointerdown은 닫히지 않는다 (whitelist)', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      expect(resultRef.current?.isOpen).toBe(true)

      // surfaceRootRef에 DOM 요소 등록
      const surfaceEl = document.createElement('div')
      document.body.appendChild(surfaceEl)
      act(() => {
        resultRef.current!.surfaceRootRef.current = surfaceEl
      })

      act(() => {
        surfaceEl.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      })

      expect(resultRef.current?.isOpen).toBe(true)
    })

    it('taskbarRoot 요소 내부 pointerdown은 닫히지 않는다 (whitelist)', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootEl = makeDomEl({ top: 758, height: 40, width: 1280 })
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement | null>

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      expect(resultRef.current?.isOpen).toBe(true)

      act(() => {
        taskbarRootEl.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      })

      expect(resultRef.current?.isOpen).toBe(true)
    })
  })

  describe('세션 활성 중에만 document listener 유지', () => {
    it('close + onExitComplete 후 Escape를 눌러도 닫히지 않는다 (listener 정리됨)', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      act(() => {
        resultRef.current!.close()
      })
      act(() => {
        resultRef.current!.onExitComplete()
      })
      expect(resultRef.current?.isOpen).toBe(false)

      // listener가 정리됐으므로 Escape는 no-op
      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      })

      expect(resultRef.current?.isOpen).toBe(false)
    })
  })
})
