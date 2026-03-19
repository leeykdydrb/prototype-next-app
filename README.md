# Prototype Next.js App - 개발용 프레임워크

Next.js 기반의 프로젝트 템플릿(프레임워크)입니다.  
신입 개발자도 빠르게 개발 환경을 세팅하고, 프로젝트 구조를 이해할 수 있도록 안내합니다.

---

## 📋 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [프로젝트 구조](#3-프로젝트-구조)
4. [아키텍처 개요](#4-아키텍처-개요)
5. [핵심 기능](#5-핵심-기능)
6. [개발 환경 세팅](#6-개발-환경-세팅)
7. [주요 개발 명령어](#7-주요-개발-명령어)
8. [코드 컨벤션](#8-코드-컨벤션)
9. [데이터베이스 스키마](#9-데이터베이스-스키마)
10. [API 구조](#10-api-구조)
11. [인증 및 권한 관리](#11-인증-및-권한-관리)
12. [컴포넌트 시스템](#12-컴포넌트-시스템)
13. [상태 관리](#13-상태-관리)
14. [FAQ](#14-faq)
15. [참고 자료](#15-참고-자료)

---

## 1. 프로젝트 개요

### 1-1. 목적
- **웹 애플리케이션 개발을 위한 Next.js 프레임워크**
- **RBAC(Role-Based Access Control) 기반의 권한 관리 시스템**
- **재사용 가능한 컴포넌트 라이브러리 구축**
- **신입 개발자의 빠른 온보딩 지원**

### 1-2. 주요 특징
- 🔐 **JWT 기반 인증 시스템** (NextAuth v5)
- 👥 **역할 기반 권한 관리** (Role, Permission, Menu)
- 🎨 **shadcn/ui 기반 커스텀 컴포넌트 시스템**
- 🗄️ **Prisma ORM을 통한 타입 안전한 데이터베이스 접근**
- 🚀 **TanStack Query를 통한 효율적인 서버 상태 관리**
- 🐳 **Docker 기반 개발/배포 환경 통합**

---

## 2. 기술 스택

### 2-1. Frontend
- **Framework**: Next.js 15.3.2 (App Router)
- **Language**: TypeScript 5
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS 기반)
- **State Management**: Zustand 5.0.4
- **Server State**: TanStack React Query 5.76.1
- **Authentication**: NextAuth.js 5.0.0-beta.28
- **Styling**: Tailwind CSS 4.1.13

### 2-2. Backend & Database
- **Database**: PostgreSQL
- **ORM**: Prisma 6.9.0
- **API**: Next.js API Routes
- **Authentication**: JWT (Access Token + Refresh Token)

### 2-3. Development & Deployment
- **Container**: Docker & Docker Compose
- **Package Manager**: npm
- **Code Quality**: ESLint, TypeScript
- **Icons**: Lucide React
- **Charts**: Recharts

---

## 3. 프로젝트 구조

```
prototype-next-app/
├── 📁 prisma/                 # 데이터베이스 스키마 및 마이그레이션
│   ├── schema.prisma         # Prisma 스키마 정의
│   ├── seed.ts               # 시드 데이터
│   └── migrations/           # 데이터베이스 마이그레이션 파일
├── 📁 public/                 # 정적 파일 (이미지, 폰트 등)
├── 📁 src/                    # 소스 코드
│   ├── 📁 app/               # Next.js App Router
│   │   ├── 📁 (auth)/        # 인증 관련 페이지
│   │   │   └── 📁 login/     # 로그인 페이지
│   │   ├── 📁 (protected)/   # 인증이 필요한 보호된 페이지
│   │   │   ├── 📁 admin/     # 관리자 페이지 (사용자, 역할, 권한, 메뉴, 코드 관리)
│   │   │   │   ├── 📁 users/     # 사용자 관리
│   │   │   │   ├── 📁 roles/     # 역할 관리
│   │   │   │   ├── 📁 permissions/ # 권한 관리
│   │   │   │   ├── 📁 menus/     # 메뉴 관리
│   │   │   │   └── 📁 codes/     # 코드 관리
│   │   │   ├── 📁 dashboard/ # 대시보드 (시스템 모니터링)
│   │   │   ├── 📁 device/    # 디바이스 관리
│   │   │   ├── 📁 devicecontrol/ # 디바이스 제어
│   │   │   └── 📁 equipment/ # 설비 관리
│   │   ├── 📁 api/           # API 라우트
│   │   │   ├── 📁 auth/      # 인증 API
│   │   │   │   ├── [...nextauth]/ # NextAuth 핸들러
│   │   │   │   ├── login/        # 로그인 API
│   │   │   │   └── refresh/      # 토큰 갱신 API
│   │   │   ├── 📁 user/      # 사용자 API
│   │   │   ├── 📁 role/      # 역할 API
│   │   │   ├── 📁 permission/# 권한 API
│   │   │   ├── 📁 menu/      # 메뉴 API
│   │   │   ├── 📁 code/      # 코드 API
│   │   │   ├── 📁 code-group/ # 코드 그룹 API
│   │   │   ├── 📁 equipment/ # 설비 API
│   │   │   └── 📁 dashboard/ # 대시보드 API
│   │   ├── layout.tsx        # 루트 레이아웃
│   │   ├── page.tsx          # 홈페이지
│   │   ├── globals.css       # 전역 스타일
│   │   ├── not-found.tsx     # 404 페이지
│   │   └── page.module.css   # 홈페이지 스타일
│   ├── 📁 components/        # 컴포넌트
│   │   ├── ClientProviders.tsx # 클라이언트 프로바이더
│   │   ├── 📁 ui/            # Radix UI 기반 재사용 가능한 UI 컴포넌트
│   │   │   ├── button.tsx    # 버튼 컴포넌트
│   │   │   ├── table.tsx     # 테이블 컴포넌트
│   │   │   ├── dialog.tsx    # 다이얼로그 컴포넌트
│   │   │   ├── sidebar.tsx   # 사이드바 컴포넌트
│   │   │   ├── chart.tsx     # 차트 컴포넌트
│   │   │   └── ...           # 기타 UI 컴포넌트
│   │   ├── 📁 domain/        # 도메인별 컴포넌트
│   │   │   ├── 📁 auth/      # 인증 관련 컴포넌트
│   │   │   │   └── LoginForm.tsx # 로그인 폼
│   │   │   ├── 📁 user/      # 사용자 관련 컴포넌트
│   │   │   │   ├── UserList.tsx    # 사용자 목록
│   │   │   │   ├── UserForm.tsx    # 사용자 폼
│   │   │   │   └── UserDialog.tsx  # 사용자 다이얼로그
│   │   │   ├── 📁 role/      # 역할 관련 컴포넌트
│   │   │   ├── 📁 permission/# 권한 관련 컴포넌트
│   │   │   ├── 📁 menu/      # 메뉴 관련 컴포넌트
│   │   │   ├── 📁 code/      # 코드 관련 컴포넌트
│   │   │   ├── 📁 dashboard/ # 대시보드 관련 컴포넌트
│   │   │   ├── 📁 device/    # 디바이스 관련 컴포넌트
│   │   │   └── 📁 devicecontrol/ # 디바이스 제어 관련 컴포넌트
│   │   ├── 📁 common/        # 공통 컴포넌트
│   │   │   ├── Loading.tsx   # 로딩 컴포넌트
│   │   │   ├── ErrorMessage.tsx # 에러 메시지 컴포넌트
│   │   │   ├── Logo.tsx      # 로고 컴포넌트
│   │   │   ├── LogoCi.tsx    # CI 로고 컴포넌트
│   │   │   ├── StatsCard.tsx # 통계 카드 컴포넌트
│   │   │   ├── SearchFilter.tsx # 검색 필터 컴포넌트
│   │   │   ├── ConfirmDialog.tsx # 커스텀 다이얼로그
│   │   │   └── ToastProvider.tsx # 토스트 프로바이더
│   │   └── 📁 layout/        # 레이아웃 관련 컴포넌트
│   │       ├── AppLayout.tsx # 메인 레이아웃
│   │       ├── 📁 Header/    # 헤더 컴포넌트
│   │       │   ├── Header.tsx    # 헤더 메인
│   │       │   └── UserMenu.tsx  # 사용자 메뉴
│   │       └── 📁 Sidebar/   # 사이드바 컴포넌트
│   │           ├── AppSidebar.tsx    # 사이드바 메인
│   │           └── SidebarItem.tsx   # 사이드바 아이템
│   ├── 📁 hooks/             # 커스텀 훅
│   │   ├── 📁 api/           # API 관련 훅
│   │   │   ├── useApiQuery.ts    # API 쿼리 훅
│   │   │   └── useApiMutation.ts # API 뮤테이션 훅
│   │   ├── 📁 user/          # 사용자 관련 훅
│   │   ├── 📁 role/          # 역할 관련 훅
│   │   ├── 📁 permission/    # 권한 관련 훅
│   │   ├── 📁 menu/          # 메뉴 관련 훅
│   │   ├── 📁 code/          # 코드 관련 훅
│   │   ├── 📁 code-group/    # 코드 그룹 관련 훅
│   │   ├── 📁 equipment/     # 설비 관련 훅
│   │   ├── 📁 dashboard/     # 대시보드 관련 훅
│   │   └── use-mobile.ts     # 모바일 감지 훅
│   ├── 📁 lib/               # 라이브러리, 유틸리티
│   │   ├── 📁 api/           # API 클라이언트 및 에러 처리
│   │   │   ├── apiClient.ts      # API 클라이언트
│   │   │   ├── ApiError.ts       # API 에러 클래스
│   │   │   └── apiResponse.ts    # API 응답 타입
│   │   ├── 📁 auth/          # 인증 관련 유틸리티
│   │   │   ├── permissionCheck.ts    # 권한 체크
│   │   │   ├── PermissionGuard.tsx   # 권한 가드
│   │   │   ├── SessionGuard.tsx     # 세션 가드
│   │   │   └── ...                  # 기타 인증 유틸리티
│   │   ├── prisma.ts         # Prisma 클라이언트
│   │   ├── auth.ts           # NextAuth 설정
│   │   └── toast.ts          # 토스트 알림 유틸리티
│   ├── 📁 store/             # 상태 관리 (Zustand)
│   │   ├── userStore.ts   # 사용자 상태
│   │   └── menuStore.ts   # 메뉴 상태
│   ├── 📁 types/             # TypeScript 타입 정의
│   │   ├── auth.ts           # 인증 타입
│   │   ├── user.ts           # 사용자 타입
│   │   ├── role.ts           # 역할 타입
│   │   ├── permission.ts     # 권한 타입
│   │   ├── menu.ts           # 메뉴 타입
│   │   ├── code.ts           # 코드 타입
│   │   ├── code-group.ts     # 코드 그룹 타입
│   │   ├── equipment.ts      # 설비 타입
│   │   ├── dashboard.ts      # 대시보드 타입
│   │   ├── next-auth.d.ts    # NextAuth 사용자 정의 타입 (session, JWT 등)
│   │   └── env.d.ts          # 환경 변수 타입
│   ├── 📁 styles/            # 스타일 파일
│   │   └── toast.css         # 토스트 스타일
│   ├── 📁 utils/             # 유틸리티 함수
│   │   ├── buildMenuTree.ts      # 메뉴 트리 빌드
│   │   ├── buildCodeGroupTree.ts # 코드 그룹 트리 빌드
│   │   └── passwordUtils.ts      # 비밀번호 유틸리티
│   ├── 📁 constants/         # 상수 정의
│   │   ├── user.ts           # 사용자 상수
│   │   ├── role.ts           # 역할 상수
│   │   ├── permission.ts     # 권한 상수
│   │   ├── menu.ts           # 메뉴 상수
│   │   ├── code.ts           # 코드 상수
│   │   └── layout.ts         # 레이아웃 상수
│   └── middleware.ts         # Next.js 미들웨어
├── 📁 nginx/                  # Nginx 설정
│   └── default.conf          # Nginx 설정 파일
├── 📁 scripts/               # 스크립트 파일
│   └── db-setup.mjs          # 데이터베이스 자동 설정 스크립트
├── 📁 .next/                  # Next.js 빌드 결과물
├── 📁 node_modules/           # npm 패키지
├── 📄 package.json            # 프로젝트 의존성 및 스크립트
├── 📄 package-lock.json       # 패키지 잠금 파일
├── 📄 next.config.ts          # Next.js 설정
├── 📄 tsconfig.json           # TypeScript 설정
├── 📄 components.json         # shadcn/ui 설정
├── 📄 postcss.config.mjs      # PostCSS 설정
├── 📄 eslint.config.mjs       # ESLint 설정
├── 📄 docker-compose.yml      # Docker Compose 설정
├── 📄 docker-compose.local.db.yml # 로컬 DB Docker Compose 설정
├── 📄 Dockerfile              # Docker 빌드 설정
├── 📄 .dockerignore           # Docker 무시 파일
├── 📄 .gitignore              # Git 무시 파일
├── 📄 README.md               # 프로젝트 설명서
└── 📄 README-DEV.md           # 로컬 개발 환경 설정 가이드
```

---

## 4. 아키텍처 개요

### 4-1. 전체 아키텍처
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Next.js       │    │   Database      │
│   (React)       │◄──►│   API Routes    │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │              ┌─────────────────┐
         └──────────────►│   NextAuth.js   │
                        │   (JWT Auth)    │
                        └─────────────────┘
```

### 4-2. 인증 플로우
```
1. 사용자 로그인 → NextAuth.js CredentialsProvider
2. JWT 토큰 발급 (Access Token + Refresh Token)
3. API 요청 시 Access Token 사용
4. 토큰 만료 시 Refresh Token으로 자동 갱신
5. 미들웨어를 통한 보호된 경로 접근 제어
```

### 4-3. 권한 관리 시스템
```
User → Role → Permission → Menu
  │       │        │        │
  │       │        │        └── 메뉴 접근 권한
  │       │        └── 기능별 권한 (CRUD)
  │       └── 역할 그룹
  └── 사용자
```

---

## 5. 핵심 기능

### 5-1. 인증 및 권한 관리
- **JWT 기반 인증**: Access Token + Refresh Token
- **역할 기반 접근 제어 (RBAC)**: User → Role → Permission
- **메뉴 권한 관리**: 사용자별 메뉴 접근 제어
- **자동 토큰 갱신**: 만료된 토큰 자동 갱신

### 5-2. 사용자 관리
- **사용자 CRUD**: 생성, 조회, 수정, 삭제
- **프로필 관리**: 사용자별 추가 정보 관리
- **시스템 계정 보호**: 시스템 기본 계정 삭제 방지

### 5-3. 역할 및 권한 관리
- **역할 관리**: 역할 생성, 수정, 삭제
- **권한 관리**: 세부 기능별 권한 설정
- **권한 그룹화**: 카테고리별 권한 분류

### 5-4. 메뉴 관리
- **계층형 메뉴**: 부모-자식 관계의 메뉴 구조
- **동적 메뉴**: 권한에 따른 메뉴 표시/숨김
- **메뉴 순서 관리**: 사용자 정의 메뉴 순서

### 5-5. 코드 관리
- **코드 그룹 관리**: 계층형 코드 그룹 구조
- **코드 관리**: 그룹별 세부 코드 관리
- **코드 검색 및 필터링**: 효율적인 코드 검색

### 5-6. 시스템 모니터링
- **대시보드**: 실시간 시스템 상태 모니터링
- **디바이스 관리**: 연결된 디바이스 상태 관리
- **디바이스 제어**: 카메라, 조명 등 디바이스 제어
- **설비 관리**: 설비 정보 및 상태 관리

---

## 6. 개발 환경 세팅

### 6-1. 필수 설치 프로그램
- [Node.js](https://nodejs.org/) (권장: LTS 버전 18.x 이상)
- [npm](https://www.npmjs.com/) (Node 설치 시 포함)
- [Docker](https://www.docker.com/) (선택, 컨테이너 환경 사용 시)
- [Git](https://git-scm.com/)

### 6-2. 프로젝트 설치 및 실행

```bash
# 1. 저장소 클론
git clone <레포지토리 주소>
cd prototype-next-app

# 2. 패키지 설치
npm install

# 3. 데이터베이스 설정
# PostgreSQL 데이터베이스 생성 및 연결 정보 설정
npm run db:setup

# 4. 개발 서버 실행
npm run dev
# http://localhost:3000 접속
```

### 6-3. Docker로 실행 (선택)

```bash
# 개발용 컨테이너 실행
docker-compose up --build

# 백그라운드 실행
docker-compose up -d

# 종료
docker-compose down
```

### 6-4. 데이터베이스 컨테이너 관리 명령어

```bash
# 데이터베이스 컨테이너 시작
npm run db:start

# 데이터베이스 컨테이너 중지
npm run db:stop

# 데이터베이스 컨테이너 리셋 (데이터 삭제)
npm run db:reset

# 데이터베이스 컨테이너 로그 확인
npm run db:logs

# Prisma 클라이언트 생성
npm run db:generate

# 마이그레이션 실행
npm run db:migrate

# 시드 데이터 삽입
npm run db:seed
```

---

## 7. 주요 개발 명령어

| 명령어                    | 설명                           |
|--------------------------|-------------------------------|
| `npm run dev`            | 개발 서버 실행 (Turbopack)     |
| `npm run build`          | 프로덕션 빌드                  |
| `npm run start`          | 빌드 후 서버 실행              |
| `npm run lint`           | ESLint를 통한 코드 검사        |
| `npm run db:setup`       | 데이터베이스 설정 스크립트 실행 |
| `npm run db:start`       | 로컬 PostgreSQL 데이터베이스 시작 |
| `npm run db:stop`        | 로컬 PostgreSQL 데이터베이스 중지 |
| `npm run db:reset`       | 데이터베이스 리셋 (데이터 삭제) |
| `npm run db:logs`        | 데이터베이스 로그 확인         |
| `npm run db:generate`    | Prisma 클라이언트 생성         |
| `npm run db:migrate`     | 마이그레이션 실행              |
| `npm run db:seed`        | 시드 데이터 삽입               |
| `npx prisma studio`      | Prisma Studio 실행 (DB GUI)   |
| `npx prisma db push`     | 스키마를 DB에 직접 푸시       |

---

## 8. 코드 컨벤션

### 8-1. 파일 및 폴더 명명 규칙
- **폴더명**: 소문자, 케밥케이스 (예: `user-management`)
- **파일명**: 
  - 컴포넌트: PascalCase (예: `UserList.tsx`)
  - 유틸리티: camelCase (예: `apiClient.ts`)
  - 상수: UPPER_SNAKE_CASE (예: `API_ENDPOINTS.ts`)

### 8-2. 컴포넌트 작성 규칙
- **함수형 컴포넌트**: React.memo 사용 권장
- **Props 인터페이스**: 컴포넌트 파일 내에서 타입 정의
- **이벤트 핸들러**: `handle` 접두사 사용 (예: `handleSubmit`)

### 8-3. 커밋 메시지 규칙
```
<type>: <description>

- feat: 새로운 기능 추가
- fix: 버그 수정
- docs: 문서 변경
- style: 코드 포맷팅 (기능 변경 없음)
- refactor: 코드 리팩토링
- test: 테스트 추가 또는 수정
- chore: 빌드 프로세스 또는 보조 도구 변경

예시: feat: 사용자 목록 페이지에 검색 기능 추가
```

---

## 9. 데이터베이스 스키마

### 9-1. 핵심 엔티티 관계도
```
User (사용자)
├── Profile (프로필) - 1:1
├── Role (역할) - N:1
└── UserPermission (사용자 권한) - 1:N

Role (역할)
├── User (사용자) - 1:N
├── RolePermission (역할 권한) - 1:N
└── Menu (메뉴) - N:N (MenuPermission을 통해)

Permission (권한)
├── RolePermission (역할 권한) - 1:N
├── UserPermission (사용자 권한) - 1:N
├── MenuPermission (메뉴 권한) - 1:N
└── Code (코드) - N:1

Menu (메뉴)
├── Menu (자식 메뉴) - 1:N (self-referencing)
└── MenuPermission (메뉴 권한) - 1:N

CodeGroup (코드 그룹)
├── Code (코드) - 1:N
└── CodeGroup (자식 그룹) - 1:N (self-referencing)
```

### 9-2. 주요 테이블 설명

#### User (사용자)
- 기본 사용자 정보 (이메일, 이름, 비밀번호)
- 시스템 계정 보호 (`isSystem` 플래그)
- 활성/비활성 상태 관리
- Profile과 1:1 관계

#### Role (역할)
- 사용자 그룹화를 위한 역할 정의
- 시스템 기본 역할 보호
- 권한과의 N:N 관계

#### Permission (권한)
- 세부 기능별 권한 정의
- 카테고리별 그룹화 (`Code` 테이블 참조)
- 시스템 기본 권한 보호
- 메뉴와의 N:N 관계

#### Menu (메뉴)
- 계층형 메뉴 구조 지원 (self-referencing)
- 권한 기반 메뉴 접근 제어
- 동적 메뉴 구성

#### CodeGroup (코드 그룹)
- 계층형 코드 그룹 구조 (self-referencing)
- 권한 카테고리, 역할 타입 등 분류
- 시스템 기본 코드 그룹 보호

#### Code (코드)
- 코드 그룹별 세부 코드 정의
- 권한 카테고리 분류에 사용
- 정렬 순서 및 활성 상태 관리

#### Dashboard (대시보드)
- 대시보드 설정 정보

---

## 10. API 구조

### 10-1. API 응답 형식
```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
```

### 10-2. 에러 처리
- **ApiError 클래스**: HTTP 상태 코드와 메시지 포함
- **자동 에러 처리**: TanStack Query의 QueryCache에서 통합 처리
- **인증 에러**: 401 에러 시 자동 로그아웃

### 10-3. API 클라이언트
- **apiClient 함수**: 공통 API 요청 처리
- **자동 헤더 설정**: Content-Type, Authorization 등
- **응답 검증**: success 플래그 및 HTTP 상태 코드 확인

---

## 11. 인증 및 권한 관리

### 11-1. NextAuth.js 설정
- **CredentialsProvider**: 사용자 정의 로그인 처리
- **JWT 전략**: 서버리스 환경에 최적화된 토큰 기반 인증
- **자동 토큰 갱신**: Refresh Token을 통한 Access Token 갱신

### 11-2. 미들웨어 보안
- **경로별 인증**: 보호된 경로에 대한 자동 인증 검사
- **자동 리다이렉션**: 인증되지 않은 사용자 로그인 페이지로 이동
- **로그인 상태 검증**: 이미 로그인된 사용자 대시보드로 이동

### 11-3. 권한 검증
- **컴포넌트 레벨**: 권한에 따른 UI 요소 표시/숨김
- **API 레벨**: 서버 사이드 권한 검증
- **메뉴 레벨**: 사용자별 메뉴 접근 제어

---

## 12. 컴포넌트 시스템

### 12-1. UI 컴포넌트 계층
```
@/components/ui/          # 기본 UI 컴포넌트 (shadcn/ui 기반)
├── button.tsx            # 버튼 컴포넌트
├── table.tsx             # 테이블 컴포넌트
├── dialog.tsx            # 다이얼로그 컴포넌트
├── sidebar.tsx           # 사이드바 컴포넌트
├── card.tsx              # 카드 컴포넌트
├── input.tsx             # 입력 컴포넌트
├── select.tsx            # 선택 컴포넌트
├── tabs.tsx              # 탭 컴포넌트
├── chart.tsx             # 차트 컴포넌트
├── accordion.tsx         # 아코디언 컴포넌트
├── avatar.tsx            # 아바타 컴포넌트
├── badge.tsx             # 배지 컴포넌트
├── breadcrumb.tsx        # 브레드크럼 컴포넌트
├── checkbox.tsx          # 체크박스 컴포넌트
├── collapsible.tsx       # 접을 수 있는 컴포넌트
├── command.tsx           # 명령어 컴포넌트
├── drawer.tsx            # 서랍 컴포넌트
├── dropdown-menu.tsx     # 드롭다운 메뉴 컴포넌트
├── label.tsx             # 라벨 컴포넌트
├── popover.tsx           # 팝오버 컴포넌트
├── separator.tsx         # 구분선 컴포넌트
├── sheet.tsx             # 시트 컴포넌트
├── skeleton.tsx          # 스켈레톤 컴포넌트
├── switch.tsx            # 스위치 컴포넌트
├── tooltip.tsx           # 툴팁 컴포넌트
└── ...                   # 기타 UI 컴포넌트

@/components/domain/      # 도메인별 비즈니스 컴포넌트
├── auth/                 # 인증 관련 컴포넌트
│   └── LoginForm.tsx     # 로그인 폼
├── user/                 # 사용자 관련 컴포넌트
│   ├── UserList.tsx      # 사용자 목록
│   ├── UserForm.tsx      # 사용자 폼
│   └── UserDialog.tsx    # 사용자 다이얼로그
├── role/                 # 역할 관련 컴포넌트
├── permission/           # 권한 관련 컴포넌트
├── menu/                 # 메뉴 관련 컴포넌트
├── code/                 # 코드 관련 컴포넌트
│   ├── CodeList.tsx      # 코드 목록
│   ├── CodeGroupList.tsx # 코드 그룹 목록
│   ├── CodeForm.tsx      # 코드 폼
│   └── CodeDialog.tsx    # 코드 다이얼로그
├── dashboard/            # 대시보드 관련 컴포넌트
│   ├── DashboardForm.tsx # 대시보드 폼
│   ├── CameraStatus.tsx  # 카메라 상태
│   ├── LightingStatus.tsx # 조명 상태
│   ├── DetectionModelStatus.tsx # 감지 모델 상태
│   ├── OnDeviceList.tsx  # 온디바이스 목록
│   ├── ProductPerformance.tsx # 제품 성능
│   └── SystemGraphs.tsx  # 시스템 그래프
├── device/               # 디바이스 관련 컴포넌트
│   ├── DeviceList.tsx    # 디바이스 목록
│   ├── DeviceForm.tsx    # 디바이스 폼
│   └── DeviceDialog.tsx  # 디바이스 다이얼로그
└── devicecontrol/        # 디바이스 제어 관련 컴포넌트
    ├── CameraControl.tsx # 카메라 제어
    ├── LightingControl.tsx # 조명 제어
    ├── AppliedValues.tsx # 적용된 값
    └── OnDeviceList.tsx  # 온디바이스 목록

@/components/common/      # 공통 컴포넌트
├── Loading.tsx           # 로딩 컴포넌트
├── ErrorMessage.tsx      # 에러 메시지 컴포넌트
├── Logo.tsx              # 로고 컴포넌트
├── LogoCi.tsx            # CI 로고 컴포넌트
├── StatsCard.tsx         # 통계 카드 컴포넌트
├── SearchFilter.tsx      # 검색 필터 컴포넌트
├── ConfirmDialog.tsx     # 커스텀텀 다이얼로그 컴포넌트
└── ToastProvider.tsx     # 토스트 프로바이더 컴포넌트
```

### 12-2. 컴포넌트 설계 원칙
- **단일 책임**: 하나의 컴포넌트는 하나의 책임만
- **재사용성**: props를 통한 유연한 구성
- **타입 안전성**: TypeScript를 통한 props 검증
- **성능 최적화**: React.memo, useCallback, useMemo 활용

---

## 13. 상태 관리

### 13-1. Zustand 스토어
- **userStore**: 사용자 정보 및 권한 관리
- **menuStore**: 메뉴 상태 및 권한 기반 필터링

### 13-2. TanStack Query
- **서버 상태 관리**: API 데이터 캐싱 및 동기화
- **자동 백그라운드 업데이트**: 데이터 최신성 유지
- **에러 처리**: 통합된 에러 처리 및 사용자 알림
- **낙관적 업데이트**: 사용자 경험 향상을 위한 즉시 UI 반영

---

## 14. FAQ

### Q1. 데이터베이스 연결이 안 돼요!
**A.** 다음을 확인하세요:
- `.env.local`의 `DATABASE_URL` 설정
- PostgreSQL 서버 실행 상태
- 데이터베이스 생성 여부

### Q3. 포트가 이미 사용 중이라고 나와요!
**A.** 기존에 실행 중인 서버를 종료하거나, `.env.local`에서 포트를 변경하세요.

### Q4. 권한이 없다고 나와요!
**A.** 사용자에게 적절한 역할과 권한이 할당되어 있는지 확인하세요.

### Q5. 컴포넌트가 렌더링되지 않아요!
**A.** 다음을 확인하세요:
- 컴포넌트 import 경로
- TypeScript 타입 오류
- 권한 설정 (권한이 필요한 컴포넌트인 경우)

---

## 15. 참고 자료

### 공식 문서
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Prisma 공식 문서](https://www.prisma.io/docs)
- [Radix UI 공식 문서](https://www.radix-ui.com/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [NextAuth.js 공식 문서](https://authjs.dev/)
- [TanStack Query 공식 문서](https://tanstack.com/query/latest)
- [shadcn/ui 공식 문서](https://ui.shadcn.com/)

### 개발 도구
- [Docker 공식 문서](https://docs.docker.com/)
- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/docs/)

---

## 📞 문의 및 기여

- **궁금한 점**: 팀 리더 또는 멘토에게 문의
- **버그 리포트**: Issue로 등록

---

## 📝 라이선스

이 프로젝트는 개발용 프레임워크입니다.

---

*마지막 업데이트: 2025년 10월*
