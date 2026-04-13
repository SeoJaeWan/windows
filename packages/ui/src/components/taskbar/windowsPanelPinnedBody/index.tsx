type PinnedItem = {
  id: string;
  label: string;
  icon: string;
};

type WindowsPanelPinnedBodyProps = {
  title: string;
  actionLabel: string;
  items: PinnedItem[];
};

/**
 * WindowsPanelPinnedBody
 *
 * Pinned apps section of the Windows panel. Renders a title row with an action
 * button label and a grid of pinned items. Each item displays an icon and label.
 *
 * Click callbacks are excluded in this phase — the body is a visual contract only.
 */
function WindowsPanelPinnedBody({ title, actionLabel, items }: WindowsPanelPinnedBodyProps) {
  return (
    <div className="windows-panel-pinned-body flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[var(--taskbar-foreground,#1a1a1a)]">
          {title}
        </h2>
        <span className="text-xs text-[var(--taskbar-foreground-muted,#666)] cursor-default">
          {actionLabel}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-x-4 gap-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="windows-panel-pinned-item flex flex-col items-center gap-1 p-2 rounded-md hover:bg-black/5 transition-colors"
          >
            <span className="text-2xl leading-none" aria-hidden="true">
              {item.icon}
            </span>
            <span className="text-[11px] text-center text-[var(--taskbar-foreground,#1a1a1a)] leading-tight line-clamp-2">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WindowsPanelPinnedBody;
