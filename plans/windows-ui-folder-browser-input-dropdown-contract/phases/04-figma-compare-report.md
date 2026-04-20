# Phase 4. Figma wrapper compare report 생성

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | Figma 3:2 wrapper baseline과 current Storybook surface를 exact 15 `kind/state` key로 캡처하고 blocking/advisory drift를 분리한 report를 만든다. |
| 선행조건 | Phase 1의 baseline inventory와 Phase 3의 exact story inventory 15개, exact capture owner, root export/build boundary가 모두 stable해야 한다. |
| 완료 판단 | `visual-compare/report.md`만 읽어도 15 key 각각의 provenance, pass/fail, advisory drift, artifact path를 exact key로 다시 추적할 수 있다. |
| 중단 조건 | current capture가 support-only story를 섞거나, report가 exact 15 key 대신 legacy 6-state alias로 다시 쓰여야 한다면 blocker다. |

## 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-input-dropdown-contract/capture-current.mjs` | 교체 | exact story ID 15개와 exact `[data-window-compare-stage]`만 current capture 대상으로 사용한다. | support-only story, stale alias, inner wrapper capture가 남지 않는다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract/visual-compare/run-diff.mjs` | 교체 | baseline/current/diff/report artifact naming과 provenance label은 exact `kind-state` key를 공유한다. | report row와 artifact file naming drift가 없다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract/visual-compare/report.md` | 교체 | 15-state report는 blocking/advisory drift와 provenance를 같은 row에서 분리한다. | report가 15 key 모두에 대해 provenance, pass/fail, advisory note를 적는다. |

## 완료 증거

- current capture source가 exact story ID 15개로 고정된다.
- exact `[data-window-compare-stage]`만 캡처 owner로 쓰고 nested `[data-visual-root]`는 metadata carrier로만 읽는다.
- report가 `external-source evidence`와 `package-local current` provenance를 혼동하지 않는다.
- blocking pass/fail과 advisory drift가 state별로 분리된다.

## Phase 요약

| 항목 | 내용 |
| --- | --- |
| 목표 | exact 15-state key와 provenance를 가진 compare evidence를 남긴다. |
| 연결 작업 단위 | `Figma 3:2 wrapper inventory와 provenance`, `Storybook/internal review inventory, compare, export verification` |
| 선행 조건 | Phase 1 baseline inventory, Phase 3 exact story inventory와 capture owner |
| 검증 메모 | report가 exact 15 key, provenance, blocking/advisory 분리를 모두 가져야 한다. |
| 로컬 전제 계약 | Phase 5는 여기서 만든 exact mismatch key와 drift category만 수정 대상으로 삼아야 한다. |

## 작업 순서

| 순서 | 작업 단위 | 이번 단계에서 처리하는 내용 | 완료 조건 |
| --- | --- | --- | --- |
| 1 | current capture | exact story ID 15개와 exact `[data-window-compare-stage]`를 current capture 대상으로 고정한다. | current artifact가 same key naming을 쓴다. |
| 2 | diff pipeline | baseline/current/diff/report artifact naming과 provenance labeling을 같은 key로 묶는다. | report row와 artifact file이 1:1로 대응한다. |
| 3 | drift report | blocking/advisory drift를 state별로 분리해 report를 남긴다. | Phase 5가 report만 보고 exact mismatch key를 바로 읽는다. |

