**Branch:** feat/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare

> Worktree dir: `worktrees/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare` (plan 폴더명과 동일)

# Windows UI Folder/Browser Input Dropdown Contract Figma Direct Implementation Final Compare 실행 계획

| # | Phase | Agent |
| --- | --- | --- |
| 1 | `./phases/01-figma-mcp-spec-artifact-lock.md` | `visual-comparator` |
| 2 | `./phases/02-window-foundation-implementation-from-figma-spec.md` | `frontend-developer` |
| 3 | `./phases/03-folder-browser-implementation-and-compare-runtime-lock.md` | `frontend-developer` |
| 4 | `./phases/04-final-visual-acceptance-evidence.md` | `visual-comparator` |

## 사전 합의

### 요청 추적

| 사용자 요청 항목 | 이번 plan에서 다루는 방식 | 연결 작업 범위 | 비고 |
| --- | --- | --- | --- |
| 새 slug 아래에 brand-new executable plan을 만든다. | 현재 slug 전용 `plan.md`와 4개 phase detail을 새로 작성하고, 이전 slug 산출물은 입력으로만 취급한다. | plan 전체, `./phases/*.md` | 기존 계획 파일은 수정하지 않는다. |
| 현재 계획 `./plans/windows-ui-folder-browser-input-dropdown-contract-figma-implementation-checkpoints/plan.md`을 입력으로 사용하되 mutate하지 않는다. | checkpoints 계획의 4단계 topology와 compare-runtime 선행 계약 방향을 계승하되, 새 slug 문서만 읽어도 실행 가능한 self-contained artifact로 다시 쓴다. | plan 전체 | checkpoints plan은 참고 입력이다. |
| 오래된 기준 계획 `./plans/windows-ui-folder-browser-input-dropdown-contract/plan.md`은 scope/public-contract authority로만 사용하고 mutate하지 않는다. | old authority가 잠근 scope, 공개 계약, 소유권 규칙, 제외 범위를 새 slug 표에 다시 풀어 적어 reviewer가 이전 slug를 열지 않아도 되게 만든다. | 요청 추적, 공개 계약 요약, 소유권/상태 규칙, 제외 범위 | old plan은 범위/공개 계약 방향만 권위로 사용한다. |
| frontend implementation phases는 Figma MCP/spec artifact를 직접 사용해야 한다. | Phase 1이 `spec/figma-mcp-artifact.md`와 `reference-captures/baseline-inventory.md` 및 exact reference capture naming을 잠그고, Phase 2와 Phase 3 입력 계약에 그 경로와 exact `kind/state` key를 literal하게 적는다. | Phase 1, Phase 2, Phase 3 | 중간 compare checkpoint를 새 입력으로 만들지 않는다. |
| frontend phase 뒤에 dedicated visual compare phase를 끼워 넣지 않는다. | Phase 2와 Phase 3 각각이 자기 경계 안에서 green validation을 갖도록 적고, visual-comparator는 Phase 4 하나만 final acceptance evidence 전용으로 둔다. | Phase 2, Phase 3, Phase 4 | compare-only phase는 마지막 하나다. |
| exactly one dedicated final visual compare phase만 둔다. | Phase 4를 compare-only acceptance evidence phase로 고정하고, mismatch가 생겨도 same-plan 안에 fix phase를 추가하지 않는다. | Phase 4, 제외 범위 | 실패는 explicit blocker로 다음 revision 입력에 넘긴다. |
| clean-slate implementation direction을 유지한다. | `packages/ui/src/components/panels/**` 재사용, panel-domain 명명, 기존 구현 위 보정 대신 windows family 전용 foundation/leaf를 새로 세우는 방향을 유지한다. | Phase 2, Phase 3 | 기존 repo 구현은 repo-local contract와 naming reference로만 본다. |
| public contract direction을 유지한다: Folder two-input + grid owner, Browser single-input + children owner, callback handoff only, public loading/empty/status 없음, public hover/open/expanded prop 없음. | top-level 공개 계약 표와 Phase 3 detail에서 exact prop names, winner rule, no-op rule, detail-state ownership, root entry proof까지 literal하게 고정한다. | 공개 계약 요약, 소유권/상태 규칙, Phase 3 | detail state는 storybook/internal review owner로만 남긴다. |
| final compare phase가 compare runtime을 다시 발명하면 안 된다. | Phase 3이 exact compare inventory 15개, actual Storybook `storyId`, exact `data-window-compare-stage` values `desktop` / `mobile`, per-case stageAttr mapping 15개, build output `packages/ui/storybook-static`, `visual-compare/storybook-static-server.cjs`, canonical host `http://localhost:6007`, stdout sentinel `SERVER_READY`, capture-ready wait selector `[data-window-compare-stage="{stageAttr}"] [data-visual-root][data-visual-kind="{kind}"][data-visual-state="{state}"]`, viewport, artifact naming, provenance label, diff threshold를 모두 잠그고, Phase 4는 그 계약을 실행만 한다. | Phase 3, Phase 4 | `COMPARE-RUNTIME-CONTRACT-INCOMPLETE`와 `COMPARE-RUNTIME-STAGE-ATTR-MISSING` 재발 방지 핵심이다. |
| planning artifact request만 수행하고 existing repo implementation은 건드리지 않는다. | 이번 산출물은 `./plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/**` 아래에만 쓴다. source-tree 경로는 future execution boundary로만 적는다. | plan 전체 | architect는 계획만 쓴다. |

