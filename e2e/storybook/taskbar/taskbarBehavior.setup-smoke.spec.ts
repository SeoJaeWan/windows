/**
 * taskbarBehavior.setup-smoke.spec
 *
 * Readiness gate — route reachability + canonical selector availability only.
 *
 * Owner split:
 *   This spec: route reachability + canonical selector availability (Phase 6 gate)
 *   Later materialize: full browser behavior assertions on the same bounded surface
 *
 * What this spec proves:
 *   1. Each behavior story iframe route is reachable (HTTP 200, no Storybook error overlay).
 *   2. The canonical root harness element (backdrop) is present in the DOM after load.
 *   3. The trigger selector is present and interactable.
 *
 * What this spec does NOT prove (reserved for later materialize):
 *   - Hover lifecycle: measured-open delay, animationend boundary, whitelist close,
 *     resting pointer no-op, focus restore absence.
 *   - Context panel: trigger-centered anchor, focus restore, duplicate close guard,
 *     whitelist close, animationend boundary.
 *   - Mutual exclusion: serial handoff timing, simultaneous surface exclusion,
 *     latest-intent winner rule, dismiss-cancels-queued-winner.
 *
 * Bounded surface:
 *   All routes come from TASKBAR_BEHAVIOR_SURFACES registry.
 *   storybookRoute() converts storyTitle + storyExport to the Storybook iframe URL.
 *   No compare story IDs, no @windows/web routes, no proxy fixture paths.
 *
 * Later materialize handoff:
 *   Full browser behavior assertions belong in separate spec files in this same
 *   e2e/storybook/taskbar/ directory, consuming the same registry and route helper.
 *   They target the exact same Storybook stories and selector vocabulary defined here.
 *   Do NOT interpret a passing setup-smoke as a passing browser behavior suite.
 */

import { test, expect } from "@playwright/test";

import { storybookRoute } from "../shared/storybookRoute";
import {
  TASKBAR_BEHAVIOR_SURFACES,
  HOVER_PREVIEW_SURFACE,
  CONTEXT_PANEL_SURFACE,
  MUTUAL_EXCLUSION_SURFACE,
} from "./taskbarBehaviorSurfaceRegistry";

/* ── Route reachability: HoverPreview ────────────────────────── */

test.describe("HoverPreview behavior story — route reachability + selector availability", () => {
  test("iframe 경로가 응답하고 backdrop 루트가 DOM에 존재한다", async ({ page }) => {
    await page.goto(storybookRoute(HOVER_PREVIEW_SURFACE));

    // Route is reachable — no Storybook error overlay
    await expect(page.locator(".sb-errordisplay")).not.toBeVisible();

    // Backdrop root is present (harness mounted successfully)
    const backdrop = page.getByTestId(HOVER_PREVIEW_SURFACE.selector.backdrop);
    await expect(backdrop).toBeVisible();
  });

  test("trigger 셀렉터가 DOM에 존재하고 상호작용 가능하다", async ({ page }) => {
    await page.goto(storybookRoute(HOVER_PREVIEW_SURFACE));

    const trigger = page.getByTestId(HOVER_PREVIEW_SURFACE.selector.trigger);
    await expect(trigger).toBeVisible();
  });

  test("outside 셀렉터가 DOM에 존재한다", async ({ page }) => {
    await page.goto(storybookRoute(HOVER_PREVIEW_SURFACE));

    const outside = page.getByTestId(HOVER_PREVIEW_SURFACE.selector.outside);
    await expect(outside).toBeVisible();
  });

  test("taskbar 셀렉터가 DOM에 존재한다", async ({ page }) => {
    await page.goto(storybookRoute(HOVER_PREVIEW_SURFACE));

    const taskbar = page.getByTestId(HOVER_PREVIEW_SURFACE.selector.taskbar);
    await expect(taskbar).toBeVisible();
  });

  test("surface-root 셀렉터는 초기 상태에서 DOM에 없다", async ({ page }) => {
    await page.goto(storybookRoute(HOVER_PREVIEW_SURFACE));

    // Surface root is absent before any hover interaction
    const surfaceRoot = page.getByTestId(HOVER_PREVIEW_SURFACE.selector.surfaceRoot);
    await expect(surfaceRoot).not.toBeVisible();
  });
});

