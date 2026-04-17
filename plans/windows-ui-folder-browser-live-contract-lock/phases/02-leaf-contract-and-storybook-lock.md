# Phase 2. 리프 계약과 Storybook 인벤토리 잠금

> 이 문서는 `packages/ui`의 `WindowFrame`, `Folder`, `Browser`, windows Storybook source를 하나의 live-aligned contract로 잠그는 실행용 상세 계약이다.
> prop naming, state winner rule, exact story recipient, canonical compare inventory를 이 phase에서 먼저 닫아야 later compare와 materialize가 추측 없이 따라올 수 있다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | `WindowFrame` generic shell, `Folder` controlled one-level sidebar contract, `Browser` slot contract, exact Storybook recipient와 canonical 4-state inventory를 `packages/ui` source에서 동시에 잠근다. |
| 선행조건 | Phase 1에서 canonical 4-state baseline과 viewport policy가 먼저 고정돼 있어야 한다. |
| 완료 판단 | source, fixtures, stories, inventory test를 함께 읽으면 exact prop names, exact story IDs, canonical 4-state compare scope, review-only story boundary가 모두 같은 언어로 드러난다. |
| 중단 조건 | `Folder`에 internal fallback state나 first-row auto-select를 남겨야 하거나, `Browser`에 `children` 외 article/not-found public prop를 추가해야만 scope를 만족한다면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/index.tsx` | 조정 | `WindowFrame`는 internal-only generic shell이다. title, icon, read-only focusable address surface, window controls, body slot만 소유한다. | editable input state, leaf-specific sidebar/article props, route-aware chrome prop가 이 파일에 추가되지 않는다. |
| `packages/ui/src/components/windows/folder/index.tsx` | 교체 | `Folder` canonical public props는 `title`, `icon?`, `addressLabel`, `sidebarItems`, `activeSidebarId?`, `expandedSidebarIds?`, `entries`, `onSidebarSelect?`, `onSidebarToggle?`, `onEntryOpen?`다. | controlled prop naming과 winner rule이 source에 드러나고 `navigationItems`, `activeNavigationId`, first-row fallback, persistent entry selected state가 사라진다. |
| `packages/ui/src/components/windows/browser/index.tsx` | 조정 | `Browser` canonical public props는 `title`, `icon?`, `addressLabel`, `children`뿐이다. article composition은 host의 `children`이 소유한다. | `variant`, slug, not-found prop, editable address API가 생기지 않는다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.ts` | 교체 | `Folder` fixture는 canonical compare state 2개와 review-only support state를 같은 파일에서 역할별로 분리한다. | `thumbnailSrc` winner, expanded-sidebar review fixture, no-selection review fixture가 분리돼 있고 compare state는 정확히 `desktop-blog`, `mobile-blog` 두 개다. |
| `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 교체 | `Browser` fixture는 canonical compare state 2개만 유지하고 article composition을 `children`으로 제공한다. | compare state는 `desktop-article`, `mobile-article`뿐이고 article body prop를 새로 열지 않는다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx` | 교체 | title은 `Windows/Folder` literal string이다. compare export는 `CompareDesktopBlog`, `CompareMobileBlog`만 canonical inventory에 속한다. review-only export는 compare root에 들어가지 않는다. | `windows-folder--compare-desktop-blog`, `windows-folder--compare-mobile-blog`, `windows-folder--sidebar-expanded-review`, `windows-folder--no-selection-review`를 file만 보고 유도할 수 있다. |
| `packages/ui/src/components/windows/browser/browser.stories.tsx` | 교체 | title은 `Windows/Browser` literal string이다. compare export는 `CompareDesktopArticle`, `CompareMobileArticle`만 canonical inventory에 속한다. | `windows-browser--compare-desktop-article`, `windows-browser--compare-mobile-article`를 file만 보고 유도할 수 있다. |
| `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx`, `packages/ui/src/components/windows/storybook/compareWindowStage.tsx` | 조정 | human-review stage와 machine-capture stage는 Phase 1 viewport policy를 그대로 따른다. compare stage는 decorative wrapper 없이 capture geometry만 제공한다. | review stage decoration이 contract 판단을 흐리지 않고 compare stage가 `1280x750`, `390x794` geometry를 유지한다. |
| `packages/ui/src/components/windows/storybook/assets/cover-blog-thumbnail.png`, `packages/ui/src/components/windows/storybook/assets/cover-article.png` | 조정 | live baseline에서 blocking visual drift인 thumbnail/cover ratio를 repo-local asset 수준에서 재현한다. | fixture가 같은 ratio asset을 쓰고 later compare가 ratio drift를 잡을 수 있다. |
| `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx` | 교체 | inventory test는 canonical compare story 4개만 positive signal로 검증한다. review-only story는 포함하지 않는다. | test가 `folder/desktop-blog`, `folder/mobile-blog`, `browser/desktop-article`, `browser/mobile-article`만 exact one `[data-visual-root]`로 검증한다. |

