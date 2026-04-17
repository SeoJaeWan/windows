import type { Meta, StoryObj } from "@storybook/react";

import { ContextPanelHarness } from "./taskbarBehaviorHarnesses";

const meta = {
  title: "Interactive/Taskbar/ContextPanel",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * PointerOriginAndEscapeClose
 *
 * Demonstrates context panel anchor, dismiss, and focus restore contracts:
 *
 * Anchor contract (trigger-centered, NOT pointer-origin):
 *   Surface x/y is computed from triggerRef.current.getBoundingClientRect()
 *   via calculateTaskbarPlacement. Horizontal: centered on trigger center x.
 *   Vertical: panel bottom edge is ATTACHED_GAP (10px) above trigger top.
 *   Right-click pointer position is NOT the anchor; the trigger rect is.
 *
 * Dismiss winner rule (explicit):
 *   1. Escape key — document-level keydown, focus-agnostic (fires regardless
 *      of which element has focus). Hook-installed, cleaned up on finalize.
 *   2. Outside pointerdown — document-level handler with composedPath() whitelist.
 *      Trigger element and surface root are whitelisted (clicks inside do not close).
 *   3. Programmatic close() — consumer-owned, e.g. from onCloseAll.
 *
 * Focus restore contract:
 *   triggerRef.current.focus() fires inside finalize(), which is called after
 *   onExitComplete (full motion) or immediately on close() (reduced motion).
 *
 * Motion contract (full, no reduced-motion override):
 *   opening → open → closing → finalize (unmount)
 *   onExitComplete is called by the leaf after the closing animation ends.
 */
export const PointerOriginAndEscapeClose: Story = {
  name: "Anchor / Escape dismiss / outside dismiss / focus restore",
  render: () => <ContextPanelHarness />,
};
