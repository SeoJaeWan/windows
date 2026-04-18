/**
 * taskbarContextPanel.compare.test
 *
 * Visual baseline owner for the attached-host context panel composition.
 *
 * Role: static compare story DOM contract — NOT a runtime parity owner.
 * This file locks the [data-visual-root] selector, CompareRoot metadata,
 * frozen composition layout, and capture-time surface state.
 *
 * What this owner locks:
 *   - [data-visual-root] / data-visual-kind / data-visual-state selector contract
 *   - Trigger icon presence (attached-host composition)
 *   - Context surface presence in rested open state (data-phase='open')
 *   - Surface wrapper left/top are numeric-derived frozen canvas geometry
 *     (row-derived CONTEXT_MENU_HEIGHT constant — for static capture alignment only)
 *   - CONTEXT_PINNED appRows count, appIdentifier, pin/close-all rows
 *
 * What this owner does NOT lock:
 *   - Runtime measured placement (live DOMRect from trigger + taskbarRoot)
 *   - Row-derived top/height as runtime canonical truth
 *     (panelWidth/panelHeight are NOT used for placement in the live hook)
 *   - Motion lifecycle (opening → open → closing transitions)
 *   - Missing ref warn/no-op, duplicate close no-op, latest intent wins
 *   - Focus restore behavior
 *   Those contracts are owned by useTaskbarContextPanel unit tests and
 *   taskbarBehaviorStories.runtime.test.tsx.
 *
 * Convention: describe/it text is Korean; component names stay in English.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";

// Required for React's act() to work in jsdom
// @ts-expect-error global flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

import CompareRoot from "../../../components/taskbar/storybook/compareRoot";
import { TaskbarContextPanelCompareHarness } from "./taskbarContextPanelCompareHarness";

/* ── Setup ───────────────────────────────────────────────────── */

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function render(ui: React.ReactNode) {
  act(() => {
    root.render(ui);
  });
}

/* ── CompareAttachedPinned DOM 계약 ──────────────────────────── */

describe("CompareAttachedPinned — DOM 계약", () => {
  it("[data-visual-root]가 정확히 하나 존재한다", () => {
    render(
      createElement(CompareRoot, { kind: "taskbar-context-menu", state: "attached-pinned" },
        createElement(TaskbarContextPanelCompareHarness)
      )
    );

    const roots = container.querySelectorAll("[data-visual-root]");
    expect(roots.length).toBe(1);
  });

  it("data-visual-kind가 정확히 'taskbar-context-menu'다", () => {
    render(
      createElement(CompareRoot, { kind: "taskbar-context-menu", state: "attached-pinned" },
        createElement(TaskbarContextPanelCompareHarness)
      )
    );

    const visualRoot = container.querySelector("[data-visual-root]") as HTMLElement | null;
    expect(visualRoot).not.toBeNull();
    expect(visualRoot!.getAttribute("data-visual-kind")).toBe("taskbar-context-menu");
  });

  it("data-visual-state가 정확히 'attached-pinned'다", () => {
    render(
      createElement(CompareRoot, { kind: "taskbar-context-menu", state: "attached-pinned" },
        createElement(TaskbarContextPanelCompareHarness)
      )
    );

    const visualRoot = container.querySelector("[data-visual-root]") as HTMLElement | null;
    expect(visualRoot).not.toBeNull();
    expect(visualRoot!.getAttribute("data-visual-state")).toBe("attached-pinned");
  });

  it("[data-visual-root][data-visual-kind='taskbar-context-menu'][data-visual-state='attached-pinned'] 셀렉터가 정확히 하나 매칭된다", () => {
    render(
      createElement(CompareRoot, { kind: "taskbar-context-menu", state: "attached-pinned" },
        createElement(TaskbarContextPanelCompareHarness)
      )
    );

    const matches = container.querySelectorAll(
      '[data-visual-root][data-visual-kind="taskbar-context-menu"][data-visual-state="attached-pinned"]'
    );
    expect(matches.length).toBe(1);
  });
});

/* ── attached-host owner 검증 ──────────────────────────────────── */

