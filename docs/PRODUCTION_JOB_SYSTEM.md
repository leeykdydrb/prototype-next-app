# 실무 수준 비동기 작업 시스템

실무에서 사용하는 수준의 비동기 작업 처리 시스템입니다.

## 주요 기능

### ✅ 구현된 기능

1. **작업 상태 관리**
   - PENDING → PROCESSING → COMPLETED/FAILED
   - 타임아웃 처리
   - 작업 취소

2. **재시도 로직**
   - 최대 재시도 횟수 설정
   - 자동 재시도
   - 재시도 횟수 추적

3. **진행률 추적**
   - 실시간 진행률 업데이트 (0-100%)
   - 단계별 진행률 표시

4. **우선순위 관리**
   - 작업 우선순위 설정
   - 우선순위 기반 처리 순서

5. **에러 핸들링**
   - 상세한 에러 메시지
   - 에러 로깅
   - 실패한 작업 추적

6. **작업 히스토리**
   - 작업 목록 조회
   - 필터링 (상태, 타입, 사용자)
   - 페이지네이션

## 데이터베이스 스키마

```prisma
model Job {
  id          String   @id @default(uuid())
  type        String
  status      JobStatus @default(PENDING)
  priority    Int      @default(0)
  progress    Int      @default(0)
  inputData   Json?
  result      Json?
  error       String?
  retryCount  Int      @default(0)
  maxRetries  Int      @default(3)
  timeoutAt   DateTime?
  startedAt   DateTime?
  completedAt DateTime?
  cancelledAt DateTime?
  cancelledBy String?
  createdBy   String?
  metadata    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum JobStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  CANCELLED
  TIMEOUT
}
```

## 설치 및 설정

### 1. 마이그레이션 실행

```bash
npm run db:migrate
```

### 2. 환경 변수 설정

`.env.local`:
```env
DATABASE_URL="postgresql://..."
MQ_TYPE="rabbitmq"  # 또는 "kafka"
RABBITMQ_URL="amqp://admin:admin123@localhost:5672"
KAFKA_BROKER_URL="localhost:9092"
```

## API 사용법

### 작업 생성

```typescript
POST /api/jobs
{
  "type": "EQUIPMENT_CREATE",
  "data": {
    "name": "Equipment 1",
    "location": "Factory A"
  },
  "priority": 10,           // 선택사항 (기본값: 0)
  "maxRetries": 3,          // 선택사항 (기본값: 3)
  "timeoutMinutes": 30,     // 선택사항 (기본값: 30)
  "createdBy": "user-123",  // 선택사항
  "metadata": {}             // 선택사항
}

// 응답
{
  "success": true,
  "jobId": "uuid",
  "status": "PENDING",
  "message": "Job queued successfully"
}
```

### 작업 상태 조회

```typescript
GET /api/jobs?jobId=xxx

// 응답
{
  "jobId": "xxx",
  "status": "PROCESSING",
  "progress": 50,
  "result": null,
  "error": null,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:01Z",
  "startedAt": "2024-01-01T00:00:00Z",
  "completedAt": null
}
```

### 작업 목록 조회

```typescript
GET /api/jobs?status=PENDING&type=EQUIPMENT_CREATE&limit=20&offset=0

// 응답
{
  "jobs": [...],
  "total": 100,
  "limit": 20,
  "offset": 0
}
```

### 작업 취소

```typescript
DELETE /api/jobs?jobId=xxx&cancelledBy=user-123

// 응답
{
  "success": true,
  "message": "Job cancelled successfully"
}
```

## 워커 실행

워커는 별도 프로젝트(`prototype-next-app-worker`)로 분리되었습니다.
워커 프로젝트에서 실행하세요:

```bash
cd prototype-next-app-worker
npm run dev
```

## React 컴포넌트 사용

```tsx
import { useJobRequest, JobStatus } from '@/components/mq/JobStatus';

function MyComponent() {
  const { submitJob, jobId, isLoading } = useJobRequest();

  const handleSubmit = async () => {
    await submitJob('EQUIPMENT_CREATE', {
      name: 'Equipment 1',
      location: 'Factory A',
    }, {
      priority: 10,
      timeoutMinutes: 60,
    });
  };

  return (
    <div>
      <button onClick={handleSubmit} disabled={isLoading}>
        작업 요청
      </button>
      
      {jobId && (
        <JobStatus
          jobId={jobId}
          onComplete={(result) => {
            console.log('완료:', result);
          }}
          onError={(error) => {
            console.error('에러:', error);
          }}
        />
      )}
    </div>
  );
}
```

## 작업 타입 추가

새로운 작업 타입을 추가하려면 `jobWorker.ts`에 핸들러를 추가하세요:

```typescript
// jobWorker.ts
async function handleNewJobType(jobId: string, data: any) {
  await updateJobProgress(jobId, 10);
  
  // 작업 처리
  await doSomething();
  await updateJobProgress(jobId, 50);
  
  await doSomethingElse();
  await updateJobProgress(jobId, 100);
  
  return { success: true, result: '...' };
}

// processJob 함수의 switch 문에 추가
case 'NEW_JOB_TYPE':
  result = await handleNewJobType(jobId, data);
  break;
```

## 모니터링 및 관리

### 타임아웃 작업 확인

```typescript
import { findTimeoutJobs } from '@/lib/job/jobService';

// 주기적으로 실행 (예: cron job)
const timeoutJobIds = await findTimeoutJobs();
console.log('Timeout jobs:', timeoutJobIds);
```

### 작업 통계

```typescript
import { getJobs } from '@/lib/job/jobService';

// 완료된 작업 수
const completed = await getJobs({ status: 'COMPLETED' });

// 실패한 작업 수
const failed = await getJobs({ status: 'FAILED' });

// 처리 중인 작업 수
const processing = await getJobs({ status: 'PROCESSING' });
```

## 모범 사례

1. **타임아웃 설정**: 작업 타입에 맞는 적절한 타임아웃 설정
2. **재시도 전략**: 네트워크 오류는 재시도, 비즈니스 로직 오류는 재시도 안 함
3. **진행률 업데이트**: 긴 작업의 경우 주기적으로 진행률 업데이트
4. **에러 로깅**: 상세한 에러 정보를 로그에 기록
5. **작업 취소**: 사용자가 취소할 수 있는 기능 제공
6. **모니터링**: 작업 상태를 모니터링하고 알림 설정

## 확장 가능한 기능

- [ ] WebSocket을 통한 실시간 업데이트 (폴링 대신)
- [ ] Redis를 통한 작업 상태 캐싱
- [ ] 작업 스케줄링 (예약 작업)
- [ ] 작업 의존성 관리
- [ ] 작업 결과 파일 저장
- [ ] 작업 알림 (이메일, 슬랙 등)
- [ ] 작업 대시보드 UI

## 트러블슈팅

### 작업이 처리되지 않을 때

1. 워커가 실행 중인지 확인
2. MQ 연결 상태 확인
3. 작업 상태 확인 (PENDING인지 확인)
4. 워커 로그 확인

### 작업이 계속 실패할 때

1. 에러 메시지 확인
2. 재시도 횟수 확인
3. 입력 데이터 검증
4. 타임아웃 설정 확인


