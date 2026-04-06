import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Taskbar from "./index";

const taskbarProps = {
  startButton: <button type="button">시작</button>,
  search: <div>검색</div>,
  items: [
    <button key="blog" type="button">
      블로그
    </button>,
    <button key="project" type="button">
      프로젝트
    </button>,
  ],
  clock: <time dateTime="2026-04-05T11:24:00+09:00">11:24 2026-04-05</time>,
} satisfies React.ComponentProps<typeof Taskbar>;

const styledTaskbarProps = {
  ...taskbarProps,
  className: "custom-taskbar-shell",
} satisfies React.ComponentProps<typeof Taskbar>;

const renderTaskbar = (props: React.ComponentProps<typeof Taskbar>) => {
  const html = renderToStaticMarkup(<Taskbar {...props} />);
  const container = document.createElement("div");

  container.innerHTML = html;

  const root = container.querySelector("nav");

  expect(root).not.toBeNull();

  return {
    html,
    container,
    root: root as HTMLElement,
  };
};

describe("Taskbar", () => {
  it("named slot 조합과 default shell class + additive className merge를 함께 렌더링한다", () => {
    const { container, root } = renderTaskbar(styledTaskbarProps);
    const className = root.getAttribute("class") ?? "";

    expect(container.textContent ?? "").toContain("시작");
    expect(container.textContent ?? "").toContain("검색");
    expect(container.textContent ?? "").toContain("블로그");
    expect(container.textContent ?? "").toContain("프로젝트");
    expect(container.textContent ?? "").toContain("11:24 2026-04-05");
    expect(className).toContain("custom-taskbar-shell");
    expect(className.split(" ")).toContain("taskbar");
    expect(className.trim()).not.toBe("");
    expect(className.trim()).not.toBe("custom-taskbar-shell");
  });

  it("className 없이 렌더링해도 기본 클래스가 존재한다", () => {
    const { root } = renderTaskbar(taskbarProps);
    const className = root.getAttribute("class") ?? "";

    expect(className.trim()).not.toBe("");
    expect(className.split(" ")).toContain("taskbar");
  });

  it("slot wrapper에 data-slot 속성이 존재한다", () => {
    const { root } = renderTaskbar(taskbarProps);

    expect(root.children).toHaveLength(4);

    const slots = Array.from(root.children);

    expect(slots[0]?.getAttribute("data-slot")).toBe("start-button");
    expect(slots[1]?.getAttribute("data-slot")).toBe("search");
    expect(slots[2]?.getAttribute("data-slot")).toBe("items");
    expect(slots[3]?.getAttribute("data-slot")).toBe("clock");
  });

  it("native nav props가 root 요소로 전달된다", () => {
    const { root } = renderTaskbar({
      ...taskbarProps,
      "aria-label": "메인 작업 표시줄",
      role: "navigation",
    });

    expect(root.getAttribute("aria-label")).toBe("메인 작업 표시줄");
    expect(root.getAttribute("role")).toBe("navigation");
  });

  it("items slot wrapper에 flex 레이아웃이 적용된다", () => {
    const { root } = renderTaskbar(taskbarProps);
    const itemsSlot = root.querySelector("[data-slot='items']");

    expect(itemsSlot).not.toBeNull();
    expect(itemsSlot?.getAttribute("class")).toContain("flex");
    expect(itemsSlot?.getAttribute("class")).toContain("items-center");
  });

  it("items cluster가 달라지면 shell markup도 함께 달라진다", () => {
    const base = renderTaskbar(styledTaskbarProps);
    const next = renderTaskbar({
      ...styledTaskbarProps,
      items: [
        <button key="about" type="button">
          소개
        </button>,
      ],
    });

    expect(next.html).not.toBe(base.html);
    expect(next.container.textContent ?? "").toContain("소개");
  });
});
