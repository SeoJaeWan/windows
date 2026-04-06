import React from "react";

/* ------------------------------------------------------------------ */
/*  Item shape                                                        */
/* ------------------------------------------------------------------ */

type ContextMenuItem = {
  id: string;
  label: string;
  leadingIcon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  selected?: boolean;
};

/* ------------------------------------------------------------------ */
/*  Props                                                             */
/* ------------------------------------------------------------------ */

type TaskbarContextMenuProps = {
  items: ContextMenuItem[];
  onActionSelect: (id: string) => void;
};

/* ------------------------------------------------------------------ */
/*  Style constants                                                   */
/* ------------------------------------------------------------------ */

const MENU_BASE_CLASS =
  "taskbar-context-menu taskbar-surface rounded-md border border-[var(--taskbar-border)] shadow-[var(--taskbar-shadow)] text-[var(--taskbar-foreground)] py-1 text-sm min-w-[180px]";

const ROW_BASE_CLASS =
  "taskbar-context-menu-row flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-[var(--taskbar-foreground)] hover:bg-[var(--taskbar-surface-hover)] transition-colors duration-150";

const ROW_SELECTED_CLASS =
  "taskbar-context-menu-row taskbar-context-menu-row-selected flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-[var(--taskbar-foreground)] bg-[var(--taskbar-surface-active)] font-medium";

const ROW_DESTRUCTIVE_CLASS =
  "taskbar-context-menu-row taskbar-context-menu-row-destructive flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-150";

const ROW_DISABLED_CLASS =
  "taskbar-context-menu-row taskbar-context-menu-row-disabled flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-[var(--taskbar-foreground-muted)] opacity-50 cursor-not-allowed";

const SHORTCUT_CLASS =
  "taskbar-context-menu-shortcut ml-auto text-xs text-[var(--taskbar-foreground-muted)]";

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function getRowClass(item: ContextMenuItem): string {
  if (item.disabled) return ROW_DISABLED_CLASS;
  if (item.destructive) return ROW_DESTRUCTIVE_CLASS;
  if (item.selected) return ROW_SELECTED_CLASS;
  return ROW_BASE_CLASS;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

function TaskbarContextMenu({ items, onActionSelect }: TaskbarContextMenuProps) {
  return (
    <ul data-panel="context-menu" className={MENU_BASE_CLASS}>
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            className={getRowClass(item)}
            onClick={() => onActionSelect(item.id)}
            {...(item.disabled ? { disabled: true, "aria-disabled": "true" } : {})}
            {...(item.destructive ? { "data-destructive": "true" } : {})}
            {...(item.selected ? { "data-selected": "true" } : {})}
          >
            {item.leadingIcon && <span aria-hidden="true">{item.leadingIcon}</span>}
            <span>{item.label}</span>
            {item.shortcut && <kbd className={SHORTCUT_CLASS}>{item.shortcut}</kbd>}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TaskbarContextMenu;
