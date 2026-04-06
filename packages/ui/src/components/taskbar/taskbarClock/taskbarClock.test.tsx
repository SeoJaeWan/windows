import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import TaskbarClock from "./index";

const clockProps = {
  timeLabel: "오전 11:24",
  dateLabel: "2026-04-05",
  className: "custom-clock text-right text-xs",
  "aria-label": "현재 시간과 날짜",
} satisfies React.ComponentProps<typeof TaskbarClock>;

const renderClock = (props: React.ComponentProps<typeof TaskbarClock>) => {
  const html = renderToStaticMarkup(<TaskbarClock {...props} />);
  const container = document.createElement("div");

  container.innerHTML = html;

  const root = container.firstElementChild;

  expect(root).not.toBeNull();

  return {
    html,
    root: root as HTMLElement,
  };
};

describe("TaskbarClock", () => {
  it("timeLabel, dateLabel과 container HTML prop을 함께 렌더링한다", () => {
    const { root } = renderClock(clockProps);
    const className = root.getAttribute("class") ?? "";

    expect(root.textContent ?? "").toContain("오전 11:24");
    expect(root.textContent ?? "").toContain("2026-04-05");
    expect(root.getAttribute("aria-label")).toBe("현재 시간과 날짜");
    expect(className).toContain("custom-clock");
    expect(className.split(" ")).toContain("taskbar-clock");
    expect(root.getAttribute("class") ?? "").toContain("text-right");
    expect(className.trim()).not.toBe("");
    expect(className.trim()).not.toBe("custom-clock text-right text-xs");
  });

  it("className 없이 렌더링해도 기본 클래스가 존재한다", () => {
    const { root } = renderClock({
      timeLabel: "오전 10:00",
      dateLabel: "2026-04-06",
    });
    const className = root.getAttribute("class") ?? "";

    expect(className.trim()).not.toBe("");
    expect(className.split(" ")).toContain("taskbar-clock");
  });

  it("표시 문자열이 바뀌면 clock markup도 함께 달라진다", () => {
    const base = renderClock(clockProps);
    const next = renderClock({
      ...clockProps,
      timeLabel: "오후 3:05",
      dateLabel: "2026-04-06",
    });

    expect(next.html).not.toBe(base.html);
    expect(next.root.textContent ?? "").toContain("오후 3:05");
    expect(next.root.textContent ?? "").toContain("2026-04-06");
  });
});
