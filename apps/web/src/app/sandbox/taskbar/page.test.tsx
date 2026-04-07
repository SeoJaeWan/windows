import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

const renderPage = async () => {
  const { default: TaskbarSandboxPage } = await import("./page");
  const html = renderToStaticMarkup(await TaskbarSandboxPage({}));
  const container = document.createElement("div");

  container.innerHTML = html;

  return {
    html,
    container,
  };
};

describe("TaskbarSandboxPage", () => {
  it("legacy preview/matrix marker 대신 canonical/compare reference stage를 렌더링한다", async () => {
    const { container } = await renderPage();
    const text = container.textContent ?? "";

    expect(container.querySelector("[data-testid='taskbar-sandbox-canonical']")).not.toBeNull();
    expect(container.querySelector("[data-testid='taskbar-sandbox-compare']")).not.toBeNull();
    expect(container.querySelector("[data-testid='taskbar-sandbox-preview']")).toBeNull();
    expect(container.querySelector("[data-testid='taskbar-sandbox-matrix']")).toBeNull();
    expect(text).not.toContain("Taskbar Sandbox Preview");
    expect(text).not.toContain("Component Matrix");
  });

  it("canonical stage는 pinned/default, compare stage는 all/results static state를 고정한다", async () => {
    const { container } = await renderPage();
    const canonical = container.querySelector("[data-testid='taskbar-sandbox-canonical']");
    const compare = container.querySelector("[data-testid='taskbar-sandbox-compare']");

    expect(canonical).not.toBeNull();
    expect(compare).not.toBeNull();

    expect(canonical?.querySelectorAll("[data-mode='pinned']")).toHaveLength(1);
    expect(canonical?.querySelectorAll("[data-mode='default']")).toHaveLength(1);
    expect(compare?.querySelectorAll("[data-mode='all']")).toHaveLength(1);
    expect(compare?.querySelectorAll("[data-mode='results']")).toHaveLength(1);
  });

  it("route text는 reference owner surface를 설명하고 pinned/all + default/results fixture를 함께 드러낸다", async () => {
    const { container, html } = await renderPage();
    const text = container.textContent ?? "";

    expect(text).toContain("Windows");
    expect(text).toContain("블로그");
    expect(text).toContain("프로젝트");
    expect(text).toContain("고정됨");
    expect(text).toContain("검색 시작");
    expect(text).toContain("Windows UI");
    expect(html).not.toContain("TaskbarStartButton");
    expect(html).not.toContain("TaskbarStartPanel");
  });
});
