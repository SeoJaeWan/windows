/**
 * @surface_id sandbox-taskbar-reference-stage
 * @route /sandbox/taskbar
 * @test_kind e2e-surface
 */
import { test, expect } from "@playwright/test";

test.describe("Taskbar sandbox reference stage", () => {
  test("canonical/compare marker 아래에서 pinned/default와 all/results surface를 함께 보여준다", async ({ page }) => {
    await page.goto("/sandbox/taskbar");

    await expect(page.getByTestId("taskbar-sandbox-canonical")).toBeVisible();
    await expect(page.getByTestId("taskbar-sandbox-compare")).toBeVisible();
    await expect(page.getByTestId("taskbar-sandbox-preview")).toHaveCount(0);
    await expect(page.getByTestId("taskbar-sandbox-matrix")).toHaveCount(0);

    await expect(
      page.getByTestId("taskbar-sandbox-canonical").locator("[data-mode='pinned']").first(),
    ).toBeVisible();
    await expect(
      page.getByTestId("taskbar-sandbox-canonical").locator("[data-mode='default']").first(),
    ).toBeVisible();
    await expect(
      page.getByTestId("taskbar-sandbox-compare").locator("[data-mode='all']").first(),
    ).toBeVisible();
    await expect(
      page.getByTestId("taskbar-sandbox-compare").locator("[data-mode='results']").first(),
    ).toBeVisible();

    await expect(page.getByText("Windows")).toBeVisible();
    await expect(page.getByText("고정됨")).toBeVisible();
    await expect(page.getByText("검색 시작")).toBeVisible();
    await expect(page.getByText("Windows UI")).toBeVisible();
  });

  test("narrow viewport에서도 noindex metadata와 reference owner route contract를 유지한다", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/sandbox/taskbar");

    const title = await page.title();

    expect(title.toLowerCase()).toContain("sandbox");
    expect(title.toLowerCase()).toContain("taskbar");
    expect(title.toLowerCase()).not.toContain("preview");

    await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", /noindex/i);
    await expect(page.getByTestId("taskbar-sandbox-canonical")).toBeVisible();
    await expect(page.getByTestId("taskbar-sandbox-compare")).toBeVisible();
    await expect(page.getByTestId("taskbar-sandbox-preview")).toHaveCount(0);
  });
});
