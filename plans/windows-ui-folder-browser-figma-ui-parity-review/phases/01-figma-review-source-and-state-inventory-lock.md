# Phase 1. Figma 기준선과 상태 inventory 고정

> 이 문서는 Windows Figma file 안의 live reference frame를 이번 slug의 유일한 review baseline으로 고정하는 실행용 상세 계약이다.
> old live-site 보고서나 legacy story key를 다시 authoritative source로 끌어오지 못하게 막는 phase다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | Figma file `NrUGKPZUewpuA8XuHI0v5n`의 frame `Live UI References - Folder Browser`와 canonical state 6개를 plan-local baseline inventory로 고정한다. |
| 선행조건 | `state.json.preflight.complete = true` |
| 완료 판단 | `baseline-inventory.md`만 읽어도 Figma source, state key, export size, per-state diff bucket 규칙을 다시 추측하지 않아도 된다. |
| 중단 조건 | Figma frame를 specific state label 6개로 분해하지 못하거나 node id를 stable contract로 고정해야만 실행이 가능하다면 blocker다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-figma-ui-parity-review/reference-captures/baseline-inventory.md` | 추가 | primary provenance는 Figma file key + frame name + state label로 적고, current node hint는 lookup note로만 적는다. | baseline inventory가 6 state와 bucket taxonomy를 literal하게 기록한다. |
| `plans/windows-ui-folder-browser-figma-ui-parity-review/reference-captures/folder-desktop-blog.png` | 추가 | Figma frame에서 `folder/desktop-blog` reference를 pin한 PNG다. | file name과 state key가 1:1로 맞다. |
| `plans/windows-ui-folder-browser-figma-ui-parity-review/reference-captures/folder-desktop-search-open.png` | 추가 | Figma frame에서 `folder/desktop-search-open` reference를 pin한 PNG다. | file name과 state key가 1:1로 맞다. |
| `plans/windows-ui-folder-browser-figma-ui-parity-review/reference-captures/browser-desktop-article.png` | 추가 | Figma frame에서 `browser/desktop-article` reference를 pin한 PNG다. | file name과 state key가 1:1로 맞다. |
| `plans/windows-ui-folder-browser-figma-ui-parity-review/reference-captures/browser-desktop-address-open.png` | 추가 | Figma frame에서 `browser/desktop-address-open` reference를 pin한 PNG다. | file name과 state key가 1:1로 맞다. |
| `plans/windows-ui-folder-browser-figma-ui-parity-review/reference-captures/folder-mobile-blog.png` | 추가 | Figma frame에서 `folder/mobile-blog` reference를 pin한 PNG다. | file name과 state key가 1:1로 맞다. |
| `plans/windows-ui-folder-browser-figma-ui-parity-review/reference-captures/browser-mobile-article.png` | 추가 | Figma frame에서 `browser/mobile-article` reference를 pin한 PNG다. | file name과 state key가 1:1로 맞다. |

### 완료 증거

- Figma primary provenance가 `fileKey + frame name + state label` 기준으로 잠긴다.
- canonical state 6개가 Figma label 그대로 inventory에 기록된다.
- desktop export size `1282x752`, mobile export size `392x796`가 baseline contract로 잠긴다.
- report bucket 규칙이 state별 blocker와 leaf noise를 분리할 수 있을 만큼 명시된다.

## 실행 계약

- owner_agent: `visual-comparator`
- 목적:
  - Figma file 안의 live reference frame를 이번 slug의 primary acceptance source로 동결하고, compare phase가 같은 state inventory와 같은 분류 vocabulary를 쓰게 만든다.
- 작업 순서:
  1. file `NrUGKPZUewpuA8XuHI0v5n`에서 frame name `Live UI References - Folder Browser`를 찾고 state label 6개를 확인한다.
  2. label과 export image를 같은 `kind/state` key로 plan-local PNG에 pin한다.
  3. `baseline-inventory.md`에 per-state blocking focus, non-blocking review surface, fixture noise rule을 적는다.
- boundary: plan-local `reference-captures/**`만 쓴다. source-tree UI나 old parity report는 이번 phase의 output을 대신하지 못한다.
- input:
  - 시나리오: maintainer가 Figma frame를 primary source로 삼아 later compare와 fix를 같은 vocabulary로 시작해야 하는 경우
  - exact Figma source:
    - file key: `NrUGKPZUewpuA8XuHI0v5n`
    - primary recipient URL: `https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows`
    - authoritative frame name: `Live UI References - Folder Browser`
    - current frame node hint: `7:2` (lookup only, stable contract 아님)
  - exact state labels and current image-node hints:
    - `folder/desktop-blog` -> current text `7:13`, current image `7:15`
    - `folder/desktop-search-open` -> current text `7:18`, current image `7:20`
    - `browser/desktop-article` -> current text `7:23`, current image `7:25`
    - `browser/desktop-address-open` -> current text `7:28`, current image `7:30`
    - `folder/mobile-blog` -> current text `7:33`, current image `7:35`
    - `browser/mobile-article` -> current text `7:38`, current image `7:40`
  - exact export size contract:
    - desktop states -> `1282x752`
    - mobile states -> `392x796`
  - per-family blocking focus:
    - `Folder` blocking focus -> thumbnail + title + grid/card layout
    - `Browser` blocking focus -> WindowFrame + toolbar + address dropdown + body boundary
  - per-family non-blocking/noise rules:
    - `Folder` non-blocking -> search/chip overlay exactness, sidebar/chrome exactness, icon glyph exact shape
    - `Folder` fixture noise -> `metaLabel`, `summary`, thumbnail art 자체, exact copy
    - `Browser` non-blocking -> glyph exactness, minor chrome copy drift outside geometry
    - `Browser` fixture noise -> article title/body copy length, cover art, exact dropdown text copy when geometry를 바꾸지 않는 경우
- output:
  - 공개 계약:
    - authoritative source는 Figma frame name과 state label 6개다.
    - current node id는 lookup hint일 뿐 canonical identifier가 아니다.
    - baseline PNG naming은 `{kind}-{state}.png`다.
    - `baseline-inventory.md`는 state별 `blocking focus`, `non-blocking differences`, `fixture noise` rule을 적는다.
    - `folder/desktop-search-open`과 `browser/desktop-address-open`은 canonical compare inventory 안에 포함되지만, out-of-scope leaf mismatch를 blocker로 승격하지 않는다.
  - 내부 기본값:
    - `Folder` open search/chip affordance의 exact visual match는 first-pass blocker가 아니다.
    - `Browser` body interior copy는 boundary validation용 reference로만 본다.
  - 허용하지 않는 대안:
    - old live-site capture report를 primary provenance로 재사용하지 않는다.
    - `desktop-card`/`desktop-chrome` 같은 legacy key를 baseline inventory에 canonical로 적지 않는다.
    - node `7:2`가 바뀌면 전체 plan contract도 바뀐다고 가정하지 않는다.
- 선행조건:
  - orchestrator preflight가 complete여야 한다.
- 제약:
  - plan-local baseline inventory는 Figma primary provenance와 current node hint를 명확히 분리해야 한다.
  - state label 6개를 exact literal로 적어 later story ID와 artifact name이 그대로 파생되게 해야 한다.
  - `blocking differences`, `non-blocking differences`, `fixture noise` 정의가 later phase에서 다시 해석되지 않게 state별 메모를 남겨야 한다.
- side effects:
  - Phase 2가 source-tree state key와 compare geometry를 Figma baseline에 맞춰 literal하게 정렬할 수 있다.
  - Phase 4 report가 old live-site wording 대신 Figma-backed taxonomy를 그대로 재사용할 수 있다.
- failure/validation:
  - frame name 대신 transient node id만으로 baseline을 잠그면 blocker다.
  - desktop `1282x752`, mobile `392x796` contract를 inventory에서 누락하면 later compare geometry가 다시 추측되므로 blocker다.
  - `Folder` metaLabel/summary나 `Browser` article copy를 blocking bucket으로 올리면 blocker다.
- 검증:
  - [ ] `reference-captures/baseline-inventory.md`가 file key, frame name, current node hint, state label 6개를 모두 적는다.
  - [ ] `reference-captures/*.png` 6개가 exact `{kind}-{state}.png` 규칙으로 존재한다.
  - [ ] baseline inventory가 state별 blocking/non-blocking/noise 규칙을 명시한다.
