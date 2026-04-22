**Branch:** feat/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare

> Worktree dir: `worktrees/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare`

# Windows UI Folder/Browser Input Dropdown Contract Figma Direct Implementation Final Compare 실행 계획

| # | Phase | Agent |
| --- | --- | --- |
| 1 | `./phases/01-window-foundation-and-reference-asset-setup.md` | `frontend-developer` |
| 2 | `./phases/02-folder-browser-implementation-and-compare-runtime-lock.md` | `frontend-developer` |
| 3 | `./phases/03-final-visual-acceptance-evidence.md` | `visual-comparator` |

## 사전 합의

### 요청 추적

| 사용자 요청 항목 | 이번 plan에서 다루는 방식 | 연결 작업 단위 | 비고 |
| --- | --- | --- | --- |
| 현재 direct plan의 유효한 계약 내용은 버리지 않고 유지한다. | Folder/Browser 공개 계약, 상태 소유권, 15-state inventory, compare runtime literal, final compare acceptance behavior를 이 plan 안에 다시 고정한다. | 사전 합의 전체, Phase 2, Phase 3 | 다른 plan 재열람 없이 현재 slug만으로 닫는다. |
| rewritten plan은 current architect flow를 따라야 한다. | controller-first `plan.md`와 3개 phase detail로 재작성하고, work bundle과 public contract를 phase order보다 먼저 노출한다. | `plan.md`, `./phases/*.md` | top-level은 `사전 합의 -> 전체 작업 지도 -> 단계별 실행 -> 검토 체크리스트`를 따른다. |
| reference lock을 execution compare phase로 남기지 않는다. | Figma authority, 15-state inventory, provenance, compare key/runtime literal을 `사전 합의`에 plan-level 계약으로 잠근 뒤, Phase 1부터 구현을 시작한다. | `사전 합의`, Phase 1 입력, Phase 2 입력, Phase 3 입력 | reference authority는 이미 여기서 고정된다. |
| executable plan은 standalone이어야 한다. | 다른 plan을 authority, prerequisite, required reading으로 쓰지 않는다. Phase 간 handoff도 현재 slug의 literal contract만 사용한다. | `plan.md`, `./phases/*.md` | plan-to-plan dependency 문구를 제거한다. |
| `Folder`/`Browser` public contract와 state ownership rule을 유지한다. | `Folder` two-input + grid owner, `Browser` single-input + `children` owner, callback handoff only, no public loading/empty/status, no public hover/open/expanded prop을 top-level과 Phase 2에 둘 다 기록한다. | 공개 계약 요약, 소유권/상태 규칙, Phase 2 | `plan-materialize`가 prop 이름을 추측하지 않게 literal하게 적는다. |
| exact 15-state inventory와 compare runtime literal을 유지한다. | 15개 `kind/state`, exact `storyId`, exact `stageAttr`, provenance label template, artifact naming, host/origin/readiness, selector, viewport, `blocking scoped diff threshold = 0.05`, advisory global drift metric을 top-level에서 고정하고 Phase 2/3에서 그대로 재사용한다. Phase 1 baseline PNG는 현재 slug 안으로 locked Figma source에서 직접 export해 확보한다. | 기준 상태 인벤토리, 비교 런타임 리터럴, Phase 1, Phase 2, Phase 3 | compare key drift와 baseline acquisition drift를 둘 다 허용하지 않는다. |
| implementation은 바로 시작하고 final compare는 마지막 phase여야 한다. | Phase 1은 reference asset setup과 window foundation 구현, Phase 2는 Folder/Browser 및 runtime lock, Phase 3은 compare-only acceptance evidence로 둔다. | 단계 개요, Phase 1, Phase 2, Phase 3 | 3-phase standalone topology를 사용한다. |
| final compare가 실패해도 same plan 안에서 숨은 fix phase를 추가하지 않는다. | Phase 3은 read-only compare/report만 수행하고, 결과는 pass 또는 explicit blocker로만 기록한다. | Phase 3, 제외 범위 | follow-up 수정은 다음 revision 입력이다. |

### 작업 단위 요약

