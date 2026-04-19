import { withPermissionGuard } from "@/lib/auth/withPermissionGuard";
import { ApiResponse } from "@/lib/api/apiResponse";
import type { MenuData } from "@/types/menu";
import { prisma } from "@/lib/prisma";

export const PUT = withPermissionGuard('menu.update', async (req, { params }) => {
  const { id } = await params;
  const body = await req.json();
  const { title, titleKey, path, icon, order, parentId, isActive, isSystem, permissionIds } = body;

  const updatedMenu = await prisma.$transaction(async (tx) => {
    return await tx.menu.update({
      where: { id: Number(id) },
      data: {
        title,
        titleKey,
        path,
        icon,
        order,
        parentId,
        isActive,
        isSystem,
        ...(permissionIds !== undefined && {
          menuPermissions: {
            deleteMany: {},
            create: permissionIds.map((permissionId: number) => ({
              permissionId,
            })),
          },
        }),
      },
      include: {
        menuPermissions: {
          select: {
            permissionId: true,
          },
        },
      },
    });
  });

  const result: MenuData = {
    ...updatedMenu,
    permissionIds: updatedMenu.menuPermissions.map((mp) => mp.permissionId),
  };

  return ApiResponse.success<MenuData>(result, "메뉴 정보 수정 완료");
});

export const DELETE = withPermissionGuard('menu.delete', async (_req, { params }) => {
  const { id } = await params;

  const menu = await prisma.menu.findUnique({
    where: { id: Number(id) },
    include: {
      children: true,
    },
  });

  if (menu?.isSystem) {
    return ApiResponse.error("시스템 메뉴는 삭제할 수 없습니다.", 400);
  }

  if (menu && menu.children.length > 0) {
    return ApiResponse.error("하위 메뉴가 있는 메뉴는 삭제할 수 없습니다.", 400);
  }

  await prisma.menu.delete({
    where: { id: Number(id) },
  });

  return ApiResponse.success("메뉴 정보 삭제 완료");
});