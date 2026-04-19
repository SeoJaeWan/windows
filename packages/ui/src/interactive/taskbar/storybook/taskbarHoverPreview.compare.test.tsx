/**
 * taskbarHoverPreview.compare.test
 *
 * Visual baseline owner for the attached-host hover preview composition.
 *
 * Role: static compare story DOM contract — visual baseline only.
 * This file locks the [data-visual-root] selector, CompareRoot metadata,
 * frozen composition layout, and capture-time surface state.
 *
 * What this owner locks (visual baseline only):
 *   - [data-visual-root] / data-visual-kind / data-visual-state selector contract
 *   - Trigger icon presence (attached-host composition)
 *   - Hover surface presence in rested open state (data-phase='open')
 *   - Surface wrapper left is numeric-derived (not '50%')
 *   - Width override via surfaceProps.style.width (frozen capture canvas geometry)
 *   - HOVER_MULTI item count renders as expected preview cards
 *
 * What this owner does NOT lock (delegated to unit/runtime owners):
 *   - Runtime measured placement (live DOMRect from trigger + taskbarRoot)
 *   - Motion lifecycle (opening → open → closing transitions)
 *   - Phase persistence (measured-open gate, opening → open boundary)
 *   - Missing ref warn/no-op (hook unit owner)
 *   - Pointer-reset gate or dismiss behavior (hook unit owner)
 *   - Serial handoff queue choreography (host-owned, runtime owner)
 *   - No provisional visible snap proof (runtime owner boundary)
 *   - Hook difference vs useTaskbarContextPanel (focus restore, dismiss API) — hook unit owner
 *   Those contracts are owned by useTaskbarHoverPreview unit tests and
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
import { TaskbarHoverPreviewCompareHarness } from "./taskbarHoverPreviewCompareHarness";

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

/* ── CompareAttachedMulti DOM contract ────────────────────────── */

describe("CompareAttachedMulti — DOM 계약", () => {
  it("[data-visual-root]가 정확히 하나 존재한다", () => {
    render(
      createElement(CompareRoot, { kind: "taskbar-hover-preview", state: "attached-multi" },
        createElement(TaskbarHoverPreviewCompareHarness)
      )
    );

    const roots = container.querySelectorAll("[data-visual-root]");
    expect(roots.length).toBe(1);
  });

  it("data-visual-kind가 정확히 'taskbar-hover-preview'다", () => {
    render(
      createElement(CompareRoot, { kind: "taskbar-hover-preview", state: "attached-multi" },
        createElement(TaskbarHoverPreviewCompareHarness)
      )
    );

    const root = container.querySelector("[data-visual-root]") as HTMLElement | null;
    expect(root).not.toBeNull();
    expect(root!.getAttribute("data-visual-kind")).toBe("taskbar-hover-preview");
  });

  it("data-visual-state가 정확히 'attached-multi'다", () => {
    render(
      createElement(CompareRoot, { kind: "taskbar-hover-preview", state: "attached-multi" },
        createElement(TaskbarHoverPreviewCompareHarness)
      )
    );

    const root = container.querySelector("[data-visual-root]") as HTMLElement | null;
    expect(root).not.toBeNull();
    expect(root!.getAttribute("data-visual-state")).toBe("attached-multi");
  });

  it("[data-visual-root][data-visual-kind='taskbar-hover-preview'][data-visual-state='attached-multi'] 셀렉터가 정확히 하나 매칭된다", () => {
    render(
      createElement(CompareRoot, { kind: "taskbar-hover-preview", state: "attached-multi" },
        createElement(TaskbarHoverPreviewCompareHarness)
      )
    );

    const matches = container.querySelectorAll(
      '[data-visual-root][data-visual-kind="taskbar-hover-preview"][data-visual-state="attached-multi"]'
    );
    expect(matches.length).toBe(1);
  });
});

/* ── attached-host owner 검증 ──────────────────────────────────── */

describe("TaskbarHoverPreviewCompareHarness — attached-host 소유자", () => {
  it("trigger icon이 DOM에 포함된다", () => {
    render(
      createElement(CompareRoot, { kind: "taskbar-hover-preview", state: "attached-multi" },
        createElement(TaskbarHoverPreviewCompareHarness)
      )
    );

    const trigger = container.querySelector("[data-testid='compare-trigger']");
    expect(trigger).not.toBeNull();
  });

  it("hover surface가 DOM에 포함된다 (data-state='hover-multi')", () => {
    render(
      createElement(CompareRoot, { kind: "taskbar-hover-preview", state: "attached-multi" },
        createElement(TaskbarHoverPreviewCompareHarness)
      )
    );

    const surface = container.querySelector("[data-state='hover-multi']");
    expect(surface).not.toBeNull();
  });

  it("surface phase가 'open'(rested state)이다", () => {
    render(
      createElement(CompareRoot, { kind: "taskbar-hover-preview", state: "attached-multi" },
        createElement(TaskbarHoverPreviewCompareHarness)
      )
    );

    const surface = container.querySelector("[data-phase='open']");
    expect(surface).not.toBeNull();
  });

  it("surface wrapper의 left style이 '50%'가 아니다 (캡처 캔버스 배치 계약)", () => {
    // Visual baseline: the static harness places the surface using the width-formula
    // (triggerCenterX - surfaceWidth/2), not a fixed 50% offset.
    // This is a frozen capture canvas geometry assertion — NOT a live DOMRect claim.
    render(
      createElement(CompareRoot, { kind: "taskbar-hover-preview", state: "attached-multi" },
        createElement(TaskbarHoverPreviewCompareHarness)
      )
    );

    const wrapper = container.querySelector("[data-testid='compare-surface-wrapper']") as HTMLElement | null;
    expect(wrapper).not.toBeNull();
    expect(wrapper!.style.left).not.toBe("50%");
  });

  it("surface wrapper의 left가 숫자값(px)에서 파생된다 (캡처 캔버스 고정 배치)", () => {
    // Visual baseline: frozen capture canvas geometry.
    // left = TRIGGER_CENTER_X - SURFACE_WIDTH / 2 (width-formula constant).
    // Runtime measured placement is owned by useTaskbarHoverPreview unit tests.
    render(
      createElement(CompareRoot, { kind: "taskbar-hover-preview", state: "attached-multi" },
        createElement(TaskbarHoverPreviewCompareHarness)
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

  it("surface leaf의 style.width가 CSS min() 함수 문자열이 아닌 정수값(px)으로 고정된다 (surfaceProps override 증거)", () => {
    render(
      createElement(CompareRoot, { kind: "taskbar-hover-preview", state: "attached-multi" },
        createElement(TaskbarHoverPreviewCompareHarness)
      )
    );

    const surface = container.querySelector("[data-state='hover-multi']") as HTMLElement | null;
    expect(surface).not.toBeNull();

    const widthValue = surface!.style.width;
    // surfaceProps.style.width override가 적용되면 inline style에 숫자(px) 값이 설정됨
    // leaf 내부 min(80vw, N*200)는 override되어 남지 않는다
    expect(widthValue).not.toContain("min(");
    const widthPx = parseFloat(widthValue);
    expect(isNaN(widthPx)).toBe(false);
    expect(widthPx).toBeGreaterThan(0);
  });

  it("HOVER_MULTI items(3개) 모두 surface에 렌더링된다", () => {
    render(
      createElement(CompareRoot, { kind: "taskbar-hover-preview", state: "attached-multi" },
        createElement(TaskbarHoverPreviewCompareHarness)
      )
    );

    const cards = container.querySelectorAll("[data-preview-card]");
    expect(cards.length).toBe(3);
  });
});
