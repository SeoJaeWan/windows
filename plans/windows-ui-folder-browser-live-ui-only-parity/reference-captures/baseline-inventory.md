# Baseline Inventory — windows-ui-folder-browser-live-ui-only-parity

capture date: 2026-04-18

## Live Compare State (6개 — canonical diff 대상)

아래 6개 state key가 이번 plan의 live compare inventory다.
Phase 4 compare script와 Phase 5 drift closure는 이 key를 literal하게 사용한다.

---

### folder/desktop-blog

| 항목 | 값 |
| --- | --- |
| state key | `folder/desktop-blog` |
| artifact | `folder-desktop-blog.png` |
| source URL | `https://seojaewan.com/blog` |
| viewport | `1280 × 750` |
| capture date | 2026-04-18 |
| open-state trigger | none — default closed state |
| blocking focus | titlebar chrome (title + window controls), toolbar row (nav controls + address input + search trigger area), sidebar (folder nav tree), entry grid (thumbnail cards) |

**관찰 사실:**
- 2-row header: titlebar (row 1, h=30) + toolbar row (row 2, h=44)
- Titlebar: folder icon + "블로그" title + minimize/maximize/close controls (우측 상단)
- Toolbar row: back/forward nav buttons + address breadcrumb input (좌측 넓은 영역) + search input area (우측 320px, 돋보기 아이콘 포함)
- Left sidebar: folder tree (블로그, 프로젝트, 코딩 테스트, 소개) — `w-44` 고정 너비
- Content area: 3-column thumbnail grid (entries)

---

### folder/desktop-search-open

| 항목 | 값 |
| --- | --- |
| state key | `folder/desktop-search-open` |
| artifact | `folder-desktop-search-open.png` |
| source URL | `https://seojaewan.com/blog` |
| viewport | `1280 × 750` |
| capture date | 2026-04-18 |
| open-state trigger | toolbar 우측 search area 클릭 → chip/tag panel 노출 |
| blocking focus | chip/tag surface의 위치와 레이아웃 (toolbar 우측 아래 드롭다운), chip 개수와 레이블 (Server, 성능, 회고, 바라우저, 이론, React, Tailwind CSS, Next.js, JavaScript, 타입) |

**관찰 사실:**
- Search area 클릭 시 toolbar 우측 상단에 chip/tag panel이 overlay로 나타남
- Chip 목록 (2026-04-18 라이브 기준): Server, 성능, 회고, 바라우저, 이론, React, Tailwind CSS, Next.js, JavaScript, 타입
- Chip panel은 toolbar 안 search input 바로 아래 드롭다운 형태로 출현
- Entry grid 및 sidebar는 그대로 유지됨 (chip panel이 overlay, body swap 없음)
- 내부 open state — public prop으로 제어되지 않음. compare/review story는 story-local harness로 재현

---

### folder/mobile-blog

| 항목 | 값 |
| --- | --- |
| state key | `folder/mobile-blog` |
| artifact | `folder-mobile-blog.png` |
| source URL | `https://seojaewan.com/blog` |
| viewport | `390 × 794` |
| capture date | 2026-04-18 |
| open-state trigger | none — default closed state |
| blocking focus | mobile 축약 규칙 확인: sidebar 없음, 별도 search trigger 없음, single address area만 표시 |

**관찰 사실:**
- Sidebar 완전 부재 — mobile에서 좌측 folder tree 없음
- Toolbar는 back/forward nav + 단일 address bar만 표시 (search trigger 별도 없음)
- Entry grid: 2-column layout
- 하단 taskbar: folder icon 4개 (빠른 접근)

**mobile absence rule (blocking):**
- `folder/mobile-blog`에서 sidebar 및 별도 search trigger가 없어야 한다.
- desktop search affordance를 mobile에 복제하지 않는다.

---

### browser/desktop-article

| 항목 | 값 |
| --- | --- |
| state key | `browser/desktop-article` |
| artifact | `browser-desktop-article.png` |
| source URL | `https://seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0` |
| viewport | `1280 × 750` |
| capture date | 2026-04-18 |
| open-state trigger | none — default closed state |
| blocking focus | titlebar tab (title text + close button), toolbar (nav controls + address input), body/content boundary |

