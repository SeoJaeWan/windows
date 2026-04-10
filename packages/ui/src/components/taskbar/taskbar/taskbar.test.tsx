import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";

const taskbarEntryPath = "./index";

function extractFirstClassName(markup: string) {
  const match = markup.match(/class="([^"]+)"/);

  expect(match).not.toBeNull();

  return match![1] ?? "";
}

describe("Taskbar shell contract", () => {
  it("package-owned rail wrapper와 additive class merge를 함께 유지한다", async () => {
    const taskbarModule = (await import(taskbarEntryPath)) as {
      default: ComponentType<Record<string, unknown>>;
    };
    const Taskbar = taskbarModule.default;

    const markup = renderToStaticMarkup(
      createElement(
        Taskbar,
        {
          "aria-label": "작업 표시줄",
          className: "caller-shell",
          "data-testid": "taskbar-shell",
          id: "taskbar-root",
          role: "navigation",
        },
        createElement("span", { "data-testid": "taskbar-child" }, "child"),
      ),
    );

    const className = extractFirstClassName(markup);

    expect(markup).toContain('aria-label="작업 표시줄"');
    expect(markup).toContain('data-testid="taskbar-shell"');
    expect(markup).toContain('id="taskbar-root"');
    expect(markup).toContain('role="navigation"');
    expect(markup).toContain('data-testid="taskbar-child"');
    expect(className).toContain("caller-shell");
    expect(className.trim()).not.toBe("caller-shell");
  });

  it("child가 없어도 caller wrapper 없이 package-owned rail shell을 직접 렌더링한다", async () => {
    const taskbarModule = (await import(taskbarEntryPath)) as {
      default: ComponentType<Record<string, unknown>>;
    };
    const Taskbar = taskbarModule.default;

    const markup = renderToStaticMarkup(
      createElement(Taskbar, {
        "data-testid": "taskbar-shell",
      }),
    );

    const className = extractFirstClassName(markup);

    expect(markup).toContain('data-testid="taskbar-shell"');
    expect((className ?? "").trim().length).toBeGreaterThan(0);
  });
});
