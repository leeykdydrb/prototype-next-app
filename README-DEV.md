# 로컬 개발 환경 설정 가이드

이 가이드는 로컬 개발 환경에서 Docker Desktop을 사용해 PostgreSQL 데이터베이스를 띄우고 개발하는 방법을 설명합니다.

## 🚀 빠른 시작

### 1. 환경 설정

```bash

# 1. 개발 환경 자동 설정
npm run db:setup
```

### 2. 수동 설정 (선택사항)

```bash
# PostgreSQL 컨테이너 시작
npm run db:start

# Prisma 마이그레이션 실행
npx prisma migrate dev

# 시드 데이터 삽입
npx tsx prisma/seed.ts

# 개발 서버 시작
npm run dev
```

## 📁 파일 구조

```
prototype-next-app/
├── docker-compose.local.db.yml  # 로컬 데이터베이스용 Docker Compose
├── .env.local                   # 로컬 환경 변수 (수동 생성 필요)
└── scripts/
    └── db-setup.mjs             # 자동 설정 스크립트
```

## 🛠️ 유용한 명령어

### 데이터베이스 관리

```bash
# PostgreSQL 컨테이너 시작
npm run db:start

# PostgreSQL 컨테이너 중지
npm run db:stop

# 데이터베이스 리셋 (데이터 삭제)
npm run db:reset

# PostgreSQL 로그 확인
npm run db:logs
```

### Prisma 명령어

```bash
# 마이그레이션 실행
npx prisma migrate dev

# 시드 데이터 삽입
npx tsx prisma/seed.ts

# Prisma Studio 실행 (데이터베이스 GUI)
npx prisma studio

# 스키마 동기화
npx prisma db push
```

## 🐳 Docker 설정

### PostgreSQL 컨테이너 정보

- **이미지**: postgres:17-alpine
- **포트**: 5432
- **데이터베이스**: postgres_dev
- **사용자**: postgres
- **비밀번호**: postgres123
- **볼륨**: postgres_dev_data

### 컨테이너 관리

```bash
# 컨테이너 상태 확인
docker ps

# 컨테이너 로그 확인
docker logs prototype-next-app-postgres-dev

# 컨테이너 내부 접속
docker exec -it prototype-next-app-postgres-dev psql -U postgres -d postgres_dev
```

## 🚨 문제 해결

### PostgreSQL 연결 실패

1. Docker Desktop이 실행 중인지 확인
2. 포트 5432가 다른 서비스에서 사용 중인지 확인
3. 컨테이너가 정상적으로 시작되었는지 확인: `docker ps`

### Prisma 마이그레이션 실패

1. 데이터베이스가 준비될 때까지 대기
2. `.env.local`의 `DATABASE_URL`이 올바른지 확인
3. 기존 마이그레이션 파일과 충돌이 있는지 확인

### 시드 데이터 삽입 실패

1. 마이그레이션이 성공적으로 완료되었는지 확인
2. 데이터베이스에 테이블이 생성되었는지 확인
3. 시드 스크립트에 오류가 없는지 확인

## 📝 개발 워크플로우

1. **개발 시작**
   ```bash
   npm run db:setup  # 또는 수동 설정
   npm run dev
   ```

2. **스키마 변경**
   ```bash
   # schema.prisma 수정 후
   npx prisma migrate dev --name "description"
   ```

3. **개발 종료**
   ```bash
   # Ctrl+C로 개발 서버 중지
   npm run db:stop  # 필요시 데이터베이스도 중지
   ```

4. **데이터베이스 리셋**
   ```bash
   npm run db:reset  # 모든 데이터 삭제 후 재시작
   npx prisma migrate dev
   npx tsx prisma/seed.ts
   ```

## 🔍 데이터베이스 접속

### Prisma Studio 사용 (권장)

```bash
npx prisma studio
# http://localhost:5555 에서 접속
```

### 직접 PostgreSQL 접속

```bash
# Docker 컨테이너 내부 접속
docker exec -it prototype-next-app-postgres-dev psql -U postgres -d postgres_dev

# 또는 외부 클라이언트 사용
# Host: localhost
# Port: 5432
# Database: postgres_dev
# Username: postgres
# Password: postgres123
```

## ⚠️ 주의사항

1. **데이터 보존**: `npm run db:reset` 명령어는 모든 데이터를 삭제합니다
2. **포트 충돌**: 다른 PostgreSQL 서비스가 5432 포트를 사용 중이면 충돌할 수 있습니다
3. **환경 변수**: `.env.local` 파일은 Git에 커밋하지 마세요
4. **Docker 리소스**: Docker Desktop이 충분한 메모리와 CPU를 할당받았는지 확인하세요
