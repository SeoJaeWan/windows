**Branch:** style/windows-taskbar-05-taskbar-elements-redesign

> Worktree dir: `worktrees/windows-taskbar-05-taskbar-elements-redesign` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 개발을 모르는 사람도 각 phase의 목적과 변화 방향을 이해할 수 있게 쓴다.
> 기술적인 입력/출력 계약, 파일 경계, 작업, 검증은 각 phase의 상세 문서에서 다룬다.

# Windows Taskbar 요소 재디자인 실행 계획

## 단계별 실행

### Phase 1. 기준 레일과 자산 정리

- 목적: 이번 재디자인이 같은 밝은 작업 표시줄 기준을 보도록 package 안의 기준 레일, Storybook 바탕, 대표 아이콘 자산을 먼저 고정한다.
- 변경 내용: `packages/ui` 안에서 깨진 placeholder PNG와 어두운 leaf stage를 정리하고, 블로그와 현재 저장소 capture에서 확인 가능한 밝은 작업 표시줄 rail 기준을 공용 Storybook helper로 묶는다.
- 이전 상태: Windows 버튼과 아이콘 fixture는 사실상 placeholder 이미지이고, Storybook leaf story는 어두운 카드 위에 따로 떠 있어서 실제 rail 맥락을 보여주지 못한다.
- 이후 상태: 같은 package-owned rail helper와 유효한 자산을 바탕으로 모든 leaf story가 밝은 작업 표시줄 기준에서 비교 가능해진다.
- 관련 영역: `packages/ui/src/components/taskbar/storybook/**`, `packages/ui/src/components/taskbar/internal/icon/assets/windows-mark.png`, `packages/ui/src/components/taskbar/storybook/assets/taskbar-foundation-icon.png`, `plans/windows-taskbar-02-windows-panel/reference-captures/**`, `plans/windows-taskbar-03-search-panel/reference-captures/**`, `plans/windows-taskbar-04-attached-surfaces/reference-captures/**`, `~/Desktop/dev/blog`
- 시작 조건: `windows-taskbar-01-foundation-shell`이 고정한 taskbar token과 `taskbar-glass` 계약을 이미 package consumer가 읽을 수 있어야 한다.
- 상세: `./phases/01-reference-rail-and-assets.md`

### Phase 2. Windows 버튼과 검색 줄 재디자인

- 목적: 작업 표시줄 왼쪽 묶음이 블로그와 capture의 밝은 버튼, 검색 pill, 한글 카피 기준을 따르도록 맞춘다.
- 변경 내용: Windows 버튼과 Search leaf의 모양, 아이콘 처리, rail 위 높이감, Storybook 기준 카피를 다시 잡고, 그 카피를 고정하는 Storybook 회귀 테스트도 같은 단계에서 함께 갱신한다. package의 기본 button/input prop 통과 계약은 유지한다.
- 이전 상태: Windows 버튼은 작은 placeholder mark 위주로 보이고, Search leaf는 generic magnifier와 영어 placeholder 때문에 reference와 톤이 다르다.
- 이후 상태: Windows 버튼은 실제 Windows glyph와 밝은 hover/active 표면을 쓰고, Search leaf는 반투명 흰 pill·왼쪽 아이콘·한글 기준 카피를 가진 rail 요소로 보인다.
- 관련 영역: `packages/ui/src/components/taskbar/taskbarWindowsButton/**`, `packages/ui/src/components/taskbar/taskbarSearch/**`, `packages/ui/src/components/taskbar/internal/icon/**`, `packages/ui/src/components/taskbar/storybook/foundationFigmaRegistration.test.tsx`
- 시작 조건: Phase 1의 rail helper와 대표 자산이 준비돼 있어야 한다.
- 상세: `./phases/02-windows-and-search-redesign.md`

### Phase 3. 아이콘 버튼과 시계 재디자인

- 목적: 가운데 아이콘 버튼과 오른쪽 시계가 reference capture의 크기, 정렬, indicator, locale 예시에 맞게 보이도록 맞춘다.
- 변경 내용: Icon button의 상태 표시 폭과 hover 표면, 대표 앱 아이콘 fixture, Clock의 우측 정렬과 한국어 시간 예시를 재정리하고, 그 예시를 고정하는 Storybook 회귀 테스트도 같은 단계에서 함께 갱신한다.
- 이전 상태: Icon button은 dark hover 잔상과 과한 indicator 폭을 쓰고, Clock은 가운데 정렬된 단순 두 줄 블록이라 capture의 오른쪽 rail 느낌이 약하다.
- 이후 상태: Icon button은 실제 작업 표시줄 아이콘과 비슷한 밀도와 indicator를 가지며, Clock은 오른쪽 끝에 맞춘 compact block과 한국어 시간 예시를 가진다.
- 관련 영역: `packages/ui/src/components/taskbar/taskbarIconButton/**`, `packages/ui/src/components/taskbar/taskbarClock/**`, `packages/ui/src/components/taskbar/storybook/foundationFigmaRegistration.test.tsx`, `plans/windows-taskbar-04-attached-surfaces/reference-captures/**`, `~/Desktop/dev/blog`
- 시작 조건: Phase 1의 rail helper와 대표 자산이 준비돼 있어야 한다.
- 상세: `./phases/03-icon-and-clock-redesign.md`

### Phase 4. 전체 작업 표시줄 기준 Storybook 추가

- 목적: 새 leaf들을 실제 rail 맥락에서 검토할 수 있는 full taskbar 기준 story를 추가하고, Storybook bootstrap 검증을 그 새 topology에 맞춘다.
- 변경 내용: full taskbar reference story를 추가하고, bootstrap 회귀 테스트를 새 rail helper 기준으로 갱신해 시각 비교와 package 경계 검증을 함께 닫는다.
- 이전 상태: Storybook은 leaf marker 보존만 확인하고, 한 화면에서 rail 전체 조합을 확인할 기준 story가 없다.
- 이후 상태: 하나의 full taskbar story와 이미 고정된 leaf marker contract가 함께 존재해, rail 전체와 개별 leaf를 같은 package 기준으로 검토할 수 있다.
- 관련 영역: `packages/ui/src/components/taskbar/taskbar/*.stories.tsx`, `packages/ui/src/components/taskbar/storybook/storybookBootstrap.test.ts`, `packages/ui/.storybook/**`
- 시작 조건: Phase 2와 Phase 3의 leaf 재디자인이 끝나 있어야 한다.
- 상세: `./phases/04-reference-storybook-finalization.md`
