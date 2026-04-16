# Phase 2. interactive 훅 추가

> 이 문서는 실행용 상세 계약이다. 맨 위 컨트롤러 다이제스트만 읽어도 이 phase의 목표, 파일 단위 변경, 완료 판단, 중단 시점을 알 수 있어야 한다.
> 아래 기술 섹션은 `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위나 결론을 새로 바꾸지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | `@windows/ui/interactive` 서브패스를 실제 taskbar-specific hook entry로 만들고 packages/ui unit test로 runtime behavior를 닫는다. |
| 선행조건 | Phase 1의 leaf contract와 `SurfacePhase`가 stable해야 한다. |
| 완료 판단 | `useTaskbarHoverPreview`, `useTaskbarContextPanel`이 `./interactive`에서 공개되고, reduced motion·presence·hover intent·taskbar-specific placement가 unit test로 고정된다. |
| 중단 조건 | public API가 generic floating/menu runtime으로 커지거나, hook을 돌리기 위해 `apps/web` provider/portal 구현이 선행돼야 하면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/interactive/index.ts` | 추가 | client-side hook entry만 공개한다. generic helper, test-only harness, story helper는 export하지 않는다. | `@windows/ui/interactive` import가 taskbar hook surface만 제공하고 root entry와 분리된다. |
| `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview.ts` | 추가 | hook option은 taskbar-specific default만 연다. `openDelayMs`, `closeDelayMs`, `motionPreference`는 hook option에만 두고 visual props로 올리지 않는다. | hover intent timer, `SurfacePhase`, root trigger/surface wiring, `onExitComplete` bridge가 hook source에 드러난다. |
| `packages/ui/src/interactive/taskbar/useTaskbarContextPanel.ts` | 추가 | pointer-origin placement와 root `surfaceProps`만 public으로 열고, generic `side/align/flip` API는 열지 않는다. | taskbar context open/close contract와 placement output이 source에서 taskbar-specific 이름으로 닫힌다. |
| `packages/ui/src/interactive/taskbar/internal/**` | 추가 | reduced motion, presence, placement clamp, hover intent helper는 internal-only다. public export나 root visual contract를 다시 열면 안 된다. | helper 파일이 `./interactive` index에 새지 않고 hook test만으로 owner boundary가 드러난다. |
| `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview.test.tsx` | 추가 | hover hook test는 timer, reduced motion, exit finalize, trigger/surface wiring을 owner로 삼는다. | 1000ms/500ms 기본값, override, pending cancel, immediate finalize가 test로 고정된다. |
| `packages/ui/src/interactive/taskbar/useTaskbarContextPanel.test.tsx` | 추가 | context hook test는 pointer placement, viewport clamp, dismiss path, focus restore bridge를 owner로 삼는다. | pointer-origin winner rule, root `surfaceProps`, reduced motion finalize, close/focus restore path가 test에서 보인다. |

### 완료 증거

- `packages/ui/src/interactive/index.ts`가 실제 public entry가 되고 taskbar hook만 export한다.
- hook test가 hover timer와 context placement를 각각 자기 boundary에서 검증한다.
- reduced motion override가 hook option에만 남고 visual component public props로 새지 않는다.

- owner_agent: `frontend-developer`
- 목적: packages/ui 내부에서 interactive runtime을 먼저 닫아 두고 이후 host app이 이 runtime을 소비하기만 하면 되도록 만든다.
- boundary: `packages/ui/src/interactive/**`만 write target이다. `apps/web`, external portal owner, generic floating library wrapper는 범위 밖이다.
- input:
    - Phase 1의 `TaskbarHoverPreview` / `TaskbarContextMenu` public leaf contract
    - `packages/ui/package.json`의 기존 `./interactive` export 예약
    - 사용자 합의: taskbar-specific public placement, shared `SurfacePhase`, reduced motion은 internal auto + hook option override only
    - blog/live reference에서 관측된 hover intent 기본값(enter 1000ms, leave 500ms)
