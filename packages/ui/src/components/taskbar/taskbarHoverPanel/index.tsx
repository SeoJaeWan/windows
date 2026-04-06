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
/*  Style constants                                                   */
/* ------------------------------------------------------------------ */

const PANEL_BASE_CLASS =
  "taskbar-hover-panel taskbar-surface rounded-md border border-[var(--taskbar-border)] shadow-[var(--taskbar-shadow)] text-[var(--taskbar-foreground)] p-2 text-sm";

const HEADER_CLASS =
  "taskbar-hover-panel-header flex items-center justify-between px-1 py-1";

const CLOSE_BUTTON_CLASS =
  "taskbar-hover-panel-close rounded-sm p-0.5 text-[var(--taskbar-foreground-muted)] hover:bg-[var(--taskbar-surface-hover)] hover:text-[var(--taskbar-foreground)] focus-visible:taskbar-focus-ring transition-colors duration-150";

const PREVIEW_BUTTON_CLASS =
  "taskbar-hover-panel-preview w-full rounded-md text-left hover:bg-[var(--taskbar-surface-hover)] transition-colors duration-150 overflow-hidden";

const THUMBNAIL_CLASS =
  "taskbar-hover-panel-thumbnail w-full h-20 object-cover rounded-t-md";

const LABEL_CLASS =
  "taskbar-hover-panel-label block px-2 py-0.5 text-sm font-medium text-[var(--taskbar-foreground)]";

const CAPTION_CLASS =
  "taskbar-hover-panel-caption block px-2 pb-1 text-xs text-[var(--taskbar-foreground-muted)]";

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
    <div data-panel="hover" className={PANEL_BASE_CLASS}>
      <header className={HEADER_CLASS}>
        <h3 className="font-semibold text-[var(--taskbar-foreground)]">{title}</h3>
        {showCloseAffordance && (
          <button type="button" className={CLOSE_BUTTON_CLASS} aria-label="닫기" onClick={onRequestClose}>
            ×
          </button>
        )}
      </header>
      <ul className="flex gap-1">
        {items.map((item) => (
          <li key={item.id}>
            <button type="button" className={PREVIEW_BUTTON_CLASS} onClick={() => onItemSelect(item.id)}>
              {item.thumbnailSrc && (
                <img
                  className={THUMBNAIL_CLASS}
                  src={item.thumbnailSrc}
                  alt={item.thumbnailAlt ?? ""}
                />
              )}
              <span className={LABEL_CLASS}>{item.label}</span>
              {item.caption && <span className={CAPTION_CLASS}>{item.caption}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskbarHoverPanel;
