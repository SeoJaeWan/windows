**Branch:** feat/windows-taskbar-02-windows-panel

> Worktree dir: `worktrees/windows-taskbar-02-windows-panel` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 개발을 모르는 사람도 각 phase의 목적과 변화 방향을 이해할 수 있게 쓴다.
> 기술적인 입력/출력 계약, 파일 경계, 작업, 검증은 각 phase의 상세 문서에서 다룬다.

# Windows Panel 기준 상태 재현 실행 계획

## 단계별 실행

### Phase 1. 패널 틀과 기준 데이터 정리

- 목적: `https://seojaewan.com`과 로컬 capture를 기준으로, 패널 바깥 틀과 패키지 안의 기준 데이터 파일을 먼저 정한다.
- 변경 내용: `packages/ui` 안에 `WindowsPanelShell`, 패널만 놓고 보는 Storybook 바탕, `windowsPanelReferenceFixtures.ts`를 만들고, 검색/고정됨/모두 화면이 어떤 값을 받아 그려지는지 이름과 데이터 모양을 이 단계에서 정한다.
- 이전 상태: `@windows/ui`에는 taskbar leaf만 있고 Windows panel 컴포넌트 묶음, 기준 데이터, panel 전용 Storybook 바탕이 없다.
- 이후 상태: desktop-only 패널 틀과 기준 데이터가 먼저 정리돼서, 다음 단계가 화면별 본문을 추측하지 않고 같은 기준에서 만들 수 있다.
- 관련 영역: `packages/ui/src/components/taskbar/windowsPanelShell/**`, `packages/ui/src/components/taskbar/storybook/**`, `plans/windows-taskbar-02-windows-panel/reference-captures/**`, `C:\Users\USER\Desktop\dev\blog\src\components\templates\windowsPanel\index.tsx`
- 시작 조건: `windows-taskbar-01-foundation-shell`이 고정한 taskbar token과 search focus 기준을 `packages/ui` consumer가 이미 읽을 수 있어야 한다.
- 상세: `./phases/01-panel-shell-and-reference-fixtures.md`

### Phase 2. 고정됨과 모두 기준 상태 정리

- 목적: 검색줄 아래 본문에서 `고정됨`, `모두`, `모두 인덱스 선택` 세 화면을 움직임 없이 그대로 재현한다.
- 변경 내용: `WindowsPanelPinnedBody`와 `WindowsPanelAllBody`를 받는 값에 따라 모양이 바뀌는 본문 컴포넌트로 만들고, 패키지 안의 고정 데이터를 써서 `Pinned default`, `All list`, `All index chooser` 화면을 각각 따로 고정한다.
- 이전 상태: panel shell이 생겨도 내부 본문은 `고정됨` grid와 `모두` 목록/인덱스 선택 화면을 package 안에서 재현하지 못한다.
- 이후 상태: `고정됨`과 `모두` 본문이 전환 로직 없이도 reference capture와 같은 정적 화면으로 분리돼 보여서, 다음 단계는 검색 화면만 추가하면 된다.
- 관련 영역: `packages/ui/src/components/taskbar/windowsPanelPinnedBody/**`, `packages/ui/src/components/taskbar/windowsPanelAllBody/**`, `packages/ui/src/components/taskbar/windowsPanelShell/**`, `packages/ui/src/components/taskbar/storybook/windowsPanelReferenceFixtures.ts`, `plans/windows-taskbar-02-windows-panel/reference-captures/start-panel-default.png`, `plans/windows-taskbar-02-windows-panel/reference-captures/start-panel-all.png`, `plans/windows-taskbar-02-windows-panel/reference-captures/start-panel-all-index.png`
- 시작 조건: Phase 1의 패널 틀, 기준 데이터, Storybook 바탕, 받는 값 계약이 준비돼 있어야 한다.
- 상세: `./phases/02-pinned-and-all-reference-states.md`

### Phase 3. 검색 기준 상태와 package 연결 정리

- 목적: 같은 패널 안에서 `Search results`와 `Search empty` 두 검색 화면을 닫고, 패키지에서 바로 쓰는 패널 컴포넌트 공개 범위를 마무리한다.
- 변경 내용: `WindowsPanelSearchBody`를 `results`/`empty` 두 화면으로 정리하고, root export와 Storybook 기준 화면 다섯 개를 같은 package 경계 안에서 닫는다.
- 이전 상태: `고정됨`과 `모두`는 보여도 검색 결과 목록, 검색 결과 없음 화면, root export, 최종 Storybook 기준 화면 세트는 아직 닫히지 않았다.
- 이후 상태: `Pinned default`, `All list`, `All index chooser`, `Search results`, `Search empty`가 모두 따로 존재하고, package는 패널 컴포넌트만 공개한다.
- 관련 영역: `packages/ui/src/components/taskbar/windowsPanelSearchBody/**`, `packages/ui/src/components/taskbar/windowsPanelShell/**`, `packages/ui/src/components/taskbar/storybook/windowsPanelReferenceFixtures.ts`, `packages/ui/src/index.ts`, `plans/windows-taskbar-02-windows-panel/reference-captures/start-panel-query-empty.png`, `C:\Users\USER\Desktop\dev\blog\src\components\molecules\taskSearchResult\index.tsx`
- 시작 조건: Phase 2의 고정됨/모두 기준 화면이 Storybook에서 이미 분리돼 있어야 한다.
- 상세: `./phases/03-search-states-and-public-wiring.md`
