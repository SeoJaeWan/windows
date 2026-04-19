**Branch:** fix/windows-ui-folder-browser-figma-ui-parity-review

> Worktree dir: `worktrees/windows-ui-folder-browser-figma-ui-parity-review`

| # | Phase | Agent |
| --- | --- | --- |
| 1 | `./phases/01-figma-review-source-and-state-inventory-lock.md` | `visual-comparator` |
| 2 | `./phases/02-windows-figma-review-registration-and-compare-surface-lock.md` | `frontend-developer` |
| 3 | `./phases/03-window-frame-folder-browser-first-pass-parity-lock.md` | `frontend-developer` |
| 4 | `./phases/04-figma-compare-report.md` | `visual-comparator` |
| 5 | `./phases/05-blocking-drift-closure.md` | `frontend-developer` |

## 사전 합의

### 요청 대응표

| 사용자 요청 항목 | 이번 계획에서 고정한 범위 | 반영 위치 | 남은 미결정 |
| --- | --- | --- | --- |
| Figma live reference already exists in the Windows Figma file and is now the review source of truth. | authoritative reference는 Figma file `NrUGKPZUewpuA8XuHI0v5n` 안의 frame name `Live UI References - Folder Browser`로 고정한다. current node `7:2`는 조회 힌트일 뿐 stable contract가 아니다. | Phase 1, Phase 4, `reference-captures/**`, `windowFigmaReviewRegistration.ts` | 없음 |
| Browser 1st-pass blocking review scope is WindowFrame + toolbar + address dropdown + body boundary only. | Browser blocking diff는 frame geometry, toolbar/address area, address dropdown placement, body boundary/overflow까지만 닫는다. article body copy/content length는 blocker가 아니다. | Phase 1, Phase 3, Phase 4, Phase 5 | 없음 |
| Folder 1st-pass blocking review scope is thumbnail + title + grid/card layout. | Folder blocking diff는 entry card의 thumbnail/title placement, grid density, card geometry로 제한한다. sidebar/search/meta copy는 이번 pass의 parity winner가 아니다. | Phase 1, Phase 3, Phase 4, Phase 5 | 없음 |
| Folder metaLabel and summary are OUT of scope and should not be planned as parity winners. | `metaLabel`/`summary`는 rendered leaf content로 유지할 수 있지만 exact parity failure로 승격하지 않는다. | Phase 1, Phase 3, Phase 4, Phase 5 | 없음 |
| Icon glyph exact match is OUT of scope; icon libraries may remain as-is while layout/geometry/color/spacing are matched. | icon slot의 width, alignment, spacing은 in-scope지만 glyph shape 자체는 non-blocking 또는 fixture noise로만 분류한다. | Phase 1, Phase 3, Phase 4, Phase 5 | 없음 |
| The review result shape the user wants is: for each of the 6 canonical states, separate blocking differences, non-blocking differences, and fixture noise. | compare report는 6개 canonical state 각각에 대해 `blocking differences`, `non-blocking differences`, `fixture noise`를 별도 구획으로 남겨야 한다. | Phase 1, Phase 4, Phase 5, `visual-compare/report.md` | 없음 |
| Keep the touched implementation boundary inside packages/ui/src/components/windows/** plus the windows storybook fixtures/tests/compare artifacts that support parity review and verification. | source-tree 수정은 `packages/ui/src/components/windows/**`와 plan-local compare artifact로 제한한다. taskbar helper와 외부 consumer surface는 read-only 참고만 허용한다. | Phase 2, Phase 3, Phase 5 | 없음 |
| Plan should be end-to-end enough to make the next execution pass unambiguous. | plan은 source lock -> registration -> blocking parity -> compare report -> blocking closure를 모두 포함하고, implementation 전 `plan-materializer`가 bounded-surface coverage를 자동 선행한다. | Phase 2, Phase 3, Phase 5 | 없음 |

### 공개 계약 요약

| 대상 | 공개 surface / 계약 | state ownership / handoff | 금지 / no-op |
| --- | --- | --- | --- |
| Figma review source | `NrUGKPZUewpuA8XuHI0v5n` file 안의 frame name `Live UI References - Folder Browser`와 그 하위 state label 6개가 canonical review inventory다. | frame name + state label이 owner다. current node id는 lookup hint만 담당한다. | old live-site screenshot/report wording을 authoritative acceptance로 재사용하지 않는다. |
| `WindowFrame` | internal foundation으로 `data-window-frame-root`, `data-window-frame-chrome`, `data-window-frame-body`만 소유한다. `[data-window-compare-stage]`는 소유하지 않는다. | package-owned frame marker가 항상 consumer `...rest`보다 우선한다. | stage owner를 `WindowFrame`로 재해석하거나 compare geometry를 frame marker에서 추측하지 않는다. |
| `compareWindowStage.tsx` | `[data-window-compare-stage="desktop"|"mobile"]`와 compare outer geometry `1282x752` / `392x796`의 유일한 DOM owner다. | compare-stage helper가 stage selector와 capture box를 소유한다. `WindowFrame`는 그 안쪽 frame/body marker만 제공한다. | consumer attr나 `WindowFrame`가 stage marker를 같이 소유한다고 해석하지 않는다. |
| `Folder` | compare state는 `folder/desktop-blog`, `folder/desktop-search-open`, `folder/mobile-blog`로 고정한다. blocking parity winner는 thumbnail + title + grid/card layout이다. | `entries`, `addressLabel`, existing search/chip props는 host-owned contract를 유지한다. | `metaLabel`, `summary`, exact thumbnail art, icon glyph shape를 blocker로 승격하지 않는다. |
| `Browser` | compare state는 `browser/desktop-article`, `browser/desktop-address-open`, `browser/mobile-article`로 고정한다. blocking parity winner는 WindowFrame + toolbar + address dropdown + body boundary다. | `children` body slot과 existing address props는 host-owned contract를 유지한다. | article copy/content length, cover art, exact glyph shape를 blocker로 승격하지 않는다. |
| windows recipient registry | source-tree는 Figma recipient URL, frame name, compare story ID, review story ID, compare stage geometry metadata를 `windowFigmaReviewRegistration.ts` 한 곳에서 읽을 수 있어야 한다. | readable registry owner는 `windowFigmaReviewRegistration.ts`다. DOM marker owner는 `compareWindowStage.tsx`, `WindowCompareRoot`, `WindowReviewRoot`가 각자 맡는다. | review recipient ownership을 story 주석이나 test import에만 분산시키지 않는다. |

### 제외 항목

| 항목 | 이번 계획 처리 | 이유 | 사용자 승인 상태 |
| --- | --- | --- | --- |
| Browser article body copy/content length exact match | 제외, `fixture noise`로 분류 | first-pass blocking scope가 body boundary까지만 열려 있고 본문 copy parity는 user-locked OOS다. | 승인됨 |
| Folder `metaLabel` / `summary` exact match | 제외, `fixture noise`로 분류 | user가 parity winner로 취급하지 말라고 고정했다. | 승인됨 |
| icon glyph exact match | 제외, `non-blocking` 또는 `fixture noise`로만 분류 | icon library 교체 없이 geometry/color/spacing만 맞추는 것이 이번 pass의 정책이다. | 승인됨 |
| actual navigation, filtering, window-manager behavior | 제외 | 이번 slug는 visual parity review와 blocking drift closure만 다루며 app behavior는 열지 않는다. | 승인됨 |

## 전체 작업 지도

### 작업 묶음

| 작업 묶음 | 관련 파일/영역 | 이번에 바꾸는 것 | 유지되는 것 | 완료 판단 |
| --- | --- | --- | --- | --- |
| Figma 기준선 inventory | `plans/windows-ui-folder-browser-figma-ui-parity-review/reference-captures/**` | Figma file/frame provenance, 6 state label, export size, classification taxonomy, plan-local reference PNG를 고정한다. | source-tree 구현 파일은 건드리지 않는다. | baseline inventory만 읽어도 어떤 state와 어떤 diff bucket을 써야 하는지 다시 추측하지 않는다. |
| windows Figma review registration | `packages/ui/src/components/windows/storybook/windowFigmaReviewRegistration.ts`, stories, fixtures, inventory tests | Figma recipient URL, frame name, canonical state key, compare story ID, review story ID, compare stage geometry metadata를 source-tree 한 곳에 모은다. | taskbar registration convention은 read-only 참고로만 쓴다. | compare/review recipient registry가 Figma key와 legacy-free naming으로 잠긴다. |
| compare geometry + state-key alignment | `compareWindowStage.tsx`, `windowCompareRoot.tsx`, `windowCompareInventory.test.tsx`, Folder/Browser compare stories | current `desktop-card/chrome` taxonomy와 1280x750 / 390x794 stage를 Figma 1282x752 / 392x796 기반 contract로 교체하고, `[data-window-compare-stage]` owner를 `compareWindowStage.tsx`로 단일화한다. | `WindowReviewRoot` marker owner와 review-only edge stories는 유지한다. | current capture surface가 Figma export와 같은 key와 같은 outer geometry를 가진다. |
| first-pass blocking product parity | `internal/windowFrame/index.tsx`, `folder/index.tsx`, `browser/index.tsx`, windows fixtures | user-locked blocking scope에 해당하는 layout/geometry/color/spacing만 맞추고 out-of-scope leaf content는 남긴다. | public component identity, body `children`, existing host props는 유지한다. | source를 읽으면 어떤 mismatch가 blocker이고 어떤 mismatch가 later-pass인지 바로 설명할 수 있다. |
| compare evidence + rerun | `plans/windows-ui-folder-browser-figma-ui-parity-review/capture-current.mjs`, `visual-compare/**` | current capture, diff, report를 6 key에 맞춰 생성하고 blocking-only closure를 다시 기록한다. | source-tree outside windows boundary는 건드리지 않는다. | report가 6 state 각각에 대해 blocking/non-blocking/noise를 분리해 남긴다. |

### 상태 키 연속성

| legacy local key | canonical Figma key | 적용 위치 | 처리 |
| --- | --- | --- | --- |
| `folder/desktop-card` | `folder/desktop-blog` | fixtures, compare stories, `data-visual-state`, capture/diff/report artifact | legacy key를 retire하고 canonical key로 통일한다. |
| `folder/mobile-card` | `folder/mobile-blog` | fixtures, compare stories, `data-visual-state`, capture/diff/report artifact | legacy key를 retire하고 canonical key로 통일한다. |
| `browser/desktop-chrome` | `browser/desktop-article` | fixtures, compare stories, `data-visual-state`, capture/diff/report artifact | legacy key를 retire하고 canonical key로 통일한다. |
| `browser/mobile-chrome` | `browser/mobile-article` | fixtures, compare stories, `data-visual-state`, capture/diff/report artifact | legacy key를 retire하고 canonical key로 통일한다. |
| `folder/desktop-search-open` | `folder/desktop-search-open` | compare stories, report artifact | 그대로 유지한다. |
| `browser/desktop-address-open` | `browser/desktop-address-open` | compare stories, report artifact | 그대로 유지한다. |

### canonical Figma 상태 inventory

| state key | compare story ID | Figma export size | blocking focus | non-blocking / fixture noise 힌트 |
| --- | --- | --- | --- | --- |
| `folder/desktop-blog` | `windows-compose-folder--compare-desktop-blog` | `1282x752` | thumbnail + title + grid/card layout | sidebar/search/detail copy/icon glyph은 blocker가 아니다. |
| `folder/desktop-search-open` | `windows-compose-folder--compare-desktop-search-open` | `1282x752` | thumbnail + title + grid/card layout | open search/chip affordance exactness는 non-blocking으로만 남긴다. |
| `browser/desktop-article` | `windows-compose-browser--compare-desktop-article` | `1282x752` | WindowFrame + toolbar + body boundary | article body copy/content length/cover art는 fixture noise다. |
| `browser/desktop-address-open` | `windows-compose-browser--compare-desktop-address-open` | `1282x752` | WindowFrame + toolbar + address dropdown + body boundary | dropdown exact copy와 glyph 모양은 blocker가 아니다. |
| `folder/mobile-blog` | `windows-compose-folder--compare-mobile-blog` | `392x796` | thumbnail + title + grid/card layout | mobile chrome exactness와 detail copy는 later-pass 또는 noise다. |
| `browser/mobile-article` | `windows-compose-browser--compare-mobile-article` | `392x796` | WindowFrame + toolbar + body boundary | article body copy/content length/cover art는 fixture noise다. |

### 분류 규칙

| 분류 | 이번 plan에서 의미하는 것 | Phase 4/5 처리 |
| --- | --- | --- |
| `blocking differences` | user-locked first-pass scope 안의 layout, geometry, spacing, color, boundary mismatch | Phase 5가 반드시 수정하거나 explicit blocker로 남긴다. empty bucket이어도 `없음`으로 유지한다. |
| `non-blocking differences` | 이번 pass의 blocker는 아니지만 later parity pass에서 다시 볼 visible mismatch | Phase 4 report에 남기되 Phase 5 완료 조건으로 승격하지 않는다. final rerun에도 같은 bucket이 구조적으로 남는다. |
| `fixture noise` | fixture text/image/icon glyph/copy length처럼 이번 pass에서 parity winner가 아닌 mismatch | report에 분리 기록만 하고 수정 대상으로 삼지 않는다. final rerun에도 같은 bucket이 구조적으로 남는다. |

## 단계별 실행

### Phase 1. Figma 기준선과 분류 inventory 고정

| 항목 | 내용 |
| --- | --- |
| 목적 | Figma frame `Live UI References - Folder Browser`를 이번 slug의 유일한 review baseline으로 고정하고 state별 분류 규칙을 닫는다. |
| 변경 내용 | file key, frame name, current node hint, state label 6개, export size `1282x752` / `392x796`, blocking/non-blocking/noise taxonomy, plan-local reference PNG naming을 고정한다. |
| 이전 상태 | acceptance wording이 old live-site report와 local `desktop-card/chrome` taxonomy에 섞여 있고 Figma frame가 primary source로 승격돼 있지 않다. |
| 이후 상태 | baseline inventory만 읽어도 Figma source, canonical key, pixel size, review bucket 규칙이 한 번에 보인다. |
| 완료 조건 | `reference-captures/baseline-inventory.md`와 6개 reference PNG가 Figma provenance와 exact key를 기준으로 잠겨야 한다. |
| 관련 영역 | `plans/windows-ui-folder-browser-figma-ui-parity-review/reference-captures/**`, Figma file `NrUGKPZUewpuA8XuHI0v5n` |
| 상세 | `./phases/01-figma-review-source-and-state-inventory-lock.md` |

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-figma-ui-parity-review/reference-captures/baseline-inventory.md` | 추가 | Figma file/frame provenance, 6 state label, exact export size, per-state bucket taxonomy가 문서로 고정된다. | reviewer가 old report를 다시 열지 않아도 된다. |
| `plans/windows-ui-folder-browser-figma-ui-parity-review/reference-captures/*.png` | 추가 | Figma frame에서 pin한 reference PNG 6개가 `{kind}-{state}.png` 규칙으로 남는다. | compare phase가 live-site recapture 없이 바로 diff를 시작할 수 있다. |

### Phase 2. windows Figma review registration과 compare surface 고정

| 항목 | 내용 |
| --- | --- |
| 목적 | source-tree가 Figma-backed canonical key, compare story ID, compare geometry를 한 곳에서 읽도록 정렬한다. |
| 변경 내용 | `windowFigmaReviewRegistration.ts`를 추가하고 compare/review recipient registry, compare story/fixture/test/root/stage를 Figma key와 `1282x752` / `392x796` geometry로 맞춘다. |
| 이전 상태 | current windows compare surface는 `desktop-card/chrome` legacy key와 `1280x750` / `390x794` stage를 쓰고 있어 Figma export와 literal parity가 없다. |
| 이후 상태 | storybook compare surface, `data-visual-state`, capture inventory, Figma recipient URL이 같은 canonical key를 공유한다. |
| 완료 조건 | compare/review story ID registry, `data-visual-state`, reference artifact key, compare stage geometry, stage owner contract가 모두 Figma inventory와 1:1로 맞아야 한다. |
| 관련 영역 | `packages/ui/src/components/windows/storybook/**`, `folder/folder.stories.tsx`, `browser/browser.stories.tsx` |
| 상세 | `./phases/02-windows-figma-review-registration-and-compare-surface-lock.md` |

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/storybook/windowFigmaReviewRegistration.ts` | 추가 | Figma recipient URL, frame name, canonical state inventory, compare story ID, review story ID, compare stage size metadata가 한 곳에 모인다. | source-tree가 Figma source와 compare/review recipient registry를 문자열 중복 없이 읽는다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.tsx`, `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 조정 | fixture constant와 state key가 canonical Figma label로 정렬된다. | legacy `desktop-card/chrome` key가 compare inventory에서 사라진다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx`, `packages/ui/src/components/windows/browser/browser.stories.tsx` | 조정 | compare story export와 story ID가 Figma state label을 그대로 반영한다. | `windows-compose-*--compare-*` ID가 report/capture script와 literal하게 맞는다. |
| `packages/ui/src/components/windows/storybook/compareWindowStage.tsx`, `packages/ui/src/components/windows/storybook/windowCompareRoot.tsx`, `packages/ui/src/components/windows/storybook/windowReviewRoot.tsx` | 조정 | `compareWindowStage.tsx`는 stage marker의 유일한 owner가 되고, compare/review root marker는 각자 canonical metadata owner를 유지한다. | current capture와 review recipient가 owner ambiguity 없이 설명된다. |
| `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx`, `packages/ui/src/components/windows/storybook/windowReviewInventory.test.tsx` | 조정 | inventory tests가 canonical key, story recipient, stage owner contract를 다시 잠근다. | vitest가 Figma-backed compare/review inventory drift를 바로 막는다. |

### Phase 3. WindowFrame, Folder, Browser 1차 blocking parity 고정

| 항목 | 내용 |
| --- | --- |
| 목적 | user가 잠근 first-pass blocking scope에 한해 현재 windows UI를 Figma parity 방향으로 정렬한다. |
| 변경 내용 | `WindowFrame` outer geometry/body boundary, Browser toolbar/address dropdown/body boundary, Folder thumbnail/title/grid/card layout을 맞추고 out-of-scope leaf content는 분류 가능한 상태로 남긴다. |
| 이전 상태 | current source는 이전 parity pass의 범위를 섞어 들고 있어 blocker와 later-pass 항목이 분리돼 있지 않다. |
| 이후 상태 | source를 읽으면 어떤 mismatch가 blocking이고 어떤 mismatch가 non-blocking/noise인지 명확해진다. |
| 완료 조건 | Browser와 Folder의 compare states가 Figma key별 blocking winner를 설명할 수 있어야 하고 out-of-scope leaf content를 blocker로 만들지 않아야 한다. |
| 관련 영역 | `packages/ui/src/components/windows/internal/windowFrame/index.tsx`, `browser/index.tsx`, `folder/index.tsx`, windows fixtures/stories |
| 상세 | `./phases/03-window-frame-folder-browser-first-pass-parity-lock.md` |

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/index.tsx` | 조정 | Figma review 기준 outer frame geometry와 body boundary가 compare owner contract로 고정된다. | stage/root/body marker와 visual border box가 Figma export와 같은 grammar를 가진다. |
| `packages/ui/src/components/windows/browser/index.tsx` | 조정 | toolbar, address area, dropdown, body boundary가 first-pass blocking scope 기준으로 정렬된다. | article body copy/content length와 분리된 blocking parity surface가 설명된다. |
| `packages/ui/src/components/windows/folder/index.tsx` | 조정 | thumbnail/title/grid/card layout이 first-pass blocking scope 기준으로 정렬된다. | `metaLabel`/`summary`가 rendered leaf여도 blocker로 승격되지 않는다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.tsx`, `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 조정 | fixture data가 blocking winner와 noise source를 분리해 설명한다. | report가 leaf content noise를 구조 drift와 섞지 않는다. |

### Phase 4. Figma compare report 생성

| 항목 | 내용 |
| --- | --- |
| 목적 | Figma baseline과 current Storybook surface를 same key로 대조해 state별 3-bucket report를 남긴다. |
| 변경 내용 | current capture script, diff script, `diff-results.json`, same-path `visual-compare/report.md`를 이번 slug 아래에 만들고 6 state 각각에 대해 blocking/non-blocking/noise 3 bucket을 빈 bucket까지 유지하며 기록한다. |
| 이전 상태 | compare evidence가 old live-site 보고서 언어에 기대거나 key/geometry drift가 있어 Figma source-of-truth handoff가 literal하지 않다. |
| 이후 상태 | plan-local evidence만으로 어느 state의 어떤 mismatch가 Phase 5 fix 대상인지 바로 읽을 수 있다. |
| 완료 조건 | same-path `visual-compare/report.md`가 6 state 각각에 대해 세 bucket을 빈 bucket까지 별도 구획으로 남기고 artifact key와 provenance를 정확히 연결해야 한다. |
| 관련 영역 | `plans/windows-ui-folder-browser-figma-ui-parity-review/capture-current.mjs`, `visual-compare/**` |
| 상세 | `./phases/04-figma-compare-report.md` |

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-figma-ui-parity-review/capture-current.mjs` | 추가 | current compare surface를 canonical story ID와 compare stage selector로 캡처한다. | script가 Figma key 6개와 exact stage geometry를 literal하게 사용한다. |
| `plans/windows-ui-folder-browser-figma-ui-parity-review/visual-compare/run-diff.mjs` | 추가 | reference/current/diff artifact가 same `kind/state` key로 묶인다. | `diff-results.json`와 `report.md`가 같은 key naming을 쓴다. |
| `plans/windows-ui-folder-browser-figma-ui-parity-review/visual-compare/report.md`, `diff-results.json`, `*.png` | 추가/정리 | same-path report와 evidence 세트가 per-state 3 bucket 구조를 유지한 채 남는다. | 6개 state 모두에 대해 artifact와 세 bucket 결과가 존재한다. |

### Phase 5. blocking drift closure

| 항목 | 내용 |
| --- | --- |
| 목적 | Phase 4가 남긴 blocking differences만 닫고 같은 inventory로 final compare를 다시 남긴다. |
| 변경 내용 | `packages/ui/src/components/windows/**`와 windows storybook/test surface 안에서 blocker만 수정하고 same-path `visual-compare/report.md`를 재실행한다. non-blocking/noise는 6 state 모두에서 구조적으로 유지한다. |
| 이전 상태 | Phase 4 report가 blocker를 지적하지만 source tree가 아직 그 결과를 닫지 않았다. |
| 이후 상태 | final report가 6 state 각각에 대해 `blocking differences`, `non-blocking differences`, `fixture noise`를 계속 유지하고, blocking bucket이 비어 있거나 explicit blocker가 무엇인지 명시한다. |
| 완료 조건 | same 6-state inventory로 rerun한 same-path `report.md`가 6 state 각각의 세 bucket을 빈 bucket까지 유지하고, blocker가 사라지거나 남은 blocker가 정확한 state/key로 한정돼 있어야 한다. |
| 관련 영역 | `packages/ui/src/components/windows/**`, `plans/windows-ui-folder-browser-figma-ui-parity-review/visual-compare/**` |
| 상세 | `./phases/05-blocking-drift-closure.md` |

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/**`, `browser/**`, `folder/**` | 조정 | report가 가리킨 blocking surface만 닫는다. | out-of-scope leaf content를 맞추려는 불필요한 fixture inflation 없이 blocker가 줄어든다. |
| `packages/ui/src/components/windows/storybook/**` | 조정 | compare/review inventory와 geometry contract가 blocker closure 이후에도 유지된다. | rerun compare가 같은 key와 stage에서 다시 찍힌다. |
| `plans/windows-ui-folder-browser-figma-ui-parity-review/visual-compare/**` | 갱신 | final evidence와 same-path 3-bucket classification이 남는다. | 6 state 모두 최신 결과와 세 bucket 구조를 가진다. |

## 승인 체크리스트

- [ ] Figma file `NrUGKPZUewpuA8XuHI0v5n`의 frame `Live UI References - Folder Browser`가 authoritative source로 잠겼다.
- [ ] canonical state key 6개와 legacy key retirement 규칙이 plan top-level에서 바로 보인다.
- [ ] `[data-window-compare-stage]`의 유일한 owner가 `compareWindowStage.tsx`로 명시되고 `WindowFrame`와 충돌하지 않는다.
- [ ] Browser blocking scope와 Folder blocking scope가 top-level 표에서 분리돼 있고 out-of-scope leaf content가 blocker로 승격되지 않는다.
- [ ] compare geometry `1282x752` / `392x796`, compare story ID, report key naming이 한 계약으로 연결돼 있다.
- [ ] `visual-compare/report.md`가 final rerun 후에도 6 state 각각에 대해 `blocking differences`, `non-blocking differences`, `fixture noise`를 빈 bucket까지 별도 구획으로 남기도록 강제한다.
- [ ] source-tree 수정 범위가 `packages/ui/src/components/windows/**`와 windows storybook/tests/compare artifacts로 제한돼 있다.
