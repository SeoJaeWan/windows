import type { Meta, StoryObj } from "@storybook/react";

import WindowsPanel from "../windowsPanel";
import WindowsPanelSearchView from "./index";
import WindowsPanelReferenceStage from "../storybook/windowsPanelReferenceStage";
import ComparePanelStage from "../storybook/comparePanelStage";
import { SEARCH_RESULTS, SEARCH_EMPTY, SEARCH_RESULTS_UNPIN_ACTIONS } from "../storybook/windowsPanelReferenceFixtures";

const meta = {
  title: "Windows Panel/Search",
  component: WindowsPanelSearchView,
} satisfies Meta<typeof WindowsPanelSearchView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SearchResults: Story = {
  name: "Search results",
  render: () => (
    <WindowsPanelReferenceStage label="Search results">
      <WindowsPanel
        searchPlaceholder={SEARCH_RESULTS.searchPlaceholder}
        searchValue={SEARCH_RESULTS.searchValue}
      >
        <WindowsPanelSearchView
          mode={SEARCH_RESULTS.mode}
          title={SEARCH_RESULTS.title}
          results={[...SEARCH_RESULTS.results]}
          selectedResultId={SEARCH_RESULTS.selectedResultId}
          previewPinState={SEARCH_RESULTS.previewPinState}
          emptyTitle={SEARCH_RESULTS.emptyTitle}
          emptyDescription={SEARCH_RESULTS.emptyDescription}
        />
      </WindowsPanel>
    </WindowsPanelReferenceStage>
  ),
};

export const SearchEmpty: Story = {
  name: "Search empty",
  render: () => (
    <WindowsPanelReferenceStage label="Search empty">
      <WindowsPanel
        searchPlaceholder={SEARCH_EMPTY.searchPlaceholder}
        searchValue={SEARCH_EMPTY.searchValue}
      >
        <WindowsPanelSearchView
          mode={SEARCH_EMPTY.mode}
          title={SEARCH_EMPTY.title}
          results={[...SEARCH_EMPTY.results]}
          selectedResultId={SEARCH_EMPTY.selectedResultId}
          emptyTitle={SEARCH_EMPTY.emptyTitle}
          emptyDescription={SEARCH_EMPTY.emptyDescription}
        />
      </WindowsPanel>
    </WindowsPanelReferenceStage>
  ),
};

export const SearchResultsUnpinActions: Story = {
  name: "Search results (unpin actions)",
  render: () => (
    <WindowsPanelReferenceStage label="Search results (unpin actions)">
      <WindowsPanel
        searchPlaceholder={SEARCH_RESULTS_UNPIN_ACTIONS.searchPlaceholder}
        searchValue={SEARCH_RESULTS_UNPIN_ACTIONS.searchValue}
      >
        <WindowsPanelSearchView
          mode={SEARCH_RESULTS_UNPIN_ACTIONS.mode}
          title={SEARCH_RESULTS_UNPIN_ACTIONS.title}
          results={[...SEARCH_RESULTS_UNPIN_ACTIONS.results]}
          selectedResultId={SEARCH_RESULTS_UNPIN_ACTIONS.selectedResultId}
          previewPinState={SEARCH_RESULTS_UNPIN_ACTIONS.previewPinState}
          emptyTitle={SEARCH_RESULTS_UNPIN_ACTIONS.emptyTitle}
          emptyDescription={SEARCH_RESULTS_UNPIN_ACTIONS.emptyDescription}
        />
      </WindowsPanel>
    </WindowsPanelReferenceStage>
  ),
};

export const CompareSearchResults: Story = {
  render: () => (
    <ComparePanelStage kind="windows-panel" state="search-results">
      <WindowsPanel
        searchPlaceholder={SEARCH_RESULTS.searchPlaceholder}
        searchValue={SEARCH_RESULTS.searchValue}
      >
        <WindowsPanelSearchView
          mode={SEARCH_RESULTS.mode}
          title={SEARCH_RESULTS.title}
          results={[...SEARCH_RESULTS.results]}
          selectedResultId={SEARCH_RESULTS.selectedResultId}
          previewPinState={SEARCH_RESULTS.previewPinState}
          emptyTitle={SEARCH_RESULTS.emptyTitle}
          emptyDescription={SEARCH_RESULTS.emptyDescription}
        />
      </WindowsPanel>
    </ComparePanelStage>
  ),
};

export const CompareSearchEmpty: Story = {
  render: () => (
    <ComparePanelStage kind="windows-panel" state="search-empty">
      <WindowsPanel
        searchPlaceholder={SEARCH_EMPTY.searchPlaceholder}
        searchValue={SEARCH_EMPTY.searchValue}
      >
        <WindowsPanelSearchView
          mode={SEARCH_EMPTY.mode}
          title={SEARCH_EMPTY.title}
          results={[...SEARCH_EMPTY.results]}
          selectedResultId={SEARCH_EMPTY.selectedResultId}
          emptyTitle={SEARCH_EMPTY.emptyTitle}
          emptyDescription={SEARCH_EMPTY.emptyDescription}
        />
      </WindowsPanel>
    </ComparePanelStage>
  ),
};
