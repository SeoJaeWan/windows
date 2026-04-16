/**
 * SearchPanel Stories — query-present states only.
 *
 * The default (empty query) state has its own story file at
 * `Search Panel/Default View`. This file covers query-results and query-empty.
 *
 * Canonical states: exactly 3 (Default, QueryResults, QueryEmpty).
 * See the full capture classification in searchPanelReferenceFixtures.ts.
 *
 * Supporting captures (`search-panel-query-detail.png`, `search-panel-query-detail-pinned.png`)
 * and excluded captures (`search-result-context-menu.png`) are NOT represented as stories here.
 */
import type { Meta, StoryObj } from "@storybook/react";

import SearchPanel from "./index";
import SearchPanelReferenceStage from "../storybook/searchPanelReferenceStage";
import ComparePanelStage from "../../windows/storybook/comparePanelStage";
import {
  SEARCH_QUERY_RESULTS,
  SEARCH_QUERY_EMPTY,
} from "../storybook/searchPanelReferenceFixtures";

const meta = {
  title: "Search/Components/Panel",
  component: SearchPanel,
  args: {
    query: "",
    title: "",
    searchResults: [],
    emptyTitle: "",
    emptyDescription: "",
  },
} satisfies Meta<typeof SearchPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const QueryResults: Story = {
  name: "Query results",
  args: {
    query: SEARCH_QUERY_RESULTS.query,
    title: SEARCH_QUERY_RESULTS.title,
    searchResults: [...SEARCH_QUERY_RESULTS.searchResults],
    emptyTitle: SEARCH_QUERY_RESULTS.emptyTitle,
    emptyDescription: SEARCH_QUERY_RESULTS.emptyDescription,
  },
  render: (args) => (
    <SearchPanelReferenceStage label="Query results">
      <SearchPanel {...args} />
    </SearchPanelReferenceStage>
  ),
};

export const QueryEmpty: Story = {
  name: "Query empty",
  args: {
    query: SEARCH_QUERY_EMPTY.query,
    title: SEARCH_QUERY_EMPTY.title,
    searchResults: [...SEARCH_QUERY_EMPTY.searchResults],
    emptyTitle: SEARCH_QUERY_EMPTY.emptyTitle,
    emptyDescription: SEARCH_QUERY_EMPTY.emptyDescription,
  },
  render: (args) => (
    <SearchPanelReferenceStage label="Query empty">
      <SearchPanel {...args} />
    </SearchPanelReferenceStage>
  ),
};

/* ── Compare stories (machine visual diff) ──────────────────── */

export const CompareQueryResults: Story = {
  args: {
    query: SEARCH_QUERY_RESULTS.query,
    title: SEARCH_QUERY_RESULTS.title,
    searchResults: [...SEARCH_QUERY_RESULTS.searchResults],
    emptyTitle: SEARCH_QUERY_RESULTS.emptyTitle,
    emptyDescription: SEARCH_QUERY_RESULTS.emptyDescription,
  },
  parameters: { controls: { disable: true }, docs: { disable: true } },
  render: () => (
    <ComparePanelStage kind="search-panel" state="query-results">
      <SearchPanel
        query={SEARCH_QUERY_RESULTS.query}
        title={SEARCH_QUERY_RESULTS.title}
        searchResults={[...SEARCH_QUERY_RESULTS.searchResults]}
        emptyTitle={SEARCH_QUERY_RESULTS.emptyTitle}
        emptyDescription={SEARCH_QUERY_RESULTS.emptyDescription}
      />
    </ComparePanelStage>
  ),
};

export const CompareQueryEmpty: Story = {
  args: {
    query: SEARCH_QUERY_EMPTY.query,
    title: SEARCH_QUERY_EMPTY.title,
    searchResults: [...SEARCH_QUERY_EMPTY.searchResults],
    emptyTitle: SEARCH_QUERY_EMPTY.emptyTitle,
    emptyDescription: SEARCH_QUERY_EMPTY.emptyDescription,
  },
  parameters: { controls: { disable: true }, docs: { disable: true } },
  render: () => (
    <ComparePanelStage kind="search-panel" state="query-empty">
      <SearchPanel
        query={SEARCH_QUERY_EMPTY.query}
        title={SEARCH_QUERY_EMPTY.title}
        searchResults={[...SEARCH_QUERY_EMPTY.searchResults]}
        emptyTitle={SEARCH_QUERY_EMPTY.emptyTitle}
        emptyDescription={SEARCH_QUERY_EMPTY.emptyDescription}
      />
    </ComparePanelStage>
  ),
};
