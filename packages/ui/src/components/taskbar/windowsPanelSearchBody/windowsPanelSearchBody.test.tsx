import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";

type SearchResult = { id: string; label: string; icon: string; metaLabel: string };

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

  const root = container.firstElementElement ?? container.firstElementChild;

  expect(root).not.toBeNull();

  return root!;
}

const results: SearchResult[] = [
  { id: "r1", label: "블로그", icon: "📝", metaLabel: "기술 문서" },
  { id: "r2", label: "블로그 마이그레이션", icon: "📋", metaLabel: "프로젝트" },
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
});
