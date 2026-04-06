import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import PanelTile from "./index";

const noop = () => undefined;

const framedProps = {
  variant: "framed",
  label: "미디어 리스트 속도 개선기",
  description: "최근 작성 글",
  graphic: <span data-testid="framed-graphic">G</span>,
  selected: true,
  className: "custom-framed-tile",
  "aria-label": "미디어 리스트 속도 개선기",
  onClick: noop,
  onContextMenu: noop,
} satisfies React.ComponentProps<typeof PanelTile>;

const compactProps = {
  variant: "compact",
  label: "2025를 보내며",
  graphic: <span data-testid="compact-graphic">C</span>,
  className: "custom-compact-tile",
  onClick: noop,
} satisfies React.ComponentProps<typeof PanelTile>;

const renderTile = (props: React.ComponentProps<typeof PanelTile>) => {
  const html = renderToStaticMarkup(<PanelTile {...props} />);
  const container = document.createElement("div");

  container.innerHTML = html;

  const button = container.querySelector("button");

  expect(button).not.toBeNull();

  return {
    html,
    button: button as HTMLButtonElement,
    container,
  };
};

describe("PanelTile", () => {
  it("framed variant는 className 없이 렌더링해도 고유한 기본 클래스가 존재한다", () => {
    const { button } = renderTile({ variant: "framed", label: "테스트" });
    const cls = button.getAttribute("class") ?? "";

    expect(cls.trim()).not.toBe("");
    expect(cls).toContain("taskbar-panel-tile-framed");
  });

  it("compact variant는 className 없이 렌더링해도 고유한 기본 클래스가 존재한다", () => {
    const { button } = renderTile({ variant: "compact", label: "테스트" });
    const cls = button.getAttribute("class") ?? "";

    expect(cls.trim()).not.toBe("");
    expect(cls).toContain("taskbar-panel-tile-compact");
  });

  it("framed와 compact variant의 기본 클래스는 서로 다르다", () => {
    const framed = renderTile({ variant: "framed", label: "A" });
    const compact = renderTile({ variant: "compact", label: "B" });

    expect(framed.button.getAttribute("class")).not.toBe(compact.button.getAttribute("class"));
  });

  it("framed variant에서 caller className은 기본 클래스를 대체하지 않고 추가된다", () => {
    const { button } = renderTile({ variant: "framed", label: "A", className: "my-framed" } as React.ComponentProps<typeof PanelTile>);
    const cls = button.getAttribute("class") ?? "";

    expect(cls).toContain("taskbar-panel-tile-framed");
    expect(cls).toContain("my-framed");
  });

  it("compact variant에서 caller className은 기본 클래스를 대체하지 않고 추가된다", () => {
    const { button } = renderTile({ variant: "compact", label: "B", className: "my-compact" } as React.ComponentProps<typeof PanelTile>);
    const cls = button.getAttribute("class") ?? "";

    expect(cls).toContain("taskbar-panel-tile-compact");
    expect(cls).toContain("my-compact");
  });

  it("framed variant에서 graphic, label, description, native button prop을 함께 렌더링한다", () => {
    const { button, container } = renderTile(framedProps);
    const className = button.getAttribute("class") ?? "";

    expect(container.querySelector("[data-testid='framed-graphic']")).not.toBeNull();
    expect(container.textContent ?? "").toContain("미디어 리스트 속도 개선기");
    expect(container.textContent ?? "").toContain("최근 작성 글");
    expect(button.getAttribute("aria-label")).toBe("미디어 리스트 속도 개선기");
    expect(className).toContain("custom-framed-tile");
    expect(className.trim()).not.toBe("");
    expect(className.trim()).not.toBe("custom-framed-tile");
  });

  it("compact variant는 framed와 다른 markup으로 compact icon tile grammar를 렌더링한다", () => {
    const framed = renderTile(framedProps);
    const compact = renderTile(compactProps);
    const className = compact.button.getAttribute("class") ?? "";

    expect(compact.container.querySelector("[data-testid='compact-graphic']")).not.toBeNull();
    expect(compact.container.textContent ?? "").toContain("2025를 보내며");
    expect(compact.html).not.toBe(framed.html);
    expect(className).toContain("custom-compact-tile");
    expect(className.trim()).not.toBe("");
    expect(className.trim()).not.toBe("custom-compact-tile");
  });
});
