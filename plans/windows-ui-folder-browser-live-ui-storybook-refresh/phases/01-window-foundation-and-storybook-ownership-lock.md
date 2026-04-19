# Phase 1. WindowFrame 공통 shell과 windows storybook 소유권 고정

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| owner_agent | `frontend-developer` |
| 목적 | `WindowFrame`를 공통 shell owner로 고정하고 windows storybook compare/review/helper 구조를 windows 내부에서 닫는다. |
| boundary | `packages/ui/src/components/windows/internal/windowFrame/index.tsx`, `packages/ui/src/components/windows/storybook/**`, `packages/ui/src/components/windows/folder/folder.stories.tsx`, `packages/ui/src/components/windows/browser/browser.stories.tsx` |
| input | 현재 windows storybook은 taskbar compare helper 의존과 분산된 stage ownership 때문에 windows 내부만 읽어서는 compare/review 구조를 바로 이해하기 어렵다. |
| output | local `windowCompareRoot`, `[data-window-compare-stage]` owner, `Windows/Compose/*` story title, windows 내부 helper import 구조가 고정된다. |
| 작업 | `WindowFrame` marker strip 정리, windows compare/review stage 정리, taskbar helper 제거, folder/browser story meta 정리를 같은 foundation 경계에서 수행한다. |
| 검증 | 아래 완료 증거 체크리스트를 완료한다. |

## 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/index.tsx` | compare marker strip와 chrome/body boundary를 `WindowFrame` owner 기준으로 정리한다. | shell marker와 chrome/body 경계가 `WindowFrame` 공통 shell 계약으로 읽힌다. | windows inventory tests가 통과한다. |
| `packages/ui/src/components/windows/storybook/windowCompareRoot.tsx` | windows 내부 compare marker owner를 만든다. | `data-visual-*` marker owner가 windows storybook 안에 고정된다. | windows inventory tests가 통과한다. |
| `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx` | reference stage를 windows 기준 구조로 정리한다. | reference stage가 windows storybook 안에서 완결된 구조로 읽힌다. | storybook build가 통과한다. |
| `packages/ui/src/components/windows/storybook/compareWindowStage.tsx` | current capture host를 `[data-window-compare-stage]` 기준으로 고정한다. | current capture owner가 windows 전용 contract로 고정된다. | storybook build가 통과한다. |
| `packages/ui/src/components/windows/storybook/windowReviewRoot.tsx` | review stage와 compare/review helper 경계를 windows 내부로 맞춘다. | review root가 compare helper와 같은 windows storybook 구조에서 읽힌다. | storybook build가 통과한다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx` | `Windows/Compose/Folder` title과 local helper import로 meta를 정리한다. | Folder stories가 windows-owned helper 구조를 따른다. | storybook build와 import 점검을 통과한다. |
| `packages/ui/src/components/windows/browser/browser.stories.tsx` | `Windows/Compose/Browser` title과 local helper import로 meta를 정리한다. | Browser stories가 windows-owned helper 구조를 따른다. | storybook build와 import 점검을 통과한다. |

## 완료 증거

- [ ] `pnpm --filter @windows/ui exec vitest run src/components/windows/storybook/windowCompareInventory.test.tsx src/components/windows/storybook/windowReviewInventory.test.tsx`
- [ ] `pnpm --filter @windows/ui build-storybook`
- [ ] `rg -n "taskbar/storybook/compareRoot" packages/ui/src/components/windows` 결과가 비어 있다.
- [ ] windows story title이 `Windows/Compose/Folder`, `Windows/Compose/Browser`로 고정되어 이후 phase의 exact story ID 기반이 유지된다.
- [ ] `WindowFrame` shell marker strip와 windows compare helper ownership을 windows 패키지 내부만 읽어도 이해할 수 있다.
- [ ] windows storybook에 taskbar compare helper import가 남아 있지 않다.
- [ ] foundation 구조를 기준으로 이후 phase가 exact story ID를 고정할 수 있다.
