# windows-web-taskbar-sandbox-preview 테스트 materialization 보고서

## 결과

- boundary: `Phase 1 /sandbox/taskbar route final-interpretation boundary`
  - scenario contract summary: `/sandbox/taskbar` route는 initial render 한 번으로 canonical taskbar scene 1개와 static fixture matrix를 함께 보여주고, matrix는 icon button 3상태와 start/search/hover/context panel fixture를 고정 문자열로 드러내야 한다.
  - risk pattern summary: `없음`
  - test type: `unit`
  - action: `create`
  - target file: `apps/web/src/app/sandbox/taskbar/page.test.tsx`
  - reason: `apps/web`에는 아직 sandbox route boundary를 소유하는 colocated test가 없고, route page가 preview surface의 최종 해석 boundary라서 nearest source-tree unit test를 새로 만든다.
  - canonical contract: `data-testid='taskbar-sandbox-preview|canonical|matrix'`, `[data-status]` 3개, `[data-panel='start']` 3개, `[data-panel='search']` 2개, `[data-panel='hover']` 2개, `[data-panel='context-menu']` 2개, canonical fixture text 유지, `/featured/*`·`/thumbs/*` fallback 금지
  - rejected sibling candidates: `apps/web/src/app/page.test.tsx`, `packages/ui/src/components/taskbar/**/*.test.tsx`

- boundary: `Phase 1~2 /sandbox/taskbar bounded-surface preview`
  - scenario contract summary: 사용자가 `/sandbox/taskbar`를 열면 preview owner route가 canonical scene과 fixture matrix를 동시에 보여주고, route-level metadata는 sandbox title과 noindex intent를 드러내며, 좁은 viewport에서도 주요 surface marker와 fixture text가 사라지지 않아야 한다.
  - risk pattern summary: `없음`
  - test type: `e2e`
  - action: `create`
  - target file: `e2e/sandbox-taskbar-preview.spec.ts`
  - reason: Playwright runner와 `/sandbox/taskbar` route owner가 이미 계획에 고정돼 있고, 같은 surface를 소유하는 기존 spec이 없어서 새 bounded-surface spec을 만든다.
  - canonical contract: `@surface_id sandbox-taskbar-preview`, route `/sandbox/taskbar`, wrapper/canonical/matrix test id visibility, panel/status count, sandbox title, `meta[name='robots']`의 `noindex` intent, mobile-width visibility
  - rejected sibling candidates: `e2e/taskbar.spec.ts`, `e2e/home.spec.ts`, `playwright-guard`

## 메모

- metadata 출력 위치는 App Router route-level surface로만 고정하고 구현 파일 선택은 열어 둔다. metadata의 최종 사용자 관찰 가능 계약은 bounded-surface Playwright spec에서 검증한다.
- production code와 test config는 변경하지 않았다.