| 작업 단위 | 관련 파일/경계 | 현재 문제 | 목표 상태 | 검증 메모 |
| --- | --- | --- | --- | --- |
| locked reference contract와 repo-local baseline asset | `plan.md`, `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/**` | Figma authority, state inventory, provenance, baseline acquisition path가 execution 직전까지 흩어지면 compare phase가 baseline identity와 acquisition source를 다시 발명하게 된다. | plan이 exact source와 15-state inventory를 고정하고, Phase 1이 same key로 local baseline inventory와 PNG mirror를 만든다. PNG는 current slug 안으로 locked Figma source에서 fresh export하며, sibling repo-local bundle은 있어도 authority가 아니다. | baseline row, filename, provenance wording, fresh export path가 exact `kind/state` key에 1:1이어야 한다. |
| window foundation과 compare stage | `packages/tailwind-config/src/*`, `packages/ui/src/components/windows/internal/**`, `packages/ui/src/components/windows/storybook/*Stage.tsx` | shared shell owner, stage geometry, mobile hierarchy가 없으면 leaf phase와 compare phase가 foundation contract를 다시 추정해야 한다. | `WindowFrame`, `--window-*`, exact `[data-window-compare-stage]`, exact `desktop`/`mobile`, stage geometry, differentiated mobile hierarchy가 Phase 1에서 닫힌다. | `pnpm --filter @windows/ui build-storybook`를 foundation boundary에서 green으로 통과해야 한다. |
| Folder leaf contract | `packages/ui/src/components/windows/folder/**`, `packages/ui/src/components/windows/storybook/folderReferenceFixtures.tsx`, `packages/ui/src/components/windows/shared/types.ts` | chip-open, sidebar-hover, sidebar-expanded, thumbnail-hover, mobile-search-open이 public API인지 review-only state인지 흔들릴 수 있고, dropdown/chip/sidebar/grid selection payload와 id namespace도 해석이 갈릴 수 있다. | `Folder` exact prop names, two-input winner rule, callback family별 emitted arg shape, domain-local id namespace, no-op recipient rule, detail-state ownership이 Phase 2에서 고정된다. | Folder 8개 state와 selection callback contract가 exact story inventory 및 source array domain과 1:1로 연결돼야 한다. |
| Browser leaf contract | `packages/ui/src/components/windows/browser/**`, `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx`, `packages/ui/src/components/windows/shared/types.ts` | address-open, control-hover 3종, mobile-address-open이 public API로 새어 나갈 위험이 있고, address dropdown selection payload와 nav/window-control callback shape도 구현마다 달라질 수 있다. | `Browser` exact prop names, single-input winner rule, callback family별 emitted arg shape, domain-local id namespace, no-op recipient rule, detail-state ownership이 Phase 2에서 고정된다. | Browser 7개 state와 address/nav/window-control callback contract가 exact story inventory 및 source array domain과 1:1로 연결돼야 한다. |
| compare runtime, root entry proof, final evidence | `packages/ui/src/components/windows/**/*.stories.tsx`, `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx`, `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`, `packages/ui/src/index.ts`, `packages/ui/src/index.test.ts`, `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs`, `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/**` | compare runtime literal이 늦게 잠기면 final compare가 storyId, host, selector, provenance, blocking/advisory metric semantics를 compare phase에서 다시 정하게 된다. | Phase 2가 exact runtime contract와 positive root import proof를 닫고, same host/origin/readiness/selector/viewport로 current-side harness smoke를 먼저 통과시킨 뒤, Phase 3은 same contract를 실행만 한다. | `vitest`, `build-storybook`, current-side harness smoke로 runtime contract를 잠근 뒤 report가 pass 또는 explicit blocker를 남겨야 한다. |

### 공개 계약 요약

| 대상 | public surface | state ownership | callback / handoff | invalid / no-op |
| --- | --- | --- | --- | --- |
| `Folder` | `title`, `locationValue`, `searchValue`, `locationDropdownItems?`, `searchDropdownItems?`, `searchChips?`, `sidebarItems`, `activeSidebarItemId?`, `items`, `onOpenLocationDropdown?`, `onLocationValueChange?`, `onLocationSubmit?`, `onSelectLocationDropdownItem?`, `onOpenSearchDropdown?`, `onSearchValueChange?`, `onSearchSubmit?`, `onSelectSearchDropdownItem?`, `onSelectSearchChip?`, `onSelectSidebarItem?`, `onOpenItem?`, `onMinimize?`, `onToggleMaximize?`, `onClose?` | `locationValue`, `searchValue`, payload arrays는 host-owned, dropdown open/close와 detail-state scaffolding은 storybook/internal review owner, body grid는 component-owned | `onOpenLocationDropdown()`, `onOpenSearchDropdown()`, `onMinimize()`, `onToggleMaximize()`, `onClose()`는 무인자 통지다. `onLocationValueChange(nextValue: string)`, `onSearchValueChange(nextValue: string)`는 raw string만 보낸다. `onLocationSubmit(locationValue: string)`, `onSearchSubmit(searchValue: string)`는 현재 표시 winner 값만 보낸다. `onSelectLocationDropdownItem(locationItem: FolderLocationDropdownItem)`, `onSelectSearchDropdownItem(searchItem: FolderSearchDropdownItem)`, `onSelectSearchChip(chip: FolderSearchChip)`, `onSelectSidebarItem(sidebarItem: FolderSidebarItem)`, `onOpenItem(item: FolderGridItem)`은 각 source array에서 고른 exact item object만 보낸다. | `locationDropdownItems`, `searchDropdownItems`, `searchChips`, `sidebarItems`, `items`는 서로 다른 id namespace다. callback name이 recipient/source를 고정하고, 같은 `id`가 다른 domain에 반복되어도 cross-domain 해석하지 않는다. source array에 없는 id, missing callback, hidden dropdown/open affordance는 no-op이며 다른 callback family로 fallthrough하지 않는다. public `hover/open/expanded` prop을 추가하지 않는다. |
| `Browser` | `title`, `addressValue`, `addressDropdownItems?`, `onOpenAddressDropdown?`, `onAddressValueChange?`, `onAddressSubmit?`, `onSelectAddressDropdownItem?`, `onBack?`, `onForward?`, `onReload?`, `onMinimize?`, `onToggleMaximize?`, `onClose?`, `children` | `addressValue`와 `children`은 host-owned, dropdown open/close와 control-hover/mobile-open scaffolding은 storybook/internal review owner | `onOpenAddressDropdown()`, `onBack()`, `onForward()`, `onReload()`, `onMinimize()`, `onToggleMaximize()`, `onClose()`는 무인자 통지다. `onAddressValueChange(nextValue: string)`는 raw string만 보낸다. `onAddressSubmit(addressValue: string)`는 현재 표시 winner 값만 보낸다. `onSelectAddressDropdownItem(item: BrowserAddressDropdownItem)`은 `addressDropdownItems` source array의 exact item object만 보낸다. | `addressDropdownItems` id는 Browser address domain 안에서만 유일하다. address selection은 `onSelectAddressDropdownItem`만 recipient이며 `onAddressValueChange`나 nav/window-control callback으로 fallthrough하지 않는다. source array에 없는 id, missing callback, hidden dropdown affordance는 no-op이고 내부에서 `addressValue`나 `children`을 바꾸지 않는다. public `hover/open` prop을 추가하지 않는다. |
| storybook compare inventory | exact 15 `kind/state`, exact `storyId`, exact `stageAttr`, nested `[data-visual-root]` metadata | review-only detail state와 compare fixture payload는 story/harness owner다. | 없음 | support-only story나 alias가 canonical compare inventory를 대체하지 않는다. |
| final compare runtime | `packages/ui/storybook-static`, `visual-compare/storybook-static-server.cjs`, `http://localhost:6007`, stdout `SERVER_READY`, `iframe.html?id={storyId}&viewMode=story`, capture-ready wait selector, `[data-window-compare-stage]`, nested `[data-visual-root]`, `1280x800`, `{kind}-{state}-{reference|current|diff}.png`, `scopedBlockingDiffRatio`, threshold `0.05`, `globalDriftRatio` | Phase 2가 runtime contract를 잠그고, Phase 3은 read-only consumer다. | report가 exact key와 provenance, blocking/advisory metric 결과를 다음 revision 입력으로 handoff한다. | compare phase가 story ID, host/origin, selector, artifact naming, provenance, threshold, metric semantics를 새로 정하는 경로는 invalid다. |
| `@windows/ui` root entry | `Folder`, `Browser` named export | package root entry가 owner다. | 없음 | exhaustive export inventory를 durable contract로 승격하지 않는다. positive consumer import proof만 요구한다. |

