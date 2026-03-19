# Keycloak 인증 설정 가이드

이 문서는 NextAuth v5를 사용하는 Next.js 애플리케이션에서 Keycloak을 외부 인증 서비스로 사용하는 방법을 설명합니다.

## 개요

기존의 자체 인증 시스템(CredentialsProvider)에서 Keycloak OIDC Provider로 전환하여 외부 인증 서비스를 사용합니다.

## 주요 변경사항

1. **Provider 변경**: `CredentialsProvider` → `KeycloakProvider` (OIDC 표준)
2. **자동 토큰 갱신**: Keycloak OIDC Provider가 자동으로 토큰 갱신 처리
3. **표준 OIDC 플로우**: Authorization Code Flow 사용

## 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가하세요:

```env
# NextAuth 기본 설정
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Keycloak 설정
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=your-realm-name
KEYCLOAK_CLIENT_ID=your-client-id
KEYCLOAK_CLIENT_SECRET=your-client-secret

# Keycloak Admin API 설정 (사용자 관리 등 Admin API 사용 시 필요)
KEYCLOAK_ADMIN_CLIENT_ID=nextjs-app-admin
KEYCLOAK_ADMIN_CLIENT_SECRET=your-admin-client-secret

# 또는 전체 Issuer URL을 직접 지정할 수도 있습니다
# KEYCLOAK_ISSUER=http://localhost:8080/realms/your-realm-name
```

### 환경 변수 설명

- `NEXTAUTH_SECRET`: NextAuth 세션 암호화에 사용되는 비밀 키 (랜덤 문자열 생성 권장)
- `NEXTAUTH_URL`: 애플리케이션의 공개 URL
- `KEYCLOAK_URL`: Keycloak 서버의 기본 URL (예: `http://localhost:8080`)
- `KEYCLOAK_REALM`: Keycloak Realm 이름
- `KEYCLOAK_CLIENT_ID`: Keycloak에서 생성한 Client ID
- `KEYCLOAK_CLIENT_SECRET`: Keycloak Client Secret (confidential client인 경우)
- `KEYCLOAK_ADMIN_CLIENT_ID`: Admin API용 클라이언트 ID (Service Account 활성화된 confidential client)
- `KEYCLOAK_ADMIN_CLIENT_SECRET`: Admin API용 클라이언트 Secret
- `KEYCLOAK_ISSUER`: (선택) 전체 Issuer URL을 직접 지정 (설정 시 `KEYCLOAK_URL`과 `KEYCLOAK_REALM` 무시)

## Keycloak 설정

### 0. 영구 관리자 계정 생성 (선택사항, 권장)

임시 관리자 계정 경고가 표시되면, 보안을 위해 영구 관리자 계정을 생성하세요:

1. 관리 콘솔 상단의 사용자 이름 클릭 → "Create new user"
2. 사용자 정보 입력 (Username, Email 등)
3. "Credentials" 탭에서 비밀번호 설정 (Temporary: Off)
4. "Role mapping" 탭 → "Assign role" → "Filter by clients" → "realm-management" → "realm-admin" 역할 할당
5. 새 계정으로 로그인하여 사용

**참고**: 개발 환경에서는 임시 계정을 그대로 사용해도 되지만, 프로덕션 환경에서는 반드시 영구 계정을 생성하세요.

### 1. Realm 생성

1. Keycloak 관리 콘솔에 로그인
2. Manage realms 에서 **Create Realm** 선택
3. Realm 이름 입력 (예: `nextcube`)
4. **Create** 클릭

### 2. Client 생성

1. 왼쪽 메뉴에서 **Clients** 클릭
2. **Create client** 버튼 클릭
3. 다음 설정 입력:
   - **Client type**: `OpenID Connect`
   - **Client ID**: `nextjs-app` (또는 원하는 이름)
   - **Next**: 클릭

4. Capability config에서:
   - **Client authentication**: `On`
   - **Authorization**: `On`
   - **Authentication flow**: `Standard flow` 활성화
   - **Next**: 클릭

5. Login settings에서:
   - **Valid redirect URIs**: 
     ```
     http://localhost:3000/api/auth/callback/keycloak
     ```
   - **Valid post logout redirect URIs**
     ```
     http://localhost:3000/*
     ```
   - **Web origins**: 
     ```
     http://localhost:3000
     ```
   - **Save**: 클릭

6. Credentials 탭에서:
   - **Client secret** 복사하여 `.env.local`의 `KEYCLOAK_CLIENT_SECRET`에 설정

### 2-2. Admin API용 클라이언트 생성 (사용자 관리 등 Admin API 사용 시 필요)

Admin API를 사용하여 사용자 생성, 역할 할당 등을 하려면 Service Account가 활성화된 별도의 클라이언트가 필요합니다.

1. 왼쪽 메뉴에서 **Clients** 클릭
2. **Create client** 버튼 클릭
3. 다음 설정 입력:
   - **Client type**: `OpenID Connect`
   - **Client ID**: `nextjs-app-admin` (또는 원하는 이름)
   - **Next**: 클릭

4. Capability config에서:
   - **Client authentication**: `On` (중요!)
   - **Service accounts roles**: `On` (중요! Service Account 활성화)
   - **Next**: 클릭

5. Login settings에서:
   - **Valid redirect URIs**: (비워둬도 됨, Admin API 전용)
   - **Save**: 클릭

6. **Service accounts roles** 탭에서:
   - **Assign role** 버튼 클릭
   - **Client roles** 선택 → `realm-management` 선택
   - 필요한 역할 할당:
     - `realm-admin` (전체 관리)
     - `manage-users` (사용자 관리)
     - `manage-realm` (Realm 관리)
     - `view-users` (사용자 조회)
     - 등 필요한 권한 선택
   - **Assign** 클릭

