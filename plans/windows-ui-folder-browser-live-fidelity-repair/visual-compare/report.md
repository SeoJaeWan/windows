# Phase 4 Visual Compare Report

## Canonical 4-state Inventory

| kind/state | baseline provenance | current provenance | size match | diff result | verdict |
|---|---|---|---|---|---|
| folder/desktop-blog | external-source evidence (https://seojaewan.com/blog, 1280x750) | package-local current (Windows/Folder CompareDesktopBlog, worktree Storybook) | yes (1280x750) | 19.80% mismatch (190118/960000 px) | MISMATCH |
| folder/mobile-blog | external-source evidence (https://seojaewan.com/blog, 390x794) | package-local current (Windows/Folder CompareMobileBlog, worktree Storybook) | yes (390x794) | 23.71% mismatch (73413/309660 px) | MISMATCH |
| browser/desktop-article | external-source evidence (https://www.seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0, 1280x750) | package-local current (Windows/Browser CompareDesktopArticle, worktree Storybook) | yes (1280x750) | 11.00% mismatch (105573/960000 px) | MISMATCH |
| browser/mobile-article | external-source evidence (https://www.seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0, 390x794) | package-local current (Windows/Browser CompareMobileArticle, worktree Storybook) | yes (390x794) | 17.70% mismatch (54798/309660 px) | MISMATCH |

pixelmatch threshold: 0.2

## Deferred / Out-of-inventory

- `browser/desktop-not-found`, `browser/mobile-not-found`: deferred -- missing-slug handling은 core Browser acceptance inventory에 포함되지 않는다. (Phase 1 missing-slug-observation.md 참조)

## Mismatch Details

### folder/desktop-blog -- 19.80% mismatch

diff artifact: visual-compare/folder-desktop-blog-diff.png

- Layout structure: baseline은 Windows Explorer 스타일 3열 그리드 (섬네일 카드, 제목만 표시). current는 날짜/카테고리/제목/설명 포함하는 list-card 레이아웃.
- Sidebar: baseline은 왼쪽에 tree navigation (블로그/프로젝트/코딩테스트/소개). current는 수평 필터 탭 (전체/개발/최고).
- Card height: baseline 카드는 섬네일+제목 compact. current 카드는 섬네일+메타+설명으로 높이가 더 큼.
- Titlebar: baseline은 아이콘+텍스트 조합, Explorer chrome. current는 텍스트 전용, favicon 없음.
- Diff concentration: 그리드 섬네일 전 영역, 사이드바 영역, 우측 경계선(스크롤바 위치 차이).

### folder/mobile-blog -- 23.71% mismatch

diff artifact: visual-compare/folder-mobile-blog-diff.png

- Grid columns: baseline은 2열 그리드 (섬네일+제목). current는 단일 컬럼 full-width 카드 (섬네일+날짜+제목+설명).
- Card layout: 섬네일 비율 및 하단 텍스트 영역 높이 차이. baseline 카드는 섬네일-heavy, current는 텍스트 영역이 더 큼.
- Filter tabs: baseline에는 탭 row 없음. current는 수평 탭 row (전체/개발/최고) 상시 표시.
- Titlebar: baseline은 모바일 Explorer chrome (X 버튼, 폴더 아이콘). current는 유사하나 색상/폰트 차이.

### browser/desktop-article -- 11.00% mismatch

diff artifact: visual-compare/browser-desktop-article-diff.png

- Heading size: baseline 헤딩 "2025를 보내며"의 폰트 크기/여백이 current보다 큼. diff에서 헤딩 텍스트 영역이 붉게 표시.
- Content width: baseline 본문 영역이 current보다 좁음 (좌우 margin 더 큼). diff에서 좌측 여백 차이 확인.
- Titlebar chrome: baseline은 얇은 tab+URL bar. current는 URL bar padding 차이.
- Diff concentration: 헤딩 텍스트, 본문 첫 단락, 타이틀바 chrome 영역.

### browser/mobile-article -- 17.70% mismatch

diff artifact: visual-compare/browser-mobile-article-diff.png

- Heading size: baseline 헤딩은 더 작음 (text-2xl 수준). current 헤딩은 더 큼 (text-3xl 수준). diff에서 헤딩 글자 영역 전체가 붉게 표시.
- Body font: 본문 텍스트 크기/행간/폰트 패밀리 차이. 각 줄 단어 경계 어긋남.
- Cover image ratio: baseline 커버 이미지가 현재보다 높이가 큼.
- Scrollbar: baseline에서 오른쪽 scrollbar visible. current에는 없음.
- Diff concentration: 타이틀바, 헤딩, 본문 전 영역에서 광범위한 차이.

---

## Phase 5 Final Compare

| kind/state | Phase 4 mismatch | Phase 5 mismatch | verdict |
|---|---|---|---|
| folder/desktop-blog | 19.80% | N/A (re-capture blocked) | EXPLICIT BLOCKER |
| folder/mobile-blog | 23.71% | N/A (re-capture blocked) | EXPLICIT BLOCKER |
| browser/desktop-article | 11.00% | N/A (re-capture blocked) | EXPLICIT BLOCKER |
| browser/mobile-article | 17.70% | N/A (re-capture blocked) | EXPLICIT BLOCKER |

> Re-capture는 Phase 5 에이전트가 담당했으나, Phase 3 live-card contract를 되돌린 채 캡처했으므로 그 수치는 Phase 3 계약 기준으로 유효하지 않다. Phase 3 contract를 복원한 이후 신규 캡처가 필요하나 Storybook 서버 구동 및 screenshot 도구가 이 에이전트 실행 범위 밖에 있어 수치를 기재하지 않는다.

## Explicit Blockers

### folder/*: Phase 3 contract vs live baseline structural divergence

**상태: STRUCTURAL BLOCKER — Phase 3 public contract 재계획 필요**

- Phase 4 baseline(live site `seojaewan.com`)은 Windows Explorer 스타일 레이아웃이다: 좌측 tree navigation sidebar + 우측 3열 섬네일 그리드(썸네일+제목 compact).
- Phase 3 live-card contract는 blog metadata 카드 surface다: 상단 tab navigation + 카드 그리드(coverSrc/title/summary/dateLabel/tagLabel 전부 표시).
- 두 surface는 동일한 canonical 4-state key(`folder/desktop-blog`, `folder/mobile-blog`)를 공유하지만 레이아웃 방향이 근본적으로 다르다.
- Phase 3 contract를 바꾸지 않는 한 folder/* mismatch는 구조적으로 0%에 도달할 수 없다.
- Phase 5 에이전트가 live baseline에 맞추려고 Phase 3 contract를 Explorer style로 덮어썼으나, 이는 contract 재계획 없이 layout만 바꾼 것이어서 되돌린다.
- **해결 경로**: Phase 3 public contract(`FolderProps`, `FolderNavigationItem`, `FolderItem`)를 Explorer style에 맞게 재계획하거나, live baseline을 Phase 3 blog-card surface로 교체하는 결정이 선행되어야 한다. 이 결정은 Phase 5 범위를 벗어난다.

### browser/*: rendering environment diff

**상태: ENVIRONMENT MISMATCH — production vs local Storybook 폰트/레이아웃 차이**

- browser/desktop-article(11.00%)과 browser/mobile-article(17.70%) mismatch는 주로 폰트 렌더링 환경 차이에서 발생한다: production Next.js(Vercel CDN 폰트)와 local Storybook(system fallback 폰트) 간 글리프 크기·행간 차이.
- Phase 5 에이전트가 헤딩 크기와 여백 drift를 조정했으나 Phase 3 contract를 되돌린 채 캡처했으므로 그 조정의 순효과를 독립적으로 측정하지 못했다.
- 폰트 환경이 정렬되지 않는 한 browser/* mismatch는 환경 차이 floor 이하로 내려가지 않는다.
- **해결 경로**: local Storybook에서 production과 동일한 폰트 패밀리·CDN URL을 로드하거나, pixelmatch threshold를 폰트 렌더링 차이 범위에 맞게 상향하는 결정이 필요하다.
