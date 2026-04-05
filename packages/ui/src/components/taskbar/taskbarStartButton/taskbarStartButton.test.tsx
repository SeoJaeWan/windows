import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import TaskbarStartButton from "./index";

const noop = () => undefined;

const renderButton = (props: React.ComponentProps<typeof TaskbarStartButton>) => {
  const html = renderToStaticMarkup(<TaskbarStartButton {...props} />);
  const container = document.createElement("div");

  container.innerHTML = html;

  const button = container.querySelector("button");

  expect(button).not.toBeNull();

  return {
    html,
    button: button as HTMLButtonElement,
  };
};

describe("TaskbarStartButton", () => {
  it("native button/ARIA prop을 그대로 수용한다", () => {
    const { button } = renderButton({
      "aria-label": "시작",
      disabled: true,
      onClick: noop,
    });

    expect(button.getAttribute("aria-label")).toBe("시작");
    expect(button.hasAttribute("disabled")).toBe(true);
  });

  it("disabled 상태가 바뀌면 markup도 함께 달라진다", () => {
    const enabled = renderButton({
      "aria-label": "시작",
      onClick: noop,
    });
    const disabled = renderButton({
      "aria-label": "시작",
      disabled: true,
      onClick: noop,
    });

    expect(disabled.html).not.toBe(enabled.html);
  });
});
