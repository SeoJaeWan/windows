# 컴포넌트 설계 원칙

## Leaf 컴포넌트

`ContextPanel`처럼 순수 렌더링만 담당하는 leaf 컴포넌트는 다음을 소유하지 않는다.

- positioning (absolute/fixed 위치 계산)
- open/close 오케스트레이션
- provider / store
- click-away 감지
- keyboard 핸들링

이런 책임은 항상 호스트(parent)가 담당한다. leaf는 `items`와 `onAction`만 받는다.

## 비활성화(disabled) 처리

`pointer-events-none`은 클릭을 부모로 통과시키므로 사용 금지.
`disabled` HTML 속성 + `onClick` 가드 + `cursor-not-allowed`로 처리한다.
