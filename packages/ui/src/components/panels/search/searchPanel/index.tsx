import type {ComponentPropsWithoutRef, CSSProperties} from "react";

import PanelSurface from "../../shared/panelSurface";
import PanelSearchResultsView from "../../shared/panelSearchResultsView";
import SearchPanelDefaultView from "../searchPanelDefaultView";

/* ── Types ───────────────────────────────────────────────────── */

type SearchResult = {
    id: string;
    label: string;
    iconSrc: string;
    metaLabel: string;
};

type SearchPanelProps = ComponentPropsWithoutRef<"div"> & {
    /** Current search query string. Empty string renders the default view. */
    query: string;
    /** Section title shown above the result list (used when query !== ""). */
    title?: string;
    /** Search result items (used when query !== ""). */
    results?: SearchResult[];
    /** Heading shown in the empty-results state (used when query !== ""). */
    emptyTitle?: string;
    /** Description shown in the empty-results state (used when query !== ""). */
    emptyDescription?: string;
};

/* ── Component ───────────────────────────────────────────────── */

/**
 * SearchPanel
 *
 * Self-contained search panel surface that receives a `query` prop from
 * outside and decides which of three canonical states to render:
 *
 * 1. `query === ""`                          → SearchPanelDefaultView (default)
 * 2. `query !== "" && results.length > 0`    → PanelSearchResultsView mode="results" layout="list"
 * 3. `query !== "" && results.length === 0`  → PanelSearchResultsView mode="empty" layout="list"
 *
 * Uses PanelSurface internally for the card frame. SearchPanel owns its own
 * geometry (sizing, padding, display, flex). Does NOT render TaskbarSearch
 * inside the panel. Does NOT use preview/action panel, selectedResultId,
 * or previewPinState.
 *
 * Exported from package root as `SearchPanel`.
 */
function SearchPanel({query, title = "", results = [], emptyTitle = "", emptyDescription = "", className, style, ...rest}: SearchPanelProps) {
    const isDefault = query === "";

    return (
        <PanelSurface
            className={`search-panel h-120 w-160 text-sm flex flex-col px-5 ${className ?? ""}`.trim()}
            style={{"--panel-border": "#ccd0d9", ...style} as CSSProperties}
            {...rest}
        >
            {isDefault ? (
                <SearchPanelDefaultView />
            ) : results.length > 0 ? (
                <PanelSearchResultsView
                    layout="list"
                    mode="results"
                    title={title}
                    results={[...results]}
                    emptyTitle={emptyTitle}
                    emptyDescription={emptyDescription}
                />
            ) : (
                <PanelSearchResultsView
                    layout="list"
                    mode="empty"
                    title={title}
                    results={[...results]}
                    emptyTitle={emptyTitle}
                    emptyDescription={emptyDescription}
                />
            )}
        </PanelSurface>
    );
}

export default SearchPanel;
