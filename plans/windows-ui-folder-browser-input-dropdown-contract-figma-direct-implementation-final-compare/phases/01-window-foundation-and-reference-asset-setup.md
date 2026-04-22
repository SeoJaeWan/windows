# Phase 1. Window foundation과 reference asset setup

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | plan-level로 잠근 Figma authority와 15-state inventory를 current slug 안의 fresh repo-local baseline asset으로 materialize하고, shared `WindowFrame`과 exact compare stage owner/geometry를 먼저 구현한다. |
| 선행조건 | `plan.md`의 `기준 상태 인벤토리`와 `비교 런타임 리터럴`이 authoritative input이다. |
| 완료 판단 | `reference-captures/baseline-inventory.md`, `reference-captures/*.png`, `WindowFrame`, `windowReferenceStage`, `compareWindowStage`만 읽어도 exact baseline key, baseline acquisition path, exact compare geometry를 다시 추정하지 않아도 된다. |
| 중단 조건 | proxy baseline, placeholder PNG, sibling bundle copy-forward를 authoritative acquisition으로 채택하거나, panel reuse를 canonical owner로 채택하거나, compare stage selector/geometry를 later phase가 다시 정해야 하면 blocker다. |

## 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/baseline-inventory.md` | 생성 | row는 exact `kind/state`, `state role`, `storyId`, `stageAttr`, provenance, reference filename, acquisition note를 가진다. | plan-level inventory와 1:1로 맞고 fresh export path가 보인다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/*.png` | 생성/갱신 | filename은 exact `{kind}-{state}-reference.png`다. 획득 경로는 locked Figma source에서 current slug로의 direct export뿐이다. | 15개 row와 file naming이 mechanical하게 연결되고 authority drift가 없다. |
| `packages/tailwind-config/src/theme.css` | 추가/조정 | `--window-*` namespace는 frame/chrome/input/dropdown/shadow/spacing을 소유한다. | shell/chrome/mobile spacing이 token으로 드러난다. |
| `packages/tailwind-config/src/utilities.css` | 추가/조정 | shared shell utility와 leaf slot utility를 분리한다. | later leaf source가 panel utility를 owner로 쓰지 않는다. |
| `packages/ui/src/components/windows/internal/windowFrame/index.tsx` | 추가 | internal-only shared shell owner를 만든다. | titlebar/control/body boundary가 public export 없이 남는다. |
| `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx` | 추가 | human review stage는 desktop/mobile geometry family를 공유한다. | differentiated mobile hierarchy가 visible하다. |
| `packages/ui/src/components/windows/storybook/compareWindowStage.tsx` | 추가 | machine capture owner는 exact `[data-window-compare-stage]`와 exact `desktop`/`mobile`이다. | later phase가 selector/geometry를 새로 정하지 않는다. |

## 완료 증거

- `reference-captures/baseline-inventory.md`가 exact 15 row와 state role, provenance, storyId, stageAttr, fresh export acquisition note를 가진다.
- reference PNG 15개가 exact `{kind}-{state}-reference.png` naming을 따르고 locked Figma source에서 current slug로 직접 export된 baseline이다.
- `WindowFrame`가 internal-only shared shell owner로 남고 public export는 없다.
- `compareWindowStage`가 exact `[data-window-compare-stage]`, exact stage values `desktop`/`mobile`, desktop `1024x700`, mobile `375x680`을 literal하게 가진다.
- `build-storybook`이 new windows family foundation과 stage helper를 포함한 상태로 green이다.

## Phase 요약

| 항목 | 내용 |
| --- | --- |
| 목표 | fresh baseline acquisition path와 foundation/stage owner를 먼저 고정해 Phase 2가 leaf contract와 runtime에만 집중하게 만든다. |
| 연결 작업 단위 | `locked reference contract와 repo-local baseline asset`, `window foundation과 compare stage` |
| 선행 조건 | `plan.md`의 plan-level Figma authority, 15-state inventory, runtime literal |
| 검증 메모 | local baseline asset과 exact stage owner/geometry가 둘 다 생기고, baseline PNG 획득 경로가 locked Figma source direct export로 보존돼야 Phase 1이 독립적으로 green이다. |
| 로컬 전제 계약 | Phase 2는 여기서 만든 `reference-captures/baseline-inventory.md`, locked Figma source direct export `reference-captures/*.png`, exact `[data-window-compare-stage]`, exact `desktop`/`mobile`, stage geometry를 read-only prerequisite로 사용한다. |

## 작업 순서

| 순서 | 작업 단위 | 이번 단계에서 처리하는 내용 | 완료 조건 |
| --- | --- | --- | --- |
| 1 | baseline inventory materialization | plan-level 15-state contract를 local inventory, reference filename, acquisition note로 재기록한다. | local inventory row가 top-level inventory와 1:1이고 fresh export path가 보인다. |
| 2 | reference PNG mirror | locked Figma source에서 exact wrapper `{key}`를 current slug로 direct export해 reference PNG 15개를 준비한다. | `reference-captures/*.png`가 exact key naming을 가지고 authority drift가 없다. |
| 3 | shared shell과 compare stage | `WindowFrame`, `windowReferenceStage`, `compareWindowStage`, `--window-*` token을 구현한다. | exact stage owner와 geometry가 source에 literal하게 남는다. |

