import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import TaskbarIconButton from "./index";

const icon = <span data-testid="mock-taskbar-icon">I</span>;
const noop = () => undefined;

const renderButton = (props: React.ComponentProps<typeof TaskbarIconButton>) => {
  const html = renderToStaticMarkup(<TaskbarIconButton {...props} />);
  const container = document.createElement("div");

  container.innerHTML = html;

  const button = container.querySelector("button");
  const statusNode = container.querySelector("[data-status]");

  expect(button).not.toBeNull();
  expect(statusNode).not.toBeNull();

  return {
    html,
    button: button as HTMLButtonElement,
    container,
    statusNode: statusNode as HTMLElement,
  };
};

describe("TaskbarIconButton", () => {
  it("default 상태에서 아이콘, 라벨, native button prop, data-status를 함께 렌더링한다", () => {
    const { button, container, statusNode } = renderButton({
      icon,
      label: "블로그",
      status: "default",
      "aria-label": "블로그 바로가기",
      disabled: true,
      onClick: noop,
    });

    expect(container.querySelector("[data-testid='mock-taskbar-icon']")).not.toBeNull();
    expect(container.textContent ?? "").toContain("블로그");
    expect(button.getAttribute("aria-label")).toBe("블로그 바로가기");
    expect(button.hasAttribute("disabled")).toBe(true);
    expect(statusNode.getAttribute("data-status")).toBe("default");
  });

  it("open 상태를 data-status로 구분하고 default와 다른 markup을 만든다", () => {
    const defaultRender = renderButton({
      icon,
      label: "프로젝트",
      status: "default",
    });
    const openRender = renderButton({
      icon,
      label: "프로젝트",
      status: "open",
    });

    expect(openRender.statusNode.getAttribute("data-status")).toBe("open");
    expect(openRender.html).not.toBe(defaultRender.html);
  });

  it("active 상태를 data-status로 구분하고 open과 다른 markup을 만든다", () => {
    const openRender = renderButton({
      icon,
      label: "소개",
      status: "open",
    });
    const activeRender = renderButton({
      icon,
      label: "소개",
      status: "active",
    });

    expect(activeRender.statusNode.getAttribute("data-status")).toBe("active");
    expect(activeRender.html).not.toBe(openRender.html);
  });
});
