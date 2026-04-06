"use client";

import {
  TaskbarIconButton,
  TaskbarStartPanel,
  TaskbarSearchPanel,
  TaskbarHoverPanel,
  TaskbarContextMenu,
} from "@windows/ui";

const noop = () => {};

function FixtureCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <h3 className="border-b border-gray-100 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
        {label}
      </h3>
      <div className="overflow-x-auto p-4">{children}</div>
    </div>
  );
}

export default function TaskbarFixtures() {
  return (
    <div className="space-y-8">
      {/* TaskbarIconButton variants */}
      <div>
        <h2 className="mb-3 text-base font-semibold">TaskbarIconButton</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FixtureCard label="TaskbarIconButton — default">
            <TaskbarIconButton status="default" kind="file" label="블로그" />
          </FixtureCard>
          <FixtureCard label="TaskbarIconButton — open">
            <TaskbarIconButton status="open" kind="folder" label="프로젝트" />
          </FixtureCard>
          <FixtureCard label="TaskbarIconButton — active">
            <TaskbarIconButton status="active" kind="file" label="소개" />
          </FixtureCard>
        </div>
      </div>

      {/* TaskbarStartPanel variants */}
      <div>
        <h2 className="mb-3 text-base font-semibold">TaskbarStartPanel</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FixtureCard label="TaskbarStartPanel — pinned">
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
          </FixtureCard>
          <FixtureCard label="TaskbarStartPanel — all">
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
          </FixtureCard>
          <FixtureCard label="TaskbarStartPanel — results">
            <TaskbarStartPanel
              mode="results"
              query="blog"
              resultItems={[
                {
                  id: "blog-post",
                  label: "Blog Post",
                  active: true,
                  meta: "문서",
                },
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
          </FixtureCard>
        </div>
      </div>

      {/* TaskbarSearchPanel variants */}
      <div>
        <h2 className="mb-3 text-base font-semibold">TaskbarSearchPanel</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FixtureCard label="TaskbarSearchPanel — default">
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
          </FixtureCard>
          <FixtureCard label="TaskbarSearchPanel — results">
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
          </FixtureCard>
        </div>
      </div>

      {/* TaskbarHoverPanel variants */}
      <div>
        <h2 className="mb-3 text-base font-semibold">TaskbarHoverPanel</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FixtureCard label="TaskbarHoverPanel — with close">
            <TaskbarHoverPanel
              showCloseAffordance={true}
              title="Chrome"
              items={[
                {
                  id: "blog-edit",
                  label: "블로그 편집",
                  caption: "블로그 편집",
                },
                {
                  id: "project-docs",
                  label: "프로젝트 문서",
                  caption: "프로젝트 문서",
                },
              ]}
              onItemSelect={noop}
              onRequestClose={noop}
            />
          </FixtureCard>
          <FixtureCard label="TaskbarHoverPanel — without close">
            <TaskbarHoverPanel
              showCloseAffordance={false}
              title="Edge"
              items={[{ id: "simple", label: "탭" }]}
              onItemSelect={noop}
              onRequestClose={noop}
            />
          </FixtureCard>
        </div>
      </div>

      {/* TaskbarContextMenu variants */}
      <div>
        <h2 className="mb-3 text-base font-semibold">TaskbarContextMenu</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FixtureCard label="TaskbarContextMenu — full features">
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
          </FixtureCard>
          <FixtureCard label="TaskbarContextMenu — simple">
            <TaskbarContextMenu
              items={[
                { id: "open", label: "열기", shortcut: "Enter" },
                {
                  id: "pin",
                  label: "작업 표시줄에 고정",
                  shortcut: "Ctrl+P",
                },
                { id: "close", label: "닫기" },
              ]}
              onActionSelect={noop}
            />
          </FixtureCard>
        </div>
      </div>
    </div>
  );
}
