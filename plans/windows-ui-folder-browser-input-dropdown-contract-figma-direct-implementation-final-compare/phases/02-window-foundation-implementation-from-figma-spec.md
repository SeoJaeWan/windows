# Phase 2. Figma spec 기반 window foundation 구현

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | Phase 1 spec artifact를 직접 사용해 shared `WindowFrame`, exact `[data-window-compare-stage]`, exact stage values `desktop` / `mobile`, desktop case -> `desktop`, mobile case -> `mobile`, desktop `1024x700`, mobile `375x680`, leaf-specific chrome differentiation, mobile hierarchy rule을 foundation boundary에서 먼저 고정한다. |
| 선행조건 | Phase 1에서 exact 15 key, state role classification, real reference capture naming이 고정돼 있어야 한다. |
| 완료 판단 | foundation source만 읽어도 `panels` reuse 금지, shared shell owner, Folder/Browser chrome 차이, mobile hierarchy rule, exact capture owner와 stage geometry를 설명할 수 있다. |
| 중단 조건 | shared foundation을 만들기 위해 `packages/ui/src/components/panels/**` public surface를 canonical owner로 재사용하거나, Folder/Browser chrome을 완전히 동일하게 강제하거나, later compare phase가 stage geometry를 다시 정해야 하면 blocker다. |

## 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/tailwind-config/src/theme.css` | 추가/조정 | `--window-*` namespace는 frame, chrome, input, dropdown, shadow, mobile spacing surface를 소유한다. | shell/chrome/mobile spacing이 semantic token 이름으로 드러난다. |
| `packages/tailwind-config/src/utilities.css` | 추가/조정 | shared shell utility와 leaf chrome slot utility를 분리해 둘 다 재사용 가능해야 한다. | later leaf source가 raw literal이나 panel utility에 기대지 않아도 된다. |
| `packages/ui/src/components/windows/internal/windowFrame/index.tsx` | 추가/조정 | `WindowFrame`는 internal-only shared shell owner고 leaf-specific chrome slot을 남긴다. | `WindowFrame`가 public export 없이 titlebar, control cluster, body boundary를 설명한다. |
| `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx` | 추가/조정 | human review stage는 desktop/mobile geometry family를 same contract로 쓴다. | Folder/Browser 공통 backdrop과 mobile hierarchy comparison을 모두 수용한다. |
| `packages/ui/src/components/windows/storybook/compareWindowStage.tsx` | 추가/조정 | machine capture owner는 exact `[data-window-compare-stage]`이고 stage values는 정확히 `desktop`, `mobile` 두 개뿐이며 stage geometry는 desktop `1024x700`, mobile `375x680`이다. | later compare가 same geometry, same owner selector, same stageAttr values를 그대로 재사용한다. |

## 완료 증거

- `WindowFrame`가 shared shell owner지만 leaf-specific chrome 차이를 삼키지 않는다.
- `compareWindowStage`가 exact `[data-window-compare-stage]`, exact stage values `desktop` / `mobile`, stage geometry `desktop 1024x700`, `mobile 375x680`을 canonical capture owner로 노출한다.
- `Folder` mobile은 content-first grid, `Browser` mobile은 simplified chrome/content-first reading hierarchy라는 rule이 foundation wording에 들어간다.
- `panels` import나 panel naming이 foundation canonical owner로 재등장하지 않는다.

## Phase 요약

| 항목 | 내용 |
| --- | --- |
| 목표 | shared shell과 responsive hierarchy 경계를 public prop phase보다 먼저 고정한다. |
| 연결 작업 단위 | `Window foundation과 responsive hierarchy` |
| 선행 조건 | Phase 1의 exact 15 key, state role classification, real reference capture naming |
| 검증 메모 | `WindowFrame` internal-only rule, exact capture owner, exact stage geometry, Folder/Browser differentiated mobile hierarchy가 source에 보여야 한다. |
| 로컬 전제 계약 | Phase 3는 여기서 잠근 shell/token/stage contract 위에 public props, review-state owner, compare metadata만 얹어야 한다. |

## 작업 순서

| 순서 | 작업 단위 | 이번 단계에서 처리하는 내용 | 완료 조건 |
| --- | --- | --- | --- |
| 1 | token namespace와 shared shell | `--window-*` token namespace와 `WindowFrame` shared shell owner를 만든다. | shared shell이 semantic token과 함께 literal하게 보인다. |
| 2 | stage geometry와 capture owner | `windowReferenceStage`, `compareWindowStage`, exact `[data-window-compare-stage]`, exact stage values `desktop` / `mobile`, desktop/mobile stage geometry를 잠근다. | later compare가 selector, stageAttr values, geometry를 새로 발명할 필요가 없다. |
| 3 | leaf-specific chrome differentiation과 mobile hierarchy | Folder/Browser chrome 차이를 leaf owner로 남기고 identical chrome 강제를 막는다. | shared shell과 leaf chrome/mobile hierarchy boundary가 source에서 분리된다. |

