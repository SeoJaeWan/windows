import React from "react";

import SearchField from "../internal/searchField";
import ContentRow from "../internal/contentRow";
import PanelTile from "../internal/panelTile";

/* ------------------------------------------------------------------ */
/*  Shared item / detail shapes                                       */
/* ------------------------------------------------------------------ */

type PinnedItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
};

type CategoryEntry = {
  id: string;
  label: string;
  active?: boolean;
};

type SectionEntry = {
  id: string;
  label: string;
  items: {
    id: string;
    label: string;
    icon?: React.ReactNode;
    description?: string;
  }[];
};

type ResultItem = {
  id: string;
  label: string;
  meta?: string;
  active?: boolean;
  icon?: React.ReactNode;
};

type DetailBlock = {
  title: string;
  description?: string;
  metadata?: string[];
  actions?: { id: string; label: string }[];
};

/* ------------------------------------------------------------------ */
/*  Mode-specific props                                               */
/* ------------------------------------------------------------------ */

type PinnedModeProps = {
  mode: "pinned";
  searchPlaceholder?: string;
  heading: string;
  viewAllLabel: string;
  pinnedItems: PinnedItem[];
  onViewAllClick: () => void;
  onItemSelect: (id: string) => void;
  onRequestClose: () => void;
};

type AllModeProps = {
  mode: "all";
  searchPlaceholder?: string;
  categories: CategoryEntry[];
  sections: SectionEntry[];
  onCategorySelect: (id: string) => void;
  onItemSelect: (id: string) => void;
  onRequestClose: () => void;
};

type ResultsModeProps = {
  mode: "results";
  query: string;
  resultItems: ResultItem[];
  detail?: DetailBlock;
  onItemSelect: (id: string) => void;
  onActionSelect: (id: string) => void;
  onRequestClose: () => void;
};

type TaskbarStartPanelProps = PinnedModeProps | AllModeProps | ResultsModeProps;

/* ------------------------------------------------------------------ */
/*  Style constants                                                   */
/* ------------------------------------------------------------------ */

const PANEL_BASE_CLASS =
  "taskbar-start-panel taskbar-surface rounded-lg border border-[var(--taskbar-border)] shadow-[var(--taskbar-shadow)] text-[var(--taskbar-foreground)] p-4";

const HEADING_CLASS =
  "taskbar-start-panel-heading flex items-center justify-between py-2 text-sm font-semibold text-[var(--taskbar-foreground)]";

const TILE_GRID_CLASS =
  "taskbar-start-panel-grid grid grid-cols-6 gap-2";

const CATEGORY_BASE_CLASS =
  "taskbar-start-panel-category rounded-md px-3 py-1.5 text-sm text-[var(--taskbar-foreground-muted)] hover:bg-[var(--taskbar-surface-hover)] transition-colors duration-150";

const CATEGORY_ACTIVE_CLASS =
  "taskbar-start-panel-category rounded-md px-3 py-1.5 text-sm text-[var(--taskbar-foreground)] bg-[var(--taskbar-surface-active)] font-semibold";

const SECTION_CLASS =
  "taskbar-start-panel-section mt-2";

const SECTION_HEADING_CLASS =
  "taskbar-start-panel-section-heading text-xs font-semibold text-[var(--taskbar-foreground-muted)] uppercase tracking-wide py-1";

const RESULT_ROW_BASE_CLASS =
  "taskbar-start-panel-result w-full rounded-md px-2 py-1.5 text-left text-sm text-[var(--taskbar-foreground)] hover:bg-[var(--taskbar-surface-hover)] transition-colors duration-150";

const RESULT_ROW_ACTIVE_CLASS =
  "taskbar-start-panel-result taskbar-start-panel-result-active w-full rounded-md px-2 py-1.5 text-left text-sm text-[var(--taskbar-foreground)] bg-[var(--taskbar-surface-active)] font-medium";

const DETAIL_ASIDE_CLASS =
  "taskbar-start-panel-detail taskbar-surface rounded-md border border-[var(--taskbar-border)] p-3 text-sm";

const DETAIL_ACTION_CLASS =
  "taskbar-start-panel-action rounded-md px-3 py-1.5 text-sm text-[var(--taskbar-accent-foreground)] bg-[var(--taskbar-accent)] hover:opacity-90 transition-opacity duration-150";

