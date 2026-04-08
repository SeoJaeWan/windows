# Phase 2. reference scene 올리기

> 이 문서는 실행 계약이다. `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위와 완료 조건을 바꾸지 않는다.

- owner_agent: `frontend-developer`
- 목적: Storybook가 canonical shell, compare shell, standalone surface를 package-owned sandbox로 보여주게 한다.
- boundary:
  - `packages/ui/src/components/taskbar/**/*.stories.tsx`
  - `packages/ui/src/components/taskbar/storybook/**`
- input:
  - `plans/windows-taskbar-work-02-composite-assembly/phases/02-composite-surface.md`의 공식 composite owner surface
  - `plans/windows-taskbar-work-03-reference-visuals/phases/02-panel-visuals.md`의 package-owned visual grammar
  - `plans/windows-taskbar-work-04-storybook-sandbox/phases/01-storybook-contract.md`의 Storybook 실행 경로
- output:
  - 공개 계약:
    - `Taskbar/Reference Shell` story는 `entries/icons/windows/search/clock` 데이터만으로 canonical `windows.view="pinned"` + `search.view="default"` 화면을 보여준다.
    - `Taskbar/Projection States` story는 같은 registry로 `windows.view="all"` + `search.view="results"` 비교 화면을 보여준다.
    - `Taskbar/Standalone Surfaces` story는 `TaskbarSearch`, `TaskbarIconButton`, `TaskbarClock`, `TaskbarSearchPanel`, `TaskbarHoverPanel`, `TaskbarContextMenu`를 package-owned card stage에서 보여준다.
    - stable marker `taskbar-story-canonical`, `taskbar-story-compare`, `taskbar-story-standalone`가 story owner surface에 존재한다.
  - 내부 기본값:
    - fixture와 stage helper는 package-local story helper가 소유한다.
    - `plans/windows-taskbar-work-05-web-sandbox-retirement/phases/01-remove-route-owner.md`는 이 story surface를 replacement owner로 사용하고, app/web route 제거 자체는 그 별도 plan이 맡는다.
  - 허용하지 않는 상태:
    - raw ReactNode slot이나 `TaskbarStart*` 조합으로 reference surface를 다시 만드는 구조
    - app/web wallpaper, route wrapper, preview-only CSS selector가 있어야만 reference story가 성립하는 구조
- 선행조건: `plans/windows-taskbar-work-04-storybook-sandbox/phases/01-storybook-contract.md`가 `packages/ui` 소유 Storybook script/devDependency/config와 app/web-independent 실행 경로를 제공한 상태
- 제약:
  - interaction runtime, route navigation, persisted browser state는 추가하지 않는다.
  - story helper는 package-local fixture와 stage chrome만 소유한다.
  - app/web route retirement와 route-local test 제거는 이 phase 범위 밖이고 별도 retirement plan이 맡는다.
- failure/validation: Storybook가 replacement sandbox인데도 app/web route나 legacy start surface를 다시 요구하면 실패다.
- 작업:
  - canonical shell, compare shell, standalone surface story를 추가한다.
  - story fixture와 marker를 package-local helper로 정리한다.
  - replacement sandbox가 별도 app/web route 정리 plan의 선행조건으로 바로 사용될 수 있도록 stage chrome을 package 안에서 닫는다.
- 검증:
  - [ ] `pnpm --filter @windows/ui test`
  - [ ] `pnpm --filter @windows/ui build-storybook`
  - [ ] `rg -n "TaskbarStartButton|TaskbarStartPanel|sandbox/taskbar" .\\packages\\ui\\.storybook .\\packages\\ui\\src\\components\\taskbar` 결과에 replacement sandbox가 legacy route나 start-specific assembly를 요구하는 흔적이 없다.
  - [ ] Storybook 안에서 `taskbar-story-canonical`, `taskbar-story-compare`, `taskbar-story-standalone` marker를 가진 surface가 보인다.
