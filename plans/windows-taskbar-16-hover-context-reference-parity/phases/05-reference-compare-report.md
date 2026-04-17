# Phase 5. 레퍼런스 compare 보고

> 이 문서는 `visual-comparator`가 blog-derived baseline과 current compare story를 같은 key로 캡처·diff·report하는 phase 상세 계약이다.
> 이 phase는 compare/report만 담당하고 product code는 고치지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 핵심 목표 | canonical compare key 2개에 대해 reference/current/diff/report artifact를 같은 naming으로 남기고 pass/fail을 provenance와 함께 보고한다. |
| 선행조건 | Phase 1 baseline inventory와 Phase 3~4 compare owner story가 모두 고정돼 있어야 한다. |
| 완료 신호 | `visual-compare/report.md`가 두 compare key의 provenance, size match, diff result, verdict를 모두 기록한다. |
| 중단 조건 | compare story owner가 exact key를 제공하지 않거나 baseline provenance가 다시 섞이면 중단한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-taskbar-16-hover-context-reference-parity/visual-compare/run-diff.mjs` | 추가 | compare case는 정확히 `taskbar-hover-preview/attached-multi`, `taskbar-context-menu/attached-pinned` 두 canonical key뿐이다. 파일명 stem은 `/`를 `--`로 치환한 `taskbar-hover-preview--attached-multi`, `taskbar-context-menu--attached-pinned`만 허용한다. | script만 읽어도 compare inventory, current Storybook recipient, artifact naming이 1:1로 추적된다. |
| `plans/windows-taskbar-16-hover-context-reference-parity/visual-compare/report.md` | 추가/갱신 | report는 baseline provenance, current provenance, size match, diff result, verdict, supporting note를 key별로 적어야 한다. | report가 두 key 모두의 pass/fail과 provenance를 한 표에서 보여 준다. |
| `plans/windows-taskbar-16-hover-context-reference-parity/visual-compare/` | 추가/정리 | current capture와 diff artifact는 report와 같은 canonical key inventory를 쓰되 파일명은 stem 매핑으로만 만든다. | 파일명만 읽어도 reference/current/diff/report가 같은 case를 가리킨다. |

### current capture 계약

- canonical compare key는 문서, report row label, mismatch recipient에서 항상 slash literal을 쓴다.
  - `taskbar-hover-preview/attached-multi`
  - `taskbar-context-menu/attached-pinned`
- filename-safe stem은 canonical key에서 `/`를 `--`로 한 번만 치환해 만든다.
  - `taskbar-hover-preview/attached-multi` → `taskbar-hover-preview--attached-multi`
  - `taskbar-context-menu/attached-pinned` → `taskbar-context-menu--attached-pinned`
- current Storybook recipient는 exact compare export 둘뿐이다.
  - `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.compare.stories.tsx#CompareAttachedMulti`
  - `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.compare.stories.tsx#CompareAttachedPinned`
- current capture entrypoint는 worktree Storybook compare render에서 위 두 export를 직접 여는 것이다. `visual-comparator`는 story 바깥 wrapper나 수동 stage를 캡처하지 않고, 해당 compare export가 렌더한 machine-capture surface만 current provenance로 취급한다.
- marker contract는 `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`가 소유한 단일 compare root다.
  - hover current marker: `[data-visual-root][data-visual-kind="taskbar-hover-preview"][data-visual-state="attached-multi"]`
  - context current marker: `[data-visual-root][data-visual-kind="taskbar-context-menu"][data-visual-state="attached-pinned"]`
- `run-diff.mjs`는 canonical key inventory를 source of truth로 들고, 모든 current/diff 파일명을 stem 매핑으로만 파생한다. slash를 제거해 하이픈으로 다시 이어 붙인 pseudo-key는 허용하지 않는다.

### 완료 증거

- `report.md`가 두 compare key를 모두 기록한다.
- artifact filename과 report row label이 same canonical key inventory를 공유한다.
- motion/close acceptance가 static compare proof가 아니라 Phase 2~4 runtime evidence라는 note가 report에 남는다.
- current capture가 exact Storybook recipient와 marker contract를 통해 재현 가능하다.

- owner_agent: `visual-comparator`
- 목적:
  - hover/context parity를 subjective description이 아니라 inspectable compare evidence로 바꾼다.
