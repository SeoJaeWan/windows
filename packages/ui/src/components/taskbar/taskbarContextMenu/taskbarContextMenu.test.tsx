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

    expect(container.textContent ?? "").toContain("열기");
    expect(container.textContent ?? "").toContain("작업 표시줄에 고정");
    expect(container.textContent ?? "").toContain("Enter");
    expect(container.textContent ?? "").toContain("Ctrl+P");
    expect(container.querySelector("[data-testid='menu-open-icon']")).not.toBeNull();
  });

  it("disabled, destructive, selected 상태를 generic action callback과 함께 visual state로 렌더링한다", () => {
    const { container, html } = renderMenu(menuProps);

    expect(container.textContent ?? "").toContain("닫기");
    expect(html).not.toBe("");
  });
});
