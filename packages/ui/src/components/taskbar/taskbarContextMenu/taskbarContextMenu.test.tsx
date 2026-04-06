import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import TaskbarContextMenu from "./index";

const noop = () => undefined;

const menuProps = {
  onActionSelect: noop,
  items: [
    {
      id: "open",
      label: "열기",
      leadingIcon: <span data-testid="menu-open-icon">O</span>,
      shortcut: "Enter",
      selected: true,
    },
    {
      id: "pin",
      label: "작업 표시줄에 고정",
      shortcut: "Ctrl+P",
    },
    {
      id: "close",
      label: "닫기",
      destructive: true,
      disabled: true,
    },
  ],
} satisfies React.ComponentProps<typeof TaskbarContextMenu>;

const plainMenuProps = {
  onActionSelect: noop,
  items: [
    {
      id: "open",
      label: "열기",
      leadingIcon: <span data-testid="menu-open-icon">O</span>,
      shortcut: "Enter",
    },
    {
      id: "pin",
      label: "작업 표시줄에 고정",
      shortcut: "Ctrl+P",
    },
    {
      id: "close",
      label: "닫기",
    },
  ],
} satisfies React.ComponentProps<typeof TaskbarContextMenu>;

const renderMenu = (props: React.ComponentProps<typeof TaskbarContextMenu>) => {
  const html = renderToStaticMarkup(<TaskbarContextMenu {...props} />);
  const container = document.createElement("div");

  container.innerHTML = html;

  return {
    html,
    container,
  };
};

describe("TaskbarContextMenu", () => {
  it("leadingIcon, label, shortcut을 row contract로 렌더링한다", () => {
    const { container } = renderMenu(menuProps);
    const root = container.querySelector("[data-panel='context-menu']");

    expect(root).not.toBeNull();

    expect(container.textContent ?? "").toContain("열기");
    expect(container.textContent ?? "").toContain("작업 표시줄에 고정");
    expect(container.textContent ?? "").toContain("Enter");
    expect(container.textContent ?? "").toContain("Ctrl+P");
    expect(container.querySelector("[data-testid='menu-open-icon']")).not.toBeNull();
    expect(((root as HTMLElement).getAttribute("class") ?? "").trim()).not.toBe("");
    expect((root as HTMLElement).getAttribute("class")).toContain("taskbar-context-menu");
  });

  it("disabled, destructive, selected 상태를 plain row와 다른 visual state markup으로 렌더링한다", () => {
    const stateful = renderMenu(menuProps);
    const plain = renderMenu(plainMenuProps);
    const selectedRow = stateful.container.querySelector("[data-selected='true']");
    const destructiveRow = stateful.container.querySelector("[data-destructive='true']");

    expect(selectedRow).not.toBeNull();
    expect(destructiveRow).not.toBeNull();

    expect(stateful.container.textContent ?? "").toContain("닫기");
    expect(stateful.container.textContent ?? "").toContain("열기");
    expect(stateful.html).not.toBe("");
    expect(stateful.html).not.toBe(plain.html);
    expect(((selectedRow as HTMLElement).getAttribute("class") ?? "").trim()).not.toBe("");
    expect(((destructiveRow as HTMLElement).getAttribute("class") ?? "").trim()).not.toBe("");

    // selected, destructive, and plain rows should all have distinct classes
    const plainRow = plain.container.querySelector("button");
    expect(plainRow).not.toBeNull();
    expect((selectedRow as HTMLElement).getAttribute("class")).not.toBe(
      (plainRow as HTMLElement).getAttribute("class"),
    );
    expect((destructiveRow as HTMLElement).getAttribute("class")).not.toBe(
      (plainRow as HTMLElement).getAttribute("class"),
    );
    expect((selectedRow as HTMLElement).getAttribute("class")).not.toBe(
      (destructiveRow as HTMLElement).getAttribute("class"),
    );
  });
});
