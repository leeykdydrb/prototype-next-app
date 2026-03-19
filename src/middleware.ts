// middleware.ts
// next-auth의 auth() 미들웨어를 사용하여 특정 경로에 대해 인증을 강제함
// - Fetch 요청(SPA 네비게이션) 시 401 응답 → Next.js가 브라우저 네비게이션으로 fallback
// - 브라우저 네비게이션 시 Keycloak 로그인 페이지로 리다이렉트
// - Keycloak 세션이 유효하면 SSO로 자동 로그인, 만료 시 로그인 화면 표시

import { auth } from "@/lib/auth-keycloak";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, headers } = req;
  const isAuthenticated = !!req.auth?.user;
  const isAuthPage = nextUrl.pathname.startsWith("/auth/");
  
  // Sec-Fetch-Mode 헤더로 요청 유형 구분
  // - navigate: 브라우저 네비게이션 (주소창 입력, 새로고침 등)
  // - cors/same-origin: fetch 요청 (SPA 네비게이션, RSC 등)
  const secFetchMode = headers.get("Sec-Fetch-Mode");
  const isFetchRequest = secFetchMode !== "navigate" && secFetchMode !== null;

  // 인증되지 않은 사용자가 보호된 페이지 접근 시 (인증 관련 페이지 제외)
  if (!isAuthenticated && !isAuthPage) {
    // Fetch 요청: 401 응답 (CORS 방지, Next.js가 브라우저 네비게이션으로 fallback)
    if (isFetchRequest) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // 브라우저 네비게이션: Keycloak 로그인으로 리다이렉트
    const signinUrl = new URL("/api/auth/signin/keycloak", req.url);
    signinUrl.searchParams.set("callbackUrl", nextUrl.href);
    return NextResponse.redirect(signinUrl);
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    // '/dashboard/:path*', '/equipment/:path*', '/admin/:path*',
    // '/((?!login|api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|svg|ico|webp)$).*)',
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|svg|ico|webp)$).*)',
  ],
};