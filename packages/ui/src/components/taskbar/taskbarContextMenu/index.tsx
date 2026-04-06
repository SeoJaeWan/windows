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
/*  Component                                                         */
/* ------------------------------------------------------------------ */

function TaskbarContextMenu({ items, onActionSelect }: TaskbarContextMenuProps) {
  return (
    <ul data-panel="context-menu">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onActionSelect(item.id)}
            {...(item.disabled ? { disabled: true, "aria-disabled": "true" } : {})}
            {...(item.destructive ? { "data-destructive": "true" } : {})}
            {...(item.selected ? { "data-selected": "true" } : {})}
          >
            {item.leadingIcon && <span aria-hidden="true">{item.leadingIcon}</span>}
            <span>{item.label}</span>
            {item.shortcut && <kbd>{item.shortcut}</kbd>}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TaskbarContextMenu;
