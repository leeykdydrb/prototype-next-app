import { NextRequest, NextResponse } from "next/server";
import { signOut } from "@/lib/auth-keycloak";

/**
 * Keycloak 로그아웃 후 리다이렉트되는 엔드포인트
 * - Keycloak 세션은 이미 삭제된 상태
 * - 루트 페이지로 리다이렉트
 */
export async function GET(req: NextRequest) {
  await signOut({ redirect: false });

  const baseUrl = process.env.NEXTAUTH_URL 
    || `${req.headers.get('x-forwarded-proto') || 'http'}://${req.headers.get('host')}`;
  
  return NextResponse.redirect(new URL('/', baseUrl));
}
