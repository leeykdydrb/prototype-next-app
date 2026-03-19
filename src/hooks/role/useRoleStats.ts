import { useMemo } from 'react';
import type { RoleData, RoleStatsProps } from '@/types/role';

export const useRoleStats = (roles: RoleData[]): RoleStatsProps => {
  return useMemo(() => {
    const total = roles.length;
    let active = 0;
    let systemCount = 0;
    
    for (const role of roles) {
      if (role.isActive) active++;
      if (role.isSystem) systemCount++;
    }
    
    return {
      total,
      active,
      inactive: total - active,
      system: systemCount,
    };
  }, [roles]);
};