**Branch:** {type}/{task-slug}

> Worktree dir: `worktrees/{task-slug}` (plan 폴더명과 동일)

# {작업명} 실행 계획

| # | Phase | Agent |
| --- | --- | --- |
| 1 | `./phases/01-{phase-slug}.md` | `{agent-name}` |
| 2 | `./phases/02-{phase-slug}.md` | `{agent-name}` |
| 3 | `./phases/03-{phase-slug}.md` | `{agent-name}` |

## 요청 대응표

| 사용자 요청 항목 | 이번 계획에서 고정한 범위 | 반영 위치 | 남은 미결정 |
| --- | --- | --- | --- |
| {사용자 표현 그대로} | {이번 plan에서 닫는 구체 범위} | {작업 묶음 / phase / 파일} | {없음 / 남은 질문} |
| {사용자 표현 그대로} | {이번 plan에서 닫는 구체 범위} | {작업 묶음 / phase / 파일} | {없음 / 남은 질문} |

## 작업 묶음 지도

| 작업 묶음 | 관련 파일/영역 | 이번에 바꾸는 것 | 유지되는 것 | 완료 판단 |
| --- | --- | --- | --- | --- |
| `{boundary-name}` | `path/to/file` | {사용자 언어 기반 변경 요약} | {바뀌지 않는 경계} | {읽는 사람이 확인 가능한 상태} |
| `{boundary-name}` | `path/to/file` | {사용자 언어 기반 변경 요약} | {바뀌지 않는 경계} | {읽는 사람이 확인 가능한 상태} |

## 공개 계약 요약

| 대상 | public surface | state ownership | callback / handoff | 금지 / no-op |
| --- | --- | --- | --- | --- |
| `{component-or-hook}` | {props / inputs / outputs} | {controlled / default / internal} | {callback 이름과 의미} | {열지 않는 것 / no-op 규칙} |
| `{component-or-hook}` | {props / inputs / outputs} | {controlled / default / internal} | {callback 이름과 의미} | {열지 않는 것 / no-op 규칙} |

## 상태/연동 규칙

| surface | owner | 규칙 | 검증 포인트 |
| --- | --- | --- | --- |
| `{state-or-surface}` | {internal / controlled / host} | {winner rule / open-close / invalid-no-op} | {story / test / compare} |
| `{state-or-surface}` | {internal / controlled / host} | {winner rule / open-close / invalid-no-op} | {story / test / compare} |

## 제외 항목

| 항목 | 이번 계획 처리 | 이유 | 사용자 승인 상태 |
| --- | --- | --- | --- |
| {제외 항목} | {제외 / 후속 / 별도 slug} | {왜 이번 범위 밖인지} | {승인됨 / 추가 확인 필요} |
| {제외 항목} | {제외 / 후속 / 별도 slug} | {왜 이번 범위 밖인지} | {승인됨 / 추가 확인 필요} |

## 실행 순서

| Phase | 다루는 작업 묶음 | 이번 단계에서 하는 일 | 끝나면 고정되는 상태 | 다음 단계 인계 |
| --- | --- | --- | --- | --- |
| Phase 1. {이름} | `{boundary-name}`, `{boundary-name}` | {이번 단계에서 먼저 고정할 작업} | {이 단계 종료 시 확정되는 상태} | {산출물/조건} |
| Phase 2. {이름} | `{boundary-name}`, `{boundary-name}` | {이번 단계에서 연결/확장할 작업} | {이 단계 종료 시 확정되는 상태} | {산출물/조건} |
| Phase 3. {이름} | `{boundary-name}`, `{boundary-name}` | {이번 단계에서 검증/마감할 작업} | {이 단계 종료 시 확정되는 상태} | {산출물/조건} |

## Phase 실행 카드

### Phase 1. {짧고 쉬운 역할 이름}

| 항목 | 내용 |
| --- | --- |
| 목표 | {이 phase가 끝나면 고정되는 상태} |
| 다루는 작업 묶음 | `{boundary-name}`, `{boundary-name}` |
| 시작 조건 | `none` (선택) |
| 완료 조건 | {컨트롤러가 승인 가능한 상태} |
| 상세 문서 | `./phases/01-{phase-slug}.md` |

### Phase 2. {짧고 쉬운 역할 이름}

| 항목 | 내용 |
| --- | --- |
| 목표 | {이 phase가 끝나면 고정되는 상태} |
| 다루는 작업 묶음 | `{boundary-name}`, `{boundary-name}` |
| 시작 조건 | {선행조건} |
| 완료 조건 | {컨트롤러가 승인 가능한 상태} |
| 상세 문서 | `./phases/02-{phase-slug}.md` |

### Phase 3. {짧고 쉬운 역할 이름}

| 항목 | 내용 |
| --- | --- |
| 목표 | {이 phase가 끝나면 고정되는 상태} |
| 다루는 작업 묶음 | `{boundary-name}`, `{boundary-name}` |
| 시작 조건 | {선행조건} |
| 완료 조건 | {컨트롤러가 승인 가능한 상태} |
| 상세 문서 | `./phases/03-{phase-slug}.md` |

## 승인 체크리스트

- [ ] 요청 대응표에서 사용자 요청 항목이 빠지지 않았다.
- [ ] 작업 묶음 지도를 보면 어떤 컴포넌트/훅/화면이 왜 바뀌는지 바로 보인다.
- [ ] 공개 계약 요약만 읽어도 touched public surface와 callback / ownership이 보인다.
- [ ] 제외 항목이 항목 단위로 드러나 있고 승인 상태가 보인다.
- [ ] 실행 순서와 Phase 실행 카드를 통해 어떤 순서로 무엇을 고정하는지 이해할 수 있다.
