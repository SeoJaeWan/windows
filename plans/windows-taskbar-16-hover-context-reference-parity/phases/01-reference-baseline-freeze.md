# Phase 1. 레퍼런스 기준 고정

> 이 문서는 hover/context reference parity 작업이 실제로 어떤 baseline을 기준으로 움직이는지 새 slug 안에 다시 고정하는 phase 상세 계약이다.
> canonical compare key와 supporting observation을 여기서 먼저 닫아 두고, 이후 phase는 이 문서가 약속한 key와 provenance만 사용한다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 핵심 목표 | `taskbar-hover-preview/attached-multi`, `taskbar-context-menu/attached-pinned` 두 key만 canonical baseline으로 고정하고, motion/close 관련 source note는 supporting observation으로 분리한다. |
| 선행조건 | `none` |
| 완료 신호 | `baseline-inventory.md`가 canonical key 2개만 선언하고, `supporting-observations.md`가 supporting evidence와 provenance를 분리한다. |
| 중단 조건 | hover/context 외 state가 canonical inventory로 다시 들어오거나, old slug capture가 새 pass/fail baseline처럼 섞이면 중단한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-taskbar-16-hover-context-reference-parity/reference-captures/baseline-inventory.md` | 추가 | canonical compare key는 정확히 `taskbar-hover-preview/attached-multi`, `taskbar-context-menu/attached-pinned` 두 개다. 각 row는 source path, provenance, capture filename, state role을 가져야 한다. | inventory가 정확히 두 row의 canonical key만 선언하고 later compare가 같은 key로 artifact를 파생할 수 있다. |
| `plans/windows-taskbar-16-hover-context-reference-parity/reference-captures/supporting-observations.md` | 추가 | motion direction, close visibility, close winner rule처럼 정적 open screenshot만으로 닫히지 않는 근거는 supporting observation이다. supporting observation은 canonical state를 늘리지 않는다. | motion/close reference note가 compare state가 아니라 documentary support로만 분류돼 있다. |
| `plans/windows-taskbar-16-hover-context-reference-parity/reference-captures/` | 추가/정리 | baseline image naming은 compare key를 그대로 파일명에 반영해야 한다. old slug capture는 documentary support로만 참조한다. | canonical baseline image 2개와 supporting note naming이 구분돼 있다. |

### 완료 증거

- `baseline-inventory.md`가 canonical compare key를 정확히 두 개만 나열한다.
- `supporting-observations.md`가 motion/close evidence를 supporting observation으로 분류한다.
- old slug capture와 blog source note가 provenance별로 분리돼 later compare가 혼합 baseline을 읽지 않는다.

- owner_agent: `visual-comparator`
- 목적:
  - hover/context compare가 어디를 기준으로 pass/fail을 주장하는지 새 slug 안에서 다시 고정한다.
- boundary:
  - primary write target: `plans/windows-taskbar-16-hover-context-reference-parity/reference-captures/baseline-inventory.md`
  - primary write target: `plans/windows-taskbar-16-hover-context-reference-parity/reference-captures/supporting-observations.md`
  - primary write target: `plans/windows-taskbar-16-hover-context-reference-parity/reference-captures/`
  - read-only reference: `C:/Users/USER/Desktop/dev/blog/src/components/molecules/taskHoverPanel/index.tsx`
  - read-only reference: `C:/Users/USER/Desktop/dev/blog/src/components/molecules/taskLeftClickPanel/index.tsx`
  - read-only reference: `C:/Users/USER/Desktop/dev/blog/src/hooks/useShowTaskPanel/index.tsx`
  - read-only documentary support: `plans/windows-taskbar-04-attached-surfaces/reference-captures/`
- input:
  - 시나리오: maintainer가 hover/context parity를 구현하기 전에 canonical baseline과 supporting observation을 plan-local artifact로 다시 고정해야 한다.
  - canonical compare inventory:
    - `taskbar-hover-preview/attached-multi`
    - `taskbar-context-menu/attached-pinned`
  - supporting observation inventory:
    - hover close affordance가 panel close와 같은 path를 타야 한다는 source note
    - context enter/exit motion이 아래→위 / 현재 위치→아래 규칙을 따라야 한다는 source note
    - old slug capture는 documentary support일 뿐 새 pass/fail baseline이 아니라는 분류
- output:
  - 공개 계약:
    - canonical baseline은 정확히 두 compare key만 가진다.
    - 각 canonical key는 source-derived evidence, capture filename, state role을 함께 가진다.
    - supporting observation은 motion/close reference를 설명하지만 compare state를 추가하지 않는다.
  - 기본값:
    - baseline provenance는 `source-derived evidence (C:/Users/USER/Desktop/dev/blog)`로 기록한다.
    - old slug capture는 `documentary support`로만 기록한다.
  - 중요 negative output:
    - Windows/Search panel state를 canonical baseline에 추가하지 않는다.
    - `windows-taskbar-04` capture를 새 canonical baseline처럼 표기하지 않는다.
    - motion/close 근거를 third compare key로 승격하지 않는다.
- 시작조건: `none`
- 제약:
  - canonical compare key는 이번 phase에서 다시 열지 않는다.
  - supporting observation은 canonical pass/fail key를 대체하지 않는다.
- side effects:
  - 이후 phase의 compare story, report, diff script가 모두 같은 key vocabulary를 그대로 사용한다.
- failure/validation:
  - canonical key가 둘 이상으로 늘어나거나 provenance가 빠지면 later compare가 state를 다시 해석해야 하므로 실패다.
  - supporting observation이 baseline image와 같은 bucket에 섞이면 provenance ambiguity이므로 실패다.
- 작업:
  - blog source와 사용자 합의를 바탕으로 두 canonical key만 `baseline-inventory.md`에 고정한다.
  - motion/close 관련 source note와 old slug capture를 `supporting-observations.md`에 provenance별로 분리 기록한다.
  - later compare가 그대로 재사용할 baseline filename rule을 reference-captures 경계에 고정한다.
- 검증
  - [ ] `baseline-inventory.md`가 `taskbar-hover-preview/attached-multi`, `taskbar-context-menu/attached-pinned` 두 key만 canonical baseline으로 적는다.
  - [ ] `supporting-observations.md`가 motion/close reference를 supporting observation으로만 적는다.
  - [ ] old slug capture와 blog source note가 provenance별로 분리돼 later compare가 같은 `reference` bucket으로 합치지 않도록 적는다.
