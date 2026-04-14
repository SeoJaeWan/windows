import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";

type SearchResult = { id: string; label: string; iconSrc: string; metaLabel: string };

type SearchBodyProps = {
  mode: "results" | "empty";
  title: string;
  results: SearchResult[];
  selectedResultId?: string;
  emptyTitle: string;
  emptyDescription: string;
};

const entryPath = "./index";

async function loadSearchBody() {
  const mod = (await import(entryPath)) as {
    default: ComponentType<SearchBodyProps>;
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

const results: SearchResult[] = [
  { id: "r1", label: "블로그", iconSrc: "/test/file.png", metaLabel: "기술 문서" },
  { id: "r2", label: "블로그 마이그레이션", iconSrc: "/test/folder.png", metaLabel: "프로젝트" },
];

describe("WindowsPanelSearchBody contract", () => {
  it("mode: results에서 result list와 preview panel을 렌더링한다", async () => {
    const SearchBody = await loadSearchBody();
    const markup = renderToStaticMarkup(
      createElement(SearchBody, {
        mode: "results",
        title: "추천",
        results,
        selectedResultId: "r1",
        emptyTitle: "",
        emptyDescription: "",
      }),
    );

    const root = parseRoot(markup);

    expect(root.className).toContain("windows-panel-search-results");
    expect(root.querySelectorAll(".windows-panel-search-result")).toHaveLength(2);
    expect(root.querySelector(".windows-panel-search-preview")).not.toBeNull();
    expect(root.textContent).toContain("블로그");
    expect(root.textContent).toContain("열기");
    expect(root.textContent).toContain("파일 위치 열기");
    expect(root.textContent).toContain("시작 화면에 고정");
    expect(root.textContent).toContain("작업 표시줄에 고정");
  });

  it("mode: empty에서 emptyTitle과 emptyDescription을 렌더링한다", async () => {
    const SearchBody = await loadSearchBody();
    const markup = renderToStaticMarkup(
      createElement(SearchBody, {
        mode: "empty",
        title: "추천",
        results: [],
        emptyTitle: "관련된 결과 없음",
        emptyDescription: "다른 검색어를 입력하세요.",
      }),
    );

    const root = parseRoot(markup);

    expect(root.className).toContain("windows-panel-search-empty");
    expect(root.textContent).toContain("관련된 결과 없음");
    expect(root.textContent).toContain("다른 검색어를 입력하세요.");
  });

  it("preview action group이 4개의 고정 한국어 label을 포함한다", async () => {
    const SearchBody = await loadSearchBody();
    const markup = renderToStaticMarkup(
      createElement(SearchBody, {
        mode: "results",
        title: "추천",
        results,
        selectedResultId: "r1",
        emptyTitle: "",
        emptyDescription: "",
      }),
    );

    const root = parseRoot(markup);
    const actions = root.querySelectorAll(".windows-panel-search-action");

    expect(actions).toHaveLength(4);
  });

  it("preview 대표 아이콘과 result row가 같은 iconSrc를 렌더링한다", async () => {
    const SearchBody = await loadSearchBody();
    const markup = renderToStaticMarkup(
      createElement(SearchBody, {
        mode: "results",
        title: "추천",
        results,
        selectedResultId: "r1",
        emptyTitle: "",
        emptyDescription: "",
      }),
    );

    const root = parseRoot(markup);

    // result row의 img
    const resultImgs = root.querySelectorAll(".windows-panel-search-result img");
    expect(resultImgs).toHaveLength(2);
    expect((resultImgs[0] as HTMLImageElement).getAttribute("src")).toBe("/test/file.png");

    // preview의 img — 같은 iconSrc를 사용
    const previewImg = root.querySelector(".windows-panel-search-preview img") as HTMLImageElement;
    expect(previewImg).not.toBeNull();
    expect(previewImg.getAttribute("src")).toBe("/test/file.png");
  });

  it("mode: empty에서 콘텐츠 아이콘, result row, action block이 렌더링되지 않는다", async () => {
    const SearchBody = await loadSearchBody();
    const markup = renderToStaticMarkup(
      createElement(SearchBody, {
        mode: "empty",
        title: "추천",
        results: [],
        emptyTitle: "관련된 결과 없음",
        emptyDescription: "다른 검색어를 입력하세요.",
      }),
    );

    const root = parseRoot(markup);

    expect(root.querySelectorAll("img")).toHaveLength(0);
    expect(root.querySelectorAll(".windows-panel-search-result")).toHaveLength(0);
    expect(root.querySelectorAll(".windows-panel-search-action")).toHaveLength(0);
    expect(root.querySelector(".windows-panel-search-preview")).toBeNull();
  });

  it("root에 windows-panel-search-body class를 가진다", async () => {
    const SearchBody = await loadSearchBody();
    const markup = renderToStaticMarkup(
      createElement(SearchBody, {
        mode: "empty",
        title: "",
        results: [],
        emptyTitle: "없음",
        emptyDescription: "설명",
      }),
    );

    const root = parseRoot(markup);

    expect(root.className).toContain("windows-panel-search-body");
  });

  it("result row에 Fluent ChevronRight16Regular icon recipient를 렌더링한다", async () => {
    const SearchBody = await loadSearchBody();
    const markup = renderToStaticMarkup(
      createElement(SearchBody, {
        mode: "results",
        title: "추천",
        results,
        selectedResultId: "r1",
        emptyTitle: "",
        emptyDescription: "",
      }),
    );

    const root = parseRoot(markup);
    const chevronIcons = root.querySelectorAll('.windows-panel-search-chevron-icon[data-fluent-icon="ChevronRight16Regular"]');

    expect(chevronIcons).toHaveLength(2);
  });

  it("action row별 Fluent icon recipient를 렌더링한다", async () => {
    const SearchBody = await loadSearchBody();
    const markup = renderToStaticMarkup(
      createElement(SearchBody, {
        mode: "results",
        title: "추천",
        results,
        selectedResultId: "r1",
        emptyTitle: "",
        emptyDescription: "",
      }),
    );

    const root = parseRoot(markup);
    const actionIcons = root.querySelectorAll(".windows-panel-search-action-icon[data-fluent-icon]");

    expect(actionIcons).toHaveLength(4);

    // action id 검증
    const actions = root.querySelectorAll(".windows-panel-search-action[data-action-id]");
    expect(actions).toHaveLength(4);

    const actionIds = Array.from(actions).map(el => el.getAttribute("data-action-id"));
    expect(actionIds).toEqual(["open", "open-folder", "pin-start", "pin-taskbar"]);

    // 각 action의 fluent icon 검증
    const fluentIcons = Array.from(actionIcons).map(el => el.getAttribute("data-fluent-icon"));
    expect(fluentIcons).toEqual(["Open16Regular", "OpenFolder16Regular", "Pin16Regular", "Pin16Regular"]);
  });
});
