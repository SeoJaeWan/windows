import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ContentRow from "./index";

const renderRow = (props: React.ComponentProps<typeof ContentRow>) => {
  const html = renderToStaticMarkup(<ContentRow {...props} />);
  const container = document.createElement("div");

  container.innerHTML = html;

  const root = container.firstElementChild;

  expect(root).not.toBeNull();

  return {
    html,
    root: root as HTMLElement,
  };
};

describe("ContentRow", () => {
  it("leading/content/trailing slot을 default row class + additive className merge로 렌더링한다", () => {
    const { root } = renderRow({
      className: "custom-content-row",
      leading: <span data-testid="row-leading">F</span>,
      trailing: <span data-testid="row-trailing">{">"}</span>,
      children: (
        <>
          <span>파일 탐색기</span>
          <span>최근 작업</span>
        </>
      ),
    });

    const className = root.getAttribute("class") ?? "";
    const content = root.children[1] as HTMLElement;

    expect(className).toContain("custom-content-row");
    expect(className.trim()).not.toBe("");
    expect(className.trim()).not.toBe("custom-content-row");
    expect(root.children).toHaveLength(3);
    expect(root.firstElementChild?.getAttribute("data-testid")).toBe("row-leading");
    expect(root.lastElementChild?.getAttribute("data-testid")).toBe("row-trailing");
    expect(content.tagName).toBe("DIV");
    expect(content.textContent ?? "").toContain("파일 탐색기");
    expect(content.textContent ?? "").toContain("최근 작업");
  });

  it("caller className이 없어도 default row class와 content wrapper를 유지한다", () => {
    const { root } = renderRow({
      leading: <span data-testid="row-leading">N</span>,
      children: <span>Notion</span>,
    });

    expect((root.getAttribute("class") ?? "").trim()).not.toBe("");
    expect(root.children).toHaveLength(2);
    expect(root.firstElementChild?.getAttribute("data-testid")).toBe("row-leading");
    expect((root.lastElementChild as HTMLElement).textContent ?? "").toContain("Notion");
  });
});
