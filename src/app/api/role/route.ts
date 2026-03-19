import { withAuthGuard } from "@/lib/auth/withAuthGuard";
import { withPermissionGuard } from "@/lib/auth/withPermissionGuard";
import { ApiResponse } from "@/lib/api/apiResponse";
import type { RoleData, RoleInput } from "@/types/role";
import { prisma } from "@/lib/prisma";
import {
  syncRealmRole,
  assignClientRolesToRealmRole,
} from "@/lib/keycloak-admin";

export const GET = withAuthGuard(async (req) => {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const isActive = searchParams.get('isActive');
  // Keycloak 토큰에서 권한 정보 가져오기
  const userPermissions = req.auth.user?.permissions || [];

  // 역할 관리 권한 체크
  const hasRoleManagePermission = userPermissions.includes('role.update');

  if (!hasRoleManagePermission) {
    return ApiResponse.error("권한이 없습니다.", 403);
  }

  // 5. Permission이 연결된 메뉴만 조회
//   const roles = await prisma.role.findMany({
//     where: {
//       ...(hasRoleManagePermission ? {} : { isActive: true }),
//       rolePermissions: {
//         some: {
//           permission: {
//             name: { in: effectivePermissions },
//           },
//         },
//       },
//     },
//     include: {
//       rolePermissions: {
//         select: {
//           permissionId: true,
//         },
//       },
//     },
//     orderBy: { order: "asc" },
//   });

  const where: {
    OR?: Array<{
      name?: { contains: string; mode: 'insensitive' };
      displayName?: { contains: string; mode: 'insensitive' };
      description?: { contains: string; mode: 'insensitive' };
    }>;
    isActive?: boolean;
  } = {};

  // 검색 조건
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { displayName: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  // 활성 상태 필터
  if (isActive !== null && isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  const roles = await prisma.role.findMany({
    where,
    include: {
      _count: {
        select: { users: true },
      },
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

//   const result: RoleData[] = roles.map((role) => ({
//     ...role,
//     permissionIds: role.rolePermissions.map((rp) => rp.permissionId),
//   }));

  return ApiResponse.success<RoleData[]>(roles);
});

export const POST = withPermissionGuard('role.create', async (req) => {
  const { name, displayName, description, isActive, permissionIds }: RoleInput = await req.json();

  const createRole = await prisma.role.create({
    data: {
      name,
      displayName,
      description,
      isActive: isActive,
      isSystem: false,
      rolePermissions: {
        create: permissionIds.map((permissionId: number) => ({
          permissionId,
        })),
      },
    },
    include: {
      _count: {
        select: { users: true },
      },
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  // Keycloak 자동 동기화 (활성화된 역할만)
  if (createRole.isActive) {
    try {
      const description = createRole.displayName || createRole.description || "";
      // Realm Role 생성/업데이트
      await syncRealmRole(createRole.name, description);

      // 권한 목록 추출
      const permissionNames = createRole.rolePermissions
        .map((rp) => rp.permission.name)
        .filter((name) => name);

      // Realm Role에 Client Role(권한) 할당
      if (permissionNames.length > 0) {
        await assignClientRolesToRealmRole(createRole.name, permissionNames);
      }
    } catch (syncError) {
      // 동기화 실패 시 로그 기록 (DB 저장은 성공했으므로 계속 진행)
      console.error(`[Keycloak 동기화 실패] 역할 생성: ${createRole.name}`, syncError);
      // 필요시 관리자에게 알림 또는 재시도 큐에 추가 가능
    }
  }

  return ApiResponse.success<RoleData>(createRole, "역할이 성공적으로 등록되었습니다.");
});