import type { ReactNode } from "react";

type SearchPanelReferenceStageProps = {
  label: string;
  children: ReactNode;
};

/**
 * SearchPanelReferenceStage
 *
 * Panel-only centered canvas for Storybook. Provides a bright desktop backdrop
 * behind the search panel card so reviewers see the panel in spatial context.
 *
 * Mirrors WindowsPanelReferenceStage layout conventions.
 */
function SearchPanelReferenceStage({ label, children }: SearchPanelReferenceStageProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "700px",
        padding: "2em",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#888",
          fontFamily: "monospace",
          padding: "0.25em 0",
          marginBottom: "1em",
        }}
      >
        {label}
      </div>
      {/* Bright desktop backdrop — decorative storybook context only */}
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          width: 820,
          height: 660,
          background: "linear-gradient(135deg, #1e90ff 0%, #87ceeb 50%, #4fc3f7 100%)",
          borderRadius: 12,
          paddingBottom: 20,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default SearchPanelReferenceStage;
