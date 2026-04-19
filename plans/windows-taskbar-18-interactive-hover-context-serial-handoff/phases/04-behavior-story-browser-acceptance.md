# Phase 4. behavior story browser acceptance recipient 고정

## Phase 요약

| 항목 | 내용 |
| --- | --- |
| owner_agent | `frontend-developer` |
| 목표 | mandatory browser acceptance가 exact Storybook behavior story recipient를 literal하게 가진다. |
| 다루는 작업 묶음 | `browser acceptance recipients` |
| 시작 조건 | `./phases/03-verification-owner-realignment.md` |
| 완료 판단 | browser gate, later materialization, reviewer handoff가 모두 같은 behavior story recipient와 selector vocabulary를 사용한다. |
| 중단 조건 | browser acceptance recipient가 compare story 또는 `@windows/web` route로 흐려지면 중단한다. |

## 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.behavior.stories.tsx` | 정리 | hover browser recipient는 hover measured-open, whitelist close, no focus restore를 실제 browser에서 확인하는 canonical story여야 한다. | title/export 설명만 읽어도 browser gate가 hover measured-open과 close contract를 어디서 확인하는지 알 수 있다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.behavior.stories.tsx` | 정리 | context browser recipient는 finalize focus restore, duplicate close no-op, actual-open measurement를 browser에서 확인하는 canonical story여야 한다. | title/export 설명이 context-only difference와 browser-only 확인 포인트를 literal하게 남긴다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarMutualExclusion.behavior.stories.tsx` | 정리 | mutual browser recipient는 serial handoff, latest intent wins, dismiss-cancels-queued-winner를 browser에서 확인하는 canonical story여야 한다. | story 설명이 live deviation과 serial queue browser acceptance를 literal하게 남긴다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx` | 정리 | browser gate가 rely할 stable trigger/surface/taskbar/outside selector와 mounted root contract를 유지한다. | browser user gate와 later E2E가 same selector vocabulary를 읽을 수 있다. |

## 완료 증거

- browser acceptance recipient가 `Interactive/Taskbar/HoverPreview` `HoverLifecycle`, `Interactive/Taskbar/ContextPanel` `PointerOriginAndEscapeClose`, `Interactive/Taskbar/MutualExclusion` `ConsumerOwnedWinnerRule`로 literal하게 적혀 있다.
- browser gate가 prove해야 할 항목과 compare story가 prove하지 못하는 항목이 분리돼 있다.
- later materialization이 Storybook behavior recipient를 target하지 못하면 explicit setup blocker를 남겨야 한다는 경계가 드러난다.

## 작업 순서

| 순서 | 작업 묶음 | 이번 단계에서 하는 일 | 끝나면 고정되는 것 |
| --- | --- | --- | --- |
| 1 | `browser acceptance recipients` | hover/context/mutual behavior story를 browser recipient로 literal하게 고정한다. | exact story title/export recipient |
| 2 | `browser acceptance recipients` | stable selector와 browser-only acceptance checklist를 harness/story 설명에 정리한다. | selector vocabulary + browser proof surface |
| 3 | `browser acceptance recipients` | compare story, `@windows/web` route, existing Playwright web config와의 경계선을 명시한다. | later materialize/review/user gate guardrail |

## 작업 묶음 A. exact Storybook behavior recipients

| 항목 | 내용 |
| --- | --- |
| 왜 바꾸는가 | 사용자는 browser acceptance가 mandatory이고 compare story가 아니라 behavior story를 target해야 한다고 고정했다. |
| 현재 문제 | 현재 repo의 Playwright config는 `@windows/web`를 가리키고 있고, compare story도 같은 taskbar family 아래 있어 browser recipient가 흐려질 수 있다. |
| 목표 상태 | browser gate recipient는 exact behavior story title/export로 literal하게 적히고, compare story와 web route는 substitute가 될 수 없게 만든다. |
| 유지되는 것 | compare story kind/state inventory, existing web app E2E의 own scope |

### 관련 파일

| 파일 | 작업 방식 | 완료 조건 |
| --- | --- | --- |
| `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.behavior.stories.tsx` | 정리 | hover browser recipient가 exact title/export와 browser-only proof 항목을 가진다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.behavior.stories.tsx` | 정리 | context browser recipient가 exact title/export와 browser-only proof 항목을 가진다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarMutualExclusion.behavior.stories.tsx` | 정리 | mutual browser recipient가 serial handoff proof 항목을 exact title/export로 가진다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | `Interactive/Taskbar/HoverPreview` `HoverLifecycle`, `Interactive/Taskbar/ContextPanel` `PointerOriginAndEscapeClose`, `Interactive/Taskbar/MutualExclusion` `ConsumerOwnedWinnerRule` |
| state ownership | Storybook behavior story / browser gate |
| callback / handoff | browser gate와 later E2E는 이 recipient를 직접 열고 stable selector를 읽는다. |
| no-op / invalid rule | compare story, `@windows/web` route, simplified fixture route는 browser acceptance 대체 불가 |
| 금지하는 대안 | compare pass를 browser acceptance pass로 해석하는 것, web route에서 behavior story contract를 대신 검증하는 것 |

