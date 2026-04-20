# Phase 1. Figma 3:2 기준선과 wrapper inventory 고정

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | Figma canvas `3:2`의 live HTML wrapper 15개를 이번 slug의 canonical baseline inventory와 local capture naming으로 고정한다. |
| 선행조건 | `none` |
| 완료 판단 | `baseline-inventory.md`만 읽어도 exact 15 key, `__section-mobile`, state role, provenance, capture naming, stale `7:*` rejection을 다시 추측하지 않아도 된다. |
| 중단 조건 | canonical provenance를 `3:2` wrapper label이 아니라 old `7:*` image-node나 `imageScreen` wording에 다시 의존해야 하면 blocker다. |

## 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-input-dropdown-contract/reference-captures/baseline-inventory.md` | 교체 | canonical provenance는 `file key + canvas 3:2 + frame/canvas name + visible wrapper label`이다. 각 row는 `state role`, `section`, `provenance`, `capture filename`을 함께 적는다. | inventory가 desktop 11개 + mobile 4개, 총 15 key를 literal하게 기록한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract/reference-captures/*.png` | 교체 | local mirror capture naming은 exact `folder-live-blog.png` 같은 `kind-state` 규칙을 쓴다. | inventory와 file naming이 1:1로 맞고 stale 6-state file naming이 남지 않는다. |

## 완료 증거

- canonical inventory가 `folder/live-blog`부터 `browser/mobile-address-open`까지 exact 15 key를 가진다.
- mobile wrapper 4개가 `__section-mobile` 하위 canonical section으로 기록된다.
- `folder/live-chip-open`, hover/expanded/control-hover state가 `detail-variant`로 분류되지만 inventory 자체에서는 빠지지 않는다.
- old `imageScreen`, `7:* image-node`, 6-state wording이 canonical provenance에서 제거된다.

## Phase 요약

| 항목 | 내용 |
| --- | --- |
| 목표 | 3:2 canvas 기준 15-state wrapper inventory와 local capture naming을 고정한다. |
| 연결 작업 단위 | `Figma 3:2 wrapper inventory와 provenance` |
| 선행 조건 | `none` |
| 검증 메모 | baseline inventory만 읽어도 15 key, state role, provenance, local capture naming이 모두 보여야 한다. |
| 로컬 전제 계약 | Phase 4 compare report는 여기서 잠근 exact 15 key, provenance wording, capture naming을 그대로 사용해야 한다. |

## 작업 순서

| 순서 | 작업 단위 | 이번 단계에서 처리하는 내용 | 완료 조건 |
| --- | --- | --- | --- |
| 1 | Figma 3:2 provenance | file key, canvas `3:2`, frame/canvas name, desktop/mobile section을 authoritative source로 정리한다. | baseline inventory에 exact source provenance가 literal하게 적힌다. |
| 2 | wrapper inventory + state role | 15 visible wrapper를 `contract-bearing` / `detail-variant`로 분류한다. | `folder/live-chip-open`과 hover/control-hover state의 역할이 명시된다. |
| 3 | local capture binding | inventory key와 local mirror capture naming을 1:1로 묶는다. | later compare가 exact `kind-state` file naming을 그대로 재사용할 수 있다. |

