import type { Meta, StoryObj } from "@storybook/react";

import ContextPanel from "../../context/contextPanel";
import CompareRoot from "../../../taskbar/storybook/compareRoot";
import WindowsPanel from "../windowsPanel";
import WindowsPanelPinnedView from "../windowsPanelPinnedView";
import WindowsPanelAllView from "../windowsPanelAllView";
import WindowsPanelSearchView from "../windowsPanelSearchView";
import WindowsPanelReferenceStage from "./windowsPanelReferenceStage";
import { PINNED_DEFAULT, ALL_LIST, SEARCH_RESULTS } from "./windowsPanelReferenceFixtures";
import { file } from "../internal/contentIcon";
import {
  WPC_PINNED_2025,
  WPC_PINNED_VALUES_AND_TYPES,
  WPC_PINNED_HOMEPAGE,
  WPC_PINNED_DATA_TYPES,
  WPC_ALL_PINNED_2025,
  WPC_ALL_UNPINNED_REFERENCE,
  WPC_SEARCH_RESULTS_REFERENCE,
} from "./windowsPanelContextFixtures";

const meta = {
  title: "Windows Panel/Context",
  component: ContextPanel,
} satisfies Meta<typeof ContextPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

/* ── Host data ──────────────────────────────────────────────── */

const pinnedItems = [
  { id: "p-1", label: "2025를 보내며", iconSrc: file },
  { id: "p-2", label: "값과 타입 비교", iconSrc: file },
  { id: "p-3", label: "나만의 홈페이지를 만들고", iconSrc: file },
  { id: "p-4", label: "데이터 타입을 공부하고", iconSrc: file },
];

const searchResultsForCase7 = [
  { id: "sr-c", label: "Component VS CSS 세기의 대결", iconSrc: file, metaLabel: "기술 문서" },
  { id: "sr-n", label: "NEU - Windows 테마 개인 홈페이지", iconSrc: file, metaLabel: "프로젝트" },
];

/* ── Shared host fragments ──────────────────────────────────── */

function PinnedHost({ children }: { children?: React.ReactNode }) {
  return (
    <WindowsPanel searchPlaceholder={PINNED_DEFAULT.searchPlaceholder} searchValue={PINNED_DEFAULT.searchValue}>
      <WindowsPanelPinnedView title="고정됨" actionLabel="모두" items={pinnedItems} />
      {children}
    </WindowsPanel>
  );
}

function AllHost({ children }: { children?: React.ReactNode }) {
  return (
    <WindowsPanel searchPlaceholder={ALL_LIST.searchPlaceholder} searchValue={ALL_LIST.searchValue}>
      <WindowsPanelAllView title={ALL_LIST.title} backLabel={ALL_LIST.backLabel} mode="list" sections={[...ALL_LIST.sections]} />
      {children}
    </WindowsPanel>
  );
}

function SearchHost({ children }: { children?: React.ReactNode }) {
  return (
    <WindowsPanel searchPlaceholder="앱 및 문서 검색" searchValue="블로그">
      <WindowsPanelSearchView
        mode="results"
        title="최적의 일치"
        results={searchResultsForCase7}
        selectedResultId="sr-c"
        previewPinState={{ start: "pin", taskbar: "pin" }}
        emptyTitle=""
        emptyDescription=""
      />
      {children}
    </WindowsPanel>
  );
}

/* ── Standalone stories ──────────────────────────────────────── */

export const Pinned2025: Story = {
  name: "Pinned — 2025를 보내며",
  render: () => (
    <WindowsPanelReferenceStage label="Pinned — 2025를 보내며">
      <div style={{ position: "relative" }}>
        <PinnedHost />
        <div style={{ position: "absolute", top: 240, left: 10 }}>
          <ContextPanel items={[...WPC_PINNED_2025.rows]} />
        </div>
      </div>
    </WindowsPanelReferenceStage>
  ),
};

export const PinnedValuesAndTypes: Story = {
  name: "Pinned — 값과 타입 비교",
  render: () => (
    <WindowsPanelReferenceStage label="Pinned — 값과 타입 비교">
      <div style={{ position: "relative" }}>
        <PinnedHost />
        <div style={{ position: "absolute", top: 240, left: 130 }}>
          <ContextPanel items={[...WPC_PINNED_VALUES_AND_TYPES.rows]} />
        </div>
      </div>
    </WindowsPanelReferenceStage>
  ),
};

export const PinnedHomepage: Story = {
  name: "Pinned — 나만의 홈페이지를 만들고",
  render: () => (
    <WindowsPanelReferenceStage label="Pinned — 나만의 홈페이지를 만들고">
      <div style={{ position: "relative" }}>
        <PinnedHost />
        <div style={{ position: "absolute", top: 240, left: 250 }}>
          <ContextPanel items={[...WPC_PINNED_HOMEPAGE.rows]} />
        </div>
      </div>
    </WindowsPanelReferenceStage>
  ),
};

