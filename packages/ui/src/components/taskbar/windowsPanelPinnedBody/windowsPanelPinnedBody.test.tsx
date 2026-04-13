import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";

type PinnedItem = { id: string; label: string; icon: string };

type PinnedBodyProps = {
  title: string;
  actionLabel: string;
  items: PinnedItem[];
};

const entryPath = "./index";

async function loadPinnedBody() {
  const mod = (await import(entryPath)) as {
    default: ComponentType<PinnedBodyProps>;
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

describe("WindowsPanelPinnedBody contract", () => {
  const items: PinnedItem[] = [
    { id: "1", label: "기술 문서", icon: "📝" },
    { id: "2", label: "프로젝트", icon: "📁" },
  ];

  it("title과 actionLabel을 렌더링한다", async () => {
    const PinnedBody = await loadPinnedBody();
    const markup = renderToStaticMarkup(
      createElement(PinnedBody, {
        title: "고정됨",
        actionLabel: "모든 앱",
        items,
      }),
    );

    const root = parseRoot(markup);

    expect(root.textContent).toContain("고정됨");
    expect(root.textContent).toContain("모든 앱");
  });

  it("items 배열의 각 항목에 대해 pinned item을 렌더링한다", async () => {
    const PinnedBody = await loadPinnedBody();
    const markup = renderToStaticMarkup(
      createElement(PinnedBody, {
        title: "고정됨",
        actionLabel: "모든 앱",
        items,
      }),
    );

    const root = parseRoot(markup);
    const pinnedItems = root.querySelectorAll(".windows-panel-pinned-item");

    expect(pinnedItems).toHaveLength(2);
    expect(root.textContent).toContain("기술 문서");
    expect(root.textContent).toContain("프로젝트");
  });

  it("root에 windows-panel-pinned-body class를 가진다", async () => {
    const PinnedBody = await loadPinnedBody();
    const markup = renderToStaticMarkup(
      createElement(PinnedBody, {
        title: "고정됨",
        actionLabel: "모든 앱",
        items: [],
      }),
    );

    const root = parseRoot(markup);

    expect(root.className).toContain("windows-panel-pinned-body");
  });
});