## 작업 단위 A. baseline inventory와 reference PNG mirror

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | reference authority를 execution compare phase가 아니라 현재 plan과 Phase 1 boundary에서 닫아야 later compare가 baseline identity를 발명하지 않는다. |
| 현재 문제 | local baseline asset과 acquisition path가 함께 잠기지 않으면 reviewer와 compare tooling이 Figma source를 다시 직접 뒤져 exact state key, filename, baseline 확보 경로를 재구성해야 한다. |
| 목표 상태 | local inventory와 reference PNG mirror가 exact 15 key, state role, provenance, filename, direct-export acquisition rule을 가진다. |
| 유지 경계 | public prop 결정, runtime script, diff threshold는 이 작업 단위가 소유하지 않는다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/baseline-inventory.md` | 변경 | exact 15 row, state role, storyId, stageAttr, provenance가 보여야 한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/*.png` | 변경 | 15개 PNG가 exact key naming을 가져야 한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | `baseline-inventory.md`의 exact 15 row와 acquisition note, `{kind}-{state}-reference.png` filename family |
| state ownership | inventory taxonomy, filename policy, acquisition policy는 Phase 1이 소유한다. PNG는 external-source evidence의 repo-local mirror다. |
| callback / handoff | 없음 |
| no-op / invalid rule | proxy baseline, placeholder, 1x1 image, alias filename, sibling bundle copy-forward를 authoritative baseline으로 쓰는 경로는 invalid다. `detail-variant`를 inventory에서 빼는 경로도 invalid다. |
| 추가 관찰 포인트 | mobile 4개 row는 `__section-mobile` source marker와 연결돼야 하고, wrapper identity는 exact `{key}`를 유지해야 한다. |

### 시각 패리티 계약

| 항목 | 내용 |
| --- | --- |
| comparison mode | `structural parity` |
| gating metric | exact baseline identity, exact 15-state coverage, exact direct-export acquisition path가 local asset에 보존돼야 한다. |
| non-gating metric | `none` |
| local surface | baseline inventory row, reference PNG naming |
| canonical surface role | `frame-surface`, `control-surface`, `content-surface`, `media-surface`, `fixture-payload-surface` |
| comparison policy | baseline identity는 `gating`이다. |
| metric treatment | `boundary-and-geometry` |

### 검증 근거

| 항목 | 확인 수단 |
| --- | --- |
| exact 15-state row와 acquisition note 고정 | inventory inspection |
| reference filename family와 direct-export provenance 고정 | PNG filename inspection |

## 작업 단위 B. shared `WindowFrame`과 exact compare stage

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | compare runtime이 later phase에서 selector나 geometry를 다시 정하면 final compare는 execution-ready가 아니다. |
| 현재 문제 | repo에는 taskbar/panel compare helper가 있지만 windows family 전용 shared shell과 stage owner가 아직 없다. |
| 목표 상태 | `WindowFrame`, `windowReferenceStage`, `compareWindowStage`, `--window-*` token이 windows family 기준으로 생긴다. |
| 유지 경계 | Folder/Browser public contract와 leaf-specific detail state는 Phase 2가 소유한다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `packages/tailwind-config/src/theme.css` | 변경 | `--window-*` namespace가 shell/chrome/input/dropdown/shadow/spacing을 소유해야 한다. |
| `packages/tailwind-config/src/utilities.css` | 변경 | shared shell utility와 leaf slot utility가 분리돼야 한다. |
| `packages/ui/src/components/windows/internal/windowFrame/index.tsx` | 변경 | internal-only shared shell owner가 보여야 한다. |
| `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx` | 변경 | human review stage가 desktop/mobile hierarchy를 보여야 한다. |
| `packages/ui/src/components/windows/storybook/compareWindowStage.tsx` | 변경 | exact `[data-window-compare-stage]`, exact `desktop`/`mobile`, exact stage geometry가 있어야 한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | public export는 없다. internal `WindowFrame`와 stage helper가 이 작업 단위의 surface다. |
| state ownership | shell geometry, stage geometry, control cluster placement는 shared foundation owner다. |
| callback / handoff | leaf는 window-control callback만 later phase에서 연결한다. |
| no-op / invalid rule | `packages/ui/src/components/panels/**`를 canonical owner로 재사용하거나, compare-time geometry를 later phase에서 바꾸는 경로는 invalid다. |
| 추가 관찰 포인트 | `compareWindowStage`는 desktop `1024x700`, mobile `375x680`을 exact contract로 제공한다. |

### 시각 패리티 계약

| 항목 | 내용 |
| --- | --- |
| comparison mode | `structural parity` |
| gating metric | `frame-surface`와 `control-surface` geometry, mobile hierarchy, stage owner가 Figma wrapper grammar와 맞아야 한다. |
| non-gating metric | glyph raster, minute shadow blur |
| local surface | outer frame, titlebar, control cluster, content boundary, mobile hierarchy |
| canonical surface role | `frame-surface`, `control-surface`, `content-surface`, `ornament-surface` |
| comparison policy | geometry와 hierarchy는 `gating`, fine ornament는 `advisory` |
| metric treatment | `boundary-and-geometry` |