### 소유권/상태 규칙

| surface | owner | 규칙 | 검증 수단 |
| --- | --- | --- | --- |
| Figma source와 15-state inventory | 현재 `plan.md` | canonical source는 file key `NrUGKPZUewpuA8XuHI0v5n`, canvas `3:2`, frame `Live UI References — Folder Browser`, mobile marker `__section-mobile`, exact 15 `kind/state` row다. execution은 이 literal을 좁힐 수만 있고 넓히거나 바꿀 수 없다. | `plan.md` inspection, Phase 1 output |
| repo-local baseline asset | Phase 1 | Phase 1은 plan-level inventory를 `reference-captures/baseline-inventory.md`와 exact `{kind}-{state}-reference.png` mirror로 materialize한다. 획득 경로는 locked Figma source에서 current slug로의 fresh export뿐이며, sibling repo-local bundle은 completeness cross-check 용도만 허용되고 authority나 copy-forward source가 아니다. proxy baseline이나 placeholder baseline은 acceptance source가 아니다. | baseline inventory inspection, reference PNG inspection |
| `WindowFrame` shell과 stage | shared foundation | shell, control cluster, body boundary, stage geometry, exact `[data-window-compare-stage]`는 foundation owner다. Folder/Browser leaf는 자기 chrome detail과 content grammar만 추가한다. | foundation source inspection, `build-storybook` |
| `Folder.location` / `Folder.search` / grid | host + component + storybook/internal review | displayed winner는 `locationValue`, `searchValue`다. `Enter`는 현재 값으로 submit callback을 호출한다. chip/dropdown/sidebar/item interaction은 callback handoff만 수행하고 내부 filtering이나 body swap을 하지 않는다. | source inspection, story inventory, later tests |
| `Browser.address` / `children` | host + component + storybook/internal review | displayed winner는 `addressValue`다. body owner는 `children`이다. select 이후 실제 주소 변경과 body 교체는 host prop이 책임진다. `Enter`는 항상 현재 `addressValue`로 submit한다. | source inspection, story inventory, later tests |
| shared item ids / render keys | `packages/ui/src/components/windows/shared/types.ts` + leaf/stories | `locationDropdownItems`, `searchDropdownItems`, `searchChips`, `sidebarItems`, `items`, `addressDropdownItems`는 domain-local id namespace를 갖는다. selection recipient는 callback name으로 고정되고, sibling render key가 여러 domain을 합치면 `location-dropdown:{id}`, `search-dropdown:{id}`, `search-chip:{id}`, `sidebar:{id}`, `grid-item:{id}`, `address-dropdown:{id}`처럼 domain prefix를 붙인다. | source inspection, later tests |
| detail states | storybook/internal review | `folder/live-chip-open`, `folder/live-sidebar-hover`, `folder/live-sidebar-expanded`, `folder/live-thumbnail-hover`, `browser/live-control-hover-*`, mobile open states는 compare/review inventory에는 포함되지만 package public prop은 아니다. | fixture/story source, inventory test |
| compare runtime recipient | Phase 2 + Phase 3 | capture owner는 exact `[data-window-compare-stage]`다. nested single `[data-visual-root]`는 metadata carrier다. Phase 3은 same stage owner, same storyId, same artifact naming, same provenance만 사용한다. | inventory test, capture script, diff report |