### 완료 증거

- `Folder` source가 controlled sidebar + `onEntryOpen` contract를 사용하고 first-row auto-select를 제거한다.
- `folder.stories.tsx`가 canonical compare export 2개와 review-only export 2개를 분리한다.
- `windowCompareInventory.test.tsx`가 canonical 4-state만 source-tree positive signal로 검증한다.

- owner_agent: `frontend-developer`
- 목적:
  - live baseline과 later compare가 따라야 할 exact `packages/ui` contract를 prop surface와 story recipient 수준에서 먼저 닫는다.
- boundary:
  - primary write target: `packages/ui/src/components/windows/internal/windowFrame/index.tsx`
  - primary write target: `packages/ui/src/components/windows/folder/index.tsx`
  - primary write target: `packages/ui/src/components/windows/browser/index.tsx`
  - primary write target: `packages/ui/src/components/windows/storybook/folderReferenceFixtures.ts`
  - primary write target: `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx`
  - primary write target: `packages/ui/src/components/windows/folder/folder.stories.tsx`
  - primary write target: `packages/ui/src/components/windows/browser/browser.stories.tsx`
  - primary write target: `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx`
  - primary write target: `packages/ui/src/components/windows/storybook/compareWindowStage.tsx`
  - primary write target: `packages/ui/src/components/windows/storybook/assets/cover-blog-thumbnail.png`
  - primary write target: `packages/ui/src/components/windows/storybook/assets/cover-article.png`
  - primary write target: `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx`
  - read-only prerequisite: `plans/windows-ui-folder-browser-live-contract-lock/reference-captures/baseline-inventory.md`
  - read-only prerequisite: `.claude/rules/storybook.md`
  - read-only prerequisite: `.claude/CLAUDE.md`
  - read-only prerequisite: `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`
- input:
  - 시나리오: maintainer가 `packages/ui`의 `Folder` / `Browser` leaf를 live-aligned contract로 다시 잠그고, Storybook inventory와 exact compare recipient를 고정하려는 경우
  - `WindowFrame` shell rule:
    - internal-only generic shell
    - title, icon, read-only focusable address surface, window controls, body slot만 소유
  - `Folder` sidebar rule:
    - `sidebarItems` root row minimum shape는 `{ id, label, icon?: ReactNode, children?: { id, label }[] }`
    - 전체 sidebar row id는 한 tree 안에서 unique해야 한다.
    - `activeSidebarId`는 root/child 전체 row id 중 하나를 가리키며, prop이 없거나 어떤 row와도 일치하지 않으면 selected row는 없다.
    - `expandedSidebarIds`는 expandable root id 집합만 받으며 multi-expand를 허용한다.
    - `expandedSidebarIds`가 없거나 빈 배열이면 expanded root row는 없다.
    - root row는 children이 있어도 selectable이며 `onSidebarSelect(id)`를 받을 수 있다.
    - `onSidebarToggle(id, nextExpanded)`는 root row expand toggle만 소유한다.
  - `Folder` entry rule:
    - `entries` minimum shape는 `{ id, title, thumbnailSrc, metaLabel?: string, summary?: string }`
    - `thumbnailSrc`가 thumbnail winner field다.
    - entry interaction은 `onEntryOpen(id)`만 소유하고 selected entry state prop는 없다.
  - `Browser` rule:
    - public body contract는 `children`
    - article composition은 host concern
  - exact story recipient:
    - `Windows/Folder` canonical compare exports:
      - `CompareDesktopBlog` → `windows-folder--compare-desktop-blog`
      - `CompareMobileBlog` → `windows-folder--compare-mobile-blog`
    - `Windows/Folder` review-only exports:
      - `SidebarExpandedReview` → `windows-folder--sidebar-expanded-review`
      - `NoSelectionReview` → `windows-folder--no-selection-review`
    - `Windows/Browser` canonical compare exports:
      - `CompareDesktopArticle` → `windows-browser--compare-desktop-article`
      - `CompareMobileArticle` → `windows-browser--compare-mobile-article`
