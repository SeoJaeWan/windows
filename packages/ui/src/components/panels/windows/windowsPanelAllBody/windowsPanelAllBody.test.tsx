import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";

type AllSection = {
  id: string;
  heading: string;
  indexLabel: string;
  items: Array<{ id: string; label: string; iconSrc: string }>;
};

type AllBodyProps = {
  title: string;
  backLabel: string;
  mode: "list" | "index";
  sections: AllSection[];
};

const entryPath = "./index";

async function loadAllBody() {
  const mod = (await import(entryPath)) as {
    default: ComponentType<AllBodyProps>;
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

const sections: AllSection[] = [
  {
    id: "s1",
    heading: "기술 문서",
    indexLabel: "ㄱ",
    items: [
      { id: "i1", label: "블로그 포스트", iconSrc: "/test/file.png" },
    ],
  },
  {
    id: "s2",
    heading: "프로젝트",
    indexLabel: "ㅍ",
    items: [
      { id: "i2", label: "포트폴리오", iconSrc: "/test/folder.png" },
    ],
  },
];

describe("WindowsPanelAllBody contract", () => {
  it("mode: list에서 heading과 list item을 렌더링한다", async () => {
    const AllBody = await loadAllBody();
    const markup = renderToStaticMarkup(
      createElement(AllBody, {
        title: "모두",
        backLabel: "뒤로",
        mode: "list",
        sections,
      }),
    );

    const root = parseRoot(markup);

    expect(root.textContent).toContain("모두");
    expect(root.textContent).toContain("뒤로");
    expect(root.textContent).toContain("기술 문서");
    expect(root.textContent).toContain("블로그 포스트");
    expect(root.querySelector(".windows-panel-all-list")).not.toBeNull();
    expect(root.querySelectorAll(".windows-panel-all-item")).toHaveLength(2);
  });

  it("mode: list에서 각 item의 iconSrc를 img 요소로 렌더링한다", async () => {
    const AllBody = await loadAllBody();
    const markup = renderToStaticMarkup(
      createElement(AllBody, {
        title: "모두",
        backLabel: "뒤로",
        mode: "list",
        sections,
      }),
    );

    const root = parseRoot(markup);
    const imgs = root.querySelectorAll(".windows-panel-all-item img");

    expect(imgs).toHaveLength(2);
    expect((imgs[0] as HTMLImageElement).getAttribute("src")).toBe("/test/file.png");
    expect((imgs[1] as HTMLImageElement).getAttribute("src")).toBe("/test/folder.png");
  });

  it("mode: index에서 콘텐츠 아이콘 img를 렌더링하지 않는다", async () => {
    const AllBody = await loadAllBody();
    const markup = renderToStaticMarkup(
      createElement(AllBody, {
        title: "모두",
        backLabel: "뒤로",
        mode: "index",
        sections,
      }),
    );

    const root = parseRoot(markup);

    expect(root.querySelectorAll(".windows-panel-all-index img")).toHaveLength(0);
  });

  it("mode: index에서 indexLabel만 렌더링한다", async () => {
    const AllBody = await loadAllBody();
    const markup = renderToStaticMarkup(
      createElement(AllBody, {
        title: "모두",
        backLabel: "뒤로",
        mode: "index",
        sections,
      }),
    );

    const root = parseRoot(markup);

    expect(root.querySelector(".windows-panel-all-index")).not.toBeNull();
    expect(root.querySelectorAll(".windows-panel-all-index-cell")).toHaveLength(2);
    expect(root.textContent).toContain("ㄱ");
    expect(root.textContent).toContain("ㅍ");
  });

  it("root에 windows-panel-all-body class를 가진다", async () => {
    const AllBody = await loadAllBody();
    const markup = renderToStaticMarkup(
      createElement(AllBody, {
        title: "모두",
        backLabel: "뒤로",
        mode: "list",
        sections: [],
      }),
    );

    const root = parseRoot(markup);

    expect(root.className).toContain("windows-panel-all-body");
  });

  it("Fluent ChevronLeft12Regular icon recipient를 렌더링한다", async () => {
    const AllBody = await loadAllBody();
    const markup = renderToStaticMarkup(
      createElement(AllBody, {
        title: "모두",
        backLabel: "뒤로",
        mode: "list",
        sections,
      }),
    );

    const root = parseRoot(markup);
    const iconSlot = root.querySelector('.windows-panel-all-back-icon[data-fluent-icon="ChevronLeft12Regular"]');

    expect(iconSlot).not.toBeNull();
  });
});
