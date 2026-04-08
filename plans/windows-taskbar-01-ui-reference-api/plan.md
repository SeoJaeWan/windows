**Branch:** feat/windows-taskbar-01-ui-reference-api

> Worktree dir: `worktrees/windows-taskbar-01-ui-reference-api` (plan 폴더명과 동일)
> 참고: 이 폴더의 기존 산출물은 linked phase detail 없이 작성된 legacy 형식이었다. 이번 업데이트는 Plan Artifact Interface v7 기준으로 범위와 단계 계약을 다시 정리한다.

# Windows Taskbar UI Reference API 실행 계획

## 단계별 실행

### Phase 1. Taskbar 데이터 입력 확정

- 목적: `Taskbar`가 받을 공식 데이터 입력과 내부 계산 결과를 먼저 하나로 닫아 이후 구현, 테스트, 소비자 화면이 같은 계약을 바라보게 한다.
- 변경 내용: raw slot 기반 조합 대신 `entries`, `icons`, `windows`, `search`, `clock` 입력과 icon/windows/search helper 출력 shape를 명시한다.
- 이전 상태: 구현은 아직 `startButton/search/items/clock` 슬롯을 받지만, 패키지 테스트와 샌드박스 검증은 이미 data-driven `Taskbar`와 start-free public surface를 기대하고 있다.
- 이후 상태: `Taskbar` 공식 입력과 helper winner rule, empty-state rule, leaf surface 존속 범위가 문서와 테스트 기준에서 먼저 고정된다.
- 관련 영향: `packages/ui` taskbar public API, 이후 `utils/taskbar` 경계, root export 정리 방향, `/sandbox/taskbar` 소비자 전환 준비
- 시작 조건: `none`
- 상세: `./phases/01-taskbar-data-contract.md`

### Phase 2. 패키지 안 조립 경로 정리

- 목적: Phase 1에서 고정한 데이터를 패키지 안에서 직접 화면으로 바꾸는 경로를 만들고, `Taskbar`가 raw slot 없이도 reference shell을 그리게 한다.
- 변경 내용: `utils/taskbar` plain model, package-private windows panel, shared render-only atom 경계를 만들고 `Taskbar`를 새 입력 방식으로 다시 묶는다.
- 이전 상태: taskbar 조립 책임이 raw slot 구현, `internal/**`, leaf public surface에 흩어져 있어서 어떤 파일이 공식 조립 경로인지 분명하지 않다.
- 이후 상태: `Taskbar`가 icon strip, windows panel, search panel, clock을 package-owned DOM/class 책임으로 직접 조립하고, helper는 package-private plain model만 반환한다.
- 관련 영향: `packages/ui/src/components/taskbar/**`, `packages/ui/src/utils/taskbar/**`, package-owned observable DOM/class grammar
- 시작 조건: Phase 1 완료
- 상세: `./phases/02-package-assembly-path.md`

### Phase 3. 샌드박스 기준 화면 전환

- 목적: 첫 소비자 화면인 `/sandbox/taskbar`를 새 `Taskbar` 입력 방식으로 전환해 package contract를 실제 app 소비 경로에서 바로 검증하게 한다.
- 변경 내용: 샌드박스 페이지와 fixture, route test, bounded-surface E2E를 `taskbar-sandbox-canonical` / `taskbar-sandbox-compare` 기준 화면으로 맞춘다.
- 이전 상태: route source는 아직 raw slot과 `TaskbarStart*`에 기대고 있고, 테스트와 E2E만 먼저 새 canonical/compare stage를 기대하는 어긋난 상태다.
- 이후 상태: `/sandbox/taskbar`는 `Taskbar` data props만으로 `pinned/default`와 `all/results` 두 기준 화면을 보여 주는 first-party consumer surface가 된다.
- 관련 영향: `apps/web/src/app/sandbox/taskbar/**`, `e2e/sandbox-taskbar-preview.spec.ts`, route-level metadata와 marker contract
- 시작 조건: Phase 2 완료
- 상세: `./phases/03-sandbox-reference-stage.md`

### Phase 4. 이전 시작 조합 정리

- 목적: 소비자 전환이 끝난 뒤 old start-specific public surface를 치워 taskbar family의 공식 public export를 하나로 맞춘다.
- 변경 내용: root export, package tests, legacy start directories를 정리하고 `interactive` entry가 새 우회 계약으로 열리지 않게 닫는다.
- 이전 상태: `packages/ui/src/index.test.ts`는 이미 `TaskbarStart*` 제거를 기대하지만 실제 root export와 source tree는 아직 그 상태에 도달하지 못했다.
- 이후 상태: `@windows/ui` root export는 살아남는 taskbar family만 노출하고, start-specific public surface와 관련 테스트는 source tree에서 제거된다.
- 관련 영향: `packages/ui/src/index.ts`, `packages/ui/src/index.test.ts`, `packages/ui/src/interactive/index.ts`, legacy start component directories
- 시작 조건: Phase 3 완료
- 상세: `./phases/04-legacy-start-retirement.md`
