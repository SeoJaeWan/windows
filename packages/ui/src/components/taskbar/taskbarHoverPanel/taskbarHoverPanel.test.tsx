import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import TaskbarHoverPanel from "./index";

const noop = () => undefined;

const hoverProps = {
  title: "Chrome",
  showCloseAffordance: true,
  onItemSelect: noop,
  onRequestClose: noop,
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
  it("title, close affordance, preview items contract를 generic callback과 함께 compact preview strip으로 렌더링한다", () => {
    const withClose = renderPanel(hoverProps);
    const withoutClose = renderPanel({
      ...hoverProps,
      showCloseAffordance: false,
    });
    const root = withClose.container.querySelector("[data-panel='hover']");
    const closeButton = withClose.container.querySelector("button[aria-label='닫기']");

    expect(root).not.toBeNull();
    expect(closeButton).not.toBeNull();

    expect(withClose.container.textContent ?? "").toContain("Chrome");
    expect(withClose.container.textContent ?? "").toContain("블로그 편집");
    expect(withClose.container.textContent ?? "").toContain("프로젝트 문서");
    expect(withClose.container.textContent ?? "").toContain("마지막 수정 1분 전");
    expect(withClose.container.querySelector("[src='/thumbs/blog.png']")).not.toBeNull();
    expect(withClose.html).not.toBe(withoutClose.html);
    expect(((root as HTMLElement).getAttribute("class") ?? "").trim()).not.toBe("");
    expect(((closeButton as HTMLElement).getAttribute("class") ?? "").trim()).not.toBe("");
  });

  it("showCloseAffordance가 false여도 preview item content는 유지하고 close chrome만 줄인다", () => {
    const withClose = renderPanel(hoverProps);
    const withoutClose = renderPanel({
      ...hoverProps,
      showCloseAffordance: false,
    });

    expect(withoutClose.container.textContent ?? "").toContain("Chrome");
    expect(withoutClose.container.textContent ?? "").toContain("블로그 편집");
    expect(withoutClose.container.textContent ?? "").toContain("프로젝트 문서");
    expect(withoutClose.container.textContent ?? "").toContain("두 번째 탭");
    expect(withoutClose.html).not.toBe("");
    expect(withoutClose.html).not.toBe(withClose.html);
  });
});
