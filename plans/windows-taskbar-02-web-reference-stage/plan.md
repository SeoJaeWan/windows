**Branch:** feat/windows-taskbar-02-web-reference-stage

> Worktree dir: `worktrees/windows-taskbar-02-web-reference-stage` (plan 폴더명과 동일)

# Windows Taskbar Web Reference Stage 실행 계획

> 요청당 plan 파일은 하나만 생성하고, 실행 순서는 아래 `Phase`들로만 표현한다.
> 추가 top-level section은 사용자 요청이나 별도 정책 요구가 없는 한 넣지 않는다.

## 단계별 실행

### Phase 1

- owner_agent: `frontend-developer`
- 목적: `/sandbox/taskbar` owner route를 새 `Taskbar` data-driven API 소비 경계로 바꿔 `app/web`가 raw leaf composition 없이도 reference taskbar family를 렌더링하는 canonical consumer surface가 되게 한다.
- boundary:
  - `apps/web/src/app/sandbox/taskbar/**`
- input: `plans/windows-taskbar-01-ui-reference-api/plan.md` Phase 4의 output/검증으로 고정된 package prerequisite contract, 현재 `apps/web/src/app/sandbox/taskbar/page.tsx`와 `fixtures.tsx`가 `TaskbarStartButton`/`TaskbarStartPanel` 등 leaf를 직접 조합하는 preview 구조, `apps/web/package.json`의 build/lint contract
- output: `/sandbox/taskbar` route는 `@windows/ui`의 `Taskbar` public API가 `entries`, `icons`, `windows`, `search`, `clock` data props를 canonical input으로 받고, `entries`는 필수이며 `Entry`/`TaskbarIcon` schema와 `icon.category -> entry.category` winner rule을 그대로 소비한다. canonical stage는 `data-testid='taskbar-sandbox-canonical'` 아래에서 bottom-anchored taskbar 1개와 함께 `windows.view='pinned'`, `search.view='default'`를 렌더링하고, 비교용 static area는 `data-testid='taskbar-sandbox-compare'` 아래에서 `windows.view='all'`, `search.view='results'`를 별도 card/state로 드러낸다. route는 raw ReactNode slot 조합이나 public `pinnedIds`/`allIds` 제어 없이 default reference shell과 static windows/search surface를 렌더링하며, legacy `TaskbarStart*` leaf 조합이나 matrix-only inspection page로 남지 않는다.
- 선행조건: `plans/windows-taskbar-01-ui-reference-api/plan.md` Phase 4가 위 package prerequisite contract를 source-tree validation으로 닫은 상태
- 제약: route는 interaction 없는 static reference stage로 유지하고, runtime store나 client-only panel orchestration을 다시 도입하지 않는다.
- failure/validation: route가 새 `Taskbar` canonical API 대신 legacy leaf 조합이나 duplicated per-surface fixture source-of-truth를 유지하면 실패다.
- 작업:
  - `/sandbox/taskbar` route fixture를 `entries` registry와 `icons/windows/search/clock` data props 중심으로 재구성한다.
  - `taskbar-sandbox-canonical`과 `taskbar-sandbox-compare` stable marker 아래에 각각 `windows.view='pinned'` + `search.view='default'`, `windows.view='all'` + `search.view='results'` state를 고정한다.
  - legacy `TaskbarStartButton`/`TaskbarStartPanel` 직접 조합과 matrix 중심 surface marker를 새 canonical consumer grammar에 맞춰 제거하거나 치환한다.
  - route가 package contract의 실제 소비 예시가 되도록 raw ReactNode slot usage를 제거한다.
- 검증:
  - [ ] `pnpm --filter @windows/web build`
  - [ ] `pnpm --filter @windows/web lint`
  - [ ] `/sandbox/taskbar`가 새 `Taskbar` canonical API를 직접 소비하고 `taskbar-sandbox-canonical`에서는 `windows.view='pinned'` + `search.view='default'`, `taskbar-sandbox-compare`에서는 `windows.view='all'` + `search.view='results'`를 stable marker로 유지한다.

### Phase 2

- owner_agent: `frontend-developer`
- 목적: sandbox route를 `~/Desktop/dev/blog`와 `https://seojaewan.com`을 참조한 static desktop stage로 정리해 taskbar family visual parity를 route-local 범위에서 검토 가능하게 한다.
- boundary:
  - `apps/web/src/app/sandbox/taskbar/**`
  - `apps/web/src/app/globals.css`
  - `apps/web/src/app/layout.tsx`
