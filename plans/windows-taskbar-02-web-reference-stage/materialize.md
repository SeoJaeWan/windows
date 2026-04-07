# plan-materialize

## Action 1

- boundary: `/sandbox/taskbar` route-level unit boundary
- scenario contract summary:
  - scenario: server-rendered sandbox route가 새 `Taskbar` consumer contract를 정적 reference stage로 노출한다.
  - inputs: route markup, `taskbar-sandbox-canonical`, `taskbar-sandbox-compare`
  - must happen: canonical marker와 compare marker가 함께 렌더링되고, 각각 `pinned/default`, `all/results` static state를 가진다.
  - must not happen: legacy `taskbar-sandbox-preview`, `taskbar-sandbox-matrix`, preview/matrix wording이 canonical contract로 남는다.
- risk pattern summary: canonical marker 2개가 old preview marker보다 winner다.
- test type: `unit`
- action: `update`
- target file: `apps/web/src/app/sandbox/taskbar/page.test.tsx`
- reason: 기존 route test가 동일 surface를 이미 소유하고 있어 modify-first가 맞다.
- canonical contract: `taskbar-sandbox-canonical` + `taskbar-sandbox-compare`
- rejected sibling candidates: `taskbar-sandbox-preview`, `taskbar-sandbox-matrix`

## Action 2

- boundary: `/sandbox/taskbar` bounded-surface E2E
- scenario contract summary:
  - scenario: 브라우저에서 `/sandbox/taskbar` route를 열었을 때 reference owner route contract가 실제로 보인다.
  - inputs: `@surface_id`가 달린 Playwright surface spec, canonical/compare test ids, narrow viewport
  - must happen: canonical/compare marker visibility, `pinned/default`와 `all/results` surface visibility, `noindex` metadata 유지
  - must not happen: preview-only marker 재등장, cross-route journey materialization
- risk pattern summary: 동일 route surface의 canonical marker가 legacy preview marker보다 winner다.
- test type: `e2e`
- action: `update`
- target file: `e2e/sandbox-taskbar-preview.spec.ts`
- reason: existing spec가 같은 route surface를 이미 소유하므로 rename보다 update가 우선이다.
- canonical contract: `/sandbox/taskbar` reference owner route bounded-surface contract
- rejected sibling candidates: preview matrix locator contract, cross-route regression spec
