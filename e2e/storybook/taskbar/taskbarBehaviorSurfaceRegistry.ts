/**
 * taskbarBehaviorSurfaceRegistry
 *
 * Exact browser recipient routing table for the three taskbar behavior
 * Storybook stories. All four contract fields are literal — no derivation,
 * no indirection.
 *
 * Fields per entry:
 *   sourcePath   — workspace-relative path to the behavior story file (read-only reference)
 *   storyTitle   — exact meta.title literal in the story file
 *   storyExport  — exact named export identifier in the story file
 *   selector     — stable data-testid vocabulary owned by the corresponding harness
 *
 * Canonical source files (read-only — registry mirrors, does not own):
 *   packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.behavior.stories.tsx
 *   packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.behavior.stories.tsx
 *   packages/ui/src/interactive/taskbar/storybook/taskbarMutualExclusion.behavior.stories.tsx
 *   packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx
 *
 * Selector source:
 *   HoverPreviewHarness    → hover-* selectors
 *   ContextPanelHarness    → context-* selectors
 *   MutualExclusionHarness → mutual-* selectors
 *
 * Owner split:
 *   unit/runtime/compare owners — packages/ui/src/interactive/taskbar/storybook/ (Phase 3)
 *   browser owner               — e2e/storybook/** (this file, Phase 6)
 *
 * Later materialize contract:
 *   Full browser behavior assertions are added in the same e2e/storybook/taskbar/
 *   directory by consuming this registry and the storybookRoute helper.
 *   The setup-smoke spec (taskbarBehavior.setup-smoke.spec.ts) only gates
 *   route reachability and canonical selector availability — it does not
 *   perform full behavior assertions.
 *
 * Invalid sources (do NOT use as routing input):
 *   - compare story IDs (Taskbar/Compose/* titles)
 *   - @windows/web routes (http://localhost:3000/*)
 *   - proxy fixture paths
 */

export interface TaskbarBehaviorSelector {
  /** The trigger element (hover enter/leave or right-click target) */
  trigger: string;
  /** The mounted surface root (present only while isOpen) */
  surfaceRoot: string;
  /** Explicit outside-click / outside-pointerdown target */
  outside: string;
  /** Taskbar strip (whitelisted — does NOT close surface) */
  taskbar: string;
  /** Desktop backdrop container */
  backdrop: string;
}

export interface TaskbarBehaviorMutualSelector {
  /** The shared trigger button (hover + context combined) */
  trigger: string;
  /** Hover surface root (present only when hoverPreview.isOpen && !contextPanel.isOpen) */
  hoverSurfaceRoot: string;
  /** Context surface root (present only when contextPanel.isOpen && !hoverPreview.isOpen) */
  contextSurfaceRoot: string;
  /** Explicit outside-click / outside-pointerdown target */
  outside: string;
  /** Taskbar strip */
  taskbar: string;
  /** Desktop backdrop container */
  backdrop: string;
}

export interface TaskbarBehaviorEntry<S> {
  /** Workspace-relative path to the behavior story source file */
  sourcePath: string;
  /** Exact meta.title literal from the story file */
  storyTitle: string;
  /** Exact named export identifier in the story file */
  storyExport: string;
  /** Stable data-testid selector vocabulary owned by the harness */
  selector: S;
}

/**
 * HoverPreview behavior recipient
 *
 * Story: Interactive/Taskbar/HoverPreview > HoverLifecycle
 * Harness: HoverPreviewHarness in taskbarBehaviorHarnesses.tsx
 *
 * Browser acceptance (setup-smoke gates route + selector only;
 * full assertions are later materialize's responsibility):
 *   - measured-open delay (no zero-size provisional snap)
 *   - animationend boundary (opening → open, closing → finalize)
 *   - whitelist close (Escape, outside pointerdown)
 *   - resting pointer no-op after dismiss
 *   - NO focus restore (hover-specific)
 */
export const HOVER_PREVIEW_SURFACE: TaskbarBehaviorEntry<TaskbarBehaviorSelector> = {
  sourcePath:
    "packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.behavior.stories.tsx",
  storyTitle: "Interactive/Taskbar/HoverPreview",
  storyExport: "HoverLifecycle",
  selector: {
    trigger: "hover-trigger",
    surfaceRoot: "hover-surface-root",
    outside: "hover-outside",
    taskbar: "hover-taskbar",
    backdrop: "hover-backdrop",
  },
};

/**
 * ContextPanel behavior recipient
 *
 * Story: Interactive/Taskbar/ContextPanel > PointerOriginAndEscapeClose
 * Harness: ContextPanelHarness in taskbarBehaviorHarnesses.tsx
 *
 * Browser acceptance (setup-smoke gates route + selector only;
 * full assertions are later materialize's responsibility):
 *   - trigger-centered anchor (NOT pointer-origin)
 *   - animationend boundary (opening → open, closing → finalize)
 *   - focus restore after onExitComplete (context-specific)
 *   - duplicate close no-op guard
 *   - whitelist close (Escape, outside pointerdown)
 */
export const CONTEXT_PANEL_SURFACE: TaskbarBehaviorEntry<TaskbarBehaviorSelector> = {
  sourcePath:
    "packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.behavior.stories.tsx",
  storyTitle: "Interactive/Taskbar/ContextPanel",
  storyExport: "PointerOriginAndEscapeClose",
  selector: {
    trigger: "context-trigger",
    surfaceRoot: "context-surface-root",
    outside: "context-outside",
    taskbar: "context-taskbar",
    backdrop: "context-backdrop",
  },
};

/**
 * MutualExclusion behavior recipient
 *
 * Story: Interactive/Taskbar/MutualExclusion > ConsumerOwnedWinnerRule
 * Harness: MutualExclusionHarness in taskbarBehaviorHarnesses.tsx
 *
 * Browser acceptance (setup-smoke gates route + selector only;
 * full assertions are later materialize's responsibility):
 *   - serial handoff: context wins (right-click while hover is open)
 *   - serial handoff: hover wins (hover opens while context is open)
 *   - mutual exclusion invariant (both surfaces never in DOM simultaneously)
 *   - latest intent wins (multiple right-clicks before loser finalizes)
 *   - dismiss cancels queued winner
 *   - resting pointer no-op after context wins
 */
export const MUTUAL_EXCLUSION_SURFACE: TaskbarBehaviorEntry<TaskbarBehaviorMutualSelector> = {
  sourcePath:
    "packages/ui/src/interactive/taskbar/storybook/taskbarMutualExclusion.behavior.stories.tsx",
  storyTitle: "Interactive/Taskbar/MutualExclusion",
  storyExport: "ConsumerOwnedWinnerRule",
  selector: {
    trigger: "mutual-trigger",
    hoverSurfaceRoot: "mutual-hover-surface-root",
    contextSurfaceRoot: "mutual-context-surface-root",
    outside: "mutual-outside",
    taskbar: "mutual-taskbar",
    backdrop: "mutual-backdrop",
  },
};

/**
 * Flat registry of all three taskbar behavior Storybook surface entries.
 *
 * Later materialize spec files consume this registry directly:
 *   import { TASKBAR_BEHAVIOR_SURFACES } from './taskbarBehaviorSurfaceRegistry';
 *   const entry = TASKBAR_BEHAVIOR_SURFACES.hoverPreview;
 *   await page.goto(storybookRoute(entry));
 */
export const TASKBAR_BEHAVIOR_SURFACES = {
  hoverPreview: HOVER_PREVIEW_SURFACE,
  contextPanel: CONTEXT_PANEL_SURFACE,
  mutualExclusion: MUTUAL_EXCLUSION_SURFACE,
} as const;
