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

  it("슬롯 순서는 span[data-slot='leading'] -> div[data-slot='content'] -> span[data-slot='trailing']이다", () => {
    const { root } = renderRow({
      leading: <span data-testid="lead">L</span>,
      trailing: <span data-testid="trail">T</span>,
      children: <span>C</span>,
    });

    expect(root.children).toHaveLength(3);

    const leadingSlot = root.children[0] as HTMLElement;

    expect(leadingSlot.tagName).toBe("SPAN");
    expect(leadingSlot.getAttribute("data-slot")).toBe("leading");
    expect(leadingSlot.querySelector("[data-testid='lead']")).not.toBeNull();

    const contentSlot = root.children[1] as HTMLElement;

    expect(contentSlot.tagName).toBe("DIV");
    expect(contentSlot.getAttribute("data-slot")).toBe("content");

    const trailingSlot = root.children[2] as HTMLElement;

    expect(trailingSlot.tagName).toBe("SPAN");
    expect(trailingSlot.getAttribute("data-slot")).toBe("trailing");
    expect(trailingSlot.querySelector("[data-testid='trail']")).not.toBeNull();
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
    const contentSlot = root.children[1] as HTMLElement;

    expect(className).toContain("custom-content-row");
    expect(className.trim()).not.toBe("");
    expect(className.trim()).not.toBe("custom-content-row");
    expect(root.children).toHaveLength(3);

    const leadingSlot = root.firstElementChild as HTMLElement;

    expect(leadingSlot.getAttribute("data-slot")).toBe("leading");
    expect(leadingSlot.querySelector("[data-testid='row-leading']")).not.toBeNull();

    const trailingSlot = root.lastElementChild as HTMLElement;

    expect(trailingSlot.getAttribute("data-slot")).toBe("trailing");
    expect(trailingSlot.querySelector("[data-testid='row-trailing']")).not.toBeNull();

    expect(contentSlot.tagName).toBe("DIV");
    expect(contentSlot.getAttribute("data-slot")).toBe("content");
    expect(contentSlot.textContent ?? "").toContain("파일 탐색기");
    expect(contentSlot.textContent ?? "").toContain("최근 작업");
  });

  it("caller className이 없어도 default row class와 content wrapper를 유지한다", () => {
    const { root } = renderRow({
      leading: <span data-testid="row-leading">N</span>,
      children: <span>Notion</span>,
    });

    expect((root.getAttribute("class") ?? "").trim()).not.toBe("");
    expect(root.children).toHaveLength(2);

    const leadingSlot = root.firstElementChild as HTMLElement;

    expect(leadingSlot.getAttribute("data-slot")).toBe("leading");
    expect(leadingSlot.querySelector("[data-testid='row-leading']")).not.toBeNull();

    const contentSlot = root.lastElementChild as HTMLElement;

    expect(contentSlot.getAttribute("data-slot")).toBe("content");
    expect(contentSlot.textContent ?? "").toContain("Notion");
  });
});