- output:
  - 공개 계약:
    - `Folder` public prop names는 `title`, `icon?`, `addressLabel`, `sidebarItems`, `activeSidebarId?`, `expandedSidebarIds?`, `entries`, `onSidebarSelect?`, `onSidebarToggle?`, `onEntryOpen?`다.
    - `Folder` selected sidebar winner rule은 `activeSidebarId` exact match만 허용하고, prop absent/no-match면 no-selection이다.
    - `Folder` expanded sidebar winner rule은 `expandedSidebarIds`의 root id 집합만 사용하며 multi-expand를 허용한다. prop absent/empty면 no-expanded 상태다.
    - `Browser` public prop names는 `title`, `icon?`, `addressLabel`, `children`뿐이다.
    - canonical compare inventory는 exact four-state key와 exact compare story ID를 가진다.
  - 내부 기본값:
    - `WindowFrame` address bar는 read-only focusable surface이며 hover/focus/pressed visual response만 internal chrome으로 가진다.
    - review-only story는 `Windows/Folder` 아래에 둘 수 있지만 `CompareRoot`나 inventory test에 포함되지 않는다.
  - 중요한 negative output:
    - `Folder`에서 first-row auto-select fallback을 다시 열지 않는다.
    - `Folder` public API에 internal uncontrolled state를 숨겨 넣지 않는다.
    - `Folder` public API에 persistent selected entry state를 추가하지 않는다.
    - `Browser` public API에 article/not-found 전용 prop를 추가하지 않는다.
    - `Windows/Components/*`, `Search/Components/*`, `Context/Compose/*` 같은 legacy taxonomy를 재도입하지 않는다.
- 선행조건:
  - Phase 1 baseline inventory가 canonical 4-state와 viewport policy를 고정했어야 한다.
- 제약:
  - canonical compare inventory는 exact four-state key를 유지해야 한다.
  - `Folder` support-only review story는 compare inventory를 다시 열지 않아야 한다.
  - `compareRoot`의 `kind="folder" | "browser"` surface는 read-only prerequisite로 취급하고 새 kind를 도입하지 않는다.
- side effects:
  - Phase 3 capture script가 exact story IDs를 그대로 사용할 수 있다.
  - `plan-materialize`가 prop naming과 winner rule을 추측하지 않고 테스트 소유 경계를 잡을 수 있다.
- failure/validation:
  - `Folder`가 controlled contract와 internal fallback contract를 동시에 열면 canonical surface singularity가 깨지므로 blocker다.
  - `activeSidebarId` absent/no-match를 first-row fallback으로 처리하면 user-confirmed no-selection policy를 어기므로 blocker다.
  - support-only review story가 compare inventory나 inventory test에 들어가면 canonical acceptance scope가 흔들리므로 blocker다.
  - `Browser` fidelity를 맞추려면 `children` 외 public article prop가 필요하다는 결론이 나오면 scope를 벗어나므로 blocker다.
- 작업:
  - `WindowFrame` generic shell과 address bar ownership을 다시 잠근다.
  - `Folder` public prop surface를 controlled tree-aware sidebar + compact thumbnail entry contract로 교체한다.
  - `Browser`는 slot-driven contract를 유지한 채 chrome/article host를 정리한다.
  - fixture와 story export를 exact title/export/ID 기준으로 고정하고 review-only story를 분리한다.
  - inventory test를 canonical compare state 4개만 검증하도록 바꾼다.
- 검증:
  - [ ] `pnpm --filter @windows/ui exec vitest run src/components/windows/storybook/windowCompareInventory.test.tsx`가 성공한다.
  - [ ] `pnpm --filter @windows/ui build-storybook`가 성공한다.
  - [ ] `packages/ui/src/components/windows/folder/index.tsx`를 열었을 때 `sidebarItems`, `activeSidebarId`, `expandedSidebarIds`, `entries`, `onSidebarSelect`, `onSidebarToggle`, `onEntryOpen` naming이 output과 같은 이름으로 보인다.
  - [ ] `packages/ui/src/components/windows/folder/folder.stories.tsx`를 열었을 때 canonical compare export 2개와 review-only export 2개가 분리돼 있고 review-only export는 `CompareRoot`를 감싸지 않는다.
