**Branch:** feat/windows-taskbar-02-ui-storybook-reference

> Worktree dir: `worktrees/windows-taskbar-02-ui-storybook-reference` (plan 폴더명과 동일)

# Windows Taskbar UI Storybook Reference 실행 계획

> 요청당 plan 파일은 하나만 생성하고, 실행 순서는 아래 `Phase`들로만 표현한다.
> 추가 top-level section은 사용자 요청이나 별도 정책 요구가 없는 한 넣지 않는다.

## 단계별 실행

### Phase 1

- owner_agent: `general-developer`
- 목적: `@windows/ui` 패키지 안에 package-owned Storybook 실행 계약을 열어, 더 이상 `apps/web`나 Next route 없이 taskbar reference surface를 띄우고 빌드할 수 있게 한다.
- boundary:
  - `packages/ui/package.json`
  - `packages/ui/.storybook/**`
  - `packages/ui/tsconfig.json`
- input: `plans/windows-taskbar-01-ui-reference-api/plan.md` Phase 4가 root export를 `Taskbar`, `TaskbarSearch`, `TaskbarIconButton`, `TaskbarClock`, `TaskbarSearchPanel`, `TaskbarHoverPanel`, `TaskbarContextMenu`만으로 닫고 package 밖 owner surface를 제거한 상태, 현재 repo에는 Storybook 스크립트나 config가 없고 `packages/ui/package.json`은 `test`만 가진 상태다.
- output:
  - 공개 계약:
    - package-owned reference surface의 canonical 실행 진입점은 `pnpm --filter @windows/ui storybook`과 `pnpm --filter @windows/ui build-storybook`이다.
    - Storybook config는 `packages/ui/.storybook/**`에만 존재하고 `@windows/ui` source를 직접 읽는다. `apps/web`, Next runtime, `/sandbox/taskbar` route는 prerequisite가 아니다.
    - Story discovery path는 `packages/ui/src/components/taskbar/**/*.stories.tsx`로 닫고, taskbar reference surface는 package source tree 안에서만 정의한다.
  - 내부 기본값:
    - Storybook tooling과 devDependency는 `packages/ui/package.json`이 소유한다.
    - root `package.json`, `turbo.json`, `apps/web/package.json`은 package-local Storybook 실행에 꼭 필요할 때만 건드리고, 기본 경로는 package-local script다.
  - 허용하지 않는 대안:
    - root `.storybook`나 `apps/web` route를 통해 reference surface를 다시 여는 구조
    - Storybook 실행을 `pnpm --filter @windows/web dev` 또는 Next-specific global/style contract에 의존시키는 구조
- 선행조건: `plans/windows-taskbar-01-ui-reference-api/plan.md` Phase 4가 package 밖 taskbar owner surface를 제거하고 canonical taskbar family export를 source-tree validation으로 닫은 상태
- 제약: 이번 phase는 tooling/bootstrap 경계다. taskbar stories 자체, visual grammar story harness, Storybook browser-runner 추가는 다음 phase가 소유한다.
- failure/validation: Storybook 실행 계약이 `@windows/ui` package 밖 파일이나 app/web runtime에 기대거나, package-local script 없이 ad hoc CLI invocation으로만 남으면 이 phase는 완료가 아니다.
- 작업:
  - `@windows/ui` package-local Storybook config와 script contract를 추가한다.
  - Storybook이 taskbar source tree를 직접 읽도록 path/config/TS contract를 정리한다.
  - package-local 실행이 가능한 최소 build/dev validation 경로를 고정한다.
