import React from "react";

/* ------------------------------------------------------------------ */
/*  Item shape                                                        */
/* ------------------------------------------------------------------ */

type HoverPreviewItem = {
  id: string;
  label: string;
  thumbnailSrc?: string;
  thumbnailAlt?: string;
  caption?: string;
};

/* ------------------------------------------------------------------ */
/*  Props                                                             */
/* ------------------------------------------------------------------ */

type TaskbarHoverPanelProps = {
  title: string;
  showCloseAffordance: boolean;
  items: HoverPreviewItem[];
  onItemSelect: (id: string) => void;
  onRequestClose: () => void;
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

function TaskbarHoverPanel({
  title,
  showCloseAffordance,
  items,
  onItemSelect,
  onRequestClose,
}: TaskbarHoverPanelProps) {
  return (
    <div data-panel="hover">
      <header>
        <h3>{title}</h3>
        {showCloseAffordance && (
          <button type="button" aria-label="닫기" onClick={onRequestClose}>
            ×
          </button>
        )}
      </header>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <button type="button" onClick={() => onItemSelect(item.id)}>
              {item.thumbnailSrc && (
                <img
                  src={item.thumbnailSrc}
                  alt={item.thumbnailAlt ?? ""}
                />
              )}
              <span>{item.label}</span>
              {item.caption && <span>{item.caption}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskbarHoverPanel;