describe("TaskbarContextPanelCompareHarness — attached-host 소유자", () => {
  it("trigger icon이 DOM에 포함된다", () => {
    render(
      createElement(CompareRoot, { kind: "taskbar-context-menu", state: "attached-pinned" },
        createElement(TaskbarContextPanelCompareHarness)
      )
    );

    const trigger = container.querySelector("[data-testid='compare-trigger']");
    expect(trigger).not.toBeNull();
  });

  it("context surface가 DOM에 포함된다 (data-state='context-pinned')", () => {
    render(
      createElement(CompareRoot, { kind: "taskbar-context-menu", state: "attached-pinned" },
        createElement(TaskbarContextPanelCompareHarness)
      )
    );

    const surface = container.querySelector("[data-state='context-pinned']");
    expect(surface).not.toBeNull();
  });

  it("context surface phase가 'open'(rested state)이다", () => {
    render(
      createElement(CompareRoot, { kind: "taskbar-context-menu", state: "attached-pinned" },
        createElement(TaskbarContextPanelCompareHarness)
      )
    );

    const surface = container.querySelector("[data-phase='open']");
    expect(surface).not.toBeNull();
  });

  it("surface wrapper의 left style이 '50%'가 아니다 (캡처 캔버스 배치 계약)", () => {
    // Visual baseline: the static harness places the surface at
    // TRIGGER_CENTER_X - PANEL_WIDTH / 2 — not a fixed 50% offset.
    // This is a frozen capture canvas geometry assertion — NOT a live DOMRect claim.
    render(
      createElement(CompareRoot, { kind: "taskbar-context-menu", state: "attached-pinned" },
        createElement(TaskbarContextPanelCompareHarness)
      )
    );

    const wrapper = container.querySelector("[data-testid='compare-surface-wrapper']") as HTMLElement | null;
    expect(wrapper).not.toBeNull();
    expect(wrapper!.style.left).not.toBe("50%");
  });

  it("surface wrapper의 left가 숫자값(px)에서 파생된다 (캡처 캔버스 고정 배치)", () => {
    // Visual baseline: frozen capture canvas geometry.
    // left = CANVAS_WIDTH/2 - PANEL_WIDTH/2 (static constant).
    // Runtime measured placement is owned by useTaskbarContextPanel unit tests.
    render(
      createElement(CompareRoot, { kind: "taskbar-context-menu", state: "attached-pinned" },
        createElement(TaskbarContextPanelCompareHarness)
      )
    );

    const wrapper = container.querySelector("[data-testid='compare-surface-wrapper']") as HTMLElement | null;
    expect(wrapper).not.toBeNull();

    const leftValue = wrapper!.style.left;
    // left는 빈 문자열이 아니어야 한다 (position이 설정됨)
    expect(leftValue).toBeTruthy();

    // 숫자로 파싱 가능하거나 px suffix를 가져야 한다
    const leftPx = parseFloat(leftValue);
    expect(isNaN(leftPx)).toBe(false);
  });

  it("surface wrapper의 top이 숫자값(px)으로 고정된다 (캡처 캔버스 row-derived 배치 — runtime canonical truth 아님)", () => {
    // Visual baseline: top is derived from CONTEXT_MENU_HEIGHT (row-derived constant)
    // to align the surface above the trigger for the static capture canvas.
    // This is NOT a runtime parity claim — panelWidth/panelHeight are NOT used for
    // placement truth in the live hook (useTaskbarSurfaceController uses measured DOMRects).
    render(
      createElement(CompareRoot, { kind: "taskbar-context-menu", state: "attached-pinned" },
        createElement(TaskbarContextPanelCompareHarness)
      )
    );

    const wrapper = container.querySelector("[data-testid='compare-surface-wrapper']") as HTMLElement | null;
    expect(wrapper).not.toBeNull();

    const topValue = wrapper!.style.top;
    // top은 빈 문자열이 아니어야 한다
    expect(topValue).toBeTruthy();

    // 숫자로 파싱 가능해야 한다
    const topPx = parseFloat(topValue);
    expect(isNaN(topPx)).toBe(false);
    // top은 양수 값 (canvas 안쪽 위치)
    expect(topPx).toBeGreaterThan(0);
  });

  it("CONTEXT_PINNED appRows(3개) 모두 surface에 렌더링된다", () => {
    render(
      createElement(CompareRoot, { kind: "taskbar-context-menu", state: "attached-pinned" },
        createElement(TaskbarContextPanelCompareHarness)
      )
    );

    const appRows = container.querySelectorAll("[data-app-row]");
    expect(appRows.length).toBe(3);
  });

  it("CONTEXT_PINNED appIdentifier row가 렌더링된다", () => {
    render(
      createElement(CompareRoot, { kind: "taskbar-context-menu", state: "attached-pinned" },
        createElement(TaskbarContextPanelCompareHarness)
      )
    );

    const identifier = container.querySelector("[data-app-identifier]");
    expect(identifier).not.toBeNull();
    expect(identifier!.textContent).toContain("블로그");
  });

  it("pin-taskbar row가 '작업 표시줄에서 제거' 텍스트로 렌더링된다 (pinned state)", () => {
    render(
      createElement(CompareRoot, { kind: "taskbar-context-menu", state: "attached-pinned" },
        createElement(TaskbarContextPanelCompareHarness)
      )
    );

    const pinRow = container.querySelector("[data-action-id='pin-taskbar']");
    expect(pinRow).not.toBeNull();
    expect(pinRow!.textContent).toContain("작업 표시줄에서 제거");
  });

  it("close-all row가 렌더링된다", () => {
    render(
      createElement(CompareRoot, { kind: "taskbar-context-menu", state: "attached-pinned" },
        createElement(TaskbarContextPanelCompareHarness)
      )
    );

    const closeAllRow = container.querySelector("[data-action-id='close-all']");
    expect(closeAllRow).not.toBeNull();
    expect(closeAllRow!.textContent).toContain("모든 창 닫기");
  });
});