**관찰 사실:**
- Titlebar: 단일 tab ("2025를 보내며") + 우측 minimize/maximize/close controls
- Toolbar: back/forward nav + address bar (전체 너비, 주소 text "2025를 보내며" 표시)
- Body: article 본문 (h1 + 커버 이미지 + 본문 텍스트)
- Sidebar 없음 (folder와 달리 browser는 sidebar 미사용)

---

### browser/desktop-address-open

| 항목 | 값 |
| --- | --- |
| state key | `browser/desktop-address-open` |
| artifact | `browser-desktop-address-open.png` |
| source URL | `https://seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0` |
| viewport | `1280 × 750` |
| capture date | 2026-04-18 |
| open-state trigger | toolbar address bar 클릭 → dropdown-like suggestion panel 노출 |
| blocking focus | address dropdown panel의 위치(toolbar address bar 바로 아래), suggestion item 레이아웃 |

**관찰 사실:**
- Address bar 클릭 시 toolbar 아래에 suggestion dropdown panel이 나타남
- Dropdown item: "2025를 보내며" (현재 URL 기반 suggestion 1개)
- 내부 open state — public prop으로 제어되지 않음. compare/review story는 story-local harness로 재현
- Body content는 그대로 유지됨 (dropdown이 overlay, body swap 없음)

---

### browser/mobile-article

| 항목 | 값 |
| --- | --- |
| state key | `browser/mobile-article` |
| artifact | `browser-mobile-article.png` |
| source URL | `https://seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0` |
| viewport | `390 × 794` |
| capture date | 2026-04-18 |
| open-state trigger | none — default closed state |
| blocking focus | mobile titlebar tab, toolbar (nav + address), body content boundary |

**관찰 사실:**
- Titlebar: 단일 tab ("2025를 보내며") + X close button
- Toolbar: back/forward + address bar (전체 너비)
- Body: article 본문 (h1 + 커버 이미지 + 본문)
- Sidebar 없음 (desktop과 동일 — browser는 항상 sidebar 미사용)

---

## Review-Only Edge State (compare inventory 밖 — synthetic)

아래 상태는 live diff 대상이 아니며 Phase 3 review story + dedicated review inventory test의 대상이다.
이 상태를 canonical compare inventory에 섞지 않는다.

| edge state | 적용 컴포넌트 | 리뷰 목적 | live capture 포함 여부 |
| --- | --- | --- | --- |
| 긴 `title` | `Folder`, `Browser` | titlebar/tab의 text overflow 처리 확인 | 없음 — synthetic |
| 긴 `addressLabel` | `Folder`, `Browser` | address bar의 text overflow 처리 확인 | 없음 — synthetic |
| `Folder`의 no chips | `Folder` | chip surface가 비어 있을 때 UI 안정성 확인 | 없음 — synthetic |
| `Browser`의 empty dropdown items | `Browser` | dropdown이 비어 있을 때 UI 안정성 확인 | 없음 — synthetic |

**negative scope rule:**
- 위 4개 edge state는 Phase 3 `windowReviewInventory.test.tsx`와 dedicated review story로만 검증한다.
- Phase 4 compare script가 이 state key로 diff artifact를 생성하지 않는다.
- Phase 5 drift closure가 이 state를 blocking drift로 취급하지 않는다.

---

## Compare vs Review 경계 요약

| state key | 역할 | phase 4 diff 대상 |
| --- | --- | --- |
| `folder/desktop-blog` | live compare | yes |
| `folder/desktop-search-open` | live compare (desktop open state) | yes |
| `folder/mobile-blog` | live compare | yes |
| `browser/desktop-article` | live compare | yes |
| `browser/desktop-address-open` | live compare (desktop open state) | yes |
| `browser/mobile-article` | live compare | yes |
| 긴 title | review-only edge | no |
| 긴 addressLabel | review-only edge | no |
| no chips | review-only edge | no |
| empty dropdown items | review-only edge | no |

---

## Acceptance boundary

이번 plan의 UI-only compare 범위에서 제외되는 항목:

- taskbar (하단 nav bar)
- desktop 배경 (gradient)
- 실제 본문 copy / article text
- 실제 URL navigation 결과 (링크 클릭 후 이동)
- window resize/drag/minimize/maximize 동작
- 세션/윈도우 매니저 연동
- chip 선택에 따른 entries 내부 filtering
- address bar 입력 후 실제 navigation
