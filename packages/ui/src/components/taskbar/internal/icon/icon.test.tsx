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
  it("src가 주어지면 kind보다 우선해 해당 이미지를 렌더링한다", () => {
    const image = renderImage({
      src: "/icons/custom-file.png",
      kind: "folder",
      alt: "custom",
      className: "w-8 h-8 rounded-md",
    });

    expect(image.getAttribute("src")).toBe("/icons/custom-file.png");
    expect(image.getAttribute("src")).not.toContain("folder");
    expect(image.getAttribute("alt")).toBe("custom");
    expect(image.getAttribute("class") ?? "").toContain("w-8");
    expect(image.getAttribute("class") ?? "").toContain("h-8");
    expect(image.getAttribute("class") ?? "").toContain("rounded-md");
  });

  it("kind='file'이면 file asset fallback을 사용한다", () => {
    const image = renderImage({
      kind: "file",
      alt: "file icon",
      className: "w-6 h-6 object-contain",
    });

    expect(image.getAttribute("src")).toContain("file");
    expect(image.getAttribute("alt")).toBe("file icon");
    expect(image.getAttribute("class") ?? "").toContain("w-6");
    expect(image.getAttribute("class") ?? "").toContain("h-6");
    expect(image.getAttribute("class") ?? "").toContain("object-contain");
  });

  it("kind='folder'이면 folder asset fallback을 사용한다", () => {
    const image = renderImage({
      kind: "folder",
      alt: "folder icon",
      className: "w-6 h-6 object-contain",
    });

    expect(image.getAttribute("src")).toContain("folder");
    expect(image.getAttribute("alt")).toBe("folder icon");
    expect(image.getAttribute("class") ?? "").toContain("w-6");
    expect(image.getAttribute("class") ?? "").toContain("h-6");
    expect(image.getAttribute("class") ?? "").toContain("object-contain");
  });
});
