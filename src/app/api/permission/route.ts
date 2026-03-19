import { withAuthGuard } from "@/lib/auth/withAuthGuard";
import { withPermissionGuard } from "@/lib/auth/withPermissionGuard";
import { ApiResponse } from "@/lib/api/apiResponse";
import type { PermissionData, PermissionInput } from "@/types/permission";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { syncClientRole } from "@/lib/keycloak-admin";

export const GET = withAuthGuard(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const categoryId = searchParams.get('categoryId');
  const isActive = searchParams.get('isActive');

  const where: {
    OR?: Array<{
      name?: { contains: string; mode: 'insensitive' };
      displayName?: { contains: string; mode: 'insensitive' };
      description?: { contains: string; mode: 'insensitive' };
    }>;
    categoryId?: number;
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

  // 카테고리 필터
  if (categoryId && categoryId !== 'all') {
    where.categoryId = Number(categoryId);
  }

  // 활성 상태 필터
  if (isActive !== null && isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  const permissions = await prisma.permission.findMany({
    where,
    orderBy: [{ categoryId: "asc" }, { displayName: "asc" }],
    include: {
      category: {
        include: { group: true }
      },
    },
  });

  return ApiResponse.success<PermissionData[]>(permissions);
});

export const POST = withPermissionGuard('permission.create', async (req) => {
  try {
    const body: PermissionInput = await req.json();

    // 유효성 검사
    if (!body.name || !body.displayName) {
      return ApiResponse.error("권한명과 표시명은 필수입니다.", 400);
    }

    // 권한명 중복 체크
    const existingPermission = await prisma.permission.findUnique({
      where: { name: body.name }
    });

    if (existingPermission) {
      return ApiResponse.error("이미 존재하는 권한명입니다.", 400);
    }

    // 권한명 형식 검증 (영문, 숫자, 점만 허용)
    const namePattern = /^[a-zA-Z0-9.]+$/;
    if (!namePattern.test(body.name)) {
      return ApiResponse.error("권한명은 영문, 숫자, 점(.)만 사용 가능합니다.", 400);
    }

    const newPermission = await prisma.permission.create({
      data: body,
      include: {
        category: {
          include: { group: true },
        },
      },
    });

    // Keycloak 자동 동기화 (활성화된 권한만)
    if (newPermission.isActive) {
      try {
        await syncClientRole(newPermission.name, newPermission.displayName || "");
      } catch (syncError) {
        console.error(`[Keycloak 동기화 실패] 권한 생성: ${newPermission.name}`, syncError);
        // 필요시 관리자에게 알림 또는 재시도 큐에 추가 가능
      }
    }

    return ApiResponse.success<PermissionData>(newPermission, "권한이 성공적으로 생성되었습니다.");
  } catch (error) {
    console.error('Permission creation error:', error);
    return ApiResponse.error("권한 생성 중 오류가 발생했습니다.", 500);
  }
});