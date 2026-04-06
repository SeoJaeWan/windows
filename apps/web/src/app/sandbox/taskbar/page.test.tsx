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
  it("정적 preview surface로 canonical scene과 fixture matrix를 함께 렌더링한다", async () => {
    const { container } = await renderPage();

    expect(container.querySelector("[data-testid='taskbar-sandbox-preview']")).not.toBeNull();
    expect(container.querySelector("[data-testid='taskbar-sandbox-canonical']")).not.toBeNull();
    expect(container.querySelector("[data-testid='taskbar-sandbox-matrix']")).not.toBeNull();

    expect(container.querySelectorAll("[data-status]")).toHaveLength(3);
    expect(container.querySelectorAll("[data-panel='start']")).toHaveLength(3);
    expect(container.querySelectorAll("[data-panel='search']")).toHaveLength(2);
    expect(container.querySelectorAll("[data-panel='hover']")).toHaveLength(2);
    expect(container.querySelectorAll("[data-panel='context-menu']")).toHaveLength(2);

    expect(container.textContent ?? "").toContain("시작");
    expect(container.textContent ?? "").toContain("블로그");
    expect(container.textContent ?? "").toContain("프로젝트");
    expect(container.textContent ?? "").toContain("11:24");
    expect(container.textContent ?? "").toContain("고정됨");
    expect(container.textContent ?? "").toContain("검색 시작");
    expect(container.textContent ?? "").toContain("Chrome");
    expect(container.textContent ?? "").toContain("작업 표시줄에 고정");
  });

  it("fixture text를 canonical contract 기준으로 유지하고 route-local wrapper text로 drift시키지 않는다", async () => {
    const { html, container } = await renderPage();

    expect(container.textContent ?? "").toContain("파일 탐색기");
    expect(container.textContent ?? "").toContain("Notion");
    expect(container.textContent ?? "").toContain("Blog Post");
    expect(container.textContent ?? "").toContain("Windows UI");
    expect(container.textContent ?? "").toContain("블로그 편집");
    expect(container.textContent ?? "").toContain("Ctrl+P");
    expect(html).not.toContain("/featured/blog.png");
    expect(html).not.toContain("/thumbs/blog.png");
  });
});
