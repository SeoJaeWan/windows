import { ChevronRight16Regular, Open16Regular, FolderOpen16Regular, Pin16Regular } from "@fluentui/react-icons";
import type { ComponentType } from "react";

type SearchResult = {
    id: string;
    label: string;
    iconSrc: string;
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

type PreviewAction = {
    id: "open" | "open-folder" | "pin-start" | "pin-taskbar";
    label: string;
    icon: ComponentType;
    fluentIcon: string;
};

const PREVIEW_ACTIONS: readonly PreviewAction[] = [
    { id: "open", label: "열기", icon: Open16Regular, fluentIcon: "Open16Regular" },
    { id: "open-folder", label: "파일 위치 열기", icon: FolderOpen16Regular, fluentIcon: "OpenFolder16Regular" },
    { id: "pin-start", label: "시작 화면에 고정", icon: Pin16Regular, fluentIcon: "Pin16Regular" },
    { id: "pin-taskbar", label: "작업 표시줄에 고정", icon: Pin16Regular, fluentIcon: "Pin16Regular" },
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
function WindowsPanelSearchBody({mode, title, results, selectedResultId, emptyTitle, emptyDescription}: WindowsPanelSearchBodyProps) {
    if (mode === "empty") {
        return (
            <div className="windows-panel-search-body windows-panel-search-empty pt-7 flex-1 min-h-0">
                <h2 className="font-bold mb-2">{title}</h2>
                {emptyTitle && <p className="text-sm mt-4">{emptyTitle}</p>}
                {emptyDescription && <p className="text-xs text-gray-400 mt-1">{emptyDescription}</p>}
            </div>
        );
    }

    const selected = results.find(r => r.id === selectedResultId) ?? results[0];

    return (
        <div className="windows-panel-search-body windows-panel-search-results pt-7 h-full flex gap-2 min-h-0">
            {/* Left: result list */}
            <section className="w-1/2 h-full flex flex-col">
                <h2 className="font-bold mb-2">{title}</h2>
                <ul className="flex-1 flex flex-col gap-2 overflow-auto">
                    {results.map(result => (
                        <li key={result.id} className="windows-panel-search-result flex gap-0.5">
                            <button
                                type="button"
                                className="flex-1 flex items-center justify-start gap-2 bg-gray-200/10 hover:bg-white transition-colors p-2 cursor-pointer"
                            >
                                <img src={result.iconSrc} alt="" width={30} height={30} loading="lazy" className="shrink-0" aria-hidden="true" />
                                <h3 className="line-clamp-1 min-w-0 text-left text-sm font-normal">{result.label}</h3>
                            </button>
                            <button
                                type="button"
                                className={`windows-panel-search-chevron flex items-center p-1 hover:bg-white transition-colors cursor-pointer ${
                                    result.id === (selected?.id ?? "") ? "bg-white" : "bg-gray-200/10"
                                }`}
                            >
                                <span className="windows-panel-search-chevron-icon text-gray-400" aria-hidden="true" data-fluent-icon="ChevronRight16Regular"><ChevronRight16Regular /></span>
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Right: preview panel */}
            {selected && (
                <div className="windows-panel-search-preview flex-1 h-full bg-white rounded-t-2xl border border-[var(--taskbar-border,#e0e0e0)] border-b-transparent p-6 flex flex-col items-center">
                    <img src={selected.iconSrc} alt="" width={80} height={80} loading="lazy" className="rounded-2xl mb-2" aria-hidden="true" />
                    <h4 className="text-xl font-normal mb-1 break-keep text-center">{selected.label}</h4>
                    <p className="text-xs text-gray-400 border-b border-gray-200 pb-10 w-full text-center">{selected.metaLabel}</p>
                    <div className="w-full flex flex-col pt-6">
                        {PREVIEW_ACTIONS.map(action => (
                            <button
                                key={action.id}
                                type="button"
                                className="windows-panel-search-action text-xs text-left px-3 py-2 rounded-md hover:bg-black/5 transition-colors cursor-pointer flex items-center gap-2"
                                data-action-id={action.id}
                            >
                                <span
                                    className="windows-panel-search-action-icon"
                                    aria-hidden="true"
                                    data-fluent-icon={action.fluentIcon}
                                >
                                    <action.icon />
                                </span>
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default WindowsPanelSearchBody;
