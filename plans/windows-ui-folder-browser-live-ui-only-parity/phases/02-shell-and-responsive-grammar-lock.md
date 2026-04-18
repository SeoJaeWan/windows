# Phase 2. 셸과 반응형 문법 고정

> 이 문서는 `WindowFrame`, `Folder`, `Browser`의 기본 closed-state 셸 구조와 반응형 문법을 라이브 방향으로 다시 맞추는 실행용 상세 계약이다.
> public state surface를 새로 열기 전에 chrome, toolbar, sidebar policy, body density를 먼저 고정한다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | default closed state 기준의 titlebar/tab/toolbar/layout 구조를 라이브 셸 문법으로 정렬한다. |
| 선행조건 | Phase 1에서 live compare state 6개와 blocking focus가 고정돼 있어야 한다. |
| 완료 판단 | `packages/ui/src/components/windows/**`만 읽어도 desktop/mobile 기본 셸 구조와 responsive grammar를 설명할 수 있다. |
| 중단 조건 | 기본 셸 parity를 맞추려면 `interactive/windows/*`로 boundary를 옮기거나 runtime behavior surface를 먼저 열어야 한다면 blocker다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/index.tsx` | 조정 | `WindowFrame`는 internal-only foundation이다. titlebar/tab treatment, nav/address shell geometry, body boundary만 소유한다. | 라이브 방향의 얇은 chrome과 stable body boundary가 같은 파일 안에 고정된다. |
| `packages/ui/src/components/windows/folder/index.tsx` | 조정 | 기본 closed state에서 desktop toolbar는 `nav + address input + search trigger`, mobile toolbar는 single address area를 따라야 한다. | desktop과 mobile의 toolbar grammar, sidebar visibility, item density가 라이브 방향으로 바뀐다. |
| `packages/ui/src/components/windows/browser/index.tsx` | 조정 | 기본 closed state에서 toolbar는 `nav + address input`만 소유하고 body는 계속 `children` boundary로 남긴다. | Browser shell과 body boundary가 runtime behavior 없이도 라이브 방향으로 읽힌다. |

### 완료 증거

- `WindowFrame`가 titlebar/tab/address 영역을 라이브처럼 더 얇고 단순한 셸로 소유한다.
- `Folder` 기본 desktop closed state가 sidebar + content + search trigger를 갖고, mobile은 sidebar/search trigger를 제거한 단일 address area를 보여 준다.
- `Browser` 기본 desktop/mobile closed state가 `nav + address input` 구조와 `children` body boundary를 유지한다.
- phase 종료 시점에는 아직 public open-state prop 없이도 closed-state parity를 설명할 수 있다.

## 실행 계약

- owner_agent: `frontend-developer`
- 목적:
  - live UI-only parity의 기본 셸 구조를 먼저 닫아 이후 stateful surface 작업이 chrome 문제와 섞이지 않게 만든다.
- 작업 순서:
  1. `WindowFrame`의 titlebar, tab treatment, nav/address geometry, body boundary를 라이브 셸 기준으로 재정렬한다.
  2. `Folder` default closed state를 desktop/mobile 각각 라이브 toolbar grammar와 content density에 맞춘다.
  3. `Browser` default closed state를 `children` body contract를 유지한 채 shell-only parity로 정렬한다.
- boundary: package-owned windows shell source만 움직인다. `WindowFrame` 내부 foundation과 `Folder`/`Browser` leaf source가 write boundary이며 package root export는 read-only anchor다.
- input:
  - 시나리오: maintainer가 windows components의 기본 닫힌 화면을 라이브와 맞추되 아직 stateful search/dropdown contract는 열지 않은 상태
  - exact live closed-state baseline:
    - `folder/desktop-blog`
    - `folder/mobile-blog`
    - `browser/desktop-article`
    - `browser/mobile-article`
  - shell direction:
    - thinner chrome
    - live titlebar/tab treatment
    - corrected toolbar geometry
    - corrected sidebar metric and content density
- output:
  - 공개 계약:
    - `WindowFrame`는 internal-only shared shell로서 titlebar/tab/address/body boundary를 소유한다.
    - `Folder` default desktop closed state는 `nav + address input + search trigger` chrome을 가진다.
    - `Folder` mobile closed state는 sidebar와 별도 search trigger를 제거하고 단일 address area만 남긴다.
    - `Browser` default closed state는 `nav + address input` shell과 `children` body boundary를 가진다.
  - 내부 기본값:
    - this phase는 stateful panel open/close logic를 public surface로 열지 않는다.
    - search trigger와 address area는 다음 phase의 internal-open affordance를 수용할 수 있는 closed-state recipient만 만든다.
  - 허용하지 않는 대안:
    - `WindowFrame`를 package root export로 올리지 않는다.
    - `Folder`/`Browser`의 runtime behavior surface를 이 phase에서 먼저 열지 않는다.
    - `interactive/windows/*`에 구현 책임을 옮기지 않는다.
- 선행조건:
  - Phase 1 baseline inventory가 live closed-state focus를 고정해야 한다.
- 제약:
  - `packages/ui/src/index.ts`의 public export identity는 `Folder`, `Browser`만 유지한다.
  - actual navigation, file opening, window movement semantics는 추가하지 않는다.
  - mobile Folder는 search chips가 있더라도 separate trigger UI를 만들지 않는다.
- side effects:
  - Phase 3가 stateful affordance만 추가해도 compare closed state가 흔들리지 않는다.
  - Storybook default state가 live shell geometry를 공유할 준비가 된다.
- failure/validation:
  - 기본 셸 parity를 맞추기 위해 `Browser` body를 package-owned article layout으로 승격해야 한다면 blocker다.
  - mobile Folder에 desktop sidebar나 desktop search trigger를 남겨야 한다면 blocker다.
  - `WindowFrame` shell 변경이 package root export 또는 outside boundary 이동을 요구하면 blocker다.
- 검증:
  - [ ] `pnpm --filter @windows/ui build-storybook`가 성공한다.
  - [ ] `packages/ui/src/index.ts`는 계속 `Folder`, `Browser`만 export하고 `WindowFrame`는 export하지 않는다.
  - [ ] `Folder`와 `Browser` source를 읽으면 live closed-state shell grammar와 mobile Folder absence rule을 설명할 수 있다.
