import type { ReactNode } from "react";

type WindowReviewRootProps = {
  kind: string;
  state: string;
  children: ReactNode;
};

/**
 * WindowReviewRoot
 *
 * Thin wrapper for review-only edge-state stories.
 * Owns the [data-window-review-root][data-window-review-kind][data-window-review-state] marker contract.
 *
 * Used exclusively by review-only story stories (not compare stories).
 * Does NOT add className or inline style — metadata contract only.
 *
 * DOM contract:
 * - [data-window-review-root]   → always present on root element
 * - [data-window-review-kind]   → e.g. "folder" | "browser"
 * - [data-window-review-state]  → e.g. "long-title" | "long-address" | "no-chips" | "empty-dropdown-items"
 *
 * windowReviewInventory.test.tsx reads these markers to validate edge invariants.
 */
export function WindowReviewRoot({ kind, state, children }: WindowReviewRootProps) {
  return (
    <div
      data-window-review-root=""
      data-window-review-kind={kind}
      data-window-review-state={state}
    >
      {children}
    </div>
  );
}
