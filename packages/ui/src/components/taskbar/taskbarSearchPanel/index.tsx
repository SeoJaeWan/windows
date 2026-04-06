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
/*  Component                                                         */
/* ------------------------------------------------------------------ */

function TaskbarSearchPanel(props: TaskbarSearchPanelProps) {
  const { mode } = props;

  if (mode === "default") {
    const { searchPlaceholder, recommendedItems, featuredItems, onItemSelect } = props;
    return (
      <div data-panel="search" data-mode="default">
        <SearchField
          readOnly
          aria-label={searchPlaceholder}
          leading={searchPlaceholder ? <span>{searchPlaceholder}</span> : undefined}
        />
        <section>
          <ul>
            {recommendedItems.map((item) => (
              <li key={item.id}>
                <button type="button" onClick={() => onItemSelect(item.id)}>
                  <ContentRow leading={item.icon}>
                    <span>{item.label}</span>
                    {item.meta && <span>{item.meta}</span>}
                  </ContentRow>
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <ul>
            {featuredItems.map((item) => (
              <li key={item.id}>
                <button type="button" onClick={() => onItemSelect(item.id)}>
                  {item.thumbnailSrc && (
                    <img src={item.thumbnailSrc} alt={item.thumbnailAlt ?? item.label} />
                  )}
                  <span>{item.label}</span>
                  {item.description && <span>{item.description}</span>}
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
    <div data-panel="search" data-mode="results">
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
      {detail && (
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
      )}
    </div>
  );
}

export default TaskbarSearchPanel;