### 기준 상태 인벤토리

| 키 | state role | Storybook `storyId` | `stageAttr` | reference 파일 |
| --- | --- | --- | --- | --- |
| `folder/live-blog` | `contract-bearing` | `windows-compose-folder--compare-live-blog` | `desktop` | `folder-live-blog-reference.png` |
| `folder/live-search-open` | `contract-bearing` | `windows-compose-folder--compare-live-search-open` | `desktop` | `folder-live-search-open-reference.png` |
| `folder/live-chip-open` | `detail-variant` | `windows-compose-folder--compare-live-chip-open` | `desktop` | `folder-live-chip-open-reference.png` |
| `folder/live-sidebar-hover` | `detail-variant` | `windows-compose-folder--compare-live-sidebar-hover` | `desktop` | `folder-live-sidebar-hover-reference.png` |
| `folder/live-sidebar-expanded` | `detail-variant` | `windows-compose-folder--compare-live-sidebar-expanded` | `desktop` | `folder-live-sidebar-expanded-reference.png` |
| `folder/live-thumbnail-hover` | `detail-variant` | `windows-compose-folder--compare-live-thumbnail-hover` | `desktop` | `folder-live-thumbnail-hover-reference.png` |
| `folder/mobile-blog` | `contract-bearing` | `windows-compose-folder--compare-mobile-blog` | `mobile` | `folder-mobile-blog-reference.png` |
| `folder/mobile-search-open` | `contract-bearing` | `windows-compose-folder--compare-mobile-search-open` | `mobile` | `folder-mobile-search-open-reference.png` |
| `browser/live-article` | `contract-bearing` | `windows-compose-browser--compare-live-article` | `desktop` | `browser-live-article-reference.png` |
| `browser/live-address-open` | `contract-bearing` | `windows-compose-browser--compare-live-address-open` | `desktop` | `browser-live-address-open-reference.png` |
| `browser/live-control-hover-minimize` | `detail-variant` | `windows-compose-browser--compare-live-control-hover-minimize` | `desktop` | `browser-live-control-hover-minimize-reference.png` |
| `browser/live-control-hover-maximize` | `detail-variant` | `windows-compose-browser--compare-live-control-hover-maximize` | `desktop` | `browser-live-control-hover-maximize-reference.png` |
| `browser/live-control-hover-close` | `detail-variant` | `windows-compose-browser--compare-live-control-hover-close` | `desktop` | `browser-live-control-hover-close-reference.png` |
| `browser/mobile-article` | `contract-bearing` | `windows-compose-browser--compare-mobile-article` | `mobile` | `browser-mobile-article-reference.png` |
| `browser/mobile-address-open` | `contract-bearing` | `windows-compose-browser--compare-mobile-address-open` | `mobile` | `browser-mobile-address-open-reference.png` |

### 비교 런타임 리터럴

