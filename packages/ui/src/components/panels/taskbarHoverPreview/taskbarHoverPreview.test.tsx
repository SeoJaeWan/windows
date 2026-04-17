import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";

import TaskbarHoverPreview from "./index";
import { MOTION_ENTER_CLASS, MOTION_EXIT_CLASS } from "../taskbarAttachedSurface/motion";

const SINGLE_ITEM = [
  {
    id: "t1",
    label: "나만의 홈페이지 만들기",
    iconSrc: "/file.png",
    preview: createElement("div", { "data-testid": "preview-content-t1" }, "Preview 1"),
  },
] as const;

const MULTI_ITEMS = [
  {
    id: "t1",
    label: "나만의 홈페이지 만들기",
    iconSrc: "/file.png",
    preview: createElement("div", { "data-testid": "preview-content-t1" }, "Preview 1"),
  },
  {
    id: "t2",
    label: "Component의 모든 것",
    iconSrc: "/file.png",
    preview: createElement("div", { "data-testid": "preview-content-t2" }, "Preview 2"),
  },
  {
    id: "t3",
    label: "JavaScript 스터디 메이트",
    iconSrc: "/file.png",
    preview: createElement("div", { "data-testid": "preview-content-t3" }, "Preview 3"),
  },
] as const;

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

describe("TaskbarHoverPreview", () => {
  describe("hover-single (1 item)", () => {
    it("renders with hover-single data-state", () => {
      render(
        createElement(TaskbarHoverPreview, {
          items: [...SINGLE_ITEM],
          phase: "open",
          onExitComplete: NO_OP,
          onSelectItem: NO_OP,
          onCloseItem: NO_OP,
        }),
      );

      const surface = container.querySelector("[data-state='hover-single']");
      expect(surface).not.toBeNull();
    });

    it("renders the label text", () => {
      render(
        createElement(TaskbarHoverPreview, {
          items: [...SINGLE_ITEM],
          phase: "open",
          onExitComplete: NO_OP,
          onSelectItem: NO_OP,
          onCloseItem: NO_OP,
        }),
      );

      expect(container.textContent).toContain("나만의 홈페이지 만들기");
    });

    it("renders an IconImage (img element)", () => {
      render(
        createElement(TaskbarHoverPreview, {
          items: [...SINGLE_ITEM],
          phase: "open",
          onExitComplete: NO_OP,
          onSelectItem: NO_OP,
          onCloseItem: NO_OP,
        }),
      );

      const img = container.querySelector("img");
      expect(img).not.toBeNull();
      expect(img?.getAttribute("src")).toBe("/file.png");
    });

    it("renders close affordance as a real button", () => {
      render(
        createElement(TaskbarHoverPreview, {
          items: [...SINGLE_ITEM],
          phase: "open",
          onExitComplete: NO_OP,
          onSelectItem: NO_OP,
          onCloseItem: NO_OP,
        }),
      );

      const closeBtn = container.querySelector("[data-testid='close-affordance']");
      expect(closeBtn).not.toBeNull();
      expect(closeBtn?.tagName.toLowerCase()).toBe("button");
    });

    it("renders preview content inside scale wrapper", () => {
      render(
        createElement(TaskbarHoverPreview, {
          items: [...SINGLE_ITEM],
          phase: "open",
          onExitComplete: NO_OP,
          onSelectItem: NO_OP,
          onCloseItem: NO_OP,
        }),
      );

      const wrapper = container.querySelector("[data-testid='preview-scale-wrapper']");
      expect(wrapper).not.toBeNull();
      const previewContent = container.querySelector("[data-testid='preview-content-t1']");
      expect(previewContent).not.toBeNull();
      expect(wrapper?.contains(previewContent!)).toBe(true);
    });
  });

  describe("hover-multi (3 items)", () => {
    it("renders with hover-multi data-state", () => {
      render(
        createElement(TaskbarHoverPreview, {
          items: [...MULTI_ITEMS],
          phase: "open",
          onExitComplete: NO_OP,
          onSelectItem: NO_OP,
          onCloseItem: NO_OP,
        }),
      );

      const surface = container.querySelector("[data-state='hover-multi']");
      expect(surface).not.toBeNull();
    });

    it("renders correct number of preview cards", () => {
      render(
        createElement(TaskbarHoverPreview, {
          items: [...MULTI_ITEMS],
          phase: "open",
          onExitComplete: NO_OP,
          onSelectItem: NO_OP,
          onCloseItem: NO_OP,
        }),
      );

      const cards = container.querySelectorAll("[data-preview-card]");
      expect(cards).toHaveLength(3);
    });

    it("renders each card label text", () => {
      render(
        createElement(TaskbarHoverPreview, {
          items: [...MULTI_ITEMS],
          phase: "open",
          onExitComplete: NO_OP,
          onSelectItem: NO_OP,
          onCloseItem: NO_OP,
        }),
      );

      expect(container.textContent).toContain("나만의 홈페이지 만들기");
      expect(container.textContent).toContain("Component의 모든 것");
      expect(container.textContent).toContain("JavaScript 스터디 메이트");
    });

    it("renders close affordance for each card", () => {
      render(
        createElement(TaskbarHoverPreview, {
          items: [...MULTI_ITEMS],
          phase: "open",
          onExitComplete: NO_OP,
          onSelectItem: NO_OP,
          onCloseItem: NO_OP,
        }),
      );

      const closeIcons = container.querySelectorAll("[data-testid='close-affordance']");
      expect(closeIcons).toHaveLength(3);
    });

    it("renders preview content inside scale wrappers for each card", () => {
      render(
        createElement(TaskbarHoverPreview, {
          items: [...MULTI_ITEMS],
          phase: "open",
          onExitComplete: NO_OP,
          onSelectItem: NO_OP,
          onCloseItem: NO_OP,
        }),
      );

      const wrappers = container.querySelectorAll("[data-testid='preview-scale-wrapper']");
      expect(wrappers).toHaveLength(3);

      for (const item of MULTI_ITEMS) {
        const content = container.querySelector(`[data-testid='preview-content-${item.id}']`);
        expect(content).not.toBeNull();
      }
    });
  });

  describe("phase prop", () => {
    it("sets data-phase='opening' when phase is opening", () => {
      render(
        createElement(TaskbarHoverPreview, {
          items: [...SINGLE_ITEM],
          phase: "opening",
          onExitComplete: NO_OP,
          onSelectItem: NO_OP,
          onCloseItem: NO_OP,
        }),
      );

      const surface = container.querySelector("[data-phase='opening']");
      expect(surface).not.toBeNull();
    });

    it("sets data-phase='open' when phase is open", () => {
      render(
        createElement(TaskbarHoverPreview, {
          items: [...SINGLE_ITEM],
          phase: "open",
          onExitComplete: NO_OP,
          onSelectItem: NO_OP,
          onCloseItem: NO_OP,
        }),
      );

      const surface = container.querySelector("[data-phase='open']");
      expect(surface).not.toBeNull();
    });

    it("sets data-phase='closing' when phase is closing", () => {
      render(
        createElement(TaskbarHoverPreview, {
          items: [...SINGLE_ITEM],
          phase: "closing",
          onExitComplete: NO_OP,
          onSelectItem: NO_OP,
          onCloseItem: NO_OP,
        }),
      );

      const surface = container.querySelector("[data-phase='closing']");
      expect(surface).not.toBeNull();
    });

    it("surfaceProps cannot override data-phase", () => {
      render(
        createElement(TaskbarHoverPreview, {
          items: [...SINGLE_ITEM],
          phase: "open",
          onExitComplete: NO_OP,
          onSelectItem: NO_OP,
          onCloseItem: NO_OP,
          // @ts-expect-error intentionally trying to override package-owned marker
          surfaceProps: { "data-phase": "closing" },
        }),
      );

      // data-phase should still be "open" (package-owned wins)
      const surface = container.querySelector("[data-phase='open']");
      expect(surface).not.toBeNull();
    });
  });

  describe("motion lifecycle", () => {
    it("opening 단계에서 enter motion 클래스(below→up)가 적용된다", () => {
      render(
        createElement(TaskbarHoverPreview, {
          items: [...SINGLE_ITEM],
          phase: "opening",
          onExitComplete: NO_OP,
          onSelectItem: NO_OP,
          onCloseItem: NO_OP,
        }),
      );

      const surface = container.querySelector("[data-phase='opening']") as HTMLElement;
      expect(surface).not.toBeNull();
      expect(surface.classList.contains(MOTION_ENTER_CLASS)).toBe(true);
    });

    it("open 단계에서 motion 클래스가 없다(resting state)", () => {
      render(
        createElement(TaskbarHoverPreview, {
          items: [...SINGLE_ITEM],
          phase: "open",
          onExitComplete: NO_OP,
          onSelectItem: NO_OP,
          onCloseItem: NO_OP,
        }),
      );

      const surface = container.querySelector("[data-phase='open']") as HTMLElement;
      expect(surface).not.toBeNull();
      expect(surface.classList.contains(MOTION_ENTER_CLASS)).toBe(false);
      expect(surface.classList.contains(MOTION_EXIT_CLASS)).toBe(false);
    });

    it("closing 단계에서 exit motion 클래스(current→down)가 적용된다", () => {
      render(
        createElement(TaskbarHoverPreview, {
          items: [...SINGLE_ITEM],
          phase: "closing",
          onExitComplete: NO_OP,
          onSelectItem: NO_OP,
          onCloseItem: NO_OP,
        }),
      );

      const surface = container.querySelector("[data-phase='closing']") as HTMLElement;
      expect(surface).not.toBeNull();
      expect(surface.classList.contains(MOTION_EXIT_CLASS)).toBe(true);
    });

    it("enter와 exit motion 클래스는 서로 다르다(방향 비대칭 검증)", () => {
      expect(MOTION_ENTER_CLASS).not.toBe(MOTION_EXIT_CLASS);
    });

    it("closing 단계에서 animationEnd가 루트에 발생하면 onExitComplete가 호출된다", () => {
      const onExitComplete = vi.fn();
      render(
        createElement(TaskbarHoverPreview, {
          items: [...SINGLE_ITEM],
          phase: "closing",
          onExitComplete,
          onSelectItem: NO_OP,
          onCloseItem: NO_OP,
        }),
      );

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
      render(
        createElement(TaskbarHoverPreview, {
          items: [...SINGLE_ITEM],
          phase: "opening",
          onExitComplete,
          onSelectItem: NO_OP,
          onCloseItem: NO_OP,
        }),
      );

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
      render(
        createElement(TaskbarHoverPreview, {
          items: [...SINGLE_ITEM],
          phase: "open",
          onExitComplete,
          onSelectItem: NO_OP,
          onCloseItem: NO_OP,
        }),
      );

      const surface = container.querySelector("[data-phase='open']") as HTMLElement;
      act(() => {
        surface.dispatchEvent(
          new Event("animationend", { bubbles: true }),
        );
      });

      expect(onExitComplete).not.toHaveBeenCalled();
    });

    it("child 요소의 animationEnd 버블이 root에 도달해도 closing이 아니면 onExitComplete가 호출되지 않는다", () => {
      const onExitComplete = vi.fn();
      render(
        createElement(TaskbarHoverPreview, {
          items: [...SINGLE_ITEM],
          phase: "open",
          onExitComplete,
          onSelectItem: NO_OP,
          onCloseItem: NO_OP,
        }),
      );

      // child(preview card) 에서 animationEnd 버블
      const card = container.querySelector("[data-preview-card='t1']") as HTMLElement;
      act(() => {
        card.dispatchEvent(
          new Event("animationend", { bubbles: true }),
        );
      });

      expect(onExitComplete).not.toHaveBeenCalled();
    });

    it("closing 단계에서도 child 버블 animationEnd는 onExitComplete를 호출하지 않는다", () => {
      const onExitComplete = vi.fn();
      render(
        createElement(TaskbarHoverPreview, {
          items: [...SINGLE_ITEM],
          phase: "closing",
          onExitComplete,
          onSelectItem: NO_OP,
          onCloseItem: NO_OP,
        }),
      );

      // child에서 발생한 animationEnd가 root까지 bubble — target !== currentTarget이므로 무시
      const card = container.querySelector("[data-preview-card='t1']") as HTMLElement;
      act(() => {
        card.dispatchEvent(
          new Event("animationend", { bubbles: true }),
        );
      });

      expect(onExitComplete).not.toHaveBeenCalled();
    });
  });

  describe("callbacks", () => {
    it("calls onSelectItem with item id when card area is clicked", () => {
      const onSelectItem = vi.fn();
      render(
        createElement(TaskbarHoverPreview, {
          items: [...SINGLE_ITEM],
          phase: "open",
          onExitComplete: NO_OP,
          onSelectItem,
          onCloseItem: NO_OP,
        }),
      );

      const card = container.querySelector("[data-preview-card='t1']") as HTMLElement;
      act(() => { card.click(); });

      expect(onSelectItem).toHaveBeenCalledWith("t1");
    });

    it("calls onCloseItem with item id when close button is clicked", () => {
      const onCloseItem = vi.fn();
      render(
        createElement(TaskbarHoverPreview, {
          items: [...SINGLE_ITEM],
          phase: "open",
          onExitComplete: NO_OP,
          onSelectItem: NO_OP,
          onCloseItem,
        }),
      );

      const closeBtn = container.querySelector("[data-testid='close-affordance']") as HTMLButtonElement;
      act(() => { closeBtn.click(); });

      expect(onCloseItem).toHaveBeenCalledWith("t1");
    });

    it("close button click does not trigger onSelectItem", () => {
      const onSelectItem = vi.fn();
      const onCloseItem = vi.fn();
      render(
        createElement(TaskbarHoverPreview, {
          items: [...SINGLE_ITEM],
          phase: "open",
          onExitComplete: NO_OP,
          onSelectItem,
          onCloseItem,
        }),
      );

      const closeBtn = container.querySelector("[data-testid='close-affordance']") as HTMLButtonElement;
      act(() => { closeBtn.click(); });

      expect(onCloseItem).toHaveBeenCalledWith("t1");
      expect(onSelectItem).not.toHaveBeenCalled();
    });
  });
});
