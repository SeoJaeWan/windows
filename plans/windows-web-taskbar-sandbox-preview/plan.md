**Branch:** feat/windows-web-taskbar-sandbox-preview

> Worktree dir: `worktrees/windows-web-taskbar-sandbox-preview` (plan 폴더명과 동일)

# Windows Web Taskbar Sandbox Preview 실행 계획

> 요청당 plan 파일은 하나만 생성하고, 실행 순서는 아래 `Phase`들로만 표현한다.
> 추가 top-level section은 사용자 요청이나 별도 정책 요구가 없는 한 넣지 않는다.

## 단계별 실행

### Phase 1

- owner_agent: `frontend-developer`
- 목적: `apps/web`에 `/sandbox/taskbar` 정적 preview route를 추가해 `@windows/ui` taskbar public surface를 실제 브라우저 화면에서 한 번에 검토할 수 있게 한다.
- boundary:
  - `apps/web/src/app/sandbox/taskbar/**`
- input: `packages/ui/src/index.ts`에 export된 taskbar public component, `packages/ui/src/components/taskbar/**/*.test.tsx`가 고정한 canonical state fixture, 현재 `apps/web/src/app/page.tsx` 홈 단일 route, `apps/web/package.json`의 Next.js build/lint contract
- output: `/sandbox/taskbar` route를 열면 `Taskbar`, `TaskbarStartButton`, `TaskbarSearch`, `TaskbarIconButton`, `TaskbarClock`, `TaskbarStartPanel`, `TaskbarSearchPanel`, `TaskbarHoverPanel`, `TaskbarContextMenu`를 포함한 canonical taskbar composition 1개와 static fixture matrix가 같은 initial render 안에서 함께 보인다. matrix는 `TaskbarIconButton`의 `default | open | active`, `TaskbarStartPanel`의 `pinned | all | results`, `TaskbarSearchPanel`의 `default | results`, `TaskbarHoverPanel`의 close affordance 유무, `TaskbarContextMenu`의 plain/stateful variant를 모두 고정값으로 렌더링한다. route는 section heading 또는 동등한 surface marker를 가져 downstream bounded-surface E2E와 consumer validation owner route로 식별 가능해야 하며, user interaction, client state, live clock, external fetch 없이 초기 화면만으로 검토 가능해야 한다. 홈 route(`/`)나 `@windows/ui` public contract를 바꾸지 않는다.
- 선행조건: `plans/windows-ui-taskbar-shell/plan.md` Phase 4가 완료되어 `packages/ui/src/index.ts`가 `Taskbar`, `TaskbarStartButton`, `TaskbarSearch`, `TaskbarIconButton`, `TaskbarClock`, `TaskbarStartPanel`, `TaskbarSearchPanel`, `TaskbarHoverPanel`, `TaskbarContextMenu`만 export하고 internal helper는 숨기는 계약이 현재 소스 트리와 일치하는 상태
- 제약: preview owner는 `apps/web` route에 머물고 `packages/ui` 안에 preview 전용 style, fixture, route concern을 밀어 넣지 않는다. fixture는 test contract와 맞춘 정적 문자열/상태를 우선하고, 존재하지 않는 `/featured/*`, `/thumbs/*` public asset 경로에 의존하지 않는다.
- failure/validation: canonical scene 없이 matrix만 나열되거나, 반대로 전체 조합만 있고 상태별 차이가 드러나지 않으면 이 phase를 완료로 보지 않는다. preview를 위해 `use client`나 interactive entry를 도입하면 범위를 벗어난다.
- 작업:
  - `/sandbox/taskbar` route owner를 추가하고 `Taskbar`, `TaskbarStartButton`, `TaskbarSearch`, `TaskbarIconButton`, `TaskbarClock`, `TaskbarStartPanel`, `TaskbarSearchPanel`, `TaskbarHoverPanel`, `TaskbarContextMenu`를 정적 fixture로 조합한다.
  - 상단에는 실제 inspection 용 canonical desktop scene을 두고, 하단에는 상태별 비교를 위한 matrix section을 둔다.
  - fixture 값은 기존 component contract test의 label, mode, status grammar를 기본값으로 그대로 재사용하고, route-local wrapper text나 실제 자원 제약 때문에 불가피한 경우에만 제한적으로 치환한다. 이미지가 필요한 경우에는 `kind="file" | "folder"` fallback, 단순 inline node, 또는 route-local에서 실제 존재가 보장되는 정적 값만 사용한다.
  - 이후 bounded-surface E2E가 route를 안정적으로 찾을 수 있게 section heading, 고정 텍스트, 또는 route-local surface marker를 둔다.
