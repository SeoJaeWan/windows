import { describe, it, expect } from 'vitest'
import { calculateTaskbarPlacement } from '.'

/* ── Tests ───────────────────────────────────────────────────── */

describe('calculateTaskbarPlacement', () => {
  const BASE = {
    panelWidth: 200,
    panelHeight: 300,
    viewportWidth: 1280,
    viewportHeight: 800,
  }

  // ATTACHED_GAP = 10 (file-local constant)
  // y = triggerTop - 10 - panelHeight

  describe('수평 배치 — trigger 중심 기준', () => {
    it('패널을 triggerCenterX 기준으로 가로 중앙에 배치한다', () => {
      const result = calculateTaskbarPlacement({
        ...BASE,
        triggerAnchor: { triggerCenterX: 600, triggerTop: 760 },
      })
      // x = 600 - 200/2 = 500
      expect(result.x).toBe(500)
    })

    it('패널이 왼쪽 경계를 벗어나면 x를 0으로 클램프한다', () => {
      const result = calculateTaskbarPlacement({
        ...BASE,
        triggerAnchor: { triggerCenterX: 50, triggerTop: 760 },
      })
      // x = 50 - 100 = -50 → clamped to 0
      expect(result.x).toBe(0)
    })

    it('패널이 오른쪽 경계를 벗어나면 x를 viewportWidth - panelWidth로 클램프한다', () => {
      const result = calculateTaskbarPlacement({
        ...BASE,
        triggerAnchor: { triggerCenterX: 1250, triggerTop: 760 },
      })
      // x = 1250 - 100 = 1150, max = 1280 - 200 = 1080 → clamped to 1080
      expect(result.x).toBe(1080)
    })

    it('triggerCenterX가 왼쪽 끝에 있으면 x를 정확히 0에 배치한다', () => {
      const result = calculateTaskbarPlacement({
        ...BASE,
        triggerAnchor: { triggerCenterX: 0, triggerTop: 760 },
      })
      expect(result.x).toBe(0)
    })

    it('triggerCenterX가 오른쪽 끝에 있으면 x를 최댓값에 배치한다', () => {
      const result = calculateTaskbarPlacement({
        ...BASE,
        triggerAnchor: { triggerCenterX: 1280, triggerTop: 760 },
      })
      expect(result.x).toBe(1080) // 1280 - 200
    })
  })

  describe('수직 배치 — trigger 상단 기준 gap', () => {
    it('triggerTop에서 gap+panelHeight만큼 위에 배치한다', () => {
      const result = calculateTaskbarPlacement({
        ...BASE,
        triggerAnchor: { triggerCenterX: 600, triggerTop: 760 },
      })
      // y = 760 - 10 - 300 = 450
      expect(result.y).toBe(450)
    })

    it('triggerTop이 작아 패널이 상단을 벗어나면 y를 0으로 클램프한다', () => {
      const result = calculateTaskbarPlacement({
        ...BASE,
        triggerAnchor: { triggerCenterX: 600, triggerTop: 100 },
      })
      // y = 100 - 10 - 300 = -210 → clamped to 0
      expect(result.y).toBe(0)
    })

    it('triggerTop 기반 y가 viewportHeight - panelHeight를 초과하면 클램프한다', () => {
      const result = calculateTaskbarPlacement({
        ...BASE,
        triggerAnchor: { triggerCenterX: 600, triggerTop: 810 },
        viewportHeight: 800,
      })
      // y = 810 - 10 - 300 = 500, max = 800 - 300 = 500 → exactly at boundary
      expect(result.y).toBe(500)
    })
  })

  describe('x, y 동시 클램프', () => {
    it('x와 y를 각각 독립적으로 클램프한다', () => {
      const result = calculateTaskbarPlacement({
        ...BASE,
        triggerAnchor: { triggerCenterX: 10, triggerTop: 50 },
      })
      expect(result.x).toBe(0)
      expect(result.y).toBe(0)
    })
  })

  describe('엣지 케이스', () => {
    it('패널이 뷰포트 너비와 정확히 일치할 때를 처리한다', () => {
      const result = calculateTaskbarPlacement({
        ...BASE,
        panelWidth: 1280,
        triggerAnchor: { triggerCenterX: 640, triggerTop: 760 },
      })
      expect(result.x).toBe(0)
    })

    it('패널이 뷰포트 높이와 정확히 일치할 때를 처리한다', () => {
      const result = calculateTaskbarPlacement({
        ...BASE,
        panelHeight: 800,
        triggerAnchor: { triggerCenterX: 600, triggerTop: 760 },
      })
      expect(result.y).toBe(0)
    })
  })
})
