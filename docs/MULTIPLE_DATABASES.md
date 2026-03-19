# Prisma에서 여러 데이터베이스 사용하기

## 방법 1: 다른 데이터베이스로 변경

현재 PostgreSQL을 사용 중이라면, `schema.prisma` 파일의 `datasource`만 변경하면 됩니다.

### Prisma가 지원하는 모든 데이터베이스

Prisma는 다음과 같은 데이터베이스를 지원합니다:

#### 자체 호스팅 데이터베이스 (Self-hosted)

| Provider | Prisma Provider 값 | 지원 버전 | 설명 |
|----------|-------------------|----------|------|
| **PostgreSQL** | `postgresql` | 9.6 ~ 17 | 가장 널리 사용되는 오픈소스 관계형 DB |
| **MySQL** | `mysql` | 5.6, 5.7, 8.0, 8.4 | 인기 있는 오픈소스 관계형 DB |
| **MariaDB** | `mysql` | 10.0+ | MySQL의 포크, MySQL과 동일한 provider 사용 |
| **SQLite** | `sqlite` | 모든 버전 | 경량 파일 기반 DB, 개발/테스트에 적합 |
| **Microsoft SQL Server** | `sqlserver` | 2017, 2019, 2022 | Microsoft의 관계형 DB |
| **CockroachDB** | `cockroachdb` | 21.2.4+ | 분산 SQL 데이터베이스 |
| **MongoDB** | `mongodb` | 4.2+ | NoSQL 문서 데이터베이스 (Prisma 2.x+) |

#### 관리형 데이터베이스 서비스 (Managed Database Services)

| 서비스 | Provider 값 | 설명 |
|--------|------------|------|
| **AWS Aurora** | `postgresql` 또는 `mysql` | AWS의 관리형 관계형 DB |
| **AWS Aurora Serverless** | `postgresql` 또는 `mysql` | 서버리스 버전 (Data API 미지원) |
| **Azure SQL** | `sqlserver` | Microsoft Azure의 관리형 SQL Server |
| **Neon Serverless Postgres** | `postgresql` | 서버리스 PostgreSQL |
| **PlanetScale** | `mysql` | 서버리스 MySQL 플랫폼 |
| **MongoDB Atlas** | `mongodb` | MongoDB의 클라우드 서비스 |
| **CockroachDB Cloud** | `cockroachdb` | CockroachDB의 관리형 서비스 |
| **Cloudflare D1** | `sqlite` | Cloudflare의 서버리스 SQLite (프리뷰) |
| **Aiven** | `postgresql` 또는 `mysql` | 오픈소스 DB 관리 서비스 |

#### 연결 문자열 예시

```env
# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# MySQL / MariaDB
DATABASE_URL="mysql://user:password@localhost:3306/mydb"

# SQLite
DATABASE_URL="file:./dev.db"

# SQL Server
DATABASE_URL="sqlserver://localhost:1433;database=mydb;user=sa;password=YourPassword;trustServerCertificate=true"

# CockroachDB
DATABASE_URL="postgresql://user:password@localhost:26257/mydb?sslmode=require"

# MongoDB
DATABASE_URL="mongodb://user:password@localhost:27017/mydb"

# Neon (PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# PlanetScale (MySQL)
DATABASE_URL="mysql://user:password@aws.connect.psdb.cloud/mydb?sslaccept=strict"
```

### 예시: MySQL로 변경

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

환경 변수도 변경:
```env
DATABASE_URL="mysql://user:password@localhost:3306/mydb"
```

---

## 방법 2: 여러 데이터베이스 동시 사용

Prisma는 하나의 `schema.prisma` 파일에 하나의 `datasource`만 지원합니다. 
여러 데이터베이스를 사용하려면 **별도의 스키마 파일**을 만들어야 합니다.

### 구조 예시

```
prisma/
  ├── schema.prisma          # 메인 DB (PostgreSQL)
  └── schema-analytics.prisma # 분석용 DB (MySQL)
```

### 구현 단계

#### 1. 두 번째 스키마 파일 생성

`prisma/schema-analytics.prisma` 파일 생성:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma-analytics"
}

datasource db {
  provider = "mysql"
  url      = env("ANALYTICS_DATABASE_URL")
}

