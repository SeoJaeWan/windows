type SearchResult = {
  id: string;
  label: string;
  icon: string;
  metaLabel: string;
};

type WindowsPanelSearchBodyProps = {
  mode: "results" | "empty";
  title: string;
  results: SearchResult[];
  selectedResultId?: string;
  emptyTitle: string;
  emptyDescription: string;
};

const PREVIEW_ACTIONS = [
  "열기",
  "파일 위치 열기",
  "시작 화면에 고정",
  "작업 표시줄에 고정",
] as const;

/**
 * WindowsPanelSearchBody
 *
 * Search results view of the Windows panel. Geometry mirrors the blog reference:
 *
 * - Wrapper: pt-7 flex-1 flex gap-2 min-h-0
 * - mode: "results" — left result list + right preview panel with action group
 * - mode: "empty" — emptyTitle + emptyDescription displayed at top
 *
 * Click callbacks are excluded in this phase.
 */
function WindowsPanelSearchBody({
  mode,
  title,
  results,
  selectedResultId,
  emptyTitle,
  emptyDescription,
}: WindowsPanelSearchBodyProps) {
  if (mode === "empty") {
    return (
      <div className="windows-panel-search-body windows-panel-search-empty pt-7 flex-1 min-h-0">
        <h3 className="text-sm font-semibold">
          {emptyTitle}
        </h3>
        <p className="text-xs text-[var(--taskbar-foreground-muted,#666)] mt-1">
          {emptyDescription}
        </p>
      </div>
    );
  }

  const selected = results.find((r) => r.id === selectedResultId) ?? results[0];

  return (
    <div className="windows-panel-search-body windows-panel-search-results pt-7 flex-1 flex gap-2 min-h-0">
      {/* Left: result list */}
      <div className="flex-1 min-w-0 flex flex-col">
        <h3 className="text-xs font-semibold text-[var(--taskbar-foreground-muted,#666)] mb-2">
          {title}
        </h3>
        <ul className="flex-1 min-h-0 overflow-y-auto space-y-0.5">
          {results.map((result) => (
            <li
              key={result.id}
              className={`windows-panel-search-result flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors ${
                result.id === (selected?.id ?? "")
                  ? "bg-black/5"
                  : "hover:bg-black/5"
              }`}
            >
              <span className="text-lg leading-none shrink-0" aria-hidden="true">
                {result.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm truncate">
                  {result.label}
                </div>
                <div className="text-[10px] text-[var(--taskbar-foreground-muted,#666)] truncate">
                  {result.metaLabel}
                </div>
              </div>
              <span className="windows-panel-search-chevron text-xs text-[var(--taskbar-foreground-muted,#666)] shrink-0 ml-auto" aria-hidden="true">
                &gt;
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: preview panel */}
      {selected && (
        <div className="windows-panel-search-preview w-[140px] shrink-0 flex flex-col items-center border-l border-[var(--taskbar-border,#e0e0e0)] pl-3">
          <span className="text-3xl mt-2" aria-hidden="true">
            {selected.icon}
          </span>
          <span className="text-sm font-medium mt-2 text-center">
            {selected.label}
          </span>
          <span className="text-[10px] text-[var(--taskbar-foreground-muted,#666)] mb-3">
            {selected.metaLabel}
          </span>
          <ul className="w-full space-y-1">
            {PREVIEW_ACTIONS.map((action) => (
              <li
                key={action}
                className="windows-panel-search-action text-xs px-2 py-1 rounded hover:bg-black/5 transition-colors cursor-default"
              >
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default WindowsPanelSearchBody;
