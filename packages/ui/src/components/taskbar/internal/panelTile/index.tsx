import React from "react";

type FramedProps = {
  variant: "framed";
  label: string;
  description?: string;
  graphic?: React.ReactNode;
  selected?: boolean;
} & Omit<React.ComponentPropsWithoutRef<"button">, "children">;

type CompactProps = {
  variant: "compact";
  label: string;
  graphic?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<"button">, "children">;

type PanelTileProps = FramedProps | CompactProps;

const FRAMED_BASE_CLASS = "taskbar-panel-tile-framed";
const COMPACT_BASE_CLASS = "taskbar-panel-tile-compact";

function PanelTile(props: PanelTileProps) {
  const { variant, label, graphic, className, ...buttonProps } = props as PanelTileProps & { className?: string };

  if (variant === "framed") {
    const { description, selected, ...rest } = buttonProps as Omit<FramedProps, "variant" | "label" | "graphic" | "className">;
    const mergedClass = className ? `${FRAMED_BASE_CLASS} ${className}` : FRAMED_BASE_CLASS;

    return (
      <button type="button" className={mergedClass} data-selected={selected || undefined} {...rest}>
        <div data-variant="framed">
          {graphic && <div>{graphic}</div>}
          <div>
            <span>{label}</span>
            {description && <span>{description}</span>}
          </div>
        </div>
      </button>
    );
  }

  // compact
  const { ...rest } = buttonProps as Omit<CompactProps, "variant" | "label" | "graphic" | "className">;
  const mergedClass = className ? `${COMPACT_BASE_CLASS} ${className}` : COMPACT_BASE_CLASS;

  return (
    <button type="button" className={mergedClass} {...rest}>
      <div data-variant="compact">
        {graphic && <div>{graphic}</div>}
        <span>{label}</span>
      </div>
    </button>
  );
}

export default PanelTile;
