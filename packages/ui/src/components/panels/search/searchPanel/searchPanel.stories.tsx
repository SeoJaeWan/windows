import type { Meta, StoryObj } from "@storybook/react";

import SearchPanel from "./index";
import SearchPanelReferenceStage from "../storybook/searchPanelReferenceStage";
import {
  SEARCH_DEFAULT,
  SEARCH_QUERY_RESULTS,
  SEARCH_QUERY_EMPTY,
} from "../storybook/searchPanelReferenceFixtures";

const meta = {
  title: "Search Panel/Panel",
  component: SearchPanel,
} satisfies Meta<typeof SearchPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Default (empty query)",
  render: () => (
    <SearchPanelReferenceStage label="Default (empty query)">
      <SearchPanel query={SEARCH_DEFAULT.query} />
    </SearchPanelReferenceStage>
  ),
};

export const QueryResults: Story = {
  name: "Query results",
  render: () => (
    <SearchPanelReferenceStage label="Query results">
      <SearchPanel
        query={SEARCH_QUERY_RESULTS.query}
        title={SEARCH_QUERY_RESULTS.title}
        results={[...SEARCH_QUERY_RESULTS.results]}
        emptyTitle={SEARCH_QUERY_RESULTS.emptyTitle}
        emptyDescription={SEARCH_QUERY_RESULTS.emptyDescription}
      />
    </SearchPanelReferenceStage>
  ),
};

export const QueryEmpty: Story = {
  name: "Query empty",
  render: () => (
    <SearchPanelReferenceStage label="Query empty">
      <SearchPanel
        query={SEARCH_QUERY_EMPTY.query}
        title={SEARCH_QUERY_EMPTY.title}
        results={[...SEARCH_QUERY_EMPTY.results]}
        emptyTitle={SEARCH_QUERY_EMPTY.emptyTitle}
        emptyDescription={SEARCH_QUERY_EMPTY.emptyDescription}
      />
    </SearchPanelReferenceStage>
  ),
};
