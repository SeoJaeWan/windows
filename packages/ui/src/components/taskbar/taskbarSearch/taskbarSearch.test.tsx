import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";

const taskbarSearchEntryPath = "./index";

async function loadTaskbarSearch() {
  const taskbarSearchModule = (await import(taskbarSearchEntryPath)) as {
    default: ComponentType<Record<string, unknown>>;
  };

  return taskbarSearchModule.default;
}

function extractClassWithToken(markup: string, token: string) {
  const safeToken = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = markup.match(new RegExp(`class="([^"]*${safeToken}[^"]*)"`));

  expect(match).not.toBeNull();

  return match![1] ?? "";
}

function parseRoot(markup: string) {
  const container = document.createElement("div");

  container.innerHTML = markup;

  const root = container.firstElementChild;

  expect(root).not.toBeNull();

  return root!;
}

describe("TaskbarSearch contract", () => {
  it("placeholder/value/readOnly와 generic input prop을 native input winner contract로 통과시킨다", async () => {
    const TaskbarSearch = await loadTaskbarSearch();
    const markup = renderToStaticMarkup(
      createElement(TaskbarSearch, {
        "aria-label": "검색",
        className: "caller-taskbar-search",
        inputMode: "search",
        name: "query",
        placeholder: "검색",
        readOnly: true,
        value: "메모장",
      }),
    );

    const root = parseRoot(markup);
    const input = root.querySelector("input");
    const className = extractClassWithToken(markup, "caller-taskbar-search");

    expect(input).not.toBeNull();
    expect(input?.getAttribute("aria-label")).toBe("검색");
    expect(input?.getAttribute("inputmode")).toBe("search");
    expect(input?.getAttribute("name")).toBe("query");
    expect(input?.getAttribute("placeholder")).toBe("검색");
    expect(input?.getAttribute("readonly")).not.toBeNull();
    expect(input?.getAttribute("value")).toBe("메모장");
    expect(className).toContain("caller-taskbar-search");
    expect(className.trim()).not.toBe("caller-taskbar-search");
  });

  it("별도 label prop 없이도 input과 decorative shell을 함께 직접 렌더링한다", async () => {
    const TaskbarSearch = await loadTaskbarSearch();
    const markup = renderToStaticMarkup(
      createElement(TaskbarSearch, {
        placeholder: "Search",
      }),
    );

    const root = parseRoot(markup);

    expect(root.tagName).not.toBe("INPUT");
    expect(root.querySelector("input")).not.toBeNull();
    expect(root.querySelectorAll("*").length).toBeGreaterThan(1);
  });
});
