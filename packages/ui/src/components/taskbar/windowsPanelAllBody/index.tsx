import Chevron from "../internal/chevron";

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
 * "All apps" view of the Windows panel. Geometry mirrors the blog reference:
 *
 * - Section wrapper: py-7 vertical spacing
 * - Header: px-6, font-bold, mb-4, flex justify-between
 * - Back button: bg-white border border-gray-400 rounded-sm text-xs px-1 py-0.5
 *   with "<" chevron character
 * - mode: "list" — category headings (text-sm, px-4.5 py-2.5) with list rows
 *   (flex items-center gap-4, text-sm, px-2.5 py-2.5, 25px icon)
 * - mode: "index" — centered 4-col grid, aspect-square cells, text-xl
 *
 * Scroll callbacks and activeLetter highlight are excluded in this phase.
 */
function WindowsPanelAllBody({ title, backLabel, mode, sections }: WindowsPanelAllBodyProps) {
  return (
    <div className="windows-panel-all-body flex flex-col h-full py-7">
      <div className="flex justify-between font-bold mb-4 px-6">
        <h2>{title}</h2>
        <button
          type="button"
          className="windows-panel-all-back flex items-center gap-1 bg-white border border-gray-400 rounded-sm font-medium text-xs px-1 py-0.5 hover:bg-gray-100/50"
        >
          {backLabel} <Chevron direction="left" size={12} />
        </button>
      </div>

      {mode === "list" ? (
        <div className="windows-panel-all-list flex-1 min-h-0 overflow-y-auto px-4">
          {sections.map((section) => (
            <div key={section.id}>
              <div className="windows-panel-all-heading text-sm text-left px-4.5 py-2.5 rounded-md hover:bg-white">
                {section.heading}
              </div>
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="windows-panel-all-item flex items-center gap-4 text-sm text-left px-2.5 py-2.5 rounded-md hover:bg-white w-full"
                >
                  <span className="text-[25px] leading-none shrink-0" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="windows-panel-all-index flex-1 min-h-0 flex items-center justify-center">
          <div className="grid grid-cols-4 gap-2 w-[40%]">
            {sections.map((section) => (
              <div
                key={section.id}
                className="windows-panel-all-index-cell w-full h-auto aspect-square rounded-md text-xl text-center flex items-center justify-center hover:bg-white cursor-default"
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