## 작업 단위 A. current capture와 artifact key binding

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | full 15-state compare를 same contract로 돌리려면 current capture source와 artifact naming이 exact key로 묶여 있어야 한다. |
| 현재 문제 | current plan은 6-state capture source와 stale alias에 머물러 있어 full wrapper inventory current capture를 literal하게 표현하지 못한다. |
| 목표 상태 | current capture script가 exact story ID 15개만 읽고, baseline/current/diff/report 모두 같은 `kind/state` key를 쓴다. |
| 유지 경계 | compare phase 안에서 source-tree UI fix를 수행하지 않는다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `plans/windows-ui-folder-browser-input-dropdown-contract/capture-current.mjs` | 변경 | current capture source가 exact story ID 15개만 읽어야 한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract/visual-compare/run-diff.mjs` | 변경 | artifact naming과 provenance label이 exact key를 재사용해야 한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | exact story ID 15개, exact `[data-window-compare-stage]`, exact nested `[data-visual-root]`, exact `kind-state` artifact naming |
| state ownership | capture script는 current artifact를 소유하고, baseline inventory는 reference-side provenance를 소유한다. |
| callback / handoff | 없음 |
| no-op / invalid rule | support-only story, stale 6-state alias, manual file rename은 invalid path다. |
| 추가 관찰 포인트 | current capture는 stage owner를 직접 캡처하고 inner wrapper나 viewport crop을 canonical owner로 삼지 않는다. |

### 시각 패리티 계약

| 항목 | 내용 |
| --- | --- |
| comparison mode | Phase 1 inventory를 그대로 따른다. |
| gating metric | exact key와 exact provenance binding이 유지돼야 state-level blocker를 추적할 수 있다. |
| non-gating metric | `none` |
| local surface | current Storybook compare stage, baseline local mirror, diff artifact |
| canonical surface role | `frame-surface`, `control-surface`, `content-surface`, `media-surface`, `fixture-payload-surface` |
| comparison policy | key/provenance binding은 `gating`이다. |
| metric treatment | `boundary-and-geometry` |

### 검증 근거

| 항목 | 확인 수단 |
| --- | --- |
| exact story ID 15개 current capture | capture script inspection |
| exact artifact key binding | diff script inspection |

## 작업 단위 B. drift report와 provenance 분리

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | later drift closure는 “무엇이 어긋났는가”뿐 아니라 “어떤 provenance를 기준으로 어긋났는가”도 exact key로 알아야 한다. |
| 현재 문제 | current plan은 HTML-wrapper provenance와 package-local current evidence를 6-state 범위로만 서술하고 있어 15-state drift report handoff가 약하다. |
| 목표 상태 | report가 15 key 각각에 대해 provenance, blocking pass/fail, advisory drift, artifact path를 남긴다. |
| 유지 경계 | report는 contract 확장이나 새 public prop 제안을 하지 않는다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `plans/windows-ui-folder-browser-input-dropdown-contract/visual-compare/report.md` | 변경 | 15 key 모두와 provenance, pass/fail, advisory drift가 적혀야 한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | 15-state compare report row |
| state ownership | report taxonomy와 provenance labeling은 compare phase가 소유한다. |
| callback / handoff | report가 Phase 5에 exact mismatch key와 drift category를 handoff한다. |
| no-op / invalid rule | whole-canvas mismatch 하나만으로 pass/fail을 결정하지 않는다. provenance를 `reference` 한 단어로 뭉뚱그리지 않는다. |
| 추가 관찰 포인트 | `external-source evidence (Figma 3:2 live HTML wrapper)`와 `package-local current (Storybook compare capture)`를 row마다 분리해 적는다. |

### 시각 패리티 계약

| 항목 | 내용 |
| --- | --- |
| comparison mode | Phase 1 inventory를 그대로 따른다. |
| gating metric | state별 blocker summary와 pass/fail |
| non-gating metric | state별 advisory drift summary |
| local surface | report row, artifact path, provenance label |
| canonical surface role | `frame-surface`, `control-surface`, `content-surface`, `media-surface`, `fixture-payload-surface` |
| comparison policy | blocker는 `gating`, payload/copy/glyph drift는 `advisory` |
| metric treatment | `boundary-and-geometry` |

### 검증 근거

| 항목 | 확인 수단 |
| --- | --- |
| provenance 분리 여부 | report inspection |
| blocking/advisory 분리 여부 | report inspection |

## 실행 계약

- owner_agent: `visual-comparator`
- 목적:
  - Figma 3:2 wrapper baseline과 current Storybook surface를 exact 15 key로 비교하고 drift evidence를 repo-local artifact로 남긴다.
- boundary:
  - `plans/windows-ui-folder-browser-input-dropdown-contract/capture-current.mjs`
  - `plans/windows-ui-folder-browser-input-dropdown-contract/visual-compare/**`
- input:
  - 시나리오: maintainer가 full 15-state wrapper inventory의 current UI drift를 repo-local evidence로 남겨야 하는 경우
  - exact story ID inventory:
    - `windows-folder--compare-live-blog`
    - `windows-browser--compare-live-article`
    - `windows-folder--compare-live-search-open`
    - `windows-folder--compare-live-chip-open`
    - `windows-folder--compare-live-sidebar-hover`
    - `windows-folder--compare-live-sidebar-expanded`
    - `windows-folder--compare-live-thumbnail-hover`
    - `windows-browser--compare-live-address-open`
    - `windows-browser--compare-live-control-hover-minimize`
    - `windows-browser--compare-live-control-hover-maximize`
    - `windows-browser--compare-live-control-hover-close`
    - `windows-folder--compare-mobile-blog`
    - `windows-folder--compare-mobile-search-open`
    - `windows-browser--compare-mobile-article`
    - `windows-browser--compare-mobile-address-open`
  - exact capture owner:
    - `[data-window-compare-stage]`
  - exact metadata carrier:
    - nested single `[data-visual-root]`
    - `data-visual-kind = folder | browser`
    - `data-visual-state = live-blog | live-article | live-search-open | live-chip-open | live-sidebar-hover | live-sidebar-expanded | live-thumbnail-hover | live-address-open | live-control-hover-minimize | live-control-hover-maximize | live-control-hover-close | mobile-blog | mobile-search-open | mobile-article | mobile-address-open`
  - reference side:
    - Phase 1 baseline inventory와 local mirror capture
  - current side:
    - Phase 3 storybook/internal review inventory
- output:
  - 공개 계약:
    - current capture source는 exact story ID 15개뿐이다.
    - capture owner는 exact `[data-window-compare-stage]`다.
    - report는 exact 15 key, provenance, blocking pass/fail, advisory drift, artifact path를 적는다.
  - 내부 기본값:
    - `detail-variant` state도 report에서 빠지지 않는다.
    - body payload/copy detail drift는 state별 advisory로 남길 수 있다.
  - 허용하지 않는 대안:
    - 6-state alias나 old `imageScreen` label을 report row에 다시 쓰는 선택
    - stage 안의 inner wrapper를 canonical capture owner로 쓰는 선택
    - compare phase 안에서 source-tree UI fix를 수행하는 선택
- 작업:
  1. current capture script를 exact story ID 15개에 맞춘다.
  2. diff pipeline을 exact key와 provenance label로 정리한다.
  3. report에 15-state blocker/advisory drift를 적는다.
- 검증:
  - [ ] `capture-current.mjs`가 exact story ID 15개와 exact `[data-window-compare-stage]`만 current capture 대상으로 사용한다.
  - [ ] `run-diff.mjs`와 report가 exact `kind-state` naming과 provenance label을 공유한다.
  - [ ] `report.md`가 15 key 모두에 대해 provenance와 blocking/advisory 분리를 적는다.

## Phase 검증

| 검증 항목 | 확인 수단 | 기대 결과 |
| --- | --- | --- |
| exact current capture source 고정 | `capture-current.mjs` inspection | exact story ID 15개와 exact stage owner만 사용한다. |
| exact artifact key/provenance binding | `run-diff.mjs` inspection | baseline/current/diff/report가 same key와 provenance label을 공유한다. |
| 15-state report 완성 | `visual-compare/report.md` inspection | 15 key 모두에 provenance, pass/fail, advisory note가 남는다. |
