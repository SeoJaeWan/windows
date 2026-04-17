/**
 * capture-current.mjs
 *
 * Phase 4 current capture procedure.
 * Documents the reproducible steps for capturing current Storybook compare stories
 * for the 4 canonical states in the windows-ui-folder-browser-live-fidelity-repair plan.
 *
 * This script is documentation — it is NOT meant to be executed directly.
 * It records the exact agent-browser + eval workflow used to produce the
 * current capture artifacts in visual-compare/.
 *
 * To reproduce:
 *   1. Start Storybook from the worktree:
 *      cd worktrees/windows-ui-folder-browser-live-fidelity-repair
 *      pnpm --filter @windows/ui storybook --port 6008 --ci
 *
 *   2. Wait for Storybook to be ready at http://localhost:6008
 *
 *   3. Run each capture step below using agent-browser CLI:
 *
 * --------------------------------------------------------------------------
 * STEP A — folder/desktop-blog  (viewport: 1280x750)
 * --------------------------------------------------------------------------
 *   npx agent-browser set viewport 1280 750
 *   npx agent-browser open "http://localhost:6008/iframe.html?id=windows-folder--compare-desktop-blog&viewMode=story"
 *   npx agent-browser wait --load networkidle
 *   npx agent-browser wait "[data-visual-root]"
 *   npx agent-browser eval "document.querySelector('[data-visual-root]').parentElement.setAttribute('data-capture-stage', '')"
 *   npx agent-browser screenshot "[data-capture-stage]" \
 *     "plans/windows-ui-folder-browser-live-fidelity-repair/visual-compare/folder-desktop-blog-current.png"
 *
 * --------------------------------------------------------------------------
 * STEP B — folder/mobile-blog  (viewport: 390x794)
 * --------------------------------------------------------------------------
 *   npx agent-browser set viewport 390 794
 *   npx agent-browser open "http://localhost:6008/iframe.html?id=windows-folder--compare-mobile-blog&viewMode=story"
 *   npx agent-browser wait --load networkidle
 *   npx agent-browser wait "[data-visual-root]"
 *   npx agent-browser eval "document.querySelector('[data-visual-root]').parentElement.setAttribute('data-capture-stage', '')"
 *   npx agent-browser screenshot "[data-capture-stage]" \
 *     "plans/windows-ui-folder-browser-live-fidelity-repair/visual-compare/folder-mobile-blog-current.png"
 *
 * --------------------------------------------------------------------------
 * STEP C — browser/desktop-article  (viewport: 1280x750)
 * --------------------------------------------------------------------------
 *   npx agent-browser set viewport 1280 750
 *   npx agent-browser open "http://localhost:6008/iframe.html?id=windows-browser--compare-desktop-article&viewMode=story"
 *   npx agent-browser wait --load networkidle
 *   npx agent-browser wait "[data-visual-root]"
 *   npx agent-browser eval "document.querySelector('[data-visual-root]').parentElement.setAttribute('data-capture-stage', '')"
 *   npx agent-browser screenshot "[data-capture-stage]" \
 *     "plans/windows-ui-folder-browser-live-fidelity-repair/visual-compare/browser-desktop-article-current.png"
 *
 * --------------------------------------------------------------------------
 * STEP D — browser/mobile-article  (viewport: 390x794)
 * --------------------------------------------------------------------------
 *   npx agent-browser set viewport 390 794
 *   npx agent-browser open "http://localhost:6008/iframe.html?id=windows-browser--compare-mobile-article&viewMode=story"
 *   npx agent-browser wait --load networkidle
 *   npx agent-browser wait "[data-visual-root]"
 *   npx agent-browser eval "document.querySelector('[data-visual-root]').parentElement.setAttribute('data-capture-stage', '')"
 *   npx agent-browser screenshot "[data-capture-stage]" \
 *     "plans/windows-ui-folder-browser-live-fidelity-repair/visual-compare/browser-mobile-article-current.png"
 *
 * --------------------------------------------------------------------------
 * NOTES
 * --------------------------------------------------------------------------
 * - The capture target is [data-capture-stage], NOT [data-visual-root].
 *   Reason: CompareRoot wraps the component in a plain div without fixed dimensions.
 *   CompareWindowDesktopStage (1280x750) and CompareWindowMobileStage (390x794)
 *   provide the fixed-size canvas. The eval step tags the parent with a temporary
 *   attribute so agent-browser can select it.
 *
 * - Capture threshold for pixelmatch: 0.2 (external-source reference environment
 *   differs from Storybook Chromium rendering — font hinting, subpixel, system fonts).
 *
 * - Story IDs (worktree Storybook, title: Windows/Folder and Windows/Browser):
 *     windows-folder--compare-desktop-blog
 *     windows-folder--compare-mobile-blog
 *     windows-browser--compare-desktop-article
 *     windows-browser--compare-mobile-article
 */

export {};
