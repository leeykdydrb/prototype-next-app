// lib/auth-keycloak.ts
// NextAuth v5 기반의 인증 설정 파일
// - Keycloak OIDC Provider를 이용한 외부 인증 서비스 연동
// - JWT 기반 토큰 전략 (Keycloak에서 발급한 accessToken/refreshToken 사용)
// - NextAuth의 Keycloak Provider가 자동으로 토큰 갱신 처리 (수동 갱신 로직 불필요)
// - 세션 만료 시간 체크 및 세션 무효화 처리
// - auth(), signIn(), signOut(), handlers 등 export되어 middleware와 route에서 사용됨

import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { jwtDecode } from "jwt-decode";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

type DecodedToken = {
  sub?: string; // Keycloak 사용자 UUID
  preferred_username?: string; // Keycloak 사용자 이름 (예: "admin")
  realm_access?: { roles?: string[] };
  permissions?: string[]; // Keycloak의 permissions 필드 (Client Scope에서 설정)
  exp?: number;
};

// ────────────────────────────────────────────
// Keycloak Access/ID Token → role 목록 추출
//   - realm role 추출
// ────────────────────────────────────────────
const extractRolesFromToken = (decodedToken: DecodedToken | null): string[] => {
  if (!decodedToken) return [];
  
  return decodedToken.realm_access?.roles || [];
};

// ────────────────────────────────────────────
// Keycloak ID/Access Token → permissions 추출
//   - 평면 구조: permissions: ["equipment.create", "user.read", ...]
//   - ID 토큰과 Access 토큰 모두에서 추출 가능
// ────────────────────────────────────────────
const extractPermissionsFromToken = (decodedToken: DecodedToken | null): string[] => {
  if (!decodedToken) return [];
  
  // 평면 구조 (permissions 배열)
  if (decodedToken.permissions && Array.isArray(decodedToken.permissions)) {
    return decodedToken.permissions;
  }
  
  return [];
};

const safeDecode = (token?: string): DecodedToken | null => {
  if (!token) return null;
  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
};

// ────────────────────────────────────────────
// refresh_token을 이용해 Keycloak에서 새 토큰 발급
//   - Access Token 만료/임박 시 호출
//   - 새 accessToken에서 roles/permissions 재추출
// ────────────────────────────────────────────
const refreshKeycloakToken = async (token: JWT): Promise<JWT> => {
  if (!token.refreshToken) {
    throw new Error("refreshToken 이 없어 토큰을 갱신할 수 없습니다.");
  }

  if (!process.env.KEYCLOAK_CLIENT_ID || !process.env.KEYCLOAK_CLIENT_SECRET || !process.env.KEYCLOAK_ISSUER) {
    throw new Error("Keycloak 환경변수가 설정되지 않았습니다.");
  }

  const params = new URLSearchParams();
  params.set("grant_type", "refresh_token");
  params.set("client_id", process.env.KEYCLOAK_CLIENT_ID);
  params.set("client_secret", process.env.KEYCLOAK_CLIENT_SECRET);
  params.set("refresh_token", String(token.refreshToken));

  const response = await fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.error("Keycloak 토큰 갱신 실패:", response.status, text);
    throw new Error("Failed to refresh Keycloak access token");
  }

  const data: {
    access_token: string;
    refresh_token?: string;
    id_token?: string;
  } = await response.json();

  const newAccessToken = data.access_token;
  const newRefreshToken = data.refresh_token ?? token.refreshToken ?? null;
  const newIdToken = data.id_token ?? token.idToken ?? null;

  const payload = safeDecode(newAccessToken);

  let accessTokenExpires: number | null = null;
  if (payload?.exp) {
    accessTokenExpires = payload.exp;
  }

  let roles: string[] = [];
  let permissions: string[] = token.permissions || [];

  if (payload) {
    roles = extractRolesFromToken(payload);
    permissions = extractPermissionsFromToken(payload);
    if (payload.preferred_username) token.id = payload.preferred_username;
  }

  const userRoles = roles.filter((r) => {
    return (
      !r.startsWith("default-roles-") &&
      r !== "offline_access" &&
      r !== "uma_authorization"
    );
  });
  const role = userRoles[0] || token.role || "";

  token.accessToken = newAccessToken;
  token.refreshToken = newRefreshToken;
  token.idToken = newIdToken;

  token.role = role;
  token.roles = userRoles.length > 0 ? userRoles : token.roles;
  token.permissions = permissions;

  token.accessTokenExpires = accessTokenExpires;
  token.expiresAt = accessTokenExpires;

  return token;
};

