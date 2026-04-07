import { describe, expect, it } from "vitest";

import * as UI from "./index";

describe("@windows/ui root export", () => {
  it("Taskbar canonical contract를 노출하고 TaskbarStart* legacy export는 alias 없이 제거한다", () => {
    expect(UI).toHaveProperty("Taskbar");
    expect(UI).toHaveProperty("TaskbarSearch");
    expect(UI).toHaveProperty("TaskbarIconButton");
    expect(UI).toHaveProperty("TaskbarClock");
    expect(UI).toHaveProperty("TaskbarSearchPanel");
    expect(UI).toHaveProperty("TaskbarHoverPanel");
    expect(UI).toHaveProperty("TaskbarContextMenu");
    expect(UI).not.toHaveProperty("TaskbarStartButton");
    expect(UI).not.toHaveProperty("TaskbarStartPanel");
  });
});
