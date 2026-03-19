// hooks/user/useUserStats.ts
// 사용자 통계 정보 계산 훅

import { useMemo } from 'react';
import type { UserData, UserStatsProps } from '@/types/user';

export const useUserStats = (users: UserData[]): UserStatsProps => {
  return useMemo(() => {
    const total = users.length;
    let active = 0;
    let system = 0;

    for (const user of users) {
      if (user.isActive) active++;
      if (user.isSystem) system++;
    }

    return {
      total,
      active,
      inactive: total - active,
      system,
    };
  }, [users]);
};
