# Phase {n}. {역할 이름}

## Phase 요약

| 항목 | 내용 |
| --- | --- |
| 목표 | {이 phase가 끝나면 무엇이 고정되는지} |
| 다루는 작업 묶음 | `{boundary-name}`, `{boundary-name}` |
| 시작 조건 | `none` (선택) |
| 완료 판단 | {컨트롤러가 승인 가능한 상태} |
| 중단 조건 | {재계획 또는 즉시 중단이 필요한 조건. 없으면 `없음`} |

## 작업 순서

| 순서 | 작업 묶음 | 이번 단계에서 하는 일 | 끝나면 고정되는 것 |
| --- | --- | --- | --- |
| 1 | `{boundary-name}` | {먼저 고정할 변경} | {phase 안의 중간 고정 상태} |
| 2 | `{boundary-name}` | {그다음 연결/정리할 변경} | {phase 안의 중간 고정 상태} |
| 3 | `{boundary-name}` | {마지막 검증/동기화} | {phase 종료 상태} |

## 작업 묶음 A. {boundary-name}

| 항목 | 내용 |
| --- | --- |
| 왜 바꾸는가 | {사용자 언어 기반으로 현재 문제를 적는다} |
| 현재 문제 | {지금 상태에서 무엇이 어긋나는지} |
| 목표 상태 | {이 작업 묶음이 끝나면 무엇이 달라지는지} |
| 유지되는 것 | {이번 phase에서 바꾸지 않는 경계} |

### 관련 파일

| 파일 | 작업 방식 | 완료 조건 |
| --- | --- | --- |
| `path/to/file` | {추가/교체/정리/검증} | {이 파일에서 확인 가능한 종료 상태} |
| `path/to/file` | {추가/교체/정리/검증} | {이 파일에서 확인 가능한 종료 상태} |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | {props / inputs / outputs} |
| state ownership | {controlled / default / internal} |
| callback / handoff | {이름과 호출 의미} |
| no-op / invalid rule | {반드시 고정해야 하는 예외 규칙} |
| 금지하는 대안 | {열지 않는 API / 해석 / 동작} |

### 검증 포인트

| 항목 | 확인 방법 |
| --- | --- |
| {검증하고 싶은 계약} | {test / story / compare / source inspection} |
| {검증하고 싶은 계약} | {test / story / compare / source inspection} |

## 작업 묶음 B. {boundary-name}

| 항목 | 내용 |
| --- | --- |
| 왜 바꾸는가 | {사용자 언어 기반으로 현재 문제를 적는다} |
| 현재 문제 | {지금 상태에서 무엇이 어긋나는지} |
| 목표 상태 | {이 작업 묶음이 끝나면 무엇이 달라지는지} |
| 유지되는 것 | {이번 phase에서 바꾸지 않는 경계} |

### 관련 파일

| 파일 | 작업 방식 | 완료 조건 |
| --- | --- | --- |
| `path/to/file` | {추가/교체/정리/검증} | {이 파일에서 확인 가능한 종료 상태} |
| `path/to/file` | {추가/교체/정리/검증} | {이 파일에서 확인 가능한 종료 상태} |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | {props / inputs / outputs} |
| state ownership | {controlled / default / internal} |
| callback / handoff | {이름과 호출 의미} |
| no-op / invalid rule | {반드시 고정해야 하는 예외 규칙} |
| 금지하는 대안 | {열지 않는 API / 해석 / 동작} |

### 검증 포인트

| 항목 | 확인 방법 |
| --- | --- |
| {검증하고 싶은 계약} | {test / story / compare / source inspection} |
| {검증하고 싶은 계약} | {test / story / compare / source inspection} |

## Phase 검증

| 확인 항목 | 방법 | 기대 결과 |
| --- | --- | --- |
| {phase-level validation} | {command 또는 확인 방법} | {기대 결과} |
| {phase-level validation} | {command 또는 확인 방법} | {기대 결과} |
