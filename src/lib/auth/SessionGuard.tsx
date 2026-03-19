// lib/auth/SessionGuard.tsx
// 클라이언트 측 세션 관리 컴포넌트
// - useSession()으로 세션 상태 확인 및 zustand에 사용자 정보 저장
// - 세션 만료 시 미들웨어가 처리하지 못한 경우 백업으로 리다이렉트 수행

"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useSessionUser } from "@/lib/auth/useSessionUser";
import Loading from "@/components/common/Loading";

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isRedirecting = useRef(false);
  const isAuthPage = pathname.startsWith("/auth/");

  // 사용자 정보를 zustand store에 저장
  useSessionUser(session, status);

  console.log('SessionGuard: ' + status);

  // 세션 만료 시 백업 리다이렉트 (미들웨어가 처리하지 못한 경우)
  useEffect(() => {
    if (status === "unauthenticated" && !isAuthPage && !isRedirecting.current) {
      isRedirecting.current = true;
      const callbackUrl = encodeURIComponent(window.location.href);
      window.location.replace(`/api/auth/signin/keycloak?callbackUrl=${callbackUrl}`);
    }
  }, [status, isAuthPage]);

  if (status === "loading") return <Loading message="로딩중..." />;

  return <>{children}</>;
}
