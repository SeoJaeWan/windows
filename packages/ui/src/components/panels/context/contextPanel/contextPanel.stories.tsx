import type { Meta, StoryObj } from "@storybook/react";

import ContextPanel from "./index";
import CompareContextPanelStage from "../storybook/compareContextPanelStage";
import {
  CONTEXT_DEFAULT,
  CONTEXT_ICONLESS,
  CONTEXT_DISABLED,
} from "../storybook/contextPanelReferenceFixtures";

const meta = {
  title: "Context/Components/Panel",
  component: ContextPanel,
} satisfies Meta<typeof ContextPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

/* ── Standalone stories ──────────────────────────────────────── */

export const Default: Story = {
  name: "Default (with icons)",
  render: () => (
    <div className="sb-content-pad">
      <ContextPanel items={[...CONTEXT_DEFAULT.items]} />
    </div>
  ),
};

export const Iconless: Story = {
  name: "Iconless",
  render: () => (
    <div className="sb-content-pad">
      <ContextPanel items={[...CONTEXT_ICONLESS.items]} />
    </div>
  ),
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => (
    <div className="sb-content-pad">
      <ContextPanel items={[...CONTEXT_DISABLED.items]} />
    </div>
  ),
};

/* ── Compare stories ─────────────────────────────────────────── */

export const CompareDefault: Story = {
  render: () => (
    <CompareContextPanelStage state="default">
      <ContextPanel items={[...CONTEXT_DEFAULT.items]} />
    </CompareContextPanelStage>
  ),
};

export const CompareIconless: Story = {
  render: () => (
    <CompareContextPanelStage state="iconless">
      <ContextPanel items={[...CONTEXT_ICONLESS.items]} />
    </CompareContextPanelStage>
  ),
};

export const CompareDisabled: Story = {
  render: () => (
    <CompareContextPanelStage state="disabled">
      <ContextPanel items={[...CONTEXT_DISABLED.items]} />
    </CompareContextPanelStage>
  ),
};
