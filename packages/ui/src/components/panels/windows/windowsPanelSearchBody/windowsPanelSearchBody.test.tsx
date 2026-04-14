import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";

import WindowsPanelSearchBody from "./index";

const RESULTS = [
    { id: "r1", label: "Visual Studio Code", iconSrc: "/vscode.png", metaLabel: "앱" },
    { id: "r2", label: "메모장", iconSrc: "/notepad.png", metaLabel: "앱" },
];

const BASE_PROPS = {
    title: "추천 항목",
    results: RESULTS,
    selectedResultId: "r1",
    emptyTitle: "결과 없음",
    emptyDescription: "검색 결과가 없습니다.",
};

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
});

afterEach(() => {
    act(() => root.unmount());
    container.remove();
});

function render(ui: React.ReactNode) {
    act(() => root.render(ui));
}

function queryActionRow(actionId: string): HTMLElement | null {
    return container.querySelector(`[data-action-id="${actionId}"]`);
}

describe("WindowsPanelSearchBody", () => {
    describe("results mode with previewPinState", () => {
        it("renders four preview actions in correct order", () => {
            render(
                createElement(WindowsPanelSearchBody, {
                    ...BASE_PROPS,
                    mode: "results",
                    previewPinState: { start: "pin", taskbar: "pin" },
                }),
            );

            const actions = container.querySelectorAll("[data-action-id]");
            expect(actions).toHaveLength(4);
            expect(actions[0]?.getAttribute("data-action-id")).toBe("open");
            expect(actions[1]?.getAttribute("data-action-id")).toBe("open-folder");
            expect(actions[2]?.getAttribute("data-action-id")).toBe("pin-start");
            expect(actions[3]?.getAttribute("data-action-id")).toBe("pin-taskbar");
        });

        it("shows open and open-folder labels unchanged", () => {
            render(
                createElement(WindowsPanelSearchBody, {
                    ...BASE_PROPS,
                    mode: "results",
                    previewPinState: { start: "pin", taskbar: "pin" },
                }),
            );

            expect(queryActionRow("open")?.textContent).toContain("열기");
            expect(queryActionRow("open-folder")?.textContent).toContain("파일 위치 열기");
        });

        it("pin-start shows '시작 화면에 고정' when start is 'pin'", () => {
            render(
                createElement(WindowsPanelSearchBody, {
                    ...BASE_PROPS,
                    mode: "results",
                    previewPinState: { start: "pin", taskbar: "pin" },
                }),
            );

            expect(queryActionRow("pin-start")?.textContent).toContain("시작 화면에 고정");
        });

        it("pin-start does NOT contain '시작 화면 고정 해제' when start is 'pin'", () => {
            render(
                createElement(WindowsPanelSearchBody, {
                    ...BASE_PROPS,
                    mode: "results",
                    previewPinState: { start: "pin", taskbar: "pin" },
                }),
            );

            expect(queryActionRow("pin-start")?.textContent).not.toContain("시작 화면 고정 해제");
        });

        it("pin-start shows '시작 화면 고정 해제' when start is 'unpin'", () => {
            render(
                createElement(WindowsPanelSearchBody, {
                    ...BASE_PROPS,
                    mode: "results",
                    previewPinState: { start: "unpin", taskbar: "pin" },
                }),
            );

            expect(queryActionRow("pin-start")?.textContent).toContain("시작 화면 고정 해제");
        });

        it("pin-start does NOT contain '시작 화면에 고정' when start is 'unpin'", () => {
            render(
                createElement(WindowsPanelSearchBody, {
                    ...BASE_PROPS,
                    mode: "results",
                    previewPinState: { start: "unpin", taskbar: "pin" },
                }),
            );

            expect(queryActionRow("pin-start")?.textContent).not.toContain("시작 화면에 고정");
        });

        it("pin-taskbar shows '작업 표시줄에 고정' when taskbar is 'pin'", () => {
            render(
                createElement(WindowsPanelSearchBody, {
                    ...BASE_PROPS,
                    mode: "results",
                    previewPinState: { start: "pin", taskbar: "pin" },
                }),
            );

            expect(queryActionRow("pin-taskbar")?.textContent).toContain("작업 표시줄에 고정");
        });

        it("pin-taskbar does NOT contain '작업 표시줄 고정 해제' when taskbar is 'pin'", () => {
            render(
                createElement(WindowsPanelSearchBody, {
                    ...BASE_PROPS,
                    mode: "results",
                    previewPinState: { start: "pin", taskbar: "pin" },
                }),
            );

            expect(queryActionRow("pin-taskbar")?.textContent).not.toContain("작업 표시줄 고정 해제");
        });

        it("pin-taskbar shows '작업 표시줄 고정 해제' when taskbar is 'unpin'", () => {
            render(
                createElement(WindowsPanelSearchBody, {
                    ...BASE_PROPS,
                    mode: "results",
                    previewPinState: { start: "pin", taskbar: "unpin" },
                }),
            );

            expect(queryActionRow("pin-taskbar")?.textContent).toContain("작업 표시줄 고정 해제");
        });

        it("pin-taskbar does NOT contain '작업 표시줄에 고정' when taskbar is 'unpin'", () => {
            render(
                createElement(WindowsPanelSearchBody, {
                    ...BASE_PROPS,
                    mode: "results",
                    previewPinState: { start: "pin", taskbar: "unpin" },
                }),
            );

            expect(queryActionRow("pin-taskbar")?.textContent).not.toContain("작업 표시줄에 고정");
        });

        it("start and taskbar states are independent (start=unpin, taskbar=pin)", () => {
            render(
                createElement(WindowsPanelSearchBody, {
                    ...BASE_PROPS,
                    mode: "results",
                    previewPinState: { start: "unpin", taskbar: "pin" },
                }),
            );

            expect(queryActionRow("pin-start")?.textContent).toContain("시작 화면 고정 해제");
            expect(queryActionRow("pin-taskbar")?.textContent).toContain("작업 표시줄에 고정");
        });

        it("start and taskbar states are independent (start=pin, taskbar=unpin)", () => {
            render(
                createElement(WindowsPanelSearchBody, {
                    ...BASE_PROPS,
                    mode: "results",
                    previewPinState: { start: "pin", taskbar: "unpin" },
                }),
            );

            expect(queryActionRow("pin-start")?.textContent).toContain("시작 화면에 고정");
            expect(queryActionRow("pin-taskbar")?.textContent).toContain("작업 표시줄 고정 해제");
        });

        it("both unpin: shows unpin labels for both actions", () => {
            render(
                createElement(WindowsPanelSearchBody, {
                    ...BASE_PROPS,
                    mode: "results",
                    previewPinState: { start: "unpin", taskbar: "unpin" },
                }),
            );

            expect(queryActionRow("pin-start")?.textContent).toContain("시작 화면 고정 해제");
            expect(queryActionRow("pin-taskbar")?.textContent).toContain("작업 표시줄 고정 해제");
        });
    });

    describe("results mode without previewPinState (backward compat)", () => {
        it("renders four preview actions when previewPinState is omitted", () => {
            render(
                createElement(WindowsPanelSearchBody, {
                    ...BASE_PROPS,
                    mode: "results",
                }),
            );

            const actions = container.querySelectorAll("[data-action-id]");
            expect(actions).toHaveLength(4);
        });

        it("shows pin labels (natural else-branch) when previewPinState is omitted", () => {
            render(
                createElement(WindowsPanelSearchBody, {
                    ...BASE_PROPS,
                    mode: "results",
                }),
            );

            expect(queryActionRow("pin-start")?.textContent).toContain("시작 화면에 고정");
            expect(queryActionRow("pin-start")?.textContent).not.toContain("시작 화면 고정 해제");
            expect(queryActionRow("pin-taskbar")?.textContent).toContain("작업 표시줄에 고정");
            expect(queryActionRow("pin-taskbar")?.textContent).not.toContain("작업 표시줄 고정 해제");
        });
    });

    describe("empty mode", () => {
        it("does not render preview actions", () => {
            render(
                createElement(WindowsPanelSearchBody, {
                    ...BASE_PROPS,
                    mode: "empty",
                }),
            );

            const actions = container.querySelectorAll("[data-action-id]");
            expect(actions).toHaveLength(0);
        });
    });
});
