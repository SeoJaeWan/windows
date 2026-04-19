# Phase 5. drift 정리와 storybook 최종 polish

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| owner_agent | `frontend-developer` |
| 목적 | phase 4 compare 증거를 기준으로 windows 범위 안에서 남은 drift를 정리하고 최종 storybook 구조를 마감한다. |
| boundary | `packages/ui/src/components/windows/**`, `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx`, `packages/ui/src/components/windows/storybook/windowReviewInventory.test.tsx`, `plans/windows-ui-folder-browser-live-ui-storybook-refresh/visual-compare/**` |
| input | phase 4의 mismatch key와 drift 분류, phase 1~3에서 잠근 public surface와 exact story ID가 준비되어 있어야 한다. |
| output | windows 범위 안에서 drift가 정리되고 final compare, windows inventory tests, storybook build를 다시 통과하는 마감 상태가 된다. |
| 작업 | phase 4 report가 가리킨 drift를 windows 범위 안에서만 정리하고, stories/fixtures/inventory를 다시 잠근 뒤, final compare와 build 검증을 재실행한다. |
| 검증 | 아래 완료 증거 체크리스트를 완료한다. |

## 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/**` | phase 4 report가 가리킨 drift를 windows 범위 안에서만 정리한다. | 남은 shell/card/chrome drift가 windows 패키지 안에서 마감된다. | final compare를 통과한다. |
| `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx` | 최종 compare story ID와 state key drift를 다시 잠근다. | final rerun 이후 compare inventory contract가 흔들리지 않는다. | windows inventory tests가 통과한다. |
| `packages/ui/src/components/windows/storybook/windowReviewInventory.test.tsx` | 최종 review story invariant를 다시 잠근다. | final rerun 이후 review inventory contract가 흔들리지 않는다. | windows inventory tests가 통과한다. |
| `plans/windows-ui-folder-browser-live-ui-storybook-refresh/visual-compare/report.md` | final rerun 결과로 compare report를 갱신한다. | 최종 상태를 사람이 읽을 수 있는 compare 문서가 남는다. | compare report 점검을 통과한다. |
| `plans/windows-ui-folder-browser-live-ui-storybook-refresh/visual-compare/diff-results.json`, `plans/windows-ui-folder-browser-live-ui-storybook-refresh/visual-compare/*.png` | final rerun의 diff data와 이미지를 갱신한다. | 최종 acceptance를 뒷받침하는 구조화 데이터와 이미지 증거가 남는다. | compare report 점검을 통과한다. |

## 완료 증거

- [ ] drift 수정은 계속 `packages/ui/src/components/windows/**` 안에서만 수행된다.
- [ ] `pnpm --filter @windows/ui exec vitest run src/components/windows/storybook/windowCompareInventory.test.tsx src/components/windows/storybook/windowReviewInventory.test.tsx`
- [ ] `pnpm --filter @windows/ui build-storybook`
- [ ] phase 4 compare를 재실행한 뒤 final report와 diff artifacts가 갱신된다.
- [ ] `rg -n "taskbar/storybook/compareRoot" packages/ui/src/components/windows` 결과가 계속 비어 있다.
- [ ] windows 범위 밖으로 drift 수정이 번지지 않는다.
- [ ] final compare, windows inventory tests, storybook build가 모두 다시 통과한다.
- [ ] windows-owned helper 구조와 exact story ID 계약이 최종 상태에서도 유지된다.
