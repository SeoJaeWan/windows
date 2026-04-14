import type { Meta, StoryObj } from "@storybook/react";

import WindowsPanelShell from "../windowsPanelShell";
import WindowsPanelSearchBody from "./index";
import WindowsPanelReferenceStage from "../storybook/windowsPanelReferenceStage";
import ComparePanelStage from "../storybook/comparePanelStage";
import { SEARCH_RESULTS, SEARCH_EMPTY } from "../storybook/windowsPanelReferenceFixtures";

const meta = {
  title: "Windows Panel/Search",
  component: WindowsPanelSearchBody,
} satisfies Meta<typeof WindowsPanelSearchBody>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SearchResults: Story = {
  name: "Search results",
  render: () => (
    <WindowsPanelReferenceStage label="Search results">
      <WindowsPanelShell
        searchPlaceholder={SEARCH_RESULTS.searchPlaceholder}
        searchValue={SEARCH_RESULTS.searchValue}
      >
        <WindowsPanelSearchBody
          mode={SEARCH_RESULTS.mode}
          title={SEARCH_RESULTS.title}
          results={[...SEARCH_RESULTS.results]}
          selectedResultId={SEARCH_RESULTS.selectedResultId}
          emptyTitle={SEARCH_RESULTS.emptyTitle}
          emptyDescription={SEARCH_RESULTS.emptyDescription}
        />
      </WindowsPanelShell>
    </WindowsPanelReferenceStage>
  ),
};

export const SearchEmpty: Story = {
  name: "Search empty",
  render: () => (
    <WindowsPanelReferenceStage label="Search empty">
      <WindowsPanelShell
        searchPlaceholder={SEARCH_EMPTY.searchPlaceholder}
        searchValue={SEARCH_EMPTY.searchValue}
      >
        <WindowsPanelSearchBody
          mode={SEARCH_EMPTY.mode}
          title={SEARCH_EMPTY.title}
          results={[...SEARCH_EMPTY.results]}
          selectedResultId={SEARCH_EMPTY.selectedResultId}
          emptyTitle={SEARCH_EMPTY.emptyTitle}
          emptyDescription={SEARCH_EMPTY.emptyDescription}
        />
      </WindowsPanelShell>
    </WindowsPanelReferenceStage>
  ),
};

export const CompareSearchResults: Story = {
  render: () => (
    <ComparePanelStage kind="windows-panel-shell" state="search-results">
      <WindowsPanelShell
        searchPlaceholder={SEARCH_RESULTS.searchPlaceholder}
        searchValue={SEARCH_RESULTS.searchValue}
      >
        <WindowsPanelSearchBody
          mode={SEARCH_RESULTS.mode}
          title={SEARCH_RESULTS.title}
          results={[...SEARCH_RESULTS.results]}
          selectedResultId={SEARCH_RESULTS.selectedResultId}
          emptyTitle={SEARCH_RESULTS.emptyTitle}
          emptyDescription={SEARCH_RESULTS.emptyDescription}
        />
      </WindowsPanelShell>
    </ComparePanelStage>
  ),
};

export const CompareSearchEmpty: Story = {
  render: () => (
    <ComparePanelStage kind="windows-panel-shell" state="search-empty">
      <WindowsPanelShell
        searchPlaceholder={SEARCH_EMPTY.searchPlaceholder}
        searchValue={SEARCH_EMPTY.searchValue}
      >
        <WindowsPanelSearchBody
          mode={SEARCH_EMPTY.mode}
          title={SEARCH_EMPTY.title}
          results={[...SEARCH_EMPTY.results]}
          selectedResultId={SEARCH_EMPTY.selectedResultId}
          emptyTitle={SEARCH_EMPTY.emptyTitle}
          emptyDescription={SEARCH_EMPTY.emptyDescription}
        />
      </WindowsPanelShell>
    </ComparePanelStage>
  ),
};
