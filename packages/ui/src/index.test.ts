import { describe, expect, it } from "vitest";

/**
 * Root export leak guard for @windows/ui.
 *
 * Ensures that internal modules (contentIcon, PNG paths, Fluent helpers)
 * do not leak into the public root surface, and that existing exports
 * remain intact.
 */

describe("@windows/ui root export contract", () => {
  it("기존 taskbar/panel 컴포넌트가 root entry에서 export된다", async () => {
    const rootModule = await import("./index");

    // Taskbar components
    expect(rootModule.Taskbar).toBeDefined();
    expect(rootModule.TaskbarWindowsButton).toBeDefined();
    expect(rootModule.TaskbarSearch).toBeDefined();
    expect(rootModule.TaskbarIconButton).toBeDefined();
    expect(rootModule.TaskbarClock).toBeDefined();

    // Panel components
    expect(rootModule.WindowsPanelShell).toBeDefined();
    expect(rootModule.WindowsPanelPinnedBody).toBeDefined();
    expect(rootModule.WindowsPanelAllBody).toBeDefined();
    expect(rootModule.WindowsPanelSearchBody).toBeDefined();
  });

  it("contentIcon owner module이 root export에 누출되지 않는다", async () => {
    const rootModule = await import("./index");
    const exportedKeys = Object.keys(rootModule);

    // contentIcon 관련 key가 root surface에 없어야 한다
    const leakedIconKeys = exportedKeys.filter(
      (key) =>
        key.toLowerCase().includes("contenticon") ||
        key.toLowerCase().includes("content_icon"),
    );

    expect(leakedIconKeys).toEqual([]);
  });

  it("file/folder PNG asset src가 root export에 누출되지 않는다", async () => {
    const rootModule = await import("./index");
    const exportedKeys = Object.keys(rootModule);

    // PNG asset 관련 key가 root surface에 없어야 한다
    const leakedAssetKeys = exportedKeys.filter(
      (key) =>
        key === "file" ||
        key === "folder" ||
        key.toLowerCase().includes("filepng") ||
        key.toLowerCase().includes("folderpng") ||
        key.toLowerCase().includes("filesrc") ||
        key.toLowerCase().includes("foldersrc"),
    );

    expect(leakedAssetKeys).toEqual([]);
  });

  it("Fluent icon helper가 root export에 누출되지 않는다", async () => {
    const rootModule = await import("./index");
    const exportedKeys = Object.keys(rootModule);

    // Fluent 관련 key가 root surface에 없어야 한다
    const leakedFluentKeys = exportedKeys.filter(
      (key) =>
        key.toLowerCase().includes("fluent") ||
        key.toLowerCase().includes("fluenticon"),
    );

    expect(leakedFluentKeys).toEqual([]);
  });

  it("root export surface가 정확히 기존 컴포넌트만 포함한다", async () => {
    const rootModule = await import("./index");
    const exportedKeys = Object.keys(rootModule).sort();

    const expectedKeys = [
      "Taskbar",
      "TaskbarClock",
      "TaskbarIconButton",
      "TaskbarSearch",
      "TaskbarWindowsButton",
      "WindowsPanelAllBody",
      "WindowsPanelPinnedBody",
      "WindowsPanelSearchBody",
      "WindowsPanelShell",
    ].sort();

    expect(exportedKeys).toEqual(expectedKeys);
  });
});

describe("Negative scope: taskbar icon boundary", () => {
  it("TaskbarWindowsButton은 내부 windows-mark asset을 사용하며 Fluent 전환 대상이 아니다", async () => {
    const sourceModules = import.meta.glob(
      "./components/taskbar/taskbarWindowsButton/index.tsx",
      { eager: true, import: "default", query: "?raw" },
    );

    const sourceText = Object.values(sourceModules).join("");

    // windows-mark.png를 사용하는 기존 패턴이 유지됨
    expect(sourceText).toContain("windows-mark.png");
    // Fluent import가 없어야 함
    expect(sourceText).not.toMatch(/@fluentui/);
  });

  it("TaskbarIconButton은 iconSrc prop 기반이며 Fluent 전환 대상이 아니다", async () => {
    const sourceModules = import.meta.glob(
      "./components/taskbar/taskbarIconButton/index.tsx",
      { eager: true, import: "default", query: "?raw" },
    );

    const sourceText = Object.values(sourceModules).join("");

    // iconSrc prop 기반 패턴이 유지됨
    expect(sourceText).toContain("iconSrc");
    // Fluent import가 없어야 함
    expect(sourceText).not.toMatch(/@fluentui/);
  });
});
