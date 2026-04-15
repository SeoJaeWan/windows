import type { Meta, StoryObj } from "@storybook/react";

import ContextPanel from "../../context/contextPanel";
import CompareRoot from "../../../taskbar/storybook/compareRoot";
import { SPC_RESULTS_REFERENCE } from "./searchPanelContextFixtures";

const meta = {
  title: "Search Panel/Context",
  component: ContextPanel,
} satisfies Meta<typeof ContextPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

/* ── Standalone stories ──────────────────────────────────────── */

export const ResultsReference: Story = {
  name: "Results — Component VS CSS 세기의 대결",
  render: () => (
    <div style={{ padding: "2em" }}>
      <ContextPanel items={[...SPC_RESULTS_REFERENCE.rows]} />
    </div>
  ),
};

/* ── Compare stories ─────────────────────────────────────────── */

export const CompareResultsReference: Story = {
  render: () => (
    <CompareRoot kind="search-panel-context" state="results-reference">
      <ContextPanel items={[...SPC_RESULTS_REFERENCE.rows]} />
    </CompareRoot>
  ),
};
