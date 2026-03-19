import { withPermissionGuard } from "@/lib/auth/withPermissionGuard";
import { ApiResponse } from "@/lib/api/apiResponse";
import type { UserData, UserInput } from "@/types/user";
import { prisma } from "@/lib/prisma";
import { hashPassword, validatePassword } from "@/utils/passwordUtils";
import { 
  updateKeycloakUser, 
  setKeycloakUserPassword,
  deleteKeycloakUser,
  assignRealmRoleToUser,
  removeRealmRoleFromUser,
  assignClientRolesToUser,
  removeClientRolesFromUser
} from "@/lib/keycloak-admin";

export const GET = withPermissionGuard('user.read', async (_req, { params }) => {
  const { id } = await params;
  
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      role: {
        select: {
          id: true,
          name: true,
          displayName: true,
        },
      },
      profile: {
        select: {
          id: true,
          bio: true,
        },
      },
      userPermissions: {
        include: {
          permission: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return ApiResponse.error("사용자 정보를 찾을 수 없습니다.", 404);
  }

  return ApiResponse.success<UserData>(user);
});

export const PUT = withPermissionGuard('user.update', async (req, { params }) => {
  const { id } = await params;
  const { name, email, password, isSystem, isActive, roleId, bio, permissionIds }: UserInput = await req.json();

  // 기존 사용자 정보 조회 (동기화를 위해)
  const oldUser = await prisma.user.findUnique({
    where: { id },
    include: {
      role: {
        select: {
          id: true,
          name: true,
          displayName: true,
        },
      },
      userPermissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  if (!oldUser) {
    return ApiResponse.error("사용자 정보를 찾을 수 없습니다.", 404);
  }

  // 이메일 중복 체크 (자신 제외)
  const existingUser = await prisma.user.findFirst({
    where: {
      email,
      id: { not: id },
    },
  });

  if (existingUser) {
    return ApiResponse.error("이미 존재하는 이메일입니다.", 400);
  }

  // 비밀번호가 있을 때 암호화
  let hashedPassword: string | undefined;
  if (password) {
    // 비밀번호 유효성 검증
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return ApiResponse.error(passwordValidation.message, 400);
    }
    
    hashedPassword = await hashPassword(password, 10);
  }

  // 사용자 정보 업데이트
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      // ...(password && { password }), // 비밀번호가 있을 때만 업데이트
      ...(hashedPassword && { password: hashedPassword }), // 암호화된 비밀번호로 업데이트
      isSystem,
      isActive,
      roleId,
      profile: bio ? {
        upsert: {
          create: { bio },
          update: { bio },
        },
      } : undefined,
      ...(permissionIds !== undefined && {
        userPermissions: {
          deleteMany: {}, // 기존 권한 모두 삭제
          create: permissionIds.map((permissionId: number) => ({
            permissionId,
            granted: true,
          })),
        },
      }),
    },
    include: {
      role: {
        select: {
          id: true,
          name: true,
          displayName: true,
        },
      },
      profile: {
        select: {
          id: true,
          bio: true,
        },
      },
      userPermissions: {
        include: {
          permission: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  // Keycloak 자동 동기화
  try {
    const oldIsActive = oldUser.isActive;
    const newIsActive = updatedUser.isActive;
    const oldRoleName = oldUser.role?.name;
    const newRoleName = updatedUser.role?.name;

    // 활성화 상태에 따른 처리
    if (newIsActive) {
      // 활성화: Keycloak에 사용자 정보 업데이트
      await updateKeycloakUser(
        updatedUser.id,
        updatedUser.email,
        updatedUser.name,
        updatedUser.isActive
      );

      // 비밀번호 변경 시 Keycloak 비밀번호 업데이트
      // 단, bcrypt 해시 형식이 아닌 원본 비밀번호인 경우에만 업데이트
      if (password && !password.startsWith('$2')) {
        // $2a$, $2b$, $2y$ 등으로 시작하면 bcrypt 해시
        await setKeycloakUserPassword(updatedUser.id, password, false);
      }

      // 역할 변경 처리
      if (oldRoleName !== newRoleName) {
        // 기존 역할 제거
        if (oldRoleName) {
          try {
            await removeRealmRoleFromUser(updatedUser.id, oldRoleName);
          } catch (error) {
            console.warn(`[Keycloak] 기존 역할 제거 실패 (무시): ${oldRoleName}`, error);
          }
        }
        
        // 새 역할 할당
        if (newRoleName) {
          await assignRealmRoleToUser(updatedUser.id, newRoleName);
        }
      }

      // 사용자 권한 변경 처리
      if (permissionIds !== undefined) {
        const oldPermissionNames = oldUser.userPermissions
          .map((up) => up.permission.name)
          .filter((name) => name);
        
        const newPermissionNames = updatedUser.userPermissions
          .map((up) => up.permission.name)
          .filter((name) => name);

        // 추가할 권한과 제거할 권한 계산
        const permissionsToAdd = newPermissionNames.filter(
          (name) => !oldPermissionNames.includes(name)
        );
        const permissionsToRemove = oldPermissionNames.filter(
          (name) => !newPermissionNames.includes(name)
        );

        // 권한 할당/제거
        if (permissionsToAdd.length > 0) {
          await assignClientRolesToUser(updatedUser.id, permissionsToAdd);
        }
        if (permissionsToRemove.length > 0) {
          await removeClientRolesFromUser(updatedUser.id, permissionsToRemove);
        }
      }
    } else if (oldIsActive && !newIsActive) {
      // 비활성화: Keycloak에서 사용자 비활성화
      await updateKeycloakUser(
        updatedUser.id,
        updatedUser.email,
        updatedUser.name,
        false // enabled = false
      );
    } else if (!oldIsActive && newIsActive) {
      // 재활성화: Keycloak에서 사용자 활성화
      await updateKeycloakUser(
        updatedUser.id,
        updatedUser.email,
        updatedUser.name,
        true // enabled = true
      );

      // 역할 할당
      if (newRoleName) {
        await assignRealmRoleToUser(updatedUser.id, newRoleName);
      }

      // 사용자 권한 재할당
      if (updatedUser.userPermissions && updatedUser.userPermissions.length > 0) {
        const permissionNames = updatedUser.userPermissions
          .map((up) => up.permission.name)
          .filter((name) => name);
        
        if (permissionNames.length > 0) {
          await assignClientRolesToUser(updatedUser.id, permissionNames);
        }
      }
    }
  } catch (syncError) {
    console.error(`[Keycloak 동기화 실패] 사용자 수정: ${updatedUser.id}`, syncError);
  }

  return ApiResponse.success<UserData>(updatedUser, "사용자 정보가 성공적으로 수정되었습니다.");
});

export const DELETE = withPermissionGuard('user.delete', async (_req, { params }) => {
  const { id } = await params;

  try {
    // 삭제할 사용자 조회
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
      },
    });

    if (!user) {
      return ApiResponse.error("존재하지 않는 사용자입니다.", 404);
    }

    // 시스템 계정 보호
    if (user.isSystem) {
      return ApiResponse.error("시스템 계정은 삭제할 수 없습니다.", 403);
    }

    // Keycloak에서 사용자 삭제
    try {
      await deleteKeycloakUser(user.id);
    } catch (syncError) {
      console.error(`[Keycloak 동기화 실패] 사용자 삭제: ${user.id}`, syncError);
    }

    // 사용자 삭제 (프로필과 권한은 cascade로 자동 삭제)
    await prisma.user.delete({
      where: { id },
    });

    return ApiResponse.success("사용자가 성공적으로 삭제되었습니다.");
  } catch (error) {
    console.error('사용자 삭제 중 오류 발생:', error);
    return ApiResponse.error("사용자 삭제 중 오류가 발생했습니다.", 500);
  }
});
