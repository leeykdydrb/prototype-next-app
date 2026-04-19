import { withAuthGuard } from "@/lib/auth/withAuthGuard";
import { withPermissionGuard } from "@/lib/auth/withPermissionGuard";
import { ApiResponse } from "@/lib/api/apiResponse";
import type { MenuData } from "@/types/menu";
import { prisma } from "@/lib/prisma";

export const GET = withAuthGuard(async (req) => {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const isActive = searchParams.get('isActive');
  // Keycloak 토큰에서 권한 정보 가져오기
  const userPermissions = req.auth.user?.permissions || [];

  // 메뉴 관리 권한 체크
  const hasMenuManagePermission = userPermissions.includes('menu.update');

  const where: {
    OR?: Array<{
      title?: { contains: string; mode: 'insensitive' };
      path?: { contains: string; mode: 'insensitive' };
    }>;
    isActive?: boolean;
  } = {};

  // 검색 조건
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { path: { contains: search, mode: 'insensitive' } },
    ];
  }

  // 활성 상태 필터
  if (isActive !== null && isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  // 5. Permission이 연결된 메뉴만 조회
  const menus = await prisma.menu.findMany({
    where: {
      ...(hasMenuManagePermission ? {} : { isActive: true }),
      ...where,
      menuPermissions: {
        some: {
          permission: {
            name: { in: userPermissions },
          },
        },
      },
    },
    include: {
      menuPermissions: {
        include: {
          permission: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: { order: "asc" },
  });

  // parentId 목록 추출 (null/undefined 제외, 중복 제거)
  const parentIds = Array.from(
    new Set(menus.map((m) => m.parentId).filter((id) => id != null))
  );

  // parentId에 해당하는 부모 메뉴 데이터 조회 (isActive: true)
  let parentMenus: typeof menus = [];
  if (parentIds.length > 0) {
    parentMenus = await prisma.menu.findMany({
      where: {
        id: { in: parentIds },
        isActive: true,
        menuPermissions: {
          some: {
            permission: {
              name: { in: userPermissions },
            },
          },
        },
      },
      include: {
        menuPermissions: {
          include: {
            permission: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { order: "asc" },
    });
  }

  // 최종 결과 합치기
  const allMenus = [...menus, ...parentMenus];

  // const result: MenuData[] = allMenus.map((menu) => ({
  //   ...menu,
  //   permissionIds: menu.menuPermissions.map((mp) => mp.permissionId),
  // }));

  // (필요시 id 중복 제거)
  const result: MenuData[] = Array.from(
    new Map(
      allMenus.map((m) => [
        m.id,
        { 
          ...m, 
          permissionIds: m.menuPermissions.map((mp) => mp.permissionId),
          permissionNames: m.menuPermissions.map((mp) => mp.permission.name),
        },
      ])
    ).values()
  );

  return ApiResponse.success<MenuData[]>(result);
});

export const POST = withPermissionGuard('menu.create', async (req) => {
  const { title, titleKey, path, icon, parentId, order, isActive, permissionIds } = await req.json();

  const createMenu = await prisma.menu.create({
    data: {
      title,
      titleKey,
      path,
      icon,
      parentId,
      order: order || 1,
      isActive: isActive,
      isSystem: false,
      menuPermissions: {
        create: permissionIds.map((permissionId: number) => ({
          permissionId,
        })),
      },
    },
    include: {
      menuPermissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  const result: MenuData = {
    ...createMenu,
    permissionIds: createMenu.menuPermissions.map((mp) => mp.permissionId),
  };

  return ApiResponse.success<MenuData>(result, "메뉴가 성공적으로 등록되었습니다.");
});