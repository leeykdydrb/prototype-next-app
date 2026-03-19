# 권한 관리 자동 동기화 구현 가이드

## 개요

권한 관리 API에서 DB 변경 시 자동으로 Keycloak과 동기화하도록 구현했습니다.

## 구현 내용

### 1. Keycloak Client Role 삭제 함수 추가

`src/lib/keycloak-admin.ts`에 `deleteClientRole` 함수를 추가했습니다.

```typescript
export async function deleteClientRole(roleName: string): Promise<void>
```

### 2. 권한 생성 시 자동 동기화

**파일**: `src/app/api/permission/route.ts` (POST)

- 권한 생성 시 `isActive: true`인 경우 자동으로 Keycloak에 Client Role 생성
- 동기화 실패 시에도 DB 저장은 성공 처리 (로그만 기록)

### 3. 권한 수정 시 자동 동기화

**파일**: `src/app/api/permission/[id]/route.ts` (PUT)

다음 경우를 자동 처리합니다:

#### 3.1 권한명 변경
- 기존 이름의 Client Role 삭제
- 새 이름의 Client Role 생성/업데이트

#### 3.2 활성화 상태 변경

**활성화 (`isActive: false` → `true`)**
- Keycloak에 Client Role 생성/업데이트

**비활성화 (`isActive: true` → `false`)**
- Keycloak에서 Client Role 삭제

**비활성화 상태 유지 (`isActive: false` → `false`)**
- 동기화 불필요 (이미 Keycloak에 없음)

#### 3.3 기타 필드 변경 (displayName, description 등)
- 활성화된 권한인 경우 Keycloak Role 정보 업데이트

### 4. 권한 삭제 시 자동 동기화

**파일**: `src/app/api/permission/[id]/route.ts` (DELETE)

- DB 삭제 전에 Keycloak에서 Client Role 삭제
- Keycloak 삭제 실패 시에도 DB 삭제는 계속 진행 (로그만 기록)

## Keycloak에서 권한 활성화/비활성화 처리 방법

### 현재 구현 방식

Keycloak에는 Role의 활성화/비활성화 개념이 직접적으로 없습니다. 따라서 다음과 같이 처리합니다:

| DB 상태 | Keycloak 처리 |
|---------|--------------|
| `isActive: true` | Client Role 생성/유지 |
| `isActive: false` | Client Role 삭제 |

### 장점

1. **명확한 일관성**: DB와 Keycloak 상태가 완전히 일치
2. **보안**: 비활성화된 권한이 Keycloak에 남아있어도 사용 불가
3. **단순성**: 구현이 간단하고 이해하기 쉬움

### 고려사항

1. **역할 매핑 영향**: 비활성화 시 Keycloak에서 Role이 삭제되므로, 해당 Role이 Realm Role에 할당되어 있으면 자동으로 제거됨
2. **재활성화**: 비활성화 후 다시 활성화하면 Role이 새로 생성되지만, Realm Role에 다시 할당하려면 역할 동기화가 필요할 수 있음

### 대안: Role 유지 방식 (선택사항)

만약 비활성화 시에도 Keycloak에 Role을 유지하고 싶다면, 다음과 같이 변경할 수 있습니다:

```typescript
// 비활성화 시 Role을 삭제하지 않고 유지
if (newIsActive) {
  await syncClientRole(permissionName, description);
} else if (oldIsActive && !newIsActive) {
  // Role 삭제 대신 description에 비활성화 표시
  await syncClientRole(permissionName, `${description} [비활성화]`);
}
```

하지만 이 방식은 DB와 Keycloak 간 불일치를 야기할 수 있으므로, 현재 구현(삭제 방식)을 권장합니다.

## 에러 처리

### 동기화 실패 시 처리

1. **DB 저장/수정/삭제는 성공 처리**
   - Keycloak 동기화 실패가 DB 작업을 막지 않음
   - 사용자 경험을 해치지 않음

2. **에러 로깅**
   - 모든 동기화 실패는 콘솔에 에러 로그 기록
   - 필요시 모니터링 시스템에 통합 가능

3. **재시도 메커니즘 (향후 개선)**
   - 작업 큐(BullMQ 등)를 사용하여 실패한 동기화 재시도 가능
   - 현재는 수동으로 `/api/admin/sync/permissions` 호출하여 재동기화

## 사용 예시

### 권한 생성

```typescript
// 프론트엔드에서
POST /api/permission
{
  "name": "equipment.read",
  "displayName": "설비 조회",
  "description": "설비 정보를 조회할 수 있는 권한",
  "categoryId": 1,
  "isActive": true
}

// 자동으로 Keycloak에 "equipment.read" Client Role 생성됨
```

### 권한 비활성화

```typescript
// 프론트엔드에서
PUT /api/permission/1
{
  "isActive": false
}

// 자동으로 Keycloak에서 "equipment.read" Client Role 삭제됨
```

### 권한명 변경

```typescript
// 프론트엔드에서
PUT /api/permission/1
{
  "name": "equipment.view"  // 기존: "equipment.read"
}

// 자동으로:
// 1. Keycloak에서 "equipment.read" Role 삭제
// 2. Keycloak에 "equipment.view" Role 생성
```

## 수동 동기화 API

자동 동기화가 실패한 경우나 전체 재동기화가 필요한 경우, 기존 수동 동기화 API를 사용할 수 있습니다:

- `POST /api/admin/sync/permissions` - 모든 활성화된 권한 동기화
- `POST /api/admin/sync/all` - 권한 및 역할 전체 동기화

## 주의사항

1. **권한명 변경 시**: Realm Role에 할당된 Client Role도 자동으로 업데이트되지 않으므로, 역할 동기화가 필요할 수 있습니다.

2. **동시성**: 여러 사용자가 동시에 같은 권한을 수정하는 경우, 마지막 변경사항이 적용됩니다.

3. **트랜잭션**: DB 저장과 Keycloak 동기화는 별도 트랜잭션이므로, DB 저장 후 Keycloak 동기화 실패 시 수동 재동기화가 필요할 수 있습니다.

## 향후 개선 사항

1. **비동기 처리**: 작업 큐를 사용하여 동기화를 비동기로 처리 (응답 시간 개선)
2. **재시도 메커니즘**: 실패한 동기화 자동 재시도
3. **이벤트 기반**: DB 변경 이벤트를 통해 동기화 (Prisma Middleware 활용)
4. **모니터링**: 동기화 성공/실패 메트릭 수집


