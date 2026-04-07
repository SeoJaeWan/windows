import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Taskbar from "./index";

const TaskbarUnderTest = Taskbar as React.ComponentType<any>;
const noop = () => undefined;

const baseIcons = [
  { id: "windows", category: "windows", kind: "windows", label: "Windows" },
  { id: "blog", category: "blog", kind: "file", label: "블로그" },
  { id: "project", category: "project", kind: "folder", label: "프로젝트" },
];

const renderTaskbar = (props: Record<string, unknown>) => {
  const html = renderToStaticMarkup(<TaskbarUnderTest {...props} />);
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
  it("entries/icons/windows/search/clock data props만으로 canonical shell과 static pinned/default surface를 렌더링한다", () => {
    const { container, root } = renderTaskbar({
      entries: [
        {
          id: "blog-post",
          category: "blog",
          title: "Blog Post",
          windows: { pinned: true },
          search: { recommended: true },
        },
        {
          id: "project-ui",
          category: "project",
          title: "Windows UI",
          search: { recommended: true, featured: true },
        },
      ],
      icons: baseIcons,
      windows: {
        view: "pinned",
        onPinnedSelect: noop,
        onAllSelect: noop,
      },
      search: {
        view: "default",
        placeholder: "검색 시작",
        onResultSelect: noop,
      },
      clock: {
        timeLabel: "오전 11:24",
        dateLabel: "2026-04-07",
      },
    });
    const text = container.textContent ?? "";
    const className = root.getAttribute("class") ?? "";

    expect(text).toContain("Windows");
    expect(text).toContain("블로그");
    expect(text).toContain("프로젝트");
    expect(text).toContain("Blog Post");
    expect(text).toContain("Windows UI");
    expect(text).toContain("검색 시작");
    expect(text).toContain("오전 11:24");
    expect(text).toContain("2026-04-07");
    expect(root.querySelectorAll("[data-mode='pinned']")).toHaveLength(1);
    expect(root.querySelectorAll("[data-mode='default']")).toHaveLength(1);
    expect(className).toContain("taskbar");
    expect(className.trim()).not.toBe("");
  });

  it("windows reserved category launcher는 entry 매칭 없이 유지되고 pinned view는 pinned opt-in만 surface에 포함한다", () => {
    const { container, root } = renderTaskbar({
      entries: [
        {
          id: "blog-pinned",
          category: "blog",
          title: "고정된 블로그",
          windows: { pinned: true },
        },
        {
          id: "project-default",
          category: "project",
          title: "기본 프로젝트",
        },
      ],
      icons: baseIcons,
      windows: {
        view: "pinned",
        onPinnedSelect: noop,
        onAllSelect: noop,
      },
      search: {
        view: "default",
        placeholder: "검색",
        onResultSelect: noop,
      },
      clock: {
        timeLabel: "오후 4:02",
        dateLabel: "2026-04-07",
      },
    });
    const text = container.textContent ?? "";

    expect(text).toContain("Windows");
    expect(text).toContain("고정된 블로그");
    expect(text).not.toContain("기본 프로젝트");
    expect(root.querySelectorAll("[data-mode='pinned']")).toHaveLength(1);
  });

  it("windows.view='all'에서 visible/order fallback을 해석해 숨김 entry를 제외하고 선언 순서 fallback을 유지한다", () => {
    const { container, root } = renderTaskbar({
      entries: [
        {
          id: "hidden-entry",
          category: "blog",
          title: "숨김 항목",
          windows: { visible: false, order: 0 },
        },
        {
          id: "ordered-entry",
          category: "project",
          title: "정렬 우선",
          windows: { order: 1 },
        },
        {
          id: "fallback-entry-a",
          category: "blog",
          title: "기본 순서 1",
        },
        {
          id: "fallback-entry-b",
          category: "project",
          title: "기본 순서 2",
        },
      ],
      icons: baseIcons,
      windows: {
        view: "all",
        onPinnedSelect: noop,
        onAllSelect: noop,
      },
      search: {
        view: "default",
        placeholder: "검색",
        onResultSelect: noop,
      },
      clock: {
        timeLabel: "오후 4:02",
        dateLabel: "2026-04-07",
      },
    });
    const text = container.textContent ?? "";

    expect(root.querySelectorAll("[data-mode='all']")).toHaveLength(1);
    expect(text).toContain("정렬 우선");
    expect(text).toContain("기본 순서 1");
    expect(text).toContain("기본 순서 2");
    expect(text).not.toContain("숨김 항목");
    expect(text.indexOf("정렬 우선")).toBeLessThan(text.indexOf("기본 순서 1"));
    expect(text.indexOf("기본 순서 1")).toBeLessThan(text.indexOf("기본 순서 2"));
  });

  it("search.view가 없고 search.value가 있으면 results surface를 선택하고 searchable 기본값만 결과에 포함한다", () => {
    const { container, root } = renderTaskbar({
      entries: [
        {
          id: "search-default",
          category: "blog",
          title: "검색 기본값",
        },
        {
          id: "search-excluded",
          category: "project",
          title: "검색 제외 항목",
          search: { searchable: false },
        },
      ],
      icons: baseIcons,
      windows: {
        view: "pinned",
        onPinnedSelect: noop,
        onAllSelect: noop,
      },
      search: {
        value: "검색",
        onResultSelect: noop,
      },
      clock: {
        timeLabel: "오후 4:02",
        dateLabel: "2026-04-07",
      },
    });
    const text = container.textContent ?? "";

    expect(root.querySelectorAll("[data-mode='results']")).toHaveLength(1);
    expect(root.querySelectorAll("[data-mode='default']")).toHaveLength(0);
    expect(text).toContain("검색");
    expect(text).toContain("검색 기본값");
    expect(text).not.toContain("검색 제외 항목");
  });
});
