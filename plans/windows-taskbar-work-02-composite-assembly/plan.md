**Branch:** feat/windows-taskbar-work-02-composite-assembly

> Worktree dir: `worktrees/windows-taskbar-work-02-composite-assembly` (plan 폴더명과 동일)
> 주의: 이 plan은 기존 legacy 요약 형식에서 출발한 문서를 이번 결정 범위 안에서 현재 템플릿에 맞춰 부분 정리한 버전이다.

# Windows Taskbar 조합 처리 실행 계획

## 단계별 실행

### Phase 1. package 안에서 taskbar 조립하기

- 목적: `Taskbar`가 helper 결과를 직접 읽어 아이콘 줄, windows 화면, search 화면, 시계를 package 내부에서 조립하게 한다.
- 변경 내용: 바깥에서 leaf를 끼워 넣던 방식을 줄이고, icon strip과 windows/search 화면 조립 책임을 `Taskbar` 안으로 옮긴다.
- 이전 상태: helper 규칙이 있어도 실제 화면 조립은 raw slot이나 legacy start leaf 흔적에 기대고 있다.
- 이후 상태: `Taskbar`는 `entries/icons/windows/search/clock` 데이터만으로 package 내부 화면을 만들고, 바깥 소비자는 leaf node를 손으로 맞추지 않는다.
- 관련 영역: `packages/ui/src/components/taskbar/taskbar/**`, package-owned windows/search panel, 후속 visuals와 sandbox가 읽을 source surface
- 시작 조건: `plans/windows-taskbar-work-01-data-helper-foundation/phases/02-helper-projection.md` 완료
- 상세: `./phases/01-package-assembly.md`

### Phase 2. 공개 export와 검증 기준 바꾸기

- 목적: root export와 package 검증 기준에서 `Taskbar`만 공식 공개 경로로 남기고 `TaskbarStart*` export를 끊는다.
- 변경 내용: root export, interactive entry, root export test, `Taskbar` 설명 문구를 새 조합 경로 기준으로 맞춘다.
- 이전 상태: `TaskbarStart*` export가 남아 있어 새 `Taskbar`가 유일한 공개 경로인지 해석이 흔들린다.
- 이후 상태: 후속 visuals, Storybook sandbox, cleanup plan은 `Taskbar`만 taskbar 공개 경로라고 전제할 수 있다.
- 관련 영역: `packages/ui/src/index.ts`, `packages/ui/src/index.test.ts`, `packages/ui/src/interactive/index.ts`, `packages/ui/src/components/taskbar/taskbar/taskbar.test.tsx`
- 시작 조건: Phase 1 완료
- 상세: `./phases/02-composite-surface.md`

### Phase 3. 웹 미리보기 경로 임시 맞추기

- 목적: `/sandbox/taskbar` route가 제거된 `TaskbarStart*` export 없이도 잠정 미리보기 역할을 계속 수행하게 한다.
- 변경 내용: app/web preview page, fixtures, route test를 남아 있는 `Taskbar` 공개 계약 기준으로 맞추고 start 전용 import를 걷어낸다.
- 이전 상태: web sandbox는 raw slot 조합과 `TaskbarStart*` export에 기대고 있어 Phase 2 이후에는 바로 깨진다.
- 이후 상태: web sandbox는 여전히 임시 미리보기로 남아 있지만, 새 `Taskbar` 공개 계약만 사용하고 start 전용 공개 경로를 다시 열지 않는다.
- 관련 영역: `apps/web/src/app/sandbox/taskbar/**`
- 시작 조건: Phase 2 완료
- 상세: `./phases/03-web-sandbox-alignment.md`
