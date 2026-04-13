type AllItem = {
  id: string;
  label: string;
  icon: string;
};

type AllSection = {
  id: string;
  heading: string;
  indexLabel: string;
  items: AllItem[];
};

type WindowsPanelAllBodyProps = {
  title: string;
  backLabel: string;
  mode: "list" | "index";
  sections: AllSection[];
};

/**
 * WindowsPanelAllBody
 *
 * "All apps" view of the Windows panel.
 *
 * - `mode: "list"` — category headings with list rows beneath each heading.
 * - `mode: "index"` — centered index chooser grid showing only `indexLabel` values.
 *
 * Scroll callbacks and activeLetter highlight are excluded in this phase.
 */
function WindowsPanelAllBody({ title, backLabel, mode, sections }: WindowsPanelAllBodyProps) {
  return (
    <div className="windows-panel-all-body flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[var(--taskbar-foreground,#1a1a1a)]">
          {title}
        </h2>
        <span className="text-xs text-[var(--taskbar-foreground-muted,#666)] cursor-default">
          {backLabel}
        </span>
      </div>

      {mode === "list" ? (
        <div className="windows-panel-all-list flex-1 min-h-0 overflow-y-auto">
          {sections.map((section) => (
            <div key={section.id} className="mb-4">
              <div className="text-xs font-semibold text-[var(--taskbar-foreground-muted,#666)] mb-1 px-1">
                {section.heading}
              </div>
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <li
                    key={item.id}
                    className="windows-panel-all-item flex items-center gap-3 px-1 py-1.5 rounded-md hover:bg-black/5 transition-colors"
                  >
                    <span className="text-lg leading-none shrink-0" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="text-sm text-[var(--taskbar-foreground,#1a1a1a)]">
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="windows-panel-all-index flex-1 min-h-0 flex items-center justify-center">
          <div className="grid grid-cols-4 gap-3 text-center">
            {sections.map((section) => (
              <div
                key={section.id}
                className="windows-panel-all-index-cell flex items-center justify-center w-10 h-10 rounded-md hover:bg-black/5 transition-colors cursor-default text-sm font-semibold text-[var(--taskbar-foreground,#1a1a1a)]"
              >
                {section.indexLabel}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WindowsPanelAllBody;
