// store/menuStore.ts
// 메뉴 전역 상태 저장소 (Zustand 기반)

import { create } from "zustand";
import type { MenuData } from '@/types/menu';

interface MenuStore {
  menus: MenuData[];
  setMenus: (menus: MenuData[]) => void;
  getMenuByPath: (path: string) => MenuData | null;
  hasPermissionForPath: (path: string, userPermissions: string[]) => boolean;
}

export const useMenuStore = create<MenuStore>((set, get) => ({
  menus: [],
  
  setMenus: (menus) => set({ menus }),
  
  // 경로로 메뉴 찾기
  getMenuByPath: (path) => {
    const { menus } = get();
    return menus.find(m => m.path === path) ?? null;
  },
  
  // 특정 경로에 대한 권한 체크
  // Keycloak 토큰의 permissions를 사용 (예: "user.read", "equipment.create")
  hasPermissionForPath: (path, userPermissions) => {
    const { getMenuByPath } = get();
    const menu = getMenuByPath(path);
    
    if (!menu) return false;
    
    // 권한이 설정되지 않은 메뉴는 접근 허용
    if (!menu.permissionNames || menu.permissionNames.length === 0) {
      return true;
    }
    
    // 사용자 권한이 없으면 접근 거부
    if (!userPermissions || userPermissions.length === 0) {
      return false;
    }
    
    // 메뉴에 필요한 권한 중 하나라도 있으면 접근 허용
    return menu.permissionNames.some(permissionName => 
      userPermissions.includes(permissionName)
    );
  },
}));