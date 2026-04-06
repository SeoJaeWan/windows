/**
 * @surface_id sandbox-taskbar-preview
 * @route /sandbox/taskbar
 * @test_kind e2e-surface
 */
import { test, expect } from "@playwright/test";

test.describe("Taskbar sandbox preview", () => {
  test("정적 preview surface에서 canonical scene과 fixture matrix가 package-owned style reflection과 함께 보인다", async ({ page }) => {
    await page.goto("/sandbox/taskbar");

    await expect(page.getByTestId("taskbar-sandbox-preview")).toBeVisible();
    await expect(page.getByTestId("taskbar-sandbox-canonical")).toBeVisible();
    await expect(page.getByTestId("taskbar-sandbox-matrix")).toBeVisible();

    await expect(page.locator("[data-status]")).toHaveCount(3);
    await expect(page.locator("[data-panel='start']")).toHaveCount(3);
    await expect(page.locator("[data-panel='search']")).toHaveCount(2);
    await expect(page.locator("[data-panel='hover']")).toHaveCount(2);
    await expect(page.locator("[data-panel='context-menu']")).toHaveCount(2);

    await expect(page.getByText("시작")).toBeVisible();
    await expect(page.getByText("고정됨")).toBeVisible();
    await expect(page.getByText("검색 시작")).toBeVisible();
    await expect(page.getByText("Chrome")).toBeVisible();
    await expect(page.getByText("작업 표시줄에 고정")).toBeVisible();

    await expect(page.getByTestId("taskbar-sandbox-canonical").locator("nav").first()).toHaveAttribute("class", /\S/);
    await expect(page.locator("[data-panel='start']").first()).toHaveAttribute("class", /\S/);
    await expect(page.locator("[data-panel='search']").first()).toHaveAttribute("class", /\S/);
    await expect(page.locator("[data-panel='hover']").first()).toHaveAttribute("class", /\S/);
    await expect(page.locator("[data-panel='context-menu']").first()).toHaveAttribute("class", /\S/);
  });

  test("sandbox metadata와 좁은 viewport surface를 유지한다", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/sandbox/taskbar");

    const title = await page.title();

    expect(title.toLowerCase()).toContain("sandbox");
    expect(title.toLowerCase()).toContain("taskbar");

    await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", /noindex/i);
    await expect(page.getByTestId("taskbar-sandbox-preview")).toBeVisible();
    await expect(page.getByTestId("taskbar-sandbox-matrix")).toBeVisible();
    await expect(page.getByText("Windows UI")).toBeVisible();
  });
});