| 리터럴 | 잠근 값 | 메모 |
| --- | --- | --- |
| external source file key | `NrUGKPZUewpuA8XuHI0v5n` | baseline provenance의 최상위 식별자다. |
| authoritative canvas node | `3:2` | compare source는 이 canvas를 기준으로 한다. |
| authoritative frame name | `Live UI References — Folder Browser` | report와 inventory provenance에 같은 wording을 쓴다. |
| mobile section marker | `__section-mobile` | mobile 4개 state의 source section marker다. |
| comparison mode | `structural parity` | whole-canvas mismatch만으로 pass/fail을 결정하지 않는다. |
| build output root | `packages/ui/storybook-static` | current side static build output이다. |
| static server helper | `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/storybook-static-server.cjs` | compare host/origin owner다. |
| canonical current origin | `http://localhost:6007` | dev host `6006`을 재사용하지 않는다. |
| serving-ready signal | stdout exact `SERVER_READY` | 이 sentinel 이전에는 iframe을 열지 않는다. |
| story URL shape | `http://localhost:6007/iframe.html?id={storyId}&viewMode=story` | Phase 3 current capture URL contract다. |
| stage attribute values | exact `desktop`, `mobile` only | live cases는 `desktop`, mobile cases는 `mobile`만 쓴다. |
| capture-ready wait selector | `[data-window-compare-stage="{stageAttr}"] [data-visual-root][data-visual-kind="{kind}"][data-visual-state="{state}"]` | selector invention을 금지한다. |
| capture owner | exact `[data-window-compare-stage]` | inner wrapper나 viewport crop을 canonical recipient로 쓰지 않는다. |
| metadata carrier | nested single `[data-visual-root][data-visual-kind][data-visual-state]` | kind/state mismatch면 abort한다. |
| viewport | `1280x800` | compare-time viewport drift를 금지한다. |
| artifact naming | `{kind}-{state}-reference.png`, `{kind}-{state}-current.png`, `{kind}-{state}-diff.png` | report row와 filename이 같은 key를 공유해야 한다. |
| reference provenance label | `external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / wrapper "{key}"` | proxy baseline과 구분한다. |
| current provenance label | `package-local current — packages/ui Storybook / [data-window-compare-stage]` | current side identity를 고정한다. |
| blocking scoped diff metric | `scopedBlockingDiffRatio = mismatchedPixels / totalPixelsInsideDeclaredGatingSurfaces` | declared `comparison policy = gating` surface union만 blocking 산식에 포함한다. |
| blocking scoped diff threshold | `0.05` | `structural parity`의 blocking threshold이며 whole-canvas mismatch가 아니다. |
| advisory global drift metric | `globalDriftRatio = mismatchedPixels / totalPixelsInsideWholeCaptureCanvas` | whole-canvas drift는 항상 report에 남기되 pass/fail을 단독 결정하지 않는다. |
| blocking decision rule | 각 state는 아래 `시각 패리티 계약` 표의 exact declared gating surface union이 모두 존재하고 boundary/anchor/geometry blocker가 없으며 `scopedBlockingDiffRatio <= 0.05`일 때만 `pass`다. 하나라도 깨지면 `explicit blocker`다. | `run-diff.mjs`와 final report는 이 규칙을 실행만 하고 새로 해석하지 않는다. |
| current-side smoke command | `node plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs --mode smoke --output-dir plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/current-smoke` | Phase 2 validation은 same host/origin/readiness/selector/viewport contract로 current-side harness를 실제 실행한다. reference baseline과 diff/report는 읽지 않는다. |
| current-side smoke outputs | `visual-compare/current-smoke/{kind}-{state}-current.png` | Phase 2 validation artifact이며 final acceptance evidence가 아니다. |
| final report outputs | `visual-compare/report.json`, `visual-compare/report.md` | Phase 3 acceptance evidence 산출물이다. |

### 시각 패리티 계약

| 비교 상태/범위 | comparison mode | gating metric | non-gating metric | 로컬 surface 메모 |
| --- | --- | --- | --- | --- |
| `folder/live-blog`, `folder/live-search-open`, `folder/live-chip-open` | `structural parity` | declared gating surface union(`frame-surface`, `navigation-surface`, `control-surface`, `content-surface`, `media-surface`)에 대해 input/dropdown/chip anchor, card hierarchy blocker가 없고 `scopedBlockingDiffRatio <= 0.05` | `globalDriftRatio`와 chip text, dropdown row copy, thumbnail art, icon glyph detail | titlebar, location input, search input, chips, dropdown, sidebar, card grid |
| `folder/live-sidebar-hover`, `folder/live-sidebar-expanded`, `folder/live-thumbnail-hover` | `structural parity` | declared gating surface union(`navigation-surface`, `control-surface`, `content-surface`, `media-surface`)에 대해 sidebar hover fill, expanded width, thumbnail hover affordance, list/card alignment blocker가 없고 `scopedBlockingDiffRatio <= 0.05` | `globalDriftRatio`와 exact row copy, icon glyph, shadow blur | sidebar hover/expanded pane, thumbnail hover ornament |
| `browser/live-article`, `browser/live-address-open` | `structural parity` | declared gating surface union(`frame-surface`, `control-surface`, `content-surface`)에 대해 address dropdown anchor/width/row density blocker가 없고 `scopedBlockingDiffRatio <= 0.05` | `globalDriftRatio`와 article copy, cover art, dropdown row copy | nav controls, address input, dropdown, article body |
| `browser/live-control-hover-minimize`, `browser/live-control-hover-maximize`, `browser/live-control-hover-close` | `structural parity` | declared gating surface union(`frame-surface`, `control-surface`)에 대해 control hover placement, fill, active affordance, chrome spacing blocker가 없고 `scopedBlockingDiffRatio <= 0.05` | `globalDriftRatio`와 glyph raster, minute shadow detail | window control cluster hover surface |
| `folder/mobile-blog`, `folder/mobile-search-open` | `structural parity` | declared gating surface union(`frame-surface`, `control-surface`, `content-surface`, `media-surface`)에 대해 mobile content-first grid, title/search hierarchy, open dropdown anchor blocker가 없고 `scopedBlockingDiffRatio <= 0.05` | `globalDriftRatio`와 exact copy, thumbnail art, fine icon detail | mobile titlebar, search row, grid cards, dropdown |
| `browser/mobile-article`, `browser/mobile-address-open` | `structural parity` | declared gating surface union(`frame-surface`, `control-surface`, `content-surface`)에 대해 simplified chrome, mobile reading hierarchy, address-open anchor blocker가 없고 `scopedBlockingDiffRatio <= 0.05` | `globalDriftRatio`와 article copy, cover art, glyph detail | mobile titlebar, address row, dropdown, article body |

### 제외 범위

