import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";

import TaskbarHoverPreview from "./index";

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
      render(createElement(TaskbarHoverPreview, { items: [...SINGLE_ITEM] }));

      const surface = container.querySelector("[data-state='hover-single']");
      expect(surface).not.toBeNull();
    });

    it("renders the label text", () => {
      render(createElement(TaskbarHoverPreview, { items: [...SINGLE_ITEM] }));

      expect(container.textContent).toContain("나만의 홈페이지 만들기");
    });

    it("renders an IconImage (img element)", () => {
      render(createElement(TaskbarHoverPreview, { items: [...SINGLE_ITEM] }));

      const img = container.querySelector("img");
      expect(img).not.toBeNull();
      expect(img?.getAttribute("src")).toBe("/file.png");
    });

    it("renders close affordance icon", () => {
      render(createElement(TaskbarHoverPreview, { items: [...SINGLE_ITEM] }));

      const closeIcon = container.querySelector("[data-testid='close-affordance']");
      expect(closeIcon).not.toBeNull();
    });

    it("renders preview content inside scale wrapper", () => {
      render(createElement(TaskbarHoverPreview, { items: [...SINGLE_ITEM] }));

      const wrapper = container.querySelector("[data-testid='preview-scale-wrapper']");
      expect(wrapper).not.toBeNull();
      const previewContent = container.querySelector("[data-testid='preview-content-t1']");
      expect(previewContent).not.toBeNull();
      expect(wrapper?.contains(previewContent!)).toBe(true);
    });
  });

  describe("hover-multi (3 items)", () => {
    it("renders with hover-multi data-state", () => {
      render(createElement(TaskbarHoverPreview, { items: [...MULTI_ITEMS] }));

      const surface = container.querySelector("[data-state='hover-multi']");
      expect(surface).not.toBeNull();
    });

    it("renders correct number of preview cards", () => {
      render(createElement(TaskbarHoverPreview, { items: [...MULTI_ITEMS] }));

      const cards = container.querySelectorAll("[data-preview-card]");
      expect(cards).toHaveLength(3);
    });

    it("renders each card label text", () => {
      render(createElement(TaskbarHoverPreview, { items: [...MULTI_ITEMS] }));

      expect(container.textContent).toContain("나만의 홈페이지 만들기");
      expect(container.textContent).toContain("Component의 모든 것");
      expect(container.textContent).toContain("JavaScript 스터디 메이트");
    });

    it("renders close affordance for each card", () => {
      render(createElement(TaskbarHoverPreview, { items: [...MULTI_ITEMS] }));

      const closeIcons = container.querySelectorAll("[data-testid='close-affordance']");
      expect(closeIcons).toHaveLength(3);
    });

    it("renders preview content inside scale wrappers for each card", () => {
      render(createElement(TaskbarHoverPreview, { items: [...MULTI_ITEMS] }));

      const wrappers = container.querySelectorAll("[data-testid='preview-scale-wrapper']");
      expect(wrappers).toHaveLength(3);

      for (const item of MULTI_ITEMS) {
        const content = container.querySelector(`[data-testid='preview-content-${item.id}']`);
        expect(content).not.toBeNull();
      }
    });
  });
});