model AnalyticsEvent {
  id        Int      @id @default(autoincrement())
  eventType String
  userId    String?
  data      Json?
  createdAt DateTime @default(now())
}
```

#### 2. 환경 변수 설정

`.env.local` 파일에 추가:

```env
# 메인 DB
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# 분석용 DB
ANALYTICS_DATABASE_URL="mysql://user:password@localhost:3306/analytics"
```

#### 3. package.json에 스크립트 추가

```json
{
  "scripts": {
    "db:generate": "dotenv -e .env.local -- npx prisma generate",
    "db:generate:analytics": "dotenv -e .env.local -- npx prisma generate --schema=./prisma/schema-analytics.prisma",
    "db:generate:all": "npm run db:generate && npm run db:generate:analytics",
    "db:migrate": "dotenv -e .env.local -- npx prisma migrate dev --name init",
    "db:migrate:analytics": "dotenv -e .env.local -- npx prisma migrate dev --schema=./prisma/schema-analytics.prisma --name init"
  }
}
```

#### 4. Prisma Client 인스턴스 생성

`src/lib/prisma-analytics.ts` 파일 생성:

```typescript
import { PrismaClient as AnalyticsPrismaClient } from "../generated/prisma-analytics";

type GlobalWithAnalyticsPrisma = typeof globalThis & {
  analyticsPrisma?: AnalyticsPrismaClient;
};

const globalForAnalyticsPrisma = globalThis as GlobalWithAnalyticsPrisma;

export const analyticsPrisma = 
  globalForAnalyticsPrisma.analyticsPrisma ?? 
  new AnalyticsPrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    errorFormat: "pretty",
  });

if (process.env.NODE_ENV !== "production") {
  globalForAnalyticsPrisma.analyticsPrisma = analyticsPrisma;
}

const gracefulShutdown = async (signal: string) => {
  console.log(`Received ${signal}, shutting down analytics DB gracefully...`);
  try {
    await analyticsPrisma.$disconnect();
    console.log('Analytics Prisma client disconnected successfully');
  } catch (error) {
    console.error('Error during Analytics Prisma disconnect:', error);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
```

#### 5. 사용 예시

```typescript
import { prisma } from "@/lib/prisma"; // 메인 DB
import { analyticsPrisma } from "@/lib/prisma-analytics"; // 분석용 DB

// 메인 DB 사용
const users = await prisma.user.findMany();

// 분석용 DB 사용
await analyticsPrisma.analyticsEvent.create({
  data: {
    eventType: "user_login",
    userId: user.id,
    data: { timestamp: new Date() }
  }
});
```

---

## 방법 3: 동일한 DB, 다른 스키마/데이터베이스

PostgreSQL에서 여러 스키마를 사용하는 경우:

### ⚠️ 중요: 명시적 설정이 필요합니다

**Prisma는 기본적으로 `public` 스키마만 사용합니다.** 
`schemas` 옵션과 `@@schema` 어노테이션을 생략하면 모든 모델이 `public` 스키마에 생성됩니다.

### 올바른 설정 방법

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["public", "analytics", "logs"]  // ✅ 반드시 명시 필요
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["multiSchema"]  // ✅ 필수 (Prisma 5.0+)
}

model User {
  id   Int    @id @default(autoincrement())
  name String
  
  @@schema("public")  // ✅ 명시적으로 지정 필요
}

model AnalyticsEvent {
  id        Int      @id @default(autoincrement())
  eventType String
  
  @@schema("analytics")  // ✅ 명시적으로 지정 필요
}

model LogEntry {
  id        Int      @id @default(autoincrement())
  message   String
  
  @@schema("logs")  // ✅ 명시적으로 지정 필요
}
```

### ❌ 잘못된 예시 (생략 시)

```prisma
// 이렇게 하면 모든 모델이 public 스키마에 생성됨
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // schemas 옵션 생략 → public만 사용
}

model User {
  id   Int    @id
  name String
  // @@schema 생략 → public 스키마에 생성됨
}

model AnalyticsEvent {
  id   Int    @id
  // @@schema 생략 → 이것도 public 스키마에 생성됨 (analytics가 아님!)
}
```

### 요약

- **`schemas` 옵션**: Prisma가 어떤 스키마를 스캔/생성할지 지정 (생략 시 `public`만 사용)
- **`@@schema` 어노테이션**: 각 모델이 어느 스키마에 속하는지 지정 (생략 시 `public` 스키마)
- **`previewFeatures = ["multiSchema"]`**: 여러 스키마 사용을 위한 필수 설정 (Prisma 5.0+)

---

## 주의사항

1. **마이그레이션 관리**: 각 스키마 파일마다 별도로 마이그레이션을 실행해야 합니다.
2. **트랜잭션**: 다른 데이터베이스 간에는 트랜잭션을 사용할 수 없습니다.
3. **관계**: 다른 데이터베이스 간에는 Prisma 관계를 정의할 수 없습니다.
4. **성능**: 여러 데이터베이스를 사용하면 연결 관리가 복잡해질 수 있습니다.

---

## 권장 사항

- **단일 DB 권장**: 가능하면 하나의 데이터베이스를 사용하는 것이 좋습니다.
- **읽기 전용 복제본**: 읽기 성능이 필요하면 PostgreSQL의 읽기 전용 복제본을 사용하세요.
- **분리 필요 시**: 분석, 로깅 등 용도가 명확히 다를 때만 별도 DB를 고려하세요.

