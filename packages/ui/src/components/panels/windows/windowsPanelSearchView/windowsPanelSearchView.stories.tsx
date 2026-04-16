import type { Meta, StoryObj } from "@storybook/react";

import WindowsPanel from "../windowsPanel";
import WindowsPanelSearchView from "./index";
import WindowsPanelReferenceStage from "../storybook/windowsPanelReferenceStage";
import ComparePanelStage from "../storybook/comparePanelStage";
import { SEARCH_RESULTS, SEARCH_EMPTY } from "../storybook/windowsPanelReferenceFixtures";

const meta = {
  title: "Windows/Components/SearchView",
  component: WindowsPanelSearchView,
  args: {
    mode: SEARCH_RESULTS.mode,
    title: SEARCH_RESULTS.title,
    results: [...SEARCH_RESULTS.results],
    selectedResultId: SEARCH_RESULTS.selectedResultId,
    emptyTitle: SEARCH_RESULTS.emptyTitle,
    emptyDescription: SEARCH_RESULTS.emptyDescription,
  },
} satisfies Meta<typeof WindowsPanelSearchView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SearchResults: Story = {
  name: "Search results",
  args: {
    mode: SEARCH_RESULTS.mode,
    title: SEARCH_RESULTS.title,
    results: [...SEARCH_RESULTS.results],
    selectedResultId: SEARCH_RESULTS.selectedResultId,
    previewPinState: SEARCH_RESULTS.previewPinState,
    emptyTitle: SEARCH_RESULTS.emptyTitle,
    emptyDescription: SEARCH_RESULTS.emptyDescription,
  },
  render: (args) => (
    <WindowsPanelReferenceStage label="Search results">
      <WindowsPanel
        searchPlaceholder={SEARCH_RESULTS.searchPlaceholder}
        searchValue={SEARCH_RESULTS.searchValue}
      >
        <WindowsPanelSearchView {...args} />
      </WindowsPanel>
    </WindowsPanelReferenceStage>
  ),
};

export const SearchEmpty: Story = {
  name: "Search empty",
  args: {
    mode: SEARCH_EMPTY.mode,
    title: SEARCH_EMPTY.title,
    results: [...SEARCH_EMPTY.results],
    selectedResultId: SEARCH_EMPTY.selectedResultId,
    emptyTitle: SEARCH_EMPTY.emptyTitle,
    emptyDescription: SEARCH_EMPTY.emptyDescription,
  },
  render: (args) => (
    <WindowsPanelReferenceStage label="Search empty">
      <WindowsPanel
        searchPlaceholder={SEARCH_EMPTY.searchPlaceholder}
        searchValue={SEARCH_EMPTY.searchValue}
      >
        <WindowsPanelSearchView {...args} />
      </WindowsPanel>
    </WindowsPanelReferenceStage>
  ),
};

export const CompareSearchResults: Story = {
  args: {
    mode: SEARCH_RESULTS.mode,
    title: SEARCH_RESULTS.title,
    results: [...SEARCH_RESULTS.results],
    selectedResultId: SEARCH_RESULTS.selectedResultId,
    previewPinState: SEARCH_RESULTS.previewPinState,
    emptyTitle: SEARCH_RESULTS.emptyTitle,
    emptyDescription: SEARCH_RESULTS.emptyDescription,
  },
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: (args) => (
    <ComparePanelStage kind="windows-panel" state="search-results">
      <WindowsPanel
        searchPlaceholder={SEARCH_RESULTS.searchPlaceholder}
        searchValue={SEARCH_RESULTS.searchValue}
      >
        <WindowsPanelSearchView {...args} />
      </WindowsPanel>
    </ComparePanelStage>
  ),
};

export const CompareSearchEmpty: Story = {
  args: {
    mode: SEARCH_EMPTY.mode,
    title: SEARCH_EMPTY.title,
    results: [...SEARCH_EMPTY.results],
    selectedResultId: SEARCH_EMPTY.selectedResultId,
    emptyTitle: SEARCH_EMPTY.emptyTitle,
    emptyDescription: SEARCH_EMPTY.emptyDescription,
  },
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: (args) => (
    <ComparePanelStage kind="windows-panel" state="search-empty">
      <WindowsPanel
        searchPlaceholder={SEARCH_EMPTY.searchPlaceholder}
        searchValue={SEARCH_EMPTY.searchValue}
      >
        <WindowsPanelSearchView {...args} />
      </WindowsPanel>
    </ComparePanelStage>
  ),
};
