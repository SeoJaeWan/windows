# QA Report — windows-ui-folder-browser-input-dropdown-contract

**Base:** main (4f05793a958b9e93b953e3c09f223dfe5556d202)
**HEAD:** cd91a411b1eaf16f166e61f7d68e98b597c4b613
**Generated:** 2026-04-20T21:00:00+09:00

## Summary

| Track | Status | PASS | PARTIAL | FAIL | SKIP |
|---|---|---|---|---|---|
| frontend | ⚠️ | 10 | 1 | 1 | 0 |
| backend | — | — | — | — | skipped (no backend) |
| db | — | — | — | — | skipped (no db) |

## Acceptance coverage

- Total acceptance bullets (from plan Phase 3 완료 조건): 5
- Verified: 4
- Unverified / advisory: 1 (build-storybook not run — no server)

---

## Findings

### frontend

#### 테스트 실행 결과

`pnpm --filter @windows/ui exec vitest run src/index.test.ts src/components/windows/storybook/windowCompareInventory.test.tsx`

결과: **32/32 PASS**

- `@windows/ui root entry — Folder export` (3 tests) — PASS
- `@windows/ui root entry — Browser export` (3 tests) — PASS
- `@windows/ui root entry — boundary 검증` (2 tests) — PASS
  - WindowFrame은 public export가 아니다 확인됨
- `Folder compare inventory — 8-state` (11 tests) — PASS
  - 8개 story state 전부 `[data-visual-root]` / `[data-window-compare-stage]` 계층 검증 통과
- `Browser compare inventory — 7-state` (10 tests) — PASS
- `compare inventory — 15-state completeness 검증` (3 tests) — PASS
  - Folder 8 + Browser 7 = 15 canonical story ID 확인됨

#### 정적 검사 결과

**PASS — Storybook literal title rule**
- `folder.stories.tsx`: `title: "Windows/Compose/Folder"` — literal string, canonical taxonomy 준수
- `browser.stories.tsx`: `title: "Windows/Compose/Browser"` — literal string, canonical taxonomy 준수

**PASS — meta.component owner rule**
- folder.stories.tsx: `component: Folder`
- browser.stories.tsx: `component: Browser`

**PASS — Compare story inventory count**
- Folder: CompareLiveBlog, CompareLiveSearchOpen, CompareLiveChipOpen, CompareLiveSidebarHover, CompareLiveSidebarExpanded, CompareLiveThumbnailHover, CompareMobileBlog, CompareMobileSearchOpen — 8개 확인
- Browser: CompareLiveArticle, CompareLiveAddressOpen, CompareLiveControlHoverMinimize, CompareLiveControlHoverMaximize, CompareLiveControlHoverClose, CompareMobileArticle, CompareMobileAddressOpen — 7개 확인

**PASS — Detail-state owner rule (no new public props)**
- Folder: 상세 state (chip-open, sidebar-hover, sidebar-expanded, thumbnail-hover, mobile-search-open)는 public prop이 아님. 소스 주석과 FolderProps 정의에서 확인됨.
- Browser: control-hover-* 3종과 mobile-address-open은 public prop이 아님. BrowserProps 정의에서 확인됨.

**PASS — panels domain non-reuse**
- `windowFrame/index.tsx`, `folder/index.tsx`, `browser/index.tsx` 어디에도 `@windows/ui` panels 도메인 import 없음. 주석에도 금지 명시.

**PASS — icons 정책**
- `lucide-react` import 없음. windows 컴포넌트에서 아이콘 미사용 (symbol 문자열 사용).
- `pointer-events-none` 미사용 확인.

**PASS — WindowFrame internal-only boundary**
- `packages/ui/src/index.ts`에 WindowFrame export 없음. 테스트에서도 `"WindowFrame" in WindowsUI === false` 검증 통과.

**PASS — CompareWindowStage DOM contract**
- `[data-window-compare-stage]` + `data-window-variant` 속성 존재.
- CompareRoot에 className/style 미주입. scoped `<style>` 태그로 geometry 고정 (bounded exception 규칙 허용 사례 2 해당).

**PASS — Token namespace**
- `folder/index.tsx`, `browser/index.tsx`: `--window-*` token만 사용. `--panel-*` 미사용.
- utilities.css: `window-frame`, `window-chrome`, `window-content`, `window-chrome-mobile` utility 정의 존재. `--window-*` token 참조.

**PARTIAL — Mobile hierarchy**
- Folder mobile: `FOLDER_MOBILE_BLOG` fixture가 동일한 props를 사용함. 컴포넌트 소스에서 명시적 반응형 breakpoint 처리(sidebar drawer collapse)가 없음. 현재 구현은 모바일 viewport에서 데스크톱과 동일한 sidebar+grid layout을 렌더링함. 플랜 계약("Mobile은 content-first grid, sidebar collapses to drawer")이 소스 주석에는 명시되어 있으나 실제 CSS breakpoint 구현은 없음. 이는 advisory — runtime 동작 차이이며 visual test 통과 여부는 capture 환경에 따라 다를 수 있음.

**FAIL — `window-control-btn` 미정의 클래스**
- `folder/index.tsx:149` 및 `browser/index.tsx:114`에서 `window-control-btn` className 사용.
- `packages/tailwind-config/src/utilities.css`에 `@utility window-control-btn` 정의 없음.
- 이 클래스는 런타임에 아무 스타일도 적용하지 않음. 컨트롤 버튼의 styling은 다른 클래스들로 처리되나, 명명된 utility 계약이 존재하지 않아 향후 유지보수 시 혼란 가능성 있음.
- 재현: `packages/tailwind-config/src/utilities.css`에서 `window-control-btn` 검색 → 정의 없음.

---

### backend

해당 없음 (백엔드 파일 변경 없음).

### db

해당 없음 (DB 마이그레이션 파일 변경 없음).

---

## Evidence

- Test run: 32/32 PASS (vitest run src/index.test.ts + windowCompareInventory.test.tsx)
- Static analysis: grep on changed source files
- build-storybook: not run (no active storybook server; storybook-static/ artifact from previous run exists in repo)
