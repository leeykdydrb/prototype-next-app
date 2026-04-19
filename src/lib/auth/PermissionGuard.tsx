'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { useMenuStore } from '@/store/menuStore';

interface PermissionGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function PermissionGuard({ 
  children, 
  redirectTo = '/403'
}: PermissionGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const { menus, hasPermissionForPath } = useMenuStore();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    // 메뉴나 경로가 없으면 대기
    if (!menus.length || !pathname) {
      setHasPermission(null);
      return;
    }

    // 사용자가 없으면 로그인 페이지로 리다이렉트
    if (!user) {
      const callbackUrl = encodeURIComponent(window.location.href);
      window.location.assign(
        `/api/auth/signin/keycloak?callbackUrl=${callbackUrl}`
      );
      return;
    }

    // Keycloak 토큰에서 추출한 권한 사용
    const userPermissions = user?.permissions || [];

    // 권한이 하나도 없으면 접근 거부
    if (userPermissions.length === 0) {
      setHasPermission(false);
      router.push(redirectTo);
      return;
    }

    // 현재 경로에 대한 권한 체크
    const permissionResult = hasPermissionForPath(pathname, userPermissions);
    setHasPermission(permissionResult);
      
    if (!permissionResult) {
      router.push(redirectTo);
    }
  }, [menus, user, pathname, hasPermissionForPath, redirectTo, router]);

  if (hasPermission === null || hasPermission === false) {
    return null;
  }

  return <>{children}</>;
}