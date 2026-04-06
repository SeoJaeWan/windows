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
    <div role="menu" data-panel="context-menu">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role={item.selected ? "menuitemradio" : "menuitem"}
          onClick={() => onActionSelect(item.id)}
          {...(item.disabled ? { disabled: true, "aria-disabled": "true" } : {})}
          {...(item.destructive ? { "data-destructive": "true" } : {})}
          {...(item.selected ? { "aria-checked": "true" } : {})}
        >
          {item.leadingIcon && <span aria-hidden="true">{item.leadingIcon}</span>}
          <span>{item.label}</span>
          {item.shortcut && <kbd>{item.shortcut}</kbd>}
        </button>
      ))}
    </div>
  );
}

export default TaskbarContextMenu;
