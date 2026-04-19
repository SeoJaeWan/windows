# Phase 2. Folder live 카드와 search prop surface 재정의

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| owner_agent | `frontend-developer` |
| 목적 | Folder를 live 기준의 thumbnail + title 중심 카드로 다시 정리하고 search open/value UI를 prop surface로 고정한다. |
| boundary | `packages/ui/src/components/windows/folder/index.tsx`, `packages/ui/src/components/windows/folder/folder.stories.tsx`, `packages/ui/src/components/windows/storybook/folderReferenceFixtures.ts`, `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx`, `packages/ui/src/components/windows/storybook/windowReviewInventory.test.tsx` |
| input | Folder는 현재 storybook에서 DOM click harness로 search 열림 상태를 만들고 있고, 카드 surface도 보조 정보 비중이 커서 live-like visible winner가 흐리다. |
| output | `searchPanelOpen?`, `onSearchPanelOpenChange?`, `searchValue?`, `searchPlaceholder?`, `onSearchValueChange?`가 additive contract로 고정되고 `thumbnailSrc + title`이 canonical visible surface가 된다. |
| 작업 | Folder 카드 surface를 live 기준으로 정리하고, search open/value UI를 prop + callback surface로 드러내며, compare/review stories와 inventory를 exact ID로 잠근다. |
| 검증 | 아래 완료 증거 체크리스트를 완료한다. |

## 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/folder/index.tsx` | `thumbnailSrc + title` 중심 카드 surface와 controlled search UI prop contract를 구현 기준으로 잠근다. | Folder 카드의 visible winner와 search state ownership이 컴포넌트 계약으로 고정된다. | inventory tests가 통과한다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx` | compare/review stories를 explicit args 기반으로 재작성하고 DOM click harness를 제거한다. | search-open UI가 story 조작이 아니라 prop surface로 드러난다. | storybook build가 통과한다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.ts` | `folder/desktop-card`, `folder/desktop-search-open`, `folder/mobile-card` compare fixture와 review fixture를 prop-driven shape로 정리한다. | Folder fixture가 카드 winner와 search prop surface를 직접 보여준다. | story inventory 점검을 통과한다. |
| `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx` | Folder compare story ID 3개를 exact literal로 잠근다. | compare inventory가 새 카드/search contract를 고정한다. | windows inventory tests가 통과한다. |
| `packages/ui/src/components/windows/storybook/windowReviewInventory.test.tsx` | `review-long-title`, `review-long-address`, `review-no-chips` review invariant를 잠근다. | review inventory가 Folder surface 기준을 정확히 반영한다. | windows inventory tests가 통과한다. |

## 완료 증거

- [ ] `Folder` public surface에 `searchPanelOpen?`, `onSearchPanelOpenChange?`, `searchValue?`, `searchPlaceholder?`, `onSearchValueChange?`가 additive하게 반영된다.
- [ ] compare story ID가 `windows-compose-folder--compare-desktop-card`, `windows-compose-folder--compare-desktop-search-open`, `windows-compose-folder--compare-mobile-card`로 고정된다.
- [ ] review story ID가 `windows-compose-folder--review-long-title`, `windows-compose-folder--review-long-address`, `windows-compose-folder--review-no-chips`로 고정된다.
- [ ] chip 선택은 여전히 실제 filtering을 일으키지 않고, mobile card state는 닫힌 기준 surface만 canonical compare 대상으로 유지된다.
- [ ] `pnpm --filter @windows/ui exec vitest run src/components/windows/storybook/windowCompareInventory.test.tsx src/components/windows/storybook/windowReviewInventory.test.tsx`
- [ ] `pnpm --filter @windows/ui build-storybook`
- [ ] Folder canonical visible surface가 `thumbnailSrc + title`로 읽힌다.
- [ ] search open/value UI가 prop/callback surface로만 제어된다.
- [ ] compare/review inventory가 Folder의 exact story ID와 edge-state 계약을 유지한다.
