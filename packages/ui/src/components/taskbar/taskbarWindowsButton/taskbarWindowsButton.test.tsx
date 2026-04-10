import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";

const taskbarWindowsButtonEntryPath = "./index";

async function loadTaskbarWindowsButton() {
  const taskbarWindowsButtonModule = (await import(
    taskbarWindowsButtonEntryPath
  )) as {
    default: ComponentType<Record<string, unknown>>;
  };

  return taskbarWindowsButtonModule.default;
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

function findImage(root: Element) {
  return root.tagName === "IMG" ? root : root.querySelector("img");
}

describe("TaskbarWindowsButton contract", () => {
  it("native button/ARIA prop과 additive class merge를 직접 수용한다", async () => {
    const TaskbarWindowsButton = await loadTaskbarWindowsButton();
    const markup = renderToStaticMarkup(
      createElement(TaskbarWindowsButton, {
        "aria-label": "Windows",
        className: "caller-windows-button",
        disabled: true,
        id: "windows-button",
        title: "시작",
        type: "button",
      }),
    );

    const root = parseRoot(markup);
    const className = extractClassWithToken(markup, "caller-windows-button");

    expect(root.tagName).toBe("BUTTON");
    expect(root.getAttribute("aria-label")).toBe("Windows");
    expect(root.getAttribute("disabled")).not.toBeNull();
    expect(root.getAttribute("id")).toBe("windows-button");
    expect(root.getAttribute("title")).toBe("시작");
    expect(root.getAttribute("type")).toBe("button");
    expect(className).toContain("caller-windows-button");
    expect(className.trim()).not.toBe("caller-windows-button");
  });

  it("taskbar custom prop 없이도 package-owned Windows mark asset을 내부에서 직접 소비한다", async () => {
    const TaskbarWindowsButton = await loadTaskbarWindowsButton();
    const markup = renderToStaticMarkup(
      createElement(TaskbarWindowsButton, {
        "aria-label": "Windows",
      }),
    );

    const root = parseRoot(markup);
    const image = findImage(root);

    expect(root.tagName).toBe("BUTTON");
    expect(image).not.toBeNull();
    expect(image?.getAttribute("src") ?? "").toContain("windows-mark");
  });
});
