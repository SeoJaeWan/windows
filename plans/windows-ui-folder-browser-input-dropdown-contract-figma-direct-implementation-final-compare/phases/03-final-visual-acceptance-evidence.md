# Phase 3. 최종 시각 비교 수용 증빙

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | Phase 1 baseline asset과 Phase 2 runtime literal을 read-only로 사용해 current capture, diff artifact, final report를 남기고, 이미 잠긴 exact declared gating surface union inventory와 `scopedBlockingDiffRatio <= 0.05` / `globalDriftRatio` 규칙으로 pass 또는 explicit blocker를 판정한다. |
| 선행조건 | Phase 1의 `reference-captures/baseline-inventory.md`와 reference PNG 15개, Phase 2의 exact story inventory, runtime script, current-side harness smoke 결과가 모두 stable해야 한다. |
| 완료 판단 | `visual-compare/report.json`과 `visual-compare/report.md`만 읽어도 15개 key 각각의 provenance, blocking pass/fail, `scopedBlockingDiffRatio`, `globalDriftRatio`, artifact path를 추적할 수 있다. |
| 중단 조건 | compare phase가 product code, story layout, runtime literal을 수정해야 하거나, report가 exact key 대신 alias를 쓰면 blocker다. |

## 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs` | 실행 전용 | exact story inventory, exact storyId, exact stageAttr, exact host/origin, exact selector, exact viewport를 그대로 사용한다. | current capture가 same key naming으로 생성된다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/**` | 입력 전용 | reference side baseline identity는 이미 고정돼 있다. | compare phase가 baseline naming이나 provenance를 바꾸지 않는다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/storybook-static-server.cjs` | 실행 전용 | `packages/ui/storybook-static -> http://localhost:6007`, stdout `SERVER_READY`를 그대로 사용한다. | host/origin/readiness drift가 없다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/run-diff.mjs` | 실행 전용 | exact artifact naming, provenance label, `scopedBlockingDiffRatio`, threshold `0.05`, `globalDriftRatio`, blocking decision rule을 그대로 사용한다. | report row와 artifact filename이 같은 key를 쓰고 semantics drift가 없다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/*-current.png`, `*-diff.png`, `report.json`, `report.md` | 생성/갱신 | repo-local final compare evidence를 남긴다. | 15개 key 모두가 provenance, `scopedBlockingDiffRatio`, `globalDriftRatio`, pass 또는 explicit blocker를 기록한다. |

## 완료 증거

- current capture source가 `packages/ui/storybook-static -> http://localhost:6007`와 exact storyId 15개로 고정된다.
- stdout `SERVER_READY`와 capture-ready wait selector가 compare readiness contract로 유지된다.
- exact `[data-window-compare-stage]`만 capture owner로 사용하고 nested `[data-visual-root]`는 metadata carrier로만 읽는다.
- report가 `external-source evidence`와 `package-local current` provenance를 exact key별로 분리한다.
- blocking pass/fail과 advisory drift가 state별로 분리되고, 각 row는 `scopedBlockingDiffRatio`와 `globalDriftRatio`를 함께 가진다.
- Phase 3은 product code, storybook source, runtime literal을 수정하지 않는다.

## Phase 요약

| 항목 | 내용 |
| --- | --- |
| 목표 | exact 15-state key와 provenance를 가진 final compare evidence를 남기고, 고정된 exact declared gating surface union inventory와 blocking/advisory 규칙으로 acceptance를 판정한다. |
| 연결 작업 단위 | `locked reference contract와 repo-local baseline asset`, `compare runtime, root entry proof, final evidence` |
| 선행 조건 | Phase 1 baseline asset, Phase 2 exact story inventory와 runtime literal, `visual-compare/current-smoke/**` current-side smoke artifact |
| 검증 메모 | report가 exact 15 key, provenance, blocking/advisory 분리, `scopedBlockingDiffRatio`, `globalDriftRatio`, artifact path를 모두 가져야 한다. |
| 로컬 전제 계약 | 이 plan 안에는 후속 fix phase가 없으므로 mismatch는 same report 안의 explicit blocker로만 남겨 다음 revision 입력으로 넘긴다. |

