import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";

import {
  ReviewLongTitle as FolderLongTitleReview,
  ReviewLongAddress as FolderLongAddressReview,
  ReviewNoChips as NoChipsReview,
} from "../folder/folder.stories";
import {
  LongTitleReview as BrowserLongTitleReview,
  LongAddressReview as BrowserLongAddressReview,
  EmptyDropdownItemsReview,
} from "../browser/browser.stories";
import {
  LONG_TITLE_TEXT as FOLDER_LONG_TITLE_TEXT,
  LONG_ADDRESS_LABEL_TEXT as FOLDER_LONG_ADDRESS_TEXT,
} from "../storybook/folderReferenceFixtures";
import {
  LONG_TITLE_TEXT as BROWSER_LONG_TITLE_TEXT,
  LONG_ADDRESS_LABEL_TEXT as BROWSER_LONG_ADDRESS_TEXT,
  ARTICLE_DROPDOWN_ITEMS,
} from "../storybook/browserReferenceFixtures";

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

type StoryWithRender = { render: () => React.ReactNode };

/* ── Review marker contract ─────────────────────────────────────── */

describe("windowReviewInventory — review marker contract", () => {
  const reviewCases: { story: StoryWithRender; kind: string; state: string }[] = [
    { story: FolderLongTitleReview as unknown as StoryWithRender, kind: "folder", state: "long-title" },
    { story: FolderLongAddressReview as unknown as StoryWithRender, kind: "folder", state: "long-address" },
    { story: NoChipsReview as unknown as StoryWithRender, kind: "folder", state: "no-chips" },
    { story: BrowserLongTitleReview as unknown as StoryWithRender, kind: "browser", state: "long-title" },
    { story: BrowserLongAddressReview as unknown as StoryWithRender, kind: "browser", state: "long-address" },
    { story: EmptyDropdownItemsReview as unknown as StoryWithRender, kind: "browser", state: "empty-dropdown-items" },
  ];

  reviewCases.forEach(({ story, kind, state }) => {
    it(`${kind}/${state} — [data-window-review-root]가 정확히 하나이고 kind/state pair가 일치한다`, () => {
      render(createElement(() => story.render() as React.ReactElement));

      const reviewRoots = container.querySelectorAll("[data-window-review-root]");
      expect(reviewRoots).toHaveLength(1);

      const reviewRoot = reviewRoots[0]!;
      expect(reviewRoot.getAttribute("data-window-review-kind")).toBe(kind);
      expect(reviewRoot.getAttribute("data-window-review-state")).toBe(state);
    });
  });
});

/* ── Edge invariants ────────────────────────────────────────────── */

describe("windowReviewInventory — long-title invariants", () => {
  it("windows-folder--long-title-review는 exact long-title fixture text를 렌더한다", () => {
    render(createElement(() => (FolderLongTitleReview as unknown as StoryWithRender).render() as React.ReactElement));

    const text = container.textContent ?? "";
    expect(text).toContain(FOLDER_LONG_TITLE_TEXT);
  });

  it("windows-browser--long-title-review는 exact long-title fixture text를 렌더한다", () => {
    render(createElement(() => (BrowserLongTitleReview as unknown as StoryWithRender).render() as React.ReactElement));

    const text = container.textContent ?? "";
    expect(text).toContain(BROWSER_LONG_TITLE_TEXT);
  });
});

describe("windowReviewInventory — long-address invariants", () => {
  it("windows-folder--long-address-review는 exact long-address fixture text를 렌더한다", () => {
    render(createElement(() => (FolderLongAddressReview as unknown as StoryWithRender).render() as React.ReactElement));

    const text = container.textContent ?? "";
    expect(text).toContain(FOLDER_LONG_ADDRESS_TEXT);
  });

  it("windows-browser--long-address-review는 exact long-address fixture text를 렌더한다", () => {
    render(createElement(() => (BrowserLongAddressReview as unknown as StoryWithRender).render() as React.ReactElement));

    const text = container.textContent ?? "";
    expect(text).toContain(BROWSER_LONG_ADDRESS_TEXT);
  });
});

describe("windowReviewInventory — zero-item invariants", () => {
  it("windows-folder--no-chips-review는 chip activator count가 0이다", () => {
    render(createElement(() => (NoChipsReview as unknown as StoryWithRender).render() as React.ReactElement));

    const chips = container.querySelectorAll("[data-folder-chip]");
    expect(chips).toHaveLength(0);
  });

  it("windows-browser--empty-dropdown-items-review는 open 상태에서 dropdown item count가 0이다", () => {
    render(createElement(() => (EmptyDropdownItemsReview as unknown as StoryWithRender).render() as React.ReactElement));

    // Open the address dropdown by clicking the address bar
    const addressBar = container.querySelector<HTMLButtonElement>(".browser-address");
    expect(addressBar).not.toBeNull();
    act(() => {
      addressBar!.click();
    });

    // No dropdown items should be rendered (addressDropdownItems=[])
    const dropdownItems = container.querySelectorAll("[data-browser-dropdown-item]");
    expect(dropdownItems).toHaveLength(0);
  });

  it("ARTICLE_DROPDOWN_ITEMS fixture는 3개 항목을 가진다 (empty와 non-empty 대조 anchor)", () => {
    // Sanity check: the non-empty fixture used in compare stories has items
    expect(ARTICLE_DROPDOWN_ITEMS).toHaveLength(3);
  });
});
