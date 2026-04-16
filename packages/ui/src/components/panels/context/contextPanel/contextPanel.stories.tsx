import type { Meta, StoryObj } from "@storybook/react";

import ContextPanel from "./index";
import CompareContextPanelStage from "../storybook/compareContextPanelStage";
import {
  CONTEXT_DEFAULT,
  CONTEXT_ICONLESS,
  CONTEXT_DISABLED,
} from "../storybook/contextPanelReferenceFixtures";
import {
  PINNED_2025_ROWS,
  PINNED_VALUES_AND_TYPES_ROWS,
  PINNED_HOMEPAGE_ROWS,
  PINNED_DATA_TYPES_ROWS,
  ALL_PINNED_ROWS,
  ALL_UNPINNED_ROWS,
  SEARCH_RESULT_CONTEXT_ROWS,
} from "../storybook/contextPanelHostRowInventories";

const meta = {
  title: "Context Panel/Panel",
  component: ContextPanel,
} satisfies Meta<typeof ContextPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

/* ── Standalone stories ──────────────────────────────────────── */

export const Default: Story = {
  name: "Default (with icons)",
  render: () => (
    <div style={{ padding: "2em" }}>
      <ContextPanel items={[...CONTEXT_DEFAULT.items]} />
    </div>
  ),
};

export const Iconless: Story = {
  name: "Iconless",
  render: () => (
    <div style={{ padding: "2em" }}>
      <ContextPanel items={[...CONTEXT_ICONLESS.items]} />
    </div>
  ),
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => (
    <div style={{ padding: "2em" }}>
      <ContextPanel items={[...CONTEXT_DISABLED.items]} />
    </div>
  ),
};

/* ── Host row inventory stories ──────────────────────────────── */

export const HostPinned2025: Story = {
  name: "Host — Pinned 2025를 보내며",
  render: () => (
    <div style={{ padding: "2em" }}>
      <ContextPanel items={[...PINNED_2025_ROWS]} />
    </div>
  ),
};

export const HostPinnedValuesAndTypes: Story = {
  name: "Host — Pinned 값과 타입 비교",
  render: () => (
    <div style={{ padding: "2em" }}>
      <ContextPanel items={[...PINNED_VALUES_AND_TYPES_ROWS]} />
    </div>
  ),
};

export const HostPinnedHomepage: Story = {
  name: "Host — Pinned 나만의 홈페이지를 만들고",
  render: () => (
    <div style={{ padding: "2em" }}>
      <ContextPanel items={[...PINNED_HOMEPAGE_ROWS]} />
    </div>
  ),
};

export const HostPinnedDataTypes: Story = {
  name: "Host — Pinned 데이터 타입을 공부하고",
  render: () => (
    <div style={{ padding: "2em" }}>
      <ContextPanel items={[...PINNED_DATA_TYPES_ROWS]} />
    </div>
  ),
};

export const HostAllPinned: Story = {
  name: "Host — All pinned 2025를 보내며",
  render: () => (
    <div style={{ padding: "2em" }}>
      <ContextPanel items={[...ALL_PINNED_ROWS]} />
    </div>
  ),
};

export const HostAllUnpinned: Story = {
  name: "Host — All unpinned",
  render: () => (
    <div style={{ padding: "2em" }}>
      <ContextPanel items={[...ALL_UNPINNED_ROWS]} />
    </div>
  ),
};

export const HostSearchResults: Story = {
  name: "Host — Search results",
  render: () => (
    <div style={{ padding: "2em" }}>
      <ContextPanel items={[...SEARCH_RESULT_CONTEXT_ROWS]} />
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