## 작업 단위 A. token namespace와 shared shell owner

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | current task는 windows family 자체 owner를 닫아야 하고, panel domain과 섞이면 public boundary와 visual parity 둘 다 흐려진다. |
| 현재 문제 | shell/tokens를 말해도 `panels`와 구별되는 naming, shared owner, leaf slot boundary를 충분히 literal하게 적지 않으면 later phase가 foundation contract를 다시 추정하게 된다. |
| 목표 상태 | `--window-*` token namespace와 internal `WindowFrame`가 shared shell owner로 고정된다. |
| 유지 경계 | `Folder`/`Browser` public props와 review-state owner는 아직 Phase 3가 소유한다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `packages/tailwind-config/src/theme.css` | 변경 | frame/chrome/input/dropdown/mobile spacing token이 `window` namespace로 묶여야 한다. |
| `packages/tailwind-config/src/utilities.css` | 변경 | shared shell utility와 leaf slot utility가 구분돼야 한다. |
| `packages/ui/src/components/windows/internal/windowFrame/index.tsx` | 변경 | `WindowFrame`가 internal-only shared shell owner임이 source에 보여야 한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | public export는 없다. internal `WindowFrame`와 `--window-*` token namespace가 이 phase의 계약이다. |
| state ownership | shell geometry와 control placement는 shared foundation이 소유한다. |
| callback / handoff | leaf phase가 window-control callback만 붙일 수 있다. foundation phase는 affordance placement와 slot만 닫는다. |
| no-op / invalid rule | `panels` import나 panel naming 재사용은 invalid path다. |
| 추가 관찰 포인트 | `WindowFrame`는 leaf-specific input/dropdown/chrome semantics를 직접 정의하지 않는다. |

### 시각 패리티 계약

| 항목 | 내용 |
| --- | --- |
| comparison mode | `structural parity` |
| gating metric | `frame-surface`와 shared `control-surface` geometry가 Figma wrapper family와 맞아야 한다. |
| non-gating metric | glyph raster와 minute shadow blur |
| local surface | outer frame, titlebar, control cluster, body inset |
| canonical surface role | `frame-surface`, `control-surface`, `ornament-surface` |
| comparison policy | shared shell geometry는 `gating`, fine ornament는 `advisory` |
| metric treatment | `boundary-and-geometry` |

### 검증 근거

| 항목 | 확인 수단 |
| --- | --- |
| `window` namespace 존재 | source inspection |
| `WindowFrame` internal-only owner | source inspection |