### 작업 단위 요약

| 작업 단위 | 관련 파일/경계 | 현재 문제 | 목표 상태 | 검증 메모 |
| --- | --- | --- | --- | --- |
| Figma MCP spec artifact와 reference inventory | `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/spec/**`, `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/**` | 새 slug 아래 self-contained spec artifact가 없으면 later phase가 checkpoints plan이나 old scope plan을 다시 열어야 한다. | Phase 1 산출물만 읽어도 Figma file key, canvas `3:2`, wrapper 15개, state role, provenance, capture filename, compare key schema를 바로 사용할 수 있다. | Phase 2와 Phase 3 입력 계약이 현재 slug 산출물만 참조해야 한다. |
| Window foundation과 responsive hierarchy | `packages/tailwind-config/src/*`, `packages/ui/src/components/windows/internal/**`, `packages/ui/src/components/windows/storybook/*Stage.tsx` | shared shell, leaf chrome 차이, mobile hierarchy, compare stage geometry와 stageAttr value contract가 따로 흩어져 있으면 later phase가 foundation contract를 다시 추정하게 된다. | `WindowFrame`, `--window-*` token, `windowReferenceStage`, `compareWindowStage`, exact `[data-window-compare-stage]`, exact stage values `desktop` / `mobile`, desktop case -> `desktop`, mobile case -> `mobile`, desktop `1024x700`, mobile `375x680`, differentiated mobile hierarchy rule이 Phase 2에서 독립적으로 잠긴다. | Phase 2 완료만으로 source inspection과 `pnpm --filter @windows/ui build-storybook` green 경계를 설명할 수 있어야 한다. |
| Folder leaf UI-only contract | `packages/ui/src/components/windows/folder/**`, `packages/ui/src/components/windows/storybook/folderReferenceFixtures.tsx` | two-input + grid owner 방향은 잠겨 있지만 chip-open, sidebar-hover, sidebar-expanded, thumbnail-hover, mobile-search-open이 public prop인지 review-only state인지 흔들릴 수 있다. | `Folder` exact public props, input winner rule, callback handoff, no-op rule, detail-state ownership이 모두 Phase 3에서 잠긴다. | `Folder` 8개 state가 canonical `kind/state` key와 exact story inventory에 1:1로 묶여야 한다. |
| Browser leaf UI-only contract | `packages/ui/src/components/windows/browser/**`, `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | single-input + `children` owner 방향은 잠겨 있지만 control-hover 3종과 mobile-address-open이 public contract로 새어 나갈 위험이 있다. | `Browser` exact public props, address winner rule, callback handoff, no-op rule, detail-state ownership이 모두 Phase 3에서 잠긴다. | `Browser` 7개 state가 exact `kind/state` key와 exact story inventory에 1:1로 묶여야 한다. |
| Storybook compare inventory, compare runtime, root entry proof | `packages/ui/src/components/windows/**/*.stories.tsx`, `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx`, `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`, `packages/ui/src/index.ts`, `packages/ui/src/index.test.ts`, `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs`, `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/storybook-static-server.cjs`, `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/**` | prior blocker는 final compare 직전까지 recipient/runtime literal contract가 닫히지 않아 compare phase가 story ID, host/origin, ready rule, artifact naming, provenance, stageAttr values를 다시 정해야 했다는 점이다. | Phase 3이 exact 15-state inventory, actual `storyId`, exact stageAttr mapping 15개, build output `packages/ui/storybook-static`, canonical host `http://localhost:6007`, stdout sentinel `SERVER_READY`, capture-ready wait selector, `[data-window-compare-stage]`, nested `[data-visual-root]`, `npx agent-browser` capture command family, diff threshold, root import proof를 잠그고 Phase 4는 read-only compare만 수행한다. | `pnpm --filter @windows/ui exec vitest run src/index.test.ts src/components/windows/storybook/windowCompareInventory.test.tsx`, `pnpm --filter @windows/ui build-storybook`, final compare report가 같은 계약 언어를 써야 한다. |

### 공개 계약 요약

| 대상 | public surface | state ownership | callback / handoff | invalid / no-op |
| --- | --- | --- | --- | --- |
| `Folder` | `title`, `locationValue`, `searchValue`, `locationDropdownItems?`, `searchDropdownItems?`, `searchChips?`, `sidebarItems`, `activeSidebarItemId?`, `items`, `onOpenLocationDropdown?`, `onLocationValueChange?`, `onLocationSubmit?`, `onSelectLocationDropdownItem?`, `onOpenSearchDropdown?`, `onSearchValueChange?`, `onSearchSubmit?`, `onSelectSearchDropdownItem?`, `onSelectSearchChip?`, `onSelectSidebarItem?`, `onOpenItem?`, `onMinimize?`, `onToggleMaximize?`, `onClose?` | `locationValue`, `searchValue`, payload array는 host-owned, dropdown open/close와 detail-state scaffolding은 storybook/internal review owner, body grid는 component-owned | open/change/submit/select/open-item/window-control만 callback handoff로 노출한다. | dropdown data가 없으면 해당 open surface를 렌더링하지 않는다. invalid id나 missing callback path는 no-op이다. public `hover/open/expanded` prop을 추가하지 않는다. |
| `Browser` | `title`, `addressValue`, `addressDropdownItems?`, `onOpenAddressDropdown?`, `onAddressValueChange?`, `onAddressSubmit?`, `onSelectAddressDropdownItem?`, `onBack?`, `onForward?`, `onReload?`, `onMinimize?`, `onToggleMaximize?`, `onClose?`, `children` | `addressValue`와 `children`은 host-owned, dropdown open/close와 control-hover/mobile-open scaffolding은 storybook/internal review owner | open/change/submit/select/nav/window-control만 callback handoff로 노출한다. | dropdown data가 없으면 open surface를 렌더링하지 않는다. invalid selection은 no-op이다. public `hover/open` prop을 추가하지 않는다. |
| storybook/internal review inventory | exact 15 `kind/state` key, actual Storybook `storyId` inventory, nested `[data-visual-root]` metadata | review-only detail state와 compare fixture payload는 storybook/harness owner다. | 없음 | support-only story나 ad hoc alias가 canonical inventory를 대체하지 않는다. |
| final compare runtime contract | exact 15 `kind/state` key, actual Storybook `storyId`, exact `data-window-compare-stage` values `desktop | mobile`, `folder/live-*` + `browser/live-*` -> `desktop`, `folder/mobile-*` + `browser/mobile-*` -> `mobile`, build output `packages/ui/storybook-static`, canonical host `http://localhost:6007`, stdout sentinel `SERVER_READY`, capture-ready wait selector `[data-window-compare-stage="{stageAttr}"] [data-visual-root][data-visual-kind="{kind}"][data-visual-state="{state}"]`, `[data-window-compare-stage]`, nested `[data-visual-root]`, `iframe.html?id={storyId}&viewMode=story`, `1280x800` viewport, `{kind}-{state}-{reference|current|diff}.png` naming, diff threshold `0.05` | Phase 3가 runtime contract를 잠그고, Phase 4는 read-only consumer다. | report가 exact key, provenance, blocking/advisory drift를 handoff한다. | inner wrapper capture, compare-time story layout 변경, proxy baseline, story alias rename, host/origin/readiness invented-at-compare, stageAttr invented-at-compare는 invalid path다. |
| `@windows/ui` root entry | `Folder`, `Browser` named export | package root entry가 owner다. | 없음 | exhaustive export inventory를 durable contract로 승격하지 않는다. positive consumer import proof만 요구한다. |

### 소유권/상태 규칙

| surface | owner | 규칙 | 검증 수단 |
| --- | --- | --- | --- |
| Figma MCP/spec artifact | Phase 1 plan-local spec artifact | canonical source는 `file key + canvas 3:2 + frame/canvas name + visible wrapper label`이다. 15개 wrapper는 `contract-bearing` 또는 `detail-variant`로 분류하고, 이후 phase는 이 key와 provenance wording을 그대로 재사용한다. | `spec/figma-mcp-artifact.md`, `reference-captures/baseline-inventory.md` inspection |
| `WindowFrame` shell과 leaf chrome | shared foundation + leaf owner | shared shell, control cluster, stage geometry, `[data-window-compare-stage]`는 foundation owner다. Folder/Browser chrome variant와 leaf content grammar는 leaf owner다. foundation이 leaf-specific public contract를 대신 정의하지 않는다. | foundation source inspection, Phase 2 validation |
| `Folder.location` / `Folder.search` / grid hierarchy | host + component + storybook/internal review | displayed winner는 `locationValue`, `searchValue`다. `Enter`는 현재 값으로 submit을 호출한다. chip/dropdown/sidebar/item selection은 callback handoff만 수행하고 내부 filtering이나 body swap을 일으키지 않는다. | component source, story inventory, later materialize tests |
| `Browser.address` / `children` hierarchy | host + component + storybook/internal review | displayed winner는 `addressValue`다. body owner는 `children`이다. select 이후 실제 주소 값과 body 교체는 host가 책임진다. `Enter`는 현재 값으로 submit을 호출한다. | component source, story inventory, later materialize tests |
| hover / expanded / chip-open / control-hover / mobile-open detail states | storybook/internal review surface | `folder/live-chip-open`, `folder/live-sidebar-hover`, `folder/live-sidebar-expanded`, `folder/live-thumbnail-hover`, `browser/live-control-hover-*`, mobile open states는 compare/review inventory에는 포함되지만 package public prop이 아니다. | story source, fixture source, compare inventory test |
| final compare recipient/runtime | Phase 2 foundation + Phase 3 compare runtime contract | exact capture owner는 `[data-window-compare-stage]`다. `data-window-compare-stage` values는 정확히 `desktop`, `mobile` 두 개뿐이고 desktop cases(`folder/live-*`, `browser/live-*`)는 `desktop`, mobile cases(`folder/mobile-*`, `browser/mobile-*`)는 `mobile`을 쓴다. nested single `[data-visual-root]`는 metadata carrier다. `capture-current.mjs`는 `packages/ui/storybook-static`를 `visual-compare/storybook-static-server.cjs`로 `http://localhost:6007`에 올리고, `SERVER_READY` 이후 `iframe.html?id={storyId}&viewMode=story`를 연다. capture-ready wait는 `[data-window-compare-stage="{stageAttr}"] [data-visual-root][data-visual-kind="{kind}"][data-visual-state="{state}"]`다. Phase 4는 이 recipient/runtime을 수정하지 않는다. | `compareWindowStage.tsx`, `capture-current.mjs`, `visual-compare/storybook-static-server.cjs`, `windowCompareInventory.test.tsx` |
| package-root import verification | `packages/ui/src/index.ts` + `packages/ui/src/index.test.ts` | positive proof는 `@windows/ui` consumer import로만 닫는다. exhaustive export list나 negative-only export absence는 durable contract가 아니다. | `pnpm --filter @windows/ui exec vitest run src/index.test.ts` |

### 시각 패리티 계약

| 비교 상태/범위 | comparison mode | gating metric | non-gating metric | 로컬 surface 메모 |
| --- | --- | --- | --- | --- |
| `folder/live-blog`, `folder/live-search-open`, `folder/live-chip-open` | `structural parity` | `frame-surface`, `navigation-surface`, `control-surface`, `content-surface`, `media-surface`의 boundary, density, input/dropdown/chip anchor, card hierarchy | exact chip text, dropdown row copy, thumbnail art, icon glyph detail | titlebar, location input, search input, search chips, suggestion dropdown, sidebar, card grid, thumbnail |
| `folder/live-sidebar-hover`, `folder/live-sidebar-expanded`, `folder/live-thumbnail-hover` | `structural parity` | sidebar hover fill, expanded width, thumbnail hover affordance, list/card alignment | exact row copy, icon glyph, shadow blur | sidebar item hover, sidebar expanded pane, thumbnail hover ornament |
| `browser/live-article`, `browser/live-address-open` | `structural parity` | `frame-surface`, `control-surface`, `content-surface` boundary와 address dropdown anchor/width/row density | article copy length, cover art, dropdown row copy | titlebar, nav controls, address input, dropdown rows, article body |
| `browser/live-control-hover-minimize`, `browser/live-control-hover-maximize`, `browser/live-control-hover-close` | `structural parity` | control hover placement, fill, active affordance, chrome spacing | exact glyph raster, minute shadow detail | window control cluster hover surface, control icon ornament |
| `folder/mobile-blog`, `folder/mobile-search-open` | `structural parity` | mobile content-first grid, title/search hierarchy, open dropdown anchor, no desktop-sidebar-shrink rule | exact copy, thumbnail art, fine icon detail | mobile titlebar, mobile search row, mobile grid cards, mobile dropdown |
| `browser/mobile-article`, `browser/mobile-address-open` | `structural parity` | simplified chrome, mobile reading hierarchy, address-open anchor, content boundary | article copy, cover art, glyph detail | mobile titlebar, mobile address row, mobile dropdown, article body |

### 제외 범위

| 제외 항목 | 이번 plan에서 제외하는 이유 | 승인 상태 | 사용자 요청과의 관계 |
| --- | --- | --- | --- |
| 실제 navigation / search / filtering / history wiring | 사용자는 callback handoff only 방향을 잠갔고, 이번 slug는 UI-only contract와 final acceptance evidence만 다룬다. | 확정 | 요청 범위 밖의 runtime behavior다. |
| public `loading`, `empty`, `status`, `idle` model | locked request summary가 명시적으로 제외했다. | 확정 | 공개 계약 유지 조건과 직접 연결된다. |
| parent-controlled dropdown open prop, public hover prop, public expanded prop | detail state는 storybook/internal review owner로 충분하며 public prop 추가는 locked direction과 충돌한다. | 확정 | 요청에서 금지한 확장이다. |
| `folder/live-chip-open` 또는 control-hover state를 별도 product contract로 승격하는 일 | detail variant는 compare/review inventory에 남지만 public contract는 아니다. | 확정 | 요청에서 직접 금지했다. |
| checkpoints plan 또는 old authority plan 수정 | 이번 작업은 새 slug 산출물만 작성하는 planning artifact 요청이다. | 확정 | handoff packet의 명시 조건이다. |
| 프런트엔드 phase 사이의 중간 compare/checkpoint phase | 새 topology가 이를 제거하도록 잠겨 있다. | 확정 | 이번 재작성의 핵심 변경점이다. |
| Phase 4 compare 실패를 같은 executable plan 안에서 다시 수정하는 추가 프런트엔드 phase | 사용자가 final compare를 acceptance evidence only phase로 잠갔다. mismatch가 남으면 explicit blocker로 보고하고 follow-up revision으로 넘긴다. | 확정 | 4단계 topology 유지 조건이다. |
| unrelated global `tsc` 정리나 repo-wide cleanup | 현재 acceptance는 package-local storybook build, compare inventory proof, root import proof, final compare evidence로 한정된다. | 확정 | 요청 외 전역 정리다. |

## 전체 작업 지도

### 단계 개요

| Phase | 연결 작업 범위 | 이번 단계에서 닫는 계약 | 완료 후 보이는 변화 | 다음 단계로 넘기는 계약 |
| --- | --- | --- | --- | --- |
| Phase 1. Figma MCP/스펙 아티팩트 잠금 | `Figma MCP spec artifact와 reference inventory` | Figma file key, canvas `3:2`, wrapper 15개, state role, provenance, reference capture filename, canonical `kind/state` key schema를 현재 slug 산출물로 잠근다. | 이후 phase는 이전 slug를 열지 않고도 정확한 spec artifact와 reference inventory를 읽을 수 있다. | `spec/figma-mcp-artifact.md`, `reference-captures/baseline-inventory.md`, exact `{kind}-{state}-reference.png` naming |
| Phase 2. Figma spec 기반 window foundation 구현 | `Window foundation과 responsive hierarchy` | clean-slate `WindowFrame`, `--window-*` token, exact `[data-window-compare-stage]`, desktop `1024x700`, mobile `375x680`, leaf-specific chrome boundary, differentiated mobile hierarchy rule을 구현한다. | foundation source만 봐도 shared shell owner, compare stage owner, responsive grammar가 보인다. | Phase 3는 Phase 1 spec artifact와 Phase 2 stage geometry contract를 그대로 소비한다. |
| Phase 3. Folder/Browser 구현과 compare runtime 잠금 | `Folder leaf UI-only contract`, `Browser leaf UI-only contract`, `Storybook compare inventory, compare runtime, root entry proof` | public contract, detail-state ownership, exact story inventory 15개, actual `storyId`, build output `packages/ui/storybook-static`, canonical host `http://localhost:6007`, stdout sentinel `SERVER_READY`, capture-ready wait selector, viewport, current capture script, diff pipeline, positive root import proof를 한 번에 잠근다. | final compare가 recipient/runtime invention 없이 바로 실행 가능한 상태가 된다. | Phase 4는 Phase 1 baseline/provenance와 Phase 3 story/runtime contract를 read-only로 사용한다. |
| Phase 4. 최종 시각 비교 수용 증빙 | `Figma MCP spec artifact와 reference inventory`, `Storybook compare inventory, compare runtime, root entry proof` | current capture, diff artifact, final report를 같은 15 key와 provenance wording으로 생성하고 pass 또는 explicit blocker를 남긴다. | reviewer가 final compare evidence만 보고 acceptance 여부를 판단할 수 있다. | 이 plan 내부에는 후속 수정 phase가 없다. 실패 시 explicit blocker를 다음 revision 입력으로 넘긴다. |

## 단계별 실행

### Phase 1. Figma MCP/스펙 아티팩트 잠금

| 항목 | 내용 |
| --- | --- |
| 목적 | Phase 2와 Phase 3이 직접 사용할 Figma MCP/spec artifact와 reference inventory를 현재 slug 아래에 고정한다. |
| 변경 내용 | `spec/figma-mcp-artifact.md`, `reference-captures/baseline-inventory.md`, `reference-captures/*.png`에 file key, canvas `3:2`, wrapper 15개, state role, provenance, capture filename, `kind/state` key schema를 잠근다. |
| 선행 조건 | `none` |
| 이전 상태 | 새 slug에는 self-contained spec artifact가 없어 checkpoints plan이나 old authority plan을 다시 읽어야만 exact inventory를 알 수 있다. |
| 이후 상태 | current slug 산출물만 읽어도 Figma source와 reference inventory를 literal하게 재사용할 수 있다. |
| 완료 조건 | Phase 1 산출물만 읽어도 exact 15 key, `__section-mobile`, `contract-bearing`/`detail-variant`, provenance wording, real reference filename pattern, placeholder/proxy baseline 금지 규칙이 모두 보인다. |
| 관련 영역 | `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/spec/**`, `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/**` |
| 상세 | `./phases/01-figma-mcp-spec-artifact-lock.md` |

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/spec/figma-mcp-artifact.md` | 생성 | Figma MCP source, wrapper inventory, state role, compare key schema, clean-slate direction을 한 문서에 잠근다. | reviewer가 이전 slug 없이도 exact source와 key schema를 이해할 수 있다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/baseline-inventory.md` | 생성 | 15개 wrapper row가 section, state role, provenance, capture filename과 함께 literal하게 기록된다. | desktop 11개, mobile 4개, 총 15개 row가 exact key로 보인다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/*.png` | 생성/갱신 | Figma MCP `get_screenshot` 기준의 exact reference capture naming을 잠근다. | `{kind}-{state}-reference.png` naming과 inventory row가 1:1로 맞고 placeholder/proxy baseline이 완료 상태가 아니다. |

### Phase 2. Figma spec 기반 window foundation 구현

| 항목 | 내용 |
| --- | --- |
| 목적 | Phase 1 spec artifact를 직접 사용해 shared shell, token, stage, responsive hierarchy를 clean-slate foundation으로 구현한다. |
| 변경 내용 | `WindowFrame`, `--window-*` token namespace, `windowReferenceStage`, `compareWindowStage`, exact `[data-window-compare-stage]`, exact stage values `desktop` / `mobile`, desktop case -> `desktop`, mobile case -> `mobile`, desktop `1024x700`, mobile `375x680`, Folder/Browser differentiated mobile hierarchy를 구현한다. |
| 선행 조건 | Phase 1의 `spec/figma-mcp-artifact.md`와 `reference-captures/baseline-inventory.md`가 exact 15 key와 provenance wording을 제공해야 한다. |
| 이전 상태 | foundation contract가 없으면 later phase가 shared shell, chrome 차이, mobile hierarchy, compare stage owner를 다시 추정해야 한다. |
| 이후 상태 | foundation source만 봐도 shared shell owner, leaf chrome boundary, exact compare stage owner, mobile hierarchy rule이 독립적으로 검증 가능하다. |
| 완료 조건 | `WindowFrame`가 internal-only shared shell로 구현되고, `[data-window-compare-stage]`가 exact capture owner로 드러나며, stage values `desktop` / `mobile`과 desktop/mobile case mapping이 source에 literal하게 보이고, `pnpm --filter @windows/ui build-storybook`이 foundation/stage 변경과 함께 green 상태여야 한다. |
| 관련 영역 | `packages/tailwind-config/src/*`, `packages/ui/src/components/windows/internal/**`, `packages/ui/src/components/windows/storybook/*Stage.tsx` |
| 상세 | `./phases/02-window-foundation-implementation-from-figma-spec.md` |

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/tailwind-config/src/theme.css` | 추가/조정 | `--window-*` token namespace가 frame, chrome, input, dropdown, spacing, shadow surface를 소유한다. | raw literal이 아니라 semantic token으로 shell/chrome/mobile spacing이 보인다. |
| `packages/tailwind-config/src/utilities.css` | 추가/조정 | shared shell utility와 leaf chrome slot utility를 분리한다. | later phase가 panel utility를 가져오지 않아도 된다. |
| `packages/ui/src/components/windows/internal/windowFrame/index.tsx` | 추가/조정 | internal-only shared shell owner와 leaf chrome slot boundary를 구현한다. | public export 없이 titlebar, control cluster, body boundary가 드러난다. |
| `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx` | 추가/조정 | human review stage가 desktop/mobile geometry family를 정확히 보여준다. | reference stage만 봐도 differentiated mobile hierarchy가 보인다. |
| `packages/ui/src/components/windows/storybook/compareWindowStage.tsx` | 추가/조정 | exact `[data-window-compare-stage]`, exact stage values `desktop` / `mobile`, desktop `1024x700`, mobile `375x680`, compare geometry owner를 구현한다. | Phase 3, Phase 4가 같은 selector, same stageAttr values, same geometry를 read-only prerequisite로 쓴다. |

### Phase 3. Folder/Browser 구현과 compare runtime 잠금

| 항목 | 내용 |
| --- | --- |
| 목적 | Phase 1 spec artifact와 Phase 2 foundation을 직접 사용해 Folder/Browser UI-only contract를 구현하고 final compare가 필요한 runtime contract를 여기서 모두 잠근다. |
| 변경 내용 | `Folder`, `Browser`, story fixtures, story inventory 15개, actual Storybook `storyId` map, compare metadata, current capture script, diff pipeline, root entry export/import proof를 한 phase에서 닫는다. |
| 선행 조건 | Phase 1의 exact wrapper inventory/provenance와 Phase 2의 exact `[data-window-compare-stage]`, exact stage values `desktop` / `mobile`, desktop `1024x700`, mobile `375x680`이 잠겨 있어야 한다. |
| 이전 상태 | compare phase가 exact recipient/runtime을 다시 정해야 하면 final compare는 execution-ready가 아니고, public contract도 detail state owner를 잃게 된다. |
| 이후 상태 | exact public props, no-op rule, 15개 state inventory, actual Storybook `storyId`, exact stageAttr mapping 15개, build output `packages/ui/storybook-static`, canonical host `http://localhost:6007`, stdout sentinel `SERVER_READY`, capture-ready wait selector, `npx agent-browser` capture command family, diff threshold `0.05`, root import proof가 Phase 3에서 모두 드러난다. |
| 완료 조건 | `pnpm --filter @windows/ui exec vitest run src/index.test.ts src/components/windows/storybook/windowCompareInventory.test.tsx`와 `pnpm --filter @windows/ui build-storybook`이 green이고, `capture-current.mjs`, `visual-compare/storybook-static-server.cjs`, `run-diff.mjs`만 읽어도 final compare runtime이 literal하게 보인다. |
| 관련 영역 | `packages/ui/src/components/windows/**`, `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`, `packages/ui/src/index.ts`, `packages/ui/src/index.test.ts`, `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs`, `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/storybook-static-server.cjs`, `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/**` |
| 상세 | `./phases/03-folder-browser-implementation-and-compare-runtime-lock.md` |

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/shared/types.ts` | 추가 | shared dropdown/item types와 leaf-specific payload typing을 최소 surface로 분리한다. | heterogeneous item domain이 ambiguous callback 하나로 뭉치지 않는다. |
| `packages/ui/src/components/windows/folder/index.tsx` | 추가/조정 | `Folder` two-input + grid owner contract와 no-op rule을 구현한다. | public prop name과 callback meaning이 source에 literal하게 남는다. |
| `packages/ui/src/components/windows/browser/index.tsx` | 추가/조정 | `Browser` single-input + `children` owner contract와 no-op rule을 구현한다. | public prop name과 callback meaning이 source에 literal하게 남는다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.tsx`, `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 추가/조정 | 15개 state의 fixture payload와 detail-state scaffolding owner를 잠근다. | `contract-bearing`와 `detail-variant`가 fixture source에서 추적 가능하다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx`, `packages/ui/src/components/windows/browser/browser.stories.tsx` | 추가/조정 | exact compare story inventory 15개와 fixed scaffolding을 문서화한다. | support-only story가 canonical compare inventory를 대체하지 않는다. |
| `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx` | 추가/조정 | exact key, actual Storybook `storyId`, `[data-window-compare-stage]`, nested `[data-visual-root]` relation을 positive signal로 검증한다. | Phase 4가 recipient/runtime을 새로 발명할 필요가 없다. |
| `packages/ui/src/components/taskbar/storybook/compareRoot.tsx` | 조정 | compare metadata carrier가 `folder` / `browser` kind inventory를 그대로 노출한다. | compare artifact naming이 exact `kind/state` key와 mechanical하게 연결된다. |
| `packages/ui/src/index.ts`, `packages/ui/src/index.test.ts` | 조정/추가 | `Folder`, `Browser` root export와 positive consumer import proof를 잠근다. | exhaustive export inventory 없이도 root entry proof가 green이다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs` | 생성/조정 | exact 15개 `storyId`, exact stageAttr mapping 15개, build output `packages/ui/storybook-static`, canonical host `http://localhost:6007`, stdout sentinel `SERVER_READY`, `iframe.html?id={storyId}&viewMode=story`, capture-ready wait selector, `[data-window-compare-stage]`, `npx agent-browser` capture command family를 literal하게 잠근다. | Phase 4는 이 script를 실행만 한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/storybook-static-server.cjs` | 생성/조정 | `packages/ui/storybook-static`를 `http://localhost:6007`으로 서빙하고 stdout `SERVER_READY`를 canonical serving-ready signal로 남긴다. | compare-time host/origin을 다시 정할 필요가 없다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/run-diff.mjs` | 생성/조정 | reference/current/diff/report artifact family가 같은 `kind/state` key, provenance wording, diff threshold를 공유한다. | final report row와 artifact filename drift가 없다. |

### Phase 4. 최종 시각 비교 수용 증빙

| 항목 | 내용 |
| --- | --- |
| 목적 | Phase 1 baseline과 Phase 3 compare runtime을 그대로 사용해 final acceptance evidence만 생성한다. |
| 변경 내용 | current capture 15개, diff artifact, report JSON/Markdown을 생성하고 pass 또는 explicit blocker를 남긴다. |
| 선행 조건 | Phase 1의 exact baseline inventory/provenance와 real reference capture, Phase 3의 exact story inventory/`storyId`/capture runtime contract, build output `packages/ui/storybook-static`, canonical host `http://localhost:6007`, stdout sentinel `SERVER_READY`, capture-ready wait selector가 모두 잠겨 있어야 한다. |
| 이전 상태 | compare evidence가 없으면 reviewer가 implementation 완료와 reference acceptance를 분리해 판단할 수 없다. |
| 이후 상태 | final report만 읽어도 15개 state별 provenance, blocking pass/fail, advisory drift, artifact path가 보인다. |
| 완료 조건 | Phase 4는 product code를 수정하지 않고 `capture-current.mjs`, `run-diff.mjs`, final report를 실행/생성만 한다. 결과는 15개 state 전체에 대한 pass 또는 explicit blocker여야 한다. |
| 관련 영역 | `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs`, `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/**`, `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/storybook-static-server.cjs`, `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/**` |
| 상세 | `./phases/04-final-visual-acceptance-evidence.md` |

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs` | 실행 전용 | Phase 3가 잠근 exact story inventory, build output `packages/ui/storybook-static`, canonical host `http://localhost:6007`, stdout sentinel `SERVER_READY`, capture-ready wait selector를 그대로 사용해 current PNG 15개를 생성한다. | Phase 4가 script 내부 contract를 수정하지 않는다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/storybook-static-server.cjs` | 실행 전용 | Phase 3가 잠근 static serving boundary를 그대로 사용해 `packages/ui/storybook-static`를 `http://localhost:6007`에 올린다. | Phase 4가 host/origin을 새로 정하지 않는다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/run-diff.mjs` | 실행 전용 | same `kind/state` key, provenance wording, threshold `0.05`로 diff/report pipeline을 실행한다. | report row와 artifact filename이 1:1로 맞는다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/*-current.png`, `*-diff.png`, `report.json`, `report.md` | 생성/갱신 | final acceptance evidence가 repo-local artifact로 남는다. | 15개 state 모두에 대해 pass 또는 explicit blocker reason이 기록된다. |

## 검토 체크리스트

- [ ] `./plans/windows-ui-folder-browser-input-dropdown-contract-figma-implementation-checkpoints/plan.md`와 `./plans/windows-ui-folder-browser-input-dropdown-contract/plan.md`를 다시 열지 않아도 새 slug plan만으로 scope, contract, topology를 이해할 수 있다.
- [ ] 요청 추적 표만 읽어도 checkpoints plan은 input-only, old authority plan은 scope/public-contract authority-only, final compare only topology, clean-slate direction, compare-runtime 선행 잠금이 모두 보인다.
- [ ] 작업 단위 요약에서 Figma spec artifact, foundation, Folder, Browser, compare runtime/root proof 경계가 concrete file path와 함께 보인다.
- [ ] 공개 계약 요약과 소유권/상태 규칙이 `Folder` / `Browser` public props, detail-state owner, exact compare runtime contract를 prose가 아닌 표로 잠근다.
- [ ] 제외 범위가 public loading/empty/status 모델 금지, public hover/open/expanded prop 금지, 중간 compare phase 제거, Phase 4 이후 same-plan fix phase 제외를 명시한다.
- [ ] 단계 개요와 phase별 설명만 읽어도 `COMPARE-RUNTIME-CONTRACT-INCOMPLETE`가 왜 재발하지 않는지 설명된다.
- [ ] Phase 3 설명에 actual Storybook `storyId`, exact stageAttr values `desktop | mobile`, per-case stageAttr mapping 15개, build output `packages/ui/storybook-static`, canonical host `http://localhost:6007`, stdout sentinel `SERVER_READY`, capture-ready wait selector `[data-window-compare-stage="{stageAttr}"] [data-visual-root][data-visual-kind="{kind}"][data-visual-state="{state}"]`, `[data-window-compare-stage]`, `iframe.html?id={storyId}&viewMode=story`, `1280x800` viewport, `npx agent-browser` capture command family 잠금이 포함되어 있다.
- [ ] Phase 4는 compare-only acceptance evidence phase로만 작성되어 있고 product-code 수정이나 숨은 재작업을 허용하지 않는다.
