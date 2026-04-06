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
  detail: DetailBlock;
  onItemSelect: (id: string) => void;
  onActionSelect: (id: string) => void;
  onRequestClose: () => void;
};

type TaskbarStartPanelProps = PinnedModeProps | AllModeProps | ResultsModeProps;

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

function TaskbarStartPanel(props: TaskbarStartPanelProps) {
  const { mode } = props;

  if (mode === "pinned") {
    const { searchPlaceholder, heading, viewAllLabel, pinnedItems, onViewAllClick, onItemSelect } = props;
    return (
      <div data-panel="start" data-mode="pinned">
        <SearchField placeholder={searchPlaceholder} readOnly aria-label={searchPlaceholder} />
        {searchPlaceholder && <span aria-hidden="true">{searchPlaceholder}</span>}
        <header>
          <span>{heading}</span>
          <button type="button" onClick={onViewAllClick}>{viewAllLabel}</button>
        </header>
        <ul>
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
      <div data-panel="start" data-mode="all">
        <SearchField placeholder={searchPlaceholder} readOnly aria-label={searchPlaceholder} />
        {searchPlaceholder && <span aria-hidden="true">{searchPlaceholder}</span>}
        <nav>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              data-active={cat.active || undefined}
              onClick={() => onCategorySelect(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </nav>
        {sections.map((section) => (
          <section key={section.id}>
            <h3>{section.label}</h3>
            <ul>
              {section.items.map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={() => onItemSelect(item.id)}>
                    <ContentRow leading={item.icon}>
                      <span>{item.label}</span>
                      {item.description && <span>{item.description}</span>}
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
    <div data-panel="start" data-mode="results">
      <div>{query}</div>
      <ul>
        {resultItems.map((item) => (
          <li key={item.id}>
            <button type="button" aria-current={item.active ? "true" : undefined} onClick={() => onItemSelect(item.id)}>
              <ContentRow leading={item.icon}>
                <span>{item.label}</span>
                {item.meta && <span>{item.meta}</span>}
              </ContentRow>
            </button>
          </li>
        ))}
      </ul>
      <aside>
        <h3>{detail.title}</h3>
        {detail.description && <p>{detail.description}</p>}
        {detail.metadata && (
          <ul>
            {detail.metadata.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        )}
        {detail.actions && (
          <div>
            {detail.actions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => onActionSelect(action.id)}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}

export default TaskbarStartPanel;