- input: Phase 1의 새 consumer contract, `blog` reference의 wallpaper/taskbar stage 비주얼, live site의 actual taskbar 위치와 배경 인상, 현재 `apps/web` globals와 layout의 generic body/font shell
- output: `/sandbox/taskbar`는 taskbar family 검토에 필요한 static desktop-like wallpaper, bottom-anchored `taskbar-sandbox-canonical` stage, `taskbar-sandbox-compare` area 안의 `windows.view='all'` 및 `search.view='results'` static surface card, noindex metadata를 가진 reference owner route가 된다. route-local stage는 taskbar family만 소유하며 desktop icon grid, session windows, panel interaction, portal behavior는 구현하지 않는다. visual parity를 위해 필요한 stage chrome은 `apps/web` route/local style이 맡되, taskbar core visual grammar의 source of truth는 계속 `@windows/ui`에 남는다.
- 선행조건: Phase 1 완료
- 제약: route-local stage가 `@windows/ui` 기본 style 결핍을 덮는 용도로 taskbar 내부 class를 덮어쓰면 안 된다. `app/web` globals 변경은 route 전체 또는 app shell에 부작용이 없을 만큼 최소화한다.
- side effects: sandbox route 또는 app shell에 reference-oriented wallpaper/font helper가 제한적으로 추가될 수 있다.
- failure/validation: visual parity를 위해 `ui` package 밖에서 taskbar core chrome을 다시 그리거나, 반대로 wallpaper/desktop stage까지 `ui` package가 떠안게 되면 실패다.
- 작업:
  - sandbox route에 reference desktop wallpaper와 taskbar bottom stage를 추가해 실제 사이트와 유사한 검토 환경을 만든다.
  - windows/search static surface를 canonical state로 노출해 interaction 없이도 reference family를 비교할 수 있게 한다.
  - metadata와 route-local 설명 문구를 reference inspection owner surface에 맞춰 정리한다.
- 검증:
  - [ ] `pnpm --filter @windows/web build`
  - [ ] `pnpm --filter @windows/web lint`
  - [ ] `pnpm --filter @windows/web dev` 실행 후 `http://localhost:3000/sandbox/taskbar`에서 `taskbar-sandbox-canonical`의 bottom-anchored stage와 `taskbar-sandbox-compare`의 `windows.view='all'`/`search.view='results'` static card가 함께 보이고 wallpaper/noindex intent가 유지된다.
  - [ ] taskbar core chrome의 source of truth가 `@windows/ui`에 남고 route-local style은 stage chrome에 한정된다.

### Phase 3

- owner_agent: `frontend-developer`
- 목적: bounded-surface validation과 legacy preview cleanup을 마감해 `/sandbox/taskbar`를 reference-parity owner route로 고정한다.
- boundary:
  - `apps/web/src/app/sandbox/taskbar/**`
- input: Phase 1~2의 새 consumer route, 현재 `page.test.tsx`와 `/sandbox/taskbar` bounded-surface contract가 text/count/class non-empty 위주로 고정된 legacy preview 상태, `playwright.config.ts`의 bounded-surface E2E runner contract
- output: `/sandbox/taskbar` owner route는 새 `Taskbar` data-driven API와 reference desktop stage를 검증하는 bounded-surface target이 되고, legacy matrix-only/leaf-count 중심 preview contract는 `taskbar-sandbox-canonical`에서 `windows.view='pinned'` + `search.view='default'`, `taskbar-sandbox-compare`에서 `windows.view='all'` + `search.view='results'`를 확인하는 새 canonical surface contract로 대체된다. route는 여전히 bounded-surface 수준에 머물며 cross-route journey, persisted browser state, release-critical flow는 도입하지 않는다.
- 선행조건: Phase 2 완료
- 제약: 이 plan은 bounded-surface owner route까지만 다루며 full-flow regression이나 cross-route Playwright guard 범위는 만들지 않는다.
- failure/validation: 새 route가 여전히 leaf 개수와 class 존재성만 검증하는 surface로 남아 visual/reference owner route 역할을 못 하면 실패다.
- 작업:
  - route-level unit boundary와 bounded-surface E2E가 `taskbar-sandbox-canonical`/`taskbar-sandbox-compare` marker 및 해당 windows/search view contract를 바라보도록 정리한다.
  - reference-parity 검토에 불필요한 legacy matrix wording과 marker를 제거하거나 축소한다.
  - 이후 `plan-materialize`가 source-tree tests를 갱신할 수 있도록 route의 canonical marker와 static state contract를 명확히 남긴다.
- 검증:
  - [ ] `pnpm --filter @windows/web build`
  - [ ] `pnpm --filter @windows/web lint`
  - [ ] `/sandbox/taskbar` owner route가 legacy matrix-only inspection surface가 아니라 `taskbar-sandbox-canonical`/`taskbar-sandbox-compare` marker와 새 `Taskbar` consumer contract를 검증하는 bounded-surface target으로 읽힌다.

## 테스트 계획

- `plan-materialize`: `required`
- 보고서: `plans/windows-taskbar-02-web-reference-stage/materialize.md` (materialization 후)
- 비고:
  - outcome-selection / boundary-contract / final-interpretation / 로직 boundary의 테스트 여부와 프론트 UI의 bounded-surface E2E 여부는 `plan-materialize`가 로컬 테스트 관례를 보고 결정
  - `architect`는 여기서 테스트 유형 예상이나 후보 spec 구조를 추가로 적지 않는다
  - 실제 테스트 파일은 소스 트리에 생성/수정되며 `plans/`는 durable source of truth가 아니다
