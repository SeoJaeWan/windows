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

  describe('수평 배치', () => {
    it('패널을 pointerX 기준으로 가로 중앙에 배치한다', () => {
      const result = calculateTaskbarPlacement({ ...BASE, pointerX: 600, pointerY: 750 })
      // x = pointerX - panelWidth / 2 = 600 - 100 = 500
      expect(result.x).toBe(500)
    })

    it('패널이 왼쪽 경계를 벗어나면 x를 0으로 클램프한다', () => {
      const result = calculateTaskbarPlacement({ ...BASE, pointerX: 50, pointerY: 750 })
      // x = 50 - 100 = -50 → clamped to 0
      expect(result.x).toBe(0)
    })

    it('패널이 오른쪽 경계를 벗어나면 x를 viewportWidth - panelWidth로 클램프한다', () => {
      const result = calculateTaskbarPlacement({ ...BASE, pointerX: 1250, pointerY: 750 })
      // x = 1250 - 100 = 1150, max = 1280 - 200 = 1080 → clamped to 1080
      expect(result.x).toBe(1080)
    })

    it('pointerX가 왼쪽 끝에 있으면 x를 정확히 0에 배치한다', () => {
      const result = calculateTaskbarPlacement({ ...BASE, pointerX: 0, pointerY: 750 })
      expect(result.x).toBe(0)
    })

    it('pointerX가 오른쪽 끝에 있으면 x를 최댓값에 배치한다', () => {
      const result = calculateTaskbarPlacement({ ...BASE, pointerX: 1280, pointerY: 750 })
      expect(result.x).toBe(1080) // 1280 - 200
    })
  })

  describe('수직 배치', () => {
    it('패널을 포인터 원점 위에 배치한다', () => {
      const result = calculateTaskbarPlacement({ ...BASE, pointerX: 600, pointerY: 750 })
      // y = pointerY - panelHeight = 750 - 300 = 450
      expect(result.y).toBe(450)
    })

    it('패널이 상단 경계를 벗어나면 y를 0으로 클램프한다', () => {
      const result = calculateTaskbarPlacement({ ...BASE, pointerX: 600, pointerY: 100 })
      // y = 100 - 300 = -200 → clamped to 0
      expect(result.y).toBe(0)
    })

    it('패널이 하단 경계를 벗어나면 y를 viewportHeight - panelHeight로 클램프한다', () => {
      const result = calculateTaskbarPlacement({ ...BASE, pointerX: 600, pointerY: 900 })
      // y = 900 - 300 = 600, max = 800 - 300 = 500 → clamped to 500
      expect(result.y).toBe(500)
    })
  })

  describe('x, y 동시 클램프', () => {
    it('x와 y를 각각 독립적으로 클램프한다', () => {
      const result = calculateTaskbarPlacement({ ...BASE, pointerX: 10, pointerY: 10 })
      expect(result.x).toBe(0)
      expect(result.y).toBe(0)
    })
  })

  describe('엣지 케이스', () => {
    it('패널이 뷰포트 너비와 정확히 일치할 때를 처리한다', () => {
      const result = calculateTaskbarPlacement({
        ...BASE,
        panelWidth: 1280,
        pointerX: 640,
        pointerY: 750,
      })
      expect(result.x).toBe(0)
    })

    it('패널이 뷰포트 높이와 정확히 일치할 때를 처리한다', () => {
      const result = calculateTaskbarPlacement({
        ...BASE,
        panelHeight: 800,
        pointerX: 600,
        pointerY: 750,
      })
      expect(result.y).toBe(0)
    })
  })
})
