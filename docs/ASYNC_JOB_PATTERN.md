# 비동기 작업 처리 패턴 가이드

브라우저에서 사용자가 요청을 보내면 Next.js 백엔드에서 MQ로 메시지를 전송하고, 브라우저는 작업 처리 중이라는 의미로 스피너를 표시하는 패턴입니다.

## 아키텍처

```
브라우저 → API Route → MQ → Worker → DB
   ↓                                    ↓
스피너 표시                        상태 업데이트
   ↓                                    ↓
폴링 (상태 확인) ← API Route ←─────────┘
```

## 흐름

1. **브라우저**: 사용자가 작업 요청 버튼 클릭
2. **API Route**: 작업 ID 생성 + MQ로 메시지 전송 + 즉시 응답
3. **브라우저**: 작업 ID 받고 스피너 표시 시작
4. **Worker**: MQ에서 메시지 받아서 작업 처리
5. **Worker**: 작업 완료 시 DB에 상태 업데이트
6. **브라우저**: 폴링으로 상태 확인 → 완료 시 결과 표시

## 파일 구조

```
src/
├── app/
│   └── api/
│       └── jobs/
│           └── route.ts          # 작업 요청/상태 확인 API
└── components/
    └── mq/
        ├── JobStatus.tsx         # 작업 상태 컴포넌트
        └── JobExample.tsx         # 사용 예시
```

## 사용 방법

### 1. 작업 요청 (API Route)

```typescript
// POST /api/jobs
const response = await fetch('/api/jobs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'EQUIPMENT_CREATE',
    data: { name: 'Equipment 1', location: 'Factory A' },
  }),
});

const { jobId, status } = await response.json();
// jobId를 사용하여 상태 확인
```

### 2. 작업 상태 확인 (폴링)

```typescript
// GET /api/jobs?jobId=xxx
const response = await fetch(`/api/jobs?jobId=${jobId}`);
const { status, progress, result, error } = await response.json();
```

### 3. React 컴포넌트에서 사용

```tsx
import { useJobRequest, JobStatus } from '@/components/mq/JobStatus';

function MyComponent() {
  const { submitJob, jobId, isLoading } = useJobRequest();

  const handleSubmit = async () => {
    await submitJob('EQUIPMENT_CREATE', { name: 'Test' });
  };

  return (
    <div>
      <button onClick={handleSubmit} disabled={isLoading}>
        작업 요청
      </button>
      
      {jobId && (
        <JobStatus
          jobId={jobId}
          onComplete={(result) => console.log('완료:', result)}
          onError={(error) => console.error('에러:', error)}
        />
      )}
    </div>
  );
}
```

## 실행 방법

### 1. 메시지 큐 시작

메시지 큐는 별도 프로젝트(`prototype-mq`)로 분리되었습니다.
MQ 프로젝트에서 실행하세요:

```bash
cd ../prototype-mq
npm start
# 또는
docker-compose up -d
```

### 2. 작업 워커 실행 (별도 프로젝트)

워커는 별도 프로젝트(`prototype-worker`)로 분리되었습니다.
워커 프로젝트에서 실행하세요:

```bash
cd prototype-worker
npm run dev
```

### 3. Next.js 앱 실행

```bash
npm run dev
```

### 4. 브라우저에서 테스트

```tsx
// 페이지에 컴포넌트 추가
import { JobExample } from '@/components/mq/JobExample';

export default function Page() {
  return <JobExample />;
}
```

## 장점

1. **비동기 처리**: 긴 작업을 백그라운드에서 처리
2. **사용자 경험**: 즉시 응답으로 반응성 향상
3. **확장성**: 워커를 여러 개 실행하여 처리량 증가 가능
4. **안정성**: 작업 실패 시 재시도 가능
5. **모니터링**: 작업 상태를 실시간으로 확인 가능

## 주의사항

1. **DB 스키마**: Job 테이블이 필요합니다 (현재는 주석 처리됨)
2. **폴링 간격**: 너무 짧으면 서버 부하, 너무 길면 반응성 저하
3. **타임아웃**: 작업이 너무 오래 걸리면 타임아웃 처리 필요
4. **에러 처리**: 작업 실패 시 사용자에게 적절한 피드백 제공

## Job 테이블 스키마 예시

```prisma
model Job {
  id        String   @id @default(uuid())
  type      String
  status    String   // PENDING, PROCESSING, COMPLETED, FAILED
  progress  Int      @default(0)
  data      Json?
  result    Json?
  error     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 개선 사항

1. **WebSocket**: 폴링 대신 WebSocket 사용으로 실시간 업데이트
2. **Redis**: 작업 상태를 Redis에 저장하여 빠른 조회
3. **작업 우선순위**: 중요도에 따른 작업 순서 조정
4. **작업 취소**: 진행 중인 작업 취소 기능
5. **작업 히스토리**: 완료된 작업 목록 조회


