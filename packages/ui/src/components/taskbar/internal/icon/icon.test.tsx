import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";

const iconEntryPath = "./index";

async function loadIcon() {
  const iconModule = (await import(iconEntryPath)) as {
    default: ComponentType<Record<string, unknown>>;
  };

  return iconModule.default;
}

function parseRoot(markup: string) {
  const container = document.createElement("div");

  container.innerHTML = markup;

  const root = container.firstElementChild;

  expect(root).not.toBeNull();

  return root!;
}

function findImage(root: Element) {
  return root.tagName === "IMG" ? root : root.querySelector("img");
}

describe("Taskbar internal Icon contract", () => {
  it("src 기반 asset icon wrapper로 caller-owned image asset을 직접 렌더링한다", async () => {
    const Icon = await loadIcon();
    const markup = renderToStaticMarkup(
      createElement(Icon, {
        alt: "메모장",
        src: "/icons/notepad.png",
      }),
    );

    const root = parseRoot(markup);
    const image = findImage(root);

    expect(image).not.toBeNull();
    expect(image?.getAttribute("alt")).toBe("메모장");
    expect(image?.getAttribute("src")).toContain("/icons/notepad.png");
  });

  it("package-owned asset과 caller-owned asset을 같은 image grammar로 소비한다", async () => {
    const Icon = await loadIcon();
    const packageOwnedMarkup = renderToStaticMarkup(
      createElement(Icon, {
        alt: "Windows",
        src: "/src/components/taskbar/internal/icon/assets/windows-mark.png",
      }),
    );
    const callerOwnedMarkup = renderToStaticMarkup(
      createElement(Icon, {
        alt: "메모장",
        src: "/icons/notepad.png",
      }),
    );

    const packageOwnedRoot = parseRoot(packageOwnedMarkup);
    const callerOwnedRoot = parseRoot(callerOwnedMarkup);
    const packageOwnedImage = findImage(packageOwnedRoot);
    const callerOwnedImage = findImage(callerOwnedRoot);

    expect(packageOwnedImage).not.toBeNull();
    expect(callerOwnedImage).not.toBeNull();
    expect(packageOwnedRoot.tagName).toBe(callerOwnedRoot.tagName);
    expect(packageOwnedImage?.getAttribute("src")).toContain("windows-mark");
    expect(callerOwnedImage?.getAttribute("src")).toContain("/icons/notepad.png");
  });
});
