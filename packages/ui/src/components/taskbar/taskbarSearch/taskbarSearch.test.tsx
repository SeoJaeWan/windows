import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import TaskbarSearch from "./index";

const noop = () => undefined;

const searchProps = {
  placeholder: "검색",
  value: "windows",
  readOnly: true,
  "aria-label": "작업 표시줄 검색",
  onChange: noop,
  onClick: noop,
} satisfies React.ComponentProps<typeof TaskbarSearch>;

const renderSearch = (props: React.ComponentProps<typeof TaskbarSearch>) => {
  const html = renderToStaticMarkup(<TaskbarSearch {...props} />);
  const container = document.createElement("div");

  container.innerHTML = html;

  const input = container.querySelector("input");

  expect(input).not.toBeNull();

  return {
    html,
    container,
    input: input as HTMLInputElement,
  };
};

describe("TaskbarSearch", () => {
  it("placeholder, value, readOnly와 generic input props를 input-like shell로 렌더링한다", () => {
    const { input } = renderSearch(searchProps);

    expect(input.getAttribute("placeholder")).toBe("검색");
    expect(input.getAttribute("value")).toBe("windows");
    expect(input.getAttribute("aria-label")).toBe("작업 표시줄 검색");
    expect(input.hasAttribute("readonly")).toBe(true);
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
