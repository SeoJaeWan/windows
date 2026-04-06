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
    expect(root.firstElementChild?.getAttribute("data-testid")).toBe("search-leading");
    expect(root.lastElementChild?.getAttribute("data-testid")).toBe("search-trailing");
    expect(root.children[1]?.tagName).toBe("INPUT");
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
    expect(root.firstElementChild?.getAttribute("data-testid")).toBe("search-leading");
    expect(root.children[1]?.tagName).toBe("INPUT");
    expect(input.getAttribute("placeholder")).toBe("웹 검색");
  });
});
