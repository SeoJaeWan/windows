import { ChevronRight12Regular } from "@fluentui/react-icons";

import IconImage from "../../../common/iconImage";

type PinnedItem = {
  id: string;
  label: string;
  iconSrc: string;
};

type WindowsPanelPinnedViewProps = {
  title: string;
  actionLabel: string;
  items: PinnedItem[];
};

/**
 * WindowsPanelPinnedView
 *
 * Pinned apps section of the Windows panel. Geometry mirrors the blog reference:
 *
 * - Section wrapper: py-7 vertical spacing from search row
 * - Header: px-6, font-bold, mb-4, flex justify-between
 * - Action button: bg-white border border-gray-400 rounded-sm text-xs px-1 py-0.5
 *   with ">" chevron character
 * - Grid: grid-cols-6, items have px-3 py-2, size-8.5 icon, text-xs, line-clamp-2, h-[2lh]
 *
 * Click callbacks are excluded in this phase — the view is a visual contract only.
 */
function WindowsPanelPinnedView({ title, actionLabel, items }: WindowsPanelPinnedViewProps) {
  return (
    <section className="windows-panel-pinned-view py-7">
      <div className="flex justify-between px-6 font-bold mb-4">
        <h2 className="text-taskbar">{title}</h2>
        <button
          type="button"
          className="windows-panel-pinned-action flex items-center gap-1 bg-white border border-gray-400 rounded-sm font-medium text-xs px-1 py-0.5 hover:bg-gray-100/50"
        >
          {actionLabel} <span className="windows-panel-pinned-action-icon" aria-hidden="true" data-fluent-icon="ChevronRight12Regular"><ChevronRight12Regular /></span>
        </button>
      </div>
      <div className="grid grid-cols-6">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="windows-panel-pinned-item flex items-center justify-center gap-0.5 flex-col px-3 py-2 text-xs text-center break-keep hover:bg-white rounded-md cursor-pointer"
          >
            <IconImage src={item.iconSrc} alt="" className="size-8.5 leading-none" aria-hidden="true" />
            <p className="line-clamp-2 h-[2lh]">{item.label}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

export default WindowsPanelPinnedView;
