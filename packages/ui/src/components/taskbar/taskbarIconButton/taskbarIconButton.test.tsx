import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import TaskbarIconButton from "./index";

const icon = <span data-testid="mock-taskbar-icon">I</span>;

describe("TaskbarIconButton", () => {
  it("default 상태와 라벨을 반영한다", () => {
    const html = renderToStaticMarkup(
      <TaskbarIconButton icon={icon} label="블로그" status="default" />,
    );

    expect(html).toContain("data-testid=\"mock-taskbar-icon\"");
    expect(html).toContain("블로그");
    expect(html).toContain('data-status="default"');
  });

  it("open 상태를 data-status로 구분한다", () => {
    const html = renderToStaticMarkup(
      <TaskbarIconButton icon={icon} label="프로젝트" status="open" />,
    );

    expect(html).toContain("프로젝트");
    expect(html).toContain('data-status="open"');
  });

  it("active 상태를 data-status로 구분한다", () => {
    const html = renderToStaticMarkup(
      <TaskbarIconButton icon={icon} label="소개" status="active" />,
    );

    expect(html).toContain("소개");
    expect(html).toContain('data-status="active"');
  });
});
