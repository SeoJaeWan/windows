import type { Meta, StoryObj } from "@storybook/react";

import ContextPanel from "../../context/contextPanel";
import CompareRoot from "../../../taskbar/storybook/compareRoot";
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

/* ── Standalone stories ──────────────────────────────────────── */

export const Pinned2025: Story = {
  name: "Pinned — 2025를 보내며",
  render: () => (
    <div style={{ padding: "2em" }}>
      <ContextPanel items={[...WPC_PINNED_2025.rows]} />
    </div>
  ),
};

export const PinnedValuesAndTypes: Story = {
  name: "Pinned — 값과 타입 비교",
  render: () => (
    <div style={{ padding: "2em" }}>
      <ContextPanel items={[...WPC_PINNED_VALUES_AND_TYPES.rows]} />
    </div>
  ),
};

export const PinnedHomepage: Story = {
  name: "Pinned — 나만의 홈페이지를 만들고",
  render: () => (
    <div style={{ padding: "2em" }}>
      <ContextPanel items={[...WPC_PINNED_HOMEPAGE.rows]} />
    </div>
  ),
};

export const PinnedDataTypes: Story = {
  name: "Pinned — 데이터 타입을 공부하고",
  render: () => (
    <div style={{ padding: "2em" }}>
      <ContextPanel items={[...WPC_PINNED_DATA_TYPES.rows]} />
    </div>
  ),
};

export const AllPinned2025: Story = {
  name: "All pinned — 2025를 보내며",
  render: () => (
    <div style={{ padding: "2em" }}>
      <ContextPanel items={[...WPC_ALL_PINNED_2025.rows]} />
    </div>
  ),
};

export const AllUnpinnedReference: Story = {
  name: "All unpinned — 미디어 리스트 속도 개선기",
  render: () => (
    <div style={{ padding: "2em" }}>
      <ContextPanel items={[...WPC_ALL_UNPINNED_REFERENCE.rows]} />
    </div>
  ),
};

export const SearchResultsReference: Story = {
  name: "Search results — Component VS CSS 세기의 대결",
  render: () => (
    <div style={{ padding: "2em" }}>
      <ContextPanel items={[...WPC_SEARCH_RESULTS_REFERENCE.rows]} />
    </div>
  ),
};

/* ── Compare stories ─────────────────────────────────────────── */

export const ComparePinned2025: Story = {
  render: () => (
    <CompareRoot kind="windows-panel-context" state="pinned-2025">
      <ContextPanel items={[...WPC_PINNED_2025.rows]} />
    </CompareRoot>
  ),
};

export const ComparePinnedValuesAndTypes: Story = {
  render: () => (
    <CompareRoot kind="windows-panel-context" state="pinned-values-and-types">
      <ContextPanel items={[...WPC_PINNED_VALUES_AND_TYPES.rows]} />
    </CompareRoot>
  ),
};

export const ComparePinnedHomepage: Story = {
  render: () => (
    <CompareRoot kind="windows-panel-context" state="pinned-homepage">
      <ContextPanel items={[...WPC_PINNED_HOMEPAGE.rows]} />
    </CompareRoot>
  ),
};

export const ComparePinnedDataTypes: Story = {
  render: () => (
    <CompareRoot kind="windows-panel-context" state="pinned-data-types">
      <ContextPanel items={[...WPC_PINNED_DATA_TYPES.rows]} />
    </CompareRoot>
  ),
};

export const CompareAllPinned2025: Story = {
  render: () => (
    <CompareRoot kind="windows-panel-context" state="all-pinned-2025">
      <ContextPanel items={[...WPC_ALL_PINNED_2025.rows]} />
    </CompareRoot>
  ),
};

export const CompareAllUnpinnedReference: Story = {
  render: () => (
    <CompareRoot kind="windows-panel-context" state="all-unpinned-reference">
      <ContextPanel items={[...WPC_ALL_UNPINNED_REFERENCE.rows]} />
    </CompareRoot>
  ),
};

export const CompareSearchResultsReference: Story = {
  render: () => (
    <CompareRoot kind="windows-panel-context" state="search-results-reference">
      <ContextPanel items={[...WPC_SEARCH_RESULTS_REFERENCE.rows]} />
    </CompareRoot>
  ),
};
