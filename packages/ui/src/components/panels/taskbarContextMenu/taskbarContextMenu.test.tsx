import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";

import TaskbarContextMenu from "./index";
import { MOTION_ENTER_CLASS, MOTION_EXIT_CLASS } from "../taskbarAttachedSurface/motion";

const APP_ROWS = [
  { id: "a1", label: "나만의 홈페이지 만들기", iconSrc: "/file.png" },
  { id: "a2", label: "Component의 모든 것", iconSrc: "/file.png" },
  { id: "a3", label: "JavaScript 스터디 메이트", iconSrc: "/file.png" },
] as const;

const APP_IDENTIFIER = { id: "app-blog", label: "블로그", iconSrc: "/folder.png" };

const NO_OP = () => {};

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
  act(() => root.render(ui));
}

function makeBaseProps(overrides?: Partial<Parameters<typeof TaskbarContextMenu>[0]>) {
  return {
    appRows: [...APP_ROWS] as [typeof APP_ROWS[0], ...typeof APP_ROWS],
    taskbarPinState: "pinned" as const,
    phase: "open" as const,
    onEnterComplete: NO_OP,
    onExitComplete: NO_OP,
    onSelectAppRow: NO_OP,
    onSelectAppIdentifier: NO_OP,
    onPinTaskbar: NO_OP,
    onCloseAll: NO_OP,
    ...overrides,
  };
}

