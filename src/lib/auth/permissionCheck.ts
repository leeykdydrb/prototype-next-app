// src/lib/auth/permissionCheck.ts
// 권한 체크를 위한 공통 유틸 함수
// - 유저의 유효한 권한 목록 조회
// - 권한 체크 로직

import { prisma } from "@/lib/prisma";

/**
 * 유저의 유효한 권한 목록을 조회
 * - rolePermissions + userPermissions (granted) - userPermissions (blocked)
 */
export const getUserEffectivePermissions = async (userId: string): Promise<string[]> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: {
        include: {
          rolePermissions: { include: { permission: true } },
        }
      },
      userPermissions: { include: { permission: true } },
    },
  });

  if (!user) return [];

  const grantedPerms = user.userPermissions
    .filter(up => up.granted)
    .map(up => up.permission.name);
  const blockedPerms = user.userPermissions
    .filter(up => !up.granted)
    .map(up => up.permission.name);
  const rolePerms = user.role.rolePermissions.map(rp => rp.permission.name);

  return [
    ...new Set([...rolePerms, ...grantedPerms]),
  ].filter(name => !blockedPerms.includes(name));
};
