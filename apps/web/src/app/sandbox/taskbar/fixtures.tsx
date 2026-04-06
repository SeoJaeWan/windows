"use client";

import {
  TaskbarIconButton,
  TaskbarStartPanel,
  TaskbarSearchPanel,
  TaskbarHoverPanel,
  TaskbarContextMenu,
} from "@windows/ui";

const noop = () => {};

export default function TaskbarFixtures() {
  return (
    <>
      {/* TaskbarIconButton variants */}
      <h2>TaskbarIconButton</h2>
      <TaskbarIconButton status="default" kind="file" label="블로그" />
      <TaskbarIconButton status="open" kind="folder" label="프로젝트" />
      <TaskbarIconButton status="active" kind="file" label="소개" />

      {/* TaskbarStartPanel variants */}
      <h2>TaskbarStartPanel</h2>
      <TaskbarStartPanel
        mode="pinned"
        heading="고정됨"
        viewAllLabel="모두"
        pinnedItems={[
          { id: "explorer", label: "파일 탐색기" },
          { id: "docs", label: "문서" },
        ]}
        onViewAllClick={noop}
        onItemSelect={noop}
        onRequestClose={noop}
      />
      <TaskbarStartPanel
        mode="all"
        categories={[
          { id: "recent", label: "최근 추가됨", active: true },
          { id: "productivity", label: "생산성" },
        ]}
        sections={[
          {
            id: "apps",
            label: "앱",
            items: [
              { id: "notion", label: "Notion" },
              { id: "excel", label: "Excel" },
            ],
          },
        ]}
        onCategorySelect={noop}
        onItemSelect={noop}
        onRequestClose={noop}
      />
      <TaskbarStartPanel
        mode="results"
        query="blog"
        resultItems={[
          { id: "blog-post", label: "Blog Post", active: true, meta: "문서" },
          { id: "blog-assets", label: "Blog Assets", meta: "폴더" },
        ]}
        detail={{
          title: "Blog Post",
          actions: [
            { id: "open", label: "열기" },
            { id: "open-folder", label: "파일 위치 열기" },
          ],
        }}
        onItemSelect={noop}
        onActionSelect={noop}
        onRequestClose={noop}
      />

      {/* TaskbarSearchPanel variants */}
      <h2>TaskbarSearchPanel</h2>
      <TaskbarSearchPanel
        mode="default"
        searchPlaceholder="검색 시작"
        recommendedItems={[
          { id: "recent-page", label: "최근에 연 페이지" },
          { id: "downloads", label: "다운로드" },
        ]}
        featuredItems={[
          {
            id: "featured-blog",
            label: "블로그 바로가기",
            description: "최근 작성 글",
          },
          {
            id: "featured-projects",
            label: "프로젝트",
            description: "작업 목록",
          },
        ]}
        onItemSelect={noop}
        onRequestClose={noop}
      />
      <TaskbarSearchPanel
        mode="results"
        query="windows"
        resultItems={[
          {
            id: "windows-ui",
            label: "Windows UI",
            active: true,
            meta: "프로젝트",
          },
          { id: "windows-folder", label: "windows", meta: "폴더" },
        ]}
        detail={{
          title: "Windows UI",
          actions: [
            { id: "open", label: "열기" },
            { id: "pin", label: "핀 고정" },
          ],
        }}
        onItemSelect={noop}
        onActionSelect={noop}
        onRequestClose={noop}
      />

      {/* TaskbarHoverPanel variants */}
      <h2>TaskbarHoverPanel</h2>
      <TaskbarHoverPanel
        showCloseAffordance={true}
        title="Chrome"
        items={[
          { id: "blog-edit", label: "블로그 편집", caption: "블로그 편집" },
          {
            id: "project-docs",
            label: "프로젝트 문서",
            caption: "프로젝트 문서",
          },
        ]}
        onItemSelect={noop}
        onRequestClose={noop}
      />
      <TaskbarHoverPanel
        showCloseAffordance={false}
        title="Edge"
        items={[{ id: "simple", label: "탭" }]}
        onItemSelect={noop}
        onRequestClose={noop}
      />

      {/* TaskbarContextMenu variants */}
      <h2>TaskbarContextMenu</h2>
      <TaskbarContextMenu
        items={[
          {
            id: "open",
            label: "열기",
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
        ]}
        onActionSelect={noop}
      />
      <TaskbarContextMenu
        items={[
          { id: "open", label: "열기", shortcut: "Enter" },
          { id: "pin", label: "작업 표시줄에 고정", shortcut: "Ctrl+P" },
          { id: "close", label: "닫기" },
        ]}
        onActionSelect={noop}
      />
    </>
  );
}
