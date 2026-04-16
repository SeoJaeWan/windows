# Phase 1. title source 단일화

> 이 문서는 실행용 상세 계약이다. 맨 위 컨트롤러 다이제스트만 읽어도 이 phase의 목표, 파일 단위 변경, 완료 판단, 중단 시점을 알 수 있어야 한다.
> 아래 기술 섹션은 `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위나 결론을 새로 바꾸지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | taskbar stories가 literal `meta.title`만으로 Storybook에 등록되고, registration helper는 marker/Figma metadata owner로만 남는다. |
| 선행조건 | `none` |
| 완료 판단 | `.storybook/main.ts`가 taskbar-specific dynamic title parsing 없이 build 가능하고, taskbar stories가 `Taskbar/Components/*`, `Taskbar/Compose/Taskbar` title을 직접 가진다. |
| 중단 조건 | Storybook title source를 걷어내면 in-repo에서 확인 가능한 marker/Figma recipient 외에 다른 실제 소비자가 깨지거나, taskbar title migration이 compare `kind/state` key 변경까지 강제하면 중단한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/.storybook/main.ts` | 정리 | Storybook sidebar title discovery는 literal `meta.title`가 canonical source다. taskbar-only indexer를 위한 imported-title parsing은 다시 도입하지 않는다. | custom title parser 없이도 story discovery가 유지된다. |
| `packages/ui/src/components/taskbar/storybook/foundationFigmaRegistration.ts` | 정리 | helper는 `marker`, `markers`, `recipientUrl` 같은 review metadata만 소유한다. Storybook title이나 story ID owner로 남기지 않는다. | helper에서 Storybook title source 역할이 제거된다. |
| `packages/ui/src/components/taskbar/taskbarWindowsButton/taskbarWindowsButton.stories.tsx` | 교체 | final title은 `Taskbar/Components/Windows`다. marker 계약은 유지하되 helper가 title을 결정하지 않는다. | story file이 literal title과 기존 marker 계약을 함께 가진다. |
| `packages/ui/src/components/taskbar/taskbarSearch/taskbarSearch.stories.tsx` | 교체 | final title은 `Taskbar/Components/Search`다. marker 계약은 유지하되 helper가 title을 결정하지 않는다. | story file이 literal title과 기존 marker 계약을 함께 가진다. |
| `packages/ui/src/components/taskbar/taskbarIconButton/taskbarIconButton.stories.tsx` | 교체 | final title은 `Taskbar/Components/Icon`이다. compare state key는 `default`, `active`, `hide`를 그대로 쓴다. | title source만 바뀌고 compare inventory는 유지된다. |
| `packages/ui/src/components/taskbar/taskbarClock/taskbarClock.stories.tsx` | 교체 | final title은 `Taskbar/Components/Clock`이다. marker 계약은 유지하되 helper가 title을 결정하지 않는다. | story file이 literal title과 기존 marker 계약을 함께 가진다. |
| `packages/ui/src/components/taskbar/taskbar/taskbar.stories.tsx` | 교체 | rail story는 catalog leaf가 아니라 compose owner다. final title은 `Taskbar/Compose/Taskbar`다. | taskbar rail이 taskbar domain compose branch로 이동한다. |

### 완료 증거

- taskbar story files에서 `FOUNDATION_REGISTRATION.*.title` 사용이 사라진다.
- Storybook build가 taskbar-only indexer 없이 통과한다.
- taskbar domain stories가 `Taskbar/Components/*`와 `Taskbar/Compose/Taskbar` 아래에 보인다.

- owner_agent: `frontend-developer`
- 목적:
  - taskbar 전용 dynamic title 경로를 제거하고, Storybook title source를 literal `meta.title`로 단일화한다.
- boundary:
  - `packages/ui/.storybook/main.ts`
  - `packages/ui/src/components/taskbar/storybook/foundationFigmaRegistration.ts`
  - `packages/ui/src/components/taskbar/taskbarWindowsButton/taskbarWindowsButton.stories.tsx`
  - `packages/ui/src/components/taskbar/taskbarSearch/taskbarSearch.stories.tsx`
  - `packages/ui/src/components/taskbar/taskbarIconButton/taskbarIconButton.stories.tsx`
  - `packages/ui/src/components/taskbar/taskbarClock/taskbarClock.stories.tsx`
  - `packages/ui/src/components/taskbar/taskbar/taskbar.stories.tsx`
- input:
  - taskbar leaf stories가 `FOUNDATION_REGISTRATION.*.title` imported variable을 `meta.title` source로 사용한다.
  - `.storybook/main.ts`가 taskbar stories를 위해 registration-aware custom indexer를 사용한다.
  - 사용자 합의는 Storybook root를 domain-first `Taskbar/*`, `Windows/*`, `Search/*`, `Context/*`로 맞추고 같은 Storybook 안에서 `Components`와 `Compose`를 나누는 방향이다.
- output:
    - 공개 계약:
      - taskbar leaf stories의 canonical titles는 `Taskbar/Components/Windows`, `Taskbar/Components/Search`, `Taskbar/Components/Icon`, `Taskbar/Components/Clock`이다.
      - taskbar rail story의 canonical title은 `Taskbar/Compose/Taskbar`다.
      - `FOUNDATION_REGISTRATION` helper는 Storybook sidebar title이나 story ID를 소유하지 않고 marker/Figma metadata만 소유한다.
      - `.storybook/main.ts`는 taskbar-only registration title parser 없이도 Storybook build를 통과한다.
    - 내부 기본값:
      - 기존 `marker`, `markers`, `recipientUrl`, compare `kind/state` key는 그대로 유지한다.
    - 허용하지 않는 대안:
      - imported const나 helper return value를 다시 `meta.title` source로 쓰는 방식
      - taskbar leaf만 별도 indexer를 태우는 Storybook config
      - title migration과 함께 compare `kind/state` key를 동시에 바꾸는 범위 확대
- 선행조건: `none`
- 제약:
  - 이 phase는 taskbar domain stories에만 집중한다.
  - phase 종료 시점에 panel/search/context domain의 legacy title은 남아 있어도 된다.
  - Storybook build contract는 `packages/ui/package.json`의 `build-storybook` script를 기준으로 판단한다.
- side effects:
  - taskbar leaf story IDs는 title 변경 때문에 달라질 수 있다. phase 내부에서는 helper의 stale `storyId`를 유지하지 말고, 실제 recipient가 필요하면 그 recipient를 별도 contract로 명시해야 한다.
- failure/validation:
  - helper 밖 실제 소비자가 `storyId` literal을 사용한다는 근거가 나오면, 해당 recipient를 새 canonical source로 명시하기 전에는 helper 필드 삭제를 강행하지 않는다.
  - taskbar title migration이 compare marker/state나 review marker recipient까지 흔들면 later phase prerequisite가 넓어지므로 blocker다.
- 작업:
  - `.storybook/main.ts`에서 registration-aware custom indexer와 imported-title regex path를 제거하고, literal CSF titles만으로 인덱싱되는 config로 정리한다.
  - `foundationFigmaRegistration.ts`를 marker/Figma metadata 중심 구조로 축소하고, title/storyId owner 역할을 제거한다.
  - taskbar leaf story 네 파일의 `meta.title`을 literal final title로 바꾼다.
  - rail story의 `meta.title`을 `Taskbar/Compose/Taskbar`로 옮긴다.
  - marker와 compare `kind/state` key는 그대로 유지해 later phase가 title migration 때문에 compare inventory를 다시 열지 않게 한다.
- 검증:
    - [ ] `pnpm --filter @windows/ui build-storybook`가 통과한다.
    - [ ] `rg -n "FOUNDATION_REGISTRATION\\..*\\.title|storyId:" packages/ui/.storybook/main.ts packages/ui/src/components/taskbar` 결과가 taskbar title source나 stale helper story ID를 남기지 않는다.
    - [ ] `rg -n 'title: "Taskbar/(Components|Compose)/' packages/ui/src/components/taskbar -g "*.stories.tsx"` 결과가 taskbar story files의 final title inventory를 보여 준다.
