# packages/ui 패키지 경계 규칙

## Canonical inventory

`packages/ui`에서 package-wide styling / semantic facade / rename / Storybook cleanup 작업을 할 때:

- **canonical scope**: `packages/ui/src/components/**` 전체
- **explicit negative scope**: `**/*.stories.tsx`, `**/storybook/**`, `**/*.test.tsx`
- runtime writable inventory와 Storybook writable inventory를 같은 canonical scope 기준으로 닫는다

subset family path(e.g. `taskbar/**`, `panels/windows/**`)만을 canonical scope처럼 다루는 것은 금지한다.

## Read-only scope anchor

아래 두 파일은 cleanup boundary를 잡는 **read-only anchor**다. 수정하지 않고 inclusion guard로만 사용한다:

- `packages/ui/src/index.ts` — public export family가 boundary 밖으로 밀리지 않게 한다
- `packages/ui/src/components/taskbar/storybook/compareRoot.tsx` — compare-owned family가 silent exclusion 되지 않게 한다

## Explicit negative scope와 matching validation

제외(exclusion)가 필요하면:
1. 같은 phase/rule에서 **explicit negative scope**를 명시한다
2. 같은 phase/rule에서 **matching validation**을 함께 적는다
3. stale subset grep이나 later phase 의존 검증은 금지한다

## Validation alignment

package-wide cleanup phase의 검증은:
- full-tree inventory를 스캔한다 (subset path 가정 금지)
- allowlist는 phase 내부에서 self-sufficient하게 닫는다
- exported family와 compare-owned family가 read-only anchor에서 보이면 runtime cleanup boundary에 포함한다