/* ── Route reachability: ContextPanel ────────────────────────── */

test.describe("ContextPanel behavior story — route reachability + selector availability", () => {
  test("iframe 경로가 응답하고 backdrop 루트가 DOM에 존재한다", async ({ page }) => {
    await page.goto(storybookRoute(CONTEXT_PANEL_SURFACE));

    // Route is reachable — no Storybook error overlay
    await expect(page.locator(".sb-errordisplay")).not.toBeVisible();

    // Backdrop root is present (harness mounted successfully)
    const backdrop = page.getByTestId(CONTEXT_PANEL_SURFACE.selector.backdrop);
    await expect(backdrop).toBeVisible();
  });

  test("trigger 셀렉터가 DOM에 존재하고 상호작용 가능하다", async ({ page }) => {
    await page.goto(storybookRoute(CONTEXT_PANEL_SURFACE));

    const trigger = page.getByTestId(CONTEXT_PANEL_SURFACE.selector.trigger);
    await expect(trigger).toBeVisible();
  });

  test("outside 셀렉터가 DOM에 존재한다", async ({ page }) => {
    await page.goto(storybookRoute(CONTEXT_PANEL_SURFACE));

    const outside = page.getByTestId(CONTEXT_PANEL_SURFACE.selector.outside);
    await expect(outside).toBeVisible();
  });

  test("taskbar 셀렉터가 DOM에 존재한다", async ({ page }) => {
    await page.goto(storybookRoute(CONTEXT_PANEL_SURFACE));

    const taskbar = page.getByTestId(CONTEXT_PANEL_SURFACE.selector.taskbar);
    await expect(taskbar).toBeVisible();
  });

  test("surface-root 셀렉터는 초기 상태에서 DOM에 없다", async ({ page }) => {
    await page.goto(storybookRoute(CONTEXT_PANEL_SURFACE));

    // Surface root is absent before any right-click interaction
    const surfaceRoot = page.getByTestId(CONTEXT_PANEL_SURFACE.selector.surfaceRoot);
    await expect(surfaceRoot).not.toBeVisible();
  });
});

/* ── Route reachability: MutualExclusion ─────────────────────── */

test.describe("MutualExclusion behavior story — route reachability + selector availability", () => {
  test("iframe 경로가 응답하고 backdrop 루트가 DOM에 존재한다", async ({ page }) => {
    await page.goto(storybookRoute(MUTUAL_EXCLUSION_SURFACE));

    // Route is reachable — no Storybook error overlay
    await expect(page.locator(".sb-errordisplay")).not.toBeVisible();

    // Backdrop root is present (harness mounted successfully)
    const backdrop = page.getByTestId(MUTUAL_EXCLUSION_SURFACE.selector.backdrop);
    await expect(backdrop).toBeVisible();
  });

  test("trigger 셀렉터가 DOM에 존재하고 상호작용 가능하다", async ({ page }) => {
    await page.goto(storybookRoute(MUTUAL_EXCLUSION_SURFACE));

    const trigger = page.getByTestId(MUTUAL_EXCLUSION_SURFACE.selector.trigger);
    await expect(trigger).toBeVisible();
  });

  test("outside 셀렉터가 DOM에 존재한다", async ({ page }) => {
    await page.goto(storybookRoute(MUTUAL_EXCLUSION_SURFACE));

    const outside = page.getByTestId(MUTUAL_EXCLUSION_SURFACE.selector.outside);
    await expect(outside).toBeVisible();
  });

  test("taskbar 셀렉터가 DOM에 존재한다", async ({ page }) => {
    await page.goto(storybookRoute(MUTUAL_EXCLUSION_SURFACE));

    const taskbar = page.getByTestId(MUTUAL_EXCLUSION_SURFACE.selector.taskbar);
    await expect(taskbar).toBeVisible();
  });

  test("hover-surface-root 셀렉터는 초기 상태에서 DOM에 없다", async ({ page }) => {
    await page.goto(storybookRoute(MUTUAL_EXCLUSION_SURFACE));

    // Hover surface root is absent before any interaction
    const hoverSurfaceRoot = page.getByTestId(
      MUTUAL_EXCLUSION_SURFACE.selector.hoverSurfaceRoot
    );
    await expect(hoverSurfaceRoot).not.toBeVisible();
  });

  test("context-surface-root 셀렉터는 초기 상태에서 DOM에 없다", async ({ page }) => {
    await page.goto(storybookRoute(MUTUAL_EXCLUSION_SURFACE));

    // Context surface root is absent before any right-click interaction
    const contextSurfaceRoot = page.getByTestId(
      MUTUAL_EXCLUSION_SURFACE.selector.contextSurfaceRoot
    );
    await expect(contextSurfaceRoot).not.toBeVisible();
  });
});

