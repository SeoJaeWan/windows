import Chevron from "../internal/chevron";

type AllItem = {
  id: string;
  label: string;
  iconSrc: string;
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
    <section className="windows-panel-all-body flex flex-col h-full py-7">
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
        <div className="windows-panel-all-list flex-1 min-h-0 overflow-y-auto overscroll-contain px-4">
          {sections.map((section) => (
            <div key={section.id}>
              <button type="button" className="windows-panel-all-heading text-sm text-left px-4.5 py-2.5 rounded-md hover:bg-white w-full cursor-pointer">
                {section.heading}
              </button>
              {section.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="windows-panel-all-item flex items-center gap-4 text-sm text-left px-2.5 py-2.5 rounded-md hover:bg-white w-full cursor-pointer"
                >
                  <img src={item.iconSrc} alt="" width={25} height={25} loading="lazy" className="leading-none shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="windows-panel-all-index flex-1 min-h-0 flex items-center justify-center">
          <div className="grid grid-cols-4 gap-2 w-[40%]">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                className="windows-panel-all-index-cell w-full h-auto aspect-square rounded-md text-xl text-center flex items-center justify-center hover:bg-white cursor-pointer"
              >
                {section.indexLabel}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default WindowsPanelAllBody;