## 작업 단위 A. Figma 3:2 wrapper provenance와 inventory

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | current request와 design-discovery가 모두 canvas `3:2`의 live HTML wrapper inventory를 authoritative source로 잠갔다. |
| 현재 문제 | 기존 detail은 `7:*` image-node와 state 6개를 canonical baseline처럼 적고 있어 current Figma source를 literal하게 반영하지 못한다. |
| 목표 상태 | baseline inventory가 file key, canvas `3:2`, frame/canvas `Live UI References — Folder Browser`, desktop 11개, mobile 4개를 exact key로 적는다. |
| 유지 경계 | source-tree UI, public props, root export는 이 phase에서 열지 않는다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `plans/windows-ui-folder-browser-input-dropdown-contract/reference-captures/baseline-inventory.md` | 변경 | 15 key, section, provenance, state role이 모두 적혀야 한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract/reference-captures/*.png` | 변경 | inventory가 가리키는 local mirror capture naming이 exact `kind-state` 규칙을 따라야 한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | `baseline-inventory.md` row: `state key`, `wrapper label`, `section`, `state role`, `provenance`, `capture filename` |
| state ownership | Figma 3:2 wrapper source가 visual truth를 소유하고, plan-local artifact는 local mirror inventory만 소유한다. |
| callback / handoff | 없음 |
| no-op / invalid rule | old `7:*` image-node, `imageScreen`, 6-state wording은 canonical provenance로 재사용하지 않는다. |
| 추가 관찰 포인트 | `__section-mobile`은 supporting note가 아니라 canonical inventory section이다. |

### 시각 패리티 계약

| 항목 | 내용 |
| --- | --- |
| comparison mode | `structural parity` |
| gating metric | exact 15 key, section, wrapper provenance가 고정돼 있어 later compare가 같은 inventory로 시작할 수 있어야 한다. |
| non-gating metric | `none` |
| local surface | Figma 3:2 wrapper blocks, desktop wrapper set, `__section-mobile` wrapper set |
| canonical surface role | `frame-surface`, `control-surface`, `content-surface`, `media-surface`, `fixture-payload-surface` |
| comparison policy | inventory와 provenance freeze는 `gating`이다. |
| metric treatment | `boundary-and-geometry` |

### 검증 근거

| 항목 | 확인 수단 |
| --- | --- |
| 15-state wrapper inventory | baseline inventory inspection |
| `__section-mobile` 포함 여부 | baseline inventory inspection |

## 작업 단위 B. state role classification과 local capture binding

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | user는 full 15-state coverage를 원하지만, `folder/live-chip-open` 같은 detail state를 separate product contract로 승격하길 원하지 않았다. |
| 현재 문제 | old plan은 compare inventory 6개만 적고 있어 detail state가 빠지거나 public contract로 잘못 재해석될 수 있다. |
| 목표 상태 | 15 key 전부가 inventory에 남되, `contract-bearing` state와 `detail-variant` state가 명시적으로 분리된다. |
| 유지 경계 | detail state를 package public prop으로 승격하지 않는다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `plans/windows-ui-folder-browser-input-dropdown-contract/reference-captures/baseline-inventory.md` | 변경 | state role 분류와 capture filename이 함께 적혀야 한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract/reference-captures/*.png` | 변경 | 15 file naming이 inventory key와 1:1이어야 한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | 15 `kind/state` key와 대응 local capture filename |
| state ownership | `contract-bearing` / `detail-variant` 분류는 plan-local inventory가 소유한다. |
| callback / handoff | 없음 |
| no-op / invalid rule | `detail-variant` 분류는 out-of-scope 뜻이 아니다. compare/report inventory에서는 그대로 유지한다. |
| 추가 관찰 포인트 | `folder/live-chip-open`, `folder/live-sidebar-hover`, `folder/live-sidebar-expanded`, `folder/live-thumbnail-hover`, `browser/live-control-hover-*`는 exact review inventory에 남는다. |

### 시각 패리티 계약

| 항목 | 내용 |
| --- | --- |
| comparison mode | `structural parity` |
| gating metric | later compare가 exact same 15 key와 same capture naming을 사용해야 한다. |
| non-gating metric | `none` |
| local surface | story/state naming, report row naming, local mirror capture naming |
| canonical surface role | `frame-surface`, `control-surface`, `content-surface`, `media-surface` |
| comparison policy | key binding과 state role classification은 `gating`이다. |
| metric treatment | `boundary-and-geometry` |

### 검증 근거

| 항목 | 확인 수단 |
| --- | --- |
| `contract-bearing` / `detail-variant` 분류 | baseline inventory inspection |
| 15 capture naming binding | `reference-captures/*.png` inspection |

## 실행 계약

- owner_agent: `visual-comparator`
- 목적:
  - Figma 3:2 canvas의 live HTML wrapper inventory 15개를 이번 slug의 canonical baseline과 local mirror naming으로 동결한다.
- boundary:
  - `plans/windows-ui-folder-browser-input-dropdown-contract/reference-captures/**`
- input:
  - 시나리오: maintainer가 Figma wrapper inventory를 기준으로 later storybook compare와 drift closure를 같은 key로 진행해야 하는 경우
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
    - canonical provenance는 `3:2` wrapper inventory다.
    - inventory는 exact 15 key, section, state role, provenance, capture filename을 가진다.
    - local mirror capture naming은 exact `kind-state` 규칙을 쓴다.
    - old `7:* image-node`와 `imageScreen` wording은 stale legacy다.
  - 내부 기본값:
    - `detail-variant` state도 compare/report inventory에서는 빠지지 않는다.
    - local mirror capture는 canonical truth가 아니라 external-source mirror evidence다.
  - 허용하지 않는 대안:
    - 6-state inventory로 다시 축소하는 선택
    - `folder/live-chip-open`을 separate public contract state로 승격하는 선택
    - `__section-mobile` wrapper를 supporting note처럼 취급하는 선택
- 작업:
  1. Figma 3:2 provenance를 baseline inventory에 고정한다.
  2. 15 wrapper를 state role과 함께 분류한다.
  3. local mirror capture naming을 exact key와 묶는다.
- 검증:
  - [ ] `reference-captures/baseline-inventory.md`가 exact 15 key, `__section-mobile`, state role, provenance, capture filename을 모두 적는다.
  - [ ] `reference-captures/*.png` 15개가 exact `kind-state` naming을 따른다.
  - [ ] old `7:* image-node`와 `imageScreen` wording이 canonical provenance에서 제거된다.

## Phase 검증

| 검증 항목 | 확인 수단 | 기대 결과 |
| --- | --- | --- |
| 15-state inventory 고정 | `reference-captures/baseline-inventory.md` inspection | desktop 11 + mobile 4, 총 15 key가 exact key로 적혀 있다. |
| state role 분류 고정 | `reference-captures/baseline-inventory.md` inspection | `contract-bearing`와 `detail-variant`가 key별로 보인다. |
| local capture naming 정렬 | `reference-captures/*.png` inspection | file naming이 inventory key와 1:1로 맞는다. |
