/**
 * @windows/ui root entry — consumer import proof
 *
 * Role: positive proof that `Folder` and `Browser` are importable from
 * the `@windows/ui` package root entry (`packages/ui/src/index.ts`).
 *
 * This test closes the EXPORT-VALIDATION-THIN finding by providing a
 * consumer-side symbol resolution proof — not just a source inspection or
 * build-storybook artifact.
 *
 * What this owner locks:
 *   - `Folder` is a named export from `@windows/ui` and is a function
 *   - `Browser` is a named export from `@windows/ui` and is a function
 *   - No `WindowFrame` public export exists (internal-only boundary)
 *
 * What this owner does NOT lock:
 *   - Exhaustive root export inventory (not a durable contract)
 *   - Unrelated existing exports (they are maintained, not audited here)
 *
 * Convention: describe/it text is Korean; symbol names stay in English.
 */

import { describe, it, expect } from "vitest";

// Positive proof: import directly from the @windows/ui root entry alias.
// tsconfig.json maps @windows/ui → ./src/index.ts.
import * as WindowsUI from "@windows/ui";

describe("@windows/ui root entry — Folder export", () => {
  it("Folder가 named export로 존재한다", () => {
    expect("Folder" in WindowsUI).toBe(true);
  });

  it("Folder가 함수다 (컴포넌트 symbol resolution 증거)", () => {
    expect(typeof WindowsUI.Folder).toBe("function");
  });

  it("Folder를 직접 import할 수 있다 (consumer-side proof)", () => {
    const { Folder } = WindowsUI;
    expect(Folder).toBeDefined();
    expect(typeof Folder).toBe("function");
  });
});

describe("@windows/ui root entry — Browser export", () => {
  it("Browser가 named export로 존재한다", () => {
    expect("Browser" in WindowsUI).toBe(true);
  });

  it("Browser가 함수다 (컴포넌트 symbol resolution 증거)", () => {
    expect(typeof WindowsUI.Browser).toBe("function");
  });

  it("Browser를 직접 import할 수 있다 (consumer-side proof)", () => {
    const { Browser } = WindowsUI;
    expect(Browser).toBeDefined();
    expect(typeof Browser).toBe("function");
  });
});

describe("@windows/ui root entry — boundary 검증", () => {
  it("WindowFrame은 public export가 아니다 (internal-only boundary)", () => {
    // WindowFrame은 windows family의 internal shared shell이다.
    // packages/ui 경계 밖으로 노출하면 안 된다.
    expect("WindowFrame" in WindowsUI).toBe(false);
  });

  it("Folder와 Browser가 동시에 import 가능하다 (root entry 단일 소비 증거)", () => {
    const { Folder, Browser } = WindowsUI;
    expect(typeof Folder).toBe("function");
    expect(typeof Browser).toBe("function");
  });
});