// 핵심 인증 기능 export
// - handlers: API route용 (app/api/auth/[...nextauth]/route.ts에서 사용)
// - signIn / signOut: 클라이언트 컴포넌트에서 호출
// - auth: middleware.ts, route.ts 등 서버 환경에서 세션 추출 시 사용
export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  // NextAuth URL 설정 (콜백 URL 생성에 필요)
  trustHost: true, // Vercel 등에서 자동으로 호스트 감지
  // Keycloak OIDC Provider 설정
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      // issuer는 Keycloak이 반환하는 값과 일치해야 함 (브라우저 URL: localhost:8082)
      issuer: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER,
      checks: ["pkce", "state"],
      // Docker 환경에서 브라우저와 서버의 Keycloak 접근 URL이 다를 경우 설정
      // - issuer: Keycloak이 반환하는 issuer와 일치 (브라우저 URL)
      // - authorization: 브라우저가 로그인 페이지로 이동할 때 사용 (외부 URL)
      // - token/userinfo: 서버 측에서 사용 (컨테이너 내부 URL)
      authorization: {
        url: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER 
          ? `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/auth`
          : undefined,
        params: {
          scope: "openid profile email", // 필요한 스코프 설정
        },
      },
      // 서버 측에서 토큰 교환 시 사용 (컨테이너 내부 URL: prototype-keycloak:8080)
      token: {
        url: process.env.KEYCLOAK_ISSUER 
          ? `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`
          : undefined,
      },
      // 서버 측에서 사용자 정보 조회 시 사용 (컨테이너 내부 URL)
      userinfo: {
        url: process.env.KEYCLOAK_ISSUER 
          ? `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`
          : undefined,
      },
      
      profile(profile: {
        name?: string;
        given_name?: string;
        family_name?: string;
        preferred_username?: string;
        email?: string;
        permissions?: string[]; // ID 토큰에 포함된 권한
      }) {
        const fullName = [profile.family_name, profile.given_name].filter(Boolean).join("") || "";
        return {
          id: profile.preferred_username || "",
          name: fullName,
          email: profile.email,
          role: "", // jwt 콜백에서 토큰에서 추출
          roles: [], // jwt 콜백에서 토큰에서 추출
          permissions: profile.permissions || [], // ID 토큰에 포함된 권한 사용
        };
      },
    }),
  ],
  // JWT & 세션 콜백 설정
  callbacks: {
    // 로그인 시 및 세션 정보 가져오려는 요청마다 호출
    async jwt({ token, user, account }) {
      // 로그인 직후 (user와 account가 존재하는 상태)
      if (user && account) {
        token.provider = account.provider;
        
        // Keycloak OIDC Provider의 경우
        if (account.provider === "keycloak") {
          let roles: string[] = [];
          let permissions: string[] = user.permissions || [];
          let userId = user.id; // profile 콜백에서 설정한 값 (preferred_username)
          let expiresAt: number | null = null;
          
          // Access 토큰 디코딩 (역할, 권한, 사용자 정보 모두 포함)
          // - Access 토큰에 realm_access.roles와 permissions 모두 포함
          // - 토큰 갱신 시에도 항상 최신 정보 유지
          if (account.access_token) {
            const accessTokenPayload = safeDecode(account.access_token);
            if (accessTokenPayload) {
              // Roles 추출
              roles = extractRolesFromToken(accessTokenPayload);
              
              // Permissions 추출 (항상 최신 값 사용)
              permissions = extractPermissionsFromToken(accessTokenPayload);
              if (userId === user.id && accessTokenPayload.preferred_username) userId = accessTokenPayload.preferred_username;
              if (accessTokenPayload.exp) expiresAt = accessTokenPayload.exp;
            }
          }
          
          // Keycloak 시스템 기본 역할 필터링
          const userRoles = roles.filter((r) => {
            // 다음 패턴의 역할들은 제외:
            // - default-roles-* (Realm 기본 역할)
            // - offline_access (오프라인 토큰 권한)
            // - uma_authorization (UMA 권한)
            return !r.startsWith('default-roles-') && 
                   r !== 'offline_access' && 
                   r !== 'uma_authorization';
          });
          
          // 첫 번째 사용자 역할 선택 (시스템 역할 제외)
          const role = userRoles[0] || "";
          
          token.id = userId;
          token.name = user.name;
          token.email = user.email;
          token.role = role || user.role || "";
          token.roles = userRoles.length > 0 ? userRoles : (user.roles || []);
          token.permissions = permissions;
          
          // Keycloak에서 발급한 토큰 정보 저장
          token.accessToken = account.access_token || null;
          token.refreshToken = account.refresh_token || null;
          token.idToken = account.id_token || null; // 로그아웃 시 필요
          token.expiresAt = expiresAt;
        }

        return token;
      }

      // 로그인 직후가 아닌 경우 (세션 갱신 시)
      if (!account) {
        // expiresAt이 없으면 기존 토큰 반환
        if (!token.expiresAt) {
          if (!token.idToken) {
            token.idToken = null;
          }
          return token;
        }

        // 아직 만료 전이면 (여유 1분 남았을 때까지) 그대로 사용
        const shouldRefresh = Date.now() >= (token.expiresAt * 1000) - 60000;
        if (!shouldRefresh) {
          if (!token.idToken) {
            token.idToken = null;
          }
          return token;
        }

        // Access Token 만료/임박 → refresh 시도
        try {
          const newToken = await refreshKeycloakToken(token);
          console.log("Keycloak access token refresh 성공:", newToken.id);
          return newToken;
        } catch (error) {
          console.error("Keycloak access token refresh 실패:", error);
          // refresh 실패 시 토큰 정리 → 세션 콜백에서 만료로 처리
          token.accessToken = null;
          token.refreshToken = null;
          token.idToken = null;
          token.expiresAt = null;
          return token;
        }
      }

      return token;
    },
    // 클라이언트에서 useSession() 호출 시 반환할 데이터 구성
    async session({ session, token }: { session: Session; token: JWT | null }) {
      // token이 null이면 세션이 만료된 것
      if (!token) {
        session.user = null;
        session.accessToken = null;
        session.refreshToken = null;
        session.idToken = null;
        session.expiresAt = null;
        session.provider = undefined;
        return session;
      }

      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
        roles: token.roles || (token.role ? [token.role] : []), // 여러 역할 지원
        permissions: token.permissions || [],
      } as Session["user"];

      // Keycloak 토큰 정보를 세션에 포함
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.idToken = token.idToken;
      session.expiresAt = token.expiresAt;
      session.provider = token.provider;

      return session;
    },
  },
  // JWT 기반 세션 관리 사용 (쿠키 + 토큰 기반 인증)
  session: {
    strategy: "jwt",
    // 세션 만료 시간 설정 (초 단위)
    // 8시간 (28800초), 12시간 (43200초), 24시간 (86400초) 등
    maxAge: Number(process.env.SESSION_MAX_AGE) || 60 * 60 * 8, // 기본값: 8시간
  },
  // JWT 토큰 설정
  jwt: {
    // JWT 토큰 최대 유효 시간 (초 단위)
    // 세션 maxAge와 동일하게 설정
    maxAge: Number(process.env.SESSION_MAX_AGE) || 60 * 60 * 8, // 기본값: 8시간
  },
  pages: {
    error: "/auth/error",
  },
});