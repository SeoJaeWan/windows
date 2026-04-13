import Chevron from "../internal/chevron";

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
 * Pinned apps section of the Windows panel. Geometry mirrors the blog reference:
 *
 * - Section wrapper: py-7 vertical spacing from search row
 * - Header: px-6, font-bold, mb-4, flex justify-between
 * - Action button: bg-white border border-gray-400 rounded-sm text-xs px-1 py-0.5
 *   with ">" chevron character
 * - Grid: grid-cols-6, items have px-3 py-2, 34px icon, text-xs, line-clamp-2, h-[2lh]
 *
 * Click callbacks are excluded in this phase — the body is a visual contract only.
 */
function WindowsPanelPinnedBody({ title, actionLabel, items }: WindowsPanelPinnedBodyProps) {
  return (
    <div className="windows-panel-pinned-body py-7">
      <div className="flex justify-between px-6 font-bold mb-4">
        <h2>{title}</h2>
        <button
          type="button"
          className="windows-panel-pinned-action flex items-center gap-1 bg-white border border-gray-400 rounded-sm font-medium text-xs px-1 py-0.5 hover:bg-gray-100/50"
        >
          {actionLabel} <Chevron direction="right" size={12} />
        </button>
      </div>
      <div className="grid grid-cols-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="windows-panel-pinned-item flex items-center justify-center gap-0.5 flex-col px-3 py-2 text-xs text-center break-keep hover:bg-white rounded-md"
          >
            <span className="text-[34px] leading-none" aria-hidden="true">
              {item.icon}
            </span>
            <p className="line-clamp-2 h-[2lh]">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WindowsPanelPinnedBody;
