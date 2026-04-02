import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Icon from "./index";

describe("Icon", () => {
  it("src가 주어지면 해당 이미지와 alt/className을 반영한다", () => {
    const html = renderToStaticMarkup(
      <Icon src="/icons/custom-file.png" alt="custom" className="w-8 h-8 rounded-md" />,
    );

    expect(html).toContain('src="/icons/custom-file.png"');
    expect(html).toContain('alt="custom"');
    expect(html).toContain("w-8 h-8 rounded-md");
  });

  it("kind='file'이면 file asset fallback을 사용한다", () => {
    const html = renderToStaticMarkup(
      <Icon kind="file" alt="file icon" className="w-6 h-6 object-contain" />,
    );

    expect(html).toContain("file");
    expect(html).toContain('alt="file icon"');
    expect(html).toContain("w-6 h-6 object-contain");
  });

  it("kind='folder'이면 folder asset fallback을 사용한다", () => {
    const html = renderToStaticMarkup(
      <Icon kind="folder" alt="folder icon" className="w-6 h-6 object-contain" />,
    );

    expect(html).toContain("folder");
    expect(html).toContain('alt="folder icon"');
    expect(html).toContain("w-6 h-6 object-contain");
  });
});
