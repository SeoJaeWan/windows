# Phase 3. Window 패밀리 라이브 피델리티 복구

> 이 문서는 `Folder` / `Browser` source tree 자체를 라이브 사이트 문법에 더 가깝게 되돌리는 실행용 상세 계약이다.
> shared shell, leaf contract, story fixtures, compare inventory를 함께 닫아야 later compare와 materialize가 같은 기준을 쓴다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | `WindowFrame`, `Folder`, `Browser`, windows storybook fixture/stories/test가 함께 live-like shell과 canonical 4-state compare inventory를 갖는다. |
| 선행조건 | Phase 2에서 exact Folder/Browser story title과 compare recipient가 먼저 고정돼 있어야 한다. |
| 완료 판단 | placeholder file icon grid와 Windows 11 chrome이 source tree에서 빠지고, canonical 4-state compare inventory와 deferred not-found stance가 source와 stories/test에 함께 드러난다. |
| 중단 조건 | live fidelity를 회복하려면 `Browser`에 404 전용 public API를 추가해야 하거나, `Folder` contract를 둘 이상의 competing public surface로 열어야 한다면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/index.tsx` | 재구성 | `WindowFrame`는 internal-only다. outer frame, responsive height, shared slot boundary만 책임지고 leaf-specific chrome을 public API로 새지 않는다. | Windows 11 control button reinterpretation이 shared default로 남지 않는다. |
| `packages/ui/src/components/windows/folder/index.tsx` | 교체 | `Folder` custom props는 `title`, `icon?`, `addressLabel`, `navigationItems`, `activeNavigationId?`, `items`다. `navigationItems` minimum shape는 `{ id, label, iconSrc }`, `activeNavigationId` winner rule은 match 우선, 없으면 첫 item fallback이다. `items` minimum shape는 `{ id, title, summary, dateLabel, coverSrc, tagLabel }`다. | live-like folder-tab navigation과 blog-card grid가 이 contract로 렌더링되고 placeholder file tile이 사라진다. |
| `packages/ui/src/components/windows/browser/index.tsx` | 조정 | `Browser` public props는 계속 `title`, `icon?`, `addressLabel`, `children`만 가진다. article/not-found 차이는 `children`이 소유하고 component는 404 전용 public prop를 열지 않는다. | live-like browser chrome/article host가 `children` slot 그대로 렌더링된다. |
| `packages/ui/src/components/windows/storybook/assets/` | 추가 | live blog/article cover는 repo-local asset으로 pinning해 story/compare가 external runtime image drift 없이 같은 이미지 소스를 쓴다. | `Folder`/`Browser` fixture가 공통으로 쓰는 cover asset이 source tree에 존재한다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.ts` | 교체 | canonical folder fixture state는 `desktop-blog`, `mobile-blog` 두 개다. navigation item과 card item은 live blog metadata를 닮은 field만 가진다. | `Folder` fixture가 cover/title/summary/date/tag를 갖고 support-only file icon fixture가 남지 않는다. |
| `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 교체 | canonical browser fixture state는 `desktop-article`, `mobile-article` 두 개다. not-found example이 남더라도 support-only/deferred로 표기하고 compare inventory에 넣지 않는다. | live article cover/meta/body가 fixture에 드러나고 `browser/*-not-found`는 canonical state가 아니다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx`, `packages/ui/src/components/windows/browser/browser.stories.tsx` | 교체 | story title은 Phase 2 output과 같아야 한다. compare export는 exact 4-state inventory만 canonical compare story로 남긴다. | `Windows/Folder`와 `Windows/Browser` 아래에서 human-review story와 compare story가 같은 state naming을 쓴다. |
| `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx`, `packages/ui/src/components/windows/storybook/compareWindowStage.tsx` | 정리 | human-review host는 Windows 11 방향을 강화하는 배경/장식을 줄이고, compare host는 Phase 1 baseline crop geometry에 맞는 fixed canvas를 유지한다. | review stage와 compare stage 모두 live fidelity review를 방해하지 않는 host 역할만 남는다. |
| `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx` | 교체 | exact compare inventory는 `folder/desktop-blog`, `folder/mobile-blog`, `browser/desktop-article`, `browser/mobile-article` 네 key다. | test가 exact one `[data-visual-root]`와 exact `kind/state` pair를 네 case에 대해서만 검증한다. |

### 완료 증거

- `Folder` source가 placeholder file-system icon tile 대신 cover/title/summary/date/tag card grid를 렌더링한다.
- `Browser` source가 `children` contract 그대로 live-like article shell을 렌더링한다.
- `windowCompareInventory.test.tsx`가 canonical 4-state inventory만 owner signal로 검증한다.

- owner_agent: `frontend-developer`
- 목적:
  - 라이브 사이트와의 큰 시각 차이를 source tree 수준에서 줄이고, later compare가 읽을 package-owned visual contract를 만든다.
- boundary:
  - primary write target: `packages/ui/src/components/windows/internal/windowFrame/index.tsx`
  - primary write target: `packages/ui/src/components/windows/folder/index.tsx`
  - primary write target: `packages/ui/src/components/windows/browser/index.tsx`
  - primary write target: `packages/ui/src/components/windows/storybook/assets/`
  - primary write target: `packages/ui/src/components/windows/storybook/folderReferenceFixtures.ts`
  - primary write target: `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx`
  - primary write target: `packages/ui/src/components/windows/folder/folder.stories.tsx`
  - primary write target: `packages/ui/src/components/windows/browser/browser.stories.tsx`
  - primary write target: `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx`
  - primary write target: `packages/ui/src/components/windows/storybook/compareWindowStage.tsx`
  - primary write target: `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx`
  - read-only prerequisite: `plans/windows-ui-folder-browser-live-fidelity-repair/reference-captures/baseline-inventory.md`
  - read-only prerequisite: `plans/windows-ui-folder-browser-live-fidelity-repair/reference-captures/missing-slug-observation.md`
- input:
  - 시나리오: maintainer가 refreshed baseline을 기준으로 `Folder` / `Browser` source tree를 live-like shell과 content grammar로 다시 맞추려는 경우
  - live blog metadata signal:
    - `/blog`는 cover image, title, summary, date, tag를 가진 entry grid를 제공한다.
    - article route는 cover image, title, summary, tag, 본문 paragraph를 가진 상세 화면을 제공한다.
  - taxonomy prerequisite:
    - canonical compare story recipient는 `windows-folder--compare-desktop-blog`, `windows-folder--compare-mobile-blog`, `windows-browser--compare-desktop-article`, `windows-browser--compare-mobile-article`다.
- output:
  - 공개 계약:
    - `Folder`는 `title`, `icon?`, `addressLabel`, `navigationItems`, `activeNavigationId?`, `items`만 연다.
    - `Folder.navigationItems` winner rule은 `activeNavigationId` match 우선, 없으면 첫 item fallback이다.
    - `Folder.items`는 cover/title/summary/date/tag card grid를 렌더링하는 minimum shape를 가진다.
    - `Browser`는 `title`, `icon?`, `addressLabel`, `children`만 연다.
    - `Browser`는 not-found 전용 prop, `variant`, slug prop, route-aware prop를 열지 않는다.
    - canonical compare inventory는 `folder/desktop-blog`, `folder/mobile-blog`, `browser/desktop-article`, `browser/mobile-article` 네 state뿐이다.
  - 내부 기본값:
    - `WindowFrame`는 internal-only shared shell로 남고 leaf-specific chrome markup는 `Folder`와 `Browser`가 각자 소유한다.
    - support-only not-found example이 stories/fixtures에 남더라도 compare inventory와 inventory test에서는 제외한다.
  - 중요한 negative output:
    - placeholder file-system icon grid를 live-like fallback으로 인정하지 않는다.
    - Windows 11 minimize/maximize/close button chrome을 final live fidelity shell로 남기지 않는다.
    - `Browser` public API에 404 전용 prop를 추가하지 않는다.
- 선행조건:
  - Phase 2가 exact Folder/Browser story recipient를 고정했어야 한다.
- 제약:
  - canonical compare inventory는 phase 안에서 다시 6-state로 넓어지면 안 된다.
  - external runtime image URL을 fixture의 유일한 source로 남기지 않는다. compare 안정성을 위해 repo-local asset이 필요하다.
- side effects:
  - later compare phase가 story title과 story export를 그대로 capture script에 사용할 수 있다.
  - `Folder` public contract가 current sidebar/file tile shape에서 live-card shape로 바뀌므로 future materialize가 새로운 prop boundary를 따라야 한다.
- failure/validation:
  - `Folder`를 data-driven card grid와 placeholder tile grid 두 public contract로 동시에 남기면 canonical surface singularity가 깨지므로 blocker다.
  - `Browser` fidelity를 맞추려면 `children` 외 public prop가 꼭 필요하다는 결론이 나오면 user-confirmed scope를 벗어나므로 blocker다.
  - not-found example을 canonical compare inventory에 다시 넣으면 deferred boundary가 깨지므로 blocker다.
- 작업:
  - internal shared shell을 live fidelity 방향에 맞게 축소/재정리한다.
  - `Folder` contract와 markup을 folder-tab navigation + blog-card grid 방향으로 교체한다.
  - `Browser`는 `children` contract를 유지한 채 live article shell을 갖도록 chrome/article host를 조정한다.
  - storybook assets, fixtures, stories, stages를 새 contract와 새 inventory에 맞게 정리한다.
  - compare inventory test를 canonical 4-state만 검증하도록 바꾼다.
- 검증:
  - [ ] `pnpm --filter @windows/ui exec vitest run src/components/windows/storybook/windowCompareInventory.test.tsx`가 성공한다.
  - [ ] `pnpm --filter @windows/ui build-storybook`가 성공한다.
  - [ ] `rg -n 'desktop-not-found|mobile-not-found' packages/ui/src/components/windows` 결과가 canonical compare export나 inventory test가 아니라 support-only note/legacy cleanup 대상만 가리킨다.
  - [ ] `packages/ui/src/components/windows/folder/index.tsx`와 `browser/index.tsx`를 열었을 때 `Folder`/`Browser` public contract가 output section과 같은 이름으로 드러난다.
