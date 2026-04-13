import type { Meta, StoryObj } from "@storybook/react";

import WindowsPanelShell from "./index";
import WindowsPanelPinnedBody from "../windowsPanelPinnedBody";
import WindowsPanelAllBody from "../windowsPanelAllBody";
import WindowsPanelSearchBody from "../windowsPanelSearchBody";
import WindowsPanelReferenceStage from "../storybook/windowsPanelReferenceStage";
import {
  PINNED_DEFAULT,
  ALL_LIST,
  ALL_INDEX,
  SEARCH_RESULTS,
  SEARCH_EMPTY,
} from "../storybook/windowsPanelReferenceFixtures";

const meta = {
  title: "Windows Panel/Shell",
  component: WindowsPanelShell,
} satisfies Meta<typeof WindowsPanelShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PinnedDefault: Story = {
  name: "Pinned default",
  render: () => (
    <WindowsPanelReferenceStage label="Pinned default">
      <WindowsPanelShell
        searchPlaceholder={PINNED_DEFAULT.searchPlaceholder}
        searchValue={PINNED_DEFAULT.searchValue}
      >
        <WindowsPanelPinnedBody
          title={PINNED_DEFAULT.title}
          actionLabel={PINNED_DEFAULT.actionLabel}
          items={[...PINNED_DEFAULT.items]}
        />
      </WindowsPanelShell>
    </WindowsPanelReferenceStage>
  ),
};

export const AllList: Story = {
  name: "All list",
  render: () => (
    <WindowsPanelReferenceStage label="All list">
      <WindowsPanelShell
        searchPlaceholder={ALL_LIST.searchPlaceholder}
        searchValue={ALL_LIST.searchValue}
      >
        <WindowsPanelAllBody
          title={ALL_LIST.title}
          backLabel={ALL_LIST.backLabel}
          mode={ALL_LIST.mode}
          sections={[...ALL_LIST.sections]}
        />
      </WindowsPanelShell>
    </WindowsPanelReferenceStage>
  ),
};

export const AllIndex: Story = {
  name: "All index chooser",
  render: () => (
    <WindowsPanelReferenceStage label="All index chooser">
      <WindowsPanelShell
        searchPlaceholder={ALL_INDEX.searchPlaceholder}
        searchValue={ALL_INDEX.searchValue}
      >
        <WindowsPanelAllBody
          title={ALL_INDEX.title}
          backLabel={ALL_INDEX.backLabel}
          mode={ALL_INDEX.mode}
          sections={[...ALL_INDEX.sections]}
        />
      </WindowsPanelShell>
    </WindowsPanelReferenceStage>
  ),
};

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
