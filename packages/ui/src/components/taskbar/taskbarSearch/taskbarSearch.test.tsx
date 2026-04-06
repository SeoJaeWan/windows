import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import TaskbarSearch from "./index";

const noop = () => undefined;

const searchProps = {
  placeholder: "검색",
  value: "windows",
  readOnly: true,
  className: "custom-taskbar-search",
  "aria-label": "작업 표시줄 검색",
  onChange: noop,
  onClick: noop,
} satisfies React.ComponentProps<typeof TaskbarSearch>;

const renderSearch = (props: React.ComponentProps<typeof TaskbarSearch>) => {
  const html = renderToStaticMarkup(<TaskbarSearch {...props} />);
  const container = document.createElement("div");

  container.innerHTML = html;

  const root = container.firstElementChild;
  const input = container.querySelector("input");

  expect(root).not.toBeNull();
  expect(input).not.toBeNull();

  return {
    html,
    container,
    root: root as HTMLElement,
    input: input as HTMLInputElement,
  };
};

describe("TaskbarSearch", () => {
  it("placeholder, value, readOnly, generic input props와 additive className merge를 input-like shell로 렌더링한다", () => {
    const { root, input } = renderSearch(searchProps);
    const className = root.getAttribute("class") ?? "";

    expect(input.getAttribute("placeholder")).toBe("검색");
    expect(input.getAttribute("value")).toBe("windows");
    expect(input.getAttribute("aria-label")).toBe("작업 표시줄 검색");
    expect(input.hasAttribute("readonly")).toBe(true);
    expect(className).toContain("custom-taskbar-search");
    expect(className.split(" ")).toContain("taskbar-search");
    expect(className.trim()).not.toBe("");
    expect(className.trim()).not.toBe("custom-taskbar-search");
  });

  it("className 없이 렌더링해도 기본 클래스가 존재한다", () => {
    const { root } = renderSearch({
      placeholder: "검색",
      "aria-label": "작업 표시줄 검색",
    });
    const className = root.getAttribute("class") ?? "";

    expect(className.trim()).not.toBe("");
    expect(className.split(" ")).toContain("taskbar-search");
  });

  it("검색 값이 바뀌면 markup도 함께 달라진다", () => {
    const base = renderSearch(searchProps);
    const next = renderSearch({
      ...searchProps,
      value: "blog",
    });

    expect(next.html).not.toBe(base.html);
    expect(next.input.getAttribute("value")).toBe("blog");
  });
});
