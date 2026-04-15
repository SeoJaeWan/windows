import PanelSearchResultsView from "../../shared/panelSearchResultsView";

type SearchResult = {
    id: string;
    label: string;
    iconSrc: string;
    metaLabel: string;
};

type PreviewPinState = {
    start: "pin" | "unpin";
    taskbar: "pin" | "unpin";
};

type WindowsPanelSearchViewBaseProps = {
    title: string;
    results: SearchResult[];
    selectedResultId?: string;
    emptyTitle: string;
    emptyDescription: string;
};

type WindowsPanelSearchViewResultsProps = WindowsPanelSearchViewBaseProps & {
    mode: "results";
    previewPinState: PreviewPinState;
};

type WindowsPanelSearchViewEmptyProps = WindowsPanelSearchViewBaseProps & {
    mode: "empty";
    previewPinState?: undefined;
};

type WindowsPanelSearchViewProps = WindowsPanelSearchViewResultsProps | WindowsPanelSearchViewEmptyProps;

/**
 * WindowsPanelSearchView
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
 * Delegates rendering to PanelSearchResultsView (layout="detail") internally.
 * Click callbacks are excluded in this phase.
 */
function WindowsPanelSearchView(props: WindowsPanelSearchViewProps) {
    const { mode, title, results, selectedResultId, emptyTitle, emptyDescription } = props;

    if (mode === "empty") {
        return (
            <div className="windows-panel-search-view windows-panel-search-empty">
                <PanelSearchResultsView
                    layout="detail"
                    mode="empty"
                    title={title}
                    results={[...results]}
                    emptyTitle={emptyTitle}
                    emptyDescription={emptyDescription}
                />
            </div>
        );
    }

    return (
        <div className="windows-panel-search-view windows-panel-search-results h-full">
            <PanelSearchResultsView
                layout="detail"
                mode="results"
                title={title}
                results={[...results]}
                selectedResultId={selectedResultId}
                previewPinState={props.previewPinState}
                emptyTitle={emptyTitle}
                emptyDescription={emptyDescription}
            />
        </div>
    );
}

export default WindowsPanelSearchView;
