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

function PanelTile(props: PanelTileProps) {
  const { variant, label, graphic, ...buttonProps } = props;

  if (variant === "framed") {
    const { description, selected, ...rest } = buttonProps as Omit<FramedProps, "variant" | "label" | "graphic">;
    return (
      <button type="button" data-selected={selected || undefined} {...rest}>
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
  const { ...rest } = buttonProps as Omit<CompactProps, "variant" | "label" | "graphic">;
  return (
    <button type="button" {...rest}>
      <div data-variant="compact">
        {graphic && <div>{graphic}</div>}
        <span>{label}</span>
      </div>
    </button>
  );
}

export default PanelTile;
