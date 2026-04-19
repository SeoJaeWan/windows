# Phase 5. Storybook browser runner boundary

## Phase 요약

| 항목 | 내용 |
| --- | --- |
| owner_agent | `general-developer` |
| 목표 | task 18 전용 Storybook browser runner / command / config boundary를 root 수준에서 분리한다. |
| 다루는 작업 묶음 | `storybook browser runner boundary` |
| 시작 조건 | `./phases/04-behavior-story-browser-acceptance.md` |
| 완료 판단 | `test:e2e:storybook`, `playwright.storybook.config.ts`, `@windows/ui` Storybook `http://localhost:6006` target이 별도 owner로 닫히고 existing `playwright.config.ts` / `@windows/web` owner는 그대로 유지된다. Phase 5 green path는 아직 생성되지 않은 `e2e/storybook/**` owner 파일에 의존하지 않는다. |
| 중단 조건 | Storybook browser owner가 existing `playwright.config.ts` 또는 `test:e2e`에 다시 섞이거나, `@windows/web` / `http://localhost:3000` owner를 침범하거나, phase validation이 아직 생성되지 않은 `e2e/storybook/**` owner 파일을 요구하면 중단한다. |

## 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `package.json` | 정리 | root canonical command는 `test:e2e:storybook`처럼 Storybook browser owner를 직접 가리켜야 한다. | root script만 읽어도 task 18 Storybook browser owner와 existing web owner가 분리되어 보인다. |
| `playwright.storybook.config.ts` | 추가 | Storybook-targeted Playwright config는 `e2e/storybook/**`, `@windows/ui` Storybook, `http://localhost:6006`만 소유해야 한다. | config만 읽어도 Storybook browser owner가 `playwright.config.ts`와 다른 baseURL / webServer / testDir를 가진다. |
| `packages/ui/package.json` | 참조 | Storybook build / dev owner는 `@windows/ui` package script를 그대로 사용해야 한다. | `storybook`, `build-storybook` script를 그대로 재사용하는 readiness contract가 명시된다. |
| `playwright.config.ts` | 읽기 전용 참조 | existing Playwright owner는 `@windows/web` / `http://localhost:3000`에 남아 있어야 한다. | Storybook boundary를 닫더라도 existing web owner가 바뀌지 않는다는 점이 분명하다. |

## 완료 증거

- root canonical command가 `test:e2e:storybook`처럼 Storybook browser owner를 직접 가리킨다.
- Storybook-targeted Playwright config가 existing `playwright.config.ts`와 별도 파일로 존재한다.
- target host가 `@windows/ui` Storybook `http://localhost:6006`으로 고정되고 `@windows/web` `http://localhost:3000` owner는 그대로 유지된다.
- validation surface는 Storybook build readiness와 runner/config boundary inspection으로 Phase 5 안에서 닫히고, `pnpm --filter @windows/ui build-storybook`와 source inspection만으로 green path가 성립한다. `pnpm test:e2e:storybook --list`와 첫 Storybook owner listing은 Phase 6에서 소유한다.

## 작업 순서

| 순서 | 작업 묶음 | 이번 단계에서 하는 일 | 끝나면 고정되는 것 |
| --- | --- | --- | --- |
| 1 | `storybook browser runner boundary` | root script와 Storybook-targeted Playwright config file boundary를 분리한다. | Storybook browser owner 전용 command / config |
| 2 | `storybook browser runner boundary` | `@windows/ui` Storybook `http://localhost:6006` target과 existing web owner separation을 literal하게 적는다. | Storybook / web owner split |
| 3 | `storybook browser runner boundary` | build readiness와 runner/config self-check를 validation contract로 고정하고, 첫 owner listing responsibility는 Phase 6으로 넘긴다. | 실행 전 검증 boundary |

## 작업 묶음 A. root Storybook runner split

| 항목 | 내용 |
| --- | --- |
| 왜 바꾸는가 | 이전 materialize blocker는 Storybook browser owner가 repo-local command / config boundary로 닫히지 않았기 때문에 생겼다. |
| 현재 문제 | root `test:e2e`와 `playwright.config.ts`는 `@windows/web`만 소유하고 있어 Storybook behavior recipient를 직접 target할 수 없다. |
| 목표 상태 | root command `test:e2e:storybook`과 `playwright.storybook.config.ts`가 task 18 Storybook browser owner를 별도 boundary로 고정한다. |
| 유지되는 것 | existing `test:e2e`, `playwright.config.ts`, `@windows/web` / `http://localhost:3000` owner |

### 관련 파일

| 파일 | 작업 방식 | 완료 조건 |
| --- | --- | --- |
| `package.json` | 정리 | Storybook browser owner command가 root canonical command로 보인다. |
| `playwright.storybook.config.ts` | 추가 | Storybook target, baseURL, testDir, webServer가 existing web owner와 분리된다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | `test:e2e:storybook`, `playwright.storybook.config.ts` |
| state ownership | root Storybook browser owner |
| callback / handoff | Phase 6의 `e2e/storybook/**` owner file들이 이 command / config를 직접 사용한다. |
| no-op / invalid rule | existing `playwright.config.ts`를 Storybook owner로 재사용하는 것은 invalid다. |
| 금지하는 대안 | `test:e2e`만으로 Storybook browser owner를 대신하려는 시도 |

