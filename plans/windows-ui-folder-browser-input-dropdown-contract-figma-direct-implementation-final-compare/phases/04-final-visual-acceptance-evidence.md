# Phase 4. 최종 시각 비교 수용 증빙

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | Phase 1의 real Figma baseline과 Phase 3의 exact compare runtime을 그대로 실행해 current capture, diff artifact, final report를 남기고 pass 또는 explicit blocker를 판정한다. |
| 선행조건 | Phase 1의 exact 15 key, provenance, real reference capture 15개와 Phase 3의 actual story ID 15개, exact stageAttr values `desktop` / `mobile`, per-case stageAttr mapping 15개, build output `packages/ui/storybook-static`, canonical host `http://localhost:6007`, stdout `SERVER_READY`, capture-ready wait selector `[data-window-compare-stage="{stageAttr}"] [data-visual-root][data-visual-kind="{kind}"][data-visual-state="{state}"]`, exact `[data-window-compare-stage]`, exact nested `[data-visual-root]`, viewport `1280x800`, threshold `0.05` 계약이 모두 stable해야 한다. |
| 완료 판단 | `visual-compare/report.md`와 `visual-compare/report.json`만 읽어도 15 key 각각의 provenance, blocking pass/fail, advisory drift, artifact path를 exact key로 다시 추적할 수 있다. |
| 중단 조건 | current capture가 support-only story를 섞거나, report가 exact 15 key 대신 alias를 쓰거나, compare phase가 product code/story layout/runtime contract를 수정해야 한다면 blocker다. |

## 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs` | 실행 전용 | exact story ID 15개, exact stageAttr values `desktop` / `mobile`, per-case stageAttr mapping 15개, build output `packages/ui/storybook-static`, canonical host `http://localhost:6007`, stdout `SERVER_READY`, exact `iframe.html?id={storyId}&viewMode=story`, capture-ready wait selector, viewport `1280x800`, exact `[data-window-compare-stage]`만 current capture 대상으로 사용한다. | support-only story, stale alias, inner wrapper capture, compare-time host/origin drift, compare-time stageAttr invention이 남지 않는다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/storybook-static-server.cjs` | 실행 전용 | Phase 3가 잠근 static serving boundary를 그대로 사용해 `packages/ui/storybook-static`를 `http://localhost:6007`에 올리고 stdout `SERVER_READY`를 유지한다. | Phase 4가 host/origin을 새로 정하지 않는다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/run-diff.mjs` | 실행 전용 | baseline/current/diff/report artifact naming, provenance label, threshold `0.05`는 exact `kind/state` key를 공유한다. | report row와 artifact file naming drift가 없다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/*-current.png`, `*-diff.png`, `report.json`, `report.md` | 생성/갱신 | 15-state current capture, diff artifact, final report가 same contract로 남는다. | 모든 row가 pass 또는 explicit blocker/advisory를 exact key로 기록한다. |

## 완료 증거

- current capture source가 build output `packages/ui/storybook-static -> http://localhost:6007`와 exact story ID 15개로 고정된다.
- stdout `SERVER_READY`와 capture-ready wait selector가 고정돼 compare phase가 readiness를 다시 추측하지 않는다.
- exact `[data-window-compare-stage]`만 capture owner로 쓰고 nested `[data-visual-root]`는 metadata carrier로만 읽는다.
- report가 `external-source evidence`와 `package-local current` provenance를 혼동하지 않는다.
- blocking pass/fail과 advisory drift가 state별로 분리된다.
- Phase 4는 product code, storybook source, compare runtime contract를 수정하지 않는다.

## Phase 요약

| 항목 | 내용 |
| --- | --- |
| 목표 | exact 15-state key와 provenance를 가진 final compare evidence를 남기고 acceptance를 판정한다. |
| 연결 작업 단위 | `Figma MCP spec artifact와 reference inventory`, `Storybook compare inventory, compare runtime, root entry proof` |
| 선행 조건 | Phase 1 real reference capture, Phase 3 exact story inventory와 runtime contract (`packages/ui/storybook-static -> http://localhost:6007`, stdout `SERVER_READY`, capture-ready wait selector 포함) |
| 검증 메모 | report가 exact 15 key, provenance, blocking/advisory 분리, artifact path를 모두 가져야 하고 compare phase는 실행만 해야 한다. |
| 로컬 전제 계약 | 이 plan 안에는 후속 fix phase가 없으므로 mismatch는 same report 안의 explicit blocker로 남겨 다음 revision 입력으로 넘겨야 한다. |

