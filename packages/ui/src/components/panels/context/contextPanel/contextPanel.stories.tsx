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
  args: {
    items: [...CONTEXT_DEFAULT.items],
  },
} satisfies Meta<typeof ContextPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

/* ── Standalone stories ──────────────────────────────────────── */

export const Default: Story = {
  name: "Default (with icons)",
  args: {
    items: [...CONTEXT_DEFAULT.items],
  },
  render: (args) => (
    <div className="sb-content-pad">
      <ContextPanel {...args} />
    </div>
  ),
};

export const Iconless: Story = {
  name: "Iconless",
  args: {
    items: [...CONTEXT_ICONLESS.items],
  },
  render: (args) => (
    <div className="sb-content-pad">
      <ContextPanel {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  name: "Disabled",
  args: {
    items: [...CONTEXT_DISABLED.items],
  },
  render: (args) => (
    <div className="sb-content-pad">
      <ContextPanel {...args} />
    </div>
  ),
};

/* ── Compare stories ─────────────────────────────────────────── */

export const CompareDefault: Story = {
  args: {
    items: [...CONTEXT_DEFAULT.items],
  },
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: (args) => (
    <CompareContextPanelStage state="default">
      <ContextPanel {...args} />
    </CompareContextPanelStage>
  ),
};

export const CompareIconless: Story = {
  args: {
    items: [...CONTEXT_ICONLESS.items],
  },
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: (args) => (
    <CompareContextPanelStage state="iconless">
      <ContextPanel {...args} />
    </CompareContextPanelStage>
  ),
};

export const CompareDisabled: Story = {
  args: {
    items: [...CONTEXT_DISABLED.items],
  },
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: (args) => (
    <CompareContextPanelStage state="disabled">
      <ContextPanel {...args} />
    </CompareContextPanelStage>
  ),
};
