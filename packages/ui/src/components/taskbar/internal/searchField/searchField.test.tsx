import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import SearchField from "./index";

const renderField = (props: React.ComponentProps<typeof SearchField>) => {
  const html = renderToStaticMarkup(<SearchField {...props} />);
  const container = document.createElement("div");

  container.innerHTML = html;

  const root = container.firstElementChild;
  const input = container.querySelector("input[type='search']");

  expect(root).not.toBeNull();
  expect(input).not.toBeNull();

  return {
    html,
    root: root as HTMLElement,
    input: input as HTMLInputElement,
  };
};

describe("SearchField", () => {
  it("className 없이 렌더링해도 기본 클래스가 존재한다", () => {
    const { root } = renderField({ placeholder: "검색" });
    const cls = root.getAttribute("class") ?? "";

    expect(cls.trim()).not.toBe("");
    expect(cls).toContain("taskbar-search-field");
  });

  it("caller className은 기본 클래스를 대체하지 않고 추가된다", () => {
    const { root } = renderField({ className: "extra", placeholder: "검색" });
    const cls = root.getAttribute("class") ?? "";

    expect(cls).toContain("taskbar-search-field");
    expect(cls).toContain("extra");
  });

  it("슬롯 순서는 span[data-slot='leading'] -> input[type='search'] -> span[data-slot='trailing']이다", () => {
    const { root } = renderField({
      leading: <span data-testid="lead">L</span>,
      trailing: <span data-testid="trail">T</span>,
    });

    expect(root.children).toHaveLength(3);

    const leadingSlot = root.children[0] as HTMLElement;

    expect(leadingSlot.tagName).toBe("SPAN");
    expect(leadingSlot.getAttribute("data-slot")).toBe("leading");
    expect(leadingSlot.querySelector("[data-testid='lead']")).not.toBeNull();

    expect(root.children[1]?.tagName).toBe("INPUT");
    expect((root.children[1] as HTMLElement).getAttribute("data-slot")).toBe("content");
    expect((root.children[1] as HTMLInputElement).type).toBe("search");

    const trailingSlot = root.children[2] as HTMLElement;

    expect(trailingSlot.tagName).toBe("SPAN");
    expect(trailingSlot.getAttribute("data-slot")).toBe("trailing");
    expect(trailingSlot.querySelector("[data-testid='trail']")).not.toBeNull();
  });

  it("leading/trailing slot과 search input을 default shell class + additive className merge로 렌더링한다", () => {
    const { root, input } = renderField({
      className: "custom-search-field",
      leading: <span data-testid="search-leading">검색</span>,
      trailing: <button type="button" data-testid="search-trailing">닫기</button>,
      placeholder: "앱 또는 문서 검색",
      "aria-label": "시작 메뉴 검색",
      readOnly: true,
    });

    const className = root.getAttribute("class") ?? "";

    expect(className).toContain("custom-search-field");
    expect(className.trim()).not.toBe("");
    expect(className.trim()).not.toBe("custom-search-field");
    expect(root.children).toHaveLength(3);

    const leadingSlot = root.firstElementChild as HTMLElement;

    expect(leadingSlot.getAttribute("data-slot")).toBe("leading");
    expect(leadingSlot.querySelector("[data-testid='search-leading']")).not.toBeNull();

    const trailingSlot = root.lastElementChild as HTMLElement;

    expect(trailingSlot.getAttribute("data-slot")).toBe("trailing");
    expect(trailingSlot.querySelector("[data-testid='search-trailing']")).not.toBeNull();

    expect(root.children[1]?.tagName).toBe("INPUT");
    expect((root.children[1] as HTMLElement).getAttribute("data-slot")).toBe("content");
    expect(input.getAttribute("placeholder")).toBe("앱 또는 문서 검색");
    expect(input.getAttribute("aria-label")).toBe("시작 메뉴 검색");
    expect(input.hasAttribute("readonly")).toBe(true);
  });

  it("caller className이 없어도 default shell class와 slot order를 유지한다", () => {
    const { root, input } = renderField({
      leading: <span data-testid="search-leading">검색</span>,
      placeholder: "웹 검색",
    });

    expect((root.getAttribute("class") ?? "").trim()).not.toBe("");
    expect(root.children).toHaveLength(2);

    const leadingSlot = root.firstElementChild as HTMLElement;

    expect(leadingSlot.getAttribute("data-slot")).toBe("leading");
    expect(leadingSlot.querySelector("[data-testid='search-leading']")).not.toBeNull();

    expect(root.children[1]?.tagName).toBe("INPUT");
    expect((root.children[1] as HTMLElement).getAttribute("data-slot")).toBe("content");
    expect(input.getAttribute("placeholder")).toBe("웹 검색");
  });
});
