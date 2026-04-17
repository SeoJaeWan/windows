/**
 * Panels/Context/UseCases
 *
 * Real-world row inventories from actual host surfaces.
 * These stories show the ContextPanel populated with the exact
 * rows that each host (Windows panel, Search panel) produces.
 * Inventory-only compose role — no canonical component owner.
 *
 * Source inventories: contextPanelHostRowInventories.tsx
 * Host composition stories (with full panel wrapper):
 *   - Panels/Windows/Context (cases 1–7)
 *   - Panels/Search/Context  (case 8)
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
  title: "Panels/Context/UseCases",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/* ── Windows panel — Pinned view ────────────────────────────── */

export const Pinned2025: Story = {
  name: "Pinned — 2025를 보내며",
  render: () => (
    <div className="sb-content-pad">
      <ContextPanel items={[...PINNED_2025_ROWS]} />
    </div>
  ),
};

export const PinnedValuesAndTypes: Story = {
  name: "Pinned — 값과 타입 비교",
  render: () => (
    <div className="sb-content-pad">
      <ContextPanel items={[...PINNED_VALUES_AND_TYPES_ROWS]} />
    </div>
  ),
};

export const PinnedHomepage: Story = {
  name: "Pinned — 나만의 홈페이지를 만들고",
  render: () => (
    <div className="sb-content-pad">
      <ContextPanel items={[...PINNED_HOMEPAGE_ROWS]} />
    </div>
  ),
};

export const PinnedDataTypes: Story = {
  name: "Pinned — 데이터 타입을 공부하고",
  render: () => (
    <div className="sb-content-pad">
      <ContextPanel items={[...PINNED_DATA_TYPES_ROWS]} />
    </div>
  ),
};

/* ── Windows panel — All view ───────────────────────────────── */

export const AllPinned: Story = {
  name: "All — 이미 고정된 항목",
  render: () => (
    <div className="sb-content-pad">
      <ContextPanel items={[...ALL_PINNED_ROWS]} />
    </div>
  ),
};

export const AllUnpinned: Story = {
  name: "All — 고정되지 않은 항목",
  render: () => (
    <div className="sb-content-pad">
      <ContextPanel items={[...ALL_UNPINNED_ROWS]} />
    </div>
  ),
};

/* ── Windows panel / Search panel — 검색 결과 ───────────────── */

export const SearchResults: Story = {
  name: "Search — 검색 결과",
  render: () => (
    <div className="sb-content-pad">
      <ContextPanel items={[...SEARCH_RESULT_CONTEXT_ROWS]} />
    </div>
  ),
};
