/**
 * storybookRoute — Storybook browser route helper
 *
 * Converts a registry entry's storyTitle + storyExport into the canonical
 * Storybook iframe URL used by the storybook browser runner.
 *
 * Storybook story ID derivation:
 *   1. Lowercase the full title string.
 *   2. Replace all "/" with "-".
 *   3. Replace all spaces and non-alphanumeric-non-dash characters with "-".
 *   4. Append "--" + lowercased storyExport.
 *
 * Example:
 *   storyTitle  = "Interactive/Taskbar/HoverPreview"
 *   storyExport = "HoverLifecycle"
 *   → storyId   = "interactive-taskbar-hoverpreview--hoverlifecycle"
 *   → path      = "/iframe.html?id=interactive-taskbar-hoverpreview--hoverlifecycle&viewMode=story"
 *
 * Usage (in Playwright tests):
 *   import { storybookRoute } from '../shared/storybookRoute';
 *   import { TASKBAR_BEHAVIOR_SURFACES } from './taskbarBehaviorSurfaceRegistry';
 *
 *   const entry = TASKBAR_BEHAVIOR_SURFACES.hoverPreview;
 *   await page.goto(storybookRoute(entry));
 *
 * Input contract:
 *   storyTitle  — literal title from meta.title in the story file (e.g. "Interactive/Taskbar/HoverPreview")
 *   storyExport — named export identifier in the story file (e.g. "HoverLifecycle")
 *
 * Output contract:
 *   Full relative URL path to the Storybook iframe for that story.
 *   Caller prepends baseURL (http://localhost:6006) via Playwright config.
 *
 * Boundary:
 *   This helper only produces the iframe route. It does NOT navigate, fetch,
 *   or assert. Navigation is done by the caller (Playwright page.goto).
 *   Compare story IDs, @windows/web routes, and proxy fixture paths are
 *   invalid input sources for this helper — registry entries only.
 */

export interface StorybookRouteInput {
  storyTitle: string;
  storyExport: string;
}

/**
 * Derives the canonical Storybook story ID from title and export name.
 *
 * Storybook converts titles and export names to lowercase kebab-case.
 * Slashes in the title become dashes; spaces and special chars become dashes.
 */
export function storybookStoryId(input: StorybookRouteInput): string {
  const titleSlug = input.storyTitle
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const exportSlug = input.storyExport
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${titleSlug}--${exportSlug}`;
}

/**
 * Returns the Storybook iframe URL path for the given registry entry.
 *
 * Playwright's baseURL (http://localhost:6006) is prepended by the config —
 * this function returns only the path starting with "/iframe.html".
 */
export function storybookRoute(input: StorybookRouteInput): string {
  const id = storybookStoryId(input);
  return `/iframe.html?id=${id}&viewMode=story`;
}
