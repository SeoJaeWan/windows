# plan-materialize

## Action 1

- boundary: `Taskbar` public API의 boundary-contract / outcome-selection / final-interpretation 경계
- scenario contract summary:
  - scenario: consumer가 `Taskbar`를 `entries`, `icons`, `windows`, `search`, `clock` data props로 렌더링한다.
  - inputs: `entries` 필수, `icon.category`, `windows.view`, `search.view`, `search.value`, optional metadata fallback
  - must happen: canonical shell, static windows/search surface, `visible/searchable=true`, `pinned/recommended/featured=false` fallback, reserved `windows` launcher 유지
  - must not happen: raw `startButton/search/items/clock` slot contract 의존, 기본 비노출 entry의 pinned surface 포함, `searchable=false` entry의 results surface 포함
- risk pattern summary: explicit `windows.view`/`search.view`가 fallback보다 우선하고, `search.value`는 `search.view` 미지정 시 results winner가 된다.
- test type: `unit`
- action: `update`
- target file: `packages/ui/src/components/taskbar/taskbar/taskbar.test.tsx`
- reason: 기존 파일이 `Taskbar` public boundary를 이미 소유하고 있어 modify-first가 맞다.
- canonical contract: `Taskbar`는 `entries/icons/windows/search/clock` data props만으로 canonical shell과 static surface를 렌더링한다.
- rejected sibling candidates: raw `startButton/search/items/clock`, public `pinnedIds`/`allIds`, `entry.type.name`

## Action 2

- boundary: `@windows/ui` root export boundary-contract
- scenario contract summary:
  - scenario: consumer가 root entry에서 canonical export surface를 import한다.
  - inputs: `packages/ui/src/index.ts`
  - must happen: `Taskbar`, `TaskbarSearch`, `TaskbarIconButton`, `TaskbarClock`, panel exports 유지
  - must not happen: `TaskbarStartButton`, `TaskbarStartPanel` legacy alias 잔존
- risk pattern summary: 없음
- test type: `unit`
- action: `create`
- target file: `packages/ui/src/index.test.ts`
- reason: root export contract를 직접 소유하는 기존 테스트 파일이 없다.
- canonical contract: `windows` naming이 root export winner다.
- rejected sibling candidates: legacy `TaskbarStart*` export alias

## Action 3

- boundary: package-level visual shell의 frontend user-visible 확인
- scenario contract summary:
  - scenario: reference-style shell이 실제 bounded surface에서 검증돼야 한다.
  - inputs: `/sandbox/taskbar` owner route
  - must happen: route-owned bounded surface에서 canonical state가 드러나야 한다.
  - must not happen: package plan 안에서 별도 cross-route E2E를 새로 도입한다.
- risk pattern summary: 없음
- test type: `defer`
- action: `defer`
- target file: `apps/web/src/app/sandbox/taskbar/**`
- reason: bounded-surface owner route는 downstream [plan.md](C:/Users/USER/Desktop/dev/windows/plans/windows-taskbar-02-web-reference-stage/plan.md)에서 직접 materialize 하는 것이 canonical이다.
- canonical contract: route surface E2E는 `windows-taskbar-02-web-reference-stage`가 소유한다.
- rejected sibling candidates: package-only Playwright spec, cross-route guard E2E
