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

const renderTaskbar = (props: React.ComponentProps<typeof Taskbar>) => {
  const html = renderToStaticMarkup(<Taskbar {...props} />);
  const container = document.createElement("div");

  container.innerHTML = html;

  return {
    html,
    container,
  };
};

describe("Taskbar", () => {
  it("named slot 조합으로 startButton, search, items, clock 영역을 함께 렌더링한다", () => {
    const { container } = renderTaskbar(taskbarProps);

    expect(container.textContent ?? "").toContain("시작");
    expect(container.textContent ?? "").toContain("검색");
    expect(container.textContent ?? "").toContain("블로그");
    expect(container.textContent ?? "").toContain("프로젝트");
    expect(container.textContent ?? "").toContain("11:24 2026-04-05");
  });

  it("items cluster가 달라지면 shell markup도 함께 달라진다", () => {
    const base = renderTaskbar(taskbarProps);
    const next = renderTaskbar({
      ...taskbarProps,
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