### 검증 근거

| 항목 | 확인 수단 |
| --- | --- |
| exact stage owner와 geometry | source inspection |
| foundation token namespace | source inspection |

## 실행 계약

- owner_agent: `frontend-developer`
- 목적:
  - plan-level Figma authority를 repo-local baseline asset과 windows family foundation/stage owner로 materialize한다.
- boundary:
  - `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/**`
  - `packages/tailwind-config/src/theme.css`
  - `packages/tailwind-config/src/utilities.css`
  - `packages/ui/src/components/windows/internal/windowFrame/index.tsx`
  - `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx`
  - `packages/ui/src/components/windows/storybook/compareWindowStage.tsx`
- input:
  - 시나리오: maintainer가 standalone windows family foundation을 만들고 later compare가 same baseline key와 same stage geometry를 쓰게 해야 하는 경우
- exact Figma source:
    - file key: `NrUGKPZUewpuA8XuHI0v5n`
    - canvas node: `3:2`
    - frame name: `Live UI References — Folder Browser`
    - mobile section marker: `__section-mobile`
  - exact baseline acquisition rule:
    - Phase 1은 exact wrapper `{key}` 15개를 위 Figma source에서 current slug의 `reference-captures/{kind}-{state}-reference.png`로 직접 export한다.
    - sibling repo-local baseline bundle이 존재해도 completeness cross-check 용도로만 읽을 수 있으며 authority, prerequisite, copy-forward source로 쓰지 않는다.
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
  - repo-local execution contract:
    - validation command: `pnpm --filter @windows/ui build-storybook`
  - design constraints:
    - `WindowFrame`는 internal-only shared shell owner다.
    - stage attribute values는 exact `desktop`, `mobile` only다.
    - stage geometry는 desktop `1024x700`, mobile `375x680`이다.
    - Folder mobile은 content-first grid다.
    - Browser mobile은 simplified chrome/content-first reading hierarchy다.
- output:
  - 공개 계약:
    - `reference-captures/baseline-inventory.md`가 exact 15 key, state role, storyId, stageAttr, provenance, filename, acquisition note를 가진다.
    - reference filename family는 exact `{kind}-{state}-reference.png`다.
    - reference PNG 15개는 locked Figma source에서 current slug로 직접 export한 baseline이다.
    - `WindowFrame`는 internal-only shared shell owner다.
    - exact compare stage owner는 `[data-window-compare-stage]`다.
    - stage attribute values는 exact `desktop`, `mobile` only다.
    - stage geometry는 desktop `1024x700`, mobile `375x680`이다.
  - 내부 기본값:
    - Phase 2와 Phase 3는 baseline identity와 stage geometry를 read-only prerequisite로 사용한다.
    - reference stage와 compare stage는 같은 geometry family를 공유한다.
  - 허용하지 않는 대안:
    - panel component를 canonical shared shell owner로 재사용하는 선택
    - compare-time geometry를 later phase에서 변경하는 선택
    - proxy baseline을 final acceptance source로 쓰는 선택
    - sibling repo-local baseline bundle을 authority나 copy-forward source로 쓰는 선택
- 작업:
  1. local baseline inventory와 reference PNG mirror를 만든다.
  2. `WindowFrame`와 `--window-*` token namespace를 추가한다.
  3. `windowReferenceStage`와 `compareWindowStage`에 exact owner와 geometry를 고정한다.
- 검증:
  - [ ] `reference-captures/baseline-inventory.md`가 exact 15 row와 state role, storyId, stageAttr, provenance, filename, acquisition note를 literal하게 적는다.
  - [ ] `reference-captures/*.png`가 exact `{kind}-{state}-reference.png` naming을 따르고 locked Figma source direct export baseline임을 확인할 수 있다.
  - [ ] `compareWindowStage.tsx`에 exact `[data-window-compare-stage]`, exact `desktop`/`mobile`, desktop `1024x700`, mobile `375x680`이 있다.
  - [ ] `pnpm --filter @windows/ui build-storybook`가 green이다.

## Phase 검증

| 검증 항목 | 확인 수단 | 기대 결과 |
| --- | --- | --- |
| baseline inventory row와 acquisition note 고정 | `baseline-inventory.md` inspection | exact 15 row와 state role, storyId, stageAttr, provenance, acquisition note가 보인다. |
| reference PNG naming과 acquisition provenance 고정 | `reference-captures/*.png` inspection | 15개 filename이 exact key와 1:1이고 direct-export baseline임을 설명할 수 있다. |
| foundation token과 shell owner 고정 | source inspection | `--window-*`와 `WindowFrame` shared shell boundary가 보인다. |
| compare stage owner/geometry 고정 | source inspection, `build-storybook` | exact stage owner와 geometry가 구현되고 package build가 통과한다. |