const QUERY_CLASS =
  "taskbar-start-panel-query text-sm font-medium text-[var(--taskbar-foreground)] py-2";

const ALL_ITEM_BUTTON_CLASS =
  "taskbar-start-panel-all-item w-full rounded-md px-2 py-1.5 text-left text-sm text-[var(--taskbar-foreground)] hover:bg-[var(--taskbar-surface-hover)] transition-colors duration-150";

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

function TaskbarStartPanel(props: TaskbarStartPanelProps) {
  const { mode } = props;

  if (mode === "pinned") {
    const { searchPlaceholder, heading, viewAllLabel, pinnedItems, onViewAllClick, onItemSelect } = props;
    return (
      <div data-panel="start" data-mode="pinned" className={PANEL_BASE_CLASS}>
        <SearchField
          readOnly
          aria-label={searchPlaceholder}
          leading={searchPlaceholder ? <span>{searchPlaceholder}</span> : undefined}
        />
        <header className={HEADING_CLASS}>
          <span>{heading}</span>
          <button type="button" className="text-sm text-[var(--taskbar-accent)] hover:underline" onClick={onViewAllClick}>{viewAllLabel}</button>
        </header>
        <ul className={TILE_GRID_CLASS}>
          {pinnedItems.map((item) => (
            <li key={item.id}>
              <PanelTile
                variant="compact"
                label={item.label}
                graphic={item.icon}
                onClick={() => onItemSelect(item.id)}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (mode === "all") {
    const { searchPlaceholder, categories, sections, onCategorySelect, onItemSelect } = props;
    return (
      <div data-panel="start" data-mode="all" className={PANEL_BASE_CLASS}>
        <SearchField
          readOnly
          aria-label={searchPlaceholder}
          leading={searchPlaceholder ? <span>{searchPlaceholder}</span> : undefined}
        />
        <nav className="flex gap-1 py-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={cat.active ? CATEGORY_ACTIVE_CLASS : CATEGORY_BASE_CLASS}
              data-active={cat.active || undefined}
              onClick={() => onCategorySelect(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </nav>
        {sections.map((section) => (
          <section key={section.id} className={SECTION_CLASS}>
            <h3 className={SECTION_HEADING_CLASS}>{section.label}</h3>
            <ul>
              {section.items.map((item) => (
                <li key={item.id}>
                  <button type="button" className={ALL_ITEM_BUTTON_CLASS} onClick={() => onItemSelect(item.id)}>
                    <ContentRow leading={item.icon}>
                      <span>{item.label}</span>
                      {item.description && <span className="text-[var(--taskbar-foreground-muted)]">{item.description}</span>}
                    </ContentRow>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    );
  }

  // mode === "results"
  const { query, resultItems, detail, onItemSelect, onActionSelect } = props;
  return (
    <div data-panel="start" data-mode="results" className={PANEL_BASE_CLASS}>
      <div className={QUERY_CLASS}>{query}</div>
      <ul data-slot="result-list">
        {resultItems.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={item.active ? RESULT_ROW_ACTIVE_CLASS : RESULT_ROW_BASE_CLASS}
              aria-current={item.active ? "true" : undefined}
              onClick={() => onItemSelect(item.id)}
            >
              <ContentRow leading={item.icon}>
                <span>{item.label}</span>
                {item.meta && <span className="text-[var(--taskbar-foreground-muted)]">{item.meta}</span>}
              </ContentRow>
            </button>
          </li>
        ))}
      </ul>
      {detail && (
        <aside className={DETAIL_ASIDE_CLASS}>
          <h3 className="font-semibold text-[var(--taskbar-foreground)]">{detail.title}</h3>
          {detail.description && <p className="text-[var(--taskbar-foreground-muted)] mt-1">{detail.description}</p>}
          {detail.metadata && (
            <ul className="flex gap-2 mt-1 text-xs text-[var(--taskbar-foreground-muted)]">
              {detail.metadata.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          )}
          {detail.actions && (
            <div className="flex gap-2 mt-2">
              {detail.actions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  className={DETAIL_ACTION_CLASS}
                  onClick={() => onActionSelect(action.id)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </aside>
      )}
    </div>
  );
}

export default TaskbarStartPanel;
