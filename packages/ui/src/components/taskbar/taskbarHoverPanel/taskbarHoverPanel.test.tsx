import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import TaskbarHoverPanel from "./index";

const hoverProps = {
  title: "Chrome",
  showCloseAffordance: true,
  items: [
    {
      id: "chrome-1",
      label: "블로그 편집",
      thumbnailSrc: "/thumbs/blog.png",
      thumbnailAlt: "블로그 편집 썸네일",
      caption: "마지막 수정 1분 전",
    },
    {
      id: "chrome-2",
      label: "프로젝트 문서",
      caption: "두 번째 탭",
    },
  ],
} satisfies React.ComponentProps<typeof TaskbarHoverPanel>;

const renderPanel = (props: React.ComponentProps<typeof TaskbarHoverPanel>) => {
  const html = renderToStaticMarkup(<TaskbarHoverPanel {...props} />);
  const container = document.createElement("div");

  container.innerHTML = html;

  return {
    html,
    container,
  };
};

describe("TaskbarHoverPanel", () => {
  it("title, close affordance, preview items contract를 compact preview strip으로 렌더링한다", () => {
    const { container } = renderPanel(hoverProps);

    expect(container.textContent ?? "").toContain("Chrome");
    expect(container.textContent ?? "").toContain("블로그 편집");
    expect(container.textContent ?? "").toContain("프로젝트 문서");
    expect(container.textContent ?? "").toContain("마지막 수정 1분 전");
    expect(container.querySelector("[src='/thumbs/blog.png']")).not.toBeNull();
  });

  it("showCloseAffordance가 false여도 items만으로 preview strip을 유지한다", () => {
    const { container, html } = renderPanel({
      ...hoverProps,
      showCloseAffordance: false,
    });

    expect(container.textContent ?? "").toContain("Chrome");
    expect(container.textContent ?? "").toContain("프로젝트 문서");
    expect(html).not.toBe("");
  });
});
