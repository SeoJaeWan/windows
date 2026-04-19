# Phase 3. Browser chrome parity와 address prop surface 재정의

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| owner_agent | `frontend-developer` |
| 목적 | Browser를 windows frame/chrome parity 대상으로 다시 고정하고 address open/value UI를 prop surface로 드러낸다. |
| boundary | `packages/ui/src/components/windows/browser/index.tsx`, `packages/ui/src/components/windows/browser/browser.stories.tsx`, `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx`, `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx`, `packages/ui/src/components/windows/storybook/windowReviewInventory.test.tsx` |
| input | Browser는 현재 address 열림과 표시 상태가 내부 state와 story 조작에 기대고 있어서 controlled UI surface와 body boundary가 한 번에 읽히지 않는다. |
| output | `addressDropdownOpen?`, `onAddressDropdownOpenChange?`, `addressValue?`, `onAddressValueChange?`가 additive contract로 고정되고, `children` body slot 유지와 `addressLabel` fallback 규칙이 명시된다. |
| 작업 | Browser chrome을 parity 범위로 재정의하고, address open/value UI를 prop + callback surface로 드러내며, `children` body slot과 exact story ID inventory를 함께 잠근다. |
| 검증 | 아래 완료 증거 체크리스트를 완료한다. |

## 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/browser/index.tsx` | address open/value controlled prop contract와 `children` body boundary를 명시한다. | Browser chrome parity 범위와 body slot 계약이 컴포넌트 수준에서 읽힌다. | inventory tests가 통과한다. |
| `packages/ui/src/components/windows/browser/browser.stories.tsx` | compare/review stories를 explicit args 기반으로 재작성하고 address-open UI를 prop surface로 보여준다. | address-open UI가 story 조작이 아니라 prop surface로 드러난다. | storybook build가 통과한다. |
| `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | `browser/desktop-chrome`, `browser/desktop-address-open`, `browser/mobile-chrome` compare fixture와 review fixture를 정리한다. | Browser fixture가 chrome parity와 `children` body 경계를 직접 보여준다. | story inventory 점검을 통과한다. |
| `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx` | Browser compare story ID 3개를 exact literal로 잠근다. | compare inventory가 새 address contract를 정확히 반영한다. | windows inventory tests가 통과한다. |
| `packages/ui/src/components/windows/storybook/windowReviewInventory.test.tsx` | `review-long-title`, `review-long-address`, `review-empty-dropdown` review invariant를 잠근다. | review inventory가 Browser chrome/address surface 기준을 유지한다. | windows inventory tests가 통과한다. |

## 완료 증거

- [ ] `Browser` public surface에 `addressDropdownOpen?`, `onAddressDropdownOpenChange?`, `addressValue?`, `onAddressValueChange?`가 additive하게 반영된다.
- [ ] `addressLabel`은 `addressValue`가 없을 때만 fallback으로 동작하고, Browser body는 계속 host `children` slot이다.
- [ ] compare story ID가 `windows-compose-browser--compare-desktop-chrome`, `windows-compose-browser--compare-desktop-address-open`, `windows-compose-browser--compare-mobile-chrome`로 고정된다.
- [ ] review story ID가 `windows-compose-browser--review-long-title`, `windows-compose-browser--review-long-address`, `windows-compose-browser--review-empty-dropdown`로 고정된다.
- [ ] dropdown 선택은 실제 URL 이동이나 body 교체를 일으키지 않는다.
- [ ] `pnpm --filter @windows/ui exec vitest run src/components/windows/storybook/windowCompareInventory.test.tsx src/components/windows/storybook/windowReviewInventory.test.tsx`
- [ ] `pnpm --filter @windows/ui build-storybook`
- [ ] Browser parity 범위가 windows frame/chrome으로만 읽힌다.
- [ ] Browser body는 계속 host `children` slot으로 남는다.
- [ ] address open/value UI와 review inventory가 exact story ID 기준으로 잠겨 있다.
