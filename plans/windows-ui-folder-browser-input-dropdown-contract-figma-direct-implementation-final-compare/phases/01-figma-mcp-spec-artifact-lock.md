# Phase 1. Figma MCP spec artifact 잠금

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | Figma file `NrUGKPZUewpuA8XuHI0v5n` / canvas `3:2`의 live HTML wrapper 15개를 현재 slug의 canonical spec artifact, baseline inventory, reference capture naming으로 고정한다. |
| 선행조건 | `none` |
| 완료 판단 | `spec/figma-mcp-artifact.md`, `reference-captures/baseline-inventory.md`, `reference-captures/*.png`만 읽어도 exact 15 key, `__section-mobile`, state role, provenance, capture naming, stale legacy rejection을 다시 추측하지 않아도 된다. |
| 중단 조건 | canonical provenance를 checkpoints plan이나 old scope plan, `7:* image-node`, `imageScreen`, placeholder/proxy baseline에 다시 의존해야 하면 blocker다. |

## 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/spec/figma-mcp-artifact.md` | 생성 | canonical source는 `file key + canvas 3:2 + frame/canvas name + visible wrapper label`이다. clean-slate implementation direction과 exact `kind/state` key schema를 함께 적는다. | 문서 하나만 읽어도 Figma source, wrapper inventory, state role, compare key schema가 literal하게 보인다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/baseline-inventory.md` | 생성 | 각 row는 `state key`, `wrapper label`, `section`, `state role`, `provenance`, `capture filename`을 함께 가진다. | inventory가 desktop 11개 + mobile 4개, 총 15 key를 literal하게 기록한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/*.png` | 생성/갱신 | Figma MCP `get_screenshot` 결과를 exact `{kind}-{state}-reference.png` naming으로 저장한다. placeholder, 1x1, proxy baseline은 acceptance baseline이 아니다. | inventory와 file naming이 1:1로 맞고 real reference capture 15개가 Phase 4 compare 입력으로 재사용 가능하다. |

## 완료 증거

- canonical inventory가 `folder/live-blog`부터 `browser/mobile-address-open`까지 exact 15 key를 가진다.
- mobile wrapper 4개가 `__section-mobile` 하위 canonical section으로 기록된다.
- `folder/live-chip-open`, hover/expanded/control-hover state가 `detail-variant`로 분류되지만 inventory 자체에서는 빠지지 않는다.
- reference capture 15개가 Figma MCP `get_screenshot` 기준으로 exact `{kind}-{state}-reference.png` naming을 따른다.
- old `imageScreen`, `7:* image-node`, 6-state wording과 placeholder/proxy baseline이 canonical provenance에서 제거된다.

## Phase 요약

| 항목 | 내용 |
| --- | --- |
| 목표 | Figma MCP source, 15-state wrapper inventory, real reference capture naming을 새 slug 아래 self-contained artifact로 잠근다. |
| 연결 작업 단위 | `Figma MCP spec artifact와 reference inventory` |
| 선행 조건 | `none` |
| 검증 메모 | spec artifact와 baseline inventory만 읽어도 15 key, state role, provenance, reference capture naming이 모두 보여야 한다. |
| 로컬 전제 계약 | Phase 2와 Phase 3은 `spec/figma-mcp-artifact.md`, `reference-captures/baseline-inventory.md`, exact `{kind}-{state}-reference.png` naming을 read-only prerequisite로 그대로 사용해야 한다. |

## 작업 순서

| 순서 | 작업 단위 | 이번 단계에서 처리하는 내용 | 완료 조건 |
| --- | --- | --- | --- |
| 1 | Figma MCP provenance와 spec artifact | file key, canvas `3:2`, frame/canvas name, clean-slate direction, exact `kind/state` key schema를 current slug 문서에 고정한다. | `figma-mcp-artifact.md`에 exact source와 schema가 literal하게 적힌다. |
| 2 | wrapper inventory와 state role | 15 visible wrapper를 `contract-bearing` / `detail-variant`로 분류하고 desktop/mobile section을 고정한다. | `baseline-inventory.md`가 15 key, section, state role을 모두 가진다. |
| 3 | real reference capture binding | inventory key와 Figma MCP `get_screenshot` capture naming을 1:1로 묶는다. | later compare가 exact `{kind}-{state}-reference.png`만 읽으면 된다. |