### 검증 포인트

| 항목 | 확인 방법 |
| --- | --- |
| exact behavior recipient가 literal하게 적힌다 | story source inspection |
| compare와 web route가 대체 수단이 아님이 보인다 | story comments + phase contract inspection |

## 작업 묶음 B. browser-only acceptance checklist

| 항목 | 내용 |
| --- | --- |
| 왜 바꾸는가 | measured-open, enter `animationend`, exit finalize, serial handoff queue는 jsdom과 compare만으로 닫을 수 없는 browser-only acceptance를 가진다. |
| 현재 문제 | 17 gate는 unit/runtime/compare까지만 읽히고, actual browser에서 무엇을 봐야 하는지와 어떤 story를 열어야 하는지가 literal하지 않다. |
| 목표 상태 | browser gate가 실제로 확인해야 하는 must happen / must not happen 항목과 stable selector vocabulary가 exact story recipient 옆에 남는다. |
| 유지되는 것 | unit owner와 jsdom runtime owner가 이미 가진 logic/runtime assertions |

### 관련 파일

| 파일 | 작업 방식 | 완료 조건 |
| --- | --- | --- |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx` | 정리 | browser gate와 later E2E가 사용할 stable selector vocabulary가 유지된다. |
| `packages/ui/src/interactive/taskbar/storybook/*.behavior.stories.tsx` | 정리 | 각 story description이 browser-only acceptance checklist를 literal하게 가진다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | browser-only acceptance checklist + stable selectors |
| state ownership | Storybook behavior harness / browser gate |
| callback / handoff | actual browser는 same selectors로 trigger, taskbar root, hover/context surface, outside target, mutual trigger를 찾는다. |
| no-op / invalid rule | selector drift, compare-only marker 사용, story-local hidden shortcut은 invalid |
| 금지하는 대안 | zero-size provisional snap를 screenshot one-frame pass로 넘기는 것, queue contract를 comment-only로 남기는 것 |

### 검증 포인트

| 항목 | 확인 방법 |
| --- | --- |
| hover/context/mutual story가 browser-only checklist를 가진다 | story source inspection |
| stable selector vocabulary가 same host composition에 남는다 | harness source inspection |

## 실행 계약

- owner_agent: `frontend-developer`
- 목적: mandatory browser acceptance를 exact Storybook behavior story recipient와 stable selector vocabulary에 묶는다.
- boundary: `packages/ui/src/interactive/taskbar/storybook/*.behavior.stories.tsx`, `taskbarBehaviorHarnesses.tsx`까지만 다룬다. automated browser spec creation은 later `plan-materialize` 영역이다.
- input: Phase 3 owner split, `packages/ui/package.json` Storybook scripts, read-only `playwright.config.ts` 현재 web-target contract
- output:
  - canonical browser recipients는 `Interactive/Taskbar/HoverPreview` `HoverLifecycle`, `Interactive/Taskbar/ContextPanel` `PointerOriginAndEscapeClose`, `Interactive/Taskbar/MutualExclusion` `ConsumerOwnedWinnerRule`다.
  - browser gate는 actual browser에서 measured-open/no provisional snap, enter `animationend` persistence, exit finalize persistence, serial handoff queue를 이 recipient 위에서 확인한다.
  - compare stories는 visual baseline only이며 browser acceptance substitute가 아니다.
  - later materialization이 Storybook behavior recipient를 existing runner로 target할 수 없으면 `@windows/web` route나 compare story로 fallback하지 말고 explicit setup blocker를 남겨야 한다.
- 선행조건: `./phases/03-verification-owner-realignment.md`
- 제약: compare story title/kind/state inventory는 유지한다. browser acceptance를 위해 hook public API를 다시 넓히지 않는다.
- side effects: user gate와 materialize handoff가 exact story recipient vocabulary를 공유한다.
- failure/validation: browser acceptance recipient가 compare story 또는 web route로 바뀌거나, selector vocabulary가 host composition과 분리되면 phase는 미완료다.

## Phase 검증

| 확인 항목 | 방법 | 기대 결과 |
| --- | --- | --- |
| exact behavior story recipient | source inspection + `build-storybook` readiness | browser gate가 열어야 할 exact story title/export가 literal하게 남는다. |
| browser-only checklist | story comments + harness inspection | measured-open, animation boundary, serial handoff queue의 browser proof surface가 분리돼 있다. |
| later materialize guardrail | execution contract inspection | Storybook target 불가 시 explicit blocker를 남기고 compare/web route fallback을 금지한다. |