| 제외 항목 | 이번 plan에서 제외한 이유 | 승인 상태 | 사용자 요청과의 관계 |
| --- | --- | --- | --- |
| 실제 navigation, search, filtering, history wiring | 이번 scope는 callback handoff only UI contract와 compare acceptance다. | 확정 | 요청 범위 밖이다. |
| public `loading`, `empty`, `status`, `idle` model | locked request summary가 명시적으로 제외했다. | 확정 | 공개 계약 유지 조건이다. |
| parent-controlled dropdown open prop, public hover prop, public expanded prop | detail state는 storybook/internal review owner면 충분하다. | 확정 | 요청에서 금지한 확장이다. |
| `WindowFrame` public export | shared shell은 internal boundary로 남아야 한다. | 확정 | root entry proof가 오히려 이 exclusion을 검증한다. |
| 중간 compare/checkpoint phase | implementation 직후 final compare 하나만 남기는 topology를 유지해야 한다. | 확정 | 이번 재작성의 핵심 조건이다. |
| Phase 3 compare 실패 후 same plan 안의 추가 fix phase | final compare는 acceptance evidence only phase다. | 확정 | 실패는 explicit blocker로만 남긴다. |
| unrelated repo-wide cleanup | 현재 acceptance는 package-local build, runtime proof, final compare evidence로 한정된다. | 확정 | 요청 외 전역 정리다. |

## 전체 작업 지도

### 단계 개요

| Phase | 연결 작업 단위 | 이번 단계에서 해결하는 핵심 | 완료 후 보이는 변화 | 다음 단계로 넘기는 것 |
| --- | --- | --- | --- | --- |
| Phase 1. Window foundation과 reference asset setup | `locked reference contract와 repo-local baseline asset`, `window foundation과 compare stage` | plan-level로 잠근 Figma authority를 repo-local baseline asset으로 materialize하고, shared shell과 compare stage geometry를 먼저 고정한다. | baseline inventory/PNG mirror와 `WindowFrame`/stage helper가 같은 key와 geometry를 공유한다. | `reference-captures/baseline-inventory.md`, `reference-captures/*.png`, exact `[data-window-compare-stage]`, exact `desktop`/`mobile`, stage geometry |
| Phase 2. Folder/Browser 구현과 compare runtime 잠금 | `Folder leaf contract`, `Browser leaf contract`, `compare runtime, root entry proof, final evidence` | Folder/Browser public contract를 구현하고 exact 15-state story inventory, runtime literal, root import proof, current-side harness smoke를 한 번에 닫는다. | final compare가 storyId, selector, host/origin, provenance, gating surface union을 다시 정하지 않아도 되는 상태가 된다. | exact 15 key, exact `storyId`, exact `stageAttr`, runtime literal, positive root import proof, green current-side smoke |
| Phase 3. 최종 시각 비교 수용 증빙 | `locked reference contract와 repo-local baseline asset`, `compare runtime, root entry proof, final evidence` | Phase 1 baseline과 Phase 2 runtime을 read-only로 사용해 current capture, diff artifact, final report를 생성한다. | reviewer가 report만 읽어도 pass 또는 explicit blocker를 판정할 수 있다. | same-plan 후속 fix 없이 report가 최종 handoff다. |

## 단계별 실행

### Phase 1. Window foundation과 reference asset setup

| 항목 | 내용 |
| --- | --- |
| 목적 | plan-level로 이미 잠근 Figma authority와 15-state inventory를 current slug 안의 fresh baseline asset과 shared window foundation으로 변환한다. |
| 변경 내용 | `reference-captures/baseline-inventory.md`, locked Figma source에서 직접 export한 `reference-captures/*.png`, `packages/tailwind-config/src/theme.css`, `packages/tailwind-config/src/utilities.css`, `packages/ui/src/components/windows/internal/windowFrame/index.tsx`, `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx`, `packages/ui/src/components/windows/storybook/compareWindowStage.tsx`를 만든다. |
| 이전 상태 | plan-level contract는 있지만 repo-local baseline asset과 windows family foundation/stage owner가 없다. |
| 이후 상태 | Phase 2가 소비할 local baseline asset과 exact stage owner/geometry가 이미 존재하고, baseline PNG의 acquisition source도 current slug 기준으로 재현 가능하며, foundation source만 읽어도 shared shell boundary를 설명할 수 있다. |
| 완료 조건 | baseline inventory와 reference PNG mirror가 exact 15 key를 유지하고, PNG 15개가 locked Figma source에서 current slug로 fresh export됐다는 provenance를 가진다. `compareWindowStage`는 exact `[data-window-compare-stage]`, exact `desktop`/`mobile`, desktop `1024x700`, mobile `375x680`을 literal하게 드러내며, `pnpm --filter @windows/ui build-storybook`이 green이다. |
| 관련 영역 | `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/**`, `packages/tailwind-config/src/*`, `packages/ui/src/components/windows/internal/**`, `packages/ui/src/components/windows/storybook/*Stage.tsx` |
| 상세 | `./phases/01-window-foundation-and-reference-asset-setup.md` |

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/baseline-inventory.md` | 생성 | 15개 `kind/state` row와 state role, storyId, stageAttr, provenance, reference filename이 local inventory로 남는다. | table row가 `기준 상태 인벤토리`와 1:1로 맞는다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/*.png` | 생성/갱신 | locked Figma source를 current slug로 직접 export한 exact `{kind}-{state}-reference.png` mirror가 생성된다. | placeholder/proxy가 아니라 real baseline evidence이며 sibling plan bundle copy-forward가 아니다. |
| `packages/tailwind-config/src/theme.css` | 추가/조정 | `--window-*` token namespace가 frame/chrome/input/dropdown/shadow/spacing surface를 소유한다. | shell/chrome/mobile spacing이 semantic token으로 보인다. |
| `packages/tailwind-config/src/utilities.css` | 추가/조정 | shared shell utility와 leaf slot utility가 분리된다. | later leaf source가 panel utility를 canonical owner로 재사용하지 않는다. |
| `packages/ui/src/components/windows/internal/windowFrame/index.tsx` | 추가 | internal-only shared shell owner가 생긴다. | public export 없이 titlebar/control/body boundary가 드러난다. |
| `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx` | 추가 | human review stage가 desktop/mobile hierarchy family를 보여 준다. | Folder/Browser mobile grammar 차이가 stage에 반영된다. |
| `packages/ui/src/components/windows/storybook/compareWindowStage.tsx` | 추가 | exact compare stage owner와 geometry contract가 생긴다. | Phase 2/3가 same selector와 same geometry를 read-only로 쓴다. |

