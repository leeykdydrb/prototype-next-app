// app/(protected)/layout.tsx
// 인증 보호 페이지 그룹
// - SessionGuard: 로그인 상태 확인 및 세션 저장
// - AppLayout: 메인화면 기본 레이아웃 (Header, Sidebar)

import SessionGuard from "@/lib/auth/SessionGuard";
import AppLayout from '@/components/layout/AppLayout'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionGuard>
      <AppLayout>{children}</AppLayout>
    </SessionGuard>
  );
}
