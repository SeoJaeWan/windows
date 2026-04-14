import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";

const iconImageEntryPath = "./index";

async function loadIconImage() {
  const iconImageModule = (await import(iconImageEntryPath)) as {
    default: ComponentType<Record<string, unknown>>;
  };

  return iconImageModule.default;
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

describe("Common IconImage contract", () => {
  it("src와 alt를 받아 단일 img를 렌더링한다", async () => {
    const IconImage = await loadIconImage();
    const markup = renderToStaticMarkup(
      createElement(IconImage, {
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

  it("draggable=false와 loading=lazy가 항상 강제된다", async () => {
    const IconImage = await loadIconImage();
    const markup = renderToStaticMarkup(
      createElement(IconImage, {
        alt: "test",
        src: "/test.png",
      }),
    );

    const root = parseRoot(markup);
    const image = findImage(root);

    expect(image).not.toBeNull();
    expect(image?.getAttribute("draggable")).toBe("false");
    expect(image?.getAttribute("loading")).toBe("lazy");
  });

  it("object-contain baseline이 img에 항상 적용된다", async () => {
    const IconImage = await loadIconImage();
    const markup = renderToStaticMarkup(
      createElement(IconImage, {
        alt: "test",
        src: "/test.png",
      }),
    );

    const root = parseRoot(markup);
    const image = findImage(root);

    expect(image).not.toBeNull();
    expect(image?.getAttribute("class")).toContain("object-contain");
  });

  it("className은 wrapper span에, imgClassName은 inner img에 추가된다", async () => {
    const IconImage = await loadIconImage();
    const markup = renderToStaticMarkup(
      createElement(IconImage, {
        alt: "test",
        className: "wrapper-class",
        imgClassName: "img-class",
        src: "/test.png",
      }),
    );

    const root = parseRoot(markup);
    const image = findImage(root);

    expect(root.tagName).toBe("SPAN");
    expect(root.getAttribute("class")).toContain("wrapper-class");
    expect(image).not.toBeNull();
    expect(image?.getAttribute("class")).toContain("img-class");
    expect(image?.getAttribute("class")).toContain("object-contain");
  });

  it("native img props를 img 요소로 전달한다", async () => {
    const IconImage = await loadIconImage();
    const markup = renderToStaticMarkup(
      createElement(IconImage, {
        alt: "test",
        "data-testid": "icon-img",
        height: 30,
        src: "/test.png",
        width: 30,
      }),
    );

    const root = parseRoot(markup);
    const image = findImage(root);

    expect(image).not.toBeNull();
    expect(image?.getAttribute("data-testid")).toBe("icon-img");
    expect(image?.getAttribute("width")).toBe("30");
    expect(image?.getAttribute("height")).toBe("30");
  });

  it("caller가 draggable={true}를 넘겨도 false로 강제된다", async () => {
    const IconImage = await loadIconImage();
    const markup = renderToStaticMarkup(
      createElement(IconImage, {
        alt: "test",
        draggable: true,
        src: "/test.png",
      }),
    );

    const root = parseRoot(markup);
    const image = findImage(root);

    expect(image).not.toBeNull();
    expect(image?.getAttribute("draggable")).toBe("false");
  });

  it("caller가 loading='eager'를 넘겨도 lazy로 강제된다", async () => {
    const IconImage = await loadIconImage();
    const markup = renderToStaticMarkup(
      createElement(IconImage, {
        alt: "test",
        loading: "eager",
        src: "/test.png",
      }),
    );

    const root = parseRoot(markup);
    const image = findImage(root);

    expect(image).not.toBeNull();
    expect(image?.getAttribute("loading")).toBe("lazy");
  });

  it("caller가 imgClassName을 넘겨도 object-contain이 항상 포함된다", async () => {
    const IconImage = await loadIconImage();
    const markup = renderToStaticMarkup(
      createElement(IconImage, {
        alt: "test",
        imgClassName: "custom-fit",
        src: "/test.png",
      }),
    );

    const root = parseRoot(markup);
    const image = findImage(root);

    expect(image).not.toBeNull();
    expect(image?.getAttribute("class")).toContain("object-contain");
    expect(image?.getAttribute("class")).toContain("custom-fit");
  });

  it("className과 imgClassName 없이도 정상 렌더링된다", async () => {
    const IconImage = await loadIconImage();
    const markup = renderToStaticMarkup(
      createElement(IconImage, {
        alt: "test",
        src: "/test.png",
      }),
    );

    const root = parseRoot(markup);
    const image = findImage(root);

    expect(root.tagName).toBe("SPAN");
    expect(root.getAttribute("class")).not.toBeNull();
    expect(image).not.toBeNull();
  });
});
