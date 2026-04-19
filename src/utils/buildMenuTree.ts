import type { MenuData, MenuTree } from "@/types/menu";

// 트리 변환 함수
export const buildMenuTree = (flatMenus: MenuData[]): MenuTree[] => {
  const menuMap: Record<number, MenuTree & { children: MenuTree[] }> = {};
  const roots: MenuTree[] = [];

  // 1차로 아이콘 변환 & map에 저장
  flatMenus.forEach((menu) => {
    menuMap[menu.id] = {
      id: menu.id,
      title: menu.title,
      titleKey: menu.titleKey,
      path: menu.path,
      icon: menu.icon,
      order: menu.order,
      parentId: menu.parentId,
      isActive: menu.isActive,
      isSystem: menu.isSystem,
      permissionIds: menu.permissionIds,
      children: [],
    };
  });

  // 2차로 parentId에 따라 트리 구성
  flatMenus.forEach((menu) => {
    if (menu.parentId) {
      menuMap[menu.parentId].children!.push(menuMap[menu.id]);
    } else {
      roots.push(menuMap[menu.id]);
    }
  });

  return roots;
}