### Phase 2. Folder/Browser 구현과 compare runtime 잠금

| 항목 | 내용 |
| --- | --- |
| 목적 | Folder/Browser UI-only contract를 구현하고 final compare에 필요한 15-state story inventory, runtime literal, root import proof, current-side harness smoke contract를 한 단계에서 모두 닫는다. |
| 변경 내용 | `packages/ui/src/components/windows/shared/types.ts`, `packages/ui/src/components/windows/folder/**`, `packages/ui/src/components/windows/browser/**`, `packages/ui/src/components/windows/storybook/*`, `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`, `packages/ui/src/index.ts`, `packages/ui/src/index.test.ts`, `capture-current.mjs`, `visual-compare/storybook-static-server.cjs`, `visual-compare/run-diff.mjs`를 구현한다. `capture-current.mjs`는 `--mode smoke` current-only validation path를 제공하고, `run-diff.mjs`는 blocking scoped diff와 advisory global drift를 분리해 report contract를 고정한다. |
| 이전 상태 | foundation은 Phase 1이 제공하지만, leaf public contract와 final compare runtime literal은 아직 source-tree와 scripts에 반영되지 않았다. |
| 이후 상태 | exact public props, detail-state ownership, exact 15-state story inventory, actual storyId, exact stageAttr mapping, host/origin/readiness, artifact naming, `scopedBlockingDiffRatio`, `globalDriftRatio`, positive root import proof가 모두 존재하고 current-side harness가 Phase 3 이전에 한 번 실제로 실행된다. |
| 완료 조건 | `pnpm --filter @windows/ui exec vitest run src/index.test.ts src/components/windows/storybook/windowCompareInventory.test.tsx`, `pnpm --filter @windows/ui build-storybook`, `node plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs --mode smoke --output-dir plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/current-smoke`가 green이고, smoke path가 reference baseline 없이 current-side host/origin/readiness/selector/viewport wiring을 검증한다. |
| 관련 영역 | `packages/ui/src/components/windows/**`, `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`, `packages/ui/src/index.ts`, `packages/ui/src/index.test.ts`, `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs`, `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/**`, `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/current-smoke/**` |
| 상세 | `./phases/02-folder-browser-implementation-and-compare-runtime-lock.md` |

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/shared/types.ts` | 추가 | `FolderLocationDropdownItem`, `FolderSearchDropdownItem`, `FolderSearchChip`, `FolderSidebarItem`, `FolderGridItem`, `BrowserAddressDropdownItem`와 domain-local id/render-key policy가 분리된다. | heterogeneous item domain이 ambiguous callback 하나로 합쳐지지 않고, selection payload source를 이름만으로 알 수 있다. |
| `packages/ui/src/components/windows/folder/index.tsx` | 추가 | `Folder` two-input + grid owner contract가 생긴다. | exact prop names, winner rule, callback emitted arg shape, no-op recipient rule이 source에 남는다. |
| `packages/ui/src/components/windows/browser/index.tsx` | 추가 | `Browser` single-input + `children` owner contract가 생긴다. | exact prop names, winner rule, callback emitted arg shape, no-op recipient rule이 source에 남는다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.tsx`, `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 추가 | detail state를 storybook/internal review owner로 잠근 fixture source가 생긴다. | 15-state scaffolding이 fixture source에서 추적된다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx`, `packages/ui/src/components/windows/browser/browser.stories.tsx` | 추가 | exact compare story inventory 15개가 생긴다. | support-only story가 있더라도 canonical inventory는 늘어나지 않는다. |
| `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx` | 추가 | exact storyId, stageAttr, compare root metadata relation을 검증한다. | Phase 3가 runtime literal을 새로 정할 필요가 없다. |
| `packages/ui/src/components/taskbar/storybook/compareRoot.tsx` | 조정 | `folder`, `browser` kind와 compare metadata contract를 canonical inventory에 맞춘다. | kind/state key drift가 없다. |
| `packages/ui/src/index.ts`, `packages/ui/src/index.test.ts` | 조정/추가 | `Folder`, `Browser` root export와 positive consumer import proof를 잠근다. | internal `WindowFrame`는 export되지 않는다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs` | 생성 | exact storyId 15개, stageAttr mapping, host/origin, selector, viewport, current naming을 literal하게 잠근다. | Phase 3는 이 script를 수정하지 않고 실행만 한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/storybook-static-server.cjs` | 생성 | `packages/ui/storybook-static`를 `http://localhost:6007`에 올리고 stdout `SERVER_READY`를 남긴다. | compare-time host/origin invention이 없다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/run-diff.mjs` | 생성 | exact artifact naming, provenance label, `scopedBlockingDiffRatio <= 0.05` blocking rule, `globalDriftRatio` advisory rule을 공유하는 diff pipeline이 생긴다. | report row와 artifact filename이 같은 key를 쓰고 pass/fail semantics를 새로 해석하지 않는다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/current-smoke/**` | 생성/갱신 | current-side harness smoke가 current-only capture artifact를 남긴다. | Phase 2가 compare-only Phase 3 전에 host/origin/readiness/selector/viewport wiring을 실제로 검증한다. |

