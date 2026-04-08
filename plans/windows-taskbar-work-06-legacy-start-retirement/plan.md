**Branch:** feat/windows-taskbar-work-06-legacy-start-retirement

> Worktree dir: `worktrees/windows-taskbar-work-06-legacy-start-retirement` (plan 폴더명과 동일)

# Windows Taskbar Legacy Start Retirement 실행 계획

## 단계별 실행

### Phase 1. start 전용 소스 지우기

- 목적: 공개 경로에서 이미 빠진 `TaskbarStart*` source와 테스트, start 명칭 흔적을 source tree에서 지워 legacy 경로가 다시 살아나지 않게 한다.
- 변경 내용: `taskbarStartButton`, `taskbarStartPanel` 디렉터리와 전용 테스트를 삭제하고 남아 있는 taskbar 설명 문구를 새 이름 기준으로 맞춘다.
- 이전 상태: root export에서는 빠졌어도 source tree 안에 legacy start 파일과 전용 테스트가 남아 있어 회귀 지점이 된다.
- 이후 상태: `TaskbarStart*` source와 전용 테스트가 사라지고, 남아 있는 taskbar 관련 설명과 검증도 새 이름만 사용한다.
- 관련 영역: `packages/ui/src/components/taskbar/taskbarStartButton/**`, `packages/ui/src/components/taskbar/taskbarStartPanel/**`, `packages/ui/src/components/taskbar/taskbarSearchPanel/**`, `packages/ui/src/components/taskbar/taskbar/taskbar.test.tsx`
- 시작 조건: `plans/windows-taskbar-work-02-composite-assembly/phases/03-web-sandbox-alignment.md` 완료
- 상세: `./phases/01-delete-legacy-sources.md`