## 작업 단위 B. stage geometry와 leaf-specific responsive hierarchy

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | compare runtime이 later phase에서 selector나 viewport를 다시 정하면 final compare가 execution-ready가 아니고, design-discovery가 잠근 mobile hierarchy 차이도 흐려진다. |
| 현재 문제 | shared shell을 강조하다가 exact capture owner, stage geometry, chrome difference, mobile hierarchy 차이를 later phase가 추측하게 둘 위험이 있다. |
| 목표 상태 | `compareWindowStage`가 exact capture owner와 geometry를, `windowReferenceStage`가 같은 geometry family를, foundation wording이 Folder/Browser differentiated mobile hierarchy를 잠근다. |
| 유지 경계 | hover/open/detail state selection은 여전히 storybook/internal review surface가 owner다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/index.tsx` | 변경 | leaf-specific chrome slot과 body boundary가 분리돼야 한다. |
| `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx` | 변경 | human review stage가 desktop/mobile hierarchy 차이를 보여 줄 수 있어야 한다. |
| `packages/ui/src/components/windows/storybook/compareWindowStage.tsx` | 변경 | machine capture stage가 same geometry family, exact `[data-window-compare-stage]`, exact stage values `desktop` / `mobile`을 쓴다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | story-only stage helper와 internal shell slot boundary |
| state ownership | stage geometry와 capture selector는 foundation helper가 소유하고, leaf-specific chrome detail은 later leaf source가 소유한다. |
| callback / handoff | 없음 |
| no-op / invalid rule | Folder mobile을 desktop sidebar shrink로 구현하거나 Browser mobile에 desktop chrome 밀도를 그대로 복제하는 선택, compare-time stage geometry 변경은 invalid다. |
| 추가 관찰 포인트 | `compareWindowStage`는 desktop `1024x700`, mobile `375x680`을 same canonical contract로 제공하고, outer viewport는 Phase 3 capture script의 `1280x800`과 맞물린다. |

### 시각 패리티 계약

| 항목 | 내용 |
| --- | --- |
| comparison mode | `structural parity` |
| gating metric | mobile hierarchy, stage geometry, chrome spacing, body boundary가 exact family로 맞아야 한다. |
| non-gating metric | decorative backdrop ornament |
| local surface | mobile stage, chrome slot, content-first grid, reading hierarchy |
| canonical surface role | `frame-surface`, `control-surface`, `content-surface`, `ornament-surface` |
| comparison policy | hierarchy와 geometry는 `gating`, backdrop ornament는 `advisory` |
| metric treatment | `layout-only` |

### 검증 근거

| 항목 | 확인 수단 |
| --- | --- |
| exact `[data-window-compare-stage]` owner | source inspection |
| desktop/mobile stage geometry | source inspection |
| Folder/Browser differentiated mobile hierarchy | source inspection |

## 실행 계약

- owner_agent: `frontend-developer`
- 목적:
  - shared shell과 responsive hierarchy를 먼저 고정해 later public contract phase가 chrome/mobile rule과 compare stage geometry를 다시 추측하지 않게 만든다.
- boundary:
  - `packages/tailwind-config/src/theme.css`
  - `packages/tailwind-config/src/utilities.css`
  - `packages/ui/src/components/windows/internal/windowFrame/index.tsx`
  - `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx`
  - `packages/ui/src/components/windows/storybook/compareWindowStage.tsx`
- input:
  - 시나리오: maintainer가 windows family shared shell을 만들되, Folder/Browser leaf-specific chrome 차이와 mobile hierarchy, compare stage geometry를 foundation 단계에서 먼저 닫아야 하는 경우
  - exact upstream artifact:
    - `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/spec/figma-mcp-artifact.md`
    - `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/baseline-inventory.md`
  - repo-local execution contract:
    - package validation boundary: `pnpm --filter @windows/ui build-storybook`
  - design constraints:
    - `WindowFrame`는 shared structure owner다.
    - Folder/Browser chrome variant는 leaf-specific로 유지한다.
    - Folder mobile은 content-first grid다.
    - Browser mobile은 simplified chrome/content-first reading hierarchy다.
    - compare stage geometry는 desktop `1024x700`, mobile `375x680`이다.
    - `data-window-compare-stage` values는 정확히 `desktop`, `mobile` 두 개뿐이다.
    - desktop compare cases(`folder/live-*`, `browser/live-*`)는 `desktop`, mobile compare cases(`folder/mobile-*`, `browser/mobile-*`)는 `mobile`을 쓴다.
- output:
  - 공개 계약:
    - `--window-*` token namespace가 windows shell/chrome/input/dropdown/mobile spacing surface를 소유한다.
    - `WindowFrame`는 internal-only shared shell owner다.
    - exact `[data-window-compare-stage]`는 compare stage canonical owner다.
    - `data-window-compare-stage` values는 정확히 `desktop`, `mobile` 두 개뿐이다.
    - desktop compare cases(`folder/live-*`, `browser/live-*`)는 `desktop`, mobile compare cases(`folder/mobile-*`, `browser/mobile-*`)는 `mobile`을 쓴다.
    - stage geometry는 desktop `1024x700`, mobile `375x680`이다.
    - leaf-specific chrome variant와 mobile hierarchy는 later leaf owner가 유지한다.
  - 내부 기본값:
    - reference stage와 compare stage는 same geometry family를 공유한다.
    - later phase는 foundation helper가 잠근 selector와 geometry를 read-only prerequisite로 사용한다.
  - 허용하지 않는 대안:
    - `panels` component를 shared shell canonical owner로 승계하는 선택
    - Folder/Browser chrome을 하나의 identical treatment로 강제하는 선택
    - mobile hierarchy를 desktop shrink variant로 처리하는 선택
    - compare phase가 stage geometry를 다시 조정하는 선택
- 작업:
  1. `window` token namespace와 shared shell owner를 추가한다.
  2. exact compare stage owner와 stage geometry를 고정한다.
  3. leaf-specific chrome differentiation과 mobile hierarchy rule을 literal하게 적는다.
- 검증:
  - [ ] `rg -n "window-" ".\\packages\\tailwind-config\\src\\theme.css" ".\\packages\\tailwind-config\\src\\utilities.css"`로 `window` namespace가 shell/chrome/mobile spacing surface를 소유함을 확인할 수 있다.
  - [ ] `rg -n "data-window-compare-stage|desktop|mobile|1024x700|375x680" ".\\packages\\ui\\src\\components\\windows\\storybook\\compareWindowStage.tsx"`로 exact capture owner, stageAttr values, geometry가 literal하게 고정됨을 확인할 수 있다.
  - [ ] `rg -n "panels" ".\\packages\\ui\\src\\components\\windows\\internal\\windowFrame\\index.tsx"` 결과가 비어 있어 `panels` reuse가 canonical owner가 아님을 확인할 수 있다.
  - [ ] `pnpm --filter @windows/ui build-storybook`가 foundation/stage 경계에서 green이어야 한다.

## Phase 검증

| 검증 항목 | 확인 수단 | 기대 결과 |
| --- | --- | --- |
| `window` token namespace 고정 | `theme.css`, `utilities.css` inspection | shared shell/chrome/mobile spacing token이 `window` namespace에 있다. |
| `WindowFrame` internal-only owner 고정 | `windowFrame/index.tsx` inspection | shared shell owner가 leaf-specific chrome을 slot으로 남긴다. |
| exact capture owner와 stage geometry 고정 | `compareWindowStage.tsx` inspection | exact `[data-window-compare-stage]`, exact stage values `desktop` / `mobile`, desktop `1024x700`, mobile `375x680`이 보인다. |
| differentiated mobile hierarchy 고정 | `windowReferenceStage.tsx` inspection | Folder/Browser의 서로 다른 mobile grammar가 보인다. |
