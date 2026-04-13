import Chevron from "../internal/chevron";

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
 * Search results view of the Windows panel. Geometry mirrors the blog reference
 * (`taskSearchResult`):
 *
 * - Wrapper: pt-7 flex-1 flex gap-2 min-h-0
 * - mode: "results" — left result list (w-1/2 h-full) + right preview panel
 *   (flex-1, bg-white rounded-t-2xl border)
 * - mode: "empty" — title header only with empty space
 *
 * Result rows: icon + label button (bg-gray-200/10) + separate chevron button.
 * Preview: selected item icon/title/metaLabel + fixed action group.
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
        <h2 className="font-bold mb-2">{title}</h2>
        {emptyTitle && (
          <p className="text-sm mt-4">{emptyTitle}</p>
        )}
        {emptyDescription && (
          <p className="text-xs text-gray-400 mt-1">{emptyDescription}</p>
        )}
      </div>
    );
  }

  const selected = results.find((r) => r.id === selectedResultId) ?? results[0];

  return (
    <div className="windows-panel-search-body windows-panel-search-results pt-7 flex-1 flex gap-2 min-h-0">
      {/* Left: result list */}
      <section className="w-1/2 h-full flex flex-col">
        <h2 className="font-bold mb-2">{title}</h2>
        <ul className="flex-1 flex flex-col gap-2 overflow-auto">
          {results.map((result) => (
            <li key={result.id} className="windows-panel-search-result flex gap-0.5">
              <span className="flex-1 flex items-center justify-start gap-2 bg-gray-200/10 hover:bg-white transition-colors p-2">
                <span
                  className="w-[30px] h-[30px] flex items-center justify-center text-lg shrink-0"
                  aria-hidden="true"
                >
                  {result.icon}
                </span>
                <span className="line-clamp-1 min-w-0 text-left text-sm">
                  {result.label}
                </span>
              </span>
              <span
                className={`windows-panel-search-chevron p-1 hover:bg-white transition-colors ${
                  result.id === (selected?.id ?? "")
                    ? "bg-white"
                    : "bg-gray-200/10"
                }`}
              >
                <Chevron direction="right" size={15} className="text-gray-400" />
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Right: preview panel */}
      {selected && (
        <div className="windows-panel-search-preview flex-1 h-full bg-white rounded-t-2xl border border-[var(--taskbar-border,#e0e0e0)] border-b-transparent p-6 flex flex-col items-center">
          <span
            className="w-20 h-20 flex items-center justify-center text-5xl rounded-2xl mb-2"
            aria-hidden="true"
          >
            {selected.icon}
          </span>
          <span className="text-xl mb-1 break-keep text-center">
            {selected.label}
          </span>
          <span className="text-xs text-gray-400 border-b border-gray-200 pb-10 w-full text-center">
            {selected.metaLabel}
          </span>
          <ul className="w-full flex flex-col gap-3 pt-6">
            {PREVIEW_ACTIONS.map((action) => (
              <li
                key={action}
                className="windows-panel-search-action text-xs hover:bg-black/5 transition-colors cursor-default"
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
