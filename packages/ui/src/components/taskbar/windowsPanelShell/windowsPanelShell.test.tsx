import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";

type ShellProps = {
  searchPlaceholder?: string;
  searchValue?: string;
  children?: unknown;
  className?: string;
};

const shellEntryPath = "./index";

async function loadShell() {
  const mod = (await import(shellEntryPath)) as {
    default: ComponentType<ShellProps>;
  };

  return mod.default;
}

function parseRoot(markup: string) {
  const container = document.createElement("div");

  container.innerHTML = markup;

  const root = container.firstElementChild;

  expect(root).not.toBeNull();

  return root!;
}

describe("WindowsPanelShell contract", () => {
  it("shell을 렌더링하면 search input과 body slot을 포함하는 container를 생성한다", async () => {
    const Shell = await loadShell();
    const markup = renderToStaticMarkup(
      createElement(Shell, {
        searchPlaceholder: "앱 및 문서 검색",
        searchValue: "",
      }),
    );

    const root = parseRoot(markup);

    expect(root.querySelector("input")).not.toBeNull();
    expect(root.querySelector("input")?.getAttribute("placeholder")).toBe("앱 및 문서 검색");
    expect(root.className).toContain("windows-panel-shell");
    expect(root.querySelector(".windows-panel-search-row")).not.toBeNull();
    expect(root.querySelector(".windows-panel-body")).not.toBeNull();
  });

  it("className pass-through가 기존 shell class와 합산된다", async () => {
    const Shell = await loadShell();
    const markup = renderToStaticMarkup(
      createElement(Shell, {
        className: "custom-panel",
      }),
    );

    const root = parseRoot(markup);

    expect(root.className).toContain("windows-panel-shell");
    expect(root.className).toContain("custom-panel");
  });

  it("children이 body slot에 렌더링된다", async () => {
    const Shell = await loadShell();
    const markup = renderToStaticMarkup(
      createElement(Shell, {
        children: createElement("div", { "data-testid": "body-content" }, "test body"),
      }),
    );

    const root = parseRoot(markup);
    const body = root.querySelector(".windows-panel-body");

    expect(body).not.toBeNull();
    expect(body!.querySelector("[data-testid='body-content']")).not.toBeNull();
  });

  it("h-[600px] geometry token이 shell root에 존재한다", async () => {
    const Shell = await loadShell();
    const markup = renderToStaticMarkup(createElement(Shell, {}));

    const root = parseRoot(markup);

    expect(root.className).toContain("h-[600px]");
  });

  it("금지된 import를 사용하지 않는다 (next/, jotai, portal, outside, escape)", async () => {
    const sourceModules = import.meta.glob("./index.tsx", {
      eager: true,
      import: "default",
      query: "?raw",
    });

    const sourceText = Object.values(sourceModules).join("");

    expect(sourceText).not.toMatch(/next\//);
    expect(sourceText).not.toMatch(/jotai/);
    expect(sourceText).not.toMatch(/portal/i);
    expect(sourceText).not.toMatch(/outside/i);
    expect(sourceText).not.toMatch(/onEscape/);
    expect(sourceText).not.toMatch(/useTaskPanel/);
    expect(sourceText).not.toMatch(/useContextMenu/);
    expect(sourceText).not.toMatch(/useToggle/);
  });
});