### Phase 3. 최종 시각 비교 수용 증빙

| 항목 | 내용 |
| --- | --- |
| 목적 | Phase 1 baseline과 Phase 2 runtime contract를 그대로 사용해 final compare evidence만 남기고, 이미 잠긴 exact declared gating surface union과 blocking/advisory 규칙으로만 acceptance를 판정한다. |
| 변경 내용 | `capture-current.mjs`, `visual-compare/storybook-static-server.cjs`, `visual-compare/run-diff.mjs`를 실행하고 `*-current.png`, `*-diff.png`, `report.json`, `report.md`를 생성한다. |
| 이전 상태 | 구현은 끝났더라도 repo-local compare evidence가 없으면 reviewer가 acceptance를 최종 판정할 수 없다. |
| 이후 상태 | report가 15개 state 각각의 provenance, blocking pass/fail, `scopedBlockingDiffRatio`, `globalDriftRatio`, artifact path를 exact key로 남긴다. |
| 완료 조건 | Phase 3은 product code나 story/runtime contract를 수정하지 않고 current capture, diff artifact, report만 생성한다. 결과는 각 state가 top-level `시각 패리티 계약` 표의 exact declared gating surface union blocker 없음 + `scopedBlockingDiffRatio <= 0.05`일 때만 `pass`이고, 아니면 `explicit blocker`다. `globalDriftRatio`는 advisory로만 남는다. |
| 관련 영역 | `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs`, `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/**`, `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/**` |
| 상세 | `./phases/03-final-visual-acceptance-evidence.md` |

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs` | 실행 전용 | exact story inventory와 runtime literal로 current capture 15개를 생성한다. | Phase 3가 script 내부 contract를 수정하지 않는다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/storybook-static-server.cjs` | 실행 전용 | static host `http://localhost:6007`과 `SERVER_READY` contract를 그대로 사용한다. | compare-time host/origin drift가 없다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/run-diff.mjs` | 실행 전용 | same `kind/state` key, same provenance, same `scopedBlockingDiffRatio <= 0.05` blocking rule, same `globalDriftRatio` advisory rule로 diff/report를 생성한다. | report row와 artifact filename drift가 없고 pass/fail semantics drift도 없다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/*-current.png`, `*-diff.png`, `report.json`, `report.md` | 생성/갱신 | repo-local final compare evidence가 남는다. | 15개 row 모두가 provenance, `scopedBlockingDiffRatio`, `globalDriftRatio`, pass 또는 explicit blocker를 기록한다. |

## 검토 체크리스트

- [ ] 이 `plan.md`만 읽어도 Figma authority, 15-state inventory, compare runtime literal, final acceptance behavior를 다른 plan 없이 이해할 수 있다.
- [ ] 요청 추적 표가 standalone rewrite, plan-level reference lock, immediate implementation start, final compare-only topology를 그대로 보여 준다.
- [ ] 공개 계약 요약과 소유권/상태 규칙이 `Folder`/`Browser` prop name, winner rule, callback family별 emitted arg shape, domain-local id rule, detail-state owner, compare runtime recipient를 prose가 아닌 표로 잠근다.
- [ ] 기준 상태 인벤토리 표에 exact 15 `kind/state`, exact `storyId`, exact `stageAttr`, exact reference filename이 모두 있다.
- [ ] 비교 런타임 리터럴 표에 `packages/ui/storybook-static`, `http://localhost:6007`, stdout `SERVER_READY`, selector, viewport, provenance label, `scopedBlockingDiffRatio`, `globalDriftRatio`, blocking threshold `0.05`, blocking decision rule이 모두 있다.
- [ ] Phase 2 완료 조건과 상세 문서가 current-side harness smoke를 final compare 이전에 실제 실행하도록 잠근다.
- [ ] 단계 개요와 단계별 실행만 읽어도 Phase 1이 fresh Figma baseline acquisition과 foundation을, Phase 2가 leaf contract와 compare pass/fail semantics를 포함한 runtime을, Phase 3이 final compare evidence를 소유한다는 점이 분명하다.
- [ ] final compare 실패가 same-plan hidden fix로 흡수되지 않고 explicit blocker로만 남는다는 규칙이 명시돼 있다.
