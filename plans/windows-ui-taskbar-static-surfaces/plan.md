**Branch:** feat/windows-ui-taskbar-static-surfaces

> Worktree dir: `worktrees/windows-ui-taskbar-static-surfaces` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 개발을 모르는 사람도 각 phase의 목적과 변화 방향을 이해할 수 있게 쓴다.
> 기술적인 입력/출력 계약, 파일 경계, 작업, 검증은 각 phase의 상세 문서에서 다룬다.
> 기존 `windows-taskbar-work-*`, `windows-ui-taskbar-shell`, `windows-ui-taskbar-styles`, `windows-web-taskbar-sandbox-preview` 문서는 보존하되, 이번 목표의 기준 문서는 이 plan 하나로 본다.
> 2026-04-10 기준 실행 계획은 `windows-taskbar-01-foundation-shell`부터 `windows-taskbar-04-attached-surfaces`까지의 번호형 plan 세트로 대체됐다. 이 폴더는 reference capture와 이전 논의 기록을 보존하는 용도로만 남긴다.

# Windows UI 작업 표시줄 정적 화면 실행 계획

## 단계별 실행

### Phase 1. 기준 상태와 공통 기본형 만들기

- 목적: 비어 있는 `packages/ui`에 작업 표시줄용 공통 스타일과 재사용 기본형, 최소 파일 뼈대를 다시 세워 이후 단계가 실제로 관찰한 화면 상태만 구현할 수 있게 만든다.
- 변경 내용: `seojaewan.com`에서 직접 확인한 기본 상태, 검색 결과, 검색 결과 상세, 우클릭 메뉴, 시작 화면 고정 변화까지 기준 상태로 정리하고, 각 상태를 로컬 reference capture 세트로 남긴 뒤 그 상태를 조합하는 내부 기본형과 public 파일 구조를 먼저 맞춘다.
- 이전 상태: `packages/ui`는 사실상 비어 있고, root export는 아직 없는 taskbar 파일들을 가리키고 있으며, 어떤 열린 상태를 기준으로 구현할지도 충분히 고정돼 있지 않다.
- 이후 상태: 공통 스타일과 내부 기본형, public component 파일 뼈대가 갖춰지고, 이후 단계가 어떤 관찰된 상태만 구현해야 하는지와 그 상태를 어떤 이미지로 봐야 하는지도 명확해진다.
- 관련 영역: `packages/tailwind-config`, `packages/ui/src/index.ts`, `packages/ui/src/components/taskbar/**`
- 상세: `./phases/01-taskbar-tokens-and-primitives.md`
- 기준 캡처 목록: `./reference-captures.md`

### Phase 2. 하단 바 모양 만들기

- 목적: 유리 느낌의 bar shell과 그 위에 올라갈 개별 조각들을 분리해, 이후 조합 전에 각 요소의 정적인 모양부터 완성한다.
- 변경 내용: `Taskbar`는 내용 없는 glass bar container로 만들고, 시작 버튼, 검색, 앱 아이콘, 시계를 각각 독립된 정적 UI로 만든다.
- 이전 상태: public 이름과 파일 뼈대는 있어도, bar shell과 leaf control이 어떤 역할 차이를 가져야 하는지는 아직 충분히 고정돼 있지 않다.
- 이후 상태: `Taskbar`는 빈 glass bar 자체로 읽히고, `TaskbarStartButton`, `TaskbarSearch`, `TaskbarIconButton`, `TaskbarClock`는 나중에 어떤 조합으로 얹더라도 쓸 수 있는 독립된 정적 UI가 된다.
- 관련 영역: `packages/ui/src/components/taskbar/taskbar`, `taskbarStartButton`, `taskbarSearch`, `taskbarIconButton`, `taskbarClock`
- 시작 조건: Phase 1 완료
- 상세: `./phases/02-taskbar-bar-shell.md`

### Phase 3. 패널 모양 만들기

- 목적: 실제로 확인한 열린 상태를 기준으로 시작 패널, 검색 패널, 미리보기 패널, 메뉴 패널과 그 내부 secondary surface의 구조를 정적 UI로 구체화한다.
- 변경 내용: 각 패널이 어떤 구역으로 나뉘는지뿐 아니라, 결과 행의 `>` 상세 pane, 우클릭 메뉴 variant, 시작 화면 고정 전후의 시각 변화, 알파벳 인덱스 같은 내부 surface까지 어느 선까지 고정할지 정한다.
- 이전 상태: 패널 이름과 큰 방향은 정해졌지만, 실제 참고 화면에서 확인된 상태와 아직 못 본 상태가 섞여 있고, 패널 내부의 secondary surface 경계도 충분히 고정돼 있지 않다.
- 이후 상태: 패널이 실제로 열리고 닫히지 않더라도, 구현 대상 상태와 내부 조합 규칙, public과 internal의 경계가 분명한 정적 패널 계획이 된다.
- 관련 영역: `packages/ui/src/components/taskbar/taskbarStartPanel`, `taskbarSearchPanel`, `taskbarHoverPanel`, `taskbarContextMenu`
- 시작 조건: Phase 2 완료
- 상세: `./phases/03-taskbar-panels.md`
