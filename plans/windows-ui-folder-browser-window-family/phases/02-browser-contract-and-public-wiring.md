# Phase 2. Browser 계약과 공개 wiring 정리

> 이 문서는 shared `WindowFrame` 위에 `Browser`를 올리고, `Folder` / `Browser`를 root entry에 연결하는 실행용 상세 계약이다.
> 이 phase가 끝나면 consumer는 두 public component를 같은 server-safe entry에서 가져오되, article/404 의미를 `children`에서만 닫는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | `Browser` public contract와 `Folder` / `Browser` root export wiring을 같은 phase에서 닫는다. |
| 선행조건 | Phase 1의 internal `WindowFrame` contract와 `Folder` canonical contract가 stable해야 한다. |
| 완료 판단 | `packages/ui/src/index.ts`와 `Browser` stories만 읽어도 `Browser`가 route-agnostic `children` surface이며 `WindowFrame`는 internal-only라는 점이 분명하다. |
| 중단 조건 | article/404를 public prop, `variant`, route key, public frame override로 다시 열어야 한다는 새 요구가 생기면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/browser/index.tsx` | 추가 | `Browser` v1 body owner는 `children` 하나이고 sidebar나 variant surface를 public API로 열지 않는다. | fixed chrome, mobile chrome 유지, content-only scroll이 component source에 고정된다. |
| `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 추가 | canonical state는 `desktop-article`, `desktop-not-found`, `mobile-article`, `mobile-not-found` 네 가지로 시작하고, child fragments가 상태 의미를 소유한다. | article/not-found child composition source가 story/compare owner용으로 한 곳에 정리된다. |
| `packages/ui/src/components/windows/browser/browser.stories.tsx` | 추가 | route 이름, slug, 404 semantics는 story fixture에서만 의미를 갖고 public prop으로 다시 열지 않는다. | `Browser` standalone story가 canonical 4 state를 `children` composition으로 보여 준다. |
| `packages/ui/src/index.ts` | 추가 | server-safe root entry에는 `Folder`, `Browser`만 추가하고 internal helpers를 노출하지 않는다. | root entry에서 두 public component가 stable import path를 가진다. |

### 완료 증거

- `Browser` stories가 article/not-found desktop/mobile 네 state를 `children` composition만으로 렌더링한다.
- root entry가 `Folder` / `Browser`를 export하면서 `WindowFrame`나 storybook helper를 노출하지 않는다.
- `Browser` source에 route props, `variant`, public sidebar API가 없다.

- owner_agent: `frontend-developer`
- 목적:
  - shared frame contract를 두 번째 leaf에 접고, public export naming을 singular surface로 고정한다.
- boundary:
  - primary write target: `packages/ui/src/components/windows/browser/index.tsx`
  - primary write target: `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx`
  - primary write target: `packages/ui/src/components/windows/browser/browser.stories.tsx`
  - primary write target: `packages/ui/src/index.ts`
  - read-only prerequisite: `packages/ui/src/components/windows/internal/windowFrame/index.tsx`
- input:
  - 시나리오: consumer가 browser-style window를 server-safe entry에서 import해 article content나 404 content를 slot child로 전달하는 경우
  - required public inputs:
    - `title`
    - `addressLabel`
    - `children`
  - optional public inputs:
    - `icon`
    - native `div` pass-through (`className` 포함)
  - expected responsive behavior:
    - desktop/mobile 모두 chrome은 유지된다.
    - viewport height 안에서 content 영역만 스크롤된다.
- output:
  - 공개 계약:
    - `Browser`는 fixed chrome + `children` slot body를 가진 public component다.
    - article/not-found 차이는 story fixture 또는 consumer child content가 소유한다.
    - `Folder`와 `Browser`는 package root entry에서 import 가능하다.
  - 내부 기본값:
    - shared `WindowFrame`는 `Browser`에서도 같은 title/icon/addressLabel/window control contract를 쓴다.
    - not-found copy, article layout, hero image 여부는 child composition이 결정한다.
  - 중요한 negative output:
    - `WindowFrame`는 public export가 아니다.
    - `Browser`는 `variant`, route slug, 404 boolean, window-control visibility props를 public surface에 넣지 않는다.
    - `Browser`는 sidebar나 Folder-specific item schema를 받지 않는다.
- 제약:
  - `packages/ui/src/index.ts`는 server-safe entrypoint 계약을 유지해야 한다.
  - public export validation은 exact export inventory freeze가 아니라 canonical naming과 internal leak 방지에 초점을 둔다.
- side effects:
  - `@windows/ui` root import surface가 `Folder`, `Browser`까지 확장된다.
  - Phase 3에서 compare kind/state inventory를 둘 다 같은 topology에 태울 수 있다.
- failure/validation: `Browser`가 route-specific prop, `variant`, public frame composition slot, 404-only special API에 의존하면 blocker다.
- 작업:
  - `Browser` component를 shared frame 위에 구현한다.
  - canonical article/not-found child fixture를 준비한다.
  - standalone stories로 route-agnostic slot contract를 드러낸다.
  - root entry export를 추가한다.
- 검증:
  - [ ] `pnpm --filter @windows/ui build-storybook`가 `Browser` stories를 포함해 성공해야 한다.
  - [ ] `packages/ui/src/index.ts`에 `Folder`, `Browser`만 추가되고 `WindowFrame`는 노출되지 않아야 한다.
  - [ ] `Browser` stories가 article/not-found desktop/mobile 네 state를 모두 보여 줘야 한다.