- 검증:
  - [ ] `pnpm --filter @windows/ui build-storybook`
  - [ ] `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
  - [ ] `packages/ui/.storybook/**`와 `packages/ui/package.json`만으로 Storybook 실행 계약이 보이고 `apps/web` prerequisite가 남지 않는다.

### Phase 2

- owner_agent: `frontend-developer`
- 목적: 제거된 `app/web` preview를 대체할 package-owned taskbar reference stories와 stage harness를 `@windows/ui` 안에 다시 세운다.
- boundary:
  - `packages/ui/src/components/taskbar/**/*.stories.tsx`
  - `packages/ui/src/components/taskbar/**`
  - `packages/tailwind-config/src/theme.css`
  - `packages/tailwind-config/src/utilities.css`
- input: Phase 1의 package-local Storybook 계약, `plans/windows-taskbar-01-ui-reference-api/plan.md` Phase 1~2가 닫은 exact public contract와 package-owned visual grammar, 그리고 `/sandbox/taskbar` replacement owner surface를 이제 `@windows/ui`가 직접 가져야 한다는 합의
- output:
  - 공개 계약:
    - `Taskbar/Reference Shell` story는 bottom-anchored package-owned stage 안에서 `entries`, `icons`, `windows`, `search`, `clock` data props로 `windows.view='pinned'`, `search.view='default'` canonical shell을 렌더링한다.
    - `Taskbar/Projection States` story는 같은 registry를 사용해 `windows.view='all'`, `search.view='results'` compare surface를 렌더링한다.
    - `Taskbar/Standalone Surfaces` story는 `TaskbarSearch`, `TaskbarIconButton`, `TaskbarClock`, `TaskbarSearchPanel`, `TaskbarHoverPanel`, `TaskbarContextMenu` standalone public surface를 package-owned preview card로 보여준다.
  - 내부 기본값:
    - story stage chrome인 wallpaper, bottom anchor, compare card layout, fixture copy, stable `data-testid` marker는 story file 또는 package-local story helper가 소유한다.
    - `taskbar-story-canonical`, `taskbar-story-compare`, `taskbar-story-standalone` marker를 stable canvas contract로 둔다.
    - 모든 story는 같은 `entries/icons/windows/search/clock` reference dataset을 재사용하고, standalone story도 `TaskbarStart*` start-specific semantics를 재도입하지 않는다.
  - 허용하지 않는 대안:
    - raw ReactNode slot 조합이나 `TaskbarStart*` leaf 조합으로 reference surface를 다시 만드는 구조
    - `apps/web` globals, wallpaper route, preview-only wrapper가 있어야만 성립하는 stage
    - canonical shell과 compare surface가 서로 다른 registry나 다른 winner rule을 쓰는 구조
- 선행조건: Phase 1 완료
- 제약: 이번 phase는 docs/reference owner surface를 만드는 단계다. browser state, runtime store, outside click, panel interaction, cross-route journey는 도입하지 않는다.
- failure/validation: story가 package 밖 wrapper를 필요로 하거나, canonical shell과 compare surface가 exact public contract와 다른 registry/props를 쓰면 이 phase는 실패다.
- 작업:
  - taskbar reference shell, projection states, standalone surfaces를 package-owned stories로 만든다.
  - story stage chrome과 fixture data를 package-local helper로 정리해 app/web preview 역할을 완전히 대체한다.
  - reference stories가 `TaskbarStart*` 대신 canonical taskbar family와 standalone public surface만 소비하도록 정리한다.
- 검증:
  - [ ] `pnpm --filter @windows/ui test`
  - [ ] `pnpm --filter @windows/ui build-storybook`
  - [ ] `pnpm --filter @windows/ui storybook` 실행 후 `Taskbar/Reference Shell`, `Taskbar/Projection States`, `Taskbar/Standalone Surfaces` stories가 보이고 `taskbar-story-canonical`, `taskbar-story-compare`, `taskbar-story-standalone` marker가 유지된다.
  - [ ] story surface가 `entries/icons/windows/search/clock` exact contract와 standalone public surface만 소비하고 `TaskbarStart*` 또는 app/web wrapper를 요구하지 않는다.

### Phase 3

- owner_agent: `frontend-developer`
- 목적: Storybook owner surface를 package-only validation boundary로 마감해 이후 browser-runner나 docs/catalog 후속 작업이 이 surface를 다시 추측하지 않게 한다.
- boundary:
  - `packages/ui/package.json`
  - `packages/ui/.storybook/**`
  - `packages/ui/src/components/taskbar/**/*.stories.tsx`
- input: Phase 1의 Storybook tooling 계약, Phase 2의 taskbar owner stories, 현재 repo에 Storybook browser-runner나 story-specific E2E setup은 아직 없는 상태
- output:
  - 공개 계약:
    - `@windows/ui` Storybook은 taskbar reference owner surface의 유일한 package-owned review surface다.
    - owner surface의 primary validation boundary는 `pnpm --filter @windows/ui build-storybook`, `pnpm --filter @windows/ui test`, `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`이다.
    - Storybook owner surface는 docs/reference boundary이며 `apps/web`, root Playwright route, persisted browser state를 다시 prerequisite로 열지 않는다.
  - 내부 기본값:
    - Storybook story titles와 stable `data-testid` marker는 다음 browser-runner 또는 docs/catalog 후속 plan이 reuse할 수 있는 local prerequisite contract다.
    - root `pnpm test:e2e` entrypoint는 계속 존재하지만 이 plan은 Storybook용 새 browser-runner를 도입하지 않는다.
  - 허용하지 않는 대안:
    - Storybook owner surface를 열어놓고도 build/test/tsc 외에 무엇을 기준으로 성공인지 남겨두는 구조
    - route-based preview나 removed `/sandbox/taskbar` contract를 next prerequisite로 다시 참조하는 구조
- 선행조건: Phase 2 완료
- 제약: Storybook browser automation, visual snapshot runner, catalog/docs 확장, 추가 public surface 정리는 별도 후속 plan 범위다.
- failure/validation: Storybook owner surface가 package-only validation boundary로 닫히지 않거나, 다음 작업이 story title/marker와 validation contract를 다시 추측해야 하면 이 plan은 완료가 아니다.
- 작업:
  - Storybook owner surface의 stable title/marker와 build validation contract를 마감한다.
  - package-only 검토 경계가 `apps/web`나 root Playwright contract를 다시 필요로 하지 않도록 남은 coupling을 제거한다.
  - 다음 후속 plan이 browser-runner 또는 docs/catalog 확장을 package 경계 안에서 시작할 수 있도록 prerequisite를 명시적으로 닫는다.
- 검증:
  - [ ] `pnpm --filter @windows/ui test`
  - [ ] `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
  - [ ] `pnpm --filter @windows/ui build-storybook`
  - [ ] `rg -n "sandbox/taskbar|TaskbarStartButton|TaskbarStartPanel" .\\packages\\ui\\.storybook .\\packages\\ui\\src\\components\\taskbar` 결과에 removed app/web route contract나 retired start-specific public assembly가 story owner surface로 다시 등장하지 않는다.
