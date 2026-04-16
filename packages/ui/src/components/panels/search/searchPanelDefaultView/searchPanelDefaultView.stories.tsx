import type { Meta, StoryObj } from "@storybook/react";

import SearchPanel from "../searchPanel";
import SearchPanelDefaultView from "./index";
import SearchPanelReferenceStage from "../storybook/searchPanelReferenceStage";
import ComparePanelStage from "../../windows/storybook/comparePanelStage";

const meta = {
  title: "Search/Components/DefaultView",
  component: SearchPanelDefaultView,
} satisfies Meta<typeof SearchPanelDefaultView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultView: Story = {
  name: "Default view",
  render: () => (
    <SearchPanelReferenceStage label="Default view (empty query)">
      <SearchPanel query="" />
    </SearchPanelReferenceStage>
  ),
};

export const CompareDefaultView: Story = {
  render: () => (
    <ComparePanelStage kind="search-panel" state="default">
      <SearchPanel query="" />
    </ComparePanelStage>
  ),
};
