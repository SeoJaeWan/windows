# Windows UI 작업 표시줄 공통 기반 기준 캡처

> 이 문서는 공통 기반과 하단 바 shell을 고정하는 기준 이미지만 묶는다.
> 세부 panel 상태는 각 downstream plan의 capture 문서를 본다.

## 기준 캡처 세트

- `seojaewan-home-taskbar.png`
  - 홈 하단 바 기본 상태
- `taskbar-icon-status-default-playwright.png`
  - 2026-04-10에 Playwright로 다시 캡처한 기본 상태
  - 어떤 앱 아이콘도 활성/숨김 상태선이 없는 기본 taskbar icon row
- `taskbar-icon-status-active-playwright.png`
  - 2026-04-10에 Playwright로 다시 캡처한 활성 상태
  - blog 창이 foreground에 있고 해당 아이콘 아래 상태선이 더 길고 진하게 보이는 상태
- `taskbar-icon-status-hide-playwright.png`
  - 2026-04-10에 Playwright로 다시 캡처한 숨김 상태
  - blog 창의 `-` 버튼을 눌러 창을 내린 뒤 해당 아이콘 아래 상태선이 더 짧고 약하게 남는 상태

## 비고

- 이 plan은 전체 시각 인상과 rail density를 잡는 역할이다.
- `TaskbarIconButton` 상태 기준은 `default | active | hide`로 본다.
- `active`와 `hide`는 `https://seojaewan.com`을 Playwright로 열어 blog 창을 foreground로 만든 뒤, 제목바 `-` 버튼 클릭 전/후를 잘라 캡처한 이미지다.
- Windows/Search/hover/context 세부 상태는 각 plan 폴더의 `reference-captures.md`에서 따로 본다.