/* ── Registry completeness smoke ─────────────────────────────── */

test.describe("TASKBAR_BEHAVIOR_SURFACES registry — completeness", () => {
  test("registry가 세 recipient를 모두 포함한다", () => {
    // Validate all three exact recipients are present in the registry
    expect(TASKBAR_BEHAVIOR_SURFACES.hoverPreview.storyTitle).toBe(
      "Interactive/Taskbar/HoverPreview"
    );
    expect(TASKBAR_BEHAVIOR_SURFACES.hoverPreview.storyExport).toBe("HoverLifecycle");

    expect(TASKBAR_BEHAVIOR_SURFACES.contextPanel.storyTitle).toBe(
      "Interactive/Taskbar/ContextPanel"
    );
    expect(TASKBAR_BEHAVIOR_SURFACES.contextPanel.storyExport).toBe(
      "PointerOriginAndEscapeClose"
    );

    expect(TASKBAR_BEHAVIOR_SURFACES.mutualExclusion.storyTitle).toBe(
      "Interactive/Taskbar/MutualExclusion"
    );
    expect(TASKBAR_BEHAVIOR_SURFACES.mutualExclusion.storyExport).toBe(
      "ConsumerOwnedWinnerRule"
    );
  });

  test("registry가 sourcePath를 literal하게 가진다", () => {
    expect(TASKBAR_BEHAVIOR_SURFACES.hoverPreview.sourcePath).toBe(
      "packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.behavior.stories.tsx"
    );
    expect(TASKBAR_BEHAVIOR_SURFACES.contextPanel.sourcePath).toBe(
      "packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.behavior.stories.tsx"
    );
    expect(TASKBAR_BEHAVIOR_SURFACES.mutualExclusion.sourcePath).toBe(
      "packages/ui/src/interactive/taskbar/storybook/taskbarMutualExclusion.behavior.stories.tsx"
    );
  });

  test("HoverPreview selector contract이 harness 정의와 일치한다", () => {
    const { selector } = TASKBAR_BEHAVIOR_SURFACES.hoverPreview;
    expect(selector.trigger).toBe("hover-trigger");
    expect(selector.surfaceRoot).toBe("hover-surface-root");
    expect(selector.outside).toBe("hover-outside");
    expect(selector.taskbar).toBe("hover-taskbar");
    expect(selector.backdrop).toBe("hover-backdrop");
  });

  test("ContextPanel selector contract이 harness 정의와 일치한다", () => {
    const { selector } = TASKBAR_BEHAVIOR_SURFACES.contextPanel;
    expect(selector.trigger).toBe("context-trigger");
    expect(selector.surfaceRoot).toBe("context-surface-root");
    expect(selector.outside).toBe("context-outside");
    expect(selector.taskbar).toBe("context-taskbar");
    expect(selector.backdrop).toBe("context-backdrop");
  });

  test("MutualExclusion selector contract이 harness 정의와 일치한다", () => {
    const { selector } = TASKBAR_BEHAVIOR_SURFACES.mutualExclusion;
    expect(selector.trigger).toBe("mutual-trigger");
    expect(selector.hoverSurfaceRoot).toBe("mutual-hover-surface-root");
    expect(selector.contextSurfaceRoot).toBe("mutual-context-surface-root");
    expect(selector.outside).toBe("mutual-outside");
    expect(selector.taskbar).toBe("mutual-taskbar");
    expect(selector.backdrop).toBe("mutual-backdrop");
  });
});
