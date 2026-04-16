# interactive 훅 규칙

`packages/ui/src/interactive/` 아래의 훅과 internal helper에 적용되는 구조·테스트 규칙이다.

## 폴더 구조

각 훅과 internal helper는 **이름과 동일한 폴더**로 분리하고 `index.ts`를 entry로 둔다.

```
interactive/
└── taskbar/
    ├── internal/
    │   ├── useHoverIntent/
    │   │   ├── index.ts
    │   │   └── useHoverIntent.test.tsx
    │   └── useReducedMotion/
    │       ├── index.ts
    │       └── useReducedMotion.test.tsx
    ├── useTaskbarHoverPreview/
    │   ├── index.ts
    │   └── useTaskbarHoverPreview.test.tsx
    └── useTaskbarContextPanel/
        ├── index.ts
        └── useTaskbarContextPanel.test.tsx
```

- 훅 파일: `{hookName}/index.ts`
- 테스트 파일: `{hookName}/{hookName}.test.tsx` (또는 `.test.ts`)
- 폴더명과 훅 이름은 항상 일치한다
- 훅이 아닌 순수 함수도 동일한 폴더 구조를 따른다

## 테스트 규칙

### 언어

- `describe` / `it` 설명은 **한국어**로 작성한다
- 훅 이름 자체(`describe('useTaskbarHoverPreview', ...)`)는 영어 그대로 둔다

### harness 패턴

- hook을 직접 호출하는 최소 React 컴포넌트(`Harness`)를 로컬로 만들어 `createRoot`로 mount한다
- `resultRef` 또는 클로저 변수로 결과를 노출한다
- 타이머가 있는 hook은 `vi.useFakeTimers()` / `vi.advanceTimersByTime()` 사용
- 브라우저 API(`matchMedia` 등)는 `Object.defineProperty`로 mock한다 (jsdom에 없는 API는 `vi.spyOn` 불가)

### 커버리지 기준

훅 테스트는 아래 경로를 반드시 포함한다:

| 항목 | 검증 내용 |
|------|----------|
| 초기 상태 | 마운트 직후 반환값 |
| 정상 경로 | 주요 use-case 전체 흐름 |
| 타이머 / 비동기 | `vi.advanceTimersByTime`으로 지연 검증 |
| 취소 경로 | 타이머 cancel이 있는 경우 |
| reduced motion | `motionPreference: 'reduced'`로 즉시 완료 경로 |
| 엣지 케이스 | 경계값, 콜백 없는 경우, 오류 없이 처리되는 경우 |

## import 경로 규칙

- 같은 폴더 내 `index.ts`는 `'.'`으로 import한다
- internal helper는 `../internal/{helperName}`으로 import한다 (index.ts 자동 resolve)
- internal helper에서 shared type을 import할 때 경로 깊이를 정확히 맞춘다

```ts
// useTaskbarHoverPreview/index.ts (taskbar/useTaskbarHoverPreview/ 위치)
import type { SurfacePhase } from '../../../components/panels/taskbarAttachedSurface/shared'
import { useReducedMotion } from '../internal/useReducedMotion'

// usePresencePhase/index.ts (taskbar/internal/usePresencePhase/ 위치)
import type { SurfacePhase } from '../../../../components/panels/taskbarAttachedSurface/shared'
```

## public export 규칙

- `packages/ui/src/interactive/index.ts`는 taskbar-specific hook과 필요한 public type만 export한다
- internal helper는 절대 `./interactive` public entry에 올리지 않는다
- root server-safe entry(`packages/ui/src/index.ts`)에 client-only hook을 재export하지 않는다
