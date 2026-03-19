// lib/auth/RoleGuard.tsx
// 페이지 접근 권한 제어 컴포넌트
// - next-auth의 세션 정보를 기반으로 특정 role이 아닌 경우 접근 차단
// - 인증된 사용자 중 역할(role)이 일치하지 않으면 403 페이지로 리다이렉트

"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/common/Loading";

export default function RoleGuard({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== role) {
      router.replace("/403");
    }
  }, [status, session?.user?.role, role, router]);

  if (status === "loading") return <Loading message="로그인 상태를 확인하는 중입니다..." />;

  return <>{children}</>;
}