export const PinnedDataTypes: Story = {
  name: "Pinned — 데이터 타입을 공부하고",
  render: () => (
    <WindowsPanelReferenceStage label="Pinned — 데이터 타입을 공부하고">
      <div style={{ position: "relative" }}>
        <PinnedHost />
        <div style={{ position: "absolute", top: 240, left: 370 }}>
          <ContextPanel items={[...WPC_PINNED_DATA_TYPES.rows]} />
        </div>
      </div>
    </WindowsPanelReferenceStage>
  ),
};

export const AllPinned2025: Story = {
  name: "All pinned — 2025를 보내며",
  render: () => (
    <WindowsPanelReferenceStage label="All pinned — 2025를 보내며">
      <div style={{ position: "relative" }}>
        <AllHost />
        <div style={{ position: "absolute", top: 200, left: 180 }}>
          <ContextPanel items={[...WPC_ALL_PINNED_2025.rows]} />
        </div>
      </div>
    </WindowsPanelReferenceStage>
  ),
};

export const AllUnpinnedReference: Story = {
  name: "All unpinned — 미디어 리스트 속도 개선기",
  render: () => (
    <WindowsPanelReferenceStage label="All unpinned — 미디어 리스트 속도 개선기">
      <div style={{ position: "relative" }}>
        <AllHost />
        <div style={{ position: "absolute", top: 340, left: 180 }}>
          <ContextPanel items={[...WPC_ALL_UNPINNED_REFERENCE.rows]} />
        </div>
      </div>
    </WindowsPanelReferenceStage>
  ),
};

export const SearchResultsReference: Story = {
  name: "Search results — Component VS CSS 세기의 대결",
  render: () => (
    <WindowsPanelReferenceStage label="Search results — Component VS CSS 세기의 대결">
      <div style={{ position: "relative" }}>
        <SearchHost />
        <div style={{ position: "absolute", top: 180, left: 10 }}>
          <ContextPanel items={[...WPC_SEARCH_RESULTS_REFERENCE.rows]} />
        </div>
      </div>
    </WindowsPanelReferenceStage>
  ),
};

/* ── Compare stories ─────────────────────────────────────────── */

export const ComparePinned2025: Story = {
  render: () => (
    <CompareRoot kind="windows-panel-context" state="pinned-2025">
      <div style={{ position: "relative" }}>
        <PinnedHost />
        <div style={{ position: "absolute", top: 240, left: 10 }}>
          <ContextPanel items={[...WPC_PINNED_2025.rows]} />
        </div>
      </div>
    </CompareRoot>
  ),
};

export const ComparePinnedValuesAndTypes: Story = {
  render: () => (
    <CompareRoot kind="windows-panel-context" state="pinned-values-and-types">
      <div style={{ position: "relative" }}>
        <PinnedHost />
        <div style={{ position: "absolute", top: 240, left: 130 }}>
          <ContextPanel items={[...WPC_PINNED_VALUES_AND_TYPES.rows]} />
        </div>
      </div>
    </CompareRoot>
  ),
};

export const ComparePinnedHomepage: Story = {
  render: () => (
    <CompareRoot kind="windows-panel-context" state="pinned-homepage">
      <div style={{ position: "relative" }}>
        <PinnedHost />
        <div style={{ position: "absolute", top: 240, left: 250 }}>
          <ContextPanel items={[...WPC_PINNED_HOMEPAGE.rows]} />
        </div>
      </div>
    </CompareRoot>
  ),
};

export const ComparePinnedDataTypes: Story = {
  render: () => (
    <CompareRoot kind="windows-panel-context" state="pinned-data-types">
      <div style={{ position: "relative" }}>
        <PinnedHost />
        <div style={{ position: "absolute", top: 240, left: 370 }}>
          <ContextPanel items={[...WPC_PINNED_DATA_TYPES.rows]} />
        </div>
      </div>
    </CompareRoot>
  ),
};

export const CompareAllPinned2025: Story = {
  render: () => (
    <CompareRoot kind="windows-panel-context" state="all-pinned-2025">
      <div style={{ position: "relative" }}>
        <AllHost />
        <div style={{ position: "absolute", top: 200, left: 180 }}>
          <ContextPanel items={[...WPC_ALL_PINNED_2025.rows]} />
        </div>
      </div>
    </CompareRoot>
  ),
};

export const CompareAllUnpinnedReference: Story = {
  render: () => (
    <CompareRoot kind="windows-panel-context" state="all-unpinned-reference">
      <div style={{ position: "relative" }}>
        <AllHost />
        <div style={{ position: "absolute", top: 340, left: 180 }}>
          <ContextPanel items={[...WPC_ALL_UNPINNED_REFERENCE.rows]} />
        </div>
      </div>
    </CompareRoot>
  ),
};

export const CompareSearchResultsReference: Story = {
  render: () => (
    <CompareRoot kind="windows-panel-context" state="search-results-reference">
      <div style={{ position: "relative" }}>
        <SearchHost />
        <div style={{ position: "absolute", top: 180, left: 10 }}>
          <ContextPanel items={[...WPC_SEARCH_RESULTS_REFERENCE.rows]} />
        </div>
      </div>
    </CompareRoot>
  ),
};