### 검증 포인트

| 항목 | 확인 방법 |
| --- | --- |
| root canonical command가 Storybook owner를 직접 가리킨다 | `package.json` source inspection |
| Storybook config가 별도 file boundary로 존재한다 | `playwright.storybook.config.ts` source inspection |

## 작업 묶음 B. self-sufficient readiness validation boundary

| 항목 | 내용 |
| --- | --- |
| 왜 바꾸는가 | review finding은 Phase 5가 아직 생성되지 않은 `e2e/storybook/**` owner 파일 없이도 green이 되어야 한다고 지적했다. |
| 현재 문제 | owner listing을 Phase 5 validation에 넣으면, 첫 Storybook owner 파일을 만드는 Phase 6이 오기 전까지는 green path가 later phase에 의존하게 된다. |
| 목표 상태 | Phase 5 validation은 Storybook build readiness와 runner/config boundary inspection만으로 닫히고, 첫 owner listing은 Phase 6으로 이동한다. |
| 유지되는 것 | exact behavior recipient contract 자체와 source-tree owner listing은 Phase 6에서 계속 소유한다. |

### 관련 파일

| 파일 | 작업 방식 | 완료 조건 |
| --- | --- | --- |
| `packages/ui/package.json` | 참조 | `build-storybook` readiness source가 그대로 유지된다. |
| `package.json`, `playwright.storybook.config.ts` | 정리 | root command와 Storybook config만 읽어도 Storybook browser boundary가 web owner와 분리된 것이 보인다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | Storybook build readiness + runner/config self-sufficient validation |
| state ownership | runner validation boundary |
| callback / handoff | Phase 6 setup-smoke owner와 첫 owner listing은 같은 command / config를 이어받아 source-tree owner proof를 닫는다. |
| no-op / invalid rule | build readiness 없이 green으로 보는 상태, 또는 아직 없는 Storybook owner 파일 listing을 Phase 5 proof로 요구하는 상태는 미완료다. |
| 금지하는 대안 | `@windows/web` dev server를 Storybook readiness 증거로 쓰는 것 |

### 검증 포인트

| 항목 | 확인 방법 |
| --- | --- |
| Storybook build readiness가 phase validation에 포함된다 | `pnpm --filter @windows/ui build-storybook` |
| root command와 Storybook config만으로 browser boundary가 닫힌다 | `package.json` + `playwright.storybook.config.ts` source inspection |

## 실행 계약

- owner_agent: `general-developer`
- 목적: task 18 Storybook browser owner를 repo-local root command / config boundary로 닫는다.
- boundary: `package.json`, `playwright.storybook.config.ts`, `packages/ui/package.json`까지 다루고 `playwright.config.ts`는 separation reference로만 읽는다.
- input: Phase 4 exact behavior story recipient contract, existing web Playwright owner contract
- output:
  - root canonical command는 `test:e2e:storybook`처럼 Storybook browser owner를 직접 가리킨다.
  - Storybook-targeted Playwright config는 `@windows/ui` Storybook `http://localhost:6006`만 target한다.
  - existing `playwright.config.ts` / `@windows/web` / `http://localhost:3000` owner는 그대로 유지된다.
  - validation contract는 Storybook build readiness와 runner/config self-sufficient inspection만 포함한다.
- 선행조건: `./phases/04-behavior-story-browser-acceptance.md`
- 제약: `e2e/storybook/**` owner file 자체는 Phase 6에서 닫는다. 이 phase는 runner / config boundary만 닫고 첫 owner listing responsibility는 가지지 않는다.
- side effects: later materialize와 setup-smoke owner가 더 이상 generic web Playwright owner를 전제하지 않게 된다.
- failure/validation: Storybook browser owner가 web owner에 다시 섞이거나, validation이 아직 생성되지 않은 `e2e/storybook/**` owner 파일에 의존하거나, build readiness / runner-config inspection 중 하나라도 빠지면 phase는 미완료다.

## Phase 검증

- [ ] `pnpm --filter @windows/ui build-storybook`가 Storybook build readiness boundary로 명시된다.
- [ ] `package.json`과 `playwright.storybook.config.ts` inspection이 Phase 5 self-sufficient validation boundary로 명시된다.
- [ ] Phase 5 검증은 `pnpm test:e2e:storybook --list`를 요구하지 않고, 첫 `e2e/storybook/**` owner file이 생기는 Phase 6만 listing green path를 소유한다.
- [ ] `playwright.storybook.config.ts`는 `@windows/ui` Storybook `http://localhost:6006`만 target하고 existing `playwright.config.ts` / `@windows/web` owner는 그대로 유지한다.
