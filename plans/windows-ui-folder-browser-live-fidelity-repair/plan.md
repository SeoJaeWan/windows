**Branch:** fix/windows-ui-folder-browser-live-fidelity-repair

> Worktree dir: `worktrees/windows-ui-folder-browser-live-fidelity-repair` (plan 폴더명과 동일)
> 이 문서는 새 `Folder` / `Browser` 수리 작업의 실행 계획이다. 먼저 `사전 합의`와 `전체 작업 지도`에서 taxonomy, 라이브 기준선, deferred 범위를 확인하고, 아래 phase 카드에서 어떤 파일이 어떻게 바뀌는지와 무엇이 종료 신호인지 본다.
> 기술 입력/출력 계약, exact story recipient, 검증 명령, compare artifact 규칙은 각 phase 상세 문서에서 다룬다.

# Windows UI Folder/Browser 라이브 피델리티 수리 실행 계획

## 사전 합의

| 항목 | 합의 내용 | 적용 phase | 메모 |
| --- | --- | --- | --- |
| 새 repair plan | 이번 작업은 `windows-ui-folder-browser-window-family`의 closure logic을 재사용하지 않는 새 수리 계획이다. 이전 visual-compare report의 `의도된 리디자인/no-op` 판단은 그대로 유지하지 않는다. | 전체 | 이전 plan은 read-only 참고 자료다. |
| taxonomy 목표 | panel family는 Storybook에서 `Panels/Windows`, `Panels/Search`, `Panels/Context` 아래로 모으고, `Windows/*` root는 `Folder`, `Browser`만 남긴다. | Phase 2 | `Taskbar/*`는 이번 repair의 직접 수정 범위가 아니다. |
| 라이브 기준 우선 | `Folder` / `Browser`는 Windows 11 reinterpretation보다 `https://seojaewan.com/blog` 및 `https://www.seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0`의 현재 라이브 디자인을 더 가깝게 반영해야 한다. | Phase 1 / Phase 3 / Phase 4 / Phase 5 | acceptance는 repo-local baseline과 compare report로 닫는다. |
| Folder 수리 방향 | `Folder` canonical content는 placeholder 파일 시스템 아이콘 그리드가 아니라 라이브 블로그 썸네일/카드 그리드 방향으로 되돌린다. | Phase 3 / Phase 4 / Phase 5 | live blog metadata와 pinned cover asset을 기준으로 한다. |
| Browser public contract | `Browser`는 현재 `children` slot contract를 유지하고, live-like chrome/article layout만 복구한다. `404` 전용 public API, `variant`, slug prop은 추가하지 않는다. | Phase 3 / Phase 5 | not-found는 host가 `children`으로 표현할 수 있다. |
| not-found handling | `browser/*-not-found`는 이번 repair의 blocking acceptance가 아니다. 2026-04-16 관찰값은 refresh하되 documentary/deferred로만 기록하고 core Browser contract에는 baked-in acceptance로 넣지 않는다. | Phase 1 / Phase 3 / Phase 4 / Phase 5 | stale/mixed baseline note를 정리하는 것이 목적이다. |
| acceptance-source refresh | 이전 plan의 missing-slug note와 report closure는 authoritative baseline이 아니다. 이번 plan folder 안에서 canonical fidelity state와 deferred observation을 다시 분류한다. | Phase 1 / Phase 4 | exact date와 URL을 남긴다. |
| package-only 범위 | 이번 계획은 `packages/ui`, Storybook taxonomy/governance, 새 plan-local compare artifact까지만 다룬다. consumer app wiring과 source-tree test materialization은 후속 단계다. | 전체 | `plan-materializer`는 구현 전 자동 선행 단계다. |

## 전체 작업 지도

