import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Icon from "./index";

const renderImage = (props: React.ComponentProps<typeof Icon>) => {
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(<Icon {...props} />);

  const image = container.querySelector("[src]");

  expect(image).not.toBeNull();

  return image as HTMLElement;
};

describe("Icon", () => {
  it("className 없이 렌더링해도 기본 클래스가 존재한다", () => {
    const image = renderImage({ kind: "file", alt: "file" });
    const cls = image.getAttribute("class") ?? "";

    expect(cls.trim()).not.toBe("");
    expect(cls).toContain("taskbar-icon");
  });

  it("caller className은 기본 클래스를 대체하지 않고 추가된다", () => {
    const image = renderImage({ kind: "file", alt: "file", className: "extra" });
    const cls = image.getAttribute("class") ?? "";

    expect(cls).toContain("taskbar-icon");
    expect(cls).toContain("extra");
  });

  it("src가 주어지면 kind보다 우선해 해당 이미지를 렌더링한다", () => {
    const customClass = "custom-icon w-8 h-8 rounded-md";
    const image = renderImage({
      src: "/icons/custom-file.png",
      kind: "folder",
      alt: "custom",
      className: customClass,
    });

    expect(image.getAttribute("src")).toBe("/icons/custom-file.png");
    expect(image.getAttribute("src")).not.toContain("folder");
    expect(image.getAttribute("alt")).toBe("custom");
    expect(image.getAttribute("class") ?? "").toContain("custom-icon");
    expect(image.getAttribute("class") ?? "").toContain("w-8");
    expect(image.getAttribute("class") ?? "").toContain("h-8");
    expect(image.getAttribute("class") ?? "").toContain("rounded-md");
    expect((image.getAttribute("class") ?? "").trim()).not.toBe(customClass);
  });

  it("kind='file'이면 file asset fallback을 사용한다", () => {
    const customClass = "custom-file-icon w-6 h-6 object-contain";
    const image = renderImage({
      kind: "file",
      alt: "file icon",
      className: customClass,
    });

    expect(image.getAttribute("src")).toContain("file");
    expect(image.getAttribute("alt")).toBe("file icon");
    expect(image.getAttribute("class") ?? "").toContain("custom-file-icon");
    expect(image.getAttribute("class") ?? "").toContain("w-6");
    expect(image.getAttribute("class") ?? "").toContain("h-6");
    expect(image.getAttribute("class") ?? "").toContain("object-contain");
    expect((image.getAttribute("class") ?? "").trim()).not.toBe(customClass);
  });

  it("kind='folder'이면 folder asset fallback을 사용한다", () => {
    const customClass = "custom-folder-icon w-6 h-6 object-contain";
    const image = renderImage({
      kind: "folder",
      alt: "folder icon",
      className: customClass,
    });

    expect(image.getAttribute("src")).toContain("folder");
    expect(image.getAttribute("alt")).toBe("folder icon");
    expect(image.getAttribute("class") ?? "").toContain("custom-folder-icon");
    expect(image.getAttribute("class") ?? "").toContain("w-6");
    expect(image.getAttribute("class") ?? "").toContain("h-6");
    expect(image.getAttribute("class") ?? "").toContain("object-contain");
    expect((image.getAttribute("class") ?? "").trim()).not.toBe(customClass);
  });
});
