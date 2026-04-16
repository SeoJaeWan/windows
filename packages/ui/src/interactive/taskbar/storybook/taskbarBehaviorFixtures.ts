/**
 * taskbarBehaviorFixtures
 *
 * Adapter module that re-exports fixture data from existing component
 * fixture files for use in interactive behavior stories.
 *
 * Read-only adapter — does NOT define new canonical visual states or
 * compare kind/state pairs.
 * Internal-only — NOT exported from package root.
 */

export {
  HOVER_SINGLE,
  HOVER_MULTI,
} from "../../../components/panels/taskbarHoverPreview/storybook/taskbarHoverPreviewFixtures";

export {
  CONTEXT_PINNED,
  CONTEXT_UNPINNED,
} from "../../../components/panels/taskbarContextMenu/storybook/taskbarContextMenuFixtures";