| Phase | 이번 단계에서 하는 일 | 끝나면 달라지는 상태 | 다음 단계로 넘기는 것 |
| --- | --- | --- | --- |
| Phase 1. 라이브 기준선 새로 고정 | 새 plan folder 안에 canonical live-fidelity baseline과 deferred missing-slug observation을 다시 고정한다. | 이번 repair가 어떤 외부 기준을 따라야 하는지, 무엇이 documentary support인지가 plan-local artifact로 분리된다. | `reference-captures/` baseline 4종과 missing-slug observation note |
| Phase 2. Storybook 분류 체계 복구 | panel family를 `Panels/*`로 이동시키고 `Windows/*`를 `Folder` / `Browser` 전용 root로 되돌리며, `.claude` Storybook 규칙도 같은 방향으로 갱신한다. | reviewer가 source와 문서 양쪽에서 새 taxonomy를 같은 언어로 확인할 수 있고, later compare가 쓸 Folder/Browser story recipient도 새 root 아래로 고정된다. | exact title map, exact Folder/Browser compare story IDs |
| Phase 3. Window 패밀리 라이브 피델리티 복구 | `WindowFrame`, `Folder`, `Browser`, windows story fixtures/stories/test를 함께 손봐서 live-like shell, blog-card folder, article browser를 source tree에 고정한다. | placeholder grid와 Windows 11 chrome이 빠지고, `Folder`와 `Browser`가 4-state canonical compare inventory와 함께 라이브 문법에 가까운 source contract를 가진다. | canonical 4-state compare inventory와 refreshed component/stories contract |
| Phase 4. 기준선 비교 리포트 생성 | 새 baseline과 새 Storybook compare surface를 1:1로 캡처·diff·report한다. | 어떤 `kind/state`가 기준선과 맞고 어긋나는지, provenance가 어떻게 분류되는지가 repo-local compare artifact로 남는다. | exact mismatch key 목록 또는 4-state pass report |
| Phase 5. 시각 드리프트 마감 | compare report가 남긴 mismatch만 닫고 같은 inventory를 다시 통과시킨다. | 이번 repair는 `의도된 리디자인/no-op` 가정 없이, 4-state canonical fidelity pass 또는 explicit blocker로 닫힌다. | 최종 compare report와 implementation handoff용 acceptance evidence |

## 단계별 실행

### Phase 1. 라이브 기준선 새로 고정

