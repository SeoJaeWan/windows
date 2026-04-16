# Visual Compare Report — Folder & Browser Window Family

**Date**: 2026-04-16 (Phase 6 updated)
**Baseline provenance**: external-source evidence (Phase 1 captures from live production at seojaewan.com)
**Current provenance**: package-local current (Storybook compare stories, @windows/ui build)
**Threshold**: 0.2 (element-level external reference)
**Pass criterion**: mismatch rate < 1%

---

## Results Summary (Phase 6 — after height fix)

| State Key | Baseline Size | Current Size | Size Match | Mismatch Rate | Result |
|---|---|---|---|---|---|
| folder/desktop-default | 1280x750 | 1280x750 | YES | 15.16% | FAIL (no-op) |
| folder/mobile-collapsed | 390x794 | 390x794 | YES | 17.14% | FAIL (no-op) |
| browser/desktop-article | 1280x750 | 1280x750 | YES | 6.37% | FAIL (no-op) |
| browser/desktop-not-found | 1280x750 | 1280x750 | YES | 0.73% | PASS |
| browser/mobile-article | 390x794 | 390x794 | YES | 11.84% | FAIL (no-op) |
| browser/mobile-not-found | 390x794 | 390x794 | YES | 2.32% | FAIL (no-op) |

**Overall**: 1/6 passed
**Root Cause 1 (height)**: CLOSED — all 6 states now match baseline geometry after stage height correction
**Root Cause 2 (content/fixture)**: no-op closure — 의도된 구현 변경으로 source fix 불필요
**Root Cause 3 (chrome design)**: no-op closure — 의도된 리메이크 설계 변경으로 source fix 불필요

---

## Root Cause 1: Height fix — CLOSED (Phase 6)

**Before (Phase 5)**: `CompareWindowDesktopStage` height=720, `CompareWindowMobileStage` height=720
**After (Phase 6)**: `CompareWindowDesktopStage` height=750, `CompareWindowMobileStage` height=794

Phase 5에서 `[data-visual-root]` element screenshot 방식으로 캡처했을 때 content-driven natural height(262–542px)만 잡혔다. Phase 6에서:
1. `compareWindowStage.tsx`의 Desktop height 720→750, Mobile height 720→794로 수정
2. capture 스크립트를 stage 고정 크기 clip screenshot 방식으로 교체
3. 재캡처 후 6개 state 모두 size match 달성

**수정 파일**: `packages/ui/src/components/windows/storybook/compareWindowStage.tsx`

---

## Root Cause 2: Content/fixture divergence — no-op closure

의도된 구현 변경으로 source fix 불필요.

- **Folder**: baseline은 live 블로그 썸네일 그리드, current는 새 data model 기반 파일 시스템 아이콘 그리드. 데이터 모델 변경은 리메이크 설계 변경의 일부.
- **Browser article**: baseline은 hero 이미지 포함 전체 아티클, current는 단순화된 픽스처 body. 픽스처 범위 차이.
- **Browser not-found**: baseline은 브라우저 DNS 오류 화면, current는 Next.js 404 페이지. Phase 1 baseline-inventory.md에 known limitation으로 기록됨.

---

## Root Cause 3: Window chrome design change — no-op closure

의도된 리메이크 설계 변경으로 source fix 불필요.

baseline = 기존 seojaewan.com 레거시 chrome (folder-tab / browser-tab 스타일)
current = Windows 11 스타일 새 chrome (titlebar + minimize/maximize/close 버튼)

이 변경은 "Windows 테마 인터페이스를 계승하면서 UI와 요소를 명확히 분리하는 아키텍처로 재구축"하는 프로젝트 목표에서 비롯된 의도된 리디자인이다.

---

## Per-State Drift Notes (Phase 6)

**folder/desktop-default** (15.16%): Size match 달성(1280×750). 잔여 mismatch는 RC2(콘텐츠) + RC3(chrome 디자인) — no-op closure.

**folder/mobile-collapsed** (17.14%): Size match 달성(390×794). 잔여 mismatch는 RC2(콘텐츠) + RC3(chrome 디자인) — no-op closure.

**browser/desktop-article** (6.37%): Size match 달성(1280×750). 잔여 mismatch는 RC2(hero 이미지 없음) + RC3(chrome 디자인) — no-op closure.

**browser/desktop-not-found** (0.73% — PASS): Size match 달성(1280×750). RC2(DNS vs 404) + RC3(chrome)에도 불구하고 양측 모두 주로 흰 배경이라 pixel diff가 1% threshold 이내. Phase 1 baseline-inventory.md의 browser/not-found DNS 오류 known limitation 참조.

**browser/mobile-article** (11.84%): Size match 달성(390×794). 잔여 mismatch는 RC2(hero 이미지 없음) + RC3(chrome 디자인) — no-op closure.

**browser/mobile-not-found** (2.32%): Size match 달성(390×794). RC2(DNS vs 404) + RC3(chrome 디자인). browser/desktop-not-found 대비 mismatch가 높은 이유는 모바일 화면 밀도 차이 — no-op closure.

---

## Closure Summary

| Root Cause | Fix | Status |
|---|---|---|
| RC1: Height truncation | compareWindowStage.tsx height 수정 + clip screenshot | CLOSED |
| RC2: Content/fixture divergence | no-op — 의도된 구현 변경 | CLOSED |
| RC3: Chrome design change | no-op — 의도된 리메이크 설계 변경 | CLOSED |
