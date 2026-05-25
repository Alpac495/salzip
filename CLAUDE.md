# Project Overview

React Native 앱 프로젝트 (3인 팀)

## Tech Stack

- **UI**: React Native + NativeWind (Tailwind CSS)
- **상태 관리**: Zustand
- **서버 상태**: TanStack Query (React Query)
- **언어**: TypeScript (strict mode)
- **라우터**: Expo Router

## Commands

```bash
npx expo start              # 개발 서버
npx expo run:ios            # iOS 빌드
npx expo run:android        # Android 빌드
npx tsc --noEmit            # 타입 체크
npx eslint . --ext .ts,.tsx # 린트
```

> 코드 변경 후 반드시 `tsc --noEmit` 실행. 타입 에러 있으면 커밋 금지.

## Project Structure

```
src/
├── app/          # Expo Router 진입점 (파일 기반 라우팅)
├── components/   # 공통 컴포넌트 (100줄 이하 유지)
├── screens/      # 화면 단위 컴포넌트 (UI만, 로직 없음)
├── store/        # Zustand 스토어 (클라이언트 상태만)
├── hooks/        # 커스텀 훅 (TanStack Query 포함)
├── api/          # API 함수 모음 (fetch 로직만)
├── types/        # 공통 타입 정의
└── utils/        # 순수 유틸 함수
```

세부 설계는 `@docs/architecture.md` 참조.

## Code Style

- 파일명: 컴포넌트 `PascalCase`, 훅 `camelCase`, 스토어 `camelCase`
- 훅 접두사: `use` (`useUserQuery.ts`)
- 스토어 접미사: `Store` (`useAuthStore.ts`)
- 스타일: NativeWind `className`만 사용 — `StyleSheet` 혼용 금지
- `any` 타입 금지. 불확실하면 `unknown` + 타입 가드 사용

## State Management

**Zustand** → 클라이언트 전역 상태 (인증, UI, 설정)

```ts
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

**TanStack Query** → 서버 데이터 (fetching, caching, sync)

```ts
export const useUsersQuery = () =>
  useQuery({ queryKey: ['users'], queryFn: fetchUsers });
```

규칙:
- 서버 데이터를 Zustand에 복사하지 않는다
- 낙관적 업데이트는 `useMutation`의 `onMutate` 사용
- `queryKey`는 `src/constants/queryKeys.ts`에서 중앙 관리

## NativeWind Rules

- `className` prop으로만 스타일 적용
- 다크모드: `dark:` 접두사
- 커스텀 토큰: `tailwind.config.js`의 `theme.extend`에만 추가
- 플랫폼 분기 필요 시 `Platform.select()` 사용, className 조건분기 최소화

## AI Behavior Guidelines (Karpathy Principles)

### 1. 코딩 전에 먼저 생각한다

구현 전에:
- 불확실한 부분은 가정하지 말고 명시하거나 질문한다
- 해석이 여러 가지라면 조용히 선택하지 말고 제시한다
- 더 단순한 방법이 있으면 먼저 말한다
- 혼란스러운 부분이 있으면 멈추고 이름 붙여 물어본다

### 2. 단순하게 유지한다

- 요청하지 않은 기능 추가 금지
- 단일 사용 코드에 추상화 레이어 금지
- 요청하지 않은 "유연성", "확장성" 위한 코드 금지
- 200줄로 쓸 수 있는 것을 50줄로 쓸 수 있다면 다시 쓴다
- "시니어 엔지니어가 과도하다고 할 것인가?" → Yes면 줄인다

### 3. 필요한 것만 수정한다

기존 코드 수정 시:
- 요청과 무관한 코드, 주석, 포맷 수정 금지
- 고장나지 않은 것 리팩토링 금지
- 기존 스타일이 달라도 맞춘다
- 불필요한 코드 발견 시 삭제하지 말고 언급만 한다

내 변경으로 생긴 orphan은 정리한다 (import, 변수, 함수).
모든 변경된 줄은 요청으로 추적 가능해야 한다.

### 4. 목표 기반으로 실행한다

작업을 검증 가능한 목표로 변환한다:

```
"버그 수정" → "버그를 재현하는 테스트 작성 → 테스트 통과"
"기능 추가" → "성공 기준 정의 → 구현 → 기준 충족 확인"
```

여러 단계 작업은 계획을 먼저 제시한다:

```
1. [단계] → 검증: [확인 방법]
2. [단계] → 검증: [확인 방법]
```

## Git Convention

- 브랜치: `feat/`, `fix/`, `chore/` 접두사
- 커밋: `feat: 로그인 화면 구현` (한국어 가능)
- PR: 셀프 머지 금지, 최소 1인 리뷰 필요
- PR 단위: 하나의 기능 또는 버그 픽스 (혼합 금지)

## Do / Don't

| Do | Don't |
|---|---|
| TanStack Query로 서버 상태 관리 | 서버 데이터를 Zustand에 저장 |
| NativeWind className 사용 | StyleSheet.create 혼용 |
| 타입 명시적으로 선언 | `any` 타입 사용 |
| 컴포넌트 100줄 이하 유지 | 화면 로직과 UI 혼재 |
| 불확실하면 먼저 질문 | 가정하고 구현 시작 |
| 요청한 것만 구현 | 요청 없는 기능/추상화 추가 |
| 변경 전 계획 제시 | 조용히 큰 변경 진행 |

---

세부 문서: `@docs/architecture.md` · `@docs/api-spec.md` · `@docs/decisions.md`
