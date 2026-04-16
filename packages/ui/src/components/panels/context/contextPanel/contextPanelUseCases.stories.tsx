/**
 * Context Panel/Use Cases
 *
 * Real-world row inventories from actual host surfaces.
 * These stories show the ContextPanel populated with the exact
 * rows that each host (Windows panel, Search panel) produces.
 *
 * Source inventories: contextPanelHostRowInventories.tsx
 * Host composition stories (with full panel wrapper):
 *   - Windows Panel/Context (cases 1–7)
 *   - Search Panel/Context  (case 8)
 */
import type { Meta, StoryObj } from "@storybook/react";

import ContextPanel from "./index";
import {
  PINNED_2025_ROWS,
  PINNED_VALUES_AND_TYPES_ROWS,
  PINNED_HOMEPAGE_ROWS,
  PINNED_DATA_TYPES_ROWS,
  ALL_PINNED_ROWS,
  ALL_UNPINNED_ROWS,
  SEARCH_RESULT_CONTEXT_ROWS,
} from "../storybook/contextPanelHostRowInventories";

const meta = {
  title: "Context Panel/Use Cases",
  component: ContextPanel,
} satisfies Meta<typeof ContextPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

const wrap = (story: React.ReactNode) => (
  <div style={{ padding: "2em" }}>{story}</div>
);

/* ── Windows panel — Pinned view ────────────────────────────── */

export const Pinned2025: Story = {
  name: "Pinned — 2025를 보내며",
  render: () => wrap(<ContextPanel items={[...PINNED_2025_ROWS]} />),
};

export const PinnedValuesAndTypes: Story = {
  name: "Pinned — 값과 타입 비교",
  render: () => wrap(<ContextPanel items={[...PINNED_VALUES_AND_TYPES_ROWS]} />),
};

export const PinnedHomepage: Story = {
  name: "Pinned — 나만의 홈페이지를 만들고",
  render: () => wrap(<ContextPanel items={[...PINNED_HOMEPAGE_ROWS]} />),
};

export const PinnedDataTypes: Story = {
  name: "Pinned — 데이터 타입을 공부하고",
  render: () => wrap(<ContextPanel items={[...PINNED_DATA_TYPES_ROWS]} />),
};

/* ── Windows panel — All view ───────────────────────────────── */

export const AllPinned: Story = {
  name: "All — 이미 고정된 항목",
  render: () => wrap(<ContextPanel items={[...ALL_PINNED_ROWS]} />),
};

export const AllUnpinned: Story = {
  name: "All — 고정되지 않은 항목",
  render: () => wrap(<ContextPanel items={[...ALL_UNPINNED_ROWS]} />),
};

/* ── Windows panel / Search panel — 검색 결과 ───────────────── */

export const SearchResults: Story = {
  name: "Search — 검색 결과",
  render: () => wrap(<ContextPanel items={[...SEARCH_RESULT_CONTEXT_ROWS]} />),
};
