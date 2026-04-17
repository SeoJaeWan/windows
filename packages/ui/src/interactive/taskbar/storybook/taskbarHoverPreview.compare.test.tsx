/**
 * taskbarHoverPreview.compare.test
 *
 * Source-tree test that locks the compare story DOM contract for the
 * attached-host hover preview composition.
 *
 * Verifies:
 * - [data-visual-root] is present (CompareRoot contract)
 * - data-visual-kind is exactly "taskbar-hover-preview"
 * - data-visual-state is exactly "attached-multi"
 * - Exactly one [data-visual-root] is rendered
 * - The attached host contains the trigger icon
 * - Surface left is derived from width formula (not left:50%)
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

  it("surface wrapper의 left style이 '50%'가 아니다", () => {
    render(
      createElement(CompareRoot, { kind: "taskbar-hover-preview", state: "attached-multi" },
        createElement(TaskbarHoverPreviewCompareHarness)
      )
    );

    const wrapper = container.querySelector("[data-testid='compare-surface-wrapper']") as HTMLElement | null;
    expect(wrapper).not.toBeNull();
    expect(wrapper!.style.left).not.toBe("50%");
  });

  it("surface wrapper의 left가 숫자값(px)에서 파생된다", () => {
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