7. Credentials 탭에서:
   - **Client secret** 복사하여 `.env.local`의 `KEYCLOAK_ADMIN_CLIENT_SECRET`에 설정
   - `.env.local`에 다음도 추가:
     ```env
     KEYCLOAK_ADMIN_CLIENT_ID=nextjs-app-admin
     ```

**중요**: 
- `admin-cli`는 public client이므로 Service Account를 사용할 수 없습니다.
- 반드시 confidential client (Client authentication: On)를 사용해야 합니다.
- Service accounts roles가 활성화되어 있어야 합니다.

### 3. Realm Roles 생성

시스템에서 사용하는 역할을 Keycloak에 생성합니다:

1. 왼쪽 메뉴에서 **Realm roles** 클릭
2. **Create role** 버튼 클릭
3. 다음 역할들을 생성:
   - **ADMIN** (관리자) - 시스템 전체 관리 권한
   - **MANAGER** (매니저) - 설비 관리 권한
   - **USER** (사용자) - 기본 사용자 권한

자세한 역할 및 권한 설정은 `KEYCLOAK_ROLE_PERMISSION_SETUP.md`를 참조하세요.

### 4. 사용자 생성 및 역할 설정

1. 왼쪽 메뉴에서 "Users" 클릭
2. "Add user" 버튼 클릭
3. 사용자 정보 입력 후 저장
4. "Credentials" 탭에서 비밀번호 설정
5. "Role mapping" 탭에서 역할 할당:
   - "Assign role" 버튼 클릭
   - Realm roles 선택
   - **ADMIN**, **MANAGER**, 또는 **USER** 중 하나 선택
   - "Assign" 클릭
   
**중요**: 
- 사용자에게 역할을 할당하지 않으면 애플리케이션에서 권한이 없는 것으로 인식됩니다.
- 테스트를 위해 최소한 하나의 역할을 할당하세요.
- 역할별 권한 매핑은 `KEYCLOAK_ROLE_PERMISSION_SETUP.md`를 참조하세요.

## Docker Compose로 Keycloak 실행

Keycloak은 별도의 프로젝트 폴더(`prototype-keycloak`)에서 관리됩니다.

### Keycloak 시작

```bash
# prototype-keycloak 폴더로 이동
cd ../prototype-keycloak

# Keycloak 시작
docker-compose up -d

# 상태 확인
docker-compose ps
```

### Keycloak 중지

```bash
docker-compose down
```

자세한 내용은 `prototype-keycloak/README.md`를 참조하세요.

## 로그인 플로우

1. 사용자가 보호된 페이지 접근 시도
2. 미들웨어에서 인증 확인
3. 인증되지 않은 경우 Keycloak 로그인 페이지로 자동 리다이렉트
4. Keycloak에서 로그인 완료 후 콜백 URL로 리다이렉트
5. NextAuth가 토큰을 받아 세션 생성
6. 사용자는 원래 요청한 페이지로 리다이렉트됨

## 코드 변경사항

### auth.ts

- `CredentialsProvider` → `KeycloakProvider`로 변경
- JWT 콜백에서 Keycloak 토큰 처리
- 세션 콜백에서 Keycloak 사용자 정보 매핑

### 타입 정의 (next-auth.d.ts)

- `Session` 인터페이스에 `idToken` 추가
- `JWT` 인터페이스에 `idToken`, `email`, `roles` 추가
- `User` 인터페이스에 `email`, `roles` 추가

## 로그인 페이지 수정

Keycloak OIDC Provider를 사용하면 로그인 페이지에서 `signIn("keycloak")`를 호출하면 자동으로 Keycloak 로그인 페이지로 리다이렉트됩니다.

```tsx
import { signIn } from "@/lib/auth";

// 로그인 버튼 클릭 시
await signIn("keycloak", { 
  callbackUrl: "/dashboard" 
});
```

또는 자동 리다이렉트를 원하지 않는 경우, 로그인 페이지에서 직접 버튼을 제공할 수 있습니다.

## 문제 해결

### 1. "Invalid redirect URI" 오류

- Keycloak Client 설정의 "Valid redirect URIs"에 정확한 콜백 URL이 포함되어 있는지 확인
- 콜백 URL 형식: `{NEXTAUTH_URL}/api/auth/callback/keycloak`

### 2. "Client authentication failed" 오류

- `KEYCLOAK_CLIENT_SECRET`이 올바른지 확인
- Keycloak Client의 "Credentials" 탭에서 Client Secret 확인

### 3. 역할 정보가 세션에 포함되지 않는 경우

- Keycloak에서 토큰에 역할 정보를 포함하도록 Mapper 설정 확인
- `profile` 콜백에서 역할 정보 매핑 로직 확인

### 4. 토큰 갱신 실패

- Keycloak의 토큰 만료 시간 설정 확인
- Refresh token이 올바르게 발급되는지 확인

### 5. "Client not enabled to retrieve service account" 오류

- Admin API를 사용할 때 발생하는 오류입니다.
- **원인**: `admin-cli`는 public client이므로 Service Account를 사용할 수 없습니다.
- **해결 방법**:
  1. Service Account가 활성화된 confidential client 생성 (2-2 섹션 참조)
  2. `KEYCLOAK_ADMIN_CLIENT_ID`와 `KEYCLOAK_ADMIN_CLIENT_SECRET` 환경 변수 설정
  3. 생성한 클라이언트의 "Service accounts roles" 탭에서 필요한 권한 할당

## 참고 자료

- [NextAuth.js Keycloak Provider 문서](https://next-auth.js.org/providers/keycloak)
- [Keycloak 공식 문서](https://www.keycloak.org/documentation)
- [OIDC 표준 스펙](https://openid.net/specs/openid-connect-core-1_0.html)

