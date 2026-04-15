import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";

import TaskbarContextMenu from "./index";

const APP_ROWS = [
  { id: "a1", label: "나만의 홈페이지 만들기", iconSrc: "/file.png" },
  { id: "a2", label: "Component의 모든 것", iconSrc: "/file.png" },
  { id: "a3", label: "JavaScript 스터디 메이트", iconSrc: "/file.png" },
] as const;

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

describe("TaskbarContextMenu", () => {
  describe("context-pinned (taskbarPinState=pinned)", () => {
    it("sets data-state to context-pinned", () => {
      render(
        createElement(TaskbarContextMenu, {
          appRows: [...APP_ROWS],
          taskbarPinState: "pinned",
        }),
      );

      const surface = container.querySelector("[data-state='context-pinned']");
      expect(surface).not.toBeNull();
    });

    it("renders pin-taskbar row with 작업 표시줄에서 제거", () => {
      render(
        createElement(TaskbarContextMenu, {
          appRows: [...APP_ROWS],
          taskbarPinState: "pinned",
        }),
      );

      const pinRow = container.querySelector("[data-action-id='pin-taskbar']");
      expect(pinRow).not.toBeNull();
      expect(pinRow!.textContent).toContain("작업 표시줄에서 제거");
    });

    it("does NOT show 작업 표시줄에 고정 when pinned", () => {
      render(
        createElement(TaskbarContextMenu, {
          appRows: [...APP_ROWS],
          taskbarPinState: "pinned",
        }),
      );

      const pinRow = container.querySelector("[data-action-id='pin-taskbar']");
      expect(pinRow!.textContent).not.toContain("작업 표시줄에 고정");
    });
  });

  describe("context-unpinned (taskbarPinState=unpinned)", () => {
    it("sets data-state to context-unpinned", () => {
      render(
        createElement(TaskbarContextMenu, {
          appRows: [...APP_ROWS],
          taskbarPinState: "unpinned",
        }),
      );

      const surface = container.querySelector("[data-state='context-unpinned']");
      expect(surface).not.toBeNull();
    });

    it("renders pin-taskbar row with 작업 표시줄에 고정", () => {
      render(
        createElement(TaskbarContextMenu, {
          appRows: [...APP_ROWS],
          taskbarPinState: "unpinned",
        }),
      );

      const pinRow = container.querySelector("[data-action-id='pin-taskbar']");
      expect(pinRow).not.toBeNull();
      expect(pinRow!.textContent).toContain("작업 표시줄에 고정");
    });

    it("does NOT show 작업 표시줄에서 제거 when unpinned", () => {
      render(
        createElement(TaskbarContextMenu, {
          appRows: [...APP_ROWS],
          taskbarPinState: "unpinned",
        }),
      );

      const pinRow = container.querySelector("[data-action-id='pin-taskbar']");
      expect(pinRow!.textContent).not.toContain("작업 표시줄에서 제거");
    });
  });

  describe("app rows", () => {
    it("renders correct number of app rows", () => {
      render(
        createElement(TaskbarContextMenu, {
          appRows: [...APP_ROWS],
          taskbarPinState: "pinned",
        }),
      );

      const appRowEls = container.querySelectorAll("[data-app-row]");
      expect(appRowEls).toHaveLength(3);
    });

    it("renders app row labels in order", () => {
      render(
        createElement(TaskbarContextMenu, {
          appRows: [...APP_ROWS],
          taskbarPinState: "pinned",
        }),
      );

      const appRowEls = container.querySelectorAll("[data-app-row]");
      expect(appRowEls[0]!.textContent).toContain("나만의 홈페이지 만들기");
      expect(appRowEls[1]!.textContent).toContain("Component의 모든 것");
      expect(appRowEls[2]!.textContent).toContain("JavaScript 스터디 메이트");
    });

    it("renders IconImage (img element) for each app row", () => {
      render(
        createElement(TaskbarContextMenu, {
          appRows: [...APP_ROWS],
          taskbarPinState: "pinned",
        }),
      );

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
      render(
        createElement(TaskbarContextMenu, {
          appRows: [...APP_ROWS],
          taskbarPinState: "pinned",
        }),
      );

      const closeRow = container.querySelector("[data-action-id='close-all']");
      expect(closeRow).not.toBeNull();
      expect(closeRow!.textContent).toContain("모든 창 닫기");
    });

    it("pin-taskbar appears before close-all in DOM order", () => {
      render(
        createElement(TaskbarContextMenu, {
          appRows: [...APP_ROWS],
          taskbarPinState: "pinned",
        }),
      );

      const actions = container.querySelectorAll("[data-action-id]");
      expect(actions).toHaveLength(2);
      expect(actions[0]?.getAttribute("data-action-id")).toBe("pin-taskbar");
      expect(actions[1]?.getAttribute("data-action-id")).toBe("close-all");
    });
  });
});
