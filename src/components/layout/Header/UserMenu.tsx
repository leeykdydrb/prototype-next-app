'use client'

import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/framework/dropdown'
import { LogOut } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useUserStore } from "@/store/userStore";

export default function UserMenu({ children }: { children: React.ReactNode }) {
  const user = useUserStore((state) => state.user);
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      const keycloakIssuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER || "http://localhost:8080/realms/nextcube";
      const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "nextjs-app";
      const postLogoutRedirectUri = window.location.origin;
      const idToken = session?.idToken;

      // idToken이 없으면 API Route를 통해 세션 삭제
      if (!idToken) {
        window.location.href = '/api/auth/logout/callback';
        return;
      }

      // Keycloak 로그아웃 URL 생성
      // post_logout_redirect_uri를 API Route로 설정하여 Keycloak 로그아웃 후 서버 사이드에서 SignOut 처리
      const logoutParams = new URLSearchParams();
      logoutParams.set("client_id", clientId);
      logoutParams.set("post_logout_redirect_uri", `${postLogoutRedirectUri}/api/auth/logout/callback`);
      logoutParams.set("id_token_hint", idToken);

      const logoutUrl = `${keycloakIssuer}/protocol/openid-connect/logout?${logoutParams.toString()}`;
      
      window.location.href = logoutUrl;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error('로그아웃 오류:', error);
      }
      // 오류 발생 시에도 API Route를 통해 세션 삭제
      window.location.href = '/api/auth/logout/callback';
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className='py-0'>{user?.name || '사용자'}</DropdownMenuItem>
        <DropdownMenuItem className='py-0'>{user?.id || ''}</DropdownMenuItem>
        <DropdownMenuItem className='py-0'>{user?.role || ''}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}