import type { Meta, StoryObj } from "@storybook/react";

import WindowsPanel from "../windowsPanel";
import WindowsPanelSearchView from "./index";
import WindowsPanelReferenceStage from "../storybook/windowsPanelReferenceStage";
import ComparePanelStage from "../storybook/comparePanelStage";
import { SEARCH_RESULTS, SEARCH_EMPTY } from "../storybook/windowsPanelReferenceFixtures";

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
