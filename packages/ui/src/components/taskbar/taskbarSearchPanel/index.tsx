import React from "react";

import SearchField from "../internal/searchField";
import ContentRow from "../internal/contentRow";

/* ------------------------------------------------------------------ */
/*  Item / detail shapes                                              */
/* ------------------------------------------------------------------ */

type RecommendedItem = {
  id: string;
  label: string;
  meta?: string;
  icon?: React.ReactNode;
};

type FeaturedItem = {
  id: string;
  label: string;
  description?: string;
  thumbnailSrc?: string;
  thumbnailAlt?: string;
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

type DefaultModeProps = {
  mode: "default";
  searchPlaceholder?: string;
  recommendedItems: RecommendedItem[];
  featuredItems: FeaturedItem[];
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

type TaskbarSearchPanelProps = DefaultModeProps | ResultsModeProps;

/* ------------------------------------------------------------------ */
/*  Style constants                                                   */
/* ------------------------------------------------------------------ */

const PANEL_BASE_CLASS =
  "taskbar-search-panel taskbar-surface rounded-lg border border-[var(--taskbar-border)] shadow-[var(--taskbar-shadow)] text-[var(--taskbar-foreground)] p-4";

const RECOMMENDED_ROW_CLASS =
  "taskbar-search-panel-row w-full rounded-md px-2 py-1.5 text-left text-sm text-[var(--taskbar-foreground)] hover:bg-[var(--taskbar-surface-hover)] transition-colors duration-150";

const FEATURED_CARD_CLASS =
  "taskbar-search-panel-featured w-full rounded-md text-left text-sm text-[var(--taskbar-foreground)] hover:bg-[var(--taskbar-surface-hover)] transition-colors duration-150 overflow-hidden";

const FEATURED_THUMB_CLASS =
  "taskbar-search-panel-thumbnail w-full h-24 object-cover rounded-t-md";

const RESULT_ROW_BASE_CLASS =
  "taskbar-search-panel-result w-full rounded-md px-2 py-1.5 text-left text-sm text-[var(--taskbar-foreground)] hover:bg-[var(--taskbar-surface-hover)] transition-colors duration-150";

const RESULT_ROW_ACTIVE_CLASS =
  "taskbar-search-panel-result taskbar-search-panel-result-active w-full rounded-md px-2 py-1.5 text-left text-sm text-[var(--taskbar-foreground)] bg-[var(--taskbar-surface-active)] font-medium";

const QUERY_CLASS =
  "taskbar-search-panel-query text-sm font-medium text-[var(--taskbar-foreground)] py-2";

const DETAIL_ASIDE_CLASS =
  "taskbar-search-panel-detail taskbar-surface rounded-md border border-[var(--taskbar-border)] p-3 text-sm";

const DETAIL_ACTION_CLASS =
  "taskbar-search-panel-action rounded-md px-3 py-1.5 text-sm text-[var(--taskbar-accent-foreground)] bg-[var(--taskbar-accent)] hover:opacity-90 transition-opacity duration-150";

const SECTION_CLASS = "taskbar-search-panel-section mt-3";

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

function TaskbarSearchPanel(props: TaskbarSearchPanelProps) {
  const { mode } = props;

  if (mode === "default") {
    const { searchPlaceholder, recommendedItems, featuredItems, onItemSelect } = props;
    return (
      <div data-panel="search" data-mode="default" className={PANEL_BASE_CLASS}>
        <SearchField
          readOnly
          aria-label={searchPlaceholder}
          leading={searchPlaceholder ? <span>{searchPlaceholder}</span> : undefined}
        />
        <section data-slot="recommended" className={SECTION_CLASS}>
          <ul>
            {recommendedItems.map((item) => (
              <li key={item.id}>
                <button type="button" className={RECOMMENDED_ROW_CLASS} onClick={() => onItemSelect(item.id)}>
                  <ContentRow leading={item.icon}>
                    <span>{item.label}</span>
                    {item.meta && <span className="text-[var(--taskbar-foreground-muted)]">{item.meta}</span>}
                  </ContentRow>
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section data-slot="featured" className={SECTION_CLASS}>
          <ul className="grid grid-cols-2 gap-2">
            {featuredItems.map((item) => (
              <li key={item.id}>
                <button type="button" className={FEATURED_CARD_CLASS} onClick={() => onItemSelect(item.id)}>
                  {item.thumbnailSrc && (
                    <img className={FEATURED_THUMB_CLASS} src={item.thumbnailSrc} alt={item.thumbnailAlt ?? item.label} />
                  )}
                  <span className="block px-2 py-1 font-medium">{item.label}</span>
                  {item.description && <span className="block px-2 pb-1 text-xs text-[var(--taskbar-foreground-muted)]">{item.description}</span>}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }

  // mode === "results"
  const { query, resultItems, detail, onItemSelect, onActionSelect } = props;
  return (
    <div data-panel="search" data-mode="results" className={PANEL_BASE_CLASS}>
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

export default TaskbarSearchPanel;