## 작업 순서

| 순서 | 작업 단위 | 이번 단계에서 처리하는 내용 | 완료 조건 |
| --- | --- | --- | --- |
| 1 | current capture 실행 | Phase 3가 잠근 build output root, host/origin, `SERVER_READY`, story ID, URL shape, viewport, capture-ready wait selector, selector를 그대로 사용해 current capture 15개를 생성한다. | current artifact가 same key naming을 쓴다. |
| 2 | diff pipeline 실행 | baseline/current/diff/report artifact naming과 provenance labeling을 same key와 threshold로 묶는다. | report row와 artifact file이 1:1로 대응한다. |
| 3 | acceptance report 기록 | blocking/advisory drift를 state별로 분리해 final report를 남긴다. | reviewer가 report만 보고 acceptance 또는 explicit blocker를 판단할 수 있다. |

## 작업 단위 A. current capture 실행과 artifact key binding

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | final compare가 acceptance evidence only phase로 기능하려면 current capture source와 artifact naming이 exact key와 exact runtime을 그대로 사용해야 한다. |
| 현재 문제 | capture source, host/origin, ready rule, selector가 phase 안에서 바뀌면 compare evidence는 plausible해 보여도 Phase 3가 잠근 canonical host canvas를 감사한 결과가 아니다. |
| 목표 상태 | current capture script가 `packages/ui/storybook-static -> http://localhost:6007`, stdout `SERVER_READY`, exact story ID 15개, exact capture-ready wait selector만 읽고, current artifact naming이 exact `{kind}-{state}-current.png`를 쓴다. |
| 유지 경계 | compare phase 안에서 source-tree UI fix나 story layout 조정은 수행하지 않는다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs` | 실행 | current capture source가 exact story ID 15개만 읽어야 한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/storybook-static-server.cjs` | 실행 | current capture host/origin이 `packages/ui/storybook-static -> http://localhost:6007`으로 고정돼야 한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/*-current.png` | 생성 | current artifact naming이 exact key와 1:1이어야 한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | exact story ID 15개, exact `data-window-compare-stage` values `desktop | mobile`, capture-ready wait selector `[data-window-compare-stage="{stageAttr}"] [data-visual-root][data-visual-kind="{kind}"][data-visual-state="{state}"]`, build output `packages/ui/storybook-static`, canonical host `http://localhost:6007`, stdout `SERVER_READY`, exact `iframe.html?id={storyId}&viewMode=story`, viewport `1280x800`, exact `[data-window-compare-stage]`, exact `{kind}-{state}-current.png` naming |
| state ownership | capture script는 current artifact를 소유하고, baseline inventory는 reference-side provenance를 소유한다. |
| callback / handoff | 없음 |
| no-op / invalid rule | support-only story, stale alias, manual file rename, inner wrapper capture, viewport crop, compare-time story layout 변경, compare-time host/origin/readiness 재정의는 invalid path다. |
| 추가 관찰 포인트 | nested `[data-visual-root]`는 metadata carrier다. canonical capture owner는 항상 `[data-window-compare-stage]`다. stageAttr values는 정확히 `desktop`, `mobile` 두 개뿐이고 live cases는 `desktop`, mobile cases는 `mobile`을 쓴다. `SERVER_READY` 이전에 iframe을 열거나 capture-ready wait selector 없이 screenshot을 찍는 흐름은 허용하지 않는다. |

### 시각 패리티 계약

| 항목 | 내용 |
| --- | --- |
| comparison mode | `structural parity` |
| gating metric | exact key와 exact capture owner binding이 유지돼야 state-level blocker를 추적할 수 있다. |
| non-gating metric | `none` |
| local surface | current Storybook compare stage, current artifact naming |
| canonical surface role | `frame-surface`, `control-surface`, `content-surface`, `media-surface`, `fixture-payload-surface` |
| comparison policy | key/owner binding은 `gating`이다. |
| metric treatment | `boundary-and-geometry` |

### 검증 근거

| 항목 | 확인 수단 |
| --- | --- |
| exact story ID 15개 current capture | capture script execution/inspection |
| exact static host/origin/readiness 재사용 | `capture-current.mjs`, `storybook-static-server.cjs` inspection |
| exact artifact key binding | generated current PNG inspection |

## 작업 단위 B. diff pipeline과 acceptance report

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | reviewer는 “무엇이 어긋났는가”뿐 아니라 “어떤 provenance를 기준으로 어긋났는가”와 “blocking인지 advisory인지”를 exact key로 알아야 한다. |
| 현재 문제 | provenance, threshold, artifact naming이 흐리면 report가 compare evidence가 아니라 참고 메모로 전락한다. |
| 목표 상태 | report가 15 key 각각에 대해 provenance, blocking pass/fail, advisory drift, artifact path를 same key로 남긴다. |
| 유지 경계 | report는 contract 확장, 새 public prop 제안, story/runtime 재정의를 하지 않는다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/run-diff.mjs` | 실행 | threshold `0.05`, provenance label, diff artifact naming이 exact key를 재사용해야 한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/report.json` | 생성 | machine-readable final result가 15 key 모두를 담아야 한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/report.md` | 생성 | reviewer-facing final report가 15 key 모두와 provenance, pass/fail, advisory drift를 적어야 한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | 15-state compare report row, exact diff artifact path, exact provenance label |
| state ownership | report taxonomy와 provenance labeling은 compare phase가 소유한다. |
| callback / handoff | report가 다음 revision에 exact mismatch key와 drift category를 handoff한다. |
| no-op / invalid rule | whole-canvas mismatch 하나만으로 pass/fail을 결정하지 않는다. provenance를 `reference` 한 단어로 뭉뚱그리지 않는다. real reference capture가 없으면 pass로 닫지 않는다. |
| 추가 관찰 포인트 | `external-source evidence — Figma ...`와 `package-local current — packages/ui Storybook / [data-window-compare-stage]`를 row마다 분리해 적는다. |

### 시각 패리티 계약

| 항목 | 내용 |
| --- | --- |
| comparison mode | `structural parity` |
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
  - Figma 3:2 wrapper baseline과 current Storybook surface를 exact 15 key로 비교하고 final acceptance evidence를 repo-local artifact로 남긴다.
- boundary:
  - `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs`
  - `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/**`
  - `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/**`
- input:
  - 시나리오: maintainer가 full 15-state wrapper inventory의 final compare를 실행해 acceptance 여부를 판정해야 하는 경우
  - exact prerequisites from Phase 1:
    - `baseline-inventory.md`
    - real `{kind}-{state}-reference.png` capture 15개
    - reference provenance label: `external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / wrapper "{key}"`
  - exact prerequisites from Phase 3:
    - stage attribute values: `desktop`, `mobile`
    - exact stageAttr mapping:
      - `folder/live-blog -> desktop`
      - `folder/live-search-open -> desktop`
      - `folder/live-chip-open -> desktop`
      - `folder/live-sidebar-hover -> desktop`
      - `folder/live-sidebar-expanded -> desktop`
      - `folder/live-thumbnail-hover -> desktop`
      - `folder/mobile-blog -> mobile`
      - `folder/mobile-search-open -> mobile`
      - `browser/live-article -> desktop`
      - `browser/live-address-open -> desktop`
      - `browser/live-control-hover-minimize -> desktop`
      - `browser/live-control-hover-maximize -> desktop`
      - `browser/live-control-hover-close -> desktop`
      - `browser/mobile-article -> mobile`
      - `browser/mobile-address-open -> mobile`
    - actual story ID 15개
    - build output root: `packages/ui/storybook-static`
    - actual story ID 15개
    - build output root: `packages/ui/storybook-static`
    - static serving helper: `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/storybook-static-server.cjs`
    - canonical current origin: `http://localhost:6007`
    - serving-ready signal: stdout exact `SERVER_READY`
    - capture URL shape: `http://localhost:6007/iframe.html?id={storyId}&viewMode=story`
    - capture-ready wait selector: `[data-window-compare-stage="{stageAttr}"] [data-visual-root][data-visual-kind="{kind}"][data-visual-state="{state}"]`
    - pre-screenshot assertion: exact `[data-window-compare-stage="{stageAttr}"]` 안에 matching `[data-visual-root]`가 정확히 1개여야 하며 kind/state mismatch면 abort
    - viewport: `1280x800`
    - capture owner: `[data-window-compare-stage]`
    - metadata carrier: nested single `[data-visual-root]`
    - current provenance label: `package-local current — packages/ui Storybook / [data-window-compare-stage]`
    - diff threshold: `0.05`
  - exact compare key inventory:
    - `folder/live-blog`
    - `folder/live-search-open`
    - `folder/live-chip-open`
    - `folder/live-sidebar-hover`
    - `folder/live-sidebar-expanded`
    - `folder/live-thumbnail-hover`
    - `folder/mobile-blog`
    - `folder/mobile-search-open`
    - `browser/live-article`
    - `browser/live-address-open`
    - `browser/live-control-hover-minimize`
    - `browser/live-control-hover-maximize`
    - `browser/live-control-hover-close`
    - `browser/mobile-article`
    - `browser/mobile-address-open`
- output:
  - 공개 계약:
    - current capture source는 `packages/ui/storybook-static -> http://localhost:6007`, stdout `SERVER_READY`, exact story ID 15개뿐이다.
    - capture owner는 exact `[data-window-compare-stage]`다.
    - stageAttr values는 정확히 `desktop`, `mobile` 두 개뿐이고 15개 compare case는 미리 잠근 per-case mapping만 따른다.
    - report는 exact 15 key, provenance, blocking pass/fail, advisory drift, artifact path를 적는다.
    - pass 또는 explicit blocker는 final report에서만 선언한다.
  - 내부 기본값:
    - `detail-variant` state도 report에서 빠지지 않는다.
    - advisory drift는 남길 수 있지만 blocker는 exact key와 이유를 함께 적어야 한다.
    - compare phase는 product code/storybook source/runtime contract를 수정하지 않는다.
  - 허용하지 않는 대안:
    - proxy baseline, placeholder baseline, stale alias를 final acceptance evidence로 쓰는 선택
    - stage 안의 inner wrapper를 canonical capture owner로 쓰는 선택
    - compare phase 안에서 source-tree UI fix를 수행하는 선택
    - same-plan 안에 후속 fix phase를 추가하는 선택
- 작업:
  1. current capture script를 exact story ID 15개에 맞춰 실행한다.
  2. diff pipeline을 exact key, provenance label, threshold `0.05`로 실행한다.
  3. final report에 15-state blocker/advisory drift를 적고 pass 또는 explicit blocker를 남긴다.
- 검증:
  - [ ] `capture-current.mjs`와 `visual-compare/storybook-static-server.cjs`가 exact story ID 15개, exact stageAttr mapping 15개, build output `packages/ui/storybook-static`, host `http://localhost:6007`, stdout `SERVER_READY`, capture-ready wait selector, viewport `1280x800`, exact `[data-window-compare-stage]`만 current capture 대상으로 사용한다.
  - [ ] `run-diff.mjs`와 final report가 exact `kind/state` naming, provenance label, threshold `0.05`를 공유한다.
  - [ ] `report.json`과 `report.md`가 15 key 모두에 대해 provenance와 blocking/advisory 분리를 적는다.
  - [ ] Phase 4는 product code나 story/runtime contract를 수정하지 않는다.

## Phase 검증

| 검증 항목 | 확인 수단 | 기대 결과 |
| --- | --- | --- |
| exact current capture source 고정 | `capture-current.mjs`, `visual-compare/storybook-static-server.cjs` execution/inspection | exact build output root, host/origin, `SERVER_READY`, story ID 15개, exact stageAttr mapping 15개, exact stage owner만 사용한다. |
| exact artifact key/provenance/threshold binding | `run-diff.mjs` execution/inspection | baseline/current/diff/report가 same key, provenance label, threshold를 공유한다. |
| 15-state final report 완성 | `visual-compare/report.json`, `visual-compare/report.md` inspection | 15 key 모두에 provenance, pass/fail, advisory note가 남는다. |
| compare-only phase 유지 | generated artifacts inspection | source-tree product code나 story/runtime contract 수정 없이 compare evidence만 남는다. |
