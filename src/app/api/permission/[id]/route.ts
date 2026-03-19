import { withAuthGuard } from "@/lib/auth/withAuthGuard";
import { withPermissionGuard } from "@/lib/auth/withPermissionGuard";
import { ApiResponse } from "@/lib/api/apiResponse";
import type { PermissionData, PermissionInput } from "@/types/permission";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { syncClientRole, deleteClientRole } from "@/lib/keycloak-admin";

type HandlerContext = {
  params: Promise<Record<string, string>>;
};

export const GET = withAuthGuard(async (_req, context: HandlerContext) => {
  try {
    const params = await context.params;
    const permissionId = parseInt(params.id);

    if (isNaN(permissionId)) {
      return ApiResponse.error("유효하지 않은 권한 ID입니다.", 400);
    }

    const permission = await prisma.permission.findUnique({
      where: { id: permissionId },
      include: {
        category: {
          include: { group: true }
        },
        rolePermissions: {
          include: {
            role: {
              select: { id: true, name: true, displayName: true }
            }
          }
        },
        userPermissions: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        menuPermissions: {
          include: {
            menu: {
              select: { id: true, title: true, path: true }
            }
          }
        }
      }
    });

    if (!permission) {
      return ApiResponse.error("권한을 찾을 수 없습니다.", 404);
    }

    return ApiResponse.success<PermissionData>(permission);
  } catch (error) {
    console.error('Permission fetch error:', error);
    return ApiResponse.error("권한 조회 중 오류가 발생했습니다.", 500);
  }
});

export const PUT = withPermissionGuard('permission.update', async (req: NextRequest, context: HandlerContext) => {
  try {
    const params = await context.params;
    const permissionId = parseInt(params.id);

    if (isNaN(permissionId)) {
      return ApiResponse.error("유효하지 않은 권한 ID입니다.", 400);
    }

    const existingPermission = await prisma.permission.findUnique({
      where: { id: permissionId }
    });

    if (!existingPermission) {
      return ApiResponse.error("권한을 찾을 수 없습니다.", 404);
    }

    const body: PermissionInput = await req.json();

    // 권한명 중복 체크 (자신 제외)
    if (body.name !== existingPermission.name) {
      const duplicatePermission = await prisma.permission.findUnique({
        where: { name: body.name }
      });

      if (duplicatePermission) {
        return ApiResponse.error("이미 존재하는 권한명입니다.", 400);
      }
    }

    // 권한명 형식 검증 (영문, 숫자, 점만 허용)
    const namePattern = /^[a-zA-Z0-9.]+$/;
    if (!namePattern.test(body.name)) {
      return ApiResponse.error("권한명은 영문, 숫자, 점(.)만 사용 가능합니다.", 400);
    }

    const updatedPermission = await prisma.permission.update({
      where: { id: permissionId },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.displayName && { displayName: body.displayName }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        updatedAt: new Date()
      },
      // include: { category: true }
      // data: body,
      include: {
        category: {
          include: { group: true }
        }
      }
    });

    // Keycloak 자동 동기화
    try {
      const permissionName = updatedPermission.name;
      const oldPermissionName = existingPermission.name;
      const oldIsActive = existingPermission.isActive;
      const newIsActive = updatedPermission.isActive;
      const nameChanged = oldPermissionName !== permissionName;

      // 권한명이 변경된 경우: 기존 Role 삭제
      if (nameChanged && oldIsActive) {
        try {
          await deleteClientRole(oldPermissionName);
        } catch (error) {
          console.warn(`[Keycloak] 기존 권한명의 Role 삭제 실패 (무시): ${oldPermissionName}`, error);
        }
      }

      // 활성화 상태에 따른 처리
      if (newIsActive) {
        // 활성화: Keycloak에 Client Role 생성/업데이트
        const description = updatedPermission.displayName || updatedPermission.description || "";
        await syncClientRole(permissionName, description);
      } else if (oldIsActive && !newIsActive) {
        // 비활성화: Keycloak에서 Client Role 삭제
        // (권한명이 변경되지 않은 경우에만 삭제, 변경된 경우는 이미 위에서 삭제됨)
        if (!nameChanged) {
          await deleteClientRole(permissionName);
        }
      }
    } catch (syncError) {
      console.error(`[Keycloak 동기화 실패] 권한 수정: ${updatedPermission.name}`, syncError);
      // 필요시 관리자에게 알림 또는 재시도 큐에 추가 가능
    }

    return ApiResponse.success<PermissionData>(updatedPermission, "권한이 성공적으로 수정되었습니다.");
  } catch (error) {
    console.error('Permission update error:', error);
    return ApiResponse.error("권한 수정 중 오류가 발생했습니다.", 500);
  }
});

export const DELETE = withPermissionGuard('permission.delete', async (_req, context: HandlerContext) => {
  try {
    const params = await context.params;
    const id = params.id;
    const permissionId = parseInt(id);

    if (isNaN(permissionId)) {
      return ApiResponse.error("유효하지 않은 권한 ID입니다.", 400);
    }

    const existingPermission = await prisma.permission.findUnique({
      where: { id: permissionId }
    });

    if (!existingPermission) {
      return ApiResponse.error("권한을 찾을 수 없습니다.", 404);
    }

    // 시스템 권한은 삭제 불가
    if (existingPermission.isSystem) {
      return ApiResponse.error("시스템 권한은 삭제할 수 없습니다.", 400);
    }

    // 연관된 관계 확인
    const [rolePermissionCount, userPermissionCount] = await Promise.all([
      prisma.rolePermission.count({ where: { permissionId } }),
      prisma.userPermission.count({ where: { permissionId } })
    ]);

    if (rolePermissionCount > 0 || userPermissionCount > 0) {
      return ApiResponse.error("사용 중인 권한은 삭제할 수 없습니다.", 400);
    }

    // Keycloak에서 Client Role 삭제
    try {
      await deleteClientRole(existingPermission.name);
    } catch (syncError) {
      // 동기화 실패 시 로그 기록 (DB 삭제는 계속 진행)
      console.error(`[Keycloak 동기화 실패] 권한 삭제: ${existingPermission.name}`, syncError);
    }

    // 권한 삭제
    await prisma.permission.delete({
      where: { id: permissionId }
    });

    return ApiResponse.success(null, "권한이 성공적으로 삭제되었습니다.");
  } catch (error) {
    console.error('Permission delete error:', error);
    return ApiResponse.error("권한 삭제 중 오류가 발생했습니다.", 500);
  }
});
