import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email?: string; // Keycloak 전용: 이메일 주소
      role: string;
      roles?: string[]; // Keycloak 전용: 여러 역할 지원
      permissions: string[];
    } & DefaultSession["user"] | null;
    accessToken: string | null;
    refreshToken: string | null;
    idToken?: string | null; // Keycloak 전용: ID 토큰
    expiresAt?: number | null;
    provider?: string;
    error?: string;
  }

  interface User extends DefaultUser {
    id: string;
    name: string;
    email?: string; // Keycloak 전용: 이메일 주소
    role: string;
    roles?: string[]; // Keycloak 전용: 여러 역할 지원
    permissions: string[];
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email?: string; // Keycloak 전용: 이메일 주소
    role: string;
    roles?: string[]; // Keycloak 전용: 여러 역할 지원
    permissions: string[];
    accessToken: string | null;
    refreshToken: string | null;
    idToken?: string | null; // Keycloak 전용: ID 토큰
    expiresAt: number | null; // Unix timestamp (ms)
    provider: string;
    error?: string;
    iat?: number; // JWT issued at (Unix timestamp in seconds)
  }
}

