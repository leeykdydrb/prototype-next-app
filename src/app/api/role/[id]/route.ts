import { withPermissionGuard } from "@/lib/auth/withPermissionGuard";
import { ApiResponse } from "@/lib/api/apiResponse";
import type { RoleData } from "@/types/role";
import { prisma } from "@/lib/prisma";
import {
  syncRealmRole,
  assignClientRolesToRealmRole,
  removeClientRolesFromRealmRole,
  getRealmRoleClientRoles,
  deleteRealmRole,
} from "@/lib/keycloak-admin";

export const PUT = withPermissionGuard('role.update', async (req, { params }) => {
  const { id } = await params;
  const body = await req.json();
  const { name, displayName, description, isSystem, isActive, permissionIds } = body;

  // 기존 역할 정보 조회 (동기화를 위해)
  const existingRole = await prisma.role.findUnique({
    where: { id: Number(id) },
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  if (!existingRole) {
    return ApiResponse.error("역할 정보를 찾을 수 없습니다.", 404);
  }

  const updatedRole = await prisma.role.update({
    where: { id: Number(id) },
    data: {
      name,
      displayName,
      description,
      isSystem,
      isActive,
      ...(permissionIds !== undefined && {
        rolePermissions: {
          deleteMany: {}, // 기존 권한 모두 삭제
          create: permissionIds.map((permissionId: number) => ({
            permissionId,
          })),
        },
      }),
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

  // Keycloak 자동 동기화
  try {
    const roleName = updatedRole.name;
    const oldRoleName = existingRole.name;
    const oldIsActive = existingRole.isActive;
    const newIsActive = updatedRole.isActive;
    const nameChanged = oldRoleName !== roleName;

    // 역할명이 변경된 경우: 기존 Role 삭제
    if (nameChanged && oldIsActive) {
      try {
        await deleteRealmRole(oldRoleName);
      } catch (error) {
        console.warn(`[Keycloak] 기존 역할명의 Role 삭제 실패 (무시): ${oldRoleName}`, error);
      }
    }

    // 활성화 상태에 따른 처리
    if (newIsActive) {
      // 활성화: Keycloak에 Realm Role 생성/업데이트
      const description = updatedRole.displayName || updatedRole.description || "";
      await syncRealmRole(roleName, description);

      // 권한 목록 추출
      const permissionNames = updatedRole.rolePermissions
        .map((rp) => rp.permission.name)
        .filter((name) => name);

      // 현재 Keycloak에 할당된 Client Role 조회
      const currentClientRoles = await getRealmRoleClientRoles(roleName);

      // 추가할 권한과 제거할 권한 계산
      const rolesToAdd = permissionNames.filter((name) => !currentClientRoles.includes(name));
      const rolesToRemove = currentClientRoles.filter((name) => !permissionNames.includes(name));

      // Client Role 할당/제거
      if (rolesToAdd.length > 0) {
        await assignClientRolesToRealmRole(roleName, rolesToAdd);
      }
      if (rolesToRemove.length > 0) {
        await removeClientRolesFromRealmRole(roleName, rolesToRemove);
      }
    } else if (oldIsActive && !newIsActive) {
      // 비활성화: Keycloak에서 Realm Role 삭제
      // (역할명이 변경되지 않은 경우에만 삭제, 변경된 경우는 이미 위에서 삭제됨)
      if (!nameChanged) {
        await deleteRealmRole(roleName);
      }
    }
  } catch (syncError) {
    console.error(`[Keycloak 동기화 실패] 역할 수정: ${updatedRole.name}`, syncError);
  }

  return ApiResponse.success<RoleData>(updatedRole, "역할 정보 수정 완료");
});

export const DELETE = withPermissionGuard('role.delete', async (_req, { params }) => {
  const { id } = await params;

  const role = await prisma.role.findUnique({
    where: { id: Number(id) },
    include: { 
      _count: {
        select: { users: true },
      },
    },
  });

  if (!role) {
    return ApiResponse.error("역할 정보를 찾을 수 없습니다.", 404);
  }

  if (role.isSystem) {
    return ApiResponse.error("시스템 역할은 삭제할 수 없습니다.", 400);
  }

  if (role._count.users > 0) {
    return ApiResponse.error("이 역할이 할당된 사용자가 있어 삭제할 수 없습니다.", 400);
  }

  // Keycloak에서 Realm Role 삭제
  try {
    await deleteRealmRole(role.name);
  } catch (syncError) {
    console.error(`[Keycloak 동기화 실패] 역할 삭제: ${role.name}`, syncError);
  }

  await prisma.role.delete({
    where: { id: Number(id) },
  });

  return ApiResponse.success("역할 정보 삭제 완료");
});