describe("TaskbarContextMenu", () => {
  describe("context-pinned (taskbarPinState=pinned)", () => {
    it("sets data-state to context-pinned", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps({ taskbarPinState: "pinned" })));

      const surface = container.querySelector("[data-state='context-pinned']");
      expect(surface).not.toBeNull();
    });

    it("renders pin-taskbar row with 작업 표시줄에서 제거", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps({ taskbarPinState: "pinned" })));

      const pinRow = container.querySelector("[data-action-id='pin-taskbar']");
      expect(pinRow).not.toBeNull();
      expect(pinRow!.textContent).toContain("작업 표시줄에서 제거");
    });

    it("does NOT show 작업 표시줄에 고정 when pinned", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps({ taskbarPinState: "pinned" })));

      const pinRow = container.querySelector("[data-action-id='pin-taskbar']");
      expect(pinRow!.textContent).not.toContain("작업 표시줄에 고정");
    });
  });

  describe("context-unpinned (taskbarPinState=unpinned)", () => {
    it("sets data-state to context-unpinned", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps({ taskbarPinState: "unpinned" })));

      const surface = container.querySelector("[data-state='context-unpinned']");
      expect(surface).not.toBeNull();
    });

    it("renders pin-taskbar row with 작업 표시줄에 고정", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps({ taskbarPinState: "unpinned" })));

      const pinRow = container.querySelector("[data-action-id='pin-taskbar']");
      expect(pinRow).not.toBeNull();
      expect(pinRow!.textContent).toContain("작업 표시줄에 고정");
    });

    it("does NOT show 작업 표시줄에서 제거 when unpinned", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps({ taskbarPinState: "unpinned" })));

      const pinRow = container.querySelector("[data-action-id='pin-taskbar']");
      expect(pinRow!.textContent).not.toContain("작업 표시줄에서 제거");
    });
  });

  describe("app rows", () => {
    it("renders correct number of app rows", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps()));

      const appRowEls = container.querySelectorAll("[data-app-row]");
      expect(appRowEls).toHaveLength(3);
    });

    it("renders app row labels in order", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps()));

      const appRowEls = container.querySelectorAll("[data-app-row]");
      expect(appRowEls[0]!.textContent).toContain("나만의 홈페이지 만들기");
      expect(appRowEls[1]!.textContent).toContain("Component의 모든 것");
      expect(appRowEls[2]!.textContent).toContain("JavaScript 스터디 메이트");
    });

    it("renders IconImage (img element) for each app row", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps()));

      const appRowEls = container.querySelectorAll("[data-app-row]");
      for (const row of appRowEls) {
        const img = row.querySelector("img");
        expect(img).not.toBeNull();
        expect(img?.getAttribute("src")).toBe("/file.png");
      }
    });
  });

  describe("fixed rows", () => {
    it("close-all row always shows 모든 창 닫기", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps()));

      const closeRow = container.querySelector("[data-action-id='close-all']");
      expect(closeRow).not.toBeNull();
      expect(closeRow!.textContent).toContain("모든 창 닫기");
    });

    it("pin-taskbar appears before close-all in DOM order", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps()));

      const actions = container.querySelectorAll("[data-action-id]");
      expect(actions).toHaveLength(2);
      expect(actions[0]?.getAttribute("data-action-id")).toBe("pin-taskbar");
      expect(actions[1]?.getAttribute("data-action-id")).toBe("close-all");
    });
  });

  describe("canonical row order", () => {
    it("section header comes before app rows in DOM", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps({ appIdentifier: APP_IDENTIFIER })));

      const allText = container.innerHTML;
      const headerIdx = allText.indexOf("작업");
      const firstRowIdx = allText.indexOf("data-app-row");
      expect(headerIdx).toBeLessThan(firstRowIdx);
    });

    it("divider appears after app rows, before appIdentifier", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps({ appIdentifier: APP_IDENTIFIER })));

      const children = Array.from(container.querySelector("[data-state]")!.children);
      const dividerIdx = children.findIndex((el) => el.classList.contains("border-t"));
      const appRowIdxLast = children.reduce((acc, el, i) => {
        if (el.hasAttribute("data-app-row")) return i;
        return acc;
      }, -1);
      const appIdentifierIdx = children.findIndex((el) => el.hasAttribute("data-app-identifier"));

      expect(dividerIdx).toBeGreaterThan(appRowIdxLast);
      expect(appIdentifierIdx).toBeGreaterThan(dividerIdx);
    });

    it("appIdentifier appears before pin-taskbar", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps({ appIdentifier: APP_IDENTIFIER })));

      const children = Array.from(container.querySelector("[data-state]")!.children);
      const appIdentifierIdx = children.findIndex((el) => el.hasAttribute("data-app-identifier"));
      const pinIdx = children.findIndex((el) => el.getAttribute("data-action-id") === "pin-taskbar");

      expect(appIdentifierIdx).toBeLessThan(pinIdx);
    });

    it("pin-taskbar appears before close-all", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps()));

      const children = Array.from(container.querySelector("[data-state]")!.children);
      const pinIdx = children.findIndex((el) => el.getAttribute("data-action-id") === "pin-taskbar");
      const closeAllIdx = children.findIndex((el) => el.getAttribute("data-action-id") === "close-all");

      expect(pinIdx).toBeLessThan(closeAllIdx);
    });
  });

  describe("appIdentifier with id", () => {
    it("renders appIdentifier row with data-app-identifier attribute containing id", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps({ appIdentifier: APP_IDENTIFIER })));

      const identifierEl = container.querySelector("[data-app-identifier='app-blog']");
      expect(identifierEl).not.toBeNull();
    });

    it("renders appIdentifier label text", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps({ appIdentifier: APP_IDENTIFIER })));

      const identifierEl = container.querySelector("[data-app-identifier='app-blog']");
      expect(identifierEl!.textContent).toContain("블로그");
    });

    it("does not render appIdentifier row when not provided", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps()));

      const identifierEl = container.querySelector("[data-app-identifier]");
      expect(identifierEl).toBeNull();
    });
  });

  describe("phase prop", () => {
    it("sets data-phase='open' when phase is open", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps({ phase: "open" })));

      const surface = container.querySelector("[data-phase='open']");
      expect(surface).not.toBeNull();
    });

    it("sets data-phase='opening' when phase is opening", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps({ phase: "opening" })));

      const surface = container.querySelector("[data-phase='opening']");
      expect(surface).not.toBeNull();
    });

    it("sets data-phase='closing' when phase is closing", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps({ phase: "closing" })));

      const surface = container.querySelector("[data-phase='closing']");
      expect(surface).not.toBeNull();
    });
  });

  describe("motion lifecycle", () => {
    it("opening 단계에서 enter motion 클래스(below→up)가 적용된다", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps({ phase: "opening" })));

      const surface = container.querySelector("[data-phase='opening']") as HTMLElement;
      expect(surface).not.toBeNull();
      expect(surface.classList.contains(MOTION_ENTER_CLASS)).toBe(true);
    });

    it("open 단계에서 motion 클래스가 없다(resting state)", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps({ phase: "open" })));

      const surface = container.querySelector("[data-phase='open']") as HTMLElement;
      expect(surface).not.toBeNull();
      expect(surface.classList.contains(MOTION_ENTER_CLASS)).toBe(false);
      expect(surface.classList.contains(MOTION_EXIT_CLASS)).toBe(false);
    });

    it("closing 단계에서 exit motion 클래스(current→down)가 적용된다", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps({ phase: "closing" })));

      const surface = container.querySelector("[data-phase='closing']") as HTMLElement;
      expect(surface).not.toBeNull();
      expect(surface.classList.contains(MOTION_EXIT_CLASS)).toBe(true);
    });

    it("enter와 exit motion 클래스는 서로 다르다(방향 비대칭 검증)", () => {
      expect(MOTION_ENTER_CLASS).not.toBe(MOTION_EXIT_CLASS);
    });

    it("closing 단계에서 animationEnd가 루트에 발생하면 onExitComplete가 호출된다", () => {
      const onExitComplete = vi.fn();
      render(createElement(TaskbarContextMenu, makeBaseProps({ phase: "closing", onExitComplete })));

      const surface = container.querySelector("[data-phase='closing']") as HTMLElement;
      act(() => {
        surface.dispatchEvent(
          new Event("animationend", { bubbles: true }),
        );
      });

      expect(onExitComplete).toHaveBeenCalledTimes(1);
    });

    it("opening 단계에서 animationEnd가 발생해도 onExitComplete가 호출되지 않는다", () => {
      const onExitComplete = vi.fn();
      render(createElement(TaskbarContextMenu, makeBaseProps({ phase: "opening", onExitComplete })));

      const surface = container.querySelector("[data-phase='opening']") as HTMLElement;
      act(() => {
        surface.dispatchEvent(
          new Event("animationend", { bubbles: true }),
        );
      });

      expect(onExitComplete).not.toHaveBeenCalled();
    });

    it("open 단계에서 animationEnd가 발생해도 onExitComplete가 호출되지 않는다", () => {
      const onExitComplete = vi.fn();
      render(createElement(TaskbarContextMenu, makeBaseProps({ phase: "open", onExitComplete })));

      const surface = container.querySelector("[data-phase='open']") as HTMLElement;
      act(() => {
        surface.dispatchEvent(
          new Event("animationend", { bubbles: true }),
        );
      });

      expect(onExitComplete).not.toHaveBeenCalled();
    });

    it("closing 단계에서도 child row의 animationEnd 버블은 onExitComplete를 호출하지 않는다", () => {
      const onExitComplete = vi.fn();
      render(createElement(TaskbarContextMenu, makeBaseProps({ phase: "closing", onExitComplete })));

      // child row(app row)에서 발생한 animationEnd가 root까지 bubble — target !== currentTarget이므로 무시
      const appRow = container.querySelector("[data-app-row='a1']") as HTMLElement;
      act(() => {
        appRow.dispatchEvent(
          new Event("animationend", { bubbles: true }),
        );
      });

      expect(onExitComplete).not.toHaveBeenCalled();
    });

    it("open 단계에서 child row 클릭이 onExitComplete를 잘못 호출하지 않는다", () => {
      const onExitComplete = vi.fn();
      render(createElement(TaskbarContextMenu, makeBaseProps({ phase: "open", onExitComplete })));

      const appRow = container.querySelector("[data-app-row='a1']") as HTMLButtonElement;
      act(() => { appRow.click(); });

      expect(onExitComplete).not.toHaveBeenCalled();
    });

    it("opening 단계에서 root animationEnd가 발생하면 onEnterComplete가 호출된다 — same mounted root boundary", () => {
      // root enter animation boundary contract: opening phase에서 루트의 animationEnd는
      // onEnterComplete를 호출한다. 이것이 opening→open 전환의 근거다.
      const onEnterComplete = vi.fn();
      render(createElement(TaskbarContextMenu, makeBaseProps({ phase: "opening", onEnterComplete })));

      const surface = container.querySelector("[data-phase='opening']") as HTMLElement;
      act(() => {
        surface.dispatchEvent(
          new Event("animationend", { bubbles: true }),
        );
      });

      expect(onEnterComplete).toHaveBeenCalledTimes(1);
    });

    it("open 단계에서 animationEnd가 발생해도 onEnterComplete가 호출되지 않는다", () => {
      const onEnterComplete = vi.fn();
      render(createElement(TaskbarContextMenu, makeBaseProps({ phase: "open", onEnterComplete })));

      const surface = container.querySelector("[data-phase='open']") as HTMLElement;
      act(() => {
        surface.dispatchEvent(
          new Event("animationend", { bubbles: true }),
        );
      });

      expect(onEnterComplete).not.toHaveBeenCalled();
    });

    it("closing 단계에서 animationEnd가 발생해도 onEnterComplete가 호출되지 않는다", () => {
      const onEnterComplete = vi.fn();
      render(createElement(TaskbarContextMenu, makeBaseProps({ phase: "closing", onEnterComplete })));

      const surface = container.querySelector("[data-phase='closing']") as HTMLElement;
      act(() => {
        surface.dispatchEvent(
          new Event("animationend", { bubbles: true }),
        );
      });

      expect(onEnterComplete).not.toHaveBeenCalled();
    });

    it("opening 단계에서도 child row의 animationEnd 버블은 onEnterComplete를 호출하지 않는다 — same root boundary", () => {
      // same mounted root contract: child에서 버블된 animationEnd는 무시된다.
      const onEnterComplete = vi.fn();
      render(createElement(TaskbarContextMenu, makeBaseProps({ phase: "opening", onEnterComplete })));

      const appRow = container.querySelector("[data-app-row='a1']") as HTMLElement;
      act(() => {
        appRow.dispatchEvent(
          new Event("animationend", { bubbles: true }),
        );
      });

      expect(onEnterComplete).not.toHaveBeenCalled();
    });
  });

  describe("action callbacks", () => {
    it("calls onSelectAppRow with row id when app row is clicked", () => {
      const onSelectAppRow = vi.fn();
      render(createElement(TaskbarContextMenu, makeBaseProps({ onSelectAppRow })));

      const row = container.querySelector("[data-app-row='a1']") as HTMLButtonElement;
      act(() => { row.click(); });

      expect(onSelectAppRow).toHaveBeenCalledWith("a1");
    });

    it("calls onSelectAppIdentifier with id when appIdentifier row is clicked", () => {
      const onSelectAppIdentifier = vi.fn();
      render(
        createElement(
          TaskbarContextMenu,
          makeBaseProps({ appIdentifier: APP_IDENTIFIER, onSelectAppIdentifier }),
        ),
      );

      const identifierEl = container.querySelector("[data-app-identifier='app-blog']") as HTMLButtonElement;
      act(() => { identifierEl.click(); });

      expect(onSelectAppIdentifier).toHaveBeenCalledWith("app-blog");
    });

    it("calls onPinTaskbar when pin-taskbar row is clicked", () => {
      const onPinTaskbar = vi.fn();
      render(createElement(TaskbarContextMenu, makeBaseProps({ onPinTaskbar })));

      const pinRow = container.querySelector("[data-action-id='pin-taskbar']") as HTMLButtonElement;
      act(() => { pinRow.click(); });

      expect(onPinTaskbar).toHaveBeenCalled();
    });

    it("calls onCloseAll when close-all row is clicked", () => {
      const onCloseAll = vi.fn();
      render(createElement(TaskbarContextMenu, makeBaseProps({ onCloseAll })));

      const closeRow = container.querySelector("[data-action-id='close-all']") as HTMLButtonElement;
      act(() => { closeRow.click(); });

      expect(onCloseAll).toHaveBeenCalled();
    });
  });

  describe("keyboard navigation", () => {
    function fireKeyDown(element: HTMLElement, key: string) {
      act(() => {
        element.dispatchEvent(
          new KeyboardEvent("keydown", { key, bubbles: true }),
        );
      });
    }

    it("ArrowDown moves focus to next interactive row", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps()));

      const menu = container.querySelector("[data-state]") as HTMLElement;
      const rows = container.querySelectorAll<HTMLButtonElement>(
        "[data-app-row], [data-action-id]",
      );

      act(() => { rows[0].focus(); });
      fireKeyDown(menu, "ArrowDown");

      expect(document.activeElement).toBe(rows[1]);
    });

    it("ArrowUp moves focus to previous interactive row", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps()));

      const menu = container.querySelector("[data-state]") as HTMLElement;
      const rows = container.querySelectorAll<HTMLButtonElement>(
        "[data-app-row], [data-action-id]",
      );

      act(() => { rows[1].focus(); });
      fireKeyDown(menu, "ArrowUp");

      expect(document.activeElement).toBe(rows[0]);
    });

    it("Home moves focus to first interactive row", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps()));

      const menu = container.querySelector("[data-state]") as HTMLElement;
      const rows = container.querySelectorAll<HTMLButtonElement>(
        "[data-app-row], [data-action-id]",
      );

      act(() => { rows[rows.length - 1].focus(); });
      fireKeyDown(menu, "Home");

      expect(document.activeElement).toBe(rows[0]);
    });

    it("End moves focus to last interactive row", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps()));

      const menu = container.querySelector("[data-state]") as HTMLElement;
      const rows = container.querySelectorAll<HTMLButtonElement>(
        "[data-app-row], [data-action-id]",
      );

      act(() => { rows[0].focus(); });
      fireKeyDown(menu, "End");

      expect(document.activeElement).toBe(rows[rows.length - 1]);
    });

    it("ArrowDown wraps from last to first", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps()));

      const menu = container.querySelector("[data-state]") as HTMLElement;
      const rows = container.querySelectorAll<HTMLButtonElement>(
        "[data-app-row], [data-action-id]",
      );

      act(() => { rows[rows.length - 1].focus(); });
      fireKeyDown(menu, "ArrowDown");

      expect(document.activeElement).toBe(rows[0]);
    });

    it("ArrowUp wraps from first to last", () => {
      render(createElement(TaskbarContextMenu, makeBaseProps()));

      const menu = container.querySelector("[data-state]") as HTMLElement;
      const rows = container.querySelectorAll<HTMLButtonElement>(
        "[data-app-row], [data-action-id]",
      );

      act(() => { rows[0].focus(); });
      fireKeyDown(menu, "ArrowUp");

      expect(document.activeElement).toBe(rows[rows.length - 1]);
    });

    it("Escape calls surfaceProps.onKeyDown if provided", () => {
      const surfaceOnKeyDown = vi.fn();
      render(
        createElement(
          TaskbarContextMenu,
          makeBaseProps({ surfaceProps: { onKeyDown: surfaceOnKeyDown } }),
        ),
      );

      const menu = container.querySelector("[data-state]") as HTMLElement;
      fireKeyDown(menu, "Escape");

      expect(surfaceOnKeyDown).toHaveBeenCalled();
    });

    it("Escape does nothing when surfaceProps has no onKeyDown", () => {
      // Should not throw
      render(createElement(TaskbarContextMenu, makeBaseProps()));

      const menu = container.querySelector("[data-state]") as HTMLElement;
      expect(() => { fireKeyDown(menu, "Escape"); }).not.toThrow();
    });
  });
});
