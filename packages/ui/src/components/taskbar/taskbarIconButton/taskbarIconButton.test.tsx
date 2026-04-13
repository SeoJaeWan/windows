import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";

const taskbarIconButtonEntryPath = "./index";

async function loadTaskbarIconButton() {
  const taskbarIconButtonModule = (await import(taskbarIconButtonEntryPath)) as {
    default: ComponentType<Record<string, unknown>>;
  };

  return taskbarIconButtonModule.default;
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

function renderStatusMarkup(
  TaskbarIconButton: ComponentType<Record<string, unknown>>,
  status: "default" | "active" | "hide",
) {
  return renderToStaticMarkup(
    createElement(TaskbarIconButton, {
      "aria-label": `${status} icon`,
      className: "caller-icon-button",
      iconSrc: "/icons/notepad.png",
      status,
      type: "button",
    }),
  );
}

describe("TaskbarIconButton contract", () => {
  it("status와 iconSrc, native button prop, additive class merge를 함께 연다", async () => {
    const TaskbarIconButton = await loadTaskbarIconButton();
    const markup = renderToStaticMarkup(
      createElement(TaskbarIconButton, {
        "aria-label": "메모장",
        className: "caller-icon-button",
        "data-testid": "icon-button",
        disabled: true,
        iconSrc: "/icons/notepad.png",
        id: "memo-button",
        status: "active",
        type: "button",
      }),
    );

    const root = parseRoot(markup);
    const image = findImage(root);
    const className = extractClassWithToken(markup, "caller-icon-button");

    expect(root.tagName).toBe("BUTTON");
    expect(root.getAttribute("aria-label")).toBe("메모장");
    expect(root.getAttribute("data-testid")).toBe("icon-button");
    expect(root.getAttribute("disabled")).not.toBeNull();
    expect(root.getAttribute("id")).toBe("memo-button");
    expect(root.getAttribute("type")).toBe("button");
    expect(image).not.toBeNull();
    expect(image?.getAttribute("src")).toContain("/icons/notepad.png");
    expect(className).toContain("caller-icon-button");
    expect(className.trim()).not.toBe("caller-icon-button");
  });

  it("같은 caller className이어도 default active hide가 서로 다른 package-owned output을 만든다", async () => {
    const TaskbarIconButton = await loadTaskbarIconButton();
    const defaultMarkup = renderStatusMarkup(TaskbarIconButton, "default");
    const activeMarkup = renderStatusMarkup(TaskbarIconButton, "active");
    const hideMarkup = renderStatusMarkup(TaskbarIconButton, "hide");

    const activeRoot = parseRoot(activeMarkup);
    const hideRoot = parseRoot(hideMarkup);

    expect(defaultMarkup).not.toBe(activeMarkup);
    expect(defaultMarkup).not.toBe(hideMarkup);
    expect(activeMarkup).not.toBe(hideMarkup);
    expect(defaultMarkup).toContain("/icons/notepad.png");
    expect(activeMarkup).toContain("/icons/notepad.png");
    expect(hideMarkup).toContain("/icons/notepad.png");
    expect(activeRoot.querySelector(".taskbar-icon-button__indicator")).not.toBeNull();
    expect(hideRoot.querySelector(".taskbar-icon-button__indicator")).not.toBeNull();
    expect(activeRoot.querySelectorAll("*").length).toBeGreaterThan(1);
    expect(hideRoot.querySelectorAll("*").length).toBeGreaterThan(1);
  });
});
