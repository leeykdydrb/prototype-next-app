import { useMemo } from 'react';
import type { MenuData, MenuStatsProps } from '@/types/menu';

export const useMenuStats = (menus: MenuData[]): MenuStatsProps => {
  return useMemo(() => {
    const total = menus.length;
    let active = 0;
    let systemCount = 0;
    
    for (const menu of menus) {
      if (menu.isActive) active++;
      if (menu.isSystem) systemCount++;
    }
    
    return {
      total,
      active,
      inactive: total - active,
      system: systemCount,
    };
  }, [menus]);
};