## 작업 단위 A. Figma MCP spec artifact

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | 새 slug는 이전 slug를 열지 않아도 되는 self-contained execution artifact여야 하고, frontend 구현 단계가 Figma MCP/spec artifact를 직접 입력으로 사용해야 한다. |
| 현재 문제 | 새 slug에는 authoritative Figma source와 clean-slate direction을 한 문서로 묶은 artifact가 없어서 later phase가 checkpoints plan과 old scope plan을 다시 참조해야 한다. |
| 목표 상태 | `spec/figma-mcp-artifact.md`가 Figma source, 15 key inventory, state role taxonomy, compare key schema, clean-slate direction을 한 번에 잠근다. |
| 유지 경계 | source-tree UI, public props, compare runtime script는 이 phase에서 열지 않는다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/spec/figma-mcp-artifact.md` | 변경 | exact source, key schema, state role, clean-slate direction이 모두 보여야 한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | `figma-mcp-artifact.md`의 `source`, `inventory`, `state role`, `key schema`, `clean-slate direction` 표/목록 |
| state ownership | Figma 3:2 wrapper source가 visual truth를 소유하고, plan-local spec artifact는 textual contract와 key schema만 소유한다. |
| callback / handoff | 없음 |
| no-op / invalid rule | checkpoints plan이나 old scope plan 문구, `7:* image-node`, `imageScreen`, 6-state naming을 canonical source로 재사용하지 않는다. |
| 추가 관찰 포인트 | `detail-variant`는 out-of-scope가 아니라 compare/review inventory 안의 review-only ownership을 뜻한다. |

### 시각 패리티 계약

| 항목 | 내용 |
| --- | --- |
| comparison mode | `structural parity` |
| gating metric | exact 15 key, section, provenance, reference capture naming이 later compare와 동일한 inventory를 제공해야 한다. |
| non-gating metric | `none` |
| local surface | Figma wrapper blocks, desktop wrapper set, `__section-mobile` wrapper set |
| canonical surface role | `frame-surface`, `control-surface`, `content-surface`, `media-surface`, `fixture-payload-surface` |
| comparison policy | spec artifact와 inventory freeze는 `gating`이다. |
| metric treatment | `boundary-and-geometry` |

### 검증 근거

| 항목 | 확인 수단 |
| --- | --- |
| Figma source와 key schema 고정 | spec artifact inspection |
| clean-slate direction 고정 | spec artifact inspection |

## 작업 단위 B. baseline inventory와 real reference capture binding

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | user는 full 15-state coverage를 원하지만 detail states를 separate public contract로 승격하길 원하지 않았고, final compare는 real Figma baseline을 읽어야 한다. |
| 현재 문제 | inventory와 capture naming이 분리돼 있으면 later phase가 state inventory를 다시 추정하거나 placeholder/proxy baseline을 compare 입력으로 삼을 위험이 있다. |
| 목표 상태 | 15 key 전부가 inventory에 남되 `contract-bearing`과 `detail-variant`가 명시적으로 분리되고, real reference capture 15개가 exact naming으로 묶인다. |
| 유지 경계 | detail state를 package public prop으로 승격하지 않는다. compare runtime script와 diff threshold는 Phase 3가 소유한다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/baseline-inventory.md` | 변경 | state role 분류, provenance, capture filename이 함께 적혀야 한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/*.png` | 변경 | 15 file naming이 inventory key와 1:1이어야 한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | 15 `kind/state` key, `contract-bearing` / `detail-variant`, exact `{kind}-{state}-reference.png` naming |
| state ownership | state role 분류와 capture naming은 plan-local inventory가 소유한다. PNG는 external-source mirror evidence다. |
| callback / handoff | 없음 |
| no-op / invalid rule | `detail-variant` 분류는 compare/report inventory에서 제외하라는 뜻이 아니다. placeholder, 1x1, package-local proxy는 final acceptance baseline이 아니다. |
| 추가 관찰 포인트 | `folder/live-chip-open`, `folder/live-sidebar-hover`, `folder/live-sidebar-expanded`, `folder/live-thumbnail-hover`, `browser/live-control-hover-*`도 exact review inventory에 남는다. |

### 시각 패리티 계약

| 항목 | 내용 |
| --- | --- |
| comparison mode | `structural parity` |
| gating metric | later compare가 exact same 15 key와 exact same reference capture naming을 사용해야 한다. |
| non-gating metric | `none` |
| local surface | baseline inventory row, reference capture file naming |
| canonical surface role | `frame-surface`, `control-surface`, `content-surface`, `media-surface` |
| comparison policy | inventory/key binding은 `gating`이다. |
| metric treatment | `boundary-and-geometry` |

### 검증 근거

| 항목 | 확인 수단 |
| --- | --- |
| `contract-bearing` / `detail-variant` 분류 | baseline inventory inspection |
| 15 reference capture naming binding | `reference-captures/*.png` inspection |

## 실행 계약

- owner_agent: `visual-comparator`
- 목적:
  - Figma 3:2 canvas의 live HTML wrapper inventory 15개를 현재 slug의 canonical spec artifact, baseline inventory, real reference capture naming으로 동결한다.
- boundary:
  - `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/spec/**`
  - `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/**`
- input:
  - 시나리오: maintainer가 later frontend phase와 final compare에서 같은 Figma source와 같은 reference capture inventory를 그대로 재사용해야 하는 경우
  - exact Figma source:
    - file key: `NrUGKPZUewpuA8XuHI0v5n`
    - authoritative canvas node: `3:2`
    - authoritative frame/canvas name: `Live UI References — Folder Browser`
    - canonical mobile section marker: `__section-mobile`
  - exact wrapper inventory:
    - desktop:
      - `folder/live-blog`
      - `browser/live-article`
      - `folder/live-search-open`
      - `folder/live-chip-open`
      - `folder/live-sidebar-hover`
      - `folder/live-sidebar-expanded`
      - `folder/live-thumbnail-hover`
      - `browser/live-address-open`
      - `browser/live-control-hover-minimize`
      - `browser/live-control-hover-maximize`
      - `browser/live-control-hover-close`
    - mobile:
      - `folder/mobile-blog`
      - `folder/mobile-search-open`
      - `browser/mobile-article`
      - `browser/mobile-address-open`
  - state role direction:
    - `contract-bearing`: `folder/live-blog`, `browser/live-article`, `folder/live-search-open`, `browser/live-address-open`, `folder/mobile-blog`, `folder/mobile-search-open`, `browser/mobile-article`, `browser/mobile-address-open`
    - `detail-variant`: `folder/live-chip-open`, `folder/live-sidebar-hover`, `folder/live-sidebar-expanded`, `folder/live-thumbnail-hover`, `browser/live-control-hover-minimize`, `browser/live-control-hover-maximize`, `browser/live-control-hover-close`
- output:
  - 공개 계약:
    - `spec/figma-mcp-artifact.md`가 exact source, clean-slate direction, compare key schema를 가진다.
    - `baseline-inventory.md`가 exact 15 key, section, state role, provenance, capture filename을 가진다.
    - reference capture naming은 exact `{kind}-{state}-reference.png`다.
    - placeholder, 1x1, package-local proxy baseline은 final acceptance baseline이 아니다.
  - 내부 기본값:
    - `detail-variant` state도 compare/report inventory에서는 빠지지 않는다.
    - reference capture는 external-source evidence의 repo-local mirror다.
  - 허용하지 않는 대안:
    - 6-state inventory로 다시 축소하는 선택
    - `folder/live-chip-open`이나 control-hover state를 separate public contract state로 승격하는 선택
    - `__section-mobile` wrapper를 supporting note처럼 취급하는 선택
- 작업:
  1. Figma MCP provenance와 spec artifact를 current slug 문서에 고정한다.
  2. 15 wrapper를 state role과 함께 inventory에 고정한다.
  3. Figma MCP `get_screenshot` 결과를 exact reference capture naming과 묶는다.
- 검증:
  - [ ] `spec/figma-mcp-artifact.md`가 exact source, clean-slate direction, 15 key schema를 literal하게 적는다.
  - [ ] `reference-captures/baseline-inventory.md`가 exact 15 key, `__section-mobile`, state role, provenance, capture filename을 모두 적는다.
  - [ ] `reference-captures/*.png` 15개가 exact `{kind}-{state}-reference.png` naming을 따른다.
  - [ ] old `7:* image-node`, `imageScreen`, 6-state wording과 placeholder/proxy baseline이 canonical provenance에서 제거된다.

## Phase 검증

| 검증 항목 | 확인 수단 | 기대 결과 |
| --- | --- | --- |
| Figma MCP source와 key schema 고정 | `spec/figma-mcp-artifact.md` inspection | exact source, clean-slate direction, 15 key schema가 보인다. |
| 15-state inventory 고정 | `reference-captures/baseline-inventory.md` inspection | desktop 11 + mobile 4, 총 15 key가 exact key로 적혀 있다. |
| real reference capture naming 정렬 | `reference-captures/*.png` inspection | file naming이 inventory key와 1:1로 맞고 placeholder/proxy baseline이 완료 기준이 아니다. |
