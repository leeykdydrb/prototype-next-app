// components/ToastProvider.tsx
// 앱 전역에서 사용되는 클라이언트 Provider 구성 컴포넌트
// - SessionProvider: next-auth 세션 제공
// - QueryClientProvider: TanStack Query 설정 (캐시, 에러 핸들링 포함)

"use client"

import { useState } from "react"
import { SessionProvider, signOut } from "next-auth/react"
import type { Session } from "next-auth";

import { QueryClient, QueryClientProvider, QueryCache } from "@tanstack/react-query"
import { showError } from "@/lib/toast";
import { ApiError } from '@/lib/api/ApiError';
import { toast } from "react-toastify";

export default function ClientProviders({ children, session }: { children: React.ReactNode, session: Session | null }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // 창 포커스 시 재요청 방지
        retry: false, // 실패 시 재시도 비활성화
      },
    },
    queryCache: new QueryCache({
      onError: (error: Error) => {
        if (!(error instanceof ApiError)) {
          showError('알 수 없는 에러가 발생했습니다.');
          return;
        }

        if (error.status === 401) {
          toast.error(error.message, {
            onClose: () => signOut({ redirect: true }),
            autoClose: 3000,
          });
          return;
        }

        showError(error.message);
      },
    }),
  }));

  console.log('ClientProviders');

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  )
}