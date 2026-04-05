import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import TaskbarSearchPanel from "./index";

const noop = () => undefined;

const defaultProps = {
  mode: "default",
  searchPlaceholder: "검색 시작",
  onItemSelect: noop,
  onRequestClose: noop,
  recommendedItems: [
    {
      id: "edge-history",
      label: "최근에 연 페이지",
      meta: "브라우저",
      icon: <span data-testid="recommended-edge-icon">E</span>,
    },
    {
      id: "downloads",
      label: "다운로드",
      meta: "폴더",
    },
  ],
  featuredItems: [
    {
      id: "featured-blog",
      label: "블로그 바로가기",
      description: "최근 작성 글",
      thumbnailSrc: "/featured/blog.png",
      thumbnailAlt: "블로그 썸네일",
    },
    {
      id: "featured-projects",
      label: "프로젝트",
      description: "작업 목록",
    },
  ],
} satisfies React.ComponentProps<typeof TaskbarSearchPanel>;

const resultsProps = {
  mode: "results",
  query: "windows",
  onItemSelect: noop,
  onActionSelect: noop,
  onRequestClose: noop,
  resultItems: [
    {
      id: "windows-ui",
      label: "Windows UI",
      meta: "프로젝트",
      active: true,
      icon: <span data-testid="search-results-icon">W</span>,
    },
    {
      id: "windows-folder",
      label: "windows",
      meta: "폴더",
    },
  ],
  detail: {
    title: "Windows UI",
    description: "최근 수정한 프로젝트",
    metadata: ["프로젝트", "오늘"],
    actions: [
      { id: "open", label: "열기" },
      { id: "pin", label: "핀 고정" },
    ],
  },
} satisfies React.ComponentProps<typeof TaskbarSearchPanel>;

const renderPanel = (props: React.ComponentProps<typeof TaskbarSearchPanel>) => {
  const html = renderToStaticMarkup(<TaskbarSearchPanel {...props} />);
  const container = document.createElement("div");

  container.innerHTML = html;

  return {
    html,
    container,
  };
};

describe("TaskbarSearchPanel", () => {
  it("default 모드에서 recommendedItems와 featuredItems를 함께 렌더링한다", () => {
    const { container } = renderPanel(defaultProps);

    expect(container.textContent ?? "").toContain("검색 시작");
    expect(container.textContent ?? "").toContain("최근에 연 페이지");
    expect(container.textContent ?? "").toContain("다운로드");
    expect(container.textContent ?? "").toContain("블로그 바로가기");
    expect(container.textContent ?? "").toContain("작업 목록");
    expect(container.querySelector("[data-testid='recommended-edge-icon']")).not.toBeNull();
    expect(container.querySelector("[src='/featured/blog.png']")).not.toBeNull();
  });

  it("results 모드에서 query, resultItems, detail action object contract를 start panel results grammar와 맞춰 렌더링한다", () => {
    const { container, html } = renderPanel(resultsProps);

    expect(container.textContent ?? "").toContain("windows");
    expect(container.textContent ?? "").toContain("Windows UI");
    expect(container.textContent ?? "").toContain("최근 수정한 프로젝트");
    expect(container.textContent ?? "").toContain("핀 고정");
    expect(container.querySelector("[data-testid='search-results-icon']")).not.toBeNull();
    expect(html).not.toBe(renderPanel(defaultProps).html);
  });
});