## 작업 순서

| 순서 | 작업 단위 | 이번 단계에서 처리하는 내용 | 완료 조건 |
| --- | --- | --- | --- |
| 1 | current capture 실행 | exact story inventory와 runtime literal을 그대로 사용해 current capture 15개를 만든다. | current PNG naming이 exact key를 따른다. |
| 2 | diff pipeline 실행 | exact artifact naming, provenance label, `scopedBlockingDiffRatio <= 0.05` blocking rule, `globalDriftRatio` advisory rule로 diff artifact와 reports를 생성한다. | report row와 artifact file이 1:1로 대응하고 semantics drift가 없다. |
| 3 | acceptance 판정 기록 | 15개 key 각각에 대해 Phase 2가 잠근 exact declared gating surface union inventory의 blocker 여부, `scopedBlockingDiffRatio`, `globalDriftRatio`, blocking/advisory를 분리해 pass 또는 explicit blocker를 남긴다. | reviewer가 report만 보고 acceptance를 판정할 수 있다. |

## 작업 단위 A. current capture 실행과 canonical host canvas 유지

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | compare evidence가 Phase 2가 잠근 canonical host canvas를 감사한 결과여야지, compare phase가 임의로 재구성한 screenshot이면 안 된다. |
| 현재 문제 | inner wrapper screenshot, viewport crop, compare-time layout tweak는 artifact를 그럴듯하게 보여도 promised recipient를 감사한 결과가 아니다. |
| 목표 상태 | current capture가 exact storyId 15개, exact stageAttr 15개, exact host/origin, exact selector, exact viewport, exact current naming만 사용한다. |
| 유지 경계 | compare phase 안에서 source-tree UI fix나 story runtime 변경은 수행하지 않는다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs` | 실행 | exact story inventory와 runtime literal만 읽어야 한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/storybook-static-server.cjs` | 실행 | `http://localhost:6007`와 `SERVER_READY`를 그대로 사용해야 한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/*-current.png` | 생성 | current artifact naming이 exact key와 1:1이어야 한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | exact story inventory 15개, exact `storyId`, exact `stageAttr`, exact `[data-window-compare-stage]`, exact nested `[data-visual-root]`, `http://localhost:6007`, stdout `SERVER_READY`, `1280x800`, `{kind}-{state}-current.png` |
| state ownership | capture script는 current artifact를 소유하고, baseline inventory는 reference-side provenance를 소유한다. |
| callback / handoff | 없음 |
| no-op / invalid rule | support-only story, alias storyId, inner wrapper capture, viewport crop, manual rename, compare-time host/origin/readiness 재정의는 invalid다. |
| 추가 관찰 포인트 | stageAttr values는 exact `desktop`, `mobile` only이고 live cases는 `desktop`, mobile cases는 `mobile`이다. |

### 시각 패리티 계약

| 항목 | 내용 |
| --- | --- |
| comparison mode | `structural parity` |
| gating metric | exact key와 exact host canvas binding이 유지돼야 state-level blocker를 추적할 수 있다. |
| non-gating metric | `none` |
| local surface | current Storybook compare stage, current artifact naming |
| canonical surface role | `frame-surface`, `control-surface`, `content-surface`, `media-surface`, `fixture-payload-surface` |
| comparison policy | key/owner binding은 `gating`이다. |
| metric treatment | `boundary-and-geometry` |

### 검증 근거

| 항목 | 확인 수단 |
| --- | --- |
| exact story inventory current capture | capture execution/inspection |
| exact host/origin/readiness 재사용 | script inspection |

## 작업 단위 B. diff pipeline과 final report

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | reviewer는 무엇이 어긋났는지뿐 아니라 어떤 baseline provenance를 기준으로 어긋났는지, blocking인지 advisory인지까지 exact key로 알아야 한다. |
| 현재 문제 | provenance, blocking/advisory metric semantics, artifact naming이 흐리면 report가 acceptance evidence가 아니라 참고 메모로 전락한다. |
| 목표 상태 | report가 15개 key 각각에 대해 provenance, blocking pass/fail, `scopedBlockingDiffRatio`, `globalDriftRatio`, advisory drift, artifact path를 same key로 남긴다. |
| 유지 경계 | report는 contract 확장, 새 public prop 제안, runtime literal 수정 권한을 가지지 않는다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/run-diff.mjs` | 실행 | `scopedBlockingDiffRatio`, threshold `0.05`, `globalDriftRatio`, provenance label, diff naming이 exact key를 재사용해야 한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/report.json` | 생성 | machine-readable final result가 15개 key 모두를 담아야 한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/report.md` | 생성 | reviewer-facing report가 15개 key와 provenance, pass/fail, advisory drift를 적어야 한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | 15-state compare report row, exact diff artifact path, exact provenance label, `scopedBlockingDiffRatio`, `globalDriftRatio`, pass 또는 explicit blocker |
| state ownership | report taxonomy와 provenance labeling은 compare phase가 소유한다. |
| callback / handoff | report가 다음 revision에 exact mismatch key와 drift category를 handoff한다. |
| no-op / invalid rule | whole-canvas mismatch 하나만으로 pass/fail을 결정하지 않는다. provenance를 한 단어 `reference`로 뭉뚱그리지 않는다. real baseline evidence가 없으면 pass로 닫지 않는다. `scopedBlockingDiffRatio`와 `globalDriftRatio`를 뒤집어 쓰는 해석도 invalid다. |
| 추가 관찰 포인트 | `report.md`와 `report.json`은 같은 key와 같은 provenance wording, 같은 `scopedBlockingDiffRatio`, 같은 `globalDriftRatio`를 공유해야 한다. |

### 시각 패리티 계약

| 항목 | 내용 |
| --- | --- |
| comparison mode | `structural parity` |
| gating metric | Phase 2가 잠근 아래 exact declared gating surface union inventory 6개 row에 대해 boundary/anchor/geometry blocker가 없고 `scopedBlockingDiffRatio <= 0.05` |
| non-gating metric | `globalDriftRatio`와 payload/copy/glyph drift summary |
| local surface | report row, artifact path, provenance label |
| canonical surface role | `frame-surface`, `control-surface`, `content-surface`, `media-surface`, `fixture-payload-surface` |
| comparison policy | declared gating surface는 `gating`, payload/copy/glyph drift와 whole-canvas drift는 `advisory` |
| metric treatment | gating surface는 `boundary-and-geometry`, advisory global drift는 `full-compare` |

### 선언된 gating surface union 인벤토리

| 비교 상태/범위 | comparison mode | gating metric | non-gating metric | 로컬 surface 메모 |
| --- | --- | --- | --- | --- |
| `folder/live-blog`, `folder/live-search-open`, `folder/live-chip-open` | `structural parity` | declared gating surface union(`frame-surface`, `navigation-surface`, `control-surface`, `content-surface`, `media-surface`)에 대해 input/dropdown/chip anchor, card hierarchy blocker가 없고 `scopedBlockingDiffRatio <= 0.05` | `globalDriftRatio`와 chip text, dropdown row copy, thumbnail art, icon glyph detail | titlebar, location input, search input, chips, dropdown, sidebar, card grid |
| `folder/live-sidebar-hover`, `folder/live-sidebar-expanded`, `folder/live-thumbnail-hover` | `structural parity` | declared gating surface union(`navigation-surface`, `control-surface`, `content-surface`, `media-surface`)에 대해 sidebar hover fill, expanded width, thumbnail hover affordance, list/card alignment blocker가 없고 `scopedBlockingDiffRatio <= 0.05` | `globalDriftRatio`와 exact row copy, icon glyph, shadow blur | sidebar hover/expanded pane, thumbnail hover ornament |
| `browser/live-article`, `browser/live-address-open` | `structural parity` | declared gating surface union(`frame-surface`, `control-surface`, `content-surface`)에 대해 address dropdown anchor/width/row density blocker가 없고 `scopedBlockingDiffRatio <= 0.05` | `globalDriftRatio`와 article copy, cover art, dropdown row copy | nav controls, address input, dropdown, article body |
| `browser/live-control-hover-minimize`, `browser/live-control-hover-maximize`, `browser/live-control-hover-close` | `structural parity` | declared gating surface union(`frame-surface`, `control-surface`)에 대해 control hover placement, fill, active affordance, chrome spacing blocker가 없고 `scopedBlockingDiffRatio <= 0.05` | `globalDriftRatio`와 glyph raster, minute shadow detail | window control cluster hover surface |
| `folder/mobile-blog`, `folder/mobile-search-open` | `structural parity` | declared gating surface union(`frame-surface`, `control-surface`, `content-surface`, `media-surface`)에 대해 mobile content-first grid, title/search hierarchy, open dropdown anchor blocker가 없고 `scopedBlockingDiffRatio <= 0.05` | `globalDriftRatio`와 exact copy, thumbnail art, fine icon detail | mobile titlebar, search row, grid cards, dropdown |
| `browser/mobile-article`, `browser/mobile-address-open` | `structural parity` | declared gating surface union(`frame-surface`, `control-surface`, `content-surface`)에 대해 simplified chrome, mobile reading hierarchy, address-open anchor blocker가 없고 `scopedBlockingDiffRatio <= 0.05` | `globalDriftRatio`와 article copy, cover art, glyph detail | mobile titlebar, address row, dropdown, article body |

### 검증 근거

| 항목 | 확인 수단 |
| --- | --- |
| provenance 분리 여부 | report inspection |
| `scopedBlockingDiffRatio` / `globalDriftRatio` 분리 여부 | report inspection |
| blocking/advisory 분리 여부 | report inspection |

## 실행 계약

- owner_agent: `visual-comparator`
- 목적:
  - Figma baseline과 current Storybook surface를 exact 15 key로 비교하고 repo-local final acceptance evidence를 남긴다.
- boundary:
  - `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs`
  - `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/**`
  - `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/**`
- input:
  - 시나리오: maintainer가 full 15-state visual compare를 실행해 acceptance 여부를 판정해야 하는 경우
  - exact prerequisites from Phase 1:
    - `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/baseline-inventory.md`
    - exact `{kind}-{state}-reference.png` 15개
    - reference provenance label: `external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / wrapper "{key}"`
  - exact prerequisites from Phase 2:
    - exact story inventory 15개
    - current-side smoke output root: `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/current-smoke`
    - current-side smoke rule:
      - `node plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs --mode smoke --output-dir plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/current-smoke`가 이미 green이어야 한다.
      - smoke path는 same story inventory, same host/origin/readiness, same selector, same viewport를 current-only로 검증하고 reference baseline과 diff/report는 소비하지 않는다.
    - exact stageAttr values: `desktop`, `mobile`
    - exact story URL shape: `http://localhost:6007/iframe.html?id={storyId}&viewMode=story`
    - exact capture-ready wait selector: `[data-window-compare-stage="{stageAttr}"] [data-visual-root][data-visual-kind="{kind}"][data-visual-state="{state}"]`
    - exact capture owner: `[data-window-compare-stage]`
    - exact metadata carrier: nested single `[data-visual-root]`
    - exact host/origin: `http://localhost:6007`
    - exact readiness signal: stdout `SERVER_READY`
    - exact viewport: `1280x800`
    - exact artifact naming:
      - reference: `{kind}-{state}-reference.png`
      - current: `{kind}-{state}-current.png`
      - diff: `{kind}-{state}-diff.png`
    - current provenance label: `package-local current — packages/ui Storybook / [data-window-compare-stage]`
    - blocking scoped diff metric: `scopedBlockingDiffRatio = mismatchedPixels / totalPixelsInsideDeclaredGatingSurfaces`
    - blocking threshold: `0.05`
    - advisory global drift metric: `globalDriftRatio = mismatchedPixels / totalPixelsInsideWholeCaptureCanvas`
    - exact declared gating surface unions:
      - `folder/live-blog`, `folder/live-search-open`, `folder/live-chip-open` -> `frame-surface`, `navigation-surface`, `control-surface`, `content-surface`, `media-surface`
      - `folder/live-sidebar-hover`, `folder/live-sidebar-expanded`, `folder/live-thumbnail-hover` -> `navigation-surface`, `control-surface`, `content-surface`, `media-surface`
      - `browser/live-article`, `browser/live-address-open` -> `frame-surface`, `control-surface`, `content-surface`
      - `browser/live-control-hover-minimize`, `browser/live-control-hover-maximize`, `browser/live-control-hover-close` -> `frame-surface`, `control-surface`
      - `folder/mobile-blog`, `folder/mobile-search-open` -> `frame-surface`, `control-surface`, `content-surface`, `media-surface`
      - `browser/mobile-article`, `browser/mobile-address-open` -> `frame-surface`, `control-surface`, `content-surface`
    - blocking decision rule:
      - each state passes only when every declared gating surface from the exact union inventory above is present, boundary/anchor/geometry blocker is absent, and `scopedBlockingDiffRatio <= 0.05`
      - otherwise the state result is `explicit blocker`
      - `globalDriftRatio` is always reported but never blocks by itself
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
    - current capture source는 exact 15 key, exact storyId, exact stageAttr, exact selector, exact host/origin/readiness를 그대로 사용한다.
    - report는 exact 15 key, provenance, blocking pass/fail, `scopedBlockingDiffRatio`, `globalDriftRatio`, advisory drift, artifact path를 기록한다.
    - final result는 pass 또는 explicit blocker다.
  - 내부 기본값:
    - `detail-variant` state도 report에서 빠지지 않는다.
    - compare phase는 product code나 runtime literal을 수정하지 않는다.
  - 허용하지 않는 대안:
    - proxy baseline, placeholder baseline, stale alias를 final evidence로 쓰는 선택
    - compare phase 안에서 source-tree UI fix를 수행하는 선택
    - same-plan 안에 후속 fix phase를 추가하는 선택
- 작업:
  1. current capture script를 exact inventory에 맞춰 실행한다.
  2. diff pipeline을 exact key, provenance, `scopedBlockingDiffRatio <= 0.05`, `globalDriftRatio` 규칙으로 실행한다.
  3. final report에 15-state blocker/advisory drift를 적고 pass 또는 explicit blocker를 남긴다.
- 검증:
  - [ ] current capture가 exact story inventory, exact selector, exact host/origin/readiness, exact viewport를 그대로 사용한다.
  - [ ] diff artifacts와 report가 same key, same provenance wording, same `scopedBlockingDiffRatio`, same threshold `0.05`, same `globalDriftRatio`를 공유한다.
  - [ ] declared gating surface union inventory 6개 row가 `plan.md`, Phase 2 detail, 현재 detail에서 같은 surface set으로 반복된다.
  - [ ] `report.json`과 `report.md`가 15개 key 모두에 대해 provenance와 blocking/advisory 분리, `scopedBlockingDiffRatio`, `globalDriftRatio`를 가진다.
  - [ ] Phase 3은 product code나 runtime literal을 수정하지 않는다.

## Phase 검증

| 검증 항목 | 확인 수단 | 기대 결과 |
| --- | --- | --- |
| exact current capture source 유지 | script execution/inspection | same inventory, same selector, same host/origin, same viewport를 사용한다. |
| exact provenance/metric binding | diff execution/inspection | artifact와 report가 same key, same provenance, same `scopedBlockingDiffRatio`, same threshold, same `globalDriftRatio`를 쓴다. |
| exact declared gating surface union literal reuse | report inspection, detail inspection | 6개 row의 surface union이 top-level/Phase 2/Phase 3에서 같고 report가 그 union만 blocking 분모로 사용한다. |
| 15-state final report 완성 | `report.json`, `report.md` inspection | 15개 key 모두에 provenance, pass/fail, `scopedBlockingDiffRatio`, `globalDriftRatio`, advisory note가 남는다. |
| compare-only phase 유지 | generated artifact inspection | source-tree product code와 runtime literal 변경 없이 compare evidence만 남는다. |
