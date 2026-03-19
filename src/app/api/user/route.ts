import { withPermissionGuard } from "@/lib/auth/withPermissionGuard";
import { ApiResponse } from "@/lib/api/apiResponse";
import type { UserData, UserInput } from "@/types/user";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { hashPassword, validatePassword } from "@/utils/passwordUtils";
import { 
  createKeycloakUser, 
  assignRealmRoleToUser,
  assignClientRolesToUser
} from "@/lib/keycloak-admin";

export const GET = withPermissionGuard('user.read', async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const roleId = searchParams.get('roleId');
  const isActive = searchParams.get('isActive');

  const where: {
    OR?: Array<{
      name?: { contains: string; mode: 'insensitive' };
      email?: { contains: string; mode: 'insensitive' };
    }>;
    roleId?: number;
    isActive?: boolean;
  } = {};

  // 검색 조건
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ];
  }

  // 역할 필터
  if (roleId && roleId !== 'all') {
    where.roleId = Number(roleId);
  }

  // 활성 상태 필터
  if (isActive !== null && isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  const users = await prisma.user.findMany({
    where,
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
    orderBy: { name: "asc" },
  });

  return ApiResponse.success<UserData[]>(users);
});

export const POST = withPermissionGuard('user.create', async (req) => {
  const { id, name, email, password, isActive,roleId, bio, permissionIds }: UserInput = await req.json();

  // 아이디 중복 체크
  const existingUserById = await prisma.user.findUnique({
    where: { id },
  });

  if (existingUserById) {
    return ApiResponse.error("이미 존재하는 아이디입니다.", 400);
  }

  // 이메일 중복 체크
  const existingUserByEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUserByEmail) {
    return ApiResponse.error("이미 존재하는 이메일입니다.", 400);
  }

  // 비밀번호가 없으면 에러 반환
  if (!password) {
    return ApiResponse.error("비밀번호는 필수입니다.", 400);
  }

  // 비밀번호 유효성 검증
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return ApiResponse.error(passwordValidation.message, 400);
  }

  // 비밀번호 암호화 (salt rounds: 10)
  const hashedPassword = await hashPassword(password, 10);

  // 사용자 생성
  const newUser = await prisma.user.create({
    data: {
      id,
      name,
      email,
      password: hashedPassword, // 암호화된 비밀번호 저장
      roleId,
      isActive: isActive,
      profile: bio ? {
        create: { bio }
      } : undefined,
      userPermissions: {
        create: (permissionIds || []).map((permissionId) => ({
          permissionId,
          granted: true,
        })),
      },
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

  // Keycloak 자동 동기화 (활성화된 사용자만)
  if (newUser.isActive) {
    try {
      // 1. Keycloak에 사용자 생성
      await createKeycloakUser(
        newUser.id,
        newUser.email,
        newUser.name,
        password, // 원본 비밀번호 사용 (Keycloak이 자체적으로 암호화)
        newUser.isActive
      );

      // 2. 역할 할당
      if (newUser.role && newUser.role.name) {
        await assignRealmRoleToUser(newUser.id, newUser.role.name);
      }

      // 3. 사용자에게 직접 할당된 권한들 동기화
      if (newUser.userPermissions && newUser.userPermissions.length > 0) {
        const permissionNames = newUser.userPermissions
          .map((up) => up.permission.name)
          .filter((name) => name);
        
        if (permissionNames.length > 0) {
          await assignClientRolesToUser(newUser.id, permissionNames);
        }
      }
    } catch (syncError) {
      // 동기화 실패 시 로그 기록 (DB 저장은 성공했으므로 계속 진행)
      console.error(`[Keycloak 동기화 실패] 사용자 생성: ${newUser.id}`, syncError);
      // 필요시 관리자에게 알림 또는 재시도 큐에 추가 가능
    }
  }

  return ApiResponse.success<UserData>(newUser, "사용자가 성공적으로 등록되었습니다.");
});
