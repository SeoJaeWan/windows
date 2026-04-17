# Baseline Inventory — Folder/Browser Live UI Parity

## Canonical States (4)

---

### folder/desktop-blog

- **url**: https://seojaewan.com/blog
- **capture date**: 2026-04-17
- **viewport**: 1280x750
- **provenance**: external-source evidence (live seojaewan.com)
- **file**: `folder-desktop-blog.png`
- **blocking focus**:
  - thinner chrome: window chrome 두께, titlebar height, titlebar button (최소화/최대화/닫기) 크기 및 위치
  - back/forward and address bar geometry: back/forward 버튼 + breadcrumb 경로 표시 영역의 높이·패딩·위치
  - desktop sidebar hierarchy: 좌측 tree navigation panel 표시 여부 및 폴더 계층 항목(블로그/프로젝트/코딩 테스트/소개) 배치
  - item tile ratio: 블로그 포스트 썸네일 카드의 가로:세로 비율
  - tile density and spacing: 카드 간 gap, 카드 내부 padding
  - desktop 3-column structure: desktop에서 3열 그리드 레이아웃
- **documentary-only drift** (pass로 처리):
  - exact blog title text (각 포스트 제목 문자열)
  - exact summary copy (포스트 요약/설명 텍스트)
  - exact thumbnail artwork (썸네일 이미지 내용물)
  - per-post content semantics (날짜, 카테고리 레이블 등 메타데이터)

---

### folder/mobile-blog

- **url**: https://seojaewan.com/blog
- **capture date**: 2026-04-17
- **viewport**: 390x794
- **provenance**: external-source evidence (live seojaewan.com)
- **file**: `folder-mobile-blog.png`
- **blocking focus**:
  - thinner chrome: window chrome 두께, titlebar height, titlebar button 위치
  - mobile sidebar collapse policy: mobile viewport에서 sidebar 미표시, back/forward + breadcrumb만 노출되는 compact chrome 구조
  - mobile 2-column structure: mobile에서 2열 그리드 레이아웃
  - tile density and spacing: 카드 간 gap, 카드 내부 padding
  - item tile ratio: 블로그 포스트 썸네일 카드의 가로:세로 비율
- **documentary-only drift** (pass로 처리):
  - exact blog title text (각 포스트 제목 문자열)
  - exact summary copy (포스트 요약/설명 텍스트)
  - exact thumbnail artwork (썸네일 이미지 내용물)
  - per-post content semantics (날짜, 카테고리 레이블 등 메타데이터)

---

### browser/desktop-article

- **url**: https://seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0
- **capture date**: 2026-04-17
- **viewport**: 1280x750
- **provenance**: external-source evidence (live seojaewan.com)
- **file**: `browser-desktop-article.png`
- **blocking focus** (shell/chrome only):
  - thinner chrome: window chrome 두께, titlebar height, titlebar button 위치
  - titlebar height: tab bar + title text 포함한 전체 titlebar 높이
  - nav/address geometry: back/forward 버튼 + address bar(URL 표시 영역)의 높이·패딩·레이아웃
  - shell-to-body boundary offset: chrome 하단 경계와 본문 콘텐츠 시작점 사이의 offset
- **documentary-only drift** (pass로 처리):
  - article hero asset (커버 이미지 내용물)
  - body typography (본문 폰트 크기, 행간, 폰트 패밀리)
  - body copy (본문 텍스트 내용)
  - article padding and layout inside `children` (본문 영역 내부 레이아웃)

---

### browser/mobile-article

- **url**: https://seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0
- **capture date**: 2026-04-17
- **viewport**: 390x794
- **provenance**: external-source evidence (live seojaewan.com)
- **file**: `browser-mobile-article.png`
- **blocking focus** (shell/chrome only):
  - thinner chrome: window chrome 두께, titlebar height, titlebar button 위치
  - titlebar height: tab bar + title text 포함한 전체 titlebar 높이
  - nav/address geometry: back/forward 버튼 + address bar compact 레이아웃의 높이·패딩
  - shell-to-body boundary offset: chrome 하단 경계와 본문 콘텐츠 시작점 사이의 offset
  - responsive shell spacing: mobile에서 shell chrome padding·gap의 responsive 변화
- **documentary-only drift** (pass로 처리):
  - article hero asset (커버 이미지 내용물)
  - body typography (본문 폰트 크기, 행간, 폰트 패밀리)
  - body copy (본문 텍스트 내용)
  - article padding and layout inside `children` (본문 영역 내부 레이아웃)

---

## Negative Scope

다음 항목은 이번 task의 acceptance inventory에 포함하지 않는다.

- `browser/desktop-not-found`, `browser/mobile-not-found`: missing-slug 처리는 core Browser acceptance inventory 외부.
- taskbar 및 desktop background: window-area acceptance 판정 범위 밖.
- exact sample-content parity: 실제 포스트 제목·썸네일·본문 내용 일치 여부는 compare scope 밖.
- separate live variant components: 독립 live variant 컴포넌트는 이번 compare에서 제외.
- old plan baseline capture: 이전 plan(windows-ui-folder-browser-live-contract-lock, windows-ui-folder-browser-live-fidelity-repair) 의 baseline capture는 이번 task provenance로 승격하지 않는다.
- canonical state count: 정확히 4개. 추가 state 삽입 금지.
