import IconImage from "../../../common/iconImage";
import { DEFAULT_VIEW_DATA } from "../storybook/searchPanelReferenceFixtures";

/* ── Types ───────────────────────────────────────────────────── */

type RecommendItem = { id: string; label: string; iconSrc: string; metaLabel: string };
type BlogCardItem = { id: string; label: string; iconSrc: string };
type ProjectCardItem = { id: string; label: string; iconSrc: string };

/* ── Sub-components ──────────────────────────────────────────── */

function RecommendList({ items }: { items: readonly RecommendItem[] }) {
    return (
        <section className="flex flex-col">
            <h2 className="font-bold text-sm mb-2">추천</h2>
            <ul className="flex flex-col">
                {items.map(item => (
                    <li key={item.id}>
                        <button
                            type="button"
                            className="w-full flex items-center gap-2 px-1 py-1.5 hover:bg-black/5 rounded transition-colors cursor-pointer text-left"
                        >
                            <IconImage src={item.iconSrc} alt="" className="size-[20px] shrink-0" aria-hidden="true" />
                            <span className="text-xs line-clamp-1 min-w-0">{item.label}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function CardGrid({ title, items }: { title: string; items: readonly (BlogCardItem | ProjectCardItem)[] }) {
    return (
        <section className="flex flex-col">
            <h2 className="font-bold text-xs mb-2">{title}</h2>
            <div className="grid grid-cols-3 gap-2">
                {items.map(item => (
                    <button
                        key={item.id}
                        type="button"
                        className="flex flex-col items-center gap-1 p-2 rounded hover:bg-black/5 transition-colors cursor-pointer"
                    >
                        <IconImage src={item.iconSrc} alt="" className="size-[36px] shrink-0" aria-hidden="true" />
                        <span className="text-[10px] text-center line-clamp-1 min-w-0">{item.label}</span>
                    </button>
                ))}
            </div>
        </section>
    );
}

/* ── Main component ──────────────────────────────────────────── */

/**
 * SearchPanelDefaultView
 *
 * Empty-query default view of the search panel. Renders three sections
 * from temporary fixture data:
 *
 * - 추천 (Recommendations) — left column, vertical item list
 * - 최고의 블로그글 (Top blog posts) — right column top, 3-col icon grid
 * - 최고의 프로젝트 (Top projects) — right column bottom, 3-col icon grid
 *
 * Internal-only — NOT exported from package root.
 */
function SearchPanelDefaultView() {
    const { recommendations, blogPosts, projects } = DEFAULT_VIEW_DATA;

    return (
        <div className="search-panel-default-view flex gap-4 pt-5 h-full min-h-0">
            {/* Left column: recommendations */}
            <div className="flex-1 min-w-0 overflow-auto">
                <RecommendList items={recommendations} />
            </div>

            {/* Right column: blog posts + projects */}
            <div className="flex-1 min-w-0 flex flex-col gap-4 overflow-auto">
                <CardGrid title="최고의 블로그글" items={blogPosts} />
                <CardGrid title="최고의 프로젝트" items={projects} />
            </div>
        </div>
    );
}

export default SearchPanelDefaultView;