- 목적: 새 repair plan이 실제로 따라야 하는 live-fidelity baseline과 deferred observation을 이번 plan folder 안에서 다시 분류한다.
- 변경 내용: `Folder`용 `/blog` desktop/mobile window capture 2개와 `Browser`용 article desktop/mobile window capture 2개를 canonical baseline으로 다시 고정한다. missing slug는 2026-04-16 기준 bare/www 도메인 관찰값과 defer rationale을 별도 문서로 기록하고, old plan의 `browser/*-not-found` baseline을 이번 plan의 canonical acceptance로 승계하지 않는다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-live-fidelity-repair/reference-captures/baseline-inventory.md` | 추가 | canonical live-fidelity baseline 4개와 각 artifact의 provenance, viewport, source URL, state role이 한 문서에 고정된다. | `folder/desktop-blog`, `folder/mobile-blog`, `browser/desktop-article`, `browser/mobile-article`가 external-source evidence로 명시돼 있다. |
| `plans/windows-ui-folder-browser-live-fidelity-repair/reference-captures/missing-slug-observation.md` | 추가 | 2026-04-16 기준 missing slug 관찰값과 deferred/non-blocking rationale이 plan-local note로 남는다. | exact URL, exact date, observed HTTP status, deferred reason이 모두 적혀 있다. |
| `plans/windows-ui-folder-browser-live-fidelity-repair/reference-captures/` | 추가/정리 | 새 repair plan이 직접 사용하는 baseline image 4개와 필요한 documentary support artifact가 분리돼 저장된다. | canonical baseline image 4개가 존재하고, documentary support가 있으면 canonical inventory와 섞이지 않게 분류돼 있다. |

- 이전 상태: 이전 plan은 `browser/*-not-found`까지 canonical baseline으로 묶었고, missing-slug note가 stale/mixed일 수 있는 상태였다.
- 이후 상태: 새 plan은 canonical fidelity state 4개와 deferred missing-slug observation을 따로 읽게 된다.
- 완료 조건: reviewer가 Phase 1 artifact만 읽고도 이번 repair에서 비교해야 할 상태와 비교하지 않는 상태를 구분할 수 있어야 한다.
- 관련 영역: `plans/windows-ui-folder-browser-window-family/reference-captures/baseline-inventory.md`, `https://seojaewan.com/blog`, `https://www.seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0`
- 시작 조건: `none`
- 상세: `./phases/01-acceptance-source-refresh.md`

### Phase 2. Storybook 분류 체계 복구

- 목적: 잘못된 review 방향으로 landed 된 taxonomy를 `Panels/*` + `Windows/*` 체계로 되돌리고 governance 문서도 같은 계약으로 맞춘다.
- 변경 내용: panels story title은 `Panels/Windows/*`, `Panels/Search/*`, `Panels/Context/*`로 이동하고, `Folder`/`Browser` story title은 `Windows/Folder`, `Windows/Browser`로 고정된다. `.claude/rules/storybook.md`와 `.claude/CLAUDE.md`는 더 이상 `Windows/Components/*`, `Search/Components/*`, `Context/Components/*`를 canonical rule로 적지 않는다. later compare가 사용할 exact Folder/Browser story ID도 이 phase에서 확정된다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/windows/**/*.stories.tsx` | 교체 | windows panel family가 `Panels/Windows/*` 아래로 이동한다. | `Windows/Components/*`, `Windows/Compose/*` title이 사라지고 `Panels/Windows/*`만 남는다. |
| `packages/ui/src/components/panels/search/**/*.stories.tsx` | 교체 | search panel family가 `Panels/Search/*` 아래로 이동한다. | `Search/Components/*`, `Search/Compose/*` title이 사라지고 `Panels/Search/*`만 남는다. |
| `packages/ui/src/components/panels/context/**/*.stories.tsx` | 교체 | context panel family가 `Panels/Context/*` 아래로 이동한다. | `Context/Components/*`, `Context/Compose/*` title이 사라지고 `Panels/Context/*`만 남는다. |
| `packages/ui/src/components/panels/search/storybook/searchPanelContextFixtures.ts`, `packages/ui/src/components/panels/context/storybook/contextPanelHostRowInventories.tsx`, `packages/ui/src/components/panels/search/storybook/searchPanelReferenceFixtures.ts` | 정리 | supporting comment와 owner note가 새 taxonomy vocabulary를 쓴다. | file comment에 `Windows/Compose/Context`, `Search/Compose/Context` 같은 이전 taxonomy가 남지 않는다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx`, `packages/ui/src/components/windows/browser/browser.stories.tsx` | 교체 | `Windows/*` root가 `Folder`, `Browser`만 담도록 story title과 compare export naming이 고정된다. | `Windows/Folder`, `Windows/Browser`만 남고 later compare가 쓸 exact story ID를 계산할 수 있다. |
| `.claude/rules/storybook.md`, `.claude/CLAUDE.md` | 갱신 | Storybook governance 문서도 `Panels/*` + `Windows/*` repair 방향을 기준으로 설명한다. | source tree를 보지 않아도 문서만으로 새 taxonomy와 금지 패턴을 재현할 수 있다. |

- 이전 상태: panel family와 `Folder`/`Browser`가 모두 `Windows/Components/*` 같은 root에 섞여 있고 `.claude` 문서도 그 구조를 canonical rule로 적고 있다.
- 이후 상태: Storybook root에서 panel family와 window family의 owner boundary가 분리되고, governance 문서까지 같은 방향으로 잠긴다.
- 완료 조건: `packages/ui`와 `.claude`를 함께 열었을 때 old taxonomy가 남지 않고, 새 Folder/Browser compare story recipient를 exact ID까지 추적할 수 있어야 한다.
- 관련 영역: `plans/windows-ui-storybook-taxonomy-governance/plan.md`, `plans/windows-ui-storybook-taxonomy-governance/phases/02-domain-taxonomy-realignment.md`
- 시작 조건: Phase 1에서 canonical fidelity inventory와 deferred note가 고정돼 있어야 한다.
- 상세: `./phases/02-storybook-taxonomy-repair.md`

### Phase 3. Window 패밀리 라이브 피델리티 복구

- 목적: source tree 안에서 `Folder` / `Browser`를 라이브 사이트에 더 가까운 shell과 content grammar로 다시 맞춘다.
- 변경 내용: internal `WindowFrame`는 Windows 11 titlebar/button reinterpretation을 내려놓고 live-like outer shell과 slot boundary 쪽으로 재정리된다. `Folder`는 left sidebar + placeholder file icon grid 대신 folder-tab navigation + blog-card grid로 옮기고, `Browser`는 `children` slot을 유지한 채 live article metadata/cover/body가 들어가는 chrome/article host를 갖는다. windows storybook fixture, asset, reference stage, compare stage, compare inventory test는 canonical 4-state inventory 기준으로 함께 갱신되고 not-found는 support-only/deferred로 분리된다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/index.tsx` | 재구성 | shared internal shell이 live-like outer frame/slot owner로 축소되고 Windows 11 chrome 해석을 강제하지 않는다. | `WindowFrame`는 internal-only로 남고 leaf-specific chrome을 public API로 새지 않게 지원한다. |
| `packages/ui/src/components/windows/folder/index.tsx` | 교체 | `Folder`가 blog-card grid와 folder-tab navigation을 가진 live-like leaf contract를 연다. | placeholder file-system tile이 사라지고 canonical public input이 card/grid rendering에 맞게 드러난다. |
| `packages/ui/src/components/windows/browser/index.tsx` | 조정 | `Browser`가 `children` slot 그대로 live article shell을 렌더링한다. | `children` 외의 route/not-found public prop 없이 live-like chrome/article host가 보인다. |
| `packages/ui/src/components/windows/storybook/assets/` | 추가 | live blog/article에 가까운 cover/thumbnail asset이 repo-local fixture asset으로 고정된다. | external image drift 없이 story와 compare가 같은 cover asset을 사용할 수 있다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.ts`, `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 교체 | canonical 4-state fixture source와 support-only not-found note가 새 contract에 맞게 정리된다. | folder는 live-like blog metadata, browser는 article cover/meta/body fixture를 갖고 not-found는 support-only로 분류된다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx`, `packages/ui/src/components/windows/browser/browser.stories.tsx` | 교체 | human-review story와 compare story가 새 taxonomy와 새 4-state inventory를 공유한다. | compare export naming과 state key가 Phase 1 baseline inventory에 맞는다. |
| `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx`, `packages/ui/src/components/windows/storybook/compareWindowStage.tsx` | 정리 | human-review host와 machine-capture host가 라이브 fidelity review 방향에 맞게 정렬된다. | decorative host가 더 이상 Windows 11 방향을 강화하지 않고, compare geometry는 canonical baseline과 맞는다. |
| `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx` | 교체 | compare inventory의 positive signal이 새 4-state canonical key를 검증한다. | `folder/desktop-blog`, `folder/mobile-blog`, `browser/desktop-article`, `browser/mobile-article`만 exact one `[data-visual-root]`로 확인한다. |

- 이전 상태: `Folder`는 sidebar + placeholder icon grid, `Browser`는 Windows 11 chrome + 단순 text article fixture, compare inventory는 not-found까지 canonical 6-state로 묶인 상태다.
- 이후 상태: windows family source tree 자체가 live blog/article grammar에 가까운 4-state canonical inventory를 가지며, not-found는 support-only/deferred로 내려간다.
- 완료 조건: source와 story/test만 읽어도 `Folder`와 `Browser`가 어떤 public input과 어떤 canonical visual state를 여는지, 무엇이 deferred인지 분명해야 한다.
- 관련 영역: Phase 1 baseline inventory, Phase 2 taxonomy output, `packages/ui/src/index.ts`
- 시작 조건: Phase 2의 exact Folder/Browser story title과 compare recipient가 먼저 고정돼 있어야 한다.
- 상세: `./phases/03-window-live-fidelity-repair.md`

### Phase 4. 기준선 비교 리포트 생성

- 목적: 새 plan에서 새로 고정한 baseline과 새 live-fidelity source surface를 1:1로 비교한다.
- 변경 내용: Phase 2의 exact story ID와 Phase 3의 canonical 4-state compare inventory를 사용해 current capture를 만들고, baseline/current/diff/report artifact를 새 plan folder 아래에 남긴다. report는 external-source evidence와 package-local current를 구분하고, missing-slug observation은 deferred note로만 언급한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-live-fidelity-repair/capture-current.mjs` | 추가 | 새 taxonomy story ID와 canonical 4-state inventory를 current capture script에 고정한다. | script가 `Windows/Folder`, `Windows/Browser` compare story를 exact recipient로 캡처한다. |
| `plans/windows-ui-folder-browser-live-fidelity-repair/visual-compare/run-diff.mjs` | 추가 | baseline/current pair를 kind/state key별로 diff하는 helper가 생긴다. | diff artifact naming과 report row naming이 같은 key를 쓴다. |
| `plans/windows-ui-folder-browser-live-fidelity-repair/visual-compare/` | 추가/정리 | current capture, diff PNG, report가 canonical 4-state key와 provenance rule을 따라 정리된다. | report가 4개 canonical state를 모두 나열하고 `browser/*-not-found`를 compare inventory에 다시 넣지 않는다. |

- 이전 상태: 새 baseline과 새 source contract가 있어도 이번 repair만의 compare evidence와 판정 보고서가 없다.
- 이후 상태: reviewer와 후속 수정 phase가 새 repair plan 전용 artifact를 기준으로 drift를 읽을 수 있다.
- 완료 조건: report가 canonical 4-state와 provenance 분류를 모두 명시하고, mismatch가 있으면 exact `kind/state` key와 artifact pair를 남겨야 한다.
- 관련 영역: Phase 1 baseline inventory, Phase 2 exact story recipients, Phase 3 compare inventory test
- 시작 조건: Phase 3의 canonical 4-state compare inventory가 source tree에서 먼저 닫혀 있어야 한다.
- 상세: `./phases/04-reference-compare-report.md`

### Phase 5. 시각 드리프트 마감

- 목적: 새 compare report가 남긴 mismatch를 실제 source tree에서 닫고, 이번 repair를 pass 또는 explicit blocker로 끝낸다.
- 변경 내용: `WindowFrame`, `Folder`, `Browser`, windows storybook helper 범위 안에서 exact mismatch key만 수정하고 compare를 다시 돌린다. 이전 plan의 `의도된 리디자인/no-op` closure를 다시 쓰지 않고, 이번 plan의 refreshed baseline과 compare report만으로 최종 pass 여부를 판단한다. deferred not-found handling은 계속 deferred로 남기고 public Browser API를 새로 열지 않는다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/**` | 조정 | shared live shell의 spacing, chrome, slot geometry drift를 exact report 기준으로 줄인다. | final compare에서 shell mismatch가 pass 또는 explicit blocker로 닫힌다. |
| `packages/ui/src/components/windows/folder/**` | 조정 | folder blog-card grid, navigation, responsive layout drift를 기준선에 맞게 조정한다. | `folder/desktop-blog`, `folder/mobile-blog`가 rerun compare에서 닫힌다. |
| `packages/ui/src/components/windows/browser/**` | 조정 | browser chrome/article host drift를 기준선에 맞게 조정한다. | `browser/desktop-article`, `browser/mobile-article`가 rerun compare에서 닫힌다. |
| `packages/ui/src/components/windows/storybook/**` | 조정 | fixture/stage/test가 최종 live-fidelity source와 같은 inventory를 유지한다. | same 4-state key, same deferred not-found stance가 끝까지 유지된다. |
| `plans/windows-ui-folder-browser-live-fidelity-repair/visual-compare/` | 갱신 | final compare evidence가 이번 repair의 종료 상태를 남긴다. | report가 4-state pass 또는 explicit blocker를 exact key와 함께 기록한다. |

- 이전 상태: compare report가 새 mismatch key를 보여 주지만 source tree는 아직 그 결과를 닫지 않았다.
- 이후 상태: 이번 repair는 refreshed acceptance 기준에서 실제 pass하거나, scope reopening이 필요한 blocker를 분명히 남긴다.
- 완료 조건: final report가 4-state canonical inventory를 모두 재평가하고, `의도된 리디자인/no-op` 문구 없이 pass 또는 blocker를 남겨야 한다.
- 관련 영역: Phase 3 source contract 전체, Phase 4 compare report
- 시작 조건: Phase 4 report가 exact mismatch key와 provenance를 남겨야 한다.
- 상세: `./phases/05-visual-drift-closure.md`
