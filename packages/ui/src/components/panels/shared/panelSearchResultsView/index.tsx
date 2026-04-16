import { ChevronRight16Regular, Open16Regular, FolderOpen16Regular, Pin16Regular } from "@fluentui/react-icons";
import type { ComponentType } from "react";

import { cn } from "../../../../internal/cn";
import IconImage from "../../../common/iconImage";

/* ── Shared payload types ─────────────────────────────────── */

type SearchResultItem = {
    id: string;
    label: string;
    iconSrc: string;
    metaLabel: string;
};

type PreviewPinState = {
    start: "pin" | "unpin";
    taskbar: "pin" | "unpin";
};

type PanelSearchResultsViewBaseProps = {
    title: string;
    results: SearchResultItem[];
    emptyTitle: string;
    emptyDescription: string;
};

type PanelSearchResultsViewDetailProps = PanelSearchResultsViewBaseProps & {
    layout: "detail";
    mode: "results" | "empty";
    selectedResultId?: string;
    previewPinState?: PreviewPinState;
};

type PanelSearchResultsViewListProps = PanelSearchResultsViewBaseProps & {
    layout: "list";
    mode: "results" | "empty";
    selectedResultId?: never;
    previewPinState?: never;
};

type PanelSearchResultsViewProps =
    | PanelSearchResultsViewDetailProps
    | PanelSearchResultsViewListProps;

/* ── Preview action builder ───────────────────────────────── */

type PreviewAction = {
    id: "open" | "open-folder" | "pin-start" | "pin-taskbar";
    label: string;
    icon: ComponentType;
    fluentIcon: string;
};

function getPreviewActions(pinState: PreviewPinState | undefined): readonly PreviewAction[] {
    return [
        { id: "open", label: "\uC5F4\uAE30", icon: Open16Regular, fluentIcon: "Open16Regular" },
        { id: "open-folder", label: "\uD30C\uC77C \uC704\uCE58 \uC5F4\uAE30", icon: FolderOpen16Regular, fluentIcon: "OpenFolder16Regular" },
        {
            id: "pin-start",
            label: pinState?.start === "unpin" ? "\uC2DC\uC791 \uD654\uBA74 \uACE0\uC815 \uD574\uC81C" : "\uC2DC\uC791 \uD654\uBA74\uC5D0 \uACE0\uC815",
            icon: Pin16Regular,
            fluentIcon: "Pin16Regular",
        },
        {
            id: "pin-taskbar",
            label: pinState?.taskbar === "unpin" ? "\uC791\uC5C5 \uD45C\uC2DC\uC904 \uACE0\uC815 \uD574\uC81C" : "\uC791\uC5C5 \uD45C\uC2DC\uC904\uC5D0 \uACE0\uC815",
            icon: Pin16Regular,
            fluentIcon: "Pin16Regular",
        },
    ];
}

/* ── Component ────────────────────────────────────────────── */

/**
 * PanelSearchResultsView
 *
 * Shared query-present search results view used by panel wrappers.
 * Supports two layout modes:
 *
 * - `layout="detail"`: left result list + right preview panel with action group.
 *   Reads `selectedResultId` and `previewPinState`.
 * - `layout="list"`: result list or empty copy only.
 *   Does NOT read `selectedResultId` or `previewPinState`.
 *
 * Internal-only — NOT exported from package root.
 */
function PanelSearchResultsView(props: PanelSearchResultsViewProps) {
    const { mode, layout, title, results, emptyTitle, emptyDescription } = props;

    if (mode === "empty") {
        return (
            <div className="panel-search-results-view panel-search-results-empty pt-7 flex-1 min-h-0">
                <h2 className="font-bold mb-2">{title}</h2>
                {emptyTitle && <p className="text-sm mt-4">{emptyTitle}</p>}
                {emptyDescription && <p className="text-xs text-gray-400 mt-1">{emptyDescription}</p>}
            </div>
        );
    }

    /* ── Results mode ─────────────────────────────────────── */

    const selectedResultId = layout === "detail" ? (props as PanelSearchResultsViewDetailProps).selectedResultId : undefined;
    const previewPinState = layout === "detail" ? (props as PanelSearchResultsViewDetailProps).previewPinState : undefined;

    const selected = results.find(r => r.id === selectedResultId) ?? results[0];

    return (
        <div className="panel-search-results-view panel-search-results pt-7 h-full flex gap-2 min-h-0">
            {/* Left: result list */}
            <section className={layout === "detail" ? "w-1/2 h-full flex flex-col" : "flex-1 h-full flex flex-col"}>
                <h2 className="font-bold mb-2">{title}</h2>
                <ul className="flex-1 flex flex-col gap-2 overflow-auto">
                    {results.map(result => (
                        <li key={result.id} className="flex gap-0.5">
                            <button
                                type="button"
                                className="flex-1 flex items-center justify-start gap-2 bg-gray-200/10 hover:bg-white transition-colors p-2 cursor-pointer"
                            >
                                <IconImage src={result.iconSrc} alt="" className="size-[30px] shrink-0" aria-hidden="true" />
                                <h3 className="line-clamp-1 min-w-0 text-left text-sm font-normal">{result.label}</h3>
                            </button>
                            {layout === "detail" && (
                                <button
                                    type="button"
                                    className={cn(
                                        "flex items-center p-1 hover:bg-white transition-colors cursor-pointer",
                                        result.id === (selected?.id ?? "") ? "bg-white" : "bg-gray-200/10"
                                    )}
                                >
                                    <span className="text-gray-400" aria-hidden="true" data-fluent-icon="ChevronRight16Regular"><ChevronRight16Regular /></span>
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </section>

            {/* Right: preview panel (detail layout only) */}
            {layout === "detail" && selected && (
                <div className="panel-search-results-preview flex-1 h-full bg-white rounded-t-2xl border border-shell border-b-transparent p-6 flex flex-col items-center">
                    <IconImage src={selected.iconSrc} alt="" className="size-[80px] mb-2" imgClassName="rounded-2xl" aria-hidden="true" />
                    <h4 className="text-xl font-normal mb-1 break-keep text-center">{selected.label}</h4>
                    <p className="text-xs text-gray-400 border-b border-gray-200 pb-10 w-full text-center">{selected.metaLabel}</p>
                    <div className="w-full flex flex-col pt-6">
                        {getPreviewActions(previewPinState).map(action => (
                            <button
                                key={action.id}
                                type="button"
                                className="text-xs text-left px-3 py-2 rounded-md hover:bg-black/5 transition-colors cursor-pointer flex items-center gap-2"
                                data-action-id={action.id}
                            >
                                <span
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

export default PanelSearchResultsView;
