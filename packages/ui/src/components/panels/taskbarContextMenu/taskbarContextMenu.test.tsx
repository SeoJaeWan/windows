import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";

import TaskbarContextMenu from "./index";

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
