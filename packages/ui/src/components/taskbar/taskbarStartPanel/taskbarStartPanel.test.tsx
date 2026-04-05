import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import TaskbarStartPanel from "./index";

const noop = () => undefined;

const pinnedProps = {
  mode: "pinned",
  searchPlaceholder: "앱 또는 문서 검색",
  heading: "고정됨",
  viewAllLabel: "모두",
  onViewAllClick: noop,
  onItemSelect: noop,
  onRequestClose: noop,
  pinnedItems: [
    {
      id: "file-explorer",
      label: "파일 탐색기",
      icon: <span data-testid="pinned-file-explorer-icon">F</span>,
      description: "최근 작업",
    },
    {
      id: "folder",
      label: "문서",
      icon: <span data-testid="pinned-folder-icon">D</span>,
    },
  ],
} satisfies React.ComponentProps<typeof TaskbarStartPanel>;

const allProps = {
  mode: "all",
  searchPlaceholder: "앱 검색",
  onCategorySelect: noop,
  onItemSelect: noop,
  onRequestClose: noop,
  categories: [
    { id: "recent", label: "최근 추가됨", active: true },
    { id: "productivity", label: "생산성" },
  ],
  sections: [
    {
      id: "recent",
      label: "최근 추가됨",
      items: [
        {
          id: "notion",
          label: "Notion",
          icon: <span data-testid="all-notion-icon">N</span>,
          description: "워크스페이스",
        },
      ],
    },
    {
      id: "productivity",
      label: "생산성",
      items: [
        {
          id: "excel",
          label: "Excel",
          icon: <span data-testid="all-excel-icon">E</span>,
        },
      ],
    },
  ],
} satisfies React.ComponentProps<typeof TaskbarStartPanel>;

const resultsProps = {
  mode: "results",
  query: "blog",
  onItemSelect: noop,
  onActionSelect: noop,
  onRequestClose: noop,
  resultItems: [
    {
      id: "blog-post",
      label: "Blog Post",
      meta: "문서",
      active: true,
      icon: <span data-testid="result-blog-icon">B</span>,
    },
    {
      id: "blog-folder",
      label: "Blog Assets",
      meta: "폴더",
    },
  ],
  detail: {
    title: "Blog Post",
    description: "최근 열람한 문서",
    metadata: ["문서", "2분 전"],
    actions: [
      { id: "open", label: "열기" },
      { id: "open-folder", label: "파일 위치 열기" },
    ],
  },
} satisfies React.ComponentProps<typeof TaskbarStartPanel>;

const renderPanel = (props: React.ComponentProps<typeof TaskbarStartPanel>) => {
  const html = renderToStaticMarkup(<TaskbarStartPanel {...props} />);
  const container = document.createElement("div");

  container.innerHTML = html;

  return {
    html,
    container,
  };
};

describe("TaskbarStartPanel", () => {
  it("pinned 모드에서 검색 placeholder, heading, viewAllLabel, pinnedItems를 렌더링한다", () => {
    const { container } = renderPanel(pinnedProps);

    expect(container.textContent ?? "").toContain("앱 또는 문서 검색");
    expect(container.textContent ?? "").toContain("고정됨");
    expect(container.textContent ?? "").toContain("모두");
    expect(container.textContent ?? "").toContain("파일 탐색기");
    expect(container.textContent ?? "").toContain("문서");
    expect(container.querySelector("[data-testid='pinned-file-explorer-icon']")).not.toBeNull();
  });

  it("all 모드에서 categories와 section items를 grouped list grammar로 렌더링한다", () => {
    const { container } = renderPanel(allProps);

    expect(container.textContent ?? "").toContain("앱 검색");
    expect(container.textContent ?? "").toContain("최근 추가됨");
    expect(container.textContent ?? "").toContain("생산성");
    expect(container.textContent ?? "").toContain("Notion");
    expect(container.textContent ?? "").toContain("Excel");
    expect(container.querySelector("[data-testid='all-notion-icon']")).not.toBeNull();
  });

  it("results 모드에서 query, resultItems, detail action object contract를 함께 렌더링한다", () => {
    const { container, html } = renderPanel(resultsProps);

    expect(container.textContent ?? "").toContain("blog");
    expect(container.textContent ?? "").toContain("Blog Post");
    expect(container.textContent ?? "").toContain("Blog Assets");
    expect(container.textContent ?? "").toContain("최근 열람한 문서");
    expect(container.textContent ?? "").toContain("파일 위치 열기");
    expect(container.querySelector("[data-testid='result-blog-icon']")).not.toBeNull();
    expect(html).not.toBe(renderPanel(pinnedProps).html);
  });
});