- output:
    - 공개 계약:
        - `@windows/ui/interactive`는 `useTaskbarHoverPreview`, `useTaskbarContextPanel`과 필요한 public type만 export한다.
        - hover hook은 trigger/surface wiring, `phase`, `onExitComplete`, item callback bridge, taskbar-specific hover delay option을 제공한다.
        - context hook은 pointer-origin 기반 open/placement, root `surfaceProps`, `phase`, `onExitComplete`, dismiss/focus restore bridge를 제공한다.
        - context hook의 focus restore는 leaf가 해석한 close-producing key/action 뒤에 실행되는 finalize path로 닫고, 별도 generic focus manager public API는 열지 않는다.
    - 내부 기본값:
        - `motionPreference: "auto"`는 `window.matchMedia("(prefers-reduced-motion: reduce)")`를 source-of-truth로 쓴다.
        - hover default는 open `1000ms`, leave-close `500ms`다. 필요하면 hook option으로만 override한다.
        - reduced motion에서는 close wait를 생략하고 exit finalize를 즉시 처리한다.
        - placement/clamp/presence/hover intent helper는 internal layer에 남고 public export에 올라오지 않는다.
    - 허용하지 않는 대안:
        - `useFloating`류 generic API를 taskbar hooks public contract에 그대로 복제하는 형태
        - visual public props에 `reducedMotion` 또는 placement generic option을 추가하는 형태
        - `apps/web`의 portal owner나 coordinator가 있어야만 hook test가 돌아가는 구조
- 선행조건:
    - Phase 1의 `SurfacePhase`, `onExitComplete`, leaf callback contract가 확정돼 있어야 한다.
- 제약:
    - root server-safe entry는 그대로 두고 interactive runtime만 client entry로 둔다.
    - public placement는 taskbar-specific naming만 허용한다.
    - hook은 row-level prop getter public API를 다시 열지 않는다.
    - mutual exclusion은 packages/ui story-local composition으로 먼저 보이되, generic public coordinator API를 강제하지 않는다.
- side effects:
    - `package.json`의 기존 `./interactive` export가 실제 파일로 연결된다.
    - unit test는 packages/ui 내부 harness component를 통해 hook behavior를 직접 검증한다.
- failure/validation:
    - hook output이 generic `side`, `align`, `offset`, `flip` public contract를 열면 이 phase는 실패다.
    - reduced motion override가 visual component props로 올라가면 이 phase는 실패다.
    - packages/ui unit test만으로 hover intent 또는 context placement를 재현할 수 없으면 이 phase는 실패다.
- 작업:
    - `src/interactive/index.ts`를 client-side public entry로 만들고 taskbar hook만 export한다.
    - `useTaskbarHoverPreview`에서 hover intent timer, `SurfacePhase`, exit finalize, root trigger/surface wiring, item callback bridge를 닫는다.
    - `useTaskbarContextPanel`에서 pointer-origin placement, viewport clamp, root `surfaceProps`, dismiss path, focus restore bridge를 닫고, leaf keyboard semantics와 hook finalize path의 경계를 문서화한다.
    - reduced motion와 presence phase, placement clamp, hover intent timer는 internal helper로 분리하되 taskbar-specific hook 외부로는 export하지 않는다.
    - 두 hook test에서 packages/ui 자체 harness component를 써서 timer, reduced motion, placement, close/focus restore path를 직접 확인한다.
- 검증:
    - [ ] `pnpm --filter @windows/ui exec vitest run src/interactive/taskbar/useTaskbarHoverPreview.test.tsx src/interactive/taskbar/useTaskbarContextPanel.test.tsx`
    - [ ] hover hook test가 default 1000ms open, 500ms leave-close, override, reduced motion immediate finalize를 직접 확인한다.
    - [ ] context hook test가 pointer-origin placement, viewport clamp, root `surfaceProps` output, dismiss/focus restore bridge를 직접 확인한다.
    - [ ] `packages/ui/src/interactive/index.ts` export surface가 taskbar hook/public type에 한정되는지 코드로 확인한다.
