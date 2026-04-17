# Phase 6. compare drift closure

> 이 문서는 Phase 5 compare report가 지목한 hover/context drift만 최소 범위로 수정하고 같은 key로 rerun하는 마지막 phase 상세 계약이다.
> report가 이미 pass라면 no-op closure로 끝나고, 그렇지 않다면 exact mismatch recipient만 다시 연다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 핵심 목표 | Phase 5 report가 지목한 drift만 같은 compare key로 수정하고 rerun해 final report를 남긴다. |
| 선행조건 | Phase 5가 exact mismatch recipient와 canonical slash key, `/ -> --` stem mapping을 남겨야 한다. |
| 완료 신호 | final report가 같은 두 key에 대해 pass 또는 explicit no-op closure를 기록한다. |
| 중단 조건 | drift를 줄이려면 compare key를 바꾸거나, hook keyboard/a11y boundary를 다시 열거나, Windows/Search parity를 같이 고쳐야 한다면 중단한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/tailwind-config/src/` | 조정 | motion timing drift가 report에 직접 연결될 때만 최소 수정한다. | same key compare report가 다시 green이거나 no-op closure note를 남긴다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/**` | 조정 | hover drift만 줄이고 attached-host key와 item order는 유지한다. | hover fix가 key를 바꾸지 않고 mismatch만 줄인다. |
| `packages/ui/src/components/panels/taskbarContextMenu/**` | 조정 | context drift만 줄이고 row order와 keyboard contract는 유지한다. | context fix가 key를 바꾸지 않고 mismatch만 줄인다. |
| `packages/ui/src/interactive/taskbar/storybook/**` | 조정 | behavior/compare host drift만 줄이고 baseline vocabulary는 유지한다. | story owner와 key naming이 Phase 3~5 wording과 동일하다. |
| `plans/windows-taskbar-16-hover-context-reference-parity/visual-compare/report.md` | 갱신 | rerun verdict 또는 no-op closure reason을 남긴다. | final report가 같은 두 key에 대한 마지막 상태를 명시한다. |

### 완료 증거

- final report가 같은 두 compare key로 pass 또는 explicit no-op closure를 남긴다.
- 수정이 있었다면 targeted validation과 rerun compare가 같이 기록된다.
- scope 밖 drift는 blocker로 분리돼 다음 단계가 임의로 범위를 넓히지 않는다.

- owner_agent: `frontend-developer`
- 목적:
  - Phase 5 compare report를 실제 closure로 바꾸되, scope를 새로 열지 않는다.
- boundary:
  - primary write target: `packages/tailwind-config/src/`
  - primary write target: `packages/ui/src/components/panels/taskbarHoverPreview/**`
  - primary write target: `packages/ui/src/components/panels/taskbarContextMenu/**`
  - primary write target: `packages/ui/src/interactive/taskbar/storybook/**`
  - primary write target: `plans/windows-taskbar-16-hover-context-reference-parity/visual-compare/report.md`
  - read-only prerequisite: `plans/windows-taskbar-16-hover-context-reference-parity/visual-compare/`
- input:
  - 시나리오: Phase 5 report가 같은 compare key 안에서 actionable hover/context drift를 지목했다.
  - current state:
    - report가 이미 pass면 no-op closure다.
    - report가 mismatch를 남기면 exact key, exact stem mapping, exact drift note만 수정 대상이다.
- output:
  - 공개 계약:
    - final report는 `taskbar-hover-preview/attached-multi`, `taskbar-context-menu/attached-pinned` 같은 key를 유지한 채 마지막 verdict를 기록한다.
    - rerun에 쓰는 artifact filename은 Phase 5의 `/ -> --` stem mapping만 재사용한다.
    - 수정은 Phase 2~4 boundary 안의 file만 대상으로 한다.
  - 기본값:
    - report가 이미 pass면 source tree는 no-op closure로 끝낼 수 있다.
    - targeted validation은 실제 수정한 file 경계에 맞춘다.
  - 중요 negative output:
    - compare key를 바꾸지 않는다.
    - hook keyboard/a11y boundary를 다시 설계하지 않는다.
    - Windows/Search parity를 함께 고치지 않는다.
- 시작조건:
  - Phase 5 report가 exact mismatch recipient를 남겨야 한다.
- 제약:
  - Phase 1의 canonical baseline key와 provenance vocabulary는 다시 열지 않는다.
  - Phase 5의 slash key / stem mapping 규칙은 다시 열지 않는다.
  - 수정 범위는 report가 지목한 drift보다 넓어지면 안 된다.
- side effects:
  - final report가 implementation handoff의 최종 visual status가 된다.
- failure/validation:
  - mismatch를 줄이려면 compare key를 바꾸거나 baseline inventory를 다시 여는 경우는 실패다.
  - 수정 후 report가 같은 key와 같은 `/ -> --` stem mapping으로 rerun되지 않으면 closure가 아니라 partial analysis이므로 실패다.
- 작업:
  - report가 지목한 drift를 hover/context/stage file 경계에서 최소 범위로 수정한다.
  - 수정한 파일 경계에 맞는 targeted validation을 실행한다.
  - 같은 compare key와 같은 stem mapping으로 rerun compare를 수행하고 final report를 갱신한다.
- 검증
  - [ ] final report가 `taskbar-hover-preview/attached-multi`, `taskbar-context-menu/attached-pinned` 같은 key를 유지한다.
  - [ ] rerun artifact filename이 Phase 5의 `/ -> --` stem mapping을 그대로 유지한다.
  - [ ] 수정이 있었다면 해당 파일 경계에 맞는 targeted validation이 같이 기록된다.
  - [ ] final report가 pass 또는 explicit no-op closure를 남긴다.
