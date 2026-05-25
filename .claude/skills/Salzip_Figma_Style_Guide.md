# Salzip Design System — Figma Style Guide

> **For Designers** · 디자인의 일관성은 이름에서 시작됩니다.
>
> Salzip Design System을 Figma에서 어떻게 구조화하고, 이름 짓고, 발행하고, 개발자에게 전달할지에 대한 디자이너 실무 가이드. Variables · Components · Auto Layout · Annotation까지.

| Item | Value |
|---|---|
| **Companion** | Salzip DS v0.1 |
| **Audience** | Product Designer |
| **Figma Features** | Variables · Modes · Dev Mode |
| **Last Updated** | 2026.05.15 |
| **Version** | v0.1 |

---

## 📑 목차

1. [파일 구조 (Files)](#01-파일-구조)
2. [페이지 구조 (Pages)](#02-페이지-구조)
3. [Variables 설정](#03-variables-설정)
4. [Text Styles](#04-text-styles)
5. [Effect Styles](#05-effect-styles)
6. [명명 규칙 (Naming)](#06-명명-규칙)
7. [Component Properties & Variants](#07-component-properties--variants)
8. [Auto Layout 가이드](#08-auto-layout-가이드)
9. [아이콘 시스템 (Icons)](#09-아이콘-시스템)
10. [개발자 핸드오프 (Annotation)](#10-개발자-핸드오프-annotation)
11. [디자이너 워크플로우 (Workflow)](#11-디자이너-워크플로우)
12. [코드 동기화 (Code Sync)](#12-코드-동기화)

---

## 01 · 파일 구조

> 3개의 핵심 Figma 파일로 운영. **Library 파일**이 모든 토큰·컴포넌트의 단일 진실 공급원이며, 다른 파일은 이를 인스턴스로 사용합니다.

### 워크스페이스 트리

```
📁 Salzip Design System              # Library 파일 (Publish 대상)
   📄 Salzip-DS-Library              # 토큰·컴포넌트 정의
   📄 Salzip-DS-Documentation        # Cover·사용 가이드

📁 Salzip Product                    # 실제 화면 디자인
   📄 Salzip-App-Screens             # 9개 핵심 화면
   📄 Salzip-App-Prototype           # 인터랙티브 프로토타입
   📄 Salzip-Landing                 # 마케팅 페이지 (Phase 2)

📁 Explorations                      # 실험·시안 (Library 미연결)
   📄 Salzip-Explorations-2026Q2
```

### 파일 분리 원칙

#### Principle 01 — Library는 토큰만, Product는 화면만
Library 파일은 절대 화면을 그리지 않습니다. 인스턴스가 어떻게 사용되는지 보려면 Documentation 파일을 봅니다.

#### Principle 02 — 실험은 별도 파일에서
실험 파일은 Library 미연결. 검증된 컴포넌트만 Library로 이동. Product 파일이 실험에 오염되지 않도록 분리.

#### Principle 03 — 버전은 파일명에 명시
v0.1 → v0.2 시 파일을 복제해 보존. 큰 변경은 항상 백업. Branch 기능은 작은 수정에만 사용.

#### Principle 04 — Editor 권한은 디자이너만
개발자는 Dev Mode (Viewer)로 접근. 디자이너 1명, 리뷰어 1명으로 권한 최소화. PM은 코멘트 권한만.

---

## 02 · 페이지 구조

> Library 파일 내부 페이지 분리. 모든 페이지는 이모지 prefix로 시작해 사이드바에서 즉시 인지 가능하도록 합니다.

### 📘 README — Cover
파일을 열었을 때 가장 먼저 보이는 페이지. 버전·변경 이력·연락처·사용법 링크.

**포함 항목**: `Cover` · `Version History` · `Contact`

### 🎨 Foundations — Variables · Styles
모든 토큰의 시각적 카탈로그. Variables는 여기에서만 정의·수정합니다. 변수 값을 직접 입력하지 말고 토큰 참조.

**포함 항목**: `Colors` · `Typography` · `Spacing` · `Radius` · `Shadow`

### 🧱 Primitives — Atomic Components
가장 작은 단위의 재사용 컴포넌트. 모든 Properties와 Variants가 정의됨.

**포함 항목**: `Button` · `Input` · `Chip` · `Badge` · `Avatar` · `Icon`

### 📦 Components — Composite
Primitives를 조합한 도메인 컴포넌트. 화면에서 그대로 인스턴스로 사용.

**포함 항목**: `Card` · `BottomSheet` · `AppBar` · `TabBar` · `StepIndicator`

### 🏠 Salzip-specific — Domain
청년 주거 도메인 특화 컴포넌트. 4종 모두 상태에 따른 variants 보유.

**포함 항목**: `ScoreCircle` · `RiskBar` · `ListingCard` · `TimelineStep`

### 🎯 Icons — SVG Library
24×24px 그리드의 아이콘 컴포넌트. Lucide 기반 + Salzip 커스텀 아이콘.

**포함 항목**: `System` · `Navigation` · `Status` · `Domain`

### 📐 Templates — Layout Patterns
EmptyState, Skeleton, ErrorState 등 반복 패턴. 화면 단위 템플릿은 Product 파일에 위치.

**포함 항목**: `EmptyState` · `Skeleton` · `ErrorState` · `Loading`

### 🗂️ Archive — Deprecated
Deprecated 컴포넌트 보관. 즉시 삭제 X. 다음 메이저 버전까지 유지.

**포함 항목**: `Deprecated v0.x`

---

## 03 · Variables 설정

> Figma Variables는 코드의 `tokens.ts`와 1:1 매핑됩니다. 이름이 동일해야 Tokens Studio 플러그인으로 자동 동기화 가능.

### Collection 구조

Figma 좌측 사이드바 → Local Variables → Collections. 4개의 Collection으로 분리합니다. Mode는 v0.1에서 Light 단일, Phase 2에서 Dark 추가.

#### Collection 01 — `color/`
모든 색상 변수. 코드의 `tokens.color`와 동일.

```
✓ color/primary/normal = #0A0A0B
✓ color/brand/normal = #10B981
✓ color/label/alternative = #71717A
✗ primary-normal = #0A0A0B
✗ Primary Normal = #0A0A0B
```

#### Collection 02 — `space/`
Number Variables. Auto Layout padding·gap에 직접 바인딩.

```
✓ space/1 = 4
✓ space/4 = 16
✓ space/8 = 32
✗ spacing-md = 16
✗ padding-lg = 24
```

#### Collection 03 — `radius/`
Number Variables. Frame의 Corner Radius에 바인딩.

```
✓ radius/xs = 4
✓ radius/md = 8
✓ radius/lg = 12
✓ radius/full = 9999
```

#### Collection 04 — `type/`
Number Variables. fontSize·lineHeight·letterSpacing 개별 변수로 분리. Text Style이 이를 참조.

```
✓ type/title1/size = 32
✓ type/title1/line = 44
✓ type/title1/track = -0.81
```

### Color Variables 전체 목록

Semantic 토큰만 컴포넌트에서 직접 사용 가능. Atomic 토큰은 Semantic 정의 시에만 참조.

| Variable Name | Value | Use Case |
|---|---|---|
| `color/primary/normal` | `#0A0A0B` | Primary 버튼 · 강조 텍스트 |
| `color/brand/normal` | `#10B981` | Brand CTA · Positive 상태 |
| `color/brand/soft` | `#ECFDF5` | Brand 배경 · 선택 상태 |
| `color/label/normal` | `#18181B` | 본문 텍스트 기본 |
| `color/label/alternative` | `#71717A` | 보조 텍스트 · 메타 |
| `color/label/assistive` | `#A1A1AA` | Placeholder · 캡션 |
| `color/line/normal` | `#E4E4E7` | 카드 · Divider 기본 |
| `color/background/soft` | `#FAFAFA` | 섹션 배경 · subtle surface |
| `color/status/cautionary` | `#F59E0B` | 위험도 주의 · 심사중 |
| `color/status/negative` | `#EF4444` | 깡통전세 위험 · 탈락 |

### Do / Don't

#### ✓ DO
- Variable에 바인딩 (Fill → Variable 선택)
- Slash(`/`) 구분자로 Group 자동 생성
- Semantic 토큰만 컴포넌트에 사용
- HEX 값을 직접 입력하지 않음

#### ✗ DON'T
- Style과 Variable을 혼용
- Atomic 토큰을 컴포넌트에서 직접 참조
- 임시 색상 (디자인 시간만 사용)
- 토큰 이름에 한글·공백 사용

---

## 04 · Text Styles

> 16개 Text Style을 정의. 각 Style은 fontSize · lineHeight · letterSpacing · fontWeight를 변수로 바인딩하지 않고 직접 값 입력 (Figma 제약).

| Style Name | Font | Size | Line Height | Tracking | Weight |
|---|---|---|---|---|---|
| `display/1` | Pretendard Variable | 56 | 72 | -0.0319em | 700 |
| `display/2` | Pretendard Variable | 40 | 52 | -0.0282em | 700 |
| `display/3` | Pretendard Variable | 36 | 48 | -0.027em | 700 |
| `title/1` | Pretendard Variable | 32 | 44 | -0.0253em | 700 |
| `title/2` | Pretendard Variable | 28 | 38 | -0.0236em | 700 |
| `title/3` | Pretendard Variable | 24 | 32 | -0.023em | 700 |
| `heading/1` | Pretendard Variable | 22 | 30 | -0.0194em | 600 |
| `heading/2` | Pretendard Variable | 20 | 28 | -0.012em | 600 |
| `headline/1` | Pretendard Variable | 18 | 26 | -0.002em | 600 |
| `headline/2` | Pretendard Variable | 17 | 24 | 0em | 600 |
| `body/1` | Pretendard Variable | 16 | 24 | 0.0057em | 400 |
| `body/2` | Pretendard Variable | 15 | 22 | 0.0096em | 400 |
| `label/1` | Pretendard Variable | 14 | 20 | 0.0145em | 500 |
| `label/2` | Pretendard Variable | 13 | 18 | 0.0194em | 500 |
| `caption/1` | Pretendard Variable | 12 | 16 | 0.0252em | 400 |
| `caption/2` | Pretendard Variable | 11 | 14 | 0.0311em | 400 |

### 사용 가이드

컴포넌트에는 Text Style만 적용. 텍스트 컬러는 별도로 Color Variable을 바인딩.

#### ✓ DO
- 모든 Text 레이어에 Text Style 적용
- 컬러는 별도로 Color Variable 바인딩
- 화면 제목은 `title/1` 또는 `title/2`만 사용
- 본문은 `body/1` (기본) 또는 `body/2`

#### ✗ DON'T
- Text Style 없이 fontSize 직접 입력
- `display`는 앱 화면에 사용 (마케팅 전용)
- `caption/2`는 본문에 사용 (가독성 ↓)
- fontWeight를 임의로 변경

---

## 05 · Effect Styles

> 6개 Drop Shadow Effect 정의. 화이트 베이스에서 그림자는 매우 절제 사용. 일반 카드는 1px border만으로 구분.

| Style Name | X | Y | Blur | Spread | Color | Use Case |
|---|---|---|---|---|---|---|
| `shadow/xs` | 0 | 1 | 2 | 0 | #0A0A0B · 4% | 호버 미세 |
| `shadow/sm` | 0 | 1 | 3 | 0 | #0A0A0B · 6% | 카드 hover |
| `shadow/md` | 0 | 4 | 8 | -2 | #0A0A0B · 6% | 팝오버 |
| `shadow/lg` | 0 | 12 | 16 | -4 | #0A0A0B · 8% | 드롭다운 |
| `shadow/xl` | 0 | 20 | 24 | -4 | #0A0A0B · 8% | 바텀시트 |
| `shadow/2xl` | 0 | 24 | 48 | -12 | #0A0A0B · 18% | 모달 |

---

## 06 · 명명 규칙

> 레이어 이름은 디자인 시스템에서 가장 자주 어기는 규칙입니다. 일관된 이름이 곧 일관된 시스템.

### Rule 01 — Component: PascalCase
컴포넌트 이름은 코드의 React 컴포넌트와 1:1 매핑되어야 합니다.

```
✓ Button
✓ ListingCard
✓ RiskBar
✗ button
✗ Listing card
✗ btn-primary
```

### Rule 02 — Variant Property: camelCase = kebab-value
Property 이름은 camelCase, 값은 kebab-case. Boolean property는 형용사형.

```
✓ variant=primary
✓ size=md
✓ hasIcon=true
✓ isDisabled=false
✗ type=Primary
✗ Size=Medium
```

### Rule 03 — Layer: 의미 기반 이름
"Rectangle 13" 같은 자동 이름 금지. 모든 레이어는 역할이 드러나는 이름을 가짐.

```
✓ Container
✓ Label
✓ Icon-Lead
✓ Score-Value
✗ Rectangle 13
✗ Frame 84
```

### Rule 04 — Frame (Screen): 화면 ID + 이름
화면 프레임은 화면설계서의 ID를 prefix로. 정렬과 검색이 쉬워짐.

```
✓ S01_Onboarding
✓ S02-2_CommuteLifestyle
✓ S06_ListingDetail
✗ 홈 화면
✗ 매물 상세 (final)
```

### Rule 05 — Asset (Icon, Image): kebab-case + size
아이콘은 의미·크기 명시. Export 시 SVG 파일명이 그대로 사용됨.

```
✓ icon-arrow-left/24
✓ icon-heart-filled/24
✓ illust-empty-result/240
✗ Arrow Left
✗ heart_icon@2x
```

### Rule 06 — Variable: slash-grouped path
Figma Variables는 슬래시 구분자로 자동 grouping. 코드의 토큰 경로와 동일하게.

```
✓ color/primary/normal
✓ color/brand/soft
✓ space/4
✓ radius/lg
✗ primary-color
```

---

## 07 · Component Properties & Variants

> 각 컴포넌트의 Property 매트릭스. Variant·Boolean·Instance Swap·Text 4종을 모두 활용해 인스턴스 사용성을 극대화.

### Button

> Variants · Boolean · Text · Instance Swap

| Property | Type | Values | 설명 |
|---|---|---|---|
| `variant` | Variant | `primary` \| `brand` \| `secondary` \| `ghost` \| `destructive` | 시각적 강조도 5단계 |
| `size` | Variant | `sm` \| `md` \| `lg` | 패딩·폰트 크기 3단계 |
| `state` | Variant | `default` \| `hover` \| `pressed` \| `disabled` | 인터랙션 상태 |
| `hasIconLead` | Boolean | true / false | 아이콘이 텍스트 왼쪽 |
| `hasIconTrail` | Boolean | true / false | 아이콘이 텍스트 오른쪽 |
| `label` | Text | string | 버튼 텍스트 |
| `iconLead` | Instance Swap | Icon component | 아이콘 컴포넌트 교체 |

### Chip

> Variants · Boolean · Text

| Property | Type | Values | 설명 |
|---|---|---|---|
| `variant` | Variant | `default` \| `selected` \| `brand` | 선택 상태 표현 |
| `hasIcon` | Boolean | true / false | 아이콘 동반 여부 |
| `hasCloseButton` | Boolean | true / false | 필터 칩의 X 버튼 |

### ListingCard

> Variants · Boolean · Text · Instance Swap

| Property | Type | Values | 설명 |
|---|---|---|---|
| `riskLevel` | Variant | `low` \| `mid` \| `high` | 위험도 색상 자동 변경 |
| `orientation` | Variant | `horizontal` \| `vertical` | 리스트 vs 그리드 |
| `isSaved` | Boolean | true / false | ♡ 즐겨찾기 상태 |
| `title · price · meta` | Text | string | 3개 텍스트 props |

### ScoreCircle

> Variants · Text

| Property | Type | Values | 설명 |
|---|---|---|---|
| `size` | Variant | `sm` \| `md` \| `lg` | 48 / 64 / 96px |
| `tone` | Variant | `brand` \| `cautionary` \| `negative` | 점수 구간별 색상 |
| `score` | Text | number | 0~100 점수값 |

---

## 08 · Auto Layout 가이드

> 모든 컴포넌트와 화면은 Auto Layout 필수. Resizing 모드와 Padding/Gap 토큰 바인딩을 정확히 적용해야 RN 코드와 1:1 매핑됩니다.

### Resizing 결정 트리

선택 시 즉시 결정 가능하도록 간단한 룰.

| 모드 | 사용 시점 | 예시 |
|---|---|---|
| **Hug contents** | 콘텐츠 크기에 맞게 줄어듦 (가장 자주 사용) | 버튼, 칩, Inline 텍스트 |
| **Fill container** | 부모 너비를 가득 채움 | 입력 필드, 카드 내부 콘텐츠, 모달 콘텐츠 |
| **Fixed width/height** | 고정 크기 | 디바이스 너비 (375px), 아이콘 (24×24), 페이지 컨테이너 (1200px) |
| **Min/Max width** | 반응형 페이지 | 모바일 최소 320px, 데스크탑 최대 1200px |

### Padding · Gap은 반드시 Variable 바인딩

#### ✓ DO
- Auto Layout Padding 우클릭 → Apply variable
- `space/2 = 8`, `space/4 = 16` 등 토큰만 사용
- vertical / horizontal padding 별도 토큰 가능
- Gap도 동일하게 Variable 바인딩

#### ✗ DON'T
- Padding에 임의 숫자 (예: 15px) 입력
- 1px·2px 같은 미세 수치를 토큰화
- vertical 8px + horizontal 7px 같은 비대칭
- Auto Layout 없이 절대 좌표로 배치

---

## 09 · 아이콘 시스템

> **Lucide** 아이콘셋을 베이스로 사용. 도메인 특화 아이콘은 별도 디자인. 모든 아이콘은 24×24 그리드, 2px 스트로크.

### 규격

| 속성 | 값 | 비고 |
|---|---|---|
| 기본 사이즈 | 24 × 24px | Lucide 표준 |
| 스몰 사이즈 | 20 × 20px | Chip, Input prefix |
| 스트로크 | 2px | Linear 스타일 |
| 라운드 | 2px | 모서리 미세 곡선 |
| 캡 / 조인 | Round / Round | 모든 아이콘 일관 |
| 컬러 | `currentColor` 변수 | 부모의 색상 상속 |

### 분류

#### Category — `system/`
네비게이션·범용. Lucide에서 직접 가져옴.

```
icon-arrow-left
icon-arrow-right
icon-close
icon-check
icon-chevron-down
icon-settings
```

#### Category — `status/`
상태 표현. 위험도·자격·진행에 사용.

```
icon-circle-check
icon-circle-alert
icon-shield
icon-clock
icon-trending-up
```

#### Category — `nav/`
하단 탭바·메뉴. Filled / Outlined 2종.

```
icon-home / icon-home-fill
icon-search / icon-search-fill
icon-bookmark / icon-bookmark-fill
icon-user / icon-user-fill
```

#### Category — `domain/` (Custom)
Salzip 특화. Lucide에 없는 도메인 아이콘.

```
icon-jeonse-ratio
icon-flood-warning
icon-roadmap-step
icon-eligibility
```

---

## 10 · 개발자 핸드오프 (Annotation)

> Dev Mode 활용 + 추가 Annotation으로 명세 누락을 방지. 모든 spacing·color는 Variable 이름으로 자동 노출되도록 바인딩 필수.

### Dev Mode 사용 원칙

#### ✓ DO
- 모든 spacing은 Variable 바인딩 → Dev Mode에서 토큰 이름 노출
- Variant Property를 명확히 설정 → CSS Variant Generator로 코드 추출 가능
- 화면 frame 안에 "Spec" Annotation 별도 추가 (특수 동작·예외)
- Section을 사용해 화면 그룹화 (S03 Home Group 등)

#### ✗ DON'T
- 임의 숫자 입력 → 토큰 이름 노출 안 됨
- Mask·Boolean Operation 남용 → SVG export 어려움
- 한글 레이어 이름 (복사·검색 어려움)
- Hidden Layer 방치 (개발자 혼란)

### Annotation 표기 예시

화면 frame 옆에 Spec 박스를 추가. Auto Layout 정보 외에 동작 명세를 텍스트로.

#### 시각적 토큰 표기 (Frame 주변에 라벨링)

```
[S06_ListingDetail]
├─ 외부 padding: space/4
├─ 카드 elevation: shadow/none
├─ CTA 버튼:
│  ├─ background: color/primary/normal
│  └─ radius: radius/md
└─ 위험도 카드:
   ├─ background: color/brand/soft
   └─ tone: brand
```

#### Spec Note 예시 (동작 명세)

```
📋 SPEC NOTE — 동작 명세

• 위험도 카드 tap → BottomSheet 모달 (S06-1)
• 위험도 색상: tone variant 자동 적용
• CTA tap → S07로 navigate
• ♡ tap → savedStore에 toggle + 햅틱
• 공유 (↗) → Share.share() RN API
```

---

## 11 · 디자이너 워크플로우

> 새 컴포넌트 추가부터 Publish까지 6단계 표준 프로세스. 모든 단계에서 토큰 기반 작업이 원칙.

### Step 1 — 요구 정리 `[기획 입력]`

화면설계서·정보구조 설계서에서 새로 필요한 컴포넌트 식별. 기존 컴포넌트로 해결 가능한지 먼저 확인.

**Actions**
- `read: 화면설계서 v0.2`
- `check: Existing Library`

### Step 2 — Explorations에서 실험 `[실험]`

Library 미연결 파일에서 자유 실험. 토큰 사용은 권장하나 강제는 X. 3~5개 시안 비교.

**Actions**
- `file: Salzip-Explorations`
- `output: 시안 3-5종`

### Step 3 — 토큰 기반 정제 `[정제]`

선정된 시안을 Salzip-DS-Library로 옮김. 모든 색상·간격을 Variable로 바인딩. Auto Layout 적용.

**Actions**
- `bind: Color Variables`
- `bind: Space Variables`
- `apply: Auto Layout`

### Step 4 — Variants & Properties 설정 `[컴포넌트화]`

Component Set으로 묶고 Properties 정의. variant·boolean·text·instance swap 4종을 모두 검토.

**Actions**
- `create: Component Set`
- `define: Properties`
- `test: All combinations`

### Step 5 — 리뷰 & 문서화 `[검증]`

디자인 리뷰. Documentation 페이지에 사용 예시·Do/Don't 추가. Slack에 변경 요약 공유.

**Actions**
- `review: 1명 이상`
- `document: Usage`
- `announce: Slack`

### Step 6 — Publish & Sync `[배포]`

Library Publish. Product 파일에서 Update 적용. `tokens.ts`에도 동일 변경 반영 (코드 PR 생성).

**Actions**
- `publish: Library`
- `update: Product files`
- `sync: tokens.ts PR`

---

## 12 · 코드 동기화

> Figma Variables ↔ `tokens.ts` ↔ NativeWind 설정. 한 곳에서 정의하고 자동으로 다른 곳에 반영.

### 동기화 흐름

```
Figma Variables (Single Source of Truth)
    ↓ Tokens Studio Plugin (export to JSON)
tokens.json (Git 저장소)
    ↓ build script
src/constants/tokens.ts (TypeScript) + tailwind.config.ts
    ↓
React Native App + Web
```

### Tokens Studio Plugin 설정

Figma 플러그인 → **Tokens Studio for Figma** 설치. Git 연동으로 자동 sync.

```json
// .tokens-studio/config.json
{
  "version": "1",
  "storageType": {
    "provider": "github",
    "id": "salzip/design-tokens",
    "branch": "main",
    "filePath": "tokens/tokens.json"
  },
  "tokenSets": ["global", "semantic", "component"],
  "themes": [
    { "id": "light", "name": "Light" }
  ]
}
```

### 변경 시 체크리스트

#### Change Type 1 — 토큰 값 변경 (Non-breaking)

> 예: `brand/normal` 색상을 `#10B981 → #14B981`로. 의미는 같고 값만 변경.

```
1. Figma Variable 값만 수정
2. Plugin → Push to Git
3. CI가 자동으로 tokens.ts 갱신
4. PR Merge → 앱에 자동 반영
```

#### Change Type 2 — 토큰 추가 (Additive)

> 예: `color/brand/heavy` 신규 추가. 기존 토큰에 영향 없음.

```
1. Figma에서 Variable 추가
2. Push to Git
3. tokens.ts 자동 확장
4. 사용은 자율 (강제 X)
```

#### Change Type 3 — 토큰 이름 변경 (Breaking)

> 예: `color/brand → color/primary`로. 기존 사용처 모두 수정 필요.

```
1. Deprecation 결정 회의
2. 새 이름으로 추가 + 기존 유지
3. Product 파일 점진 마이그레이션
4. 모두 마이그 완료 후 구 토큰 삭제
```

#### Change Type 4 — 토큰 삭제 (Breaking)

> 예: 더 이상 사용 안 하는 색상 제거.

```
1. 모든 사용처 검색·치환
2. Archive 페이지로 이동
3. v0.x 메이저 버전에서 최종 삭제
4. CHANGELOG에 명시
```

---

## 📎 부록 — 핵심 참조

### 관련 문서

- **Salzip Design System v0.1** — 디자인 토큰·컴포넌트 정의 문서
- **화면설계서 v0.2 (RN)** — 9개 화면 와이어프레임 + RN 명세
- **정보구조 설계서 v0.2 (IA)** — 사이트맵·상태머신·엔티티 모델
- **기획서 v0.1** — 공모전 제출용 정식 기획서

### 도구

- **Figma** — 디자인 작업
- **Tokens Studio for Figma** — Variables ↔ JSON 동기화
- **Lucide** — 아이콘 베이스 셋
- **GitHub** — `tokens.json` 저장소

### 핵심 원칙 한 줄 요약

> **이름이 곧 시스템이다.** Variant Property, Layer Name, Variable Path 모두 코드와 1:1 매핑되어야 합니다. Variable 바인딩을 강제하고, 임의 HEX·숫자 입력을 금지합니다. Library는 토큰만, Product는 화면만 다룸으로써 책임을 분리합니다.

---

**Salzip Design System — Figma Style Guide**
For Designers · v0.1 (2026.05.15) · Companion to Salzip DS v0.1
