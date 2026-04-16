# 아이콘 정책

`@fluentui/react-icons`만 사용한다. `lucide-react`는 제거됐으며 추가하지 않는다.

- 사이즈는 이름에 내장된 variant를 사용한다: `16Regular` (컨텍스트 메뉴 등 밀도 높은 UI), `20Regular` (일반 UI)
- JSX로 직접 전달한다: `icon: <ArrowRight16Regular />` — 래퍼 함수나 `createElement` 사용 금지
- 아이콘이 `aria-hidden` 컨테이너 안에 있고 텍스트 레이블이 별도로 있으면 `aria-label` 불필요
