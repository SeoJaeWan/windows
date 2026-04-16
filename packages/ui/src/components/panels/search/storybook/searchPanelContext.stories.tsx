import type { Meta, StoryObj } from "@storybook/react";

import ContextPanel from "../../context/contextPanel";
import CompareRoot from "../../../taskbar/storybook/compareRoot";
import SearchPanel from "../searchPanel";
import SearchPanelReferenceStage from "./searchPanelReferenceStage";
import { file } from "../../windows/internal/contentIcon";
import { SPC_RESULTS_REFERENCE } from "./searchPanelContextFixtures";

const meta = {
  title: "Search/Compose/Context",
  component: SearchPanel,
} satisfies Meta<typeof SearchPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

/* ── Host data ──────────────────────────────────────────────── */

const searchPanelContextResults = [
  { id: "src-c", label: "Component VS CSS 세기의 대결", iconSrc: file, metaLabel: "기술 문서" },
  { id: "src-n", label: "NEU - Windows 테마 개인 홈페이지", iconSrc: file, metaLabel: "프로젝트" },
];

/* ── Standalone stories ──────────────────────────────────────── */

export const ResultsReference: Story = {
  name: "Results — Component VS CSS 세기의 대결",
  render: () => (
    <SearchPanelReferenceStage label="Results — Component VS CSS 세기의 대결">
      <div style={{ position: "relative" }}>
        <SearchPanel
          query="블로그"
          title="최적의 일치"
          results={searchPanelContextResults}
          emptyTitle=""
          emptyDescription=""
        />
        <div style={{ position: "absolute", top: 120, left: 160 }}>
          <ContextPanel items={[...SPC_RESULTS_REFERENCE.rows]} />
        </div>
      </div>
    </SearchPanelReferenceStage>
  ),
};

/* ── Compare stories ─────────────────────────────────────────── */

export const CompareResultsReference: Story = {
  render: () => (
    <CompareRoot kind="search-panel-context" state="results-reference">
      <div style={{ position: "relative" }}>
        <SearchPanel
          query="블로그"
          title="최적의 일치"
          results={searchPanelContextResults}
          emptyTitle=""
          emptyDescription=""
        />
        <div style={{ position: "absolute", top: 120, left: 160 }}>
          <ContextPanel items={[...SPC_RESULTS_REFERENCE.rows]} />
        </div>
      </div>
    </CompareRoot>
  ),
};
