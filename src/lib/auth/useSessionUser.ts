// lib/auth/useSessionUser.ts
// 클라이언트 전용 훅으로 NextAuth의 session 정보를 Zustand store에 저장

"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
type SessionStatus = ReturnType<typeof useSession>['status']

export const useSessionUser = (
  session: Session | null,
  status: SessionStatus
) => {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (status === "authenticated" && session && session.user) {
      setUser({
        id: session.user.id,
        name: session.user.name ?? "게스트",
        role: session.user.role ?? "guest",
        permissions: session.user.permissions ?? []
      });
    }
  }, [status, session, setUser]);
};
