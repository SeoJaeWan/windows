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
  it("className 없이 렌더링해도 기본 클래스가 존재한다", () => {
    const { root } = renderRow({ children: <span>test</span> });
    const cls = root.getAttribute("class") ?? "";

    expect(cls.trim()).not.toBe("");
    expect(cls).toContain("taskbar-content-row");
  });

  it("caller className은 기본 클래스를 대체하지 않고 추가된다", () => {
    const { root } = renderRow({ className: "extra", children: <span>test</span> });
    const cls = root.getAttribute("class") ?? "";

    expect(cls).toContain("taskbar-content-row");
    expect(cls).toContain("extra");
  });

  it("슬롯 순서는 leading -> content wrapper -> trailing이다", () => {
    const { root } = renderRow({
      leading: <span data-testid="lead">L</span>,
      trailing: <span data-testid="trail">T</span>,
      children: <span>C</span>,
    });

    expect(root.children).toHaveLength(3);
    expect(root.children[0]?.getAttribute("data-testid")).toBe("lead");
    expect(root.children[1]?.tagName).toBe("DIV");
    expect(root.children[2]?.getAttribute("data-testid")).toBe("trail");
  });

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
