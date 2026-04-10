import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";

const taskbarClockEntryPath = "./index";

async function loadTaskbarClock() {
  const taskbarClockModule = (await import(taskbarClockEntryPath)) as {
    default: ComponentType<Record<string, unknown>>;
  };

  return taskbarClockModule.default;
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

describe("TaskbarClock contract", () => {
  it("timeLabel/dateLabel와 container DOM prop, additive class merge를 직접 수용한다", async () => {
    const TaskbarClock = await loadTaskbarClock();
    const markup = renderToStaticMarkup(
      createElement(TaskbarClock, {
        "aria-label": "시계",
        className: "caller-taskbar-clock",
        "data-testid": "taskbar-clock",
        dateLabel: "2026-04-10",
        id: "clock-root",
        timeLabel: "09:41",
      }),
    );

    const root = parseRoot(markup);
    const className = extractClassWithToken(markup, "caller-taskbar-clock");

    expect(root.getAttribute("aria-label")).toBe("시계");
    expect(root.getAttribute("data-testid")).toBe("taskbar-clock");
    expect(root.getAttribute("id")).toBe("clock-root");
    expect(root.textContent).toContain("09:41");
    expect(root.textContent).toContain("2026-04-10");
    expect(className).toContain("caller-taskbar-clock");
    expect(className.trim()).not.toBe("caller-taskbar-clock");
  });

  it("caller가 준 두 문자열을 formatter 없이 두 줄 블록으로 직접 렌더링한다", async () => {
    const TaskbarClock = await loadTaskbarClock();
    const firstMarkup = renderToStaticMarkup(
      createElement(TaskbarClock, {
        dateLabel: "DATE::2026-04-10",
        timeLabel: "TIME::09:41",
      }),
    );
    const secondMarkup = renderToStaticMarkup(
      createElement(TaskbarClock, {
        dateLabel: "DATE::금",
        timeLabel: "TIME::오전 9:41",
      }),
    );

    const firstRoot = parseRoot(firstMarkup);
    const secondRoot = parseRoot(secondMarkup);
    const firstTextElements = Array.from(firstRoot.querySelectorAll("*")).filter(
      (element) => {
        const text = element.textContent?.trim();

        return text === "TIME::09:41" || text === "DATE::2026-04-10";
      },
    );
    const secondTextElements = Array.from(
      secondRoot.querySelectorAll("*"),
    ).filter((element) => {
      const text = element.textContent?.trim();

      return text === "TIME::오전 9:41" || text === "DATE::금";
    });

    expect(firstMarkup).toContain("TIME::09:41");
    expect(firstMarkup).toContain("DATE::2026-04-10");
    expect(secondMarkup).toContain("TIME::오전 9:41");
    expect(secondMarkup).toContain("DATE::금");
    expect(firstMarkup).not.toBe(secondMarkup);
    expect(
      firstMarkup.includes("<br") || firstTextElements.length >= 2,
    ).toBe(true);
    expect(
      secondMarkup.includes("<br") || secondTextElements.length >= 2,
    ).toBe(true);
  });
});
