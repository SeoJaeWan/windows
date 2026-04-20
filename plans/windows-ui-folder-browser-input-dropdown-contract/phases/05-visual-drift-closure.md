# Phase 5. 시각 드리프트 마감

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | Phase 4 report가 남긴 blocker만 same contract 안에서 닫고, same 15-state inventory로 final compare evidence를 남긴다. |
| 선행조건 | Phase 4가 exact 15 key와 drift category, provenance를 report로 남겨야 한다. |
| 완료 판단 | final report가 same 15 key에 대해 pass 또는 explicit blocker를 exact key와 scope reason으로 적는다. |
| 중단 조건 | blocker를 닫으려면 public props, state role classification, exact story ID 15개, exact capture owner를 다시 열어야 한다면 blocker다. |

## 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/tailwind-config/src/theme.css`, `packages/tailwind-config/src/utilities.css` | 조정 | foundation/token blocker만 `window` namespace 안에서 닫는다. | 급패치가 namespace 밖으로 새지 않는다. |
| `packages/ui/src/components/windows/internal/windowFrame/**` | 조정 | shared shell blocker만 고친다. | shared/leaf owner boundary를 다시 열지 않는다. |
| `packages/ui/src/components/windows/folder/**` | 조정 | Folder 8-state blocker만 same contract 안에서 닫는다. | two-input + grid owner contract는 유지된다. |
| `packages/ui/src/components/windows/browser/**` | 조정 | Browser 7-state blocker만 same contract 안에서 닫는다. | single-input + `children` owner contract는 유지된다. |
| `packages/ui/src/components/windows/storybook/**`, `packages/ui/src/components/taskbar/storybook/compareRoot.tsx` | 조정 | review-state scaffolding, stage, compare recipient blocker만 최소 범위에서 정리한다. | exact story ID 15개와 marker contract는 유지된다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract/visual-compare/**` | 갱신 | final compare evidence를 same key로 남긴다. | final report가 pass 또는 explicit blocker를 exact key로 적는다. |

## 완료 증거

- final compare가 same story ID 15개와 same capture owner `[data-window-compare-stage]`를 재사용한다.
- public props, detail-state owner rule, exact story ID 15개, positive root import proof는 다시 열리지 않는다.
- blocker가 닫히면 pass evidence가 남고, 남으면 exact key와 scope reason이 report에 남는다.
- final report가 same provenance wording을 유지한다.

## Phase 요약

| 항목 | 내용 |
| --- | --- |
| 목표 | exact mismatch key만 닫고 same 15-state inventory로 final compare를 남긴다. |
| 연결 작업 단위 | `WindowFrame foundation과 responsive hierarchy`, `Folder leaf UI-only contract`, `Browser leaf UI-only contract`, `Storybook/internal review inventory, compare, export verification` |
| 선행 조건 | Phase 4의 exact 15 key report와 drift category |
| 검증 메모 | public contract를 다시 열지 않고 same 15 key와 same provenance wording으로 final pass 또는 explicit blocker를 남겨야 한다. |
| 로컬 전제 계약 | implementation과 later materialize는 final report가 남긴 same contract를 그대로 사용한다. |

## 작업 순서

| 순서 | 작업 단위 | 이번 단계에서 처리하는 내용 | 완료 조건 |
| --- | --- | --- | --- |
| 1 | foundation drift closure | token/shell/stage blocker를 same owner boundary 안에서 닫는다. | foundation owner를 유지한 채 blocker가 줄어든다. |
| 2 | leaf/detail-state drift closure | Folder/Browser 15-state blocker를 same public contract 안에서 닫는다. | no new prop/no new key로 blocker가 줄어든다. |
| 3 | final compare evidence | same inventory와 same provenance wording으로 rerun report를 남긴다. | final report가 pass 또는 explicit blocker를 exact key로 적는다. |

## 작업 단위 A. foundation/token/stage drift closure

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | 일부 blocker는 shared shell, control cluster, stage geometry에서 시작하므로 leaf만 고쳐서는 closure가 되지 않는다. |
| 현재 문제 | Phase 4 report가 shared frame, control spacing, mobile stage geometry drift를 지적할 수 있다. |
| 목표 상태 | `window` namespace와 `WindowFrame` shared owner를 유지한 채 blocker만 줄인다. |
| 유지 경계 | public leaf prop names, state role classification, exact story ID는 다시 열지 않는다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `packages/tailwind-config/src/theme.css`, `packages/tailwind-config/src/utilities.css` | 변경 | foundation-level blocker만 닫아야 한다. |
| `packages/ui/src/components/windows/internal/windowFrame/**` | 변경 | shell geometry, control placement, outer padding만 조정해야 한다. |
| `packages/ui/src/components/windows/storybook/**` | 변경 | stage geometry blocker가 있을 때만 최소 범위로 조정해야 한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | 없음. foundation internal contract 유지 |
| state ownership | shell density, control placement, stage geometry는 foundation helper가 소유한다. |
| callback / handoff | 없음 |
| no-op / invalid rule | blocker 해소를 위해 public leaf props나 new key를 만들지 않는다. |
| 추가 관찰 포인트 | exact `[data-window-compare-stage]`와 nested `[data-visual-root]` relation은 변경 금지다. |

### 시각 패리티 계약

| 항목 | 내용 |
| --- | --- |
| comparison mode | Phase 1 taxonomy를 그대로 따른다. |
| gating metric | frame/control geometry blocker 해소 |
| non-gating metric | ornament detail advisory drift |
| local surface | titlebar, frame edge, control cluster, stage padding |
| canonical surface role | `frame-surface`, `control-surface`, `ornament-surface` |
| comparison policy | geometry blocker는 `gating`, minor ornament drift는 `advisory` |
| metric treatment | `boundary-and-geometry` |

### 검증 근거

| 항목 | 확인 수단 |
| --- | --- |
| foundation owner boundary 유지 | source inspection |
| shell/stage blocker 감소 | final compare report |

## 작업 단위 B. Folder/Browser leaf와 detail-state drift closure

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | Figma 15-state wrapper inventory와 어긋나는 blocker는 leaf source, fixture/harness, stage scaffolding에서 함께 닫아야 한다. |
| 현재 문제 | detail-state를 포함한 15-state inventory 전체에서 dropdown anchor, hover affordance, mobile hierarchy, chrome spacing blocker가 남을 수 있다. |
| 목표 상태 | same prop contract, same state role classification, same story ID 15개를 유지한 채 blocker만 줄인다. |
| 유지 경계 | runtime navigation/filtering, public status/open/hover prop, panel domain, exhaustive export inventory freeze는 계속 금지다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `packages/ui/src/components/windows/folder/**` | 변경 | Folder 8-state blocker를 same contract 안에서 닫는다. |
| `packages/ui/src/components/windows/browser/**` | 변경 | Browser 7-state blocker를 same contract 안에서 닫는다. |
| `packages/ui/src/components/windows/storybook/**` | 변경 | review-state scaffolding blocker가 있으면 최소 범위로 정리한다. |
| `packages/ui/src/components/taskbar/storybook/compareRoot.tsx` | 변경 | compare recipient blocker가 있을 때만 최소 범위로 정리한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | Phase 3에서 잠근 `Folder`/`Browser` props와 exact story ID 15개를 그대로 유지한다. |
| state ownership | input winners와 payload arrays는 계속 host-owned이고, detail-state scaffolding은 계속 storybook/internal review surface owner다. |
| callback / handoff | callback 이름과 의미는 변경하지 않는다. |
| no-op / invalid rule | no-data -> no dropdown, invalid id -> no-op, `Enter -> submit`, detail-state no-public-prop rule은 그대로 유지한다. |
| 추가 관찰 포인트 | `folder/live-chip-open`과 control-hover state를 blocker 해결 명목으로 public prop으로 승격하지 않는다. |

### 시각 패리티 계약

| 항목 | 내용 |
| --- | --- |
| comparison mode | Phase 1 taxonomy를 그대로 따른다. |
| gating metric | Phase 4 report state row가 지적한 frame/control/content/media geometry blocker |
| non-gating metric | payload copy/media/glyph advisory drift |
| local surface | location/search/address input, dropdown rows, chips, sidebar hover, thumbnail hover, control-hover cluster, article body, mobile hierarchy |
| canonical surface role | `control-surface`, `navigation-surface`, `content-surface`, `media-surface`, `fixture-payload-surface`, `text-detail-surface`, `ornament-surface` |
| comparison policy | blocker surface는 `gating`, payload detail은 `advisory` |
| metric treatment | `boundary-and-geometry` |

### 검증 근거

| 항목 | 확인 수단 |
| --- | --- |
| Phase 3 prop/detail-state contract 유지 | source inspection |
| 15-state blocker 감소 | final compare report |

## 실행 계약

- owner_agent: `frontend-developer`
- 목적:
  - Phase 4 report가 남긴 exact mismatch key만 same contract 안에서 닫고 final compare evidence를 남긴다.
- boundary:
  - `packages/tailwind-config/src/**`
  - `packages/ui/src/components/windows/**`
  - `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`
  - `plans/windows-ui-folder-browser-input-dropdown-contract/visual-compare/**`
- input:
  - 시나리오: maintainer가 full 15-state wrapper inventory compare report를 보고 in-scope visual drift만 closure해야 하는 경우
  - exact mismatch source:
    - `plans/windows-ui-folder-browser-input-dropdown-contract/visual-compare/report.md`
  - immutable contracts from earlier phases:
    - exact public prop names and no-op rules from Phase 3
    - exact story ID 15개 from Phase 3
    - exact `[data-window-compare-stage]` + nested `[data-visual-root]` relation from Phase 3
    - exact state role classification from Phase 1
    - exact provenance wording from Phase 1 and Phase 4
- output:
  - 공개 계약:
    - final compare는 same 15 key, same story ID 15개, same capture owner, same provenance wording을 재사용한다.
    - public prop names, detail-state owner rule, root import proof는 변경하지 않는다.
    - final report는 pass 또는 explicit blocker를 exact key와 scope reason으로 남긴다.
  - 내부 기본값:
    - advisory drift는 남길 수 있지만 blocker는 final report에 exact key로 설명돼야 한다.
  - 허용하지 않는 대안:
    - blocker 해결을 위해 new public prop, new compare key, panel-domain import를 추가하는 선택
    - final report 없이 주관적 판단으로 closure를 선언하는 선택
    - same provenance wording을 local alias로 흐리는 선택
- 작업:
  1. foundation-level blocker가 있으면 same owner boundary 안에서 닫는다.
  2. Folder/Browser/detail-state blocker를 same contract 안에서 닫는다.
  3. same 15-state inventory로 final compare를 재실행하고 report를 갱신한다.
- 검증:
  - [ ] final compare report가 same 15 key를 exact key로 재평가한다.
  - [ ] public prop names, state role classification, story ID 15개, exact capture owner가 이전 phase 대비 바뀌지 않는다.
  - [ ] blocker가 남으면 exact key와 scope reason이 report에 적혀 있다.

## Phase 검증

| 검증 항목 | 확인 수단 | 기대 결과 |
| --- | --- | --- |
| same 15-state inventory 재사용 | final compare report inspection | 15 key 모두가 same naming으로 재평가된다. |
| public contract 불변 유지 | source inspection | public props와 detail-state owner rule이 변하지 않는다. |
| explicit blocker 또는 pass evidence | final compare report inspection | 각 key가 pass 또는 explicit blocker reason으로 남는다. |
