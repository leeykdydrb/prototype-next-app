import { useMemo } from 'react';
import type { PermissionData, PermissionStatsProps } from '@/types/permission';

export const usePermissionStats = (permissions: PermissionData[]): PermissionStatsProps => {
  return useMemo(() => {
    const total = permissions.length;
    let active = 0;
    let systemCount = 0;
    
    for (const permission of permissions) {
      if (permission.isActive) active++;
      if (permission.isSystem) systemCount++;
    }
    
    return {
      total,
      active,
      inactive: total - active,
      system: systemCount,
    };
  }, [permissions]);
};