- boundary:
  - primary write target: `plans/windows-taskbar-16-hover-context-reference-parity/visual-compare/run-diff.mjs`
  - primary write target: `plans/windows-taskbar-16-hover-context-reference-parity/visual-compare/report.md`
  - primary write target: `plans/windows-taskbar-16-hover-context-reference-parity/visual-compare/`
  - read-only baseline source: `plans/windows-taskbar-16-hover-context-reference-parity/reference-captures/`
  - read-only current owner: `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.compare.stories.tsx`
  - read-only current owner: `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.compare.stories.tsx`
  - read-only marker owner: `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`
- input:
  - 시나리오: maintainer가 Phase 1 baseline과 Phase 3~4 compare owner를 같은 key로 캡처·diff해 pass/fail report를 남겨야 한다.
  - exact compare inventory:
    - `taskbar-hover-preview/attached-multi`
    - `taskbar-context-menu/attached-pinned`
  - provenance classification:
    - baseline side: source-derived evidence from `C:/Users/USER/Desktop/dev/blog`를 plan-local `reference-captures/`로 고정한 artifact
    - current side: package-local current from worktree Storybook compare recipient `taskbarHoverPreview.compare.stories.tsx#CompareAttachedMulti`, `taskbarContextPanel.compare.stories.tsx#CompareAttachedPinned`
    - supporting note: motion/close visibility는 Phase 2~4 runtime evidence로 따로 기록
- output:
  - 공개 계약:
    - report는 두 compare key에 대해 provenance와 verdict를 함께 기록한다.
    - report row label은 항상 canonical slash key를 쓰고, current/diff artifact filename은 같은 key의 `/ -> --` stem 매핑만 사용한다.
    - current capture는 exact compare recipient export가 렌더한 단일 compare root marker에서만 생성된다.
    - static compare가 직접 증명하지 못하는 motion/close acceptance는 supporting note로 별도 표기한다.
  - 기본값:
    - compare는 open rested state 두 개만 대상으로 한다.
    - diff script threshold와 artifact path는 report와 같은 디렉터리에서 관리한다.
  - 중요 negative output:
    - leaf-only compare story를 attached-host baseline이나 current provenance로 쓰지 않는다.
    - old slug capture를 canonical baseline provenance처럼 표기하지 않는다.
    - 이 phase에서 product code를 수정하지 않는다.
- 시작조건:
  - Phase 1, Phase 3, Phase 4 output이 모두 고정돼 있어야 한다.
- 제약:
  - artifact key는 두 개의 canonical slash key만 유지한다.
  - filename-safe stem 변환은 `/ -> --` 한 가지 규칙만 허용하고, `taskbar-hover-preview-attached-multi` 같은 pseudo-key는 쓰지 않는다.
  - compare phase는 report와 artifact만 남긴다.
- side effects:
  - Phase 6은 report가 지목한 exact key, exact stem mapping, exact drift note만 받아 수정 범위를 닫는다.
- failure/validation:
  - report prose와 artifact filename이 같은 canonical key / stem mapping을 공유하지 않으면 compare evidence drift이므로 실패다.
  - current capture가 exact compare recipient export나 `[data-visual-root]` marker contract 밖에서 생성되면 실패다.
  - provenance label이 `source-derived evidence`, `package-local current`, `supporting note`를 구분하지 못하면 실패다.
- 작업:
  - plan-local baseline artifact와 current compare story capture를 같은 canonical key inventory로 준비한다.
  - Storybook current는 `CompareAttachedMulti`, `CompareAttachedPinned` export를 직접 열고 해당 `[data-visual-root]` marker만 캡처한다.
  - diff script를 추가해 current/diff artifact를 생성한다.
  - report에 provenance, mismatch, supporting note를 key별로 기록한다.
- 검증
  - [ ] `visual-compare/report.md`가 `taskbar-hover-preview/attached-multi`, `taskbar-context-menu/attached-pinned` 두 key를 모두 기록한다.
  - [ ] current capture, diff artifact, report row label이 slash key / `/ -> --` stem 매핑 규칙을 같이 공유한다.
  - [ ] current capture가 `taskbarHoverPreview.compare.stories.tsx#CompareAttachedMulti`, `taskbarContextPanel.compare.stories.tsx#CompareAttachedPinned`와 해당 `[data-visual-root]` marker 계약만으로 재현된다.
  - [ ] report가 motion/close acceptance를 static pixel verdict와 분리된 supporting note로 기록한다.