- 검증:
  - [ ] `pnpm --filter @windows/web build`
  - [ ] `/sandbox/taskbar` initial render만으로 canonical scene, matrix section, section heading 또는 동등한 surface marker가 모두 확인된다.
  - [ ] 홈 route(`/`)와 `packages/ui/src/index.ts`는 preview route 추가 때문에 수정되지 않거나 public contract가 변하지 않는다.

### Phase 2

- owner_agent: `frontend-developer`
- 목적: sandbox preview를 실제 검토 surface로 쓸 수 있도록 route-local chrome, responsive layout, metadata 경계를 정리하고 preview 성격을 분명히 한다.
- boundary:
  - `apps/web/src/app/sandbox/taskbar/**`
- input: Phase 1에서 추가된 `/sandbox/taskbar` route, `apps/web/src/app/layout.tsx`의 root metadata shell, `apps/web/src/app/globals.css`의 app-level token, 루트 `playwright.config.ts`의 `baseURL=http://localhost:3000` 및 `apps/web` dev server contract
- output: `/sandbox/taskbar`는 preview 전용 surface임이 명확한 title/section chrome을 가진다. layout은 desktop 검토용 폭과 mobile 축소 폭 모두에서 깨지지 않으며, canonical taskbar는 scene 하단 anchor를 유지하고 matrix는 스크롤 가능한 inspection layout으로 읽힌다. preview styling과 metadata는 route-local 범위에 머물고 `@windows/ui` 컴포넌트나 app global style을 preview 전용으로 오염시키지 않는다. route는 검색엔진 대상 제품 surface로 오인되지 않도록 sandbox metadata를 명시하고, 이후 bounded-surface E2E가 `/sandbox/taskbar`를 단일 owner route로 삼을 수 있게 한다.
- 선행조건: Phase 1 완료
- 제약: preview chrome은 inspection을 돕는 wrapper까지만 허용하고, taskbar component 내부 markup을 route 요구사항에 맞춰 바꾸지 않는다. route는 정적 fixture page로 유지하며 open/close toggle, outside click, portal mount, focus trap, persisted browser state는 추가하지 않는다.
- side effects: route-local class/layout grammar가 `apps/web` 안에 생기지만 홈 route와 다른 app route에는 영향을 주지 않는다.
- failure/validation: preview styling을 위해 `packages/ui` component에 class prop contract나 preview-only wrapper가 추가되면 실패로 본다. sandbox route가 noindex/preview affordance 없이 제품 surface처럼 보이면 완료 기준을 충족하지 못한다.
- 작업:
  - canonical scene, matrix grid, panel/card wrapper, 설명 텍스트를 route-local chrome으로 정리해 사람이 비교하기 쉬운 inspection layout을 만든다.
  - route-level metadata 또는 route-local text affordance로 sandbox 성격을 명시하고, 배포 환경에서 색인 대상 제품 route로 오해되지 않게 한다.
  - desktop 우선 레이아웃을 유지하되 narrow viewport에서도 가로 overflow만 남기고 정보가 사라지지 않도록 반응형 stacking/scroll 규칙을 정한다.
  - bounded-surface E2E 후보가 될 수 있게 route와 주요 section이 고정된 heading/landmark를 유지하도록 마감한다.
- 검증:
  - [ ] `pnpm --filter @windows/web lint`
  - [ ] `pnpm --filter @windows/web build`
  - [ ] `pnpm --filter @windows/web dev` 실행 후 `http://localhost:3000/sandbox/taskbar`에서 desktop/mobile 폭으로 preview route가 깨지지 않는다.
  - [ ] route-level metadata 또는 동등한 App Router metadata surface가 sandbox preview title과 noindex/robots 비색인 의도를 명시한다.
  - [ ] preview 구현이 `packages/ui` source와 app global style contract를 preview 전용으로 변형하지 않는다.

## 테스트 계획

- `plan-materialize`: `required`
- 보고서: `plans/windows-web-taskbar-sandbox-preview/materialize.md` (materialization 후)
- 비고:
  - outcome-selection / boundary-contract / final-interpretation / 로직 boundary의 테스트 여부와 프론트 UI의 bounded-surface E2E 여부는 `plan-materialize`가 로컬 테스트 관례를 보고 결정
  - `architect`는 여기서 테스트 유형 예상이나 후보 spec 구조를 추가로 적지 않는다
  - 실제 테스트 파일은 소스 트리에 생성/수정되며 `plans/`는 durable source of truth가 아